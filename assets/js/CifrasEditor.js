// --- START OF FILE CifrasEditor.js ---

class CifrasEditor {
    constructor() {
        this.cifras = [];
        this.url = 'https://roneicostasoares.com.br/orgao.web/cifras.json';
        this.LOCAL_KEY = 'cifras_local';
        this.selectedCifraIndex = -1; // Índice da cifra sendo editada

        // Elementos DOM
        this.elements = {
            cifraSelect: document.getElementById('cifra-select'),
            addBtn: document.getElementById('add-btn'),
            deleteBtn: document.getElementById('delete-btn'),
            saveBtn: document.getElementById('save-btn'),
            downloadBtn: document.getElementById('download-btn'),

            // Card de Edição
            editCard: document.getElementById('cifra-edit-card'),
            cardTitle: document.getElementById('card-title'),
            editId: document.getElementById('edit-id'),
            editTitulo: document.getElementById('edit-titulo'),
            editArtista: document.getElementById('edit-artista'),
            editCifra: document.getElementById('edit-cifra'),
        };
    }

    init() {
        this.loadCifras().then(() => {
            this.setupSelect2();
            this.bindEvents();
        });
    }

    bindEvents() {
        this.elements.addBtn.addEventListener('click', this.addCifra.bind(this));
        this.elements.deleteBtn.addEventListener('click', this.deleteSelectedCifra.bind(this));
        this.elements.saveBtn.addEventListener('click', this.saveCurrentCifra.bind(this));
        this.elements.downloadBtn.addEventListener('click', this.downloadJson.bind(this));

        // Listeners nos campos do Card para salvar automaticamente
        [this.elements.editTitulo, this.elements.editArtista, this.elements.editCifra].forEach(el => {
            el.addEventListener('input', this.handleCardInputChange.bind(this));
        });
    }

    setupSelect2() {
        // Inicializa Select2 com as opções (cifras)
        const data = this.cifras.map((cifra, index) => ({
            id: index, // Usamos o índice do array como ID (pois é temporário)
            text: `${cifra.titulo} - ${cifra.artista}`
        }));

        $(this.elements.cifraSelect).select2({
            data: data,
            theme: 'bootstrap4',
            placeholder: "Selecione uma Cifra para Editar...",
            allowClear: true // Permite deselecionar
        });

        // Evento Select2: Seleção de Cifra
        $(this.elements.cifraSelect).on('select2:select', this.handleCifraSelect.bind(this));

        // Evento Select2: Deseleção
        $(this.elements.cifraSelect).on('select2:clear', this.clearCard.bind(this));
    }

    handleCifraSelect(e) {
        const index = parseInt(e.params.data.id);
        this.selectedCifraIndex = index;
        this.loadCard(this.cifras[index]);
    }

    clearCard() {
        this.selectedCifraIndex = -1;
        this.elements.editCard.classList.add('d-none');
        this.elements.saveBtn.classList.add('d-none');
        this.elements.deleteBtn.classList.add('d-none');

        // Limpar todos os campos do card
        this.elements.editId.value = '';
        this.elements.editTitulo.value = '';
        this.elements.editArtista.value = '';
        this.elements.editCifra.value = '';
        this.elements.cardTitle.textContent = '';
    }

    loadCard(cifra) {
        if (!cifra) {
            this.clearCard();
            return;
        }

        this.elements.cardTitle.textContent = `${cifra.titulo} - ${cifra.artista}`;
        this.elements.editId.value = cifra.id || '';
        this.elements.editTitulo.value = cifra.titulo || '';
        this.elements.editArtista.value = cifra.artista || '';
        this.elements.editCifra.value = cifra.cifra || '';

        this.elements.editCard.classList.remove('d-none');
        this.elements.saveBtn.classList.remove('d-none');
        this.elements.deleteBtn.classList.remove('d-none');
    }

    handleCardInputChange() {
        if (this.selectedCifraIndex === -1) return;

        // Salva a alteração diretamente no array 'cifras' para persistência
        const cifra = this.cifras[this.selectedCifraIndex];
        cifra.titulo = this.elements.editTitulo.value;
        cifra.artista = this.elements.editArtista.value;
        cifra.cifra = this.elements.editCifra.value;

        this.elements.cardTitle.textContent = `${cifra.titulo} - ${cifra.artista}`;

        // Atualiza o Select2 para refletir a mudança no título
        const newText = `${cifra.titulo} - ${cifra.artista}`;
        const option = $(this.elements.cifraSelect).find(`option[value='${this.selectedCifraIndex}']`);
        option.text(newText);
        // Dispara o evento Select2 para re-renderizar o texto selecionado
        $(this.elements.cifraSelect).trigger('change.select2');

        // Salva localmente a cada input
        this.saveLocalCifras();
    }

    saveCurrentCifra() {
        this.saveLocalCifras();
    }

    // --- CRUD Ações ---

    addCifra() {
        let maxId = this.cifras.length > 0 ? Math.max(...this.cifras.map(c => c.id || 0)) : 0;
        const newCifra = {
            id: maxId + 1,
            artista: 'Novo Artista',
            titulo: 'Nova Cifra',
            cifra: '// Insira sua cifra aqui'
        };
        this.cifras.push(newCifra);
        this.saveLocalCifras();

        // Atualiza Select2 com a nova cifra
        const newIndex = this.cifras.length - 1;
        const newOption = new Option(`${newCifra.titulo} - ${newCifra.artista}`, newIndex, true, true);
        $(this.elements.cifraSelect).append(newOption).trigger('change');

        this.selectedCifraIndex = newIndex;
        this.loadCard(newCifra);
    }

    // --- DENTRO DE CifrasEditor.js ---

    // ... (Métodos anteriores)

    deleteSelectedCifra() {
        if (this.selectedCifraIndex === -1 || !confirm('Tem certeza que deseja excluir esta cifra?')) {
            return;
        }

        // 1. Guarda o índice antes de limpar
        const indexToRemove = this.selectedCifraIndex;

        // 2. Remove do array
        this.cifras.splice(indexToRemove, 1);
        this.saveLocalCifras();

        window.location.reload();
    }

    // ... (Restante da classe)

    // --- Utilitários ---

    removerAcentos(str) {
        if (!str) return "";
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    // ... (loadLocalCifras, saveLocalCifras, loadCifras, downloadJson permanecem)

    saveLocalCifras() {
        localStorage.setItem(this.LOCAL_KEY, JSON.stringify(this.cifras));
    }

    loadLocalCifras() {
        const local = localStorage.getItem(this.LOCAL_KEY);
        if (local) {
            try {
                return JSON.parse(local);
            } catch {
                return null;
            }
        }
        return null;
    }

    async loadCifras() {
        // ... (lógica de carregamento de JSON)
        let remoteCifras = [];
        try {
            const response = await fetch(this.url);
            if (!response.ok) throw new Error('Erro ao carregar cifras.json');
            remoteCifras = await response.json();
        } catch (e) {
            alert('Erro ao carregar cifras.json remoto. Usando dados locais.');
            remoteCifras = [];
        }

        const localCifras = this.loadLocalCifras();

        if (localCifras && JSON.stringify(localCifras) !== JSON.stringify(remoteCifras)) {
            this.cifras = localCifras;
        } else {
            this.cifras = remoteCifras;
            this.saveLocalCifras();
        }
    }

    downloadJson() {
        const json = JSON.stringify(this.cifras, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'cifras.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    new CifrasEditor().init();
});