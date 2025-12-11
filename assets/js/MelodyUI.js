class MelodyUI {
    constructor(elements, melodyMachine, uiController) {
        this.elements = elements;
        this.melodyMachine = melodyMachine;
        this.uiController = uiController;

        this.defaultStyle = 'Novo Estilo Melodia';
        this.storageKey = 'melodyStylesData';

        this.wrapper = document.getElementById('melodyWrapper');
        this.tracksContainer = document.getElementById('melodyTracks');
        this.styleSelect = document.getElementById('melodyStyleSelect');
        this.numStepsInput = document.getElementById('melody-num-steps');

        this.addStyleBtn = document.getElementById('addMelodyStyle');
        this.editStyleBtn = document.getElementById('editMelodyStyle');
        this.deleteStyleBtn = document.getElementById('deleteMelodyStyle');
        this.saveBtn = document.getElementById('save-melody');

        this.incStepsBtn = document.getElementById('melody-increment-steps');
        this.decStepsBtn = document.getElementById('melody-decrement-steps');
    }

    async init() {
        this.ensureDefaultStyleExists();
        this.loadStyles();
        this.initializeTracks();
        this.bindEvents();
    }

    getStorageData() {
        const data = localStorage.getItem(this.storageKey);
        if (data) return JSON.parse(data);
        return { styles: [this.defaultStyle], data: {} };
    }

    persistStorageData(obj) {
        localStorage.setItem(this.storageKey, JSON.stringify(obj));
    }

    ensureDefaultStyleExists() {
        const storage = this.getStorageData();
        if (!storage.styles.includes(this.defaultStyle)) {
            storage.styles.push(this.defaultStyle);
            storage.data[this.defaultStyle] = this.createEmptyPattern(16);
            this.persistStorageData(storage);
        }
    }

    createEmptyPattern(numSteps) {
        const patternData = {};
        this.melodyMachine.instruments.forEach(inst => {
            const key = this.getInstrumentKey(inst);
            patternData[key] = { steps: Array(numSteps).fill(0), selected: false };
        });
        patternData.numSteps = numSteps;
        return patternData;
    }

    getInstrumentKey(inst) {
        const nota = inst.note[0].toLowerCase();
        return `${inst.name}_${nota}${inst.octave ? '_' + inst.octave : ''}`;
    }

    loadStyles() {
        const storage = this.getStorageData();
        const styles = storage.styles || [];

        this.styleSelect.innerHTML = '';
        styles.sort().forEach(s => {
            const option = document.createElement('option');
            option.value = s;
            option.textContent = s;
            this.styleSelect.appendChild(option);
        });

        if (this.styleSelect.options.length === 0) {
            this.ensureDefaultStyleExists();
            this.loadStyles();
        }

        this.styleSelect.selectedIndex = 0;
        this.loadPattern(this.styleSelect.value);
    }

    initializeTracks() {
        const numSteps = parseInt(this.numStepsInput.value, 10) || 16;
        this.tracksContainer.innerHTML = '';

        this.melodyMachine.stepsPorTempo = numSteps / 4;

        const frag = document.createDocumentFragment();

        // Inverte a ordem para que notas agudas fiquem no topo (opcional, mas comum em DAWs)
        const instruments = [...this.melodyMachine.instruments].reverse();

        instruments.forEach(inst => {
            frag.appendChild(this.createTrack(inst, numSteps));
        });

        this.tracksContainer.appendChild(frag);

        if (typeof this.melodyMachine.refreshTrackCache === 'function') {
            this.melodyMachine.refreshTrackCache();
        }
    }

    createTrack(instrument, numSteps) {
        const track = document.createElement('div');
        track.className = 'track';

        const labelDiv = document.createElement('div');
        labelDiv.className = 'track-label';
        // Estilo inline para garantir alinhamento caso o CSS não tenha essa classe específica
        labelDiv.style.width = '50px';
        labelDiv.style.marginRight = '5px';

        const button = document.createElement('button');
        button.type = 'button';
        // Reutiliza classes de bateria ou define estilo próprio
        button.className = 'instrument-button';
        // Estilo inline para sobrescrever comportamento de imagem da bateria se necessário
        button.style.fontSize = '12px';
        button.style.fontWeight = 'bold';
        button.style.color = '#333';
        button.textContent = instrument.note;

        const dataSpan = document.createElement('span');
        // Gera a chave exata que está no this.buffers do MelodyMachine
        const nota = instrument.note[0].toLowerCase();
        const bufferKey = `${instrument.name}_${nota}${instrument.octave ? '_' + instrument.octave : ''}`;

        dataSpan.dataset.instrument = bufferKey;
        dataSpan.className = 'd-none'; // Bootstrap hide

        labelDiv.appendChild(button);
        labelDiv.appendChild(dataSpan);
        track.appendChild(labelDiv);

        button.addEventListener('click', () => button.classList.toggle('selected'));

        const stepsFragment = document.createDocumentFragment();
        for (let i = 1; i <= numSteps; i++) {
            const step = document.createElement('div');
            step.className = 'step';
            step.dataset.volume = '0';
            step.addEventListener('click', () => this.toggleStep(step));
            stepsFragment.appendChild(step);
        }
        track.appendChild(stepsFragment);

        return track;
    }

    toggleStep(step) {
        let volume = parseInt(step.dataset.volume || '0', 10);
        volume = (volume + 1) % 3; // 0->1->2->0

        step.dataset.volume = String(volume);
        step.classList.remove('active', 'low-volume');

        if (volume === 1) step.classList.add('active');
        else if (volume === 2) step.classList.add('low-volume');

        // Ativa visualmente a track se tiver algum step
        const track = step.closest('.track');
        if (track) {
            const btn = track.querySelector('.instrument-button');
            const hasSteps = Array.from(track.querySelectorAll('.step')).some(s => s.dataset.volume !== '0');
            if (hasSteps) btn.classList.add('selected');
        }
    }

    saveCurrentPattern() {
        const styleName = this.styleSelect.value;
        const numSteps = parseInt(this.numStepsInput.value, 10);
        const patternData = { numSteps: numSteps };

        const tracks = this.tracksContainer.querySelectorAll('.track');
        tracks.forEach(track => {
            const labelSpan = track.querySelector('.track-label span');
            const instKey = labelSpan.dataset.instrument;

            const steps = Array.from(track.querySelectorAll('.step')).map(s => parseInt(s.dataset.volume || '0', 10));
            const isSelected = track.querySelector('.instrument-button').classList.contains('selected');

            patternData[instKey] = { steps, selected: isSelected };
        });

        const storage = this.getStorageData();
        storage.data[styleName] = patternData;
        this.persistStorageData(storage);

        // Feedback Visual
        const originalHtml = this.saveBtn.innerHTML;
        this.saveBtn.innerHTML = '<i class="bi bi-check"></i>';
        this.saveBtn.classList.add('btn-success');
        this.saveBtn.classList.remove('btn-primary');
        setTimeout(() => {
            this.saveBtn.innerHTML = originalHtml;
            this.saveBtn.classList.remove('btn-success');
            this.saveBtn.classList.add('btn-primary');
        }, 1000);
    }

    loadPattern(styleName) {
        const storage = this.getStorageData();
        const data = storage.data[styleName];

        if (!data) {
            this.clearSteps();
            return;
        }

        if (data.numSteps && data.numSteps !== parseInt(this.numStepsInput.value)) {
            this.numStepsInput.value = data.numSteps;
            this.initializeTracks();
        }

        const tracks = this.tracksContainer.querySelectorAll('.track');
        tracks.forEach(track => {
            const labelSpan = track.querySelector('.track-label span');
            const instKey = labelSpan.dataset.instrument;
            const trackData = data[instKey];

            const btn = track.querySelector('.instrument-button');
            const stepsElements = track.querySelectorAll('.step');

            if (trackData) {
                if (trackData.selected) btn.classList.add('selected');
                else btn.classList.remove('selected');

                stepsElements.forEach((step, idx) => {
                    const vol = trackData.steps[idx] || 0;
                    step.dataset.volume = String(vol);
                    step.classList.remove('active', 'low-volume');
                    if (vol === 1) step.classList.add('active');
                    else if (vol === 2) step.classList.add('low-volume');
                });
            } else {
                btn.classList.remove('selected');
                stepsElements.forEach(s => {
                    s.dataset.volume = '0';
                    s.classList.remove('active', 'low-volume');
                });
            }
        });
    }

    clearSteps() {
        const steps = this.tracksContainer.querySelectorAll('.step');
        steps.forEach(s => {
            s.dataset.volume = '0';
            s.classList.remove('active', 'low-volume');
        });
        const btns = this.tracksContainer.querySelectorAll('.instrument-button');
        btns.forEach(b => b.classList.remove('selected'));
    }

    addStyle() {
        const name = prompt("Nome do novo estilo de melodia:");
        if (name) {
            const storage = this.getStorageData();
            if (storage.styles.includes(name)) {
                alert("Estilo já existe!");
                return;
            }
            storage.styles.push(name);
            storage.data[name] = this.createEmptyPattern(parseInt(this.numStepsInput.value));
            this.persistStorageData(storage);
            this.loadStyles();
            this.styleSelect.value = name;
            this.loadPattern(name);
        }
    }

    deleteStyle() {
        const name = this.styleSelect.value;
        if (confirm(`Excluir estilo "${name}"?`)) {
            const storage = this.getStorageData();
            storage.styles = storage.styles.filter(s => s !== name);
            delete storage.data[name];
            this.persistStorageData(storage);
            this.loadStyles();
        }
    }

    editStyle() {
        const oldName = this.styleSelect.value;
        const newName = prompt("Renomear estilo para:", oldName);
        if (newName && newName !== oldName) {
            const storage = this.getStorageData();
            const idx = storage.styles.indexOf(oldName);
            if (idx !== -1) storage.styles[idx] = newName;

            storage.data[newName] = storage.data[oldName];
            delete storage.data[oldName];

            this.persistStorageData(storage);
            this.loadStyles();
            this.styleSelect.value = newName;
        }
    }

    bindEvents() {
        this.incStepsBtn.addEventListener('click', () => {
            this.numStepsInput.value = parseInt(this.numStepsInput.value) + 1;
            this.initializeTracks();
        });
        this.decStepsBtn.addEventListener('click', () => {
            const val = parseInt(this.numStepsInput.value);
            if (val > 4) {
                this.numStepsInput.value = val - 1;
                this.initializeTracks();
            }
        });

        this.numStepsInput.addEventListener('change', () => this.initializeTracks());
        this.saveBtn.addEventListener('click', () => this.saveCurrentPattern());
        this.styleSelect.addEventListener('change', () => this.loadPattern(this.styleSelect.value));

        this.addStyleBtn.addEventListener('click', () => this.addStyle());
        this.editStyleBtn.addEventListener('click', () => this.editStyle());
        this.deleteStyleBtn.addEventListener('click', () => this.deleteStyle());
    }

    toggleVisibility(show) {
        if (show) {
            this.wrapper.classList.remove('d-none');
        } else {
            this.wrapper.classList.add('d-none');
        }
    }

    play() {
        // CORRIGIDO: Referência correta ao melodyMachine
        if (!this.melodyMachine.isPlaying) {
            this.melodyMachine.start();
        }
    }

    stop() {
        // CORRIGIDO: Referência correta ao melodyMachine
        if (this.melodyMachine.isPlaying) {
            this.melodyMachine.stop();
        }
    }
}