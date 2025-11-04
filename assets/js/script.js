class App {
    constructor(elements) {
        this.elements = elements;
        this.cifraPlayer = new CifraPlayer(this.elements);
        this.uiController = new UIController(this.elements);
        this.localStorageManager = new LocalStorageManager();

        this.version = '1.5';
        this.holdTime = 1000;
        this.held = false;
        this.pesquisarNaWeb = false;
        this.editing = false;
        this.timer = null;
        this.todasAsCifras = [];
        this.musicaEscolhida = false;

        this.camposHarmonicos = {
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
    }

    init() {
        this.setupServiceWorker();
        this.loadCifrasLocal();
        this.warmupApi();
        this.setupDarkMode();
        this.uiController.exibirListaSaves();

        this.bindEvents();
        this.setupSelect2();
    }

    bindEvents() {
        // Centralização do addEventListener
        this.elements.santamissaFrame.addEventListener('load', this.handleSantaMissaLoad.bind(this));
        this.elements.selectedButton.addEventListener("click", this.handleSelectedButtonClick.bind(this));
        this.elements.cancelButton.addEventListener("click", this.handleCancelClick.bind(this));
        this.elements.saveButton.addEventListener('click', this.handleSaveClick.bind(this));
        this.elements.darkModeToggle.addEventListener('change', this.toggleDarkMode.bind(this));
        this.elements.tocarButton.addEventListener('click', this.handleTocarClick.bind(this));
        this.elements.prevButton.addEventListener('click', () => this.uiController.atualizarBotoesNavegacao('esquerda'));
        this.elements.nextButton.addEventListener('click', () => this.uiController.atualizarBotoesNavegacao('direita'));
        this.elements.tomSelect.addEventListener('change', this.handleTomSelectChange.bind(this));
        this.elements.decreaseTom.addEventListener('click', this.handleDecreaseTomClick.bind(this));
        this.elements.increaseTom.addEventListener('click', this.handleIncreaseTomClick.bind(this));
        this.elements.addButton.addEventListener('click', this.handleAddClick.bind(this));
        this.elements.editSavesSelect.addEventListener('click', this.handleEditSaveClick.bind(this));
        this.elements.deleteSavesSelect.addEventListener('click', this.handleDeleteSaveClick.bind(this));
        this.elements.searchInput.addEventListener('keydown', this.handleSearchInputKeydown.bind(this));
        this.elements.itemNameInput.addEventListener('keydown', this.handleItemNameInputKeydown.bind(this));
        this.elements.searchButton.addEventListener('click', this.searchMusic.bind(this));
        this.elements.clearButton.addEventListener('click', () => this.handleClearSearchClick());
        this.elements.liturgiaDiariaLink.addEventListener('click', () => this.exibirFrame('liturgiaDiariaFrame'));
        this.elements.oracoesLink.addEventListener('click', () => this.exibirFrame('oracoesFrame'));
        this.elements.aboutLink.addEventListener('click', () => this.customAlert(`Projeto de Ronei Costa Soares. version: ${this.version}`, 'Versão'));
        this.elements.downloadSavesLink.addEventListener('click', this.downloadSaves.bind(this));
        this.elements.uploadSavesLink.addEventListener('click', this.uploadSaves.bind(this));
        this.elements.missaOrdinarioLink.addEventListener('click', () => this.exibirFrame('santamissaFrame'));
        this.elements.stopButton.addEventListener('mousedown', this.handleStopMousedown.bind(this));
        this.elements.playButton.addEventListener('mousedown', this.handlePlayMousedown.bind(this));
        this.elements.avancarButton.addEventListener('mousedown', () => this.cifraPlayer.iniciarReproducao());
        document.addEventListener('mousedown', this.fullScreen.bind(this));
        document.addEventListener('click', this.handleDocumentClick.bind(this));
        $('#searchModal').on('shown.bs.modal', this.handleSearchModalShown.bind(this));

        // Refatoração: Adicionar listeners aos botões de acorde de forma programática
        ['mousedown'].forEach(event => {
            const controlButtons = [
                this.elements.playButton,
                this.elements.notesButton,
                this.elements.stopButton,
                ...document.querySelectorAll('button[data-action="acorde"]')
            ];
            controlButtons.forEach(button => {
                button.addEventListener(event, this.togglePressedState.bind(this));
            });
        });
    }

    setupSelect2() {
        // 1. Salva a referência 'this' da instância da App porque senão o valor de this dentro dessa função é definido pelo jQuery e geralmente aponta para o elemento DOM 
        const appInstance = this;

        // Garante que o jQuery esteja carregado antes de usar
        if (typeof $ === 'undefined' || typeof $.fn.select2 === 'undefined') {
            this.customAlert('jQuery ou Select2 não carregados.', 'Erro!');
            return;
        }

        var $select = $('#savesSelect').select2({
            theme: 'bootstrap4',
            placeholder: "Escolha a Música...",
            width: '100%',
            minimumResultsForSearch: 0,
            language: {
                noResults: function () {
                    return "";
                }
            }
        });

        $(document).on('keyup.appSelect2', '.select2-search__field', function (e) {
            var searchTerm = $(this).val().trim();

            $('.select2-results__options').find('.pesquisar-na-web').remove();

            if (searchTerm) {
                var $optionPesquisaWeb = $('<li class="select2-results__option pesquisar-na-web" role="treeitem" aria-selected="false"></li>');
                $optionPesquisaWeb.html('<i class="bi bi-search"></i> Pesquisar na Web');

                $('.select2-results__options').prepend($optionPesquisaWeb);

                $optionPesquisaWeb.on('click', function () {
                    appInstance.pesquisarWeb(searchTerm);
                    $select.select2('close');
                });
            }
        });


        $('#savesSelect').on('select2:select', function (e) {
            var selectedValue = e.params.data.id;
            appInstance.selectEscolhido(selectedValue);

            if (selectedValue === 'acordes__') {
                $(this).val(null).trigger('change');
            }
        });
    }

    handleSantaMissaLoad() {
        window.addEventListener('message', (event) => {
            if (event.data === 'mostrarLiturgiaDiaria') {
                this.elements.liturgiaDiariaFrame.classList.remove('d-none');
                this.elements.santamissaFrame.classList.add('d-none');
                this.elements.oracoesFrame.classList.add('d-none');
            }
        });
    }

    handleSelectedButtonClick() {
        this.uiController.exibirSavesSelect();
        this.selectEscolhido(this.elements.selectedButton.innerText);
    }

    async handleCancelClick() {
        const confirmed = await this.customConfirm('Cancelar edição?');
        if (confirmed) {
            this.uiController.resetInterface();
            this.selectEscolhido(this.elements.itemNameInput.value);
        }
    }

    async handleSaveClick() {
        let saveName = this.elements.itemNameInput.value;

        if (this.editing) {
            this.editing = false;
            const confirmed = await this.customConfirm(`Salvar "${saveName}"?`);
            if (confirmed) {
                this.salvarSave(saveName, this.elements.savesSelect.value);
                // A transposição é tratada dentro de salvarSave ou logo após
            }
        }
        else {
            this.salvarSave(saveName);
        }
    }

    handleTocarClick() {
        this.uiController.exibirBotoesCifras();
        const texto = this.elements.cifraDisplay.textContent; // Mudança de value para textContent
        let musicaCifrada = this.cifraPlayer.destacarCifras(texto);
        const tom = this.descobrirTom(musicaCifrada);
        musicaCifrada = this.cifraPlayer.destacarCifras(texto, tom);
        this.exibirTextoCifrasCarregado(tom, this.elements.editTextarea.value);
        this.elements.iframeCifra.contentDocument.body.innerHTML = musicaCifrada;

        if (!tom)
            this.elements.tomSelect.dispatchEvent(new Event('change'));

        if (tom === '') {
            let textoLetra = this.elements.iframeCifra.contentDocument.body.innerHTML;
            textoLetra = textoLetra.replace("font-family: Consolas, 'Courier New', Courier, monospace;", "font-family: 'Roboto', sans-serif;")
                .replace("font-size: 12pt;", "font-size: 15pt;");
            this.elements.iframeCifra.contentDocument.body.innerHTML = textoLetra;
        }

        this.uiController.exibirIframeCifra();
        this.cifraPlayer.addEventCifrasIframe(this.elements.iframeCifra);
        this.cifraPlayer.indiceAcorde = 0;
        $('#searchModal').modal('hide');
    }

    handleTomSelectChange(event) {
        if (this.elements.tomSelect.value) { // Selecionado um Tom (não "Letra")
            if (this.elements.acorde1.classList.contains('d-none')) {
                this.cifraPlayer.transposeCifra();
            } else {
                this.cifraPlayer.transporTom();
                if (!this.cifraPlayer.parado && this.cifraPlayer.acordeTocando) {
                    const button = event.currentTarget;
                    this.cifraPlayer.pararReproducao();
                    this.cifraPlayer.parado = false;
                    this.cifraPlayer.tocarAcorde(button.value);
                    button.classList.add('pressed');
                }
            }
        } else { // Selecionado "Letra"
            this.cifraPlayer.removeCifras(this.elements.iframeCifra.contentDocument.body.innerHTML);
            this.uiController.exibirBotoesAcordes();
            this.cifraPlayer.preencherSelect('C');
            this.uiController.esconderBotoesTom();
        }
    }

    handleDecreaseTomClick() {
        if (this.elements.tomSelect.value) {
            const acordeIndex_B_Bm = 13;
            let tomIndex = parseInt(this.elements.tomSelect.selectedIndex);
            if (tomIndex === 1)
                tomIndex = acordeIndex_B_Bm;
            this.elements.tomSelect.value = this.elements.tomSelect.options[tomIndex - 1].value;
            this.elements.tomSelect.dispatchEvent(new Event('change'));
        }
    }

    handleIncreaseTomClick() {
        if (this.elements.tomSelect.value) {
            const acordeIndex_C_Cm = 0;
            let tomIndex = parseInt(this.elements.tomSelect.selectedIndex);
            if (tomIndex === 12)
                tomIndex = acordeIndex_C_Cm;
            this.elements.tomSelect.value = this.elements.tomSelect.options[tomIndex + 1].value;
            this.elements.tomSelect.dispatchEvent(new Event('change'));
        }
    }

    handleAddClick() {
        this.elements.addButton.classList.add('pressed');

        setTimeout(() => {
            this.elements.addButton.classList.remove('pressed');
        }, 100);

        if (!this.elements.deleteSavesSelect.classList.contains('d-none')) {
            this.elements.itemNameInput.value = '';
            $('#savesSelect').val('').trigger('change');
            //$('#savesSelect').trigger('change');

            this.uiController.editarMusica();
            this.uiController.exibirBotoesTom();
            this.uiController.exibirBotoesAcordes();
            this.cifraPlayer.preencherSelect('C');
            this.elements.itemNameInput.click();
        }

        this.uiController.toggleEditDeleteButtons();
    }

    handleEditSaveClick() {
        const saveName = this.elements.savesSelect.value;
        if (saveName)
            this.editing = true;
        this.elements.itemNameInput.value = saveName ? saveName : '';

        // O conteúdo do iframe é a cifra atual (pode estar transposta)
        this.elements.editTextarea.value = this.elements.iframeCifra.contentDocument.body.innerText;
        this.uiController.editarMusica();
        this.uiController.exibirBotoesTom();
        this.uiController.exibirBotoesAcordes();
        this.cifraPlayer.preencherSelect('C');
    }

    async handleDeleteSaveClick() {
        const saveName = this.elements.savesSelect.value;
        if (this.elements.savesSelect.selectedIndex !== 0) {
            const confirmed = await this.customConfirm(`Deseja excluir "${saveName}"?`, 'Deletar!');
            if (confirmed) {
                this.localStorageManager.delete(saveName);
                this.uiController.resetInterface();
                this.uiController.exibirListaSaves();
                this.selectEscolhido('acordes__');
            }
        }
    }

    handleSearchInputKeydown(event) {
        if (event.key === 'Enter') {
            this.searchMusic();
        }
    }

    handleItemNameInputKeydown(event) {
        if (event.key === 'Enter') {
            this.elements.saveButton.click(); // Simula o clique no botão Salvar
        }
    }

    handleClearSearchClick() {
        // refatorado
        this.elements.searchInput.value = '';
        this.elements.searchInput.focus();
    }

    handleStopMousedown() {
        this.uiController.esconderEditDeleteButtons();
        if (this.elements.acorde1.classList.contains('d-none')) {
            this.uiController.esconderBotoesAvancarVoltarCifra();
        }
        this.cifraPlayer.pararReproducao();
    }

    handlePlayMousedown() {
        if (this.elements.acorde1.classList.contains('d-none')) {
            this.cifraPlayer.iniciarReproducao();
            this.uiController.exibirBotoesAvancarVoltarCifra();
        }
    }

    handleDocumentClick(event) {
        if (!this.elements.addButton.contains(event.target) &&
            !this.elements.deleteSavesSelect.contains(event.target) &&
            !this.elements.editSavesSelect.contains(event.target) &&
            !this.elements.savesSelect.contains(event.target)
        ) {
            this.uiController.esconderEditDeleteButtons();
        }
    }

    handleSearchModalShown() {
        if (this.elements.savesSelect.value !== '')
            this.elements.searchModalLabel.textContent = this.elements.savesSelect.value;

        this.uiController.exibirBotaoTocar();

        if (this.pesquisarNaWeb) {
            this.pesquisarNaWeb = false;
            this.elements.searchIcon.classList.add('d-none');
            this.elements.spinner.classList.remove('d-none');
            this.elements.editTextarea.classList.add('d-none');
            this.elements.cifraDisplay.classList.add('d-none');
            this.elements.searchResultsList.classList.remove('d-none');
        }
    }

    escolhidoLetraOuCifra(tom) {
        if (tom !== '') {
            this.uiController.exibirBotoesCifras();
            this.elements.tomSelect.dispatchEvent(new Event('change'));
        }
        else {
            this.uiController.esconderBotoesAcordes();
            this.uiController.esconderBotoesPlay();
        }
    }

    selectEscolhido(selectItem) {
        if (selectItem && selectItem !== 'acordes__') {
            const saves = this.localStorageManager.getSaves();
            this.elements.editTextarea.value = saves[selectItem];
            this.elements.searchModalLabel.textContent = selectItem;
            this.elements.savesSelect.style.color = 'black';
            const texto = this.elements.editTextarea.value;
            const musicaCifrada = this.cifraPlayer.destacarCifras(texto);
            const tom = this.descobrirTom(musicaCifrada);

            // Re-renderiza com o tom descoberto para preencher o select
            const musicaCifradaFinal = this.cifraPlayer.destacarCifras(texto, tom);
            this.elements.iframeCifra.contentDocument.body.innerHTML = musicaCifradaFinal;

            this.exibirTextoCifrasCarregado(tom, this.elements.editTextarea.value);
            this.escolhidoLetraOuCifra(tom);
            this.uiController.exibirIframeCifra();
            this.cifraPlayer.addEventCifrasIframe(this.elements.iframeCifra);
            this.cifraPlayer.indiceAcorde = 0;
        }
        else {
            this.uiController.exibirBotoesTom();
            this.uiController.exibirBotoesAcordes();
            this.cifraPlayer.preencherSelect('C');
            this.elements.savesSelect.selectedIndex = 0;
            this.elements.iframeCifra.contentDocument.body.innerHTML = '';
        }
    }

    descobrirTom(textoHtml) {
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

        // Lógica de descoberta do tom (mantida igual, mas agora usando this.camposHarmonicos)
        const acordesOrdenados = cifras.sort();
        const padroesAcordes = { doisMenores: false, doisMaiores: false };

        for (let i = 0; i < acordesOrdenados.length - 1; i++) {
            if (acordesOrdenados[i].endsWith('m') && acordesOrdenados[i + 1].endsWith('m')) {
                padroesAcordes.doisMenores = true;
            }
            if (!acordesOrdenados[i].endsWith('m') && !acordesOrdenados[i + 1].endsWith('m')) {
                padroesAcordes.doisMaiores = true;
            }
        }

        const possiveisTons = {};
        for (const [tom, acordes] of Object.entries(this.camposHarmonicos)) {
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
            if (this.camposHarmonicos[tom][0] === primeiroAcorde) {
                possiveisTons[tom] += 1;
            }
            if (this.camposHarmonicos[tom][0] === ultimoAcorde) {
                possiveisTons[tom] += 1;
            }
        }

        const tomProvavel = Object.keys(possiveisTons).reduce((a, b) => possiveisTons[a] > possiveisTons[b] ? a : b);
        return tomProvavel;
    }

    removerAcentosEcaracteres(str) {
        if (!str) {
            return "";
        }
        str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        str = str.replace(/[^a-zA-Z0-9]/g, "");
        return str;
    }

    async searchMusic() {
        this.musicaEscolhida = false;
        this.uiController.limparResultados();
        this.uiController.exibirInterfaceDePesquisa();

        const textoPesquisa = this.elements.searchInput.value;
        var titlesCifraClub = [];

        const termo = this.removerAcentosEcaracteres(textoPesquisa.toLowerCase().trim());

        var musicasLocais = this.todasAsCifras.filter(musica =>
            this.removerAcentosEcaracteres(musica.titulo.toLowerCase()).includes(termo) ||
            this.removerAcentosEcaracteres(musica.artista.toLowerCase()).includes(termo) ||
            this.removerAcentosEcaracteres(musica.cifra.toLowerCase()).includes(termo)
        );

        // Lógica de exibição de resultados locais
        if (musicasLocais.length > 0) {
            const max = 4;
            const topTitles = musicasLocais.slice(0, max);
            topTitles.forEach((cifra) => {
                const title = cifra.titulo + ' - ' + cifra.artista;
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                const link = document.createElement('a');
                link.href = '#';
                link.onclick = () => this.choseCifraLocal(cifra.id);
                link.textContent = title;
                listItem.appendChild(link);
                this.elements.searchResultsList.appendChild(listItem);
            });

            this.uiController.esconderInterfaceDePesquisa();
        }

        // Lógica de pesquisa na Web (mantida igual, com ajuste para `this`)
        try {
            const response = await fetch('https://apinode-h4wt.onrender.com/pesquisar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto: textoPesquisa }),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            if (data.success) {
                if (this.musicaEscolhida)
                    return;

                const { lista: titles, links } = data;
                titlesCifraClub = titles;
                if (titles.length > 0) {
                    const max = 4;
                    const topTitles = titles.slice(0, max);
                    topTitles.forEach((title, index) => {
                        const listItem = document.createElement('li');
                        listItem.className = 'list-group-item';
                        const link = document.createElement('a');
                        link.href = '#';
                        link.onclick = () => this.choseLink(links[index], title);
                        link.textContent = title;
                        listItem.appendChild(link);
                        this.elements.searchResultsList.appendChild(listItem);
                    });
                }
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            await this.customAlert(`Erro na busca: ${error.message}`, 'Erro!');
            this.elements.savesList.classList.remove('d-none');
            this.elements.searchResultsList.classList.add('d-none');
        } finally {
            this.uiController.esconderInterfaceDePesquisa();
            this.uiController.pararspinnerloading();
        }

        if (musicasLocais.length === 0 && titlesCifraClub.length === 0) {
            this.elements.searchResultsList.innerHTML = '<li class="list-group-item">Nenhuma cifra encontrada.</li>';
        }
    }

    async choseCifraLocal(id) {
        this.musicaEscolhida = true;
        this.uiController.limparResultados();

        const musica = this.todasAsCifras.find(c => c.id === id);
        if (!musica) {
            await this.customAlert('Cifra não encontrada.', 'Erro!');
            return;
        }

        const texto = musica.cifra;
        const titulo = musica.titulo;

        this.elements.cifraDisplay.textContent = texto;

        if (this.elements.searchModalLabel.textContent === 'Música') {
            this.elements.searchModalLabel.textContent = titulo.split(' - ')[0];
        }
        this.uiController.exibirBotaoTocar();
    }

    async choseLink(urlLink, titulo) {
        this.uiController.limparResultados();

        try {
            const response = await fetch('https://apinode-h4wt.onrender.com/downloadsite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: urlLink }),
            });
            const data = await response.json();
            if (data.success) {
                var texto = this.filtrarLetraCifra(data.message);
                this.elements.cifraDisplay.textContent = texto;
                this.uiController.exibirBotaoTocar();
            } else {
                await this.customAlert(data.message, 'Erro!');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            await this.customAlert('Erro ao baixar a cifra. Tente novamente mais tarde.', 'Erro!');
        } finally {
            this.uiController.exibirBotaoTocar();
        }
    }

    filtrarLetraCifra(texto) {
        if (texto) {
            if (texto.includes('<pre>')) {
                return texto.split('<pre>')[1].split('</pre>')[0].replace(/<\/?[^>]+(>|$)/g, "");
            }
            else {
                return texto;
            }
        }
    }

    togglePressedState(event) {
        const button = event.currentTarget;
        const action = button.dataset.action;

        // O 'notesButton' está fora da iteração do querySelectorAll
        if (action === 'notes') {
            var icon = this.elements.notesButton.querySelector('i');
            if (!this.held && icon.classList.contains('bi-music-note')) {
                icon.classList.remove('bi-music-note');
                icon.classList.add('bi-music-note-beamed');
                this.elements.notesButton.classList.remove('notaSolo');
            }
            else if (this.elements.notesButton.classList.contains('pressed')) {
                icon.classList.remove('bi-music-note-beamed');
                icon.classList.add('bi-music-note');
                this.elements.notesButton.classList.remove('pressed');
                this.elements.notesButton.classList.add('notaSolo');
            } else if (!this.elements.notesButton.classList.contains('notaSolo')) {
                this.elements.notesButton.classList.add('pressed');
            }
        } else {
            if (action === 'acorde') {
                this.cifraPlayer.pararReproducao();
                this.cifraPlayer.parado = false;
                this.cifraPlayer.tocarAcorde(button.value);
            }
            // Remove o pressed de todos os outros botões de acorde
            document.querySelectorAll('button[data-action="acorde"]').forEach(btn => {
                if (btn !== button) {
                    btn.classList.remove('pressed');
                }
            });

            button.classList.remove('pressed');
            setTimeout(() => button.classList.add('pressed'), 100);

            if (action === 'play' || action === 'acorde') {
                setTimeout(() => button.classList.add('pulse'), 100);
                this.elements.playButton.classList.add('d-none');
                this.elements.stopButton.classList.remove('d-none');
            } else if (action === 'stop') {
                this.elements.playButton.classList.remove('d-none');
                this.elements.stopButton.classList.add('d-none');
            }
        }
    }

    exibirFrame(frameId) {
        this.cifraPlayer.preencherSelect('C');
        this.uiController.exibirFrame(frameId);
    }

    exibirTextoCifrasCarregado(tom = null) {
        if (tom) {
            this.uiController.exibirBotoesTom();
            this.cifraPlayer.preencherSelect(tom);
        }
        else {
            this.uiController.esconderBotoesTom();
            let textoLetra = this.elements.iframeCifra.contentDocument.body.innerHTML;
            textoLetra = textoLetra.replace("font-family: Consolas, 'Courier New', Courier, monospace;", "font-family: 'Roboto', sans-serif;")
                .replace("font-size: 12pt;", "font-size: 15pt;");
            this.elements.iframeCifra.contentDocument.body.innerHTML = textoLetra;
        }
    }

    pesquisarWeb(texto) {
        this.pesquisarNaWeb = true;
        this.elements.searchInput.value = texto;
        $('#searchModal').modal('show');
        this.searchMusic();
    }

    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        this.aplicarModoEscuroIframe();
    }

    updateSwitchDarkMode() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (isDarkMode) {
            this.elements.darkModeToggle.checked = false;
        } else {
            this.elements.darkModeToggle.checked = true;
        }
    }

    aplicarModoEscuroIframe() {
        const scrollTop = localStorage.getItem('scrollTop');
        if (scrollTop && !location.origin.includes('file:')) {
            this.elements.santamissaFrame.contentWindow.scrollTo(0, parseInt(scrollTop));
        }
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    uploadSaves() {
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

        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const importedSaves = JSON.parse(e.target.result);

                    if (typeof importedSaves !== 'object' || Array.isArray(importedSaves)) {
                        await this.customAlert('Arquivo inválido', 'Erro!');
                        return;
                    }

                    const currentSaves = this.localStorageManager.getSaves();
                    const mergedSaves = { ...currentSaves, ...importedSaves };
                    localStorage.setItem('saves', JSON.stringify(mergedSaves));

                    this.uiController.exibirListaSaves();
                    await this.customAlert('Importado com sucesso', 'Sucesso!');
                } catch (err) {
                    await this.customAlert(err.message, 'Erro!');
                }
            };
            reader.readAsText(file);
        };

        input.click();
    }

    downloadSaves() {
        const saves = this.localStorageManager.getSaves();
        const nomeDoArquivo = 'repertorio-orgao-web.json';

        if (Object.keys(saves).length === 0) {
            return;
        }

        const dataString = JSON.stringify(saves, null, 2);
        const blob = new Blob([dataString], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = nomeDoArquivo;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    fullScreen() {
        if (this.isMobileDevice()) {
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

                try {
                    navigator.wakeLock.request("screen");
                } catch { }
            }
        }
    }

    async salvarSave(newSaveName, oldSaveName) {
        if (!newSaveName) {
            const musicasDefault = this.elements.savesSelect.querySelectorAll('option[value^="Música "]');
            const count = musicasDefault.length + 1;
            newSaveName = "Música " + count;
        }

        let saves = this.localStorageManager.getSaves();

        newSaveName = newSaveName.trim();
        let temSaveName = Object.keys(saves).some(saveName => saveName.toLowerCase() === newSaveName.toLowerCase());

        if (temSaveName && newSaveName.toLowerCase() !== this.elements.savesSelect.value.toLowerCase()) {
            await this.customAlert(`Já existe "${newSaveName}". Escolha outro nome`, 'Salvar Música');
            return;
        }

        if (oldSaveName && oldSaveName !== newSaveName) {
            // Edição de nome
            this.localStorageManager.editarNome(oldSaveName, newSaveName);
        }

        var saveContent = this.elements.editTextarea.value;
        this.localStorageManager.save(newSaveName, saveContent);
        this.elements.savesSelect.value = newSaveName;

        this.uiController.exibirIframeCifra();
        this.uiController.exibirListaSaves(newSaveName);

        this.selectEscolhido(newSaveName);
    }

    // --- Modal Functions (moved from global scope) ---
    async customAlert(message, title = "Aviso", buttonText = "OK") {
        return new Promise((resolve) => {
            const modal = new bootstrap.Modal(document.getElementById('customAlertModal'));
            const modalTitle = document.getElementById('customAlertModalLabel');
            const modalBody = document.getElementById('customAlertModalBody');
            const btnOk = document.getElementById('btnAlertDialogOK');

            modalTitle.textContent = title;
            modalBody.textContent = message;
            btnOk.textContent = buttonText;

            btnOk.onclick = null;

            const handleModalHidden = () => {
                resolve();
                document.getElementById('customAlertModal').removeEventListener('hidden.bs.modal', handleModalHidden);
            };
            document.getElementById('customAlertModal').addEventListener('hidden.bs.modal', handleModalHidden);

            btnOk.onclick = () => {
                modal.hide();
            };

            modal.show();
        });
    }

    async customConfirm(message, title = "Confirmação") {
        return new Promise((resolve) => {
            const modal = new bootstrap.Modal(document.getElementById('customConfirmModal'));
            const modalTitle = document.getElementById('customConfirmModalLabel');
            const modalBody = document.getElementById('customConfirmModalBody');
            const btnConfirmAction = document.getElementById('btnConfirmAction');
            const btnCancelAction = document.getElementById('btnConfirmCancel');

            modalTitle.textContent = title;
            modalBody.textContent = message;

            btnConfirmAction.onclick = null;
            btnCancelAction.onclick = null;

            btnConfirmAction.onclick = () => {
                modal.hide();
                resolve(true);
            };

            btnCancelAction.onclick = () => {
                modal.hide();
                resolve(false); // Retorna false se cancelar
            };

            const handleModalHidden = () => {
                resolve(false);
                document.getElementById('customConfirmModal').removeEventListener('hidden.bs.modal', handleModalHidden);
            };
            document.getElementById('customConfirmModal').addEventListener('hidden.bs.modal', handleModalHidden);

            modal.show();
        });
    }

    // --- Setup Methods ---

    setupServiceWorker() {
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
    }

    loadCifrasLocal() {
        var cifrasLocal = './cifras.json';
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
                this.todasAsCifras = data;
                console.log(`${this.todasAsCifras.length} cifras locais carregadas com sucesso.`);
            })
            .catch(error => {
                console.error(error);
            });
    }

    warmupApi() {
        // acorda a api
        fetch('https://apinode-h4wt.onrender.com/')
            .then(response => response.json())
            .catch(() => console.log("API Warmup failed/ignored."));
    }

    setupDarkMode() {
        localStorage.setItem('scrollTop', 0); // Zera a barra de rolagem de missa

        this.elements.darkModeToggle.checked = true;
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            this.updateSwitchDarkMode();
            this.aplicarModoEscuroIframe();
        }
    }
}

// Inicialização da Aplicação
document.addEventListener('DOMContentLoaded', () => {
    // Definição do objeto 'elements' (mantida fora da classe App por ser um seletor de DOM global)
    // O ideal seria passar apenas o 'container' e ter o App responsável por buscar os elementos internos.
    const elements = {
        controlButtons: document.getElementById('controlButtons'),
        cifraDisplay: document.getElementById('cifraDisplay'),
        editTextarea: document.getElementById('editTextarea'),
        tocarButton: document.getElementById('tocarButton'),
        saveButton: document.getElementById('saveButton'),
        cancelButton: document.getElementById('cancelButton'),
        addButton: document.getElementById('addButton'),
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

    const app = new App(elements);
    app.init();
});
