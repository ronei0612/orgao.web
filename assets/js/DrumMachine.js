var audioPath = location.origin.includes('file:') ? 'https://roneicostasoares.com.br/orgao.web/assets/audio/studio/Drums/' : './assets/audio/studio/Drums/';
class DrumMachine {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.buffers = new Map();
        this.instruments = [
            { name: 'Hi-hat', icon: 'fas fa-hippo', file: audioPath + 'chimbal.ogg' },
            { name: 'Caixa', icon: 'fas fa-drum', file: audioPath + 'caixa.ogg' },
            { name: 'Bombo', icon: 'fas fa-compact-disc', file: audioPath + 'bumbo.ogg' },
            { name: 'Ride', icon: 'fas fa-bicycle', file: audioPath + 'ride.ogg' }
        ];
        this.isPlaying = false;
        this.currentStep = 1;
        this.nextNoteTime = 0;
        this.scheduleAheadTime = 0.1;
        this.lookahead = 25.0;
        this.bpm = 90;
        this.numSteps = 4;

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
        const buffer = this.buffers.get(instrument);
        if (buffer && volume > 0) {
            this.playSound(buffer, time, volume === 2 ? 0.3 : 1);
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
            document.querySelectorAll('.track').forEach(track => {
                const instrument = track.querySelector('label i').title.toLowerCase().replace(/ /g, '');
                const step = track.querySelector(`.step[data-step="${this.currentStep}"]`);
                if (!step) return;
                const volume = parseInt(step.dataset.volume);
                if (isNaN(volume) || volume <= 0) return;

                this.scheduleNote(instrument, this.currentStep, this.nextNoteTime, volume);

                // Efeito de piscar: adiciona 'playing' e remove após 100ms
                step.classList.add('playing');
                setTimeout(() => {
                    step.classList.remove('playing');
                }, 100);
            });

            this.nextNote();
        }
    }

    start() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.isPlaying = true;
        this.currentStep = this.numSteps;
        this.nextNoteTime = this.audioContext.currentTime;
        this.scheduler();
        this.timerWorker();
    }

    stop() {
        this.isPlaying = false;
        // Remover visual feedback
        // document.querySelectorAll('.step.playing').forEach(step => {
        //     step.classList.remove('playing');
        // });
    }

    timerWorker() {
        if (this.isPlaying) {
            this.scheduler();
            setTimeout(() => this.timerWorker(), this.lookahead);
        }
    }

    setBPM(bpm) {
        this.bpm = bpm;
    }

    setNumSteps(steps) {
        this.numSteps = steps;
        this.currentStep = 1;
    }
}