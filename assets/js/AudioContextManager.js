/**
 * Classe AudioContextManager
 * Respons�vel por gerenciar o Web Audio API, carregar instrumentos e tocar acordes
 * com efeitos de loop, attack e release.
 */
class AudioContextManager {
	constructor() {
		// Cria uma nova inst�ncia do AudioContext
		this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
		this.buffers = {}; // Armazena os buffers de �udio carregados (instrumentos)
		this.instrumentSettings = {};
		this.sources = []; // Armazena os n�s de fonte de �udio atualmente tocando
		this.gainNodes = []; // Armazena os n�s de ganho (volume) para controle de Attack/Release
		this.currentNotes = []; // Notas a serem tocadas (setadas pelo setNotes)
		// O this.notesMap foi removido do construtor e ser� passado para loadInstruments()
	}

	/**
	 * Carrega todos os instrumentos (arquivos de �udio) na mem�ria (buffers).
	 * @param {Object<string, {url: string, volume: number}>} urlsMap Um objeto mapeando o nome da nota para um objeto com a URL e o volume desejado (0.0 a 1.0).
	 * @returns {Promise<void>} Uma Promise que resolve quando todos os arquivos s�o carregados.
	 */
	async loadInstruments(urlsMap) {
		const noteKeys = Object.keys(urlsMap);

		// Limpa buffers e configura��es anteriores
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
	 * Define as notas que ser�o tocadas no pr�ximo m�todo play().
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
	 * Toca as notas definidas em currentNotes com loop e efeito Attack.
	 * Aplica o Release no acorde anterior, se houver, antes de iniciar o novo.
	 * @param {number} [attackTime=0.2] Dura��o do efeito Attack em segundos (entrada suave).
	 */
	play(attackTime = 0.2) {
		// Garante que o AudioContext esteja resumido ap�s o clique do usu�rio
		if (this.audioContext.state === 'suspended') {
			this.audioContext.resume();
		}

		// Parar qualquer som anterior usando o Release padr�o (0.3s) para a transi��o suave.
		this.stop();

		const now = this.audioContext.currentTime;

		this.currentNotes.forEach(note => {
			const buffer = this.buffers[note];
			const settings = this.instrumentSettings[note];

			if (!buffer || !settings) {
				console.warn(`Buffer para a nota ${note} n�o encontrado no cache. Pulando.`);
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

			// Conex�es: Fonte -> Ganho (volume/envelope) -> Destino (alto-falantes)
			source.connect(gainNode);
			gainNode.connect(this.audioContext.destination);

			// Efeito Attack: Sobe o volume de 0 para 1 (m�ximo)
			gainNode.gain.setValueAtTime(0, now); // Come�a em volume 0
			gainNode.gain.linearRampToValueAtTime(targetVolume, now + attackTime); // Sobe linearmente em 'attackTime' segundos

			source.start(0);

			this.sources.push(source);
			this.gainNodes.push(gainNode);
		});
	}

	/**
	 * Para as notas que est�o tocando com efeito Release.
	 * @param {number} [releaseTime=0.2] Dura��o do efeito Release em segundos (sa�da suave).
	 */
	stop(releaseTime = 0.2) {
		if (this.sources.length === 0) return;

		const now = this.audioContext.currentTime;

		this.gainNodes.forEach(gainNode => {
			// Cancela qualquer mudan�a de volume programada (ex: um Attack em andamento)
			gainNode.gain.cancelScheduledValues(now);
			// Define o valor inicial da rampa de parada para o valor atual do ganho
			gainNode.gain.setValueAtTime(gainNode.gain.value, now);
			// Efeito Release: Desce o volume para 0
			gainNode.gain.linearRampToValueAtTime(0, now + releaseTime);
		});

		this.sources.forEach(source => {
			// Para o som ap�s o efeito Release terminar
			source.stop(now + releaseTime);
		});

		// Limpa os arrays de controle
		this.sources = [];
		this.gainNodes = [];
	}
}