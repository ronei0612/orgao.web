class LocalStorageManager {
    constructor() { }

    getSaves() {
        try {
            const savesString = localStorage.getItem('saves');
            return savesString ? JSON.parse(savesString) : {};
        } catch (error) {
            console.error("Erro ao ler saves do localStorage:", error);
            return {};
        }
    }

    save(nome, conteudo) {
        const saves = this.getSaves();
        saves[nome] = conteudo;
        localStorage.setItem('saves', JSON.stringify(saves));
    }

    delete(nome) {
        const saves = this.getSaves();
        delete saves[nome];
        localStorage.setItem('saves', JSON.stringify(saves));
    }

    editarNome(oldName, newName) {
        const saves = this.getSaves();
        if (saves.hasOwnProperty(oldName)) {
            const content = saves[oldName];
            delete saves[oldName];
            saves[newName] = content;
            localStorage.setItem('saves', JSON.stringify(saves));
            return true;
        } else {
            console.warn(`editarNomeSaveLocalStorage: Save com o nome "${oldName}" não encontrado.`);
            return false;
        }
    }
}

