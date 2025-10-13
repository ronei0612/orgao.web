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
    let fillLoaded = false; // Nova variável para controlar se o fill foi carregado

    // Novo: Rastrear o número de cliques em cada botão
    const rhythmButtonClicks = {};
    rhythmButtons.forEach(button => {
        rhythmButtonClicks[button.id] = 0;
    });

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

    // Garante que os ritmos A, B, C, D e A-fill, B-fill, C-fill, D-fill existam em branco
    ['A', 'B', 'C', 'D'].forEach(r => {
        const key = `rhythm-${r}`;
        const fillKey = `rhythm-${r}-fill`; // Chave para o ritmo "fill"

        if (!localStorage.getItem(key)) {
            const bpm = parseInt(bpmInput.value);
            const numSteps = parseInt(numStepsInput.value);
            localStorage.setItem(key, JSON.stringify(createEmptyRhythm(bpm, numSteps)));
        }

        if (!localStorage.getItem(fillKey)) {
            const bpm = parseInt(bpmInput.value);
            const numSteps = parseInt(numStepsInput.value);
            localStorage.setItem(fillKey, JSON.stringify(createEmptyRhythm(bpm, numSteps)));
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

    // Função para criar uma linha de instrumento
    function createTrack(instrument) {
        const track = document.createElement('div');
        track.classList.add('track');

        const label = document.createElement('label');
        const button = document.createElement('button'); // Criar o botão aqui
        button.classList.add('instrument-button');
        const img = document.createElement('img');
        img.classList.add('instrument-icon');
        img.src = `./assets/icons/${instrument.icon}`;
        img.title = instrument.name;
        button.appendChild(img);
        label.appendChild(button);
        track.appendChild(label);

        // Adiciona um event listener ao botão do instrumento
        button.addEventListener('click', () => {
            button.classList.toggle('selected');
        });

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

    // Inicializa as tracks
    function initializeTracks() {
        const fragment = document.createDocumentFragment();
        drumMachine.instruments.forEach(inst => {
            fragment.appendChild(createTrack(inst));
        });
        tracksContainer.innerHTML = '';
        tracksContainer.appendChild(fragment);
    }

    // Função para ativar/desativar um track
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

        // Encontra o track pai
        const track = step.closest('.track');
        if (!track) return;

        // Encontra o botão do instrumento
        const instrumentButton = track.querySelector('.instrument-button');
        if (!instrumentButton) return;

        // Verifica se o track está em branco
        const steps = Array.from(track.querySelectorAll('.step'));
        const isTrackEmpty = steps.every(step => parseInt(step.dataset.volume) === 0);

        // Atualiza o estado de seleção do botão do instrumento
        if (isTrackEmpty) {
            instrumentButton.classList.remove('selected');
        } else {
            instrumentButton.classList.add('selected');
        }
    }

    // Limpar todos os steps
    function clearSteps() {
        tracksContainer.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active', 'low-volume');
            step.dataset.volume = 0;
        });
    }

    // Configurar callback para troca de ritmo (modificada)
    drumMachine.onMeasureEnd = () => {
        if (pendingRhythm) {
            if (fillLoaded) {
                loadRhythm(`rhythm-${pendingRhythm}`);
                fillLoaded = false; // Reset flag
            } else {
                loadRhythm(`rhythm-${pendingRhythm}-fill`);
                fillLoaded = true; // Set flag
            }
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
            rhythmButtons.forEach(button => button.classList.remove('lighter')); //Remover a classe 'lighter' ao iniciar o play
            drumMachine.start();
            playPauseButton.textContent = 'Stop';
        } else {
            drumMachine.stop();
            playPauseButton.textContent = 'Play';
        }
    }

    // Função para salvar o ritmo no localStorage
    function saveRhythm() {
        let saveKey = `rhythm-${selectedRhythm}`;
        const selectedButton = document.getElementById(`rhythm-${selectedRhythm.toLowerCase()}`);

        if (selectedButton && selectedButton.classList.contains('lighter')) {
            saveKey = `${saveKey}-fill`;
        }

        const rhythmData = {};
        tracksContainer.querySelectorAll('.track').forEach(track => {
            const instrument = track.querySelector('label img').title.toLowerCase().replace(/ /g, '');
            const stepsData = Array.from(track.querySelectorAll('.step')).map(step => parseInt(step.dataset.volume));
            const instrumentButton = track.querySelector('.instrument-button');
            rhythmData[instrument] = {
                steps: stepsData,
                selected: instrumentButton.classList.contains('selected') // Salva o estado de seleção
            };
        });
        rhythmData.bpm = parseInt(bpmInput.value); // Salva o BPM
        rhythmData.numSteps = parseInt(numStepsInput.value); // Salva a quantidade de tracks
        localStorage.setItem(saveKey, JSON.stringify(rhythmData));
    }

    // Função para selecionar um botão de ritmo (modificada)
    function selectRhythm(rhythmButton, rhythmKey) {
        const buttonId = rhythmButton.id;
        rhythmButtonClicks[buttonId]++;

        // Remover 'lighter' de todos os botões ANTES de adicionar ao atual
        rhythmButtons.forEach(button => button.classList.remove('lighter'));

        if (!drumMachine.isPlaying && rhythmButtonClicks[buttonId] > 1 && rhythmButton.classList.contains('selected')) {
            // Ação de "segundo clique" quando não está tocando, e SE o botão já está selecionado
            rhythmButton.classList.add('lighter'); // Adiciona a classe 'lighter'
            rhythmButtonClicks[buttonId] = 0; // Reseta o contador para o próximo clique

            // Carregar o ritmo "fill" se existir, senão carrega o normal
            const fillKey = `rhythm-${selectedRhythm}-fill`;
            if (localStorage.getItem(fillKey)) {
                loadRhythm(fillKey);
            } else {
                loadRhythm(`rhythm-${selectedRhythm}`);
            }

            return; // Sai da função para não executar a seleção normal
        }


        if (pendingButton) {
            pendingButton.classList.remove('pending');
        }
        rhythmButtons.forEach(button => button.classList.remove('selected'));
        rhythmButton.classList.add('selected');
        pendingRhythm = rhythmKey.replace('rhythm-', '').toUpperCase();

        // Load fill immediately
        if (drumMachine.isPlaying) {
            const fillKey = `rhythm-${pendingRhythm}-fill`;
            if (localStorage.getItem(fillKey)) {
                loadRhythm(fillKey);
                fillLoaded = true;
            } else {
                loadRhythm(`rhythm-${pendingRhythm}`);
                fillLoaded = false;
            }
        }

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
                const instrument = track.querySelector('label img').title.toLowerCase().replace(/ /g, '');
                const instrumentButton = track.querySelector('.instrument-button');
                const instrumentData = rhythmData[instrument]; // Pega os dados do instrumento
                const stepsData = instrumentData ? instrumentData.steps : []; // Pega os steps ou um array vazio
                const isSelected = instrumentData ? instrumentData.selected : false; // Carrega o estado de seleção

                // Define o estado de seleção do botão
                if (isSelected) {
                    instrumentButton.classList.add('selected');
                } else {
                    instrumentButton.classList.remove('selected');
                }

                track.querySelectorAll('.step').forEach((step, index) => {
                    //Verifica se stepsData é um array e se o índice está dentro dos limites
                    const volume = Array.isArray(stepsData) && index < stepsData.length ? stepsData[index] : 0;
                    step.dataset.volume = volume;
                    step.classList.remove('active', 'low-volume');
                    if (volume === 1) {
                        step.classList.add('active');
                    } else if (volume === 2) {
                        step.classList.add('low-volume');
                    }
                });

                // Verifica se o track está em branco (ADICIONADO)
                const steps = Array.from(track.querySelectorAll('.step'));
                const isTrackEmpty = steps.every(step => parseInt(step.dataset.volume) === 0);

                // Atualiza o estado de seleção do botão do instrumento (ADICIONADO)
                if (isTrackEmpty) {
                    instrumentButton.classList.remove('selected');
                } else {
                    instrumentButton.classList.add('selected');
                }
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

    // Event listeners para os botões de ritmo (já existente, mas adaptado)
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
    rhythmButtons.forEach(button => button.classList.remove('selected', 'lighter'));
    document.getElementById('rhythm-a').classList.add('selected');
    initializeTracks();
    loadRhythm('rhythm-A');
});