class App {
    constructor(elements) {
        this.elements = elements;
        this.musicTheory = new MusicTheory();
        this.uiController = new UIController(this.elements);
        this.localStorageManager = new LocalStorageManager();
        this.cifraPlayer = new CifraPlayer(this.elements, this.uiController, this.musicTheory);
        this.draggableController = new DraggableController(this.elements.draggableControls);

        this.version = '2.8';
        this.holdTime = 1000;
        this.held = false;
        this.pesquisarNaWeb = false;
        this.editing = false;
        this.timer = null;
        this.todasAsCifras = [];
        this.musicaEscolhida = false;
        this.selectItemAntes = null;
    }

    init() {
        this.setupServiceWorker();
        this.loadCifrasLocal();
        this.warmupApi();
        this.setupDarkMode();
        this.uiController.exibirListaSaves();
        this.uiController.injetarEstilosNoIframeCifra();

        this.bindEvents();
        this.setupSelect2();
    }

    bindEvents() {
        // Centralização do addEventListener
        this.elements.santamissaFrame.addEventListener('load', this.handleSantaMissaLoad.bind(this));
        this.elements.selectedButton.addEventListener("click", this.handleSelectedButtonClick.bind(this));
        this.elements.cancelButton.addEventListener("click", this.handleCancelClick.bind(this));
        this.elements.saveButton.addEventListener('click', this.handleSaveClick.bind(this));
        this.elements.darkModeToggle.addEventListener('change', this.uiController.toggleDarkMode.bind(this));
        this.elements.tocarButton.addEventListener('click', this.handleTocarClick.bind(this));
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
        this.elements.aboutLink.addEventListener('click', () => this.uiController.customAlert(`Projeto de Ronei Costa Soares. version: ${this.version}`, 'Versão'));
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
            this.uiController.customAlert('jQuery ou Select2 não carregados.', 'Erro!');
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
        const confirmed = await this.uiController.customConfirm('Cancelar edição?');
        if (confirmed) {
            this.uiController.resetInterface();
            this.selectEscolhido(this.elements.itemNameInput.value);
        }
    }

    async handleSaveClick() {
        let saveName = this.elements.itemNameInput.value;

        if (this.editing) {
            this.editing = false;
            const confirmed = await this.uiController.customConfirm(`Salvar "${saveName}"?`);
            if (confirmed) {
                this.salvarSave(saveName, this.elements.savesSelect.value);
            } else {
                this.editing = true;
            }
        }
        else {
            this.salvarSave(saveName);
        }
    }

    handleTocarClick() {
        this.showLetraCifra(this.elements.cifraDisplay.textContent);
        $('#searchModal').modal('hide');
    }

    handleTomSelectChange(event) {
        const selectedTom = this.elements.tomSelect.value;
        if (selectedTom) {
            const acordesMode = this.elements.acorde1.classList.contains('d-none');
            if (acordesMode) {
                this.cifraPlayer.transposeCifra();
            } else {
                this.cifraPlayer.transporTom(selectedTom);
                if (!this.cifraPlayer.parado && this.cifraPlayer.acordeTocando) {
                    const button = event.currentTarget;
                    this.cifraPlayer.parado = false;
                    this.cifraPlayer.tocarAcorde(button.value);
                    button.classList.add('pressed');
                }
            }
        } else {
            this.cifraPlayer.removeCifras(this.elements.iframeCifra.contentDocument.body.innerHTML);
            this.uiController.exibirBotoesAcordes();
            this.cifraPlayer.preencherSelect('C');
        }
    }

    handleDecreaseTomClick() {
        if (this.elements.tomSelect.value) {
            const acordeIndex_B = this.elements.tomSelect.innerHTML.includes('Letra') ? 13 : 12;
            const acordeIndex_C = this.elements.tomSelect.innerHTML.includes('Letra') ? 1 : 0;

            let tomIndex = parseInt(this.elements.tomSelect.selectedIndex);
            if (tomIndex === acordeIndex_C)
                tomIndex = acordeIndex_B;
            this.elements.tomSelect.value = this.elements.tomSelect.options[tomIndex - 1].value;
            this.elements.tomSelect.dispatchEvent(new Event('change'));
        }
    }

    handleIncreaseTomClick() {
        if (this.elements.tomSelect.value) {
            const acordeIndex_B = this.elements.tomSelect.innerHTML.includes('Letra') ? 12 : 11;
            const acordeIndex_C = this.elements.tomSelect.innerHTML.includes('Letra') ? 0 : -1;

            let tomIndex = parseInt(this.elements.tomSelect.selectedIndex);
            if (tomIndex === acordeIndex_B)
                tomIndex = acordeIndex_C;
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
            this.elements.editTextarea.value = this.elements.iframeCifra.contentDocument.body.innerText;

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
            const confirmed = await this.uiController.customConfirm(`Deseja excluir "${saveName}"?`, 'Deletar!');
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

        if (this.pesquisarNaWeb) {
            this.pesquisarNaWeb = false;
            this.uiController.exibirInterfaceDePesquisaPesquisando();
        }
    }

    verifyLetraOuCifra(texto) {
        if (texto.includes('<pre class="cifra">')) {
            const tom = this.cifraPlayer.descobrirTom(texto);
            const musicaCifrada = this.cifraPlayer.destacarCifras(texto, tom);
            this.cifraPlayer.preencherSelect(tom);
            this.uiController.exibirBotoesCifras();
            this.elements.tomSelect.dispatchEvent(new Event('change'));
            this.cifraPlayer.preencherIframeCifra(musicaCifrada);
            this.cifraPlayer.addEventCifrasIframe(this.elements.iframeCifra);
        }
        else {
            this.uiController.exibirBotoesAcordes();
            this.cifraPlayer.preencherSelect('');
            this.cifraPlayer.preencherIframeCifra(texto);
        }
    }

    showLetraCifra(texto) {
        var textoMusica = this.cifraPlayer.destacarCifras(texto, null);
        this.verifyLetraOuCifra(textoMusica);

        this.uiController.exibirBotoesTom();
        this.uiController.exibirIframeCifra();
        this.cifraPlayer.indiceAcorde = 0;
    }

    async verificarTrocouTom() {
        if (this.cifraPlayer.tomOriginal && this.cifraPlayer.tomOriginal !== this.cifraPlayer.tomAtual) {
            this.cifraPlayer.tomOriginal = null;
            const confirmed = await this.uiController.customConfirm(`Você trocou de tom de ${this.cifraPlayer.tomOriginal} para ${this.cifraPlayer.tomAtual}. Substituir novo tom?`);
            if (confirmed) {
                var saveContent = this.elements.iframeCifra.contentDocument.body.innerText;
                this.localStorageManager.save(this.selectItemAntes, saveContent);
            }
        }
    }

    async selectEscolhido(selectItem) {
        if (this.selectItemAntes && this.selectItemAntes !== 'acordes__' && this.selectItemAntes !== '')
        await this.verificarTrocouTom();

        this.selectItemAntes = selectItem;

        if (selectItem && selectItem !== 'acordes__') {
            const texto = this.localStorageManager.getText(selectItem);
            this.showLetraCifra(texto);
        }
        else {
            this.uiController.exibirBotoesAcordes();
            this.cifraPlayer.preencherSelect('C');
            this.elements.savesSelect.selectedIndex = 0;
            this.cifraPlayer.preencherIframeCifra('');
        }
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
                const title = `${cifra.titulo} - ${cifra.artista ?? ''}`;
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
            await this.uiController.customAlert(`Erro na busca: ${error.message}`, 'Erro!');
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
            await this.uiController.customAlert('Cifra não encontrada.', 'Erro!');
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
                var texto = this.cifraPlayer.removerTagsDaCifra(data.message);
                this.elements.cifraDisplay.textContent = texto;
                this.uiController.exibirBotaoTocar();
            } else {
                await this.uiController.customAlert(data.message, 'Erro!');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            await this.uiController.customAlert('Erro ao baixar a cifra. Tente novamente mais tarde.', 'Erro!');
        } finally {
            this.uiController.exibirBotaoTocar();
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
                this.uiController.exibirBotaoStop();
            } else if (action === 'stop') {
                this.uiController.exibirBotaoPlay();
            }
        }
    }

    exibirFrame(frameId) {
        this.uiController.exibirBotoesTom();
        this.cifraPlayer.preencherSelect('C');
        this.uiController.exibirFrame(frameId);
    }

    pesquisarWeb(texto) {
        this.pesquisarNaWeb = true;
        this.elements.searchInput.value = texto;
        $('#searchModal').modal('show');
        this.searchMusic();
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
                    const importedData = JSON.parse(e.target.result);

                    if (typeof importedData !== 'object') {
                        await this.customAlert('Arquivo inválido: Não é um objeto ou array.', 'Erro!');
                        return;
                    }

                    let newSaves = {};

                    // 1. LÓGICA DE TRANSFORMAÇÃO:
                    if (Array.isArray(importedData)) {
                        // Formato: Array de Cifras (do editor ou do downloadSaves)
                        importedData.forEach(cifra => {
                            if (cifra.titulo && cifra.cifra) {
                                const chave = cifra.artista ? `${cifra.titulo} - ${cifra.artista}` : cifra.titulo;
                                newSaves[chave] = cifra.cifra;
                            }
                        });
                    } else {
                        // Formato: Objeto de Saves (original)
                        newSaves = importedData;
                    }

                    // Verifica se há algo para importar após a transformação
                    if (Object.keys(newSaves).length === 0) {
                        await this.uiController.customAlert('Arquivo importado, mas sem cifras válidas.', 'Aviso');
                        return;
                    }

                    // 2. Mescla com os saves existentes
                    const currentSaves = this.localStorageManager.getSaves();
                    // O operador spread ( ... ) irá sobrescrever chaves duplicadas
                    const mergedSaves = { ...currentSaves, ...newSaves };
                    localStorage.setItem('saves', JSON.stringify(mergedSaves));

                    // 3. Atualiza a interface
                    this.uiController.exibirListaSaves();

                    $('#optionsModal').modal('hide');
                    await this.uiController.customAlert('Importado com sucesso', 'Sucesso!');
                } catch (err) {
                    // Trata erro de parsing do JSON
                    await this.uiController.customAlert(`Erro ao processar o arquivo: ${err.message}`, 'Erro!');
                }
            };
            reader.readAsText(file);
        };

        input.click();
    }

    // --- DENTRO DA CLASSE App no script.js ---

    downloadSaves() {
        const saves = this.localStorageManager.getSaves();
        const nomeDoArquivo = 'repertorio-orgao-web.json';

        if (Object.keys(saves).length === 0) {
            return;
        }

        // 1. TRANSFORMAÇÃO DO FORMATO: Objeto de Saves -> Array de Cifras
        let maxId = 0;
        const arrayDeCifras = Object.keys(saves).map((nomeCompleto, index) => {
            maxId++;
            const conteudoCifra = saves[nomeCompleto];

            // Tenta separar Artista e Título do nome da chave (ex: "Titulo - Artista")
            let titulo = nomeCompleto;
            let artista = '';

            // Verifica se o nome da música segue o padrão "Título - Artista"
            const partes = nomeCompleto.split(' - ');
            if (partes.length > 1) {
                artista = partes.pop().trim(); // A última parte é o artista
                titulo = partes.join(' - ').trim(); // O restante é o título
            } else if (nomeCompleto.includes('-')) {
                // Se houver um '-' mas não for ' - ', use o nome completo como título
                titulo = nomeCompleto;
            }


            // Retorna o objeto no formato esperado pelo editar-cifras.html
            return {
                id: maxId,
                artista: artista,
                titulo: titulo,
                cifra: conteudoCifra
            };
        });

        // 2. Criação e Download do Blob
        const dataString = JSON.stringify(arrayDeCifras, null, 2);
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
            await this.uiController.customAlert(`Já existe "${newSaveName}". Escolha outro nome`, 'Salvar Música');
            return;
        }

        if (oldSaveName && oldSaveName !== newSaveName) {
            this.localStorageManager.editarNome(oldSaveName, newSaveName);
        }

        var saveContent = this.elements.editTextarea.value;
        this.localStorageManager.save(newSaveName, saveContent);
        this.elements.savesSelect.value = newSaveName;

        this.uiController.exibirIframeCifra();
        this.uiController.exibirListaSaves(newSaveName);

        this.selectEscolhido(newSaveName);
    }

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
            this.uiController.updateSwitchDarkMode();
            this.uiController.aplicarModoEscuroIframe();
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
        borderLeft: document.getElementById('borderLeft'),
        draggableControls: document.getElementById('draggableControls')
    };

    const app = new App(elements);
    app.init();
});
