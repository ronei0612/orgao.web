class tracker {
  constructor(audioContext, scheduleAudioBeat) {
    this.measureLength = 16;
    this.scheduleAudioBeat = scheduleAudioBeat;
    this.scheduleForward = 0.1;
    this.current = 0;
    this.eventMap = {};
    this.clock = new WAAClock(audioContext);
    this.clock.start();
    this.running = false;

    this.drawTracker = function (numRows, numCols, data) {
      let htmlTable = new trackerTable();
      htmlTable.setRows(numRows, numCols, data);
      let str = htmlTable.getTable();
      let t = document.getElementById('tracker-parent');
      t.innerHTML = '';
      t.insertAdjacentHTML('afterbegin', str);
    };

    this.next = function () {
      this.current++;
      if (this.current >= this.measureLength) {
        this.current = 0;
      }
    };

    this.milliPerBeat = function (beats) {
      if (!beats) {
        beats = 60;
      }
      return 1000 * 60 / beats;
    };

    this.getTrackerRowValues = function (colId) {
      let values = [];
      let selector = `[data-col-id="${colId}"]`;
      let elems = document.querySelectorAll(selector);
      elems.forEach((el) => {
        let val = Object.assign({}, el.dataset);
        val.enabled = el.classList.contains('tracker-enabled');
        values.push(val);
      });
      return values;
    };

    function playSolo(colId) {
      if (colId !== _colId && _notasSolo) {
        if (_notasSolo[_notasSoloIndex] !== '') {
          if (_somSolo)
            _somSolo.stop();

          _somSolo = acordes['epiano_' + _notasSolo[_notasSoloIndex].replace('0', '_baixo').replace('-1', '_grave')];
          _somSolo.play();
        }
        if (_notasSoloIndex === _notasSolo.length - 1) {
          if (_somSolo)
            _somSolo.stop();

          _somSolo = null;
          _notasSolo = null;
          _notasSoloIndex = 0;
        }

        else
          _notasSoloIndex++;
      }
      _colId = colId;
    }

    this.schedule = function () {
      let beatColumn = this.getTrackerRowValues(this.current);
      let now = audioContext.currentTime;
      beatColumn.forEach((beat) => {
        this.scheduleBeat(beat, now);
      });
    };

    this.scheduleBeat = function (beat, now) {
      let triggerTime = now + this.scheduleForward;
      this.scheduleMap[beat.colId] = triggerTime;

      playSolo(beat.colId);

      if (beat.enabled) {
        // ... (Implementation for scheduling beat playback)
        this.eventMap[this.getEventKey(beat)] = this.clock.callbackAtTime(
          () => {
            this.scheduleAudioBeat(beat.rowId, triggerTime);
          },
          now
        );
      }
    };

    this.scheduleMap = {};

    this.scheduleAudioBeatNow = function (beat) {
      if (beat.enabled) {
        let beatEvent = this.eventMap[this.getEventKey(beat)];
        if (beatEvent) {
          beatEvent.clear();
          delete this.eventMap[this.getEventKey(beat)];
        }
        return;
      }

      let triggerTime = this.scheduleMap[0] +
        (beat.colId * this.milliPerBeat(this.bpm)) / 1000;
      let now = audioContext.currentTime;
      this.eventMap[this.getEventKey(beat)] = this.clock.callbackAtTime(
        () => {
          this.scheduleAudioBeat(beat.rowId, triggerTime);
        },
        now
      );
    };

    this.interval;
    this.runSchedule = function (bpm) {
      bpm = bpm * 4;
      this.running = true;
      this.bpm = bpm;
      let interval = this.milliPerBeat(bpm);
      setTimeout(() => {
        this.schedule();
        this.next();
      }, 0);

      this.interval = setInterval(() => {
        this.schedule();
        this.next();
      }, interval);
    };

    this.stop = function () {
      this.running = false;
      clearInterval(this.interval);
    };

    this.getEventKey = function getEventKey(beat) {
      return beat.rowId + beat.colId;
    };

    this.getTrackerValues = function () {
      let values = [];
      let elems = document.querySelectorAll('.tracker-cell');
      elems.forEach(function (e) {
        let val = Object.assign({}, e.dataset);
        val.enabled = hasClass(e, 'tracker-enabled');
        values.push(val);
      });
      return values;
    };

    this.loadTrackerValues = function (json) {
      let elems = document.querySelectorAll('.tracker-enabled');
      elems.forEach(function (e) {
        e.classList.remove('tracker-enabled');
      });
      json.forEach(function (data) {
        if (data.enabled === true) {
          let selector = `.tracker-cell[data-row-id="${data.rowId}"][data-col-id="${data.colId}"]`;
          let elem = document.querySelector(selector);
          if (elem) {
            elem.classList.add('tracker-enabled');
          }
        }
      });
    };

    this.setupEvents = function () {
      let elems = document.querySelectorAll('.tracker-cell');
      elems.forEach(function (e) {
        e.addEventListener('click', function (e) {
          let val = Object.assign({}, e.target.dataset);
          val.enabled = hasClass(e.target, 'tracker-enabled');
          let currentBeat = e.target.dataset.colId;
          if (val.colId > currentBeat) {
            this.scheduleAudioBeatNow(val);
          }
          e.target.classList.toggle('tracker-enabled');
        });
      });
    };
  }
}

var _colId;

const defaultTrack = {
  beat: [
    { rowId: '0', colId: '0', enabled: false },
  ],
  settings: {
    // sampleSet: '../assets/audio/studio/samples.json',
    sampleSet: 'https://roneicostasoares.com.br/Orgao/assets/audio/studio/samples.json',
    measureLength: 16,
    bpm: 90,
    detune: 0,
    gainEnabled: 'gain',
    attackAmp: 0,
    sustainAmp: 0.4,
    decayAmp: 0.7,
    releaseAmp: 1,
    attackTime: 0,
    decayTime: 0,
    sustainTime: 2,
    releaseTime: 2,
    adsrInterval: 0.1,
    delay: 0.01,
    filter: 1000,
  },
};

function initializeSampleSet(audioContext, dataUrl, track) {
  var sampleSetPromise = loadSampleSet(audioContext, dataUrl);
  sampleSetPromise.then(function (data) {
    buffers = data.buffers;
    sampleData = data.data;

    if (!track) {
      track = storage.getTrack();
    }

    if (!track.settings.measureLength) {
      track.settings.measureLength = 16;
    }

    currentSampleData = sampleData;
    setupTrackerHtml(sampleData, track.settings.measureLength);
    schedule.loadTrackerValues(track.beat);
    schedule.setupEvents();
  });
}

window.onload = function () {
  audioContext = new AudioContext();
  schedule = new tracker(audioContext, scheduleAudioBeat);
  getSetAudioOptions.setTrackerControls(defaultTrack.settings);
  initializeSampleSet(audioContext, defaultTrack.settings.sampleSet, defaultTrack);
  setupBaseEvents();
};

gerarRitmosNomes(ritmosNomes);

function hasClass(el, str) {
  if (el.classList) {
    return el.classList.contains(str);
  }
  return new RegExp('(^| )' + str + '( |$)', 'gi').test(el.className);
}