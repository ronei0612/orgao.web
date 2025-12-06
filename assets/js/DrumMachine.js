class DrumMachine {
    constructor(baseUrl, cifraPlayer, musicTheory) {
        this.baseUrl = baseUrl;
        this.cifraPlayer = cifraPlayer;
        this.musicTheory = musicTheory;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.buffers = new Map();
        this.audioPath = this.baseUrl + '/assets/audio/studio/Drums/';
        this.instruments = [
            { name: 'Prato', icon: 'prato.svg', file: this.audioPath + 'ride.ogg', somAlternativo: this.audioPath + 'prato2.ogg' },
            { name: 'Tom', icon: 'tom.svg', file: this.audioPath + 'tom-03.ogg', somAlternativo: this.audioPath + 'tom-02.ogg' },
            { name: 'Surdo', icon: 'surdo.svg', file: this.audioPath + 'tom.ogg', somAlternativo: this.audioPath + 'prato1.ogg' },
            { name: 'Chimbal', icon: 'chimbal.svg', file: this.audioPath + 'chimbal.ogg', somAlternativo: this.audioPath + 'aberto.ogg' },
            { name: 'Caixa', icon: 'caixa.svg', file: this.audioPath + 'caixa.ogg', somAlternativo: this.audioPath + 'aro.ogg' },
            { name: 'Bumbo', icon: 'bumbo.svg', file: this.audioPath + 'bumbo.ogg', somAlternativo: null },
            { name: 'Meia-Lua', icon: 'meiaLua.svg', file: this.audioPath + 'meialua.ogg', somAlternativo: this.audioPath + 'meialua2.ogg' },
            { name: 'Violao-Baixo', icon: 'violao.svg', file: null, somAlternativo: 'violao_' },
            { name: 'Violao-Cima', icon: 'violao.svg', file: null, somAlternativo: 'violao_' },
            { name: 'Baixo', icon: 'baixo.svg', file: null, somAlternativo: null }
        ];
        this.isPlaying = false;
        this.currentStep = 1;
        this.nextNoteTime = 0;
        this.scheduleAheadTime = 0.1;
        this.lookahead = 25.0;
        this.bpm = 90;
        this.numSteps = 16;
        this.animationFrameId = null;
        this.lastDrawTime = 0;
        this.lastChimbalAbertoSource = null;
        this.styles = null;
        this.atrasoMudarNota = 0.03; // 30ms

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
        } catch (err) {
            console.warn('DrumMachine: não foi possível carregar styles.json, mantendo comportamento padrão.', err);
            // fallback mínimo: mantém this.styles como null ou vazio para que UI trate
            this.styles = this.styles || null;
        }

        this.updateFillBlink(this.bpm);
    }

    // opcional helper para acessar styles seguro
    getStyles() {
        return this.styles;
    }

    async loadSounds() {
        const loadPromises = [];

        // 1) carregar samples de percussão/others definidos em this.instruments
        this.instruments.forEach(instrument => {
            if (!instrument.file) return;
            loadPromises.push((async () => {
                const response = await fetch(instrument.file);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                this.buffers.set(instrument.name.toLowerCase(), audioBuffer);

                if (instrument.somAlternativo) {
                    const responseAlt = await fetch(instrument.somAlternativo);
                    const arrayBufferAlt = await responseAlt.arrayBuffer();
                    const audioBufferAlt = await this.audioContext.decodeAudioData(arrayBufferAlt);
                    this.buffers.set(instrument.name.toLowerCase() + '-alt', audioBufferAlt);
                }
            })());
        });

        const notas = this.musicTheory.notas;
        notas.forEach(nota => {
            var instrument = 'baixo';
            const baixoFileName = `${this.audioPath}/${instrument}_${nota}.ogg`;
            loadPromises.push((async () => {
                const resp = await fetch(baixoFileName);
                const arrayBuffer = await resp.arrayBuffer();
                const buffer = await this.audioContext.decodeAudioData(arrayBuffer);
                this.buffers.set(`baixo_${nota}`, buffer);
            })());

            instrument = 'violao';
            const violaoFileName = `${this.audioPath}/${instrument}_${nota}.ogg`;
            loadPromises.push((async () => {
                const resp = await fetch(violaoFileName);
                const arrayBuffer = await resp.arrayBuffer();
                const buffer = await this.audioContext.decodeAudioData(arrayBuffer);
                this.buffers.set(`${instrument}-baixo_${nota}`, buffer);
            })());

            const violao1FileName = `${this.audioPath}/${instrument}_${nota}1.ogg`;
            loadPromises.push((async () => {
                const resp = await fetch(violao1FileName);
                const arrayBuffer = await resp.arrayBuffer();
                const buffer = await this.audioContext.decodeAudioData(arrayBuffer);
                this.buffers.set(`${instrument}-cima_${nota}`, buffer);
            })());

            const violaoFileNameMenor = `${this.audioPath}/${instrument}_${nota}m.ogg`;
            loadPromises.push((async () => {
                const resp = await fetch(violaoFileNameMenor);
                const arrayBuffer = await resp.arrayBuffer();
                const buffer = await this.audioContext.decodeAudioData(arrayBuffer);
                this.buffers.set(`${instrument}-baixo_${nota}m`, buffer);
            })());

            const violao1FileNameMenor = `${this.audioPath}/${instrument}_${nota}m1.ogg`;
            loadPromises.push((async () => {
                const resp = await fetch(violao1FileNameMenor);
                const arrayBuffer = await resp.arrayBuffer();
                const buffer = await this.audioContext.decodeAudioData(arrayBuffer);
                this.buffers.set(`${instrument}-cima_${nota}m`, buffer);
            })());
        });

        const violaoAlt = `${this.audioPath}/violao_.ogg`;
        const responseViolaoAlt = await fetch(violaoAlt);
        const arrayBufferViolaoAlt = await responseViolaoAlt.arrayBuffer();
        const audioBufferViolaoAlt = await this.audioContext.decodeAudioData(arrayBufferViolaoAlt);
        this.buffers.set('violao-baixo-alt', audioBufferViolaoAlt);
        this.buffers.set('violao-cima-alt', audioBufferViolaoAlt);

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
                this.playSound(buffer, time, 1, instrument === 'chimbal');
            }
        }
        else {
            if (!this.playBass(instrument, time, volume) && !this.playViolao(instrument, time, volume)) {
                const buffer = this.buffers.get(instrument);
                if (buffer && volume > 0) {
                    this.playSound(buffer, time, volume === 2 ? 0.3 : 1);
                }
            }
        }
    }

    nextNote() {
        const secondsPerQuarterNote = 60.0 / this.bpm;
        const secondsPerStep = secondsPerQuarterNote / 4;
        this.nextNoteTime += secondsPerStep;
        this.currentStep++;

        if (this.currentStep > this.numSteps) {
            this.currentStep = 1;
            if (this.onStepsEnd) {
                this.fecharChimbal();
                this.onStepsEnd();
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

            if (step.classList.contains('active') || step.classList.contains('low-volume') || step.classList.contains('third-volume'))
                this.playEpiano();

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

    playBass(instrument, time, volume) {
        if (instrument === 'baixo' && this.cifraPlayer.acordeTocando) {
            const bass = instrument + '_' + this.cifraPlayer.baixo;
            const buffer = this.buffers.get(bass);
            if (buffer && volume > 0) {
                //const delayedTime = (this.currentStep === 1) ? time + this.atrasoMudarNota : time;
                //this.playSound(buffer, delayedTime, volume === 2 ? 0.3 : 1);
                this.playSound(buffer, time, volume === 2 ? 0.4 : 1);
                return true;
            }
        }
        return false;
    }

    playViolao(instrument, time, volume) {
        if (instrument.includes('violao') && this.cifraPlayer.acordeTocando) {
            const violao = instrument + '_' + this.cifraPlayer.acordeTocando;
            const buffer = this.buffers.get(violao);
            if (buffer && volume > 0) {
                //const delayedTime = (this.currentStep === 1) ? time + this.atrasoMudarNota : time;
                //this.playSound(buffer, delayedTime, volume === 2 ? 0.3 : 1);
                this.playSound(buffer, time, volume === 2 ? 0.4 : 1);
                return true;
            }
        }
        return false;
    }

    playEpiano() {
        if (this.cifraPlayer.epianoGroup.length > 0) {
            if (this.cifraPlayer.tocarEpiano)
                this.cifraPlayer.epianoPlay();
        }
    }

}