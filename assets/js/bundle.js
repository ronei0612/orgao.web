var _ritmoSelecionado;
var _notasSoloIndex = 0;
var _brushSelecionado = false;
var _tocandoBateria = false;
var _colId;

(function e(t, n, r) { function s(o, u) { if (!n[o]) { if (!t[o]) { var a = typeof require == "function" && require; if (!u && a) return a(o, !0); if (i) return i(o, !0); var f = new Error("Cannot find module '" + o + "'"); throw f.code = "MODULE_NOT_FOUND", f } var l = n[o] = { exports: {} }; t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e) }, l, l.exports, e, t, n, r) } return n[o].exports } var i = typeof require == "function" && require; for (var o = 0; o < r.length; o++)s(r[o]); return s })({
    1: [function (require, module, exports) {
        function AdsrGainNode(ctx) {

            this.ctx = ctx;

            this.mode = 'exponentialRampToValueAtTime';
            // this.mode = 'linearRampToValueAtTime';

            this.options = {
                attackAmp: 0.1,
                decayAmp: 0.3,
                sustainAmp: 0.7,
                releaseAmp: 0.01,
                attackTime: 0.1,
                decayTime: 0.2,
                sustainTime: 1.0,
                releaseTime: 3.4,
                autoRelease: true
            };

            /**
             * Set options or use defaults
             * @param {object} options 
             */
            this.setOptions = function (options) {
                this.options = Object.assign(this.options, options);
            };

            this.gainNode
            this.audioTime

            /**
             * Get a gain node from defined options
             * @param {float} audioTime an audio context time stamp
             */
            this.getGainNode = (audioTime) => {

                this.gainNode = this.ctx.createGain();
                this.audioTime = audioTime

                // Firefox does not like 0 -> therefor 0.0000001
                this.gainNode.gain.setValueAtTime(0.0000001, audioTime)

                // Attack
                this.gainNode.gain[this.mode](
                    this.options.attackAmp,
                    audioTime + this.options.attackTime)

                // Decay
                this.gainNode.gain[this.mode](
                    this.options.decayAmp,
                    audioTime + this.options.attackTime + this.options.decayTime)

                // Sustain
                this.gainNode.gain[this.mode](
                    this.options.sustainAmp,
                    audioTime + this.options.attackTime + this.options.sustainTime)

                // Check if auto-release
                // Then calculate when note should stop
                if (this.options.autoRelease) {
                    this.gainNode.gain[this.mode](
                        this.options.releaseAmp,
                        audioTime + this.releaseTime()
                    )

                    // Disconnect the gain node 
                    this.disconnect(audioTime + this.releaseTime())
                }
                return this.gainNode;
            };

            /**
             * Release the note dynamicaly
             * E.g. if your are making a keyboard, and you want the note
             * to be released according to current audio time + the ADSR release time 
             */
            this.releaseNow = () => {
                this.gainNode.gain[this.mode](
                    this.options.releaseAmp,
                    this.ctx.currentTime + this.options.releaseTime)
                this.disconnect(this.options.releaseTime)
            }

            /**
             * Get release time according to the adsr release time
             */
            this.releaseTime = function () {
                return this.options.attackTime + this.options.decayTime + this.options.sustainTime + this.options.releaseTime
            }

            /**
             * Get release time according to 'now'
             */
            this.releaseTimeNow = function () {
                return this.ctx.currentTime + this.releaseTime()
            }

            /**
             * 
             * @param {float} disconnectTime the time when gainNode should disconnect 
             */
            this.disconnect = (disconnectTime) => {
                setTimeout(() => {
                    this.gainNode.disconnect();
                },
                    disconnectTime * 1000);
            };
        }

        module.exports = AdsrGainNode;

    }, {}], 2: [function (require, module, exports) {
        // From: https://dev.opera.com/articles/drum-sounds-webaudio/
        function audioBufferInstrument(context, buffer) {
            this.context = context;
            this.buffer = buffer;
        }

        audioBufferInstrument.prototype.setup = function () {
            this.source = this.context.createBufferSource();
            this.source.buffer = this.buffer;
            this.source.connect(this.context.destination);
        };

        audioBufferInstrument.prototype.get = function () {
            this.source = this.context.createBufferSource();
            this.source.buffer = this.buffer;
            return this.source;
        };

        audioBufferInstrument.prototype.trigger = function (time) {
            this.setup();
            this.source.start(time);
        };

        module.exports = audioBufferInstrument;
    }, {}], 3: [function (require, module, exports) {
        
    }, {}], 4: [function (require, module, exports) {
        function getJSONPromise(url) {

            var promise = new Promise((resolve, reject) => {
                var request = new XMLHttpRequest();

                request.open('get', url, true);
                request.responseType = 'text';
                request.onload = function () {
                    if (request.status === 200) {
                        try {
                            resolve(JSON.parse(request.responseText));
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        reject('JSON could not be loaded ' + url);
                    }
                };
                request.send();
            });

            return promise;
        }

        module.exports = getJSONPromise;

    }, {}], 5: [function (require, module, exports) {
        function getFormValues(formElement) {
            var formElements = formElement.elements;
            var formParams = {};
            var i = 0;
            var elem = null;
            for (i = 0; i < formElements.length; i += 1) {
                elem = formElements[i];
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
                        var selectValues = getSelectValues(elem);
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

        function setFormValues(formElement, values) {
            var formElements = formElement.elements;
            var i = 0;
            var elem = null;
            for (i = 0; i < formElements.length; i += 1) {
                elem = formElements[i];

                switch (elem.type) {
                    case 'submit':
                        break;
                    case 'radio':
                        if (values[elem.name] === elem.value) {
                            elem.checked = true;
                        } else {
                            elem.checked = false;
                        }
                        break;
                    case 'checkbox':
                        if (values[elem.name] === elem.value) {
                            elem.checked = true;
                        } else {
                            elem.checked = false;
                        }
                        break;
                    case 'select-multiple':
                        if (values[elem.name]) {
                            setSelectValues(elem, values[elem.name]);
                        }
                        break;
                    default:
                        if (values[elem.name] !== undefined) {
                            elem.value = values[elem.name];
                        }

                }
            }
        }

        function setSelectValues(selectElem, values) {
            var options = selectElem.options;
            var opt;

            for (var i = 0, iLen = options.length; i < iLen; i++) {
                opt = options[i];
                if (values.indexOf(opt.value) > -1) {
                    opt.selected = true;
                } else {
                    opt.selected = false;
                }
            }
        }

        function getSelectValues(select) {
            var result = [];
            var options = select && select.options;
            var opt;

            for (var i = 0, iLen = options.length; i < iLen; i++) {
                opt = options[i];

                if (opt.selected) {
                    result.push(opt.value || opt.text);
                }
            }
            return result;
        }

        function getSetFormValues() {
            this.set = setFormValues;
            this.get = getFormValues;
        }

        module.exports = getSetFormValues;

    }, {}], 6: [function (require, module, exports) {
        'use strict';
        var objType = require('obj-type');

        module.exports = function (el, str) {
            if (objType(el).indexOf('element') === -1) {
                throw new TypeError('Expected an HTML DOM element as first argument');
            }

            if (typeof str !== 'string') {
                throw new TypeError('Expected a string as second argument');
            }

            if (el.classList) {
                return el.classList.contains(str);
            }

            return new RegExp('(^| )' + str + '( |$)', 'gi').test(el.className);
        };

    }, { "obj-type": 9 }], 7: [function (require, module, exports) {
        var tinySampleLoader = require('tiny-sample-loader');
        var audioBufferInstrument = require('audio-buffer-instrument');
        var getJSON = require('get-json-promise');

        var buffers = {};
        function getSamplePromises(ctx, data) {
            var baseUrl = data.samples;
            var promises = [];

            data.filename = [];
            var i = 0;
            data.files.forEach(function (val) {
                var filename = val.replace(/\.[^/.]+$/, "");
                data.filename.push(filename);
                var remoteUrl = baseUrl + val;

                let loaderPromise = tinySampleLoader(ctx, remoteUrl);
                loaderPromise.then(function (buffer) {
                    buffers[filename] = new audioBufferInstrument(ctx, buffer);
                });

                promises.push(loaderPromise);

            });

            return promises;
        }

        function sampleAllPromise(ctx, dataUrl) {
            var promise = new Promise((resolve, reject) => {
                var jsonPromise = getJSON(dataUrl);
                jsonPromise.then(function (data) {
                    var samplePromises = getSamplePromises(ctx, data);
                    Promise.all(samplePromises).then(function () {
                        resolve({ data: data, buffers: buffers });
                    }).catch(function (error) {
                        console.log(error);
                    });
                }).catch(function (error) {
                    reject(error);
                });
            });

            return promise;
        }

        function loadSampleSet(ctx, dataUrl) {
            return sampleAllPromise(ctx, dataUrl);
        }

        module.exports = loadSampleSet;

    }, { "audio-buffer-instrument": 2, "get-json-promise": 4, "tiny-sample-loader": 8 }], 8: [function (require, module, exports) {
        function sampleLoader(context, url) {

            var promise = new Promise((resolve, reject) => {
                var request = new XMLHttpRequest();

                request.open('get', url, true);
                request.responseType = 'arraybuffer';
                request.onload = function () {
                    if (request.status === 200) {
                        context.decodeAudioData(request.response, function (buffer) {
                            resolve(buffer);
                        });
                    } else {
                        reject('tiny-sample-loader request failed');
                    }

                };
                request.send();
            });

            return promise;
        };

        module.exports = sampleLoader;

    }, {}], 9: [function (require, module, exports) {
        'use strict';
        module.exports = function (obj) {
            return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
        };

    }, {}], 10: [function (require, module, exports) {
        function selectElement(appendToID, selectID, options, selected) {

            this.appendToID = appendToID;
            this.selectID = selectID;
            this.options = options;
            this.selected = selected;

            this.selectList;

            this.create = function (cb) {
                var appendToID = document.getElementById(this.appendToID);
                this.selectList = document.createElement("select");
                this.selectList.id = this.selectID;
                appendToID.appendChild(this.selectList);
                this.update(selectID, this.options, this.selected);
            };

            this.onChange = function (cb) {
                this.selectList.addEventListener('change', function () {
                    cb(this.value)
                });
            }

            this.update = function (elem, options, selected) {
                this.delete(elem);
                var selectList = document.getElementById(elem);
                for (var key in options) {
                    var option = document.createElement("option");
                    option.value = key;
                    option.text = options[key];
                    selectList.appendChild(option);

                    if (key === selected) {
                        option.setAttribute('selected', true);
                    }
                }
            };

            this.getSelected = function (elem) {
                var selectList = document.getElementById(elem);
                var opt;
                for (var i = 0, len = selectList.options.length; i < len; i++) {
                    opt = selectList.options[i];
                    if (opt.selected === true) {
                        return opt.value;
                        break;
                    }
                }
                return false;
            };

            this.delete = function (elem) {
                var selectList = document.getElementById(elem);
                for (var option in selectList) {
                    selectList.remove(option);
                }
            };

            this.getAsString = function () {
                var element = document.getElementById(this.appendToID);
                var elementHtml = element.outerHTML;
                return elementHtml;
            };
        }

        module.exports = selectElement;
    }, {}], 11: [function (require, module, exports) {
        var WAAClock = require('./lib/WAAClock')

        module.exports = WAAClock
        if (typeof window !== 'undefined') window.WAAClock = WAAClock

    }, { "./lib/WAAClock": 12 }], 12: [function (require, module, exports) {
        (function (process) {
            var isBrowser = (typeof window !== 'undefined')

            var CLOCK_DEFAULTS = {
                toleranceLate: 0.10,
                toleranceEarly: 0.001
            }

            // ==================== Event ==================== //
            var Event = function (clock, deadline, func) {
                this.clock = clock
                this.func = func
                this._cleared = false // Flag used to clear an event inside callback

                this.toleranceLate = clock.toleranceLate
                this.toleranceEarly = clock.toleranceEarly
                this._latestTime = null
                this._earliestTime = null
                this.deadline = null
                this.repeatTime = null

                this.schedule(deadline)
            }

            // Unschedules the event
            Event.prototype.clear = function () {
                this.clock._removeEvent(this)
                this._cleared = true
                return this
            }

            // Sets the event to repeat every `time` seconds.
            Event.prototype.repeat = function (time) {
                if (time === 0)
                    throw new Error('delay cannot be 0')
                this.repeatTime = time
                if (!this.clock._hasEvent(this))
                    this.schedule(this.deadline + this.repeatTime)
                return this
            }

            // Sets the time tolerance of the event.
            // The event will be executed in the interval `[deadline - early, deadline + late]`
            // If the clock fails to execute the event in time, the event will be dropped.
            Event.prototype.tolerance = function (values) {
                if (typeof values.late === 'number')
                    this.toleranceLate = values.late
                if (typeof values.early === 'number')
                    this.toleranceEarly = values.early
                this._refreshEarlyLateDates()
                if (this.clock._hasEvent(this)) {
                    this.clock._removeEvent(this)
                    this.clock._insertEvent(this)
                }
                return this
            }

            // Returns true if the event is repeated, false otherwise
            Event.prototype.isRepeated = function () { return this.repeatTime !== null }

            // Schedules the event to be ran before `deadline`.
            // If the time is within the event tolerance, we handle the event immediately.
            // If the event was already scheduled at a different time, it is rescheduled.
            Event.prototype.schedule = function (deadline) {
                this._cleared = false
                this.deadline = deadline
                this._refreshEarlyLateDates()

                if (this.clock.context.currentTime >= this._earliestTime) {
                    this._execute()

                } else if (this.clock._hasEvent(this)) {
                    this.clock._removeEvent(this)
                    this.clock._insertEvent(this)

                } else this.clock._insertEvent(this)
            }

            Event.prototype.timeStretch = function (tRef, ratio) {
                if (this.isRepeated())
                    this.repeatTime = this.repeatTime * ratio

                var deadline = tRef + ratio * (this.deadline - tRef)
                // If the deadline is too close or past, and the event has a repeat,
                // we calculate the next repeat possible in the stretched space.
                if (this.isRepeated()) {
                    while (this.clock.context.currentTime >= deadline - this.toleranceEarly)
                        deadline += this.repeatTime
                }
                this.schedule(deadline)
            }

            // Executes the event
            Event.prototype._execute = function () {
                if (this.clock._started === false) return
                this.clock._removeEvent(this)

                if (this.clock.context.currentTime < this._latestTime)
                    this.func(this)
                else {
                    if (this.onexpired) this.onexpired(this)
                    console.warn('event expired')
                }
                // In the case `schedule` is called inside `func`, we need to avoid
                // overrwriting with yet another `schedule`.
                if (!this.clock._hasEvent(this) && this.isRepeated() && !this._cleared)
                    this.schedule(this.deadline + this.repeatTime)
            }

            // Updates cached times
            Event.prototype._refreshEarlyLateDates = function () {
                this._latestTime = this.deadline + this.toleranceLate
                this._earliestTime = this.deadline - this.toleranceEarly
            }

            // ==================== WAAClock ==================== //
            var WAAClock = module.exports = function (context, opts) {
                var self = this
                opts = opts || {}
                this.tickMethod = opts.tickMethod || 'ScriptProcessorNode'
                this.toleranceEarly = opts.toleranceEarly || CLOCK_DEFAULTS.toleranceEarly
                this.toleranceLate = opts.toleranceLate || CLOCK_DEFAULTS.toleranceLate
                this.context = context
                this._events = []
                this._started = false
            }

            // ---------- Public API ---------- //
            // Schedules `func` to run after `delay` seconds.
            WAAClock.prototype.setTimeout = function (func, delay) {
                return this._createEvent(func, this._absTime(delay))
            }

            // Schedules `func` to run before `deadline`.
            WAAClock.prototype.callbackAtTime = function (func, deadline) {
                return this._createEvent(func, deadline)
            }

            // Stretches `deadline` and `repeat` of all scheduled `events` by `ratio`, keeping
            // their relative distance to `tRef`. In fact this is equivalent to changing the tempo.
            WAAClock.prototype.timeStretch = function (tRef, events, ratio) {
                events.forEach(function (event) { event.timeStretch(tRef, ratio) })
                return events
            }

            // Removes all scheduled events and starts the clock 
            WAAClock.prototype.start = function () {
                if (this._started === false) {
                    var self = this
                    this._started = true
                    this._events = []

                    if (this.tickMethod === 'ScriptProcessorNode') {
                        var bufferSize = 256
                        // We have to keep a reference to the node to avoid garbage collection
                        this._clockNode = this.context.createScriptProcessor(bufferSize, 1, 1)
                        this._clockNode.connect(this.context.destination)
                        this._clockNode.onaudioprocess = function () {
                            process.nextTick(function () { self._tick() })
                        }
                    } else if (this.tickMethod === 'manual') null // _tick is called manually

                    else throw new Error('invalid tickMethod ' + this.tickMethod)
                }
            }

            // Stops the clock
            WAAClock.prototype.stop = function () {
                if (this._started === true) {
                    this._started = false
                    this._clockNode.disconnect()
                }
            }

            // ---------- Private ---------- //

            // This function is ran periodically, and at each tick it executes
            // events for which `currentTime` is included in their tolerance interval.
            WAAClock.prototype._tick = function () {
                var event = this._events.shift()

                while (event && event._earliestTime <= this.context.currentTime) {
                    event._execute()
                    event = this._events.shift()
                }

                // Put back the last event
                if (event) this._events.unshift(event)
            }

            // Creates an event and insert it to the list
            WAAClock.prototype._createEvent = function (func, deadline) {
                return new Event(this, deadline, func)
            }

            // Inserts an event to the list
            WAAClock.prototype._insertEvent = function (event) {
                this._events.splice(this._indexByTime(event._earliestTime), 0, event)
            }

            // Removes an event from the list
            WAAClock.prototype._removeEvent = function (event) {
                var ind = this._events.indexOf(event)
                if (ind !== -1) this._events.splice(ind, 1)
            }

            // Returns true if `event` is in queue, false otherwise
            WAAClock.prototype._hasEvent = function (event) {
                return this._events.indexOf(event) !== -1
            }

            // Returns the index of the first event whose deadline is >= to `deadline`
            WAAClock.prototype._indexByTime = function (deadline) {
                // performs a binary search
                var low = 0
                    , high = this._events.length
                    , mid
                while (low < high) {
                    mid = Math.floor((low + high) / 2)
                    if (this._events[mid]._earliestTime < deadline)
                        low = mid + 1
                    else high = mid
                }
                return low
            }

            // Converts from relative time to absolute time
            WAAClock.prototype._absTime = function (relTime) {
                return relTime + this.context.currentTime
            }

            // Converts from absolute time to relative time 
            WAAClock.prototype._relTime = function (absTime) {
                return absTime - this.context.currentTime
            }
        }).call(this, require('_process'))

    }, { "_process": 18 }], 13: [function (require, module, exports) {
        const loadSampleSet = require('load-sample-set');
        const selectElement = require('select-element');
        const getSetFormValues = require('get-set-form-values');
        const adsrGainNode = require('adsr-gain-node');
        const simpleTracker = require('./simple-tracker');
        //const FileSaver = require('file-saver');

        const getSetControls = require('./get-set-controls');
        const getSetAudioOptions = new getSetControls();

        const ctx = new AudioContext();
        const defaultTrack = require('./default-track');

        var buffers;
        var currentSampleData;
        var storage;

        function initializeSampleSet(ctx, dataUrl, track) {
            var sampleSetPromise = loadSampleSet(ctx, dataUrl);
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
            verificarSeObtendoTokenGoogle();
            //verificarSewww();

            getSetAudioOptions.setTrackerControls(defaultTrack.settings);

            initializeSampleSet(ctx, defaultTrack.settings.sampleSet, defaultTrack); //carrega e inicializa tracks
            setupBaseEvents();
        };

        var instrumentData = {};
        var schedule = new simpleTracker(ctx, scheduleAudioBeat);
        //gerarRitmosNomes(ritmosNomes);

        function setupTrackerHtml(data, measureLength) {
            if (typeof data === 'undefined')
                alert('Erro nos sons! Recarregue a página por favor.');

            instrumentData = data;
            instrumentData.title = instrumentData.filename;
            schedule.drawTracker(data.filename.length, measureLength, instrumentData);
            return;
        }
        
        function scheduleAudioBeat(rowId, triggerTime) { //tocar os beats
            let instrumentName = instrumentData.filename[rowId];
            let instrument = buffers[instrumentName].get();
            
            function play(source) {
                let node = routeGain(source)
                node.connect(ctx.destination);
                fecharChimbal(instrumentName, _sourceChimbalAberto, triggerTime);
                source.start(triggerTime);
                //console.log(triggerTime);
            }

            function routeGain(source) {
                let gain = new adsrGainNode(ctx);
                gain.mode = 'linearRampToValueAtTime';
                let options = getSetAudioOptions.getTrackerControls();

                let gainNode;
                gain.setOptions(options);
                gainNode = gain.getGainNode(triggerTime);
                source.connect(gainNode);

                return gainNode;
            }

            function playBaixo() {
                if (instrumentName === '-' && instrumentoSelect.value === 'Banda' && _baixoSelecionado) {
                    setTimeout(function () {
                        let notaBaixo = _acordeBaixo.includes('#') ? _acordeBaixo[0] + '_' : _acordeBaixo;
                        let baixoAudio = buffers['baixo_' + notaBaixo].get();
                        //guardarBaixo(baixoAudio);
                        play(baixoAudio);
                    }, 130);
                }
            }

            function playViolao() {
                if (_violaoSelecionado && (instrumentoSelect.value === 'Banda') &&
                    (instrumentName === '0' || instrumentName === '1' || instrumentName === '2')) {
                    setTimeout(function () {
                        let violaoAudio;
                        if (instrumentName === '2') {
                            violaoAudio = buffers['violao_'].get();
                            play(violaoAudio);
                        }
                        else {
                            let acordeViolao = _acordeSelecionado;
                            
                            if (acordeViolao.includes('°'))
                                acordeViolao = _notasAcordesJson[acordeViolao][1].toUpperCase() + 'm';

                            let matches = acordeViolao.match(/^[A-Z]#?m?/);
                            if (matches) {
                                let nota = matches[0];
                                nota = nota.replace('#', '_');

                                if (instrumentName === '1')
                                    nota = nota + '1';

                                violaoAudio = buffers['violao_' + nota].get();

                                play(violaoAudio);
                            }
                        }                        
                    }, 100);
                }
            }
            
            function playCravo() {
                if ((instrumentName === '0' || instrumentName === '1' || instrumentName === '2') && _acordeSelecionado) {
                    setTimeout(function () {
                        let notas = _acordeNotas;
                        notas.sort();

                        let nota = notas[instrumentName];
                        nota = nota.includes('#') ? nota.split('#')[0] + '_' : nota[0];
                        
                        play(buffers['cravo_' + nota].get());
                    }, 100);
                }
            }

            if (_acordeSelecionado) {
                playViolao();
                playBaixo();
            }

            if (_cravoSelecionado)
                playCravo();
            else
                guardarChimbalAberto(instrumentName, instrument);

            play(instrument);
        }

        function playBateria() {
            schedule.stop();
            schedule.runSchedule(_tempo);

            prepararBateriaBotao.style.display = 'none';
            pararBateriaBotao.style.display = '';
        }
        function stopBateria(trocandoInstrumento) {
            if (schedule.running) {
                //if (_autoMudarRitmo && !trocandoInstrumento && !_brushSelecionado && !_cravoSelecionado)
                //    prato.dispatchEvent(eventoClick);

                if (_cravoSelecionado || trocandoInstrumento) {
                    schedule.stop();
                    schedule = new simpleTracker(ctx, scheduleAudioBeat);

                    _violaoSelecionado = false;
                    _epianoSelecionado = false;
                    _baixoSelecionado = false;
                    _guitarraSelecionado = false;
                    _tocandoBateria = false;

                    let botoesAcompanhamento = document.getElementsByClassName('instrumentoSelecionado');
                    Array.from(botoesAcompanhamento).forEach((elemento) => {
                        if (elemento.id !== 'stringsBotao')
                            elemento.classList.remove('instrumentoSelecionado');
                    });

                    prepararBateriaBotao.style.display = '';
                    pararBateriaBotao.style.display = 'none';
                }
                else {
                    _tocandoBateria = false;
                    mudarRitmo('');
                }

                _brushSelecionado = false;
            }

            _ritmoSelecionado = null;
        }

        function routeGain(source) {
            let gain = new adsrGainNode(ctx);
            gain.mode = 'linearRampToValueAtTime';
            let options = getSetAudioOptions.getTrackerControls();
            let gainNode;
            gain.setOptions(options);
            gainNode = gain.getGainNode(0);
            source.connect(gainNode);
            return gainNode;
        }
        function tocarBateria(botao = null, tocar) {
            if (botao) {
                if (!schedule.running)
                    playBateria();
                else if (!tocar)
                    stopBateria();
            }
            else
                stopBateria();
        }
function setupBaseEvents() {
    function verificarETocarBateria(mudarRitmoNome, tunerAcompanhamento, instrumentoAcompanhamento) {
        if (verificarETocarBateria_2(tunerAcompanhamento, instrumentoAcompanhamento)) {
            tocarBateria(document.activeElement, mudarRitmoNome === 'cravo' || mudarRitmoNome === 'brushCravo');
            mudarRitmo(mudarRitmoNome);
        }
    }

    function setTempoRitmo() {
        getSetAudioOptions.setTrackerControls();

        if (schedule.running) {
            schedule.stop();
            schedule.runSchedule(_tempo);
        }
    }

    selectRitmo.addEventListener('change', function (e) {
        var ritmoSelecionado = document.getElementsByClassName('selecionadoDrum');
        _trocarRitmo = true;

        selecionarRitmo(selectRitmo.value);

        if (ritmoSelecionado.length > 0)
            ritmoSelecionado[0].dispatchEvent(eventoClick);
        else if (_baixoSelecionado || _violaoSelecionado)
            verificarETocarBateria('', false);
    });
    aro.addEventListener('click', function (e) {
        if (_configurandoTeclas) {
            capturarTeclaConfiguracaoTeclas(aro);
            return;
        }
        verificarETocarBateria('aro', false);
        autoMudarRitmo(aro, true);
        _tocandoBateria = true;
    });
    meiaLua.addEventListener('click', function (e) {
        if (_configurandoTeclas) {
            capturarTeclaConfiguracaoTeclas(meiaLua);
            return;
        }
        verificarETocarBateria('meiaLua', true, 'stringsSolo');
        autoMudarRitmo(meiaLua, true);
        _tocandoBateria = true;
    });
    caixa.addEventListener('click', function (e) {
        if (_configurandoTeclas) {
            capturarTeclaConfiguracaoTeclas(caixa);
            return;
        }
        verificarETocarBateria('caixa', false);
        autoMudarRitmo(caixa, true);
        _tocandoBateria = true;
    });
    brush.addEventListener('click', function (e) {
        if (_configurandoTeclas) {
            capturarTeclaConfiguracaoTeclas(brush);
            return;
        }
        _brushSelecionado = true;
        verificarETocarBateria('brush', false);
        autoMudarRitmo(brush, true);
        _tocandoBateria = true;
    });
    chimbal.addEventListener('click', function (e) {
        if (_configurandoTeclas) {
            capturarTeclaConfiguracaoTeclas(chimbal);
            return;
        }
        verificarETocarBateria('chimbal', true, 'stringsSolo');
        autoMudarRitmo(chimbal, true);
        _tocandoBateria = true;
    });
    cravo.addEventListener('click', function (e) {
        if (_configurandoTeclas) {
            capturarTeclaConfiguracaoTeclas(cravo);
            return;
        }
        verificarETocarBateria('cravo', true, 'stringsSolo');
    });
    brushCravo.addEventListener('click', function (e) {
        if (_configurandoTeclas) {
            capturarTeclaConfiguracaoTeclas(brushCravo);
            return;
        }
        verificarETocarBateria('brushCravo', true, 'stringsSolo');
    });
    baixoBotao.addEventListener('click', function (e) {
        if (_configurandoTeclas) {
            capturarTeclaConfiguracaoTeclas(baixoBotao);
            return;
        }
        if (_baixoSelecionado && !_ritmoSelecionado)
            verificarETocarBateria('', false)
    });
    violaoBotao.addEventListener('click', function (e) {
        if (_configurandoTeclas) {
            capturarTeclaConfiguracaoTeclas(violaoBotao);
            return;
        }
        if (_violaoSelecionado && !_ritmoSelecionado)
            verificarETocarBateria('', false)
    });
    cifraAvancar.addEventListener('click', function (e) {
        if (_configurandoTeclas) {
            return;
        }
        if (_notasSolo)
            if (!schedule.running)
                playBateria();
    });
    play_pause_bateria.addEventListener('mousedown', function (e) {
        if (_configurandoTeclas) {
            capturarTeclaConfiguracaoTeclas(play_pause_bateria);
            return;
        }

        ativarBotao(play_pause_bateria);

        if (tunerDiv.style.display !== 'none' || _autoMudarRitmo) {
            autoTunerCheck.checked = false;
            //pararOsAcordes();
            play_pause.dispatchEvent(eventoClick);
        }

        if (pararBateriaBotao.style.display !== 'none' && _tocandoBateria === false)
            stopBateria(true);
        else
            tocarBateria();
    });
    bpm.addEventListener('change', function (e) {
        mudarTempoCompasso(false);
        setTempoRitmo();
    });
    bpmRange.addEventListener('input', function (e) {
        bpm.value = parseInt(bpmRange.value);
        _tempo = bpmRange.value;
    });
    bpmRange.addEventListener('change', function (e) {
        setTempoRitmo();
    });
    measureLength.addEventListener('change', (e) => {
        let length = parseInt(measureLength.value);
        if (length < 1) return;

        schedule.measureLength = length;
        let track = schedule.getTrackerValues();
        setupTrackerHtml(currentSampleData, length);
        schedule.measureLength = length;
        schedule.loadTrackerValues(track);
        schedule.setupEvents();
    });

    instrumentoSelect.addEventListener('change', (e) => {
        autoCheck.checked = false;
        try {
            autoCheck.dispatchEvent(eventoChange);
        } catch { }
        stopBateria(true);
        pararOsAcordes();
        gerarRitmosNomes(ritmosNomes);
    });

    $('.base').on('change', function () {
        getSetAudioOptions.setTrackerControls();
    });
}

$('#sampleSet').on('change', function () {
    initializeSampleSet(ctx, this.value);
});

},{"./default-track":14,"./get-set-controls":15,"./simple-tracker":16,"adsr-gain-node":1,"file-saver":3,"get-set-form-values":5,"load-sample-set":7,"select-element":10}],14:[function(require,module,exports){
module.exports = {
  beat: [
        { rowId: "0", colId: "0", enabled: false },
  ],
  settings: {
    sampleSet:
      "./Sons/studio/samples.json",
    measureLength: 16,
    bpm: 90,
    detune: 0,
    gainEnabled: "gain",
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
    filter: 1000
  }
    };

},{}],15:[function(require,module,exports){
    const getSetFormValues = require('get-set-form-values');
    const trackerControls = JSON.parse('{ "": 90, "adsrInterval": 0.1, "attackTime": 0, "bpm": 90, "decayAmp": 0.7, "decayTime": 0, "delay": 0.01, "filter": 1000, "releaseAmp": 1, "releaseTime": 2, "sustainAmp": 0.4, "sustainTime": 2 }');

function getSetControls() {
    this.getTrackerControls = function () {
        return trackerControls;
    }

    this.setTrackerControls = function (values) {
        if (!values) {
            values = this.getTrackerControls();
        }
        this.options = values;
    };
}

module.exports = getSetControls;

},{"get-set-form-values":5}],16:[function(require,module,exports){
const WAAClock = require('waaclock');
const trackerTable = require('./tracker-table');
const hasClass = require('has-class');

/**
 * Construct object
 * @param {audioContext} ctx 
 * @param {function} scheduleAudioBeat funtion when an audio is played
 */
function tracker(ctx, scheduleAudioBeat) {

    this.measureLength = 16;
    this.scheduleAudioBeat = scheduleAudioBeat;
    this.scheduleForward = 0.1;
    this.current = 0;
    this.eventMap = {};
    this.clock = new WAAClock(ctx);
    this.clock.start();
    this.running = false;


    /**
     * Draw a tracker table by numRows and numCols
     */
    this.drawTracker = function(numRows, numCols, data) {
        
        let htmlTable = new trackerTable();

        htmlTable.setRows(numRows, numCols, data);
        let str = htmlTable.getTable();
        
        let t = document.getElementById('tracker-parent');
        t.innerHTML = '';
        t.insertAdjacentHTML('afterbegin', str);
    }


    /**
     * Push current beat one forward
     */
    this.next = function () {
        this.current++;
        if (this.current >= this.measureLength) {
            this.current = 0;
        }
    };


    /**
     * Calculate milli seconds per beat
     */
    this.milliPerBeat = function (beats) {
        if (!beats) {
            beats = 60;
        }
        return 1000 * 60 / beats;
    };


    /**
     * Get a tracker row from a cell-id
     */
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

    /**
     * Mudando as colunas beats
     */
    this.schedule = function () {
        let beatColumn = this.getTrackerRowValues(this.current);
        let now = ctx.currentTime;
        beatColumn.forEach((beat) => {
            this.scheduleBeat(beat, now);
        });
    };

    this.scheduleBeat = function (beat, now) { //tocar os beats
        let triggerTime = now + this.scheduleForward;
        this.scheduleMap[beat.colId] = triggerTime;

        playSolo(beat.colId);

        if (beat.enabled) {
            if (_viradaRitmo !== '') {
            _trocarRitmo = true;
            selecionarRitmo(_viradaRitmo, true);
            }
            if (beat.colId == 0) {
            selecionarRitmo(_ritmoSelecionado);
            _viradaRitmo = '';
        }
            this.eventMap[this.getEventKey(beat)] = this.clock.callbackAtTime(() => {
                this.scheduleAudioBeat(beat.rowId, triggerTime);
            }, now);
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

        let triggerTime = this.scheduleMap[0] + beat.colId * this.milliPerBeat(this.bpm) / 1000;
        let now = ctx.currentTime;
        this.eventMap[this.getEventKey(beat)] = this.clock.callbackAtTime(() => {
            this.scheduleAudioBeat(beat.rowId, triggerTime);
        }, now);
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

    /**
     * Get tracker values
     */
    this.getTrackerValues = function () {
        let values = [];
        let elems = document.querySelectorAll('.tracker-cell');
        elems.forEach(function (e) {
            let val = Object.assign({}, e.dataset);
            val.enabled = hasClass(e, "tracker-enabled");
            values.push(val);
        });
        return values;
    };

    /**
     * Load tracker values in JSON format
     */
    this.loadTrackerValues = function (json) {

        let elems = document.querySelectorAll('.tracker-enabled');
        elems.forEach(function(e) {
            e.classList.remove('tracker-enabled');
        });

        json.forEach(function (data) {
            if (data.enabled === true) {
                let selector = `.tracker-cell[data-row-id="${data.rowId}"][data-col-id="${data.colId}"]`;
                let elem = document.querySelector(selector);
                if (elem) {
                    elem.classList.add("tracker-enabled");
                }
            }
        });
    };

    /**
     * Listen on tracker-cell
     * Schedule if cell is clicked and toggle css class
     */
    this.setupEvents = function () {
        
        let elems = document.querySelectorAll('.tracker-cell');
        
        elems.forEach(function (e) {
            e.addEventListener('click', function(e) {
                let val = Object.assign({}, e.target.dataset);
                val.enabled = hasClass(e.target, "tracker-enabled");
                let currentBeat = e.target.dataset.colId;
                if (val.colId > currentBeat) {
                    this.scheduleAudioBeatNow(val);
                }
                e.target.classList.toggle('tracker-enabled');
            })
        })
    }
}

module.exports = tracker;
},{"./tracker-table":17,"has-class":6,"waaclock":11}],17:[function(require,module,exports){
function trackerTable() {

    this.str = '';
    this.getTable = function () {
        return '<table id="tracker-table">' + this.str + '</table>';
    };

    this.setHeader = function (numRows, data) {
        this.str += `<tr class="tracker-row header">`;
        this.str += this.getCells('header', numRows, { header: true });
        this.str += `</tr>`;

    };

    this.setRows = function (numRows, numCols, data) {

        this.setHeader(numCols, data);
        for (let rowID = 0; rowID < numRows; rowID++) {
            this.str += `<tr class="tracker-row" data-id="${rowID}">`;
            this.str += data.title && (data.title[rowID].includes('baixo') || data.title[rowID].includes('cravo') || data.title[rowID].includes('violao')) ? '' : this.getCells(rowID, numCols, data);
            this.str += `</tr>`;
        }
    };

    this.getFirstCell = function (rowID, data) {
        i++;
        var str = '';
        
        str += `<td class="tracker-first-cell" data-row-id="${rowID}">`;
        if (data.title) {
            str += data.title[rowID];
        }
        
        str += `</td>`;
        return str;
    };
    var i = 0;
    this.getCells = function (rowID, numRows, data) {
        var str = '';
        var num = '';
        str += this.getFirstCell(rowID, data);
        let cssClass = 'tracker-cell';
        if (rowID == 'header') {
            cssClass = 'tracker-cell-header';
        }
        for (let c = 0; c < numRows; c++) {
            if (cssClass == 'tracker-cell') 
                num = i;
            else
                num = '';
            str += `<td class="${cssClass}" data-row-id="${rowID}" data-col-id="${c}">${num}`;
            i++;
            if (data.header) {
                str += c + 1;
            }
            str += `</td>`;
        }
        return str;
    };
}

module.exports = trackerTable;

},{}],18:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[13])

