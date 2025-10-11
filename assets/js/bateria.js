
document.addEventListener('DOMContentLoaded', async () => {
    const drumMachine = new DrumMachine();
    await drumMachine.init();

    // Cache de elementos
    const playPauseButton = document.getElementById('play-pause');
    const bpmInput = document.getElementById('bpm');
    const clearButton = document.getElementById('clear');
    const tracksContainer = document.getElementById('tracks');
    const numStepsInput = document.getElementById('num-steps');
    const rhythmButtons = document.querySelectorAll('.rhythm-button');
    const saveRhythmButton = document.getElementById('save-rhythm');

    let selectedRhythm = 'A';
    let pendingRhythm = null;
    let pendingButton = null;

    // Função para criar um ritmo em branco
    function createEmptyRhythm(bpm, numSteps) {
        const rhythmData = {};
        drumMachine.instruments.forEach(inst => {
            rhythmData[inst.name.toLowerCase().replace(/ /g, '')] = Array(numSteps).fill(0);
        });
        rhythmData.bpm = bpm;
        rhythmData.numSteps = numSteps;
        return rhythmData;
    }

    // Garante que os ritmos A, B, C, D existam em branco
    ['A', 'B', 'C', 'D'].forEach(r => {
        const key = `rhythm-${r}`;
        if (!localStorage.getItem(key)) {
            const bpm = parseInt(bpmInput.value);
            const numSteps = parseInt(numStepsInput.value);
            localStorage.setItem(key, JSON.stringify(createEmptyRhythm(bpm, numSteps)));
        }
    });

    // Aplica BPM dobrado ao carregar a página
    drumMachine.setBPM(parseInt(bpmInput.value));

    // Delegação de eventos para steps
    tracksContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('step')) {
            toggleStep(event.target);
        }
    });

    // Função para criar uma linha de instrumento usando DocumentFragment
    function createTrack(instrument) {
        const track = document.createElement('div');
        track.classList.add('track');

        const label = document.createElement('label');
        label.innerHTML = `${instrument.name} <i class="${instrument.icon}" title="${instrument.name}"></i>`;
        track.appendChild(label);

        const stepsFragment = document.createDocumentFragment();
        const currentSteps = parseInt(numStepsInput.value);
        for (let i = 1; i <= currentSteps; i++) {
            const step = document.createElement('div');
            step.classList.add('step');
            step.textContent = i;
            step.dataset.step = i;
            step.dataset.volume = 0;
            stepsFragment.appendChild(step);
        }
        track.appendChild(stepsFragment);
        return track;
    }

    // Inicializa as tracks usando DocumentFragment
    function initializeTracks() {
        const fragment = document.createDocumentFragment();
        drumMachine.instruments.forEach(inst => {
            fragment.appendChild(createTrack(inst));
        });
        tracksContainer.innerHTML = '';
        tracksContainer.appendChild(fragment);
    }

    // Função para ativar/desativar um passo
    function toggleStep(step) {
        let volume = parseInt(step.dataset.volume);
        volume = (volume + 1) % 4; // Agora vai de 0 a 3
        step.dataset.volume = volume;
        step.classList.remove('active', 'low-volume', 'third-volume');
        if (volume === 1) {
            step.classList.add('active');
        } else if (volume === 2) {
            step.classList.add('low-volume');
        } else if (volume === 3) {
            step.classList.add('third-volume');
        }
    }

    // Limpar todos os steps
    function clearSteps() {
        tracksContainer.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active', 'low-volume');
            step.dataset.volume = 0;
        });
    }

    // Configurar callback para troca de ritmo
    drumMachine.onMeasureEnd = () => {
        if (pendingRhythm) {
            loadRhythm(`rhythm-${pendingRhythm}`);
            pendingRhythm = null;
            if (pendingButton) {
                pendingButton.classList.remove('pending');
                pendingButton = null;
            }
        }
    };

    // Função para iniciar/parar a reprodução
    function togglePlay() {
        if (!drumMachine.isPlaying) {
            drumMachine.start();
            playPauseButton.textContent = 'Stop';
        } else {
            drumMachine.stop();
            playPauseButton.textContent = 'Play';
            // Retornar ao estado inicial visual
            // Não há steps tocando, mas pode garantir que o passo inicial está pronto
            // Se quiser, pode desmarcar todos os steps, mas normalmente só o currentStep volta ao início
        }
    }

    // Função para salvar o ritmo no localStorage
    function saveRhythm() {
        const rhythmData = {};
        tracksContainer.querySelectorAll('.track').forEach(track => {
            const instrument = track.querySelector('label i').title.toLowerCase().replace(/ /g, '');
            const stepsData = Array.from(track.querySelectorAll('.step')).map(step => parseInt(step.dataset.volume));
            rhythmData[instrument] = stepsData;
        });
        rhythmData.bpm = parseInt(bpmInput.value); // Salva o BPM
        rhythmData.numSteps = parseInt(numStepsInput.value); // Salva a quantidade de tracks
        localStorage.setItem(`rhythm-${selectedRhythm}`, JSON.stringify(rhythmData));
    }

    // Função para selecionar um botão de ritmo
    function selectRhythm(rhythmButton, rhythmKey) {
        if (pendingButton) {
            pendingButton.classList.remove('pending');
        }
        rhythmButtons.forEach(button => button.classList.remove('selected'));
        rhythmButton.classList.add('selected');
        pendingRhythm = rhythmKey.replace('rhythm-', '').toUpperCase();
        selectedRhythm = pendingRhythm;
        pendingButton = rhythmButton;
        // Se não estiver tocando, muda o ritmo instantaneamente
        if (!drumMachine.isPlaying) {
            loadRhythm(`rhythm-${selectedRhythm}`);
        } else {
            rhythmButton.classList.add('pending');
        }
    }

    // Função para carregar o ritmo do localStorage
    function loadRhythm(rhythmKey) {
        const savedRhythm = localStorage.getItem(rhythmKey);
        if (savedRhythm) {
            const rhythmData = JSON.parse(savedRhythm);
            // Se a quantidade de tracks estiver salva, atualiza o input e DrumMachine
            if (typeof rhythmData.numSteps === 'number') {
                numStepsInput.value = rhythmData.numSteps;
                drumMachine.setNumSteps(rhythmData.numSteps);
                initializeTracks();
            }
            tracksContainer.querySelectorAll('.track').forEach(track => {
                const instrument = track.querySelector('label i').title.toLowerCase().replace(/ /g, '');
                const stepsData = rhythmData[instrument] || [];
                track.querySelectorAll('.step').forEach((step, index) => {
                    const volume = stepsData[index] !== undefined ? stepsData[index] : 0;
                    step.dataset.volume = volume;
                    step.classList.remove('active', 'low-volume');
                    if (volume === 1) {
                        step.classList.add('active');
                    } else if (volume === 2) {
                        step.classList.add('low-volume');
                    }
                });
            });
            // Se o BPM estiver salvo, atualiza o input e DrumMachine
            if (typeof rhythmData.bpm === 'number') {
                bpmInput.value = rhythmData.bpm;
                drumMachine.setBPM(rhythmData.bpm);
            } else {
                drumMachine.setBPM(parseInt(bpmInput.value));
            }
        } else {
            clearSteps();
        }
    }

    // Função para iniciar/parar a reprodução
    function togglePlay() {
        if (!drumMachine.isPlaying) {
            drumMachine.start();
            playPauseButton.textContent = 'Stop';
        } else {
            drumMachine.stop();
            playPauseButton.textContent = 'Play';
        }
    }

    // Event listeners para os botões de ritmo
    document.getElementById('rhythm-a').addEventListener('click', () => selectRhythm(document.getElementById('rhythm-a'), 'rhythm-a'));
    document.getElementById('rhythm-b').addEventListener('click', () => selectRhythm(document.getElementById('rhythm-b'), 'rhythm-b'));
    document.getElementById('rhythm-c').addEventListener('click', () => selectRhythm(document.getElementById('rhythm-c'), 'rhythm-c'));
    document.getElementById('rhythm-d').addEventListener('click', () => selectRhythm(document.getElementById('rhythm-d'), 'rhythm-d'));

    saveRhythmButton.addEventListener('click', saveRhythm);
    playPauseButton.addEventListener('click', togglePlay);
    bpmInput.addEventListener('change', () => drumMachine.setBPM(parseInt(bpmInput.value)));
    clearButton.addEventListener('click', clearSteps);
    numStepsInput.addEventListener('change', () => {
        drumMachine.setNumSteps(parseInt(numStepsInput.value));
        initializeTracks();
    });

    // Carregar o ritmo selecionado ao carregar a página
    rhythmButtons.forEach(button => button.classList.remove('selected'));
    document.getElementById('rhythm-a').classList.add('selected');
    initializeTracks();
    loadRhythm('rhythm-A');
});