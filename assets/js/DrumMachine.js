class DrumMachine {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.buffers = new Map();
        const audioPath = this.baseUrl + '/assets/audio/studio/Drums/';
        this.instruments = [
            { name: 'Prato', icon: 'prato.svg', file: audioPath + 'ride.ogg', somAlternativo: audioPath + 'prato2.ogg' },
            { name: 'Tom', icon: 'tom.svg', file: audioPath + 'tom-03.ogg', somAlternativo: audioPath + 'tom-02.ogg' },
            { name: 'Surdo', icon: 'surdo.svg', file: audioPath + 'tom.ogg', somAlternativo: audioPath + 'prato1.ogg' },
            { name: 'Chimbal', icon: 'chimbal.svg', file: audioPath + 'chimbal.ogg', somAlternativo: audioPath + 'aberto.ogg' },
            { name: 'Caixa', icon: 'caixa.svg', file: audioPath + 'caixa.ogg', somAlternativo: audioPath + 'aro.ogg' },
            { name: 'Bumbo', icon: 'bumbo.svg', file: audioPath + 'bumbo.ogg', somAlternativo: null },
            { name: 'Meia-Lua', icon: 'meiaLua.svg', file: audioPath + 'meialua.ogg', somAlternativo: audioPath + 'meialua2.ogg' },
            { name: 'Violao', icon: 'violao.svg', file: audioPath + 'bumbo.ogg', somAlternativo: null },
            /*{ name: 'Guitarra', icon: 'guitarra.svg', file: audioPath + 'bumbo.ogg', somAlternativo: null },*/
            { name: 'Baixo', icon: 'baixo.svg', file: audioPath + 'bumbo.ogg', somAlternativo: null }
        ];
        this.isPlaying = false;
        this.currentStep = 1;
        this.nextNoteTime = 0;
        this.scheduleAheadTime = 0.1;
        this.lookahead = 25.0;
        this.bpm = 90;
        this.numSteps = 4;
        this.animationFrameId = null;
        this.lastDrawTime = 0;
        this.lastChimbalAbertoSource = null;
        this.styles = null; // será preenchido em init()

        this.init();
    }

    async init() {
        await this.loadSounds();

        // Carrega os styles/ritmos da web (styles.json) — mesmo padrão de fetch usado em App.loadCifrasLocal
        const stylesUrl = `${this.baseUrl}/styles.json`;
        try {
            const resp = await fetch(stylesUrl);
            if (!resp.ok) {
                throw new Error(`Falha ao carregar styles.json: ${resp.status}`);
            }
            this.styles = await resp.json();
            console.log(`DrumMachine: ${Array.isArray(this.styles) ? this.styles.length : 'styles carregados'}`);
        } catch (err) {
            console.warn('DrumMachine: não foi possível carregar styles.json, mantendo comportamento padrão.', err);
            // fallback mínimo: mantém this.styles como null ou vazio para que UI trate
            this.styles = this.styles || null;
        }
    }

    // opcional helper para acessar styles seguro
    getStyles() {
        return this.styles;
    }

    async loadSounds() {
        const loadPromises = this.instruments.map(async instrument => {
            const response = await fetch(instrument.file);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.buffers.set(instrument.name.toLowerCase(), audioBuffer);

            if (instrument.somAlternativo) {
                const response3 = await fetch(instrument.somAlternativo);
                const arrayBuffer3 = await response3.arrayBuffer();
                const audioBuffer3 = await this.audioContext.decodeAudioData(arrayBuffer3);
                this.buffers.set(instrument.name.toLowerCase() + '-alt', audioBuffer3);
            }
        });

        await Promise.all(loadPromises);
    }

    playSound(buffer, time, volume = 1, isChimbalAberto = false) {
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();

        source.buffer = buffer;
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        source.start(time);

        if (isChimbalAberto) {
            this.lastChimbalAbertoSource = source;
        }
    }

    scheduleNote(instrument, step, time, volume) {
        if (volume === 3) {
            const buffer = this.buffers.get(instrument + '-alt');
            if (buffer) {
                this.playSound(buffer, time, 1, true);
            }
        } else {
            const buffer = this.buffers.get(instrument);
            if (buffer && volume > 0) {
                this.playSound(buffer, time, volume === 2 ? 0.3 : 1);
            }
        }
    }

    nextNote() {
        const secondsPerQuarterNote = 60.0 / this.bpm;
        const secondsPerStep = secondsPerQuarterNote / 2;
        this.nextNoteTime += secondsPerStep;
        this.currentStep++;

        if (this.currentStep > this.numSteps) {
            this.currentStep = 1;
            if (this.onMeasureEnd) {
                this.onMeasureEnd();
            }
        }
    }

    scheduler() {
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
            this.scheduleCurrentStep();
            this.nextNote();
        }
    }

    fecharChimbal(instrument, volume) {
        if (instrument !== 'chimbal') return;

        if (volume === 1 || volume === 2) {
            if (this.lastChimbalAbertoSource) {
                try {
                    this.lastChimbalAbertoSource.stop(0);
                } catch (e) {
                    // Ignore se ja parou
                }
                this.lastChimbalAbertoSource = null;
            }
        }
    }

    scheduleCurrentStep() {
        document.querySelectorAll('.track').forEach(track => {
            const instrument = track.querySelector('label img').title.toLowerCase().replace(/ /g, '');
            const step = track.querySelector(`.step[data-step="${this.currentStep}"]`);
            const instrumentButton = track.querySelector('.instrument-button');
            if (!step || !instrumentButton.classList.contains('selected')) return;

            const volume = parseInt(step.dataset.volume);
            if (isNaN(volume) || volume <= 0) return;

            this.fecharChimbal(instrument, volume);

            this.scheduleNote(instrument, this.currentStep, this.nextNoteTime, volume);
            step.classList.add('playing');
            setTimeout(() => step.classList.remove('playing'), 100);
        });
    }

    timerWorker() {
        if (!this.isPlaying) {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
            return;
        }

        const currentTime = performance.now();
        if (currentTime - this.lastDrawTime >= this.lookahead) {
            this.scheduler();
            this.lastDrawTime = currentTime;
        }

        this.animationFrameId = requestAnimationFrame(() => this.timerWorker());
    }

    start() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.isPlaying = true;
        this.currentStep = 1;
        this.nextNoteTime = this.audioContext.currentTime;
        this.lastDrawTime = performance.now();
        this.timerWorker();
    }

    stop() {
        this.isPlaying = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.reset();
    }

    reset() {
        this.currentStep = 1;
        this.nextNoteTime = 0;
    }

    setBPM(bpm) {
        this.bpm = bpm;
        this.updateFillBlink(bpm);
    }

    setNumSteps(steps) {
        this.numSteps = steps;
    }

    updateFillBlink(bpm) {
        const secPerBeat = 60 / bpm;
        document.documentElement.style.setProperty('--fill-blink-duration', `${secPerBeat}s`);
    }
}