class AudioContextManager {
    constructor(attackTime = 0.2, releaseTime = 0, masterVolume = 0.7) {
        // Configurações
        this.ATTACK_TIME = attackTime;
        this.RELEASE_TIME = releaseTime;

        // Variáveis de Estado
        this.context = null;
        this.masterGainNode = null;
        this.urlBufferMap = new Map(); // Armazena buffers carregados (URL -> AudioBuffer)
        this.playerConfigs = new Map(); // Armazena configurações de reprodução (Key -> { urls, gainNode, sources })
        this.currentAcordeKey = null;

        // 1. Inicializa o AudioContext
        this._initializeContext(masterVolume);
    }

    /**
     * Inicializa o AudioContext e o Master Gain Node.
     * @param {number} masterVolume - Volume inicial do Master Gain.
     * @private
     */
    _initializeContext(masterVolume) {
        if (!this.context) {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGainNode = this.context.createGain();
            this.masterGainNode.connect(this.context.destination);
            this.masterGainNode.gain.setValueAtTime(masterVolume, this.context.currentTime);
        }
    }

    /**
     * Adiciona um novo grupo de áudio (acorde) à lista de reprodução.
     * Deve ser chamado antes do preload.
     * @param {string} key - Chave única do grupo (ex: 'C', 'G').
     * @param {string[]} urls - Array de URLs dos arquivos de áudio que compõem o grupo.
     */
    addAcorde(key, urls) {
        if (this.playerConfigs.has(key)) {
            console.warn(`Acorde key "${key}" já existe. URLs serão sobrescritas.`);
        }
        // Cria um GainNode específico para o acorde para controlar o fade
        const gainNode = this.context.createGain();
        gainNode.connect(this.masterGainNode);
        gainNode.gain.setValueAtTime(0, this.context.currentTime);

        this.playerConfigs.set(key, {
            urls: urls,
            gainNode: gainNode,
            sources: [] // Array para armazenar as AudioBufferSourceNodes ativas
        });
    }

    /**
     * Remove um acorde e seus nós de áudio do sistema.
     * @param {string} key - Chave do acorde a ser removido.
     */
    removeAcorde(key) {
        if (this.playerConfigs.has(key)) {
            const config = this.playerConfigs.get(key);
            // Pára e limpa as sources ativas
            config.sources.forEach(source => {
                try { source.stop(0); } catch (e) { /* ignore */ }
            });
            // Desconecta o GainNode
            config.gainNode.disconnect();
            this.playerConfigs.delete(key);

            if (this.currentAcordeKey === key) {
                this.currentAcordeKey = null;
            }
        }
    }

    /**
     * Função auxiliar para carregar e decodificar um único áudio.
     * @param {string} url
     * @returns {Promise<AudioBuffer>}
     */
    async _loadAudio(url) {
        if (this.urlBufferMap.has(url)) {
            return this.urlBufferMap.get(url);
        }

        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = await this.context.decodeAudioData(arrayBuffer);
            this.urlBufferMap.set(url, buffer);
            return buffer;
        } catch (error) {
            console.error(`Falha ao carregar ou decodificar: ${url}`, error);
            throw new Error(`Erro ao carregar o áudio de: ${url}`);
        }
    }

    /**
     * Pré-carrega todos os áudios de todos os grupos definidos.
     * @returns {Promise<void>}
     */
    async preloadAll() {
        const allUrlsSet = new Set();
        this.playerConfigs.forEach(config => {
            config.urls.forEach(url => allUrlsSet.add(url));
        });
        const uniqueUrls = Array.from(allUrlsSet);

        const loadingPromises = uniqueUrls.map(url => this._loadAudio(url));
        await Promise.all(loadingPromises);
    }

    /**
     * Inicia a reprodução de um acorde com cross-fade.
     * @param {string} acordeKey - Chave do acorde a ser tocado.
     */
    play(acordeKey) {
        if (!this.playerConfigs.has(acordeKey)) {
            console.error(`Acorde key "${acordeKey}" não encontrado.`);
            return;
        }

        // Se for o mesmo acorde, ignora
        if (acordeKey === this.currentAcordeKey) return;

        // Tenta resumir o contexto no clique
        if (this.context.state === 'suspended') {
            this.context.resume().catch(e => console.error("Falha ao resumir o AudioContext:", e));
        }

        const previousAcordeKey = this.currentAcordeKey;
        this.currentAcordeKey = acordeKey; // Define o novo acorde

        const newConfig = this.playerConfigs.get(acordeKey);
        const newGainNode = newConfig.gainNode;
        const now = this.context.currentTime;

        // 1. FADE-OUT DO ACORDE ANTERIOR (ocorre em paralelo)
        if (previousAcordeKey) {
            this._stopAndCleanup(previousAcordeKey, false); // O segundo parâmetro 'false' indica que não é parada total
        }

        // 2. INICIAR O NOVO SOM (Cria sources se necessário)
        if (newConfig.sources.length === 0) {
            newConfig.urls.forEach(url => {
                const buffer = this.urlBufferMap.get(url);
                if (!buffer) { throw new Error(`Buffer não carregado: ${url}. Chamou preloadAll?`); } // Adicionado mensagem de erro

                const source = this.context.createBufferSource();
                source.buffer = buffer;
                source.loop = true;
                source.connect(newGainNode);
                source.start(0);
                newConfig.sources.push(source);
            });
        }

        // 3. FADE-IN (Attack)
        newGainNode.gain.cancelScheduledValues(now);
        newGainNode.gain.setValueAtTime(0, now);
        newGainNode.gain.linearRampToValueAtTime(1.0, now + this.ATTACK_TIME);
    }

    /**
     * Pára a reprodução atual ou um acorde específico com fade-out.
     * @param {string|null} [acordeKey=this.currentAcordeKey] - Chave do acorde a ser parado. Se nulo, pára o atual.
     * @param {boolean} [isTotalStop=true] - Se for parada total, suspende o contexto.
     * @returns {Promise<void>}
     */
    stop(acordeKey = this.currentAcordeKey, isTotalStop = true) {
        if (!acordeKey) return Promise.resolve();

        // Pára e limpa o acorde
        const promise = this._stopAndCleanup(acordeKey, isTotalStop);

        if (isTotalStop) {
            this.currentAcordeKey = null;
            // Suspende o AudioContext após o fade-out
            if (this.context.state !== 'closed') {
                this.context.suspend();
            }
        }
        return promise;
    }

    /**
     * Implementação da lógica de fade-out e limpeza.
     * @private
     */
    _stopAndCleanup(acordeKey, isTotalStop) {
        return new Promise(resolve => {
            const config = this.playerConfigs.get(acordeKey);
            if (!config || config.sources.length === 0) return resolve();

            const stopTime = this.context.currentTime + this.RELEASE_TIME;

            // APLICA O FADE-OUT
            config.gainNode.gain.cancelScheduledValues(this.context.currentTime);
            config.gainNode.gain.linearRampToValueAtTime(0.0001, stopTime);

            // Agenda a limpeza (liberação de recursos) após o tempo de Release
            setTimeout(() => {
                config.sources.forEach(source => {
                    try { source.stop(0); } catch (e) { /* ignore se já parou */ }
                });
                config.sources = [];
                resolve();
            }, this.RELEASE_TIME * 1000);
        });
    }

    /**
     * Define o volume mestre.
     * @param {number} volume - Volume de 0.0 a 1.0.
     */
    setMasterVolume(volume) {
        if (this.masterGainNode) {
            this.masterGainNode.gain.setValueAtTime(volume, this.context.currentTime);
        }
    }
}