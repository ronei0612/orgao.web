document.addEventListener('DOMContentLoaded', async () => {
    const drumMachine = new DrumMachine();
    await drumMachine.init();

    // Cache de elementos
    const playPauseButton = document.getElementById('play-pause');
    const bpmInput = document.getElementById('bpm');
    const numStepsInput = document.getElementById('num-steps');
    const tracksContainer = document.getElementById('tracks');
    const rhythmButtons = document.querySelectorAll('.rhythm-button');
    const saveRhythmButton = document.getElementById('save-rhythm');

    // Novos elementos
    const styleSelect = document.getElementById('style');
    const addStyleButton = document.getElementById('addStyle');
    const editStyleButton = document.getElementById('editStyle');
    const deleteStyleButton = document.getElementById('deleteStyle');

    // Elementos de copiar e colar
    const copyRhythmButton = document.getElementById('copy-rhythm');
    const pasteRhythmButton = document.getElementById('paste-rhythm');

    let selectedRhythm = 'A';
    let pendingRhythm = null;
    let pendingButton = null;
    let fillLoaded = false; // Nova variável para controlar se o fill foi carregado
    let defaultStyle = 'Novo Estilo';
    let copiedRhythmData = null; // Variável para armazenar os dados copiados

    // Novo: Rastrear o número de cliques em cada botão
    const rhythmButtonClicks = {};
    rhythmButtons.forEach(button => {
        rhythmButtonClicks[button.id] = 0;
    });

    // Função para copiar o ritmo
    function copyRhythm() {
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
        copiedRhythmData = rhythmData;
    }

    // Função para colar o ritmo
    function pasteRhythm() {
        if (!copiedRhythmData) {
            return;
        }

        tracksContainer.querySelectorAll('.track').forEach(track => {
            const instrument = track.querySelector('label img').title.toLowerCase().replace(/ /g, '');
            const instrumentData = copiedRhythmData[instrument];

            if (instrumentData) {
                const stepsData = instrumentData.steps;
                const instrumentButton = track.querySelector('.instrument-button');
                const isSelected = instrumentData.selected;

                // Define o estado de seleção do botão
                if (isSelected) {
                    instrumentButton.classList.add('selected');
                } else {
                    instrumentButton.classList.remove('selected');
                }

                track.querySelectorAll('.step').forEach((step, index) => {
                    const volume = index < stepsData.length ? stepsData[index] : 0;
                    step.dataset.volume = volume;
                    step.classList.remove('active', 'low-volume', 'third-volume');
                    if (volume === 1) {
                        step.classList.add('active');
                    } else if (volume === 2) {
                        step.classList.add('low-volume');
                    } else if (volume === 3) {
                        step.classList.add('third-volume');
                    }
                });

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
        });
    }

    // Event listeners para copiar e colar
    copyRhythmButton.addEventListener('click', copyRhythm);
    pasteRhythmButton.addEventListener('click', pasteRhythm);

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
        const key = `${defaultStyle}-${r}`;
        const fillKey = `${defaultStyle}-${r}-fill`;

        if (!localStorage.getItem(key)) {
            const bpm = parseInt(bpmInput.value);
            const numSteps = parseInt(numStepsInput.value);
            saveRhythmToStyle(defaultStyle, r, createEmptyRhythm(bpm, numSteps));
        }

        if (!localStorage.getItem(fillKey)) {
            const bpm = parseInt(bpmInput.value);
            const numSteps = parseInt(numStepsInput.value);
            saveRhythmToStyle(defaultStyle, `${r}-fill`, createEmptyRhythm(bpm, numSteps));
        }
    });

    // Carregar nomes de ritmos do localStorage
    function loadStyles() {
        const styles = JSON.parse(localStorage.getItem('styles') || '[]');
        if (styles.length > 0) {
            styleSelect.innerHTML = ''; // Limpa as opções existentes

            // Ordena os nomes alfabeticamente
            const sortedStyles = sortStyles(styles);

            // Adiciona as opções ao select
            sortedStyles.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                styleSelect.appendChild(option);
            });

            styleSelect.selectedIndex = 0;

        }
        else {
            // Adiciona a opção "Novo Ritmo"
            const newRhythmOption = document.createElement('option');
            newRhythmOption.value = defaultStyle;
            newRhythmOption.textContent = defaultStyle;
            styleSelect.appendChild(newRhythmOption);
            styleSelect.value = defaultStyle; // Restaura o valor selecionado
        }
    }

    function sortStyles(styles) {
        return [...styles].sort((a, b) => a.localeCompare(b));
    }

    function editStyle() {
        const currentName = styleSelect.value;
        const newName = prompt('Digite o novo nome para o estilo:', currentName);
        if (newName && newName !== currentName) {
            //const styles = Array.from(styleSelect.options).map(option => option.value);
            const styles = JSON.parse(localStorage.getItem('styles') || '[]');

            if (styles.includes(newName)) {
                alert('Este nome de estilo já existe.');
                return;
            }

            // Atualiza o texto da opção selecionada
            styleSelect.options[styleSelect.selectedIndex].textContent = newName;
            styleSelect.options[styleSelect.selectedIndex].value = newName;
            styleSelect.value = newName;

            // Atualiza o nome nos styles no localStorage
            const stylesArray = JSON.parse(localStorage.getItem('styles') || '[]');
            const index = stylesArray.indexOf(currentName);
            if (index !== -1) {
                stylesArray[index] = newName;
                localStorage.setItem('styles', JSON.stringify(stylesArray));
            }

            // Renomear os ritmos no localStorage
            ['A', 'B', 'C', 'D'].forEach(r => {
                const oldKey = `${currentName}-${r}`;
                const newKey = `${newName}-${r}`;
                const oldFillKey = `${currentName}-${r}-fill`;
                const newFillKey = `${newName}-${r}-fill`;

                // Renomear o ritmo normal
                const rhythmData = localStorage.getItem(oldKey);
                if (rhythmData) {
                    localStorage.setItem(newKey, rhythmData);
                    localStorage.removeItem(oldKey);
                }

                // Renomear o ritmo fill
                const fillData = localStorage.getItem(oldFillKey);
                if (fillData) {
                    localStorage.setItem(newFillKey, fillData);
                    localStorage.removeItem(oldFillKey);
                }
            });
        }
    }

    // Adicionar um novo nome de estilo
    function addStyle() {
        const newName = prompt('Digite o nome do novo estilo:');
        if (newName) {
            let styles = JSON.parse(localStorage.getItem('styles') || '[]');
            if (styles.includes(newName)) {
                alert('Este nome de estilo já existe.');
                return;
            }
            const option = document.createElement('option');
            option.value = newName;
            option.textContent = newName;
            styleSelect.add(option, styleSelect.options[styleSelect.options.length - 1]); // Adiciona antes do "Novo Estilo"
            saveStyles();
            styleSelect.value = newName;

            // Criar ritmos em branco para o novo estilo
            ['A', 'B', 'C', 'D'].forEach(r => {
                const bpm = parseInt(bpmInput.value);
                const numSteps = parseInt(numStepsInput.value);
                saveRhythmToStyle(newName, r, createEmptyRhythm(bpm, numSteps));
                saveRhythmToStyle(newName, `${r}-fill`, createEmptyRhythm(bpm, numSteps));
            });
        }
    }

    // Excluir o nome do estilo atual
    function deleteStyle() {
        const currentName = styleSelect.value;
        if (confirm(`Tem certeza que deseja excluir o estilo "${currentName}"?`)) {
            styleSelect.remove(styleSelect.selectedIndex);
            saveStyles();
            if (styleSelect.length === 0) {
                loadStyles();
            }
            else {
                styleSelect.selectedIndex = styleSelect.length - 1;
            }

            // Remover os ritmos do localStorage
            ['A', 'B', 'C', 'D'].forEach(r => {
                localStorage.removeItem(`${currentName}-${r}`);
                localStorage.removeItem(`${currentName}-${r}-fill`);
            });
        }
    }

    // Salvar nomes de estilo no localStorage
    function saveStyles() {
        const styles = Array.from(styleSelect.options).map(option => option.value);
        localStorage.setItem('styles', JSON.stringify(styles));
    }

    // Função para salvar o ritmo no localStorage, associado ao estilo
    function saveRhythmToStyle(styleName, rhythmKey, rhythmData) {
        const saveKey = `${styleName}-${rhythmKey}`;
        localStorage.setItem(saveKey, JSON.stringify(rhythmData));
    }

    // Atualiza a função saveRhythm para usar saveRhythmToStyle
    function saveRhythm() {
        const styleName = styleSelect.value;
        let rhythmKey = selectedRhythm;
        const selectedButton = document.getElementById(`rhythm-${selectedRhythm.toLowerCase()}`);

        if (selectedButton && selectedButton.classList.contains('lighter')) {
            rhythmKey = `${rhythmKey}-fill`;
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
        saveRhythmToStyle(styleName, rhythmKey, rhythmData);
    }

    function loadRhythmForStyleAndRhythm(styleName, rhythm) {
        loadRhythm(`${styleName}-${rhythm}`);
    }

    // Inicializa os nomes dos estilos
    loadStyles();

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
        if (pendingRhythm && drumMachine.isPlaying) { // Adicionada verificação drumMachine.isPlaying
            const selectedButton = document.getElementById(`rhythm-${pendingRhythm.toLowerCase()}`);
            const isFillSelected = selectedButton && selectedButton.classList.contains('lighter');

            if (isFillSelected) {
                if (fillLoaded) {
                    loadRhythm(`${styleSelect.value}-${pendingRhythm}`);
                    fillLoaded = false; // Reset flag
                } else {
                    loadRhythm(`${styleSelect.value}-${pendingRhythm}-fill`);
                    fillLoaded = true; // Set flag
                }
            } else {
                loadRhythm(`${styleSelect.value}-${pendingRhythm}`); // Carrega o ritmo normal se o "fill" não estiver selecionado
                fillLoaded = false;
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
            const fillKey = `${styleSelect.value}-${selectedRhythm}-fill`;
            if (localStorage.getItem(fillKey)) {
                loadRhythm(fillKey);
            } else {
                loadRhythm(`${styleSelect.value}-${selectedRhythm}`);
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
            const fillKey = `${styleSelect.value}-${pendingRhythm}-fill`;
            if (localStorage.getItem(fillKey)) {
                loadRhythm(fillKey);
                fillLoaded = true;
            } else {
                loadRhythm(`${styleSelect.value}-${pendingRhythm}`);
                fillLoaded = false;
            }
        }

        selectedRhythm = pendingRhythm;
        pendingButton = rhythmButton;
        // Se não estiver tocando, muda o ritmo instantaneamente
        if (!drumMachine.isPlaying) {
            loadRhythm(`${styleSelect.value}-${selectedRhythm}`);
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

    // Garante que selectedRhythm é atualizado quando um botão de ritmo é clicado
    function updateSelectedRhythm(rhythmKey) {
        selectedRhythm = rhythmKey.replace('rhythm-', '').toUpperCase();
    }

    // Event listeners para os botões de ritmo (já existente, mas adaptado)
    document.getElementById('rhythm-a').addEventListener('click', () => {
        updateSelectedRhythm('rhythm-a');
        selectRhythm(document.getElementById('rhythm-a'), 'rhythm-a');
    });
    document.getElementById('rhythm-b').addEventListener('click', () => {
        updateSelectedRhythm('rhythm-b');
        selectRhythm(document.getElementById('rhythm-b'), 'rhythm-b');
    });
    document.getElementById('rhythm-c').addEventListener('click', () => {
        updateSelectedRhythm('rhythm-c');
        selectRhythm(document.getElementById('rhythm-c'), 'rhythm-c');
    });
    document.getElementById('rhythm-d').addEventListener('click', () => {
        updateSelectedRhythm('rhythm-d');
        selectRhythm(document.getElementById('rhythm-d'), 'rhythm-d');
    });

    // Event listeners para os botões de nome do estilo
    addStyleButton.addEventListener('click', addStyle);
    editStyleButton.addEventListener('click', editStyle);
    deleteStyleButton.addEventListener('click', deleteStyle);

    saveRhythmButton.addEventListener('click', saveRhythm);
    playPauseButton.addEventListener('click', togglePlay);
    bpmInput.addEventListener('change', () => drumMachine.setBPM(parseInt(bpmInput.value)));
    numStepsInput.addEventListener('change', () => {
        drumMachine.setNumSteps(parseInt(numStepsInput.value));
        initializeTracks();
    });


    // Event listeners para os botões de incremento e decremento do BPM
    document.querySelector('.increment-bpm').addEventListener('click', () => {
        let bpm = parseInt(bpmInput.value);
        bpmInput.value = bpm + 1;
        drumMachine.setBPM(parseInt(bpmInput.value));
    });

    document.querySelector('.decrement-bpm').addEventListener('click', () => {
        let bpm = parseInt(bpmInput.value);
        bpmInput.value = bpm - 1 > 0 ? bpm - 1 : 1; // Garante que o valor mínimo seja 1
        drumMachine.setBPM(parseInt(bpmInput.value));
    });

    // Event listeners para os botões de incremento e decremento do Num Steps
    document.querySelector('.increment-steps').addEventListener('click', () => {
        let numSteps = parseInt(numStepsInput.value);
        numStepsInput.value = numSteps + 1;
        drumMachine.setNumSteps(parseInt(numStepsInput.value));
        initializeTracks();
    });

    document.querySelector('.decrement-steps').addEventListener('click', () => {
        let numSteps = parseInt(numStepsInput.value);
        numStepsInput.value = numSteps - 1 > 1 ? numSteps - 1 : 1; // Garante que o valor mínimo seja 1
        drumMachine.setNumSteps(parseInt(numStepsInput.value));
        initializeTracks();
    });

    bpmInput.addEventListener('change', () => drumMachine.setBPM(parseInt(bpmInput.value)));
    numStepsInput.addEventListener('change', () => {
        drumMachine.setNumSteps(parseInt(numStepsInput.value));
        initializeTracks();
    });

    // Atualiza o event listener para o styleSelect
    styleSelect.addEventListener('change', () => {
        loadRhythmForStyleAndRhythm(styleSelect.value, selectedRhythm);
    });

    // Carregar o ritmo selecionado ao carregar a página
    rhythmButtons.forEach(button => button.classList.remove('selected', 'lighter'));
    document.getElementById('rhythm-a').classList.add('selected');
    initializeTracks();

    // Carregar o style e o ritmo selecionado ao carregar a página
    //loadStyles();
    loadRhythmForStyleAndRhythm(styleSelect.value, selectedRhythm);
});