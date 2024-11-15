class Tracker {
  constructor(audioContext, scheduleAudioBeat) {
    this.measureLength = 16;
    this.scheduleAudioBeat = scheduleAudioBeat;
    this.scheduleForward = 0.1;
    this.current = 0;
    this.eventMap = {};
    this.clock = new WAAClock(audioContext);
    this.clock.start();
    this.running = false;
    this.scheduleMap = {};

    this.drawTracker = (numRows, numCols, data) => {
      const trackerTable = new TrackerTable();
      trackerTable.setRows(numRows, numCols, data);
      const trackerParent = document.getElementById('tracker-parent');
      trackerParent.innerHTML = '';
      trackerParent.insertAdjacentHTML('afterbegin', trackerTable.getTable());
    };

    this.next = () => {
      this.current = (this.current + 1) % this.measureLength;
    };

    this.milliPerBeat = (beats = 60) => (1000 * 60) / beats;

    this.getTrackerRowValues = (colId) => {
      const selector = `[data-col-id="${colId}"]`;
      const elems = document.querySelectorAll(selector);
      return Array.from(elems).map((el) => ({
        ...el.dataset,
        enabled: el.classList.contains('tracker-enabled'),
      }));
    };

    this.schedule = () => {
      const beatColumn = this.getTrackerRowValues(this.current);
      const now = audioContext.currentTime;
      beatColumn.forEach((beat) => this.scheduleBeat(beat, now));
    };

    this.scheduleBeat = (beat, now) => {
      const triggerTime = now + this.scheduleForward;
      this.scheduleMap[beat.colId] = triggerTime;
      this.playSolo(beat.colId);

      if (beat.enabled) {
        if (_viradaRitmo !== '') {
          _trocarRitmo = true;
          selecionarRitmo(_viradaRitmo, true);
        }
        if (beat.colId == 0) {
            selecionarRitmo(_ritmoSelecionado);
            _viradaRitmo = '';
        }

        this.eventMap[this.getEventKey(beat)] = this.clock.callbackAtTime(
          () => this.scheduleAudioBeat(beat.rowId, triggerTime),
          now
        );
      }
    };

    this.scheduleAudioBeatNow = (beat) => {
      if (beat.enabled) {
        this.clearBeatEvent(beat);
        return;
      }

      const triggerTime = this.scheduleMap[0] + (beat.colId * this.milliPerBeat(this.bpm)) / 1000;
      const now = audioContext.currentTime;
      this.eventMap[this.getEventKey(beat)] = this.clock.callbackAtTime(
        () => this.scheduleAudioBeat(beat.rowId, triggerTime),
        now
      );
    };

    this.clearBeatEvent = (beat) => {
      const beatEvent = this.eventMap[this.getEventKey(beat)];
      if (beatEvent) {
        beatEvent.clear();
        delete this.eventMap[this.getEventKey(beat)];
      }
    };

    this.runSchedule = (bpm) => {
      this.running = true;
      this.bpm = bpm * 4;
      const interval = this.milliPerBeat(this.bpm);
      setTimeout(() => {
        this.schedule();
        this.next();
      }, 0);

      this.interval = setInterval(() => {
        this.schedule();
        this.next();
      }, interval);
    };

    this.stop = () => {
      this.running = false;
      clearInterval(this.interval);
    };

    this.getEventKey = (beat) => `${beat.rowId}${beat.colId}`;

    this.getTrackerValues = () => {
      const elems = document.querySelectorAll('.tracker-cell');
      return Array.from(elems).map((e) => ({
        ...e.dataset,
        enabled: e.classList.contains('tracker-enabled'),
      }));
    };

    this.loadTrackerValues = (json) => {
      const enabledElems = document.querySelectorAll('.tracker-enabled');
      enabledElems.forEach((e) => e.classList.remove('tracker-enabled'));
      json.forEach((data) => {
        if (data.enabled) {
          const selector = `.tracker-cell[data-row-id="${data.rowId}"][data-col-id="${data.colId}"]`;
          const elem = document.querySelector(selector);
          if (elem) {
            elem.classList.add('tracker-enabled');
          }
        }
      });
    };

    this.setupEvents = () => {
      const elems = document.querySelectorAll('.tracker-cell');
      elems.forEach((e) => {
        e.addEventListener('click', (event) => {
          const val = {
            ...event.target.dataset,
            enabled: event.target.classList.contains('tracker-enabled'),
          };
          const currentBeat = event.target.dataset.colId;
          if (val.colId > currentBeat) {
            this.scheduleAudioBeatNow(val);
          }
          event.target.classList.toggle('tracker-enabled');
        });
      });
    };

    this.playSolo = (colId) => {
      if (colId !== _colId && _notasSolo) {
        if (_notasSolo[_notasSoloIndex] !== '') {
          if (_somSolo) {
            _somSolo.stop();
          }

          _somSolo = acordes[`epiano_${_notasSolo[_notasSoloIndex].replace('0', '_baixo').replace('-1', '_grave')}`];
          _somSolo.play();
        }
        if (_notasSoloIndex === _notasSolo.length - 1) {
          if (_somSolo) {
            _somSolo.stop();
          }

          _somSolo = null;
          _notasSolo = null;
          _notasSoloIndex = 0;
        } else {
          _notasSoloIndex++;
        }
      }
      _colId = colId;
    };
  }
}

