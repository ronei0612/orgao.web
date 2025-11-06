class CifrasEditor {
    constructor() {
        this.cifras = [];
        this.url = 'https://roneicostasoares.com.br/orgao.web/cifras.json';
        this.searchTerm = '';
        this.LOCAL_KEY = 'cifras_local';

        // Elementos DOM
        this.elements = {
            container: document.getElementById('cifras-container'),
            searchBar: document.getElementById('search-bar'),
            addBtn: document.getElementById('add-btn'),
            saveBtn: document.getElementById('save-btn'),
            downloadBtn: document.getElementById('download-btn')
        };

        // Binds necessários
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    // Ponto de entrada
    init() {
        this.bindEvents();
        this.loadCifras();
    }

    bindEvents() {
        this.elements.addBtn.addEventListener('click', this.addCifra.bind(this));
        this.elements.saveBtn.addEventListener('click', this.handleSaveClick.bind(this));
        this.elements.downloadBtn.addEventListener('click', this.downloadJson.bind(this));

        // Listener principal para o input (usa delegação de eventos para performance)
        document.addEventListener('input', this.handleInputChange);
    }

    // Funções Utilitárias (Mantidas aqui por serem específicas ou movidas para uma classe Utils)
    removerAcentos(str) {
        if (!str) return "";
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    // Salva no localStorage
    saveLocalCifras() {
        localStorage.setItem(this.LOCAL_KEY, JSON.stringify(this.cifras));
    }

    // Carrega do localStorage
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

    // Carrega o JSON do servidor ao iniciar, compara com local
    async loadCifras() {
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

        // Se existe local e é diferente do remoto, mantém o local
        if (localCifras && JSON.stringify(localCifras) !== JSON.stringify(remoteCifras)) {
            this.cifras = localCifras;
        } else {
            this.cifras = remoteCifras;
            this.saveLocalCifras();
        }
        this.renderCifras();
    }

    renderCifras() {
        const container = this.elements.container;
        container.innerHTML = '';
        const termo = this.removerAcentos(this.searchTerm.toLowerCase());

        const filtered = this.cifras.filter(item => {
            if (!termo) return true;
            const artista = item.artista ? this.removerAcentos(item.artista.toLowerCase()) : '';
            const titulo = item.titulo ? this.removerAcentos(item.titulo.toLowerCase()) : '';
            const cifra = item.cifra ? this.removerAcentos(item.cifra.toLowerCase()) : '';

            return (
                artista.includes(termo) ||
                titulo.includes(termo) ||
                cifra.includes(termo)
            );
        });

        filtered.forEach((item) => {
            // Usamos item.id como chave única para a exclusão, mas precisamos do índice
            const itemIndex = this.cifras.indexOf(item);

            const div = document.createElement('div');
            div.className = 'card cifras-card shadow-sm';
            // ATENÇÃO: É mais seguro passar o ID do que o índice do array, 
            // mas mantendo a lógica original, usamos o índice.
            div.innerHTML = `
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-7 form-group">
                            <label class="form-label">Título</label>
                            <input type="text" class="form-control" value="${item.titulo || ''}" data-idx="${itemIndex}" data-field="titulo">
                        </div>
                        <div class="col-md-5 form-group">
                            <label class="form-label">Artista</label>
                            <input type="text" class="form-control" value="${item.artista || ''}" data-idx="${itemIndex}" data-field="artista">
                        </div>
                        <div class="col-12 mt-2 form-group">
                            <label class="form-label">Música</label>
                            <textarea class="form-control" rows="4" data-idx="${itemIndex}" data-field="cifra">${item.cifra || ''}</textarea>
                        </div>
                        <div class="col-12 mt-3 text-end">
                            <button class="btn btn-danger btn-sm" data-action="delete" data-idx="${itemIndex}"><i class="bi bi-trash"></i> Excluir</button>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    // Excluir item (chamado por delegação de evento)
    deleteCifra(idx) {
        if (confirm('Tem certeza que deseja excluir este item?')) {
            // idx é o índice do array this.cifras
            this.cifras.splice(idx, 1);
            this.saveLocalCifras();
            this.renderCifras();
        }
    }

    // Adicionar novo item
    addCifra() {
        let maxId = this.cifras.length > 0 ? Math.max(...this.cifras.map(c => c.id || 0)) : 0;
        this.cifras.push({
            id: maxId + 1,
            artista: '',
            titulo: '',
            cifra: ''
        });
        this.saveLocalCifras();
        this.renderCifras();
    }

    // Atualiza array ao editar campos (manipulador de eventos único)
    handleInputChange(e) {
        if (e.target === this.elements.searchBar) {
            this.searchTerm = e.target.value;
            this.renderCifras();
            return;
        }

        const idx = e.target.getAttribute('data-idx');
        const field = e.target.getAttribute('data-field');
        const action = e.target.getAttribute('data-action');

        if (action === 'delete') {
            // Delegação do clique do botão de exclusão
            e.preventDefault();
            this.deleteCifra(parseInt(idx));
            return;
        }

        if (idx !== null && field) {
            this.cifras[parseInt(idx)][field] = e.target.value;
            this.saveLocalCifras();
        }
    }

    // Botão Salvar: salva no localStorage e avisa
    handleSaveClick() {
        this.saveLocalCifras();
        alert('Arquivo salvo localmente no navegador!');
    }

    // Download do JSON editado
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