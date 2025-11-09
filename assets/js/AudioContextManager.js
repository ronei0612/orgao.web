/**
         * Classe AudioContextManager
         * Responsável por gerenciar o Web Audio API, carregar instrumentos e tocar acordes
         * com efeitos de loop, attack e release.
         */
class AudioContextManager {
    constructor() {
        // Cria uma nova instância do AudioContext
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.buffers = {}; // Armazena os buffers de áudio carregados (instrumentos)
        this.sources = []; // Armazena os nós de fonte de áudio atualmente tocando
        this.gainNodes = []; // Armazena os nós de ganho (volume) para controle de Attack/Release

        // Mapeamento das notas necessárias para as URLs de áudio (usando Orgao no registro padrão)
        this.notesMap = {
            'c': 'https://roneicostasoares.com.br/orgao.web/assets/audio/Orgao/orgao_c.ogg',
            'e': 'https://roneicostasoares.com.br/orgao.web/assets/audio/Orgao/orgao_e.ogg',
            'g': 'https://roneicostasoares.com.br/orgao.web/assets/audio/Orgao/orgao_g.ogg',
            'b': 'https://roneicostasoares.com.br/orgao.web/assets/audio/Orgao/orgao_b.ogg',
            'd': 'https://roneicostasoares.com.br/orgao.web/assets/audio/Orgao/orgao_d.ogg'
        };

        this.currentNotes = []; // Notas a serem tocadas (setadas pelo setNotes)
    }

    /**
     * Carrega todos os instrumentos (arquivos de áudio) na memória (buffers).
     * @returns {Promise<void>} Uma Promise que resolve quando todos os arquivos são carregados.
     */
    async loadInstruments() {
        const noteKeys = Object.keys(this.notesMap);
        const loadingPromises = noteKeys.map(key => {
            const url = this.notesMap[key];
            return fetch(url)
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                    this.buffers[key] = audioBuffer;
                })
                .catch(error => {
                    console.error(`Erro ao carregar o som para a nota ${key}:`, error);
                    // Permite que outras notas continuem carregando mesmo com um erro
                });
        });

        await Promise.all(loadingPromises);
        console.log("Todos os instrumentos carregados.");
    }

    /**
     * Define as notas que serão tocadas no próximo método play().
     * @param {string[]} notes Um array de strings com as notas, ex: ['c', 'e', 'g'].
     */
    setNotes(notes) {
        this.currentNotes = notes;
    }

    /**
     * Toca as notas definidas em currentNotes com loop e efeito Attack.
     * @param {number} [attackTime=0.2] Duração do efeito Attack em segundos (entrada suave).
     */
    play(attackTime = 0.2) {
        // Garante que o AudioContext esteja resumido após o clique do usuário
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        // Parar qualquer som anterior imediatamente (release = 0)
        this.stop(0);

        const now = this.audioContext.currentTime;

        this.currentNotes.forEach(note => {
            const buffer = this.buffers[note];
            if (!buffer) {
                console.warn(`Buffer para a nota ${note} não encontrado. Pulando.`);
                return;
            }

            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();

            source.buffer = buffer;
            source.loop = true; // Efeito Loop

            // Conexões: Fonte -> Ganho (volume/envelope) -> Destino (alto-falantes)
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // Efeito Attack: Sobe o volume de 0 para 1 (máximo)
            gainNode.gain.setValueAtTime(0, now); // Começa em volume 0
            gainNode.gain.linearRampToValueAtTime(1, now + attackTime); // Sobe linearmente em 'attackTime' segundos

            source.start(0);

            this.sources.push(source);
            this.gainNodes.push(gainNode);
        });
    }

    /**
     * Para as notas que estão tocando com efeito Release.
     * @param {number} [releaseTime=0.3] Duração do efeito Release em segundos (saída suave).
     */
    stop(releaseTime = 0.3) {
        if (this.sources.length === 0) return;

        const now = this.audioContext.currentTime;

        this.gainNodes.forEach(gainNode => {
            // Cancela qualquer mudança de volume programada (ex: um Attack em andamento)
            gainNode.gain.cancelScheduledValues(now);
            // Define o valor inicial da rampa de parada para o valor atual do ganho
            gainNode.gain.setValueAtTime(gainNode.gain.value, now);
            // Efeito Release: Desce o volume para 0
            gainNode.gain.linearRampToValueAtTime(0, now + releaseTime);
        });

        this.sources.forEach(source => {
            // Para o som após o efeito Release terminar
            source.stop(now + releaseTime);
        });

        // Limpa os arrays de controle
        this.sources = [];
        this.gainNodes = [];
    }
}