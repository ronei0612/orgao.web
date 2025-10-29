
const elements = {
    controlButtons: document.getElementById('controlButtons'),
    cifraDisplay: document.getElementById('cifraDisplay'),
    editTextarea: document.getElementById('editTextarea'),
    tocarButton: document.getElementById('tocarButton'),
    saveButton: document.getElementById('saveButton'),
    cancelButton: document.getElementById('cancelButton'),
    addButton: document.getElementById('addButton'),
    saveNewItemButton: document.getElementById('saveNewItemButton'),
    playButton: document.getElementById('playButton'),
    avancarButton: document.getElementById('avancarButton'),
    voltarButton: document.getElementById('voltarButton'),
    notesButton: document.getElementById('notesButton'),
    stopButton: document.getElementById('stopButton'),
    searchButton: document.getElementById('searchButton'),
    clearButton: document.getElementById('clearButton'),
    searchInput: document.getElementById('searchInput'),
    spinner: document.querySelector('.spinner-border'),
    searchIcon: document.getElementById('searchIcon'),
    searchResultsList: document.getElementById('searchResults'),
    savesList: document.getElementById('saves'),
    pulseRange: document.getElementById('pulseRange'),
    bpmValue: document.getElementById('bpmValue'),
    iframeCifra: document.getElementById('iframeCifra'),
    santamissaFrame: document.getElementById('santamissaFrame'),
    oracoesFrame: document.getElementById('oracoesFrame'),
    prevButton: document.getElementById('prevButton'),
    nextButton: document.getElementById('nextButton'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    searchModalLabel: document.getElementById('searchModalLabel'),
    savesSelect: document.getElementById('savesSelect'),
    selectContainer: document.getElementById('selectContainer'),
    selectedButton: document.getElementById('selectedButton'),
    editSavesSelect: document.getElementById('editSavesSelect'),
    deleteSavesSelect: document.getElementById('deleteSavesSelect'),
    tomSelect: document.getElementById('tomSelect'),
    decreaseTom: document.getElementById('decreaseTom'),
    increaseTom: document.getElementById('increaseTom'),
    tomContainer: document.getElementById('tomContainer'),
    pulseRange: document.getElementById('pulseRange'),
    itemNameInput: document.getElementById('itemNameInput'),
    alertModalLabel: document.getElementById('alertModalLabel'),
    alertModalMessage: document.getElementById('alertModalMessage'),
    itemModalLabel: document.getElementById('itemModalLabel'),
    cancelButtonAlert: document.getElementById('cancelButtonAlert'),
    simButtonAlert: document.getElementById('simButtonAlert'),
    naoButtonAlert: document.getElementById('naoButtonAlert'),
    okButtonAlert: document.getElementById('okButtonAlert'),
    oracoesEucaristicasLink: document.getElementById('oracoesEucaristicasLink'),
    missaOrdinarioLink: document.getElementById('missaOrdinarioLink'),
    liturgiaDiariaLink: document.getElementById('liturgiaDiariaLink'),
    oracoesLink: document.getElementById('oracoesLink'),
    aboutLink: document.getElementById('about'),
    downloadSavesLink: document.getElementById('downloadSavesLink'),
    uploadSavesLink: document.getElementById('uploadSavesLink'),
    liturgiaDiariaFrame: document.getElementById('liturgiaDiariaFrame'),
    acorde1: document.getElementById('acorde1'),
    acorde2: document.getElementById('acorde2'),
    acorde3: document.getElementById('acorde3'),
    acorde4: document.getElementById('acorde4'),
    acorde5: document.getElementById('acorde5'),
    acorde6: document.getElementById('acorde6'),
    acorde7: document.getElementById('acorde7'),
    acorde8: document.getElementById('acorde8'),
    acorde9: document.getElementById('acorde9'),
    acorde10: document.getElementById('acorde10'),
    acorde11: document.getElementById('acorde11'),
    borderRight: document.getElementById('borderRight'),
    borderLeft: document.getElementById('borderLeft')
};

const cifraPlayer = new CifraPlayer(elements);
const uiController = new UIController(elements);
const localStorageManager = new LocalStorageManager();
var _pesquisarNaWeb = false;

const camposHarmonicos = {
    // Campos harmônicos maiores
    'C': ['C', 'Dm', 'Em', 'F', 'G', 'Am'],
    'Db': ['Db', 'Ebm', 'Fm', 'Gb', 'Ab', 'Bbm'],
    'C#': ['C#', 'D#m', 'Fm', 'F#', 'G#', 'A#m'],
    'D': ['D', 'Em', 'F#m', 'G', 'A', 'Bm'],
    'Eb': ['Eb', 'Fm', 'Gm', 'Ab', 'Bb', 'Cm'],
    'D#': ['D#', 'Fm', 'Gm', 'G#', 'A#', 'Cm'],
    'E': ['E', 'F#m', 'G#m', 'A', 'B', 'C#m'],
    'F': ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm'],
    'F#': ['F#', 'G#m', 'A#m', 'B', 'C#', 'D#m'],
    'Gb': ['Gb', 'Abm', 'Bbm', 'B', 'Db', 'Ebm'],
    'G': ['G', 'Am', 'Bm', 'C', 'D', 'Em'],
    'G#': ['G#', 'A#m', 'B#m', 'C#', 'D#', 'Fm'],
    'Ab': ['Ab', 'Bbm', 'Cm', 'Db', 'Eb', 'Fm'],
    'A': ['A', 'Bm', 'C#m', 'D', 'E', 'F#m'],
    'A#': ['A#', 'B#m', 'Dm', 'D#', 'F', 'Gm'],
    'Bb': ['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm'],
    'B': ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m'],
    // Campos harmônicos menores
    'Am': ['Am', 'C', 'Dm', 'Em', 'F', 'G'],
    'Bbm': ['Bbm', 'Db', 'Ebm', 'Fm', 'Gb', 'Ab'],
    'B#m': ['B#m', 'D', 'E#m', 'F#m', 'G', 'A'],
    'Bm': ['Bm', 'D', 'Em', 'F#m', 'G', 'A'],
    'Cm': ['Cm', 'Eb', 'Fm', 'Gm', 'Ab', 'Bb'],
    'C#m': ['C#m', 'E', 'F#m', 'G#m', 'A', 'B'],
    'Dm': ['Dm', 'F', 'Gm', 'Am', 'Bb', 'C'],
    'D#m': ['D#m', 'Gb', 'Abm', 'Bbm', 'Cb', 'Db'],
    'Ebm': ['Ebm', 'Gb', 'Abm', 'Bbm', 'Cb', 'Db'],
    'Em': ['Em', 'G', 'Am', 'Bm', 'C', 'D'],
    'Fm': ['Fm', 'Ab', 'Bbm', 'Cm', 'Db', 'Eb'],
    'F#m': ['F#m', 'A', 'Bm', 'C#m', 'D', 'E'],
    'Gm': ['Gm', 'Bb', 'Cm', 'Dm', 'Eb', 'F'],
    'G#m': ['G#m', 'B', 'C#m', 'D#m', 'E', 'F#'],
    'Abm': ['Abm', 'Cb', 'Dbm', 'Ebm', 'Fb', 'Gb'],
    'A#m': ['A#m', 'D', 'E#m', 'F#m', 'G', 'A']
};

const version = 1.4;
const holdTime = 1000;
var held = false;
var timer;
var todasAsCifras = [];
var musicaEscolhida = false;

window.onerror = function (message, source, lineno, colno, error) {
	alert("Erro!\n" + message + '\nArquivo: ' + source + '\nLinha: ' + lineno + '\nPosicao: ' + colno);
};

// Faz o link Liturgia da Palavra de dentro do iframe LiturgiaDiaria funcionar
elements.santamissaFrame.addEventListener('load', () => {
    window.addEventListener('message', (event) => {
        if (event.data === 'mostrarLiturgiaDiaria') {
            elements.liturgiaDiariaFrame.classList.remove('d-none');
            elements.santamissaFrame.classList.add('d-none');
            elements.oracoesFrame.classList.add('d-none');
        }
    });
});

elements.selectedButton.addEventListener("click", () => {
    uiController.exibirSavesSelect();
    selectEscolhido(elements.selectedButton.innerText);
});

elements.saveNewItemButton.addEventListener("click", () => {
    elements.savesSelect.selectedIndex = 0;
    let newSaveName = elements.itemNameInput.value;
    if (newSaveName === '') return;
    salvarSave(newSaveName);
    $('#itemModal').modal('hide');
});

elements.cancelButton.addEventListener("click", () => {
    uiController.resetInterface();
});

elements.saveButton.addEventListener('click', () => {
    let saveName = elements.itemNameInput.value;
    if (!saveName) {
        const musicasDefault = elements.savesSelect.querySelectorAll('option[value^="Música "]');
        const count = musicasDefault.length + 1;
        saveName = "Música " + count;
    }

    let saves = JSON.parse(localStorage.getItem('saves')) || {};
    if (saves.hasOwnProperty(saveName)) {
        uiController.exibirMensagemAlerta(`Salvar "${saveName}"?`, 'Confirmação');
        uiController.resetarSimNaoAlert();
    }
    else {
        salvarSave(saveName);

        uiController.exibirMensagemAlerta(`"${saveName}" salvo com sucesso!`, 'Música');
        uiController.resetarOkAlert();

        $('#alertModal').modal('show');
    }

    const tom = descobrirTom(elements.editTextarea.value);
    escolhidoLetraOuCifra();
});

elements.darkModeToggle.addEventListener('change', toggleDarkMode);

elements.tocarButton.addEventListener('click', () => {
    uiController.exibirBotoesCifras();
    const texto = elements.cifraDisplay.value;
    let musicaCifrada = cifraPlayer.destacarCifras(texto);
    const tom = descobrirTom(musicaCifrada);
    musicaCifrada = cifraPlayer.destacarCifras(texto, tom);
    uiController.exibirTextoCifrasCarregado(tom, elements.editTextarea.value);
    elements.iframeCifra.contentDocument.body.innerHTML = musicaCifrada;
    if (!tom)
        elements.tomSelect.dispatchEvent(new Event('change'));
    if (tom === '') {
        let textoLetra = elements.iframeCifra.contentDocument.body.innerHTML;
        textoLetra = textoLetra.replace("font-family: Consolas, 'Courier New', Courier, monospace;", "font-family: 'Roboto', sans-serif;")
            .replace("font-size: 12pt;", "font-size: 15pt;");
        elements.iframeCifra.contentDocument.body.innerHTML = textoLetra;
    }
    uiController.exibirIframeCifra();
    cifraPlayer.addEventCifrasIframe(elements.iframeCifra);

    cifraPlayer.indiceAcorde = 0;
    $('#searchModal').modal('hide');
});

elements.prevButton.addEventListener('click', () => {
    uiController.atualizarBotoesNavegacao('esquerda');
});

elements.nextButton.addEventListener('click', () => {
    uiController.atualizarBotoesNavegacao('direita');
});

elements.tomSelect.addEventListener('change', (event) => {
    if (elements.tomSelect.value) {// && !elements.tomContainer.classList.contains('d-none')) { // Selecionado Letra
        if (elements.acorde1.classList.contains('d-none')) {
            cifraPlayer.transposeCifra();
        }
        else {
            cifraPlayer.transporTom();
            if (!cifraPlayer.parado && !cifraPlayer.acordeTocando) {
                const button = event.currentTarget;
                cifraPlayer.pararReproducao();
                cifraPlayer.parado = false;
                cifraPlayer.tocarAcorde(button.value);
                button.classList.add('pressed');
            }
        }
    } else {
        cifraPlayer.removeCifras(elements.iframeCifra.contentDocument.body.innerHTML);
        uiController.exibirBotoesAcordes();
        uiController.esconderBotoesTom();
    }
});

elements.decreaseTom.addEventListener('click', () => {
    if (elements.tomSelect.value) {
        let tomIndex = parseInt(elements.tomSelect.selectedIndex);
        if (tomIndex === 1)
            tomIndex = 13;
        elements.tomSelect.value = elements.tomSelect.options[tomIndex - 1].value;
        elements.tomSelect.dispatchEvent(new Event('change'));
    }
});

elements.increaseTom.addEventListener('click', () => {
    if (elements.tomSelect.value) {
        let tomIndex = parseInt(elements.tomSelect.selectedIndex);
        if (tomIndex === 12)
            tomIndex = 0;
        elements.tomSelect.value = elements.tomSelect.options[tomIndex + 1].value;
        elements.tomSelect.dispatchEvent(new Event('change'));
    }
});

elements.addButton.addEventListener('click', function () {
    this.classList.add('pressed');

    setTimeout(() => {
        this.classList.remove('pressed');
    }, 100);

    if (!elements.deleteSavesSelect.classList.contains('d-none')) {
        elements.iframeCifra.contentDocument.body.innerHTML = '';
        uiController.editarMusica();
        uiController.exibirBotoesTom();
        uiController.exibirBotoesAcordes();
        elements.itemNameInput.click();
    }

    uiController.toggleEditDeleteButtons();
});

elements.editSavesSelect.addEventListener('click', () => {
    const saveName = elements.savesSelect.value;
    elements.itemNameInput.value = saveName ? saveName : '';

    elements.editTextarea.value = elements.iframeCifra.contentDocument.body.innerText;
    uiController.editarMusica();
    uiController.exibirBotoesTom();
    uiController.exibirBotoesAcordes();
});

elements.deleteSavesSelect.addEventListener('click', () => {
    const saveName = elements.savesSelect.value;
    if (elements.savesSelect.selectedIndex !== 0) {
        uiController.exibirMensagemAlerta(`Deseja excluir "${saveName}"?`, 'Deletar!');
        uiController.resetarSimNaoAlert();

        $('#alertModal').modal('show');
    }
});

elements.searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        elements.searchButton.click();
    }
});

elements.itemNameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        elements.saveNewItemButton.click();
    }
});

elements.searchButton.addEventListener('click', () => {
    if (elements.searchInput.value)
        searchMusic();
});

elements.clearButton.addEventListener('click', () => {
    elements.searchInput.value = '';
    elements.searchInput.focus();
});

elements.liturgiaDiariaLink.addEventListener('click', () => {
    uiController.exibirFrame('liturgiaDiariaFrame');
});

elements.oracoesLink.addEventListener('click', () => {
    uiController.exibirFrame('oracoesFrame');
});

elements.aboutLink.addEventListener('click', () => {
    alert('Projeto de Ronei Costa Soares. version: ' + version);
});

elements.downloadSavesLink.addEventListener('click', () => {
    downloadSaves();
});

elements.uploadSavesLink.addEventListener('click', () => {
    uploadSaves();
});

elements.missaOrdinarioLink.addEventListener('click', () => {
    uiController.exibirFrame('santamissaFrame');
});

elements.notesButton.addEventListener('click', () => {
    //cifraPlayer.alternarNotas();
    
    // quando pressionar botão das notas, não tocar o acorde denovo
    // if (!elements.acorde1.classList.contains('d-none')) {
    //     cifraPlayer.tocarAcorde(cifraPlayer.acordeTocando);
    // }
});

elements.stopButton.addEventListener('mousedown', () => {
    uiController.esconderEditDeleteButtons();
    if (elements.acorde1.classList.contains('d-none')) {
        uiController.esconderBotoesAvancarVoltarCifra();
    }
    cifraPlayer.pararReproducao();
});

elements.playButton.addEventListener('mousedown', () => {
    if (elements.acorde1.classList.contains('d-none')) {
        cifraPlayer.iniciarReproducao();
        uiController.exibirBotoesAvancarVoltarCifra();
    }
})

elements.avancarButton.addEventListener('mousedown', () => {
    cifraPlayer.iniciarReproducao();
})

elements.simButtonAlert.addEventListener('click', () => {
    if (elements.alertModalLabel.textContent === 'Deletar!') {
        const saveName = elements.savesSelect.value;
        deletarSave(saveName);
    }
    else {
        const saveName = elements.searchModalLabel.textContent;
        salvarSave(saveName);
        if (elements.savesSelect.value === saveName) //verificação se for item deletado
            elements.tocarButton.dispatchEvent(new Event('click'));
    }
});

elements.naoButtonAlert.addEventListener('click', () => {
    $('#alertModal').modal('hide');
});

function handleInteractionStart() {
    held = false;
    timer = setTimeout(() => {
        held = true;
        const icon = elements.notesButton.querySelector('i');
        icon.classList.remove('bi-music-note-beamed');
        icon.classList.add('bi-music-note');
        elements.notesButton.classList.remove('pressed');
        elements.notesButton.classList.add('notaSolo');
    }, holdTime);
}

function handleInteractionEnd() {
    clearTimeout(timer);
}

document.addEventListener('mousedown', fullScreen);

document.addEventListener('click', (event) => {
    if (!elements.addButton.contains(event.target) &&
        !elements.deleteSavesSelect.contains(event.target) &&
        !elements.editSavesSelect.contains(event.target) &&
        !elements.savesSelect.contains(event.target)
    ) {
        uiController.esconderEditDeleteButtons();
    }
});

$('#itemModal').on('shown.bs.modal', () => {
    elements.itemNameInput.focus();
});

$('#searchModal').on('shown.bs.modal', () => {
    if (elements.savesSelect.value !== '')
        elements.searchModalLabel.textContent = elements.savesSelect.value;

    //elements.editTextarea.value = elements.iframeCifra.contentDocument.body.innerText;
    //elements.searchInput.focus();
    uiController.exibirBotaoTocar();

    if (_pesquisarNaWeb) {
        _pesquisarNaWeb = false;
        elements.searchIcon.classList.add('d-none');
        elements.spinner.classList.remove('d-none');
        elements.editTextarea.classList.add('d-none'); // editTextarea sempre oculto ao pesquisar na web
        elements.cifraDisplay.classList.add('d-none'); // cifraDisplay também oculto ao pesquisar na web
        elements.searchResultsList.classList.remove('d-none'); // Mostra a lista de resultados de pesquisa
    }
});

function escolhidoLetraOuCifra(tom) {
    if (tom !== '') {
        uiController.exibirBotoesCifras();
        elements.tomSelect.dispatchEvent(new Event('change'));
    }
    else {
        uiController.esconderBotoesAcordes();
        uiController.esconderBotoesPlay();
    }
}

function selectEscolhido(selectItem) {
    if (selectItem && selectItem !== 'acordes__') {
        const saves = JSON.parse(localStorage.getItem('saves'));
        elements.editTextarea.value = saves[selectItem];
        elements.searchModalLabel.textContent = selectItem;
        elements.savesSelect.style.color = 'black';
        const texto = elements.editTextarea.value;
        const musicaCifrada = cifraPlayer.destacarCifras(texto);
        const tom = descobrirTom(musicaCifrada);
        elements.iframeCifra.contentDocument.body.innerHTML = musicaCifrada;
        uiController.exibirTextoCifrasCarregado(tom, elements.editTextarea.value);

        escolhidoLetraOuCifra(tom);
        uiController.exibirIframeCifra();
        cifraPlayer.addEventCifrasIframe(elements.iframeCifra);

        cifraPlayer.indiceAcorde = 0;
    }
    else {
        uiController.exibirBotoesTom();
        uiController.exibirBotoesAcordes();
        elements.savesSelect.selectedIndex = 0;
        elements.iframeCifra.contentDocument.body.innerHTML = '';
    }
}

function descobrirTom(textoHtml) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = textoHtml;
    const cifrasTag = tempDiv.querySelectorAll('b');
    
    if (!cifrasTag.length) {
        return '';
    }
    
    const cifras = [];
    cifrasTag.forEach(acorde => {
        if (acorde.innerText)
            cifras.push(acorde.innerText.split('/')[0]);
    });
    
    const acordesOrdenados = cifras.sort();

    const padroesAcordes = {
        doisMenores: false,
        doisMaiores: false
    };

    for (let i = 0; i < acordesOrdenados.length - 1; i++) {
        if (acordesOrdenados[i].endsWith('m') && acordesOrdenados[i + 1].endsWith('m')) {
            padroesAcordes.doisMenores = true;
        }
        if (!acordesOrdenados[i].endsWith('m') && !acordesOrdenados[i + 1].endsWith('m')) {
            padroesAcordes.doisMaiores = true;
        }
    }

    const possiveisTons = {};
    for (const [tom, acordes] of Object.entries(camposHarmonicos)) {
        let pontos = 0;

        if (padroesAcordes.doisMenores) {
            for (let i = 0; i < acordes.length - 1; i++) {
                if (acordes[i].endsWith('m') && acordes[i + 1].endsWith('m')) {
                    pontos += 1;
                }
            }
        }
        if (padroesAcordes.doisMaiores) {
            for (let i = 0; i < acordes.length - 1; i++) {
                if (!acordes[i].endsWith('m') && !acordes[i + 1].endsWith('m')) {
                    pontos += 1;
                }
            }
        }

        pontos += cifras.filter(cifra => acordes.includes(cifra)).length;
        cifras.forEach(cifra => {
            if (!acordes.includes(cifra)) {
                pontos -= 1; // Subtrai 1 ponto se o acorde não estiver no campo harmônico
            }
        });

        possiveisTons[tom] = pontos;
    }

    const primeiroAcorde = cifras[0];
    const ultimoAcorde = cifras[cifras.length - 1];

    for (const tom in possiveisTons) {
        if (camposHarmonicos[tom][0] === primeiroAcorde) {
            possiveisTons[tom] += 1;
        }
        if (camposHarmonicos[tom][0] === ultimoAcorde) {
            possiveisTons[tom] += 1;
        }
    }

    const tomProvavel = Object.keys(possiveisTons).reduce((a, b) => possiveisTons[a] > possiveisTons[b] ? a : b);
    return tomProvavel;
}

function desselecionarTodos() {
    const allItems = document.querySelectorAll('.list-group-item');
    allItems.forEach(item => item.classList.remove('selected'));
}

function deletarSave(saveName) {
    let saves = JSON.parse(localStorage.getItem('saves') || '{}');
    delete saves[saveName];
    localStorage.setItem('saves', JSON.stringify(saves));
    elements.searchModalLabel.textContent = 'Música';
    elements.iframeCifra.contentDocument.body.innerHTML = '';
    elements.tomSelect.innerHTML = '<option value="">Letra</option>';

    uiController.exibirListaSaves();
}

function removerAcentosEcaracteres(str) {
    if (!str) {
        return "";
    }
    // 1. Normaliza para remover acentos
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 2. Remove tudo que não for letra (a-z, A-Z) ou número (0-9).
    // Se você quiser apenas letras, remova o 0-9.
    str = str.replace(/[^a-zA-Z0-9]/g, "");

    return str;
}

async function searchMusic() {
    musicaEscolhida = false;
    uiController.limparResultados();
    uiController.exibirInterfaceDePesquisa();

    const textoPesquisa = elements.searchInput.value;
    var titlesCifraClub = [];

    const termo = removerAcentosEcaracteres(textoPesquisa.toLowerCase().trim());

    var musicasLocais = todasAsCifras.filter(musica =>
        removerAcentosEcaracteres(musica.titulo.toLowerCase()).includes(termo) ||
        removerAcentosEcaracteres(musica.artista.toLowerCase()).includes(termo) ||
        removerAcentosEcaracteres(musica.cifra.toLowerCase()).includes(termo)
    );

    if (musicasLocais.length > 0) {
        const max = 4;
        const topTitles = musicasLocais.slice(0, max);
        topTitles.forEach((cifra) => {
            const title = cifra.titulo + ' - ' + cifra.artista;
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            const link = document.createElement('a');
            link.href = '#';
            link.onclick = () => choseCifraLocal(cifra.id);
            link.textContent = title;
            listItem.appendChild(link);
            elements.searchResultsList.appendChild(listItem);
        });

        uiController.esconderInterfaceDePesquisa();
    }

    try {
        const response = await fetch('https://apinode-h4wt.onrender.com/pesquisar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: textoPesquisa }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (data.success) {
            if (musicaEscolhida)
                return;

            const { lista: titles, links } = data; // destructuring
            titlesCifraClub = titles;
            if (titles.length > 0) {
                const max = 4;
                const topTitles = titles.slice(0, max);
                topTitles.forEach((title, index) => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    const link = document.createElement('a');
                    link.href = '#';
                    link.onclick = () => choseLink(links[index], title);
                    link.textContent = title;
                    listItem.appendChild(link);
                    elements.searchResultsList.appendChild(listItem);
                });
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        alert(`Erro na busca: ${error.message}`);
        elements.savesList.classList.remove('d-none');
        elements.searchResultsList.classList.add('d-none');
    } finally {
        uiController.esconderInterfaceDePesquisa();
        uiController.pararspinnerloading();
    }

    if (musicasLocais.length == 0 && titlesCifraClub == 0) {
        elements.searchResultsList.innerHTML = '<li class="list-group-item">Nenhuma cifra encontrada.</li>';
    }
}

async function choseCifraLocal(id) {
    musicaEscolhida = true;
    uiController.limparResultados();

    const musica = todasAsCifras.find(c => c.id === id);
    if (!musica) {
        alert('Cifra não encontrada.');
        return;
    }

    const texto = musica.cifra;
    const titulo = musica.titulo;

    elements.cifraDisplay.textContent = texto;

    if (elements.searchModalLabel.textContent === 'Música') {
        elements.searchModalLabel.textContent = titulo.split(' - ')[0];
    }
    uiController.exibirBotaoTocar();
}

async function choseLink(urlLink, titulo) {
    uiController.limparResultados();

    try {
        const response = await fetch('https://apinode-h4wt.onrender.com/downloadsite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: urlLink }),
        });
        const data = await response.json();
        if (data.success) {
            var texto = filtrarLetraCifra(data.message);
            elements.cifraDisplay.textContent = texto;
            uiController.exibirBotaoTocar();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Erro ao baixar a cifra. Tente novamente mais tarde.');
    } finally {
        uiController.exibirBotaoTocar();
    }
}

function filtrarLetraCifra(texto) {
    if (texto) {
        if (texto.includes('<pre>')) {
            return texto.split('<pre>')[1].split('</pre>')[0].replace(/<\/?[^>]+(>|$)/g, "");
        }
        else {
            return texto;
        }
    }
}

const togglePressedState = (event) => {
    const button = event.currentTarget;
    const action = button.dataset.action;

    if (action === 'notes') {
        var icon = notesButton.querySelector('i');
        if (!held && icon.classList.contains('bi-music-note')) {
            icon.classList.remove('bi-music-note');
            icon.classList.add('bi-music-note-beamed');
            elements.notesButton.classList.remove('notaSolo');
        }
        else if (elements.notesButton.classList.contains('pressed')) {
            // adiciona essas linhas para ao clicar no botão notas, ter o comportamento das 3 ações
            //elements.notesButton.classList.remove('pressed');
            icon.classList.remove('bi-music-note-beamed');
            icon.classList.add('bi-music-note');
            elements.notesButton.classList.remove('pressed');
            elements.notesButton.classList.add('notaSolo');
        } else if (!elements.notesButton.classList.contains('notaSolo')) {
            elements.notesButton.classList.add('pressed');
        }
    } else {        
        if (action === 'acorde') {
            cifraPlayer.pararReproducao();
            cifraPlayer.parado = false;
            cifraPlayer.tocarAcorde(button.value);
        }
        button.classList.remove('pressed');
        setTimeout(() => button.classList.add('pressed'), 100);

        if (action === 'play' || action === 'acorde') {
            setTimeout(() => button.classList.add('pulse'), 100);
            //elements.stopButton.classList.remove('pulse');
            elements.playButton.classList.add('d-none');
            elements.stopButton.classList.remove('d-none');
        } else {
            elements.playButton.classList.remove('d-none', 'pressed'),
            elements.stopButton.classList.add('d-none', 'pulse');
        }
    }
};

function pesquisarNaWeb(texto) {
    _pesquisarNaWeb = true;
    elements.searchInput.value = texto;
    $('#searchModal').modal('show');
    searchMusic();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    aplicarModoEscuroIframe();
};

const updateSwitchDarkMode = () => {
    const isDarkMode = document.body.classList.contains('dark-mode');
    if (isDarkMode) {
        elements.darkModeToggle.checked = false;
    } else {
        elements.darkModeToggle.checked = true;
    }
};

const aplicarModoEscuroIframe = () => {
    const scrollTop = localStorage.getItem('scrollTop');
    if (scrollTop && !location.origin.includes('file:')) {
        elements.santamissaFrame.contentWindow.scrollTo(0, parseInt(scrollTop));
    }
};

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function uploadSaves() {
    let input = document.getElementById('uploadSavesInput');
    if (!input) {
        input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.style.display = 'none';
        input.id = 'uploadSavesInput';
        document.body.appendChild(input);
    }

    input.value = ''; // Permite selecionar o mesmo arquivo novamente

    input.onchange = function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const importedSaves = JSON.parse(e.target.result);

                if (typeof importedSaves !== 'object' || Array.isArray(importedSaves)) {
                    alert('Arquivo inválido!');
                    return;
                }

                // Mescla com os saves existentes (ou substitui, se preferir)
                const currentSaves = JSON.parse(localStorage.getItem('saves') || '{}');
                const mergedSaves = { ...currentSaves, ...importedSaves };
                localStorage.setItem('saves', JSON.stringify(mergedSaves));

                // Atualiza a interface
                uiController.exibirListaSaves();
                alert('Importado com sucesso!');
            } catch (err) {
                alert('Erro: ' + err.message);
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

function downloadSaves() {
    const saves = localStorageManager.getSaves();
    const nomeDoArquivo = 'repertorio-orgao-web.json';

    if (Object.keys(saves).length === 0) {
        return;
    }

    const dataString = JSON.stringify(saves, null, 2);
    const blob = new Blob([dataString], { type: 'application/json' });

    // Cria um link temporário para gerar url em memória e simula um click no link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nomeDoArquivo;
    document.body.appendChild(link);
    link.click();

    // limpeza
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function fullScreen() {
    if (isMobileDevice()) {
        if (!document.fullscreenElement &&    // Opera 12.1, Firefox, Chrome, Edge, Safari
            !document.webkitFullscreenElement && // Old WebKit
            !document.mozFullScreenElement && // Old Firefox
            !document.msFullscreenElement) {  // IE/Edge
            var el = document.documentElement;
            var requestMethod = el.requestFullscreen || el.webkitRequestFullscreen ||
                el.mozRequestFullScreen || el.msRequestFullscreen;

            if (requestMethod) {
                requestMethod.call(el);
            }

            let wakeLock = null;
            try {
                wakeLock = navigator.wakeLock.request("screen");
            } catch { }
        }
    }
}

function salvarSave(newSaveName) {
    let saves = JSON.parse(localStorage.getItem('saves')) || {};

    if (newSaveName) {
        newSaveName = newSaveName.trim();
        //newSaveName = newSaveName.charAt(0).toUpperCase() + newSaveName.slice(1).toLowerCase();        
        let temSaveName = Object.keys(saves).some(saveName => saveName.toLowerCase() === newSaveName.toLowerCase());
        //saves.hasOwnProperty(newSaveName)

        if (temSaveName && elements.searchModalLabel.textContent !== newSaveName) {
            uiController.exibirMensagemAlerta(`Já existe esse nome!`, 'Atenção!');
            uiController.resetarOkAlert();

            $('#alertModal').modal('show');
            return;
        }

        let selectedOption = elements.savesSelect.options[elements.savesSelect.selectedIndex];
        let titulo = itemModalLabel.innerText;

        if (titulo.includes("Editar - ")) {
            var oldSaveName = titulo.split(' - ')[1];
            if (oldSaveName !== newSaveName) {
                var saveContent = saves[oldSaveName];
                saves[newSaveName] = saveContent;
                delete saves[oldSaveName];
                selectedOption.textContent = newSaveName;
                selectedOption.value = newSaveName;
                localStorage.setItem('saves', JSON.stringify(saves));
            }
        } else if (alertModalLabel.innerText === "Deletar!") {
            const saveName = elements.savesSelect.value;
            if (saveName) {
                deletarSave(saveName);
                $('#searchModal').modal('hide');
                $('#alertModal').modal('hide');
            }
        } else {
            let newOption = document.createElement("option");
            newOption.text = newSaveName;
            newOption.value = newSaveName;
            elements.savesSelect.add(newOption);
            elements.savesSelect.value = newSaveName;

            var saveContent = elements.editTextarea.value;

            const musicaCifrada = cifraPlayer.destacarCifras(saveContent);
            const tom = descobrirTom(musicaCifrada);
            uiController.exibirTextoCifrasCarregado(tom, elements.editTextarea.value);
            elements.iframeCifra.contentDocument.body.innerHTML = cifraPlayer.destacarCifras(saveContent, tom);
            uiController.exibirIframeCifra();
            cifraPlayer.addEventCifrasIframe(elements.iframeCifra);

            if (saveContent.includes('<pre>')) {
                saveContent = saveContent.split('<pre>')[1].split('</pre>')[0].replace(/<\/?[^>]+(>|$)/g, "");
            }
            //saveContent = saveContent.replace(/<style[\s\S]*?<\/style>|<\/?[^>]+(>|$)/g, "");
            saves[newSaveName] = saveContent;
            localStorage.setItem('saves', JSON.stringify(saves));
            elements.savesSelect.value = newSaveName;
            elements.searchModalLabel.textContent = newSaveName;
        }

        $('#searchModal').modal('hide');
        uiController.exibirListaSaves(newSaveName);
    }
}

['mousedown'].forEach(event => {
    elements.playButton.addEventListener(event, togglePressedState);
    elements.notesButton.addEventListener(event, togglePressedState);
    elements.stopButton.addEventListener(event, togglePressedState);
    elements.acorde1.addEventListener(event, togglePressedState);
    elements.acorde2.addEventListener(event, togglePressedState);
    elements.acorde3.addEventListener(event, togglePressedState);
    elements.acorde4.addEventListener(event, togglePressedState);
    elements.acorde5.addEventListener(event, togglePressedState);
    elements.acorde6.addEventListener(event, togglePressedState);
    elements.acorde7.addEventListener(event, togglePressedState);
    elements.acorde8.addEventListener(event, togglePressedState);
    elements.acorde9.addEventListener(event, togglePressedState);
    elements.acorde10.addEventListener(event, togglePressedState);
    elements.acorde11.addEventListener(event, togglePressedState);
});

document.addEventListener('DOMContentLoaded', () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('Service Worker registrado com sucesso:', registration.scope);
                })
                .catch(registrationError => {
                    console.log('Falha ao registrar o Service Worker:', registrationError);
                });
        });
    }

    var cifrasLocal = './cifras.json';
    cifrasLocal = 'https://roneicostasoares.com.br/orgao.web/cifras.json';
    if (location.origin.includes('file:')) {
        cifrasLocal = 'https://roneicostasoares.com.br/orgao.web/cifras.json';
    }

    fetch(cifrasLocal)
        .then(response => {
            if (!response.ok) {
                throw new Error('Não foi possível carregar o arquivo de cifras local.');
            }
            return response.json();
        })
        .then(data => {
            todasAsCifras = data;
            console.log(`${todasAsCifras.length} cifras locais carregadas com sucesso.`);
        })
        .catch(error => {
            console.error(error);
        });

    // acorda a api
    fetch('https://apinode-h4wt.onrender.com/')
        .then(response => response.json())

    // Zera a barra de rolagem de missa
    localStorage.setItem('scrollTop', 0);

    // Configura o estado inicial do toggle de modo escuro
    elements.darkModeToggle.checked = true;
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        updateSwitchDarkMode();
        aplicarModoEscuroIframe();
    }

    // Exibe a lista de saves ao carregar a página
    uiController.exibirListaSaves();
});