class AdsrGainNode {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.mode = 'exponentialRampToValueAtTime';
    this.options = {
      attackAmp: 0.1,
      decayAmp: 0.3,
      sustainAmp: 0.7,
      releaseAmp: 0.01,
      attackTime: 0.1,
      decayTime: 0.2,
      sustainTime: 1.0,
      releaseTime: 3.4,
      autoRelease: true,
    };
  }

  setOptions(options) {
    this.options = { ...this.options, ...options };
  }

  getGainNode(audioTime) {
    this.gainNode = this.audioContext.createGain();
    this.audioTime = audioTime;

    this.gainNode.gain.setValueAtTime(0.0000001, audioTime);
    this.gainNode.gain[this.mode](this.options.attackAmp, audioTime + this.options.attackTime);
    this.gainNode.gain[this.mode](this.options.decayAmp, audioTime + this.options.attackTime + this.options.decayTime);
    this.gainNode.gain[this.mode](this.options.sustainAmp, audioTime + this.options.attackTime + this.options.sustainTime);

    if (this.options.autoRelease) {
      this.gainNode.gain[this.mode](this.options.releaseAmp, audioTime + this.releaseTime());
      this.disconnect(audioTime + this.releaseTime());
    }

    return this.gainNode;
  }

  releaseNow() {
    this.gainNode.gain[this.mode](this.options.releaseAmp, this.audioContext.currentTime + this.options.releaseTime);
    this.disconnect(this.options.releaseTime);
  }

  releaseTime() {
    return this.options.attackTime + this.options.decayTime + this.options.sustainTime + this.options.releaseTime;
  }

  releaseTimeNow() {
    return this.audioContext.currentTime + this.releaseTime();
  }

  disconnect(disconnectTime) {
    setTimeout(() => this.gainNode.disconnect(), disconnectTime * 1000);
  }
}

class AudioBufferInstrument {
  constructor(context, buffer) {
    this.context = context;
    this.buffer = buffer;
  }

  setup() {
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.context.destination);
  }

  get() {
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;
    return this.source;
  }

  trigger(time) {
    this.setup();
    this.source.start(time);
  }
}

class GetSetFormValues {
  constructor() {
    this.set = this.setFormValues;
    this.get = this.getFormValues;
  }

  getFormValues(formElement) {
    const formParams = {};
    for (let i = 0; i < formElement.elements.length; i++) {
      const elem = formElement.elements[i];
      switch (elem.type) {
        case 'submit':
          break;
        case 'radio':
          if (elem.checked) {
            formParams[elem.name] = elem.value;
          }
          break;
        case 'checkbox':
          if (elem.checked) {
            formParams[elem.name] = elem.value;
          }
          break;
        case 'select-multiple':
          const selectValues = this.getSelectValues(elem);
          if (selectValues.length > 0) {
            formParams[elem.name] = selectValues;
          }
          break;
        default:
          if (elem.value !== undefined) {
            formParams[elem.name] = elem.value;
          }
      }
    }
    return formParams;
  }

  setFormValues(formElement, values) {
    for (let i = 0; i < formElement.elements.length; i++) {
      const elem = formElement.elements[i];
      switch (elem.type) {
        case 'submit':
          break;
        case 'radio':
          elem.checked = values[elem.name] === elem.value;
          break;
        case 'checkbox':
          elem.checked = values[elem.name] === elem.value;
          break;
        case 'select-multiple':
          if (values[elem.name]) {
            this.setSelectValues(elem, values[elem.name]);
          }
          break;
        default:
          if (values[elem.name] !== undefined) {
            elem.value = values[elem.name];
          }
      }
    }
  }

  setSelectValues(selectElem, values) {
    for (let i = 0; i < selectElem.options.length; i++) {
      selectElem.options[i].selected = values.indexOf(selectElem.options[i].value) > -1;
    }
  }

  getSelectValues(select) {
    const result = [];
    if (select && select.options) {
      for (let i = 0; i < select.options.length; i++) {
        const opt = select.options[i];
        opt.selected && result.push(opt.value || opt.text);
      }
    }
    return result;
  }
}

class SelectElement {
  constructor(appendToID, selectID, options, selected) {
    this.appendToID = appendToID;
    this.selectID = selectID;
    this.options = options;
    this.selected = selected;
    this.selectList;

    this.create = (cb) => {
      const appendToID = document.getElementById(this.appendToID);
      this.selectList = document.createElement('select');
      this.selectList.id = this.selectID;
      appendToID.appendChild(this.selectList);
      this.update(selectID, this.options, this.selected);
    };

    this.onChange = (cb) => this.selectList.addEventListener('change', () => cb(this.selectList.value));

    this.update = (elem, options, selected) => {
      this.delete(elem);
      const selectList = document.getElementById(elem);
      for (const key in options) {
        const option = document.createElement('option');
        option.value = key;
        option.text = options[key];
        selectList.appendChild(option);
        key === selected && option.setAttribute('selected', true);
      }
    };

    this.getSelected = (elem) => {
      const selectList = document.getElementById(elem);
      for (let i = 0; i < selectList.options.length; i++) {
        const opt = selectList.options[i];
        if (opt.selected) return opt.value;
      }
      return false;
    };

    this.delete = (elem) => {
      const selectList = document.getElementById(elem);
      for (const option in selectList) {
        selectList.remove(option);
      }
    };

    this.getAsString = () => document.getElementById(this.appendToID).outerHTML;
  }
}

class TrackerTable {
  constructor() {
    this.str = '';

    this.getTable = () => `<table id="tracker-table">${this.str}</table>`;

    this.setHeader = (numRows, data) => {
      this.str += `<tr class="tracker-row header">`;
      this.str += this.getCells('header', numRows, { header: true });
      this.str += `</tr>`;
    };

    this.setRows = (numRows, numCols, data) => {
      this.setHeader(numCols, data);
      for (let rowID = 0; rowID < numRows; rowID++) {
        this.str += `<tr class="tracker-row" data-id="${rowID}">`;
        this.str += data.title && (data.title[rowID].includes('baixo') || data.title[rowID].includes('cravo') || data.title[rowID].includes('violao'))
          ? ''
          : this.getCells(rowID, numCols, data);
        this.str += `</tr>`;
      }
    };

    let i = 0;
    this.getFirstCell = (rowID, data) => `<td class="tracker-first-cell" data-row-id="${rowID}">${data.title ? data.title[rowID] : ''}</td>`;

    this.getCells = (rowID, numRows, data) => {
      let str = this.getFirstCell(rowID, data);
      let cssClass = 'tracker-cell';
      rowID === 'header' && (cssClass = 'tracker-cell-header');

      for (let c = 0; c < numRows; c++) {
        const num = cssClass === 'tracker-cell' ? i : '';
        str += `<td class="${cssClass}" data-row-id="${rowID}" data-col-id="${c}">${num}`;
        i++;
        data.header && (str += c + 1);
        str += `</td>`;
      }
      return str;
    };
  }
}

class GetSetControls {
  constructor() {
    const trackerControls = JSON.parse(
      '{ "": 90, "adsrInterval": 0.1, "attackTime": 0, "bpm": 90, "decayAmp": 0.7, "decayTime": 0, "delay": 0.01, "filter": 1000, "releaseAmp": 1, "releaseTime": 2, "sustainAmp": 0.4, "sustainTime": 2 }'
    );

    this.getTrackerControls = () => trackerControls;

    this.setTrackerControls = (values) => {
      if (!values) {
        values = this.getTrackerControls();
      }
      this.options = values;
    };
  }
}

function getFormValues(formElement) {
  const formParams = {};
  for (let i = 0; i < formElement.elements.length; i++) {
    const elem = formElement.elements[i];
    switch (elem.type) {
      case 'submit':
        break;
      case 'radio':
        if (elem.checked) {
          formParams[elem.name] = elem.value;
        }
        break;
      case 'checkbox':
        if (elem.checked) {
          formParams[elem.name] = elem.value;
        }
        break;
      case 'select-multiple':
        const selectValues = getSelectValues(elem);
        if (selectValues.length > 0) {
          formParams[elem.name] = selectValues;
        }
        break;
      default:
        if (elem.value !== undefined) {
          formParams[elem.name] = elem.value;
        }
    }
  }
  return formParams;
}

function sampleLoader(context, url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('get', url, true);
    request.responseType = 'arraybuffer';
    request.onload = () => request.status === 200
      ? context.decodeAudioData(request.response, resolve)
      : reject('tiny-sample-loader request failed');
    request.send();
  });
}

function getJSONPromise(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('get', url, true);
    request.responseType = 'text';
    request.onload = () => request.status === 200
      ? resolve(JSON.parse(request.responseText))
      : reject('JSON could not be loaded ' + url);
    request.send();
  });
}

function loadSampleSet(audioContext, dataUrl) {
  return new Promise((resolve, reject) => {
    getJSONPromise(dataUrl)
      .then((data) => {
        const samplePromises = getSamplePromises(audioContext, data);
        Promise.all(samplePromises)
          .then(() => resolve({ data, buffers }))
          .catch((error) => console.log(error));
      })
      .catch(reject);
  });
}

function getSamplePromises(audioContext, data) {
  const baseUrl = data.samples;
  const promises = [];
  data.filename = [];

  data.files.forEach((val) => {
    const filename = val.replace(/\.[^/.]+$/, '');
    data.filename.push(filename);
    const remoteUrl = baseUrl + val;

    const loaderPromise = sampleLoader(audioContext, remoteUrl);
    loaderPromise.then((buffer) => (buffers[filename] = new AudioBufferInstrument(audioContext, buffer)));
    promises.push(loaderPromise);
  });

  return promises;
}

function initializeSampleSet(audioContext, dataUrl, track) {
  loadSampleSet(audioContext, dataUrl)
    .then((data) => {
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

let buffers = {};
let _colId;

const defaultTrack = {
  beat: [
    { rowId: '0', colId: '0', enabled: false },
  ],
  settings: {
    // sampleSet: '../assets/audio/studio/samples.json',
    sampleSet: 'https://roneicostasoares.com.br/orgao.web/assets/audio/studio/samples.json',
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

window.onload = () => {
  audioContext = new AudioContext();
  schedule = new Tracker(audioContext, scheduleAudioBeat);
  getSetAudioOptions.setTrackerControls(defaultTrack.settings);
  initializeSampleSet(audioContext, defaultTrack.settings.sampleSet, defaultTrack);
  setupBaseEvents();
};

gerarRitmosNomes(ritmosNomes);
const getSetAudioOptions = new GetSetControls();