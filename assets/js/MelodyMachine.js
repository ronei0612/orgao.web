class MelodyMachine {
    constructor(baseUrl, musicTheory) {
        this.baseUrl = baseUrl;
        this.musicTheory = musicTheory;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.buffers = new Map();

        // Caminho dos áudios
        this.audioPath = this.baseUrl + '/assets/audio/Orgao/';

        this.instruments = [
            { note: 'B2', index: 13, name: 'orgao', octave: '' },
            { note: 'A2', index: 12, name: 'orgao', octave: '' },
            { note: 'G2', index: 11, name: 'orgao', octave: '' },
            { note: 'F2', index: 10, name: 'orgao', octave: '' },
            { note: 'E2', index: 9, name: 'orgao', octave: '' },
            { note: 'D2', index: 8, name: 'orgao', octave: '' },
            { note: 'C2', index: 7, name: 'orgao', octave: '' },
            { note: 'B1', index: 6, name: 'orgao', octave: 'baixo' },
            { note: 'A1', index: 5, name: 'orgao', octave: 'baixo' },
            { note: 'G1', index: 4, name: 'orgao', octave: 'baixo' },
            { note: 'F1', index: 3, name: 'orgao', octave: 'baixo' },
            { note: 'E1', index: 2, name: 'orgao', octave: 'baixo' },
            { note: 'D1', index: 1, name: 'orgao', octave: 'baixo' },
            { note: 'C1', index: 0, name: 'orgao', octave: 'baixo' }
        ];

        this.isPlaying = false;
        this.currentStep = 1;
        this.nextNoteTime = 0;
        this.scheduleAheadTime = 0.1;
        this.lookahead = 25.0;
        this.bpm = 90;
        this.numSteps = 16;
        this.timerInterval = null;
        this.styles = null;
        this.stepsPorTempo = null;
        this.tracksCache = null;

        // MONOFONIA: Armazena apenas a nota atual
        this.currentSource = null;

        this.init();
    }

    async init() {
        await this.loadSounds();
        await this.getStyles();
        this.updateFillBlink(this.bpm);
    }

    async getStyles() {
        const stylesUrl = `${this.baseUrl}/styles.json`;
        try {
            const resp = await fetch(stylesUrl);
            if (!resp.ok) {
                this.styles = null;
                return;
            }
            this.styles = await resp.json();
        } catch (err) {
            this.styles = null;
        }
    }

    async loadSounds() {
        const loadPromises = [];

        this.instruments.forEach(instrument => {
            loadPromises.push((async () => {
                const nota = instrument.note[0].toLowerCase();
                const fileName = `${instrument.name}_${nota}${instrument.octave ? '_' + instrument.octave : ''}`;
                const file = `${this.audioPath}${fileName}.ogg`;
                try {
                    const response = await fetch(file);
                    const arrayBuffer = await response.arrayBuffer();
                    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                    this.buffers.set(fileName, audioBuffer);
                } catch (error) {
                    console.warn(`Erro ao carregar som: ${file}`);
                }
            })());
        });

        await Promise.all(loadPromises);
    }

    // Retorna o objeto source/gain para controle
    playSound(buffer, time, volume = 1) {
        if (!buffer) return null;

        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();

        source.buffer = buffer;
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        source.start(time);

        source.onended = () => {
            source.disconnect();
            gainNode.disconnect();
        };

        return { source, gainNode };
    }

    scheduleNote(instrumentKey, step, time, volume) {
        const buffer = this.buffers.get(instrumentKey);
        if (buffer && volume > 0) {
            // Retorna o objeto do som para ser controlado
            return this.playSound(buffer, time, volume === 2 ? 0.3 : 1.0);
        }
        return null;
    }

    // NOVA FUNÇÃO: Para a nota atual imediatamente (com fade suave)
    stopCurrentNote(time) {
        if (this.currentSource) {
            const { source, gainNode } = this.currentSource;
            try {
                // Fade out rápido de 0.05s para evitar estalo
                gainNode.gain.cancelScheduledValues(time);
                gainNode.gain.setValueAtTime(gainNode.gain.value, time);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
                source.stop(time + 0.06);
            } catch (e) {
                // Ignora se já parou
            }
            this.currentSource = null;
        }
    }

    nextNote() {
        const secondsPerQuarterNote = 60.0 / this.bpm;
        const secondsPerStep = secondsPerQuarterNote / 4;
        this.nextNoteTime += secondsPerStep;
        this.currentStep++;

        if (this.currentStep > this.numSteps) {
            this.currentStep = 1;
            if (typeof this.onStepsEnd === 'function') {
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

    scheduleCurrentStep() {
        if (!this.tracksCache) {
            this.refreshTrackCache();
        }

        const stepIndex = this.currentStep - 1;
        let foundNote = null;

        // 1. Procura UMA nota para tocar neste step (Monofonia)
        if (this.tracksCache) {
            for (let i = 0; i < this.tracksCache.length; i++) {
                const trackData = this.tracksCache[i];

                if (!trackData.instrument || !trackData.button.classList.contains('selected')) continue;

                const stepEl = trackData.steps[stepIndex];
                if (!stepEl) continue;

                const volume = parseInt(stepEl.dataset.volume || '0', 10);

                if (volume > 0) {
                    foundNote = {
                        instrument: trackData.instrument,
                        volume: volume,
                        element: stepEl
                    };
                    break; // Encontrou a nota prioritária, para de procurar
                }
            }
        }

        // 2. Se encontrou uma nova nota para este step
        if (foundNote) {
            // Para a nota anterior exatamente quando a nova começa
            this.stopCurrentNote(this.nextNoteTime);

            // Toca a nova e guarda referência
            this.currentSource = this.scheduleNote(
                foundNote.instrument,
                this.currentStep,
                this.nextNoteTime,
                foundNote.volume
            );

            // Feedback visual
            foundNote.element.classList.add('playing');
            setTimeout(() => foundNote.element.classList.remove('playing'), 100);
        }
    }

    refreshTrackCache() {
        const tracksContainer = document.getElementById('melodyTracks');
        if (!tracksContainer) return;

        this.tracksCache = Array.from(tracksContainer.children).map(trackEl => {
            const label = trackEl.querySelector('.track-label span');
            const instrument = label ? label.dataset.instrument : null;
            const button = trackEl.querySelector('.instrument-button');
            const steps = Array.from(trackEl.querySelectorAll('.step'));

            return { instrument, button, steps };
        });
    }

    start() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.isPlaying = true;
        this.currentStep = 1;
        this.nextNoteTime = this.audioContext.currentTime + 0.1;

        this.refreshTrackCache();

        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => this.scheduler(), this.lookahead);
    }

    // CORREÇÃO AQUI
    stop() {
        this.isPlaying = false;

        // 1. Para o agendador (Relógio)
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // 2. CORREÇÃO: Para o som que está tocando AGORA imediatamente
        this.stopCurrentNote(this.audioContext.currentTime);

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
        this.tracksCache = null;
    }

    updateFillBlink(bpm) {
        const secPerBeat = 60 / bpm;
        document.documentElement.style.setProperty('--fill-blink-duration', `${secPerBeat}s`);
    }
}