class BateriaUI {
    constructor(elements, drumMachine, uiController) {
        this.elements = elements;
        this.uiController = uiController;
        this.drumMachine = drumMachine;

        // State
        this.selectedRhythm = 'A';
        this.pendingRhythm = null;
        this.pendingButton = null;
        this.fillLoaded = false;
        this.defaultStyle = 'Novo Estilo';
        this.copiedRhythmData = null;
    }

    async init() {
        this.ensureDefaultStyleExists();

        this.loadStyles();
        this.initializeTracks();
        this.bindEvents();
    }

    /**
     * Extrai a chave do instrumento a partir do elemento track fornecido.
     * Ele procura a imagem dentro do rótulo do track e usa o título da imagem
     * para gerar a chave do instrumento, convertendo para minúsculas e removendo espaços.
     * Se a imagem ou o título não estiverem presentes, retorna null.
     */
    getInstrumentKeyFromTrack(track) {
        const img = track.querySelector('label img');
        if (!img || !img.title) return null;
        return img.title.toLowerCase().replace(/ /g, '');
    }

    /**
     * Garantir que o estilo padrão exista no localStorage
     * Se não existir, criar o estilo padrão e ritmos vazios para A, B, C, D
     */
    ensureDefaultStyleExists() {
        const styles = JSON.parse(localStorage.getItem('styles') || '[]');
        if (!styles || styles.length === 0) {
            localStorage.setItem('styles', JSON.stringify([this.defaultStyle]));
            // ensure rhythm keys exist for default style
            ['A', 'B', 'C', 'D'].forEach(r => {
                const key = `${this.defaultStyle}-${r}`;
                const fillKey = `${this.defaultStyle}-${r}-fill`;
                if (!localStorage.getItem(key)) {
                    const bpm = parseInt(this.elements.bpmInput.value, 10) || 90;
                    const numSteps = parseInt(this.elements.numStepsInput.value, 10) || 4;
                    this.saveRhythmToStyle(this.defaultStyle, r, this.createEmptyRhythm(bpm, numSteps));
                    this.saveRhythmToStyle(this.defaultStyle, `${r}-fill`, this.createEmptyRhythm(bpm, numSteps));
                }
            });
        }
    }

    /**
     * Cria um objeto de ritmo vazio com o BPM e número de passos fornecidos.
     * Cada instrumento terá uma matriz de passos preenchida com zeros.
     * Retorna o objeto de dados do ritmo.
     */
    createEmptyRhythm(bpm, numSteps) {
        const rhythmData = {};
        (this.drumMachine.instruments || []).forEach(inst => {
            rhythmData[inst.name.toLowerCase().replace(/ /g, '')] = Array(numSteps).fill(0);
        });
        rhythmData.bpm = bpm;
        rhythmData.numSteps = numSteps;
        return rhythmData;
    }

    /**
     * Carrega os estilos salvos do localStorage e popula o seletor de estilos na UI.
     * Se nenhum estilo existir, adiciona o estilo padrão.
     * Ordena os estilos alfabeticamente antes de adicioná-los ao seletor.
     */
    loadStyles() {
        const styles = JSON.parse(localStorage.getItem('styles') || '[]');
        this.elements.styleSelect.innerHTML = '';
        if (!styles.length) {
            const option = document.createElement('option');
            option.value = this.defaultStyle;
            option.textContent = this.defaultStyle;
            this.elements.styleSelect.appendChild(option);
            this.elements.styleSelect.value = this.defaultStyle;
            return;
        }
        const sorted = styles.slice().sort((a, b) => a.localeCompare(b));
        sorted.forEach(s => {
            const option = document.createElement('option');
            option.value = s;
            option.textContent = s;
            this.elements.styleSelect.appendChild(option);
        });
        this.elements.styleSelect.selectedIndex = 0;
    }

    saveStyles() {
        const styles = Array.from(this.elements.styleSelect.options).map(o => o.value);
        localStorage.setItem('styles', JSON.stringify(styles));
    }

    /**
     * Adiciona um novo estilo após solicitar o nome ao usuário.
     * Cria ritmos vazios para A, B, C, D e seus respectivos fills.
     */
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
        const bpm = parseInt(this.elements.bpmInput.value, 10) || 90;
        const numSteps = parseInt(this.elements.numStepsInput.value, 10) || 4;
        ['A', 'B', 'C', 'D'].forEach(r => {
            this.saveRhythmToStyle(newName, r, this.createEmptyRhythm(bpm, numSteps));
            this.saveRhythmToStyle(newName, `${r}-fill`, this.createEmptyRhythm(bpm, numSteps));
        });
        this.loadStyles();
        this.elements.styleSelect.value = newName;
    }

    /**
     * Edita o nome do estilo atualmente selecionado.
     * Solicita o novo nome ao usuário e atualiza o localStorage.
     * Também renomeia os ritmos associados ao estilo.
     */
    editStyle() {
        const current = this.elements.styleSelect.value;
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
        this.elements.styleSelect.value = newName;
    }

    /**
     * Exclui o estilo atualmente selecionado após confirmação do usuário.
     * Remove o estilo do localStorage e também exclui os ritmos associados.
     */
    deleteStyle() {
        const current = this.elements.styleSelect.value;
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

    /**
     * Salva o ritmo atual no estilo e chave de ritmo fornecidos.
     */
    saveRhythmToStyle(styleName, rhythmKey, rhythmData) {
        const key = `${styleName}-${rhythmKey}`;
        localStorage.setItem(key, JSON.stringify(rhythmData));
    }

    /**
     * Salva o ritmo atual no localStorage para o estilo e ritmo selecionados.
     */
    saveRhythm() {
        const styleName = this.elements.styleSelect.value || this.defaultStyle;
        let rhythmKey = this.selectedRhythm;
        const selectedButton = document.getElementById(`rhythm-${this.selectedRhythm.toLowerCase()}`);
        if (selectedButton && selectedButton.classList.contains('fill')) rhythmKey = `${rhythmKey}-fill`;

        const rhythmData = {};
        this.elements.tracksContainer.querySelectorAll('.track').forEach(track => {
            const instKey = this.getInstrumentKeyFromTrack(track);
            if (!instKey) return;
            const steps = Array.from(track.querySelectorAll('.step')).map(s => parseInt(s.dataset.volume || '0', 10));
            const isSelected = track.querySelector('.instrument-button')?.classList.contains('selected') || false;
            rhythmData[instKey] = { steps, selected: isSelected };
        });
        rhythmData.bpm = parseInt(this.elements.bpmInput.value, 10) || 90;
        rhythmData.numSteps = parseInt(this.elements.numStepsInput.value, 10) || 4;
        this.saveRhythmToStyle(styleName, rhythmKey, rhythmData);
    }

    /**
     * Carrega o ritmo salvo para o estilo e ritmo fornecidos.
     */
    loadRhythmForStyleAndRhythm(styleName, rhythm) {
        this.loadRhythm(`${styleName}-${rhythm}`);
    }

    /**
     * Carrega o ritmo salvo do localStorage usando a chave fornecida.
     */
    loadRhythm(rhythmKey) {
        const saved = localStorage.getItem(rhythmKey);
        if (!saved) {
            this.clearSteps();
            return;
        }
        const data = JSON.parse(saved);
        if (typeof data.numSteps === 'number') {
            this.elements.numStepsInput.value = data.numSteps;
            this.drumMachine.setNumSteps(data.numSteps);
            this.initializeTracks();
        }
        this.elements.tracksContainer.querySelectorAll('.track').forEach(track => {
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
    }

    /**
     * Inicializa as faixas na interface do usuário com base nos instrumentos disponíveis na drumMachine.
     * Cria um elemento de faixa para cada instrumento e os adiciona ao contêiner de faixas.
     */
    initializeTracks() {
        const frag = document.createDocumentFragment();
        (this.drumMachine.instruments || []).forEach(inst => {
            frag.appendChild(this.createTrack(inst));
        });
        this.elements.tracksContainer.innerHTML = '';
        this.elements.tracksContainer.appendChild(frag);
    }

    /**
     * Cria um elemento de faixa para o instrumento fornecido.
     * O elemento de faixa inclui um botão para o instrumento e os passos correspondentes.
     * Retorna o elemento de faixa criado.
     */
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
        const currentSteps = parseInt(this.elements.numStepsInput.value, 10) || 4;
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

    /**
     * Alterna o estado do passo fornecido entre inativo, volume baixo, volume médio e volume alto.
     */
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

    /**
     * Limpa todos os passos em todas as faixas, definindo-os como inativos e removendo quaisquer classes de volume.
     */
    clearSteps() {
        this.elements.tracksContainer.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active', 'low-volume', 'third-volume');
            step.dataset.volume = '0';
        });
        // update instrument buttons
        this.elements.tracksContainer.querySelectorAll('.instrument-button').forEach(btn => btn.classList.remove('selected'));
    }

    /**
     * Copia o ritmo atual para a área de transferência interna.
     * Armazena os dados do ritmo em this.copiedRhythmData.
     */
    copyRhythm() {
        const rhythmData = {};
        this.elements.tracksContainer.querySelectorAll('.track').forEach(track => {
            const instKey = this.getInstrumentKeyFromTrack(track);
            if (!instKey) return;
            const steps = Array.from(track.querySelectorAll('.step')).map(s => parseInt(s.dataset.volume || '0', 10));
            const selected = !!track.querySelector('.instrument-button')?.classList.contains('selected');
            rhythmData[instKey] = { steps, selected };
        });
        this.copiedRhythmData = rhythmData;
    }

    /**
     * Copia o ritmo salvo para a área de transferência interna.
     * Aplica os dados do ritmo armazenados em this.copiedRhythmData às faixas atuais.
     */
    pasteRhythm() {
        if (!this.copiedRhythmData) {
            alert('Nenhum ritmo copiado.');
            return;
        }
        this.elements.tracksContainer.querySelectorAll('.track').forEach(track => {
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

    selectFill(rhythmButton, rhythmKey, rhythmCode) {
        rhythmButton.classList.add('fill', 'pending');

        // Se estiver tocando: agendar revert para o fim da medida
        this.pendingRhythm = rhythmCode;
        this.pendingButton = rhythmButton;

        this.loadRhythm(rhythmKey);

        return;
    }

    /**
     * Seleciona o ritmo com base no botão clicado e na chave do ritmo.
     */
    selectRhythm(rhythmButton, rhythmKey) {
        const styleName = this.elements.styleSelect.value || this.defaultStyle;
        const rhythmCode = rhythmKey.replace('rhythm-', '').toUpperCase(); // A, B, C, D, E...

        if (rhythmButton.classList.contains('selected') && localStorage.getItem(`${styleName}-${rhythmCode}-fill`)) {
            this.selectFill(rhythmButton, `${styleName}-${rhythmCode}-fill`, rhythmCode);
            this.fillLoaded = true;
        } else {
            rhythmButton.classList.remove('fill');
            this.fillLoaded = false;            
            this.loadRhythm(`${styleName}-${rhythmCode}`);
        }

        rhythmButton.classList.add('selected');

        this.pendingRhythm = rhythmCode;
        this.pendingButton = rhythmButton;
    }

    /**
     * Quando o compasso termina, verifica se há um ritmo pendente.
     * Se houver, carrega o ritmo apropriado com base no estado do botão (fill ou não).
     */
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
                this.loadRhythm(`${this.elements.styleSelect.value}-${this.selectedRhythm}`);
                this.fillLoaded = false;

                // 2. Se o botão Clicado *está* no modo FILL
            } else {
                // A medida terminou, então ele volta para o ritmo BASE (não importa o estado anterior de this.fillLoaded)
                this.loadRhythm(`${this.elements.styleSelect.value}-${this.selectedRhythm}`);
                this.fillLoaded = false;
                selectedButton.classList.remove('fill');
            }
        }
    }

    play() {
        if (!this.drumMachine.isPlaying) {
            // remove fill when starting
            //this.elements.rhythmButtons.forEach(button => button.classList.remove('fill'));
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
            this.elements.rhythmButtons.forEach(button => button.classList.remove('fill'));
            this.drumMachine.start();
        } else {
            this.drumMachine.stop();
        }
    }

    /**
     * Vincula os eventos da interface do usuário aos manipuladores apropriados.
     */
    bindEvents() {
        // Steps via delegation
        this.elements.tracksContainer.addEventListener('click', (ev) => {
            const el = ev.target;
            if (el.classList.contains('step')) this.toggleStep(el);
        });

        // Rhythm buttons
        this.elements.rhythmButtons.forEach(button => {
            // contador de cliques removido; apenas ligar o evento
            button.addEventListener('click', () => {
                this.selectRhythm(button, button.id);
            });
        });

        // Copy / Paste / Save
        this.elements.copyRhythmButton.addEventListener('click', () => this.copyRhythm());
        this.elements.pasteRhythmButton.addEventListener('click', () => this.pasteRhythm());
        this.elements.saveRhythmButton.addEventListener('click', () => this.saveRhythm());

        // BPM / Steps inputs + increment/decrement
        document.querySelector('.increment-bpm').addEventListener('click', () => {
            this.elements.bpmInput.value = (parseInt(this.elements.bpmInput.value, 10) || 0) + 1;
            this.drumMachine.setBPM(parseInt(this.elements.bpmInput.value, 10));
        });
        document.querySelector('.decrement-bpm').addEventListener('click', () => {
            const bpm = Math.max(1, (parseInt(this.elements.bpmInput.value, 10) || 1) - 1);
            this.elements.bpmInput.value = bpm;
            this.drumMachine.setBPM(bpm);
        });

        document.querySelector('.increment-steps').addEventListener('click', () => {
            const ns = Math.max(1, (parseInt(this.elements.numStepsInput.value, 10) || 1) + 1);
            this.elements.numStepsInput.value = ns;
            this.drumMachine.setNumSteps(ns);
            this.initializeTracks();
        });
        document.querySelector('.decrement-steps').addEventListener('click', () => {
            const ns = Math.max(1, (parseInt(this.elements.numStepsInput.value, 10) || 2) - 1);
            this.elements.numStepsInput.value = ns;
            this.drumMachine.setNumSteps(ns);
            this.initializeTracks();
        });

        this.elements.bpmInput.addEventListener('change', () => {
            const bpm = Math.max(1, parseInt(this.elements.bpmInput.value, 10) || 1);
            this.elements.bpmInput.value = bpm;
            this.drumMachine.setBPM(bpm);
        });

        this.elements.numStepsInput.addEventListener('change', () => {
            const ns = Math.max(1, parseInt(this.elements.numStepsInput.value, 10) || 1);
            this.elements.numStepsInput.value = ns;
            this.drumMachine.setNumSteps(ns);
            this.initializeTracks();
        });

        // Styles
        this.elements.styleSelect.addEventListener('change', () => {
            this.loadRhythmForStyleAndRhythm(this.elements.styleSelect.value, this.selectedRhythm);
        });
        this.elements.addStyleButton.addEventListener('click', () => this.addStyle());
        this.elements.editStyleButton.addEventListener('click', () => this.editStyle());
        this.elements.deleteStyleButton.addEventListener('click', () => this.deleteStyle());

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
