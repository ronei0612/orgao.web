class BateriaUI {
    constructor(drumMachine, uiController) {
        this.uiController = uiController;
        this.drumMachine = drumMachine;

        this.bpmInput = document.getElementById('bpm');
        this.numStepsInput = document.getElementById('num-steps');
        this.tracksContainer = document.getElementById('tracks');
        this.rhythmButtons = Array.from(document.querySelectorAll('.rhythm-button'));
        this.saveRhythmButton = document.getElementById('save-rhythm');

        this.styleSelect = document.getElementById('style');
        this.addStyleButton = document.getElementById('addStyle');
        this.editStyleButton = document.getElementById('editStyle');
        this.deleteStyleButton = document.getElementById('deleteStyle');

        this.copyRhythmButton = document.getElementById('copy-rhythm');
        this.pasteRhythmButton = document.getElementById('paste-rhythm');

        // State
        this.selectedRhythm = 'A';
        this.pendingRhythm = null;
        this.pendingButton = null;
        this.fillLoaded = false;
        this.defaultStyle = 'Novo Estilo';
        this.copiedRhythmData = null;
        this.rhythmButtonClicks = {};
    }

    async init() {
        // Initialize drumMachine state
        this.drumMachine.setBPM(parseInt(this.bpmInput.value, 10) || 90);
        this.drumMachine.setNumSteps(parseInt(this.numStepsInput.value, 10) || 4);

        // Create blank styles and rhythms if none exist
        this.ensureDefaultStyleExists();

        // Load UI state
        this.loadStyles();
        this.initializeTracks();
        this.bindEvents();

        // Add message listener for parent-frame control (play/stop/toggle)
        window.addEventListener('message', this.handleIncomingMessage.bind(this), false);

        // Load the initially selected rhythm for the selected style
        const initialStyle = this.styleSelect.value || this.defaultStyle;
        this.loadRhythmForStyleAndRhythm(initialStyle, this.selectedRhythm);
    }

    // Handle messages from parent window (index.html)
    handleIncomingMessage(event) {
        // Optional: verify origin if needed: if (event.origin !== expectedOrigin) return;
        const msg = event.data;
        if (!msg) return;

        switch (msg) {
            case 'bateria-toggle':
                this.togglePlay();
                break;
            case 'bateria-play':
                if (!this.drumMachine.isPlaying) this.togglePlay();
                break;
            case 'bateria-stop':
                if (this.drumMachine.isPlaying) this.togglePlay();
                break;
            default:
                // allow structured messages in future
                if (typeof msg === 'object' && msg?.action === 'bateria-play-style') {
                    // e.g. { action: 'bateria-play-style', style: 'MeuEstilo', rhythm: 'A' }
                    const style = msg.style || this.styleSelect.value;
                    const rhythm = msg.rhythm || this.selectedRhythm;
                    this.loadRhythm(`${style}-${rhythm}`);
                    if (!this.drumMachine.isPlaying) this.togglePlay();
                }
                break;
        }
    }

    // Utilities
    getInstrumentKeyFromTrack(track) {
        const img = track.querySelector('label img');
        if (!img || !img.title) return null;
        return img.title.toLowerCase().replace(/ /g, '');
    }

    ensureDefaultStyleExists() {
        const styles = JSON.parse(localStorage.getItem('styles') || '[]');
        if (!styles || styles.length === 0) {
            localStorage.setItem('styles', JSON.stringify([this.defaultStyle]));
            // ensure rhythm keys exist for default style
            ['A', 'B', 'C', 'D'].forEach(r => {
                const key = `${this.defaultStyle}-${r}`;
                const fillKey = `${this.defaultStyle}-${r}-fill`;
                if (!localStorage.getItem(key)) {
                    const bpm = parseInt(this.bpmInput.value, 10) || 90;
                    const numSteps = parseInt(this.numStepsInput.value, 10) || 4;
                    this.saveRhythmToStyle(this.defaultStyle, r, this.createEmptyRhythm(bpm, numSteps));
                    this.saveRhythmToStyle(this.defaultStyle, `${r}-fill`, this.createEmptyRhythm(bpm, numSteps));
                }
            });
        }
    }

    createEmptyRhythm(bpm, numSteps) {
        const rhythmData = {};
        (this.drumMachine.instruments || []).forEach(inst => {
            rhythmData[inst.name.toLowerCase().replace(/ /g, '')] = Array(numSteps).fill(0);
        });
        rhythmData.bpm = bpm;
        rhythmData.numSteps = numSteps;
        return rhythmData;
    }

    // Styles (localStorage)
    loadStyles() {
        const styles = JSON.parse(localStorage.getItem('styles') || '[]');
        this.styleSelect.innerHTML = '';
        if (!styles.length) {
            const option = document.createElement('option');
            option.value = this.defaultStyle;
            option.textContent = this.defaultStyle;
            this.styleSelect.appendChild(option);
            this.styleSelect.value = this.defaultStyle;
            return;
        }
        const sorted = styles.slice().sort((a, b) => a.localeCompare(b));
        sorted.forEach(s => {
            const option = document.createElement('option');
            option.value = s;
            option.textContent = s;
            this.styleSelect.appendChild(option);
        });
        this.styleSelect.selectedIndex = 0;
    }

    saveStyles() {
        const styles = Array.from(this.styleSelect.options).map(o => o.value);
        localStorage.setItem('styles', JSON.stringify(styles));
    }

    addStyle() {
        const newName = prompt('Digite o nome do novo estilo:');
        if (!newName) return;
        const styles = JSON.parse(localStorage.getItem('styles') || '[]');
        if (styles.includes(newName)) {
            alert('Este nome de estilo já existe.');
            return;
        }
        styles.push(newName);
        localStorage.setItem('styles', JSON.stringify(styles));
        this.saveStyles();
        // create blank rhythms
        const bpm = parseInt(this.bpmInput.value, 10) || 90;
        const numSteps = parseInt(this.numStepsInput.value, 10) || 4;
        ['A', 'B', 'C', 'D'].forEach(r => {
            this.saveRhythmToStyle(newName, r, this.createEmptyRhythm(bpm, numSteps));
            this.saveRhythmToStyle(newName, `${r}-fill`, this.createEmptyRhythm(bpm, numSteps));
        });
        this.loadStyles();
        this.styleSelect.value = newName;
    }

    editStyle() {
        const current = this.styleSelect.value;
        const newName = prompt('Digite o novo nome para o estilo:', current);
        if (!newName || newName === current) return;
        const styles = JSON.parse(localStorage.getItem('styles') || '[]');
        if (styles.includes(newName)) {
            alert('Este nome de estilo já existe.');
            return;
        }
        const idx = styles.indexOf(current);
        if (idx !== -1) styles[idx] = newName;
        localStorage.setItem('styles', JSON.stringify(styles));
        // rename rhythms
        ['A', 'B', 'C', 'D'].forEach(r => {
            const oldKey = `${current}-${r}`;
            const newKey = `${newName}-${r}`;
            const oldFill = `${current}-${r}-fill`;
            const newFill = `${newName}-${r}-fill`;
            const data = localStorage.getItem(oldKey);
            if (data) { localStorage.setItem(newKey, data); localStorage.removeItem(oldKey); }
            const fdata = localStorage.getItem(oldFill);
            if (fdata) { localStorage.setItem(newFill, fdata); localStorage.removeItem(oldFill); }
        });
        this.loadStyles();
        this.styleSelect.value = newName;
    }

    deleteStyle() {
        const current = this.styleSelect.value;
        if (!confirm(`Tem certeza que deseja excluir o estilo "${current}"?`)) return;
        // remove options and persisted rhythms
        const styles = JSON.parse(localStorage.getItem('styles') || '[]').filter(s => s !== current);
        localStorage.setItem('styles', JSON.stringify(styles));
        ['A', 'B', 'C', 'D'].forEach(r => {
            localStorage.removeItem(`${current}-${r}`);
            localStorage.removeItem(`${current}-${r}-fill`);
        });
        this.loadStyles();
    }

    saveRhythmToStyle(styleName, rhythmKey, rhythmData) {
        const key = `${styleName}-${rhythmKey}`;
        localStorage.setItem(key, JSON.stringify(rhythmData));
    }

    saveRhythm() {
        const styleName = this.styleSelect.value || this.defaultStyle;
        let rhythmKey = this.selectedRhythm;
        const selectedButton = document.getElementById(`rhythm-${this.selectedRhythm.toLowerCase()}`);
        if (selectedButton && selectedButton.classList.contains('fill')) rhythmKey = `${rhythmKey}-fill`;

        const rhythmData = {};
        this.tracksContainer.querySelectorAll('.track').forEach(track => {
            const instKey = this.getInstrumentKeyFromTrack(track);
            if (!instKey) return;
            const steps = Array.from(track.querySelectorAll('.step')).map(s => parseInt(s.dataset.volume || '0', 10));
            const isSelected = track.querySelector('.instrument-button')?.classList.contains('selected') || false;
            rhythmData[instKey] = { steps, selected: isSelected };
        });
        rhythmData.bpm = parseInt(this.bpmInput.value, 10) || 90;
        rhythmData.numSteps = parseInt(this.numStepsInput.value, 10) || 4;
        this.saveRhythmToStyle(styleName, rhythmKey, rhythmData);
    }

    loadRhythmForStyleAndRhythm(styleName, rhythm) {
        this.loadRhythm(`${styleName}-${rhythm}`);
    }

    loadRhythm(rhythmKey) {
        const saved = localStorage.getItem(rhythmKey);
        if (!saved) {
            this.clearSteps();
            return;
        }
        const data = JSON.parse(saved);
        if (typeof data.numSteps === 'number') {
            this.numStepsInput.value = data.numSteps;
            this.drumMachine.setNumSteps(data.numSteps);
            this.initializeTracks();
        }
        this.tracksContainer.querySelectorAll('.track').forEach(track => {
            const instKey = this.getInstrumentKeyFromTrack(track);
            const btn = track.querySelector('.instrument-button');
            const instrumentData = data[instKey] || {};
            const stepsData = Array.isArray(instrumentData.steps) ? instrumentData.steps : [];
            const isSelected = !!instrumentData.selected;
            // set selection state
            if (isSelected) btn.classList.add('selected'); else btn.classList.remove('selected');
            track.querySelectorAll('.step').forEach((step, idx) => {
                const volume = Array.isArray(stepsData) && idx < stepsData.length ? stepsData[idx] : 0;
                step.dataset.volume = String(volume);
                step.classList.remove('active', 'low-volume', 'third-volume');
                if (volume === 1) step.classList.add('active');
                else if (volume === 2) step.classList.add('low-volume');
                else if (volume === 3) step.classList.add('third-volume');
            });
            // ensure instrument button selection reflects actual steps
            const isEmpty = Array.from(track.querySelectorAll('.step')).every(s => parseInt(s.dataset.volume || '0', 10) === 0);
            if (isEmpty) btn.classList.remove('selected');
            else btn.classList.add('selected');
        });
        if (typeof data.bpm === 'number') {
            this.bpmInput.value = data.bpm;
            this.drumMachine.setBPM(data.bpm);
        } else {
            this.drumMachine.setBPM(parseInt(this.bpmInput.value, 10) || 90);
        }
    }

    initializeTracks() {
        const frag = document.createDocumentFragment();
        (this.drumMachine.instruments || []).forEach(inst => {
            frag.appendChild(this.createTrack(inst));
        });
        this.tracksContainer.innerHTML = '';
        this.tracksContainer.appendChild(frag);
    }

    createTrack(instrument) {
        const track = document.createElement('div');
        track.className = 'track';

        const label = document.createElement('label');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'instrument-button';
        button.title = instrument.name;
        const img = document.createElement('img');
        img.className = 'instrument-icon';
        img.src = `./assets/icons/${instrument.icon}`;
        img.title = instrument.name;
        img.alt = instrument.name;
        button.appendChild(img);
        label.appendChild(button);
        track.appendChild(label);

        button.addEventListener('click', () => button.classList.toggle('selected'));

        const stepsFragment = document.createDocumentFragment();
        const currentSteps = parseInt(this.numStepsInput.value, 10) || 4;
        for (let i = 1; i <= currentSteps; i++) {
            const step = document.createElement('div');
            step.className = 'step';
            step.textContent = i;
            step.dataset.step = String(i);
            step.dataset.volume = '0';
            stepsFragment.appendChild(step);
        }
        track.appendChild(stepsFragment);
        return track;
    }

    toggleStep(step) {
        let volume = parseInt(step.dataset.volume || '0', 10);
        volume = (volume + 1) % 4;
        step.dataset.volume = String(volume);
        step.classList.remove('active', 'low-volume', 'third-volume');
        if (volume === 1) step.classList.add('active');
        else if (volume === 2) step.classList.add('low-volume');
        else if (volume === 3) step.classList.add('third-volume');

        const track = step.closest('.track');
        if (!track) return;
        const instrumentButton = track.querySelector('.instrument-button');
        const steps = Array.from(track.querySelectorAll('.step'));
        const isEmpty = steps.every(s => parseInt(s.dataset.volume || '0', 10) === 0);
        if (isEmpty) instrumentButton.classList.remove('selected'); else instrumentButton.classList.add('selected');
    }

    clearSteps() {
        this.tracksContainer.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active', 'low-volume', 'third-volume');
            step.dataset.volume = '0';
        });
        // update instrument buttons
        this.tracksContainer.querySelectorAll('.instrument-button').forEach(btn => btn.classList.remove('selected'));
    }

    // Copy / Paste
    copyRhythm() {
        const rhythmData = {};
        this.tracksContainer.querySelectorAll('.track').forEach(track => {
            const instKey = this.getInstrumentKeyFromTrack(track);
            if (!instKey) return;
            const steps = Array.from(track.querySelectorAll('.step')).map(s => parseInt(s.dataset.volume || '0', 10));
            const selected = !!track.querySelector('.instrument-button')?.classList.contains('selected');
            rhythmData[instKey] = { steps, selected };
        });
        this.copiedRhythmData = rhythmData;
    }

    pasteRhythm() {
        if (!this.copiedRhythmData) {
            alert('Nenhum ritmo copiado.');
            return;
        }
        this.tracksContainer.querySelectorAll('.track').forEach(track => {
            const instKey = this.getInstrumentKeyFromTrack(track);
            const data = this.copiedRhythmData[instKey];
            if (!data) return;
            const btn = track.querySelector('.instrument-button');
            const stepsArr = Array.isArray(data.steps) ? data.steps : [];
            if (data.selected) btn.classList.add('selected'); else btn.classList.remove('selected');
            track.querySelectorAll('.step').forEach((step, idx) => {
                const volume = idx < stepsArr.length ? stepsArr[idx] : 0;
                step.dataset.volume = String(volume);
                step.classList.remove('active', 'low-volume', 'third-volume');
                if (volume === 1) step.classList.add('active');
                else if (volume === 2) step.classList.add('low-volume');
                else if (volume === 3) step.classList.add('third-volume');
            });
            const isEmpty = Array.from(track.querySelectorAll('.step')).every(s => parseInt(s.dataset.volume || '0', 10) === 0);
            if (isEmpty) btn.classList.remove('selected'); else btn.classList.add('selected');
        });
    }

    // Rhythm selection / fill logic
    selectRhythm(rhythmButton, rhythmKey) {
        const id = rhythmButton.id;
        this.rhythmButtonClicks[id] = (this.rhythmButtonClicks[id] || 0) + 1;
        const styleName = this.styleSelect.value || this.defaultStyle;
        const rhythmCode = rhythmKey.replace('rhythm-', '').toUpperCase(); // A, B, C, D

        // 1. Lógica do Double-Click para Ativar/Desativar FILL
        // Se já está selecionado e é o segundo clique:
        if (rhythmButton.classList.contains('selected') && this.rhythmButtonClicks[id] > 1) {

            // Alternar o estado Fill
            const isFill = rhythmButton.classList.toggle('fill');
            this.rhythmButtonClicks[id] = 0; // Resetar contador após ação

            // Se a bateria estiver PARADA, carregar a visualização imediatamente
            if (!this.drumMachine.isPlaying) {
                const fillKey = `${styleName}-${rhythmCode}-fill`;
                const baseKey = `${styleName}-${rhythmCode}`;
                const keyToLoad = isFill && localStorage.getItem(fillKey) ? fillKey : baseKey;
                this.loadRhythm(keyToLoad);
                return;
            }
        }

        // Resetar cliques dos outros botões e remover 'fill' dos outros
        this.rhythmButtons.forEach(b => {
            if (b !== rhythmButton) {
                b.classList.remove('selected', 'fill');
                this.rhythmButtonClicks[b.id] = 0;
            }
            b.classList.remove('pending'); // Remove todos os 'pending'
        });

        // 2. Definir o ritmo como selecionado (single-click)
        rhythmButton.classList.add('selected');

        // 3. Atualizar o ritmo pendente (com ou sem fill)
        this.pendingRhythm = rhythmCode;
        this.pendingButton = rhythmButton; // O botão que foi clicado

        // 4. Se a bateria estiver PARADA, carregar o ritmo base (ou fill se for double-click)
        if (!this.drumMachine.isPlaying) {
            // Se não estava em fill, carrega o ritmo base
            if (!rhythmButton.classList.contains('fill')) {
                this.loadRhythm(`${styleName}-${rhythmCode}`);
            } // Se estava, já foi carregado acima.

            // O ritmo selecionado atualiza imediatamente
            this.selectedRhythm = rhythmCode;
            this.pendingRhythm = null; // Não há pendência se está parado
            this.pendingButton = null;
        } else {
            // Se a bateria está tocando: agendar e visualmente mostrar 'pending'
            if (!rhythmButton.classList.contains('fill')) {
                rhythmButton.classList.add('pending');
            }

            // Carregar o fill imediatamente se o botão está 'fill'
            const isFillSelected = rhythmButton.classList.contains('fill');
            const fillKey = `${styleName}-${rhythmCode}-fill`;

            if (isFillSelected && localStorage.getItem(fillKey)) {
                this.loadRhythm(fillKey);
                this.fillLoaded = true;
            } else {
                this.fillLoaded = false;
            }
        }

        this.play();
    }

    // Corrigir onMeasureEnd para lidar com o estado 'fill'
    onMeasureEnd() {
        if (this.pendingRhythm && this.drumMachine.isPlaying) {
            const selectedButton = document.getElementById(`rhythm-${this.pendingRhythm.toLowerCase()}`);

            // O estado de fill é determinado pelo botão que foi clicado.
            const isFillSelected = selectedButton && selectedButton.classList.contains('fill');

            this.selectedRhythm = this.pendingRhythm;
            this.pendingRhythm = null;

            if (this.pendingButton) {
                this.pendingButton.classList.remove('pending');
                this.pendingButton = null;
            }

            if (!isFillSelected) {
                this.loadRhythm(`${this.styleSelect.value}-${this.selectedRhythm}`);
                this.fillLoaded = false;

                // 2. Se o botão Clicado *está* no modo FILL
            } else {
                // A medida terminou, então ele volta para o ritmo BASE (não importa o estado anterior de this.fillLoaded)
                this.loadRhythm(`${this.styleSelect.value}-${this.selectedRhythm}`);
                this.fillLoaded = false;
                selectedButton.classList.remove('fill');
            }
        }
    }

    play() {
        if (!this.drumMachine.isPlaying) {
            // remove fill when starting
            this.rhythmButtons.forEach(button => button.classList.remove('fill'));
            this.drumMachine.start();
            this.uiController.exibirBotaoStop();
        }
    }

    stop() {
        if (this.drumMachine.isPlaying) {
            this.drumMachine.stop();
            this.uiController.exibirBotaoPlay();
        }
    }

    togglePlay() {
        if (!this.drumMachine.isPlaying) {
            // remove fill when starting
            this.rhythmButtons.forEach(button => button.classList.remove('fill'));
            this.drumMachine.start();
        } else {
            this.drumMachine.stop();
        }
    }

    bindEvents() {
        // Steps via delegation
        this.tracksContainer.addEventListener('click', (ev) => {
            const el = ev.target;
            if (el.classList.contains('step')) this.toggleStep(el);
        });

        // Rhythm buttons
        this.rhythmButtons.forEach(button => {
            this.rhythmButtonClicks[button.id] = 0;
            button.addEventListener('click', () => {
                this.selectRhythm(button, button.id);
            });
        });

        // Copy / Paste / Save
        this.copyRhythmButton.addEventListener('click', () => this.copyRhythm());
        this.pasteRhythmButton.addEventListener('click', () => this.pasteRhythm());
        this.saveRhythmButton.addEventListener('click', () => this.saveRhythm());

        // BPM / Steps inputs + increment/decrement
        document.querySelector('.increment-bpm').addEventListener('click', () => {
            this.bpmInput.value = (parseInt(this.bpmInput.value, 10) || 0) + 1;
            this.drumMachine.setBPM(parseInt(this.bpmInput.value, 10));
        });
        document.querySelector('.decrement-bpm').addEventListener('click', () => {
            const bpm = Math.max(1, (parseInt(this.bpmInput.value, 10) || 1) - 1);
            this.bpmInput.value = bpm;
            this.drumMachine.setBPM(bpm);
        });

        document.querySelector('.increment-steps').addEventListener('click', () => {
            const ns = Math.max(1, (parseInt(this.numStepsInput.value, 10) || 1) + 1);
            this.numStepsInput.value = ns;
            this.drumMachine.setNumSteps(ns);
            this.initializeTracks();
        });
        document.querySelector('.decrement-steps').addEventListener('click', () => {
            const ns = Math.max(1, (parseInt(this.numStepsInput.value, 10) || 2) - 1);
            this.numStepsInput.value = ns;
            this.drumMachine.setNumSteps(ns);
            this.initializeTracks();
        });

        this.bpmInput.addEventListener('change', () => {
            const bpm = Math.max(1, parseInt(this.bpmInput.value, 10) || 1);
            this.bpmInput.value = bpm;
            this.drumMachine.setBPM(bpm);
        });

        this.numStepsInput.addEventListener('change', () => {
            const ns = Math.max(1, parseInt(this.numStepsInput.value, 10) || 1);
            this.numStepsInput.value = ns;
            this.drumMachine.setNumSteps(ns);
            this.initializeTracks();
        });

        // Styles
        this.styleSelect.addEventListener('change', () => {
            this.loadRhythmForStyleAndRhythm(this.styleSelect.value, this.selectedRhythm);
        });
        this.addStyleButton.addEventListener('click', () => this.addStyle());
        this.editStyleButton.addEventListener('click', () => this.editStyle());
        this.deleteStyleButton.addEventListener('click', () => this.deleteStyle());

        // Hook DrumMachine measure end to UI (if DrumMachine exposes onMeasureEnd)
        if (typeof this.drumMachine.onMeasureEnd === 'function') {
            const original = this.drumMachine.onMeasureEnd.bind(this.drumMachine);
            this.drumMachine.onMeasureEnd = () => {
                // preserve original behavior if any
                try { original(); } catch { }
                this.onMeasureEnd();
            };
        } else {
            // provide a safe onMeasureEnd to be used by DrumMachine
            this.drumMachine.onMeasureEnd = this.onMeasureEnd.bind(this);
        }
    }
}
