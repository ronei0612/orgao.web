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
		this.instrumentSettings = {};
		this.sources = []; // Armazena os nós de fonte de áudio atualmente tocando
		this.gainNodes = []; // Armazena os nós de ganho (volume) para controle de Attack/Release
		this.currentNotes = []; // Notas a serem tocadas (setadas pelo setNotes)
		// O this.notesMap foi removido do construtor e será passado para loadInstruments()
	}

	/**
	 * Carrega todos os instrumentos (arquivos de áudio) na memória (buffers).
	 * @param {Object<string, {url: string, volume: number}>} urlsMap Um objeto mapeando o nome da nota para um objeto com a URL e o volume desejado (0.0 a 1.0).
	 * @returns {Promise<void>} Uma Promise que resolve quando todos os arquivos são carregados.
	 */
	async loadInstruments(urlsMap) {
		const noteKeys = Object.keys(urlsMap);

		// Limpa buffers e configurações anteriores
		this.buffers = {};
		this.instrumentSettings = {};

		const loadingPromises = noteKeys.map(key => {
			const { url, volume = 1 } = urlsMap[key];
			this.instrumentSettings[key] = { volume };

			return fetch(url)
				.then(response => {
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status} for ${url}`);
					}
					return response.arrayBuffer();
				})
				.then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
				.then(audioBuffer => {
					this.buffers[key] = audioBuffer;
				})
				.catch(error => {
					console.error(`Erro ao carregar ${key} (URL: ${url}): ${error}`);
				});
		});

		await Promise.all(loadingPromises);
	}

	/**
	 * Define as notas que serão tocadas no próximo método play().
	 * @param {string[]} notes Um array de strings com as notas, ex: ['c', 'e', 'g'].
	 */
	setNotes(notes) {
		this.currentNotes = notes;
	}

	/**
	 * Adiciona notas ao conjunto currentNotes.
	 * @param {string[]} notes Um array de strings com as notas a serem adicionadas.
	 */
	addNotes(notes) {
		this.currentNotes = Array.from(new Set([...this.currentNotes, ...notes]));
	}

	/**
	 * Toca as notas definidas em currentNotes.
	 * Lógica alterada para diferenciar Loop de Strings e Órgão.
	 */
	play(attackTime = 0.2) {
		// Garante que o AudioContext esteja resumido
		if (this.audioContext.state === 'suspended') {
			this.audioContext.resume();
		}

		// Para o som anterior
		this.stop();

		const now = this.audioContext.currentTime;

		this.currentNotes.forEach(note => {
			const buffer = this.buffers[note];
			const settings = this.instrumentSettings[note];

			if (!buffer || !settings) {
				console.warn(`Buffer para a nota ${note} não encontrado no cache. Pulando.`);
				return;
			}

			const targetVolume = settings.volume;
			const source = this.audioContext.createBufferSource();
			const gainNode = this.audioContext.createGain();

			source.buffer = buffer;
			source.loop = true;

			if (note.startsWith('epiano')) {
				source.loop = false;
			}

			// Conexões: Fonte -> Ganho -> Destino
			source.connect(gainNode);
			gainNode.connect(this.audioContext.destination);

			// Efeito Attack
			gainNode.gain.setValueAtTime(0, now);
			gainNode.gain.linearRampToValueAtTime(targetVolume, now + attackTime);

			source.start(0);

			this.sources.push(source);
			this.gainNodes.push(gainNode);
		});
	}

	/**
	 * Para as notas que estão tocando com efeito Release.
	 * @param {number} [releaseTime=0.2] Duração do efeito Release em segundos (saída suave).
	 */
	stop(releaseTime = 0.2) {
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