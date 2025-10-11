var audioPath = location.origin.includes('file:') ? 'https://roneicostasoares.com.br/orgao.web/assets/audio/studio/Drums/' : './assets/audio/studio/Drums/';
class DrumMachine {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.buffers = new Map();
        this.instruments = [
            { name: 'Chimbal', icon: 'fas fa-record-vinyl', file: audioPath + 'chimbal.ogg', file3: audioPath + 'aberto.ogg' },
            { name: 'Caixa', icon: 'fas fa-drum', file: audioPath + 'caixa.ogg', file3: audioPath + 'aro.ogg' },
            { name: 'Bumbo', icon: 'fas fa-stroopwafel', file: audioPath + 'bumbo.ogg', file3: null },
            { name: 'Prato', icon: 'fas fa-compact-disc', file: audioPath + 'ride.ogg', file3: audioPath + 'prato1.ogg' }
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

    playSound(buffer, time, volume = 1) {
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();

        source.buffer = buffer;
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        source.start(time);
    }

    scheduleNote(instrument, step, time, volume) {
        if (volume === 3) {
            // Terceiro som
            if (instrument === 'chimbal') {
                const buffer = this.buffers.get('chimbal-3');
                if (buffer) this.playSound(buffer, time, 1);
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
            const instrument = track.querySelector('label i').title.toLowerCase().replace(/ /g, '');
            const step = track.querySelector(`.step[data-step="${this.currentStep}"]`);
            if (!step) return;
            
            const volume = parseInt(step.dataset.volume);
            if (isNaN(volume) || volume <= 0) return;

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