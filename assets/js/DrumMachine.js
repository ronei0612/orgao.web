var audioPath = location.origin.includes('file:') ? 'https://roneicostasoares.com.br/orgao.web/assets/audio/studio/Drums/' : './assets/audio/studio/Drums/';
class DrumMachine {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.buffers = new Map();
        this.instruments = [
            { name: 'Prato', icon: 'prato.svg', file: audioPath + 'ride.ogg', file3: audioPath + 'prato2.ogg' },
            { name: 'Tom', icon: 'tom.svg', file: audioPath + 'tom-03.ogg', file3: audioPath + 'tom-02.ogg' },
            { name: 'Surdo', icon: 'tom.svg', file: audioPath + 'tom.ogg', file3: audioPath + 'prato1.ogg' },
            { name: 'Chimbal', icon: 'chimbal.svg', file: audioPath + 'chimbal.ogg', file3: audioPath + 'aberto.ogg' },
            { name: 'Caixa', icon: 'caixa.svg', file: audioPath + 'caixa.ogg', file3: audioPath + 'aro.ogg' },
            { name: 'Bumbo', icon: 'bumbo.svg', file: audioPath + 'bumbo.ogg', file3: null },
            { name: 'Meia-Lua', icon: 'meiaLua.svg', file: audioPath + 'meialua.ogg', file3: null },
            { name: 'Violao', icon: 'violao.svg', file: audioPath + 'bumbo.ogg', file3: null },
            { name: 'Guitarra', icon: 'guitarra.svg', file: audioPath + 'bumbo.ogg', file3: null },
            { name: 'Strings', icon: 'strings.svg', file: audioPath + 'bumbo.ogg', file3: null },
            { name: 'Baixo', icon: 'baixo.svg', file: audioPath + 'bumbo.ogg', file3: null },
            { name: 'E-Piano', icon: 'piano.svg', file: audioPath + 'bumbo.ogg', file3: null }
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

        this.init();
    }

    async init() {
        await this.loadSounds();
    }

    async loadSounds() {
        const loadPromises = this.instruments.map(async instrument => {
            const response = await fetch(instrument.file);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.buffers.set(instrument.name.toLowerCase(), audioBuffer);
            // Carrega o terceiro som se existir
            if (instrument.file3) {
                const response3 = await fetch(instrument.file3);
                const arrayBuffer3 = await response3.arrayBuffer();
                const audioBuffer3 = await this.audioContext.decodeAudioData(arrayBuffer3);
                this.buffers.set(instrument.name.toLowerCase() + '-3', audioBuffer3);
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
            // Terceiro som
            if (instrument === 'chimbal') {
                const buffer = this.buffers.get('chimbal-3');
                if (buffer) this.playSound(buffer, time, 1, true);
            } else if (instrument === 'caixa') {
                const buffer = this.buffers.get('caixa-3');
                if (buffer) this.playSound(buffer, time, 1);
            } else if (instrument === 'bumbo') {
                // Não faz nada
            } else if (instrument === 'prato') {
                const buffer = this.buffers.get('prato-3');
                if (buffer) this.playSound(buffer, time, 1);
            }
        } else {
            const buffer = this.buffers.get(instrument);
            if (buffer && volume > 0) {
                this.playSound(buffer, time, volume === 2 ? 0.3 : 1);
            }
        }
    }

    nextNote() {
        const secondsPerBeat = 60.0 / this.bpm;
        this.nextNoteTime += secondsPerBeat;
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

    scheduleCurrentStep() {
        document.querySelectorAll('.track').forEach(track => {
            const instrument = track.querySelector('label img').title.toLowerCase().replace(/ /g, '');
            const step = track.querySelector(`.step[data-step="${this.currentStep}"]`);
            const instrumentButton = track.querySelector('.instrument-button'); // Pega o botão do instrumento
            if (!step) return;
            const volume = parseInt(step.dataset.volume);
            if (isNaN(volume) || volume <= 0) return;

            // Verifica se o instrumento está selecionado (adicione esta linha!)
            if (!instrumentButton.classList.contains('selected')) return;

            // Chimbal: se o anterior foi aberto e o atual for fechado, pare o som aberto
            if (instrument === 'chimbal') {
                const prevStepNum = this.currentStep === 1 ? this.numSteps : this.currentStep - 1;
                const prevStep = track.querySelector(`.step[data-step="${prevStepNum}"]`);
                if (prevStep) {
                    const prevVolume = parseInt(prevStep.dataset.volume);
                    if (prevVolume === 3 && (volume === 1 || volume === 2)) {
                        if (this.lastChimbalAbertoSource) {
                            try { this.lastChimbalAbertoSource.stop(); } catch { }
                            this.lastChimbalAbertoSource = null;
                        }
                    }
                }
            }

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
        this.bpm = bpm * 2;
    }

    setNumSteps(steps) {
        this.numSteps = steps;
        this.currentStep = 1;
    }
}