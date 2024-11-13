const notasFrequencias = {
	a: 110.00,
	a_: 116.54,
	b: 123.47,
	c: 130.81,
	c_: 138.59,
	d: 146.83,
	d_: 155.56,
	e: 164.81,
	f: 174.61,
	f_: 185.00,
	g: 196.00,
	g_: 207.65,
	a1: 220.00,
	a_1: 233.08,
	b1: 246.94,
	c1: 261.63,
	c_1: 277.18,
	d1: 293.67,
	d_1: 311.13,
	e1: 329.63,
	f1: 349.23,
	f_1: 369.99,
	g1: 392.00,
	g_1: 415.30,
}

const primeiraGuitar = new Pizzicato.Sound({
	source: 'wave',
	options: {
		type: 'sawtooth',
		frequency: notasFrequencias.c1,
		release: 2.5,
		attack: 0.4,
		volume: 0.01
	}
});

const quintaGuitar = new Pizzicato.Sound({
	source: 'wave',
	options: {
		type: 'sawtooth',
		frequency: notasFrequencias.g1,
		release: 2.5,
		attack: 0.4,
		volume: 0.01
	}
});

const distortion = new Pizzicato.Effects.Distortion({
	gain: 0.5,
	mix: 0.5
});

var flanger = new Pizzicato.Effects.Flanger({
	time: 0.45,
	speed: 0.2,
	depth: 0.1,
	feedback: 0.1,
	mix: 0.5
});

var reverb = new Pizzicato.Effects.Reverb({
	time: 2,
	decay: 2,
	reverse: false,
	mix: 0.5
});

primeiraGuitar.addEffect(distortion);
primeiraGuitar.addEffect(flanger);
primeiraGuitar.addEffect(reverb);
quintaGuitar.addEffect(distortion);
quintaGuitar.addEffect(flanger);
quintaGuitar.addEffect(reverb);

var _acordeSelecionado = '';
var _acordeAntesSelecionado = '';
var _acompanhamentoSelecionado = '';
var _acompanhamentoSolo = false;
var _acompanhamentoFull = false;
var _acompanhamentoMao = false;
var _grupoNotas;
var _grupoNotasStrings;
var _volume = 0.9;
var _instrumentoSelecionado = 'orgao';
var _stringsSelecionado = false;
var _baixoSelecionado = false;
var _violaoSelecionado = false;
var _epianoSelecionado = false;
var _guitarraSelecionado = false;
var _guitarraParado = true;
var _stringsParado = true;
var _autoMudarRitmo = false;
var _orientacaoCelularPe = true;
var _tomSelectedIndexCifra = 0;
var timer;
var _tomIndex = '';
var _cifraId = 0;
var _cifraParado = true;
var _acordeBaixo;
var _acordeNotas;
var _notasSolo;
var _spanBotaoFecharModalPositions;

var _chimbalIsAberto = false;
var _sourceChimbalAberto;
var _sourceBaixo;
var _cravoSelecionado = true;
var _viradaRitmo = '';
var _trocarRitmo = false;
var _configurandoTeclas = false;
var _configuracaoElemento;
var _configuracaoEvento;
var _teclasConfiguracao = {};
var _gravarCifras = false;
var _chimesPressionado = false;

var _notasAcordesJson;
var _acordesCampoHarmonicoJson;
var _acidentesCorrespondentesJson;
var _acordesTons;
var _tonsMaiores;
var _tonsMenores;

const eventoClick = new Event('click');
const eventoChange = new Event('change');
const eventoMousedown = new Event('mousedown');
const eventoMouseup = new Event('mouseup');
const eventoTouchstart = new Event('touchstart');
const eventoInput = new Event('input');

const eventos = {
	eventoClick: eventoClick,
	eventoChange: eventoChange,
	eventoMousedown: eventoMousedown,
	eventoMouseup: eventoMouseup,
	eventoTouchstart: eventoTouchstart,
	eventoInput: eventoInput
};

var notasAcordes = Object.keys(notasAcordesJson);

const selectConfiguracao = document.getElementById('selectConfiguracao');
//const tableRitmo = document.getElementById('tableRitmo');
const instrumentoSelect = document.getElementById('instrumentoSelect');
const autoCheck = document.getElementById('autoCheck');
const autoCheckDiv = document.getElementById('autoCheckDiv');
const acompCheck = document.getElementById('acompCheck');
const acompCheckDiv = document.getElementById('acompCheckDiv');
const bpm = document.getElementById('bpm');
const selectRitmo = document.getElementById('selectRitmo');
const botaoBuscar = document.getElementById('botaoBuscar');
const play_pause = document.getElementById('play_pause');
const bpmRange = document.getElementById('bpmRange');
const chimbal = document.getElementById('chimbal');
const brush = document.getElementById('brush');
const meiaLua = document.getElementById('meiaLua');
const prato = document.getElementById('prato');
const iconPrato = document.getElementById('iconPrato');
const iconChimes = document.getElementById('iconChimes');
const aro = document.getElementById('aro');
const caixa = document.getElementById('caixa');
const cravo = document.getElementById('cravo');
const pratoCravo = document.getElementById('pratoCravo');
const iconPratoCravo = document.getElementById('iconPratoCravo');
const iconChimesCravo = document.getElementById('iconChimesCravo');
const brushCravo = document.getElementById('brushCravo');
const stringsBotao = document.getElementById('stringsBotao');
const violaoBotao = document.getElementById('violaoBotao');
const pianoBotao = document.getElementById('pianoBotao');
const baixoBotao = document.getElementById('baixoBotao');
const tomSelect = document.getElementById('tomSelect');
const volumeTexto = document.getElementById('volumeTexto');
const textoCifras = document.getElementById('textoCifras');
const textoAcordeMenor = document.getElementById('textoAcordeMenor');
const textoCifrasFrame = document.getElementById('textoCifrasFrame');
const container = document.getElementById('container');
const voltar = document.getElementById('voltar');
//const botaoTamanhoIframe = document.getElementById('botaoTamanhoIframe');
//const selectTamanhoIframe = document.getElementById('selectTamanhoIframe');
const tomMenorSwitchDiv = document.getElementById('tomMenorSwitchDiv');
const orgaoCifrasBotoes = document.getElementById('orgaoCifrasBotoes');
const tdVolume = document.getElementById('tdVolume');
const volumeDiv = document.getElementById('volumeDiv');
const textoVolume = document.getElementById('textoVolume');
const volumeInput = document.getElementById('volumeInput');
const cifraAvancar = document.getElementById('cifraAvancar');
const cifraRepetir = document.getElementById('cifraRepetir');
const cifraRetroceder = document.getElementById('cifraRetroceder');
const exitfullscreen = document.getElementById('exitfullscreen');
const fullscreenDiv = document.getElementById('fullscreenDiv');
const botaoFullscreen = document.getElementById('botaoFullscreen');
const trackerControls = document.getElementById('trackerControls');
const bateria = document.getElementById('bateria');
const linhaSelectTom = document.getElementById('linhaSelectTom');
const navBar = document.getElementById('navBar');
const oracoesEucaristicasDiv = document.getElementById('oracoesEucaristicasDiv');
const acorde_10 = document.getElementById('acorde_10');
const acorde_7 = document.getElementById('acorde_7');
const acorde_9 = document.getElementById('acorde_9');
const muteDiv = document.getElementById('muteDiv');
const botaoMute = document.getElementById('botaoMute');
const iconVolumeMute = document.getElementById('iconVolumeMute');
const iconVolume = document.getElementById('iconVolume');
const modal01 = document.getElementById('modal01');
const linksCifraClubList = document.getElementById('linksCifraClubList');
const botaoIniciar = document.getElementById('botaoIniciar');
const escreverCifraTextArea = document.getElementById('escreverCifraTextArea');
const selectInstrumento = document.getElementById('selectInstrumento');
const salvarDiv = document.getElementById('salvarDiv');
const compartilhadoDiv = document.getElementById('compartilhadoDiv');
const compartilharDiv = document.getElementById('compartilharDiv');
const selectOpcoes = document.getElementById('selectOpcoes');
const modalGravar = document.getElementById('modalGravar');
const musicaSearch = document.getElementById('musicaSearch');
const titulo = document.getElementById('titulo');
const bateriaBotoes = document.getElementById('bateriaBotoes');
const selectSalvamento = document.getElementById('selectSalvamento');
const lightCompasso = document.getElementById('lightCompasso');
const modal_loading = document.getElementById('modal_loading');
const prepararBateriaBotao = document.getElementById('prepararBateriaBotao');
const pararBateriaBotao = document.getElementById('pararBateriaBotao');
const play_pause_bateria = document.getElementById('play_pause_bateria');
const textoRitmo = document.getElementById('textoRitmo');
const listaMusicasCifra = document.getElementById('listaMusicasCifra');
const orgaoBox = document.getElementById('orgaoBox');
const notaTuner = document.getElementById('notaTuner');
const tunerDiv = document.getElementById('tunerDiv');
const autoTunerCheck = null;//document.getElementById('autoTunerCheck');
const liturgiaDiariaDiv = document.getElementById('liturgiaDiariaDiv');
const violinoDesenho = document.getElementById('violinoDesenho');
const violaoDesenho = document.getElementById('violaoDesenho');
const switchDark = document.getElementById('switchDark');
const baixo = document.getElementById('baixo');
const mao = document.getElementById('mao');
const full = document.getElementById('full');
const measureLength = document.getElementById('measureLength');
const musicaAcordesTextArea = document.getElementById('musicaAcordesTextArea');
const acorde_0 = document.getElementById('acorde_0');
const acorde_3 = document.getElementById('acorde_3');
const acorde_4 = document.getElementById('acorde_4');
const acorde_5 = document.getElementById('acorde_5');
const acorde_1 = document.getElementById('acorde_1');
const acorde_2 = document.getElementById('acorde_2');
const aumentarTomMais = document.getElementById('aumentarTomMais');
const diminuirTomMenos = document.getElementById('diminuirTomMenos');
const tomMenorSwitch = document.getElementById('tomMenorSwitch');
const tituloConfiguracaoTeclas = document.getElementById('tituloConfiguracaoTeclas');
const textoConfiguracao = document.getElementById('textoConfiguracao');
const tecladoTeclasDiv = document.getElementById('tecladoTeclasDiv');
const inputTeclaLabel = document.getElementById('inputTeclaLabel');

const elementos = {
	instrumentoSelect: instrumentoSelect,
	autoCheck: autoCheck,
	bpm: bpm,
	selectRitmo: selectRitmo,
	botaoBuscar: botaoBuscar,
	play_pause: play_pause,
	bpmRange: bpmRange,
	chimbal: chimbal,
	brush: brush,
	meiaLua: meiaLua,
	prato: prato,
	aro: aro,
	caixa: caixa,
	cravo: cravo,
	brushCravo: brushCravo,
	pratoCravo: pratoCravo,
	stringsBotao: stringsBotao,
	violaoBotao: violaoBotao,
	pianoBotao: pianoBotao,
	baixoBotao: baixoBotao,
	tomSelect: tomSelect,
	volumeTexto: volumeTexto,
	textoCifras: textoCifras,
	textoAcordeMenor: textoAcordeMenor,
	textoCifrasFrame: textoCifrasFrame,
	container: container,
	voltar: voltar,
	tomMenorSwitchDiv: tomMenorSwitchDiv,
	orgaoCifrasBotoes: orgaoCifrasBotoes,
	tdVolume: tdVolume,
	volumeDiv: volumeDiv,
	textoVolume: textoVolume,
	volumeInput: volumeInput,
	cifraAvancar: cifraAvancar,
	cifraRepetir: cifraRepetir,
	cifraRetroceder: cifraRetroceder,
	exitfullscreen: exitfullscreen,
	fullscreenDiv: fullscreenDiv,
	botaoFullscreen: botaoFullscreen,
	trackerControls: trackerControls,
	bateria: bateria,
	linhaSelectTom: linhaSelectTom,
	navBar: navBar,
	oracoesEucaristicasDiv: oracoesEucaristicasDiv,
	acorde_10: acorde_10,
	acorde_7: acorde_7,
	acorde_9: acorde_9,
	muteDiv: muteDiv,
	botaoMute: botaoMute,
	iconVolumeMute: iconVolumeMute,
	iconVolume: iconVolume,
	modal01: modal01,
	linksCifraClubList: linksCifraClubList,
	botaoIniciar: botaoIniciar,
	escreverCifraTextArea: escreverCifraTextArea,
	selectInstrumento: selectInstrumento,
	salvarDiv: salvarDiv,
	selectOpcoes: selectOpcoes,
	modalGravar: modalGravar,
	musicaSearch: musicaSearch,
	titulo: titulo,
	bateriaBotoes: bateriaBotoes,
	selectSalvamento: selectSalvamento,
	lightCompasso: lightCompasso,
	modal_loading: modal_loading,
	prepararBateriaBotao: prepararBateriaBotao,
	pararBateriaBotao: pararBateriaBotao,
	play_pause_bateria: play_pause_bateria,
	textoRitmo: textoRitmo,
	listaMusicasCifra: listaMusicasCifra,
	orgaoBox: orgaoBox,
	notaTuner: notaTuner,
	tunerDiv: tunerDiv,
	autoTunerCheck: autoTunerCheck,
	liturgiaDiariaDiv: liturgiaDiariaDiv,
	violinoDesenho: violinoDesenho,
	violaoDesenho: violaoDesenho,
	switchDark: switchDark,
	baixo: baixo,
	mao: mao,
	full: full,
	measureLength: measureLength,
	musicaAcordesTextArea: musicaAcordesTextArea,
	acorde_0: acorde_0,
	acorde_3: acorde_3,
	acorde_4: acorde_4,
	acorde_5: acorde_5,
	acorde_1: acorde_1,
	acorde_2: acorde_2,
	aumentarTomMais: aumentarTomMais,
	diminuirTomMenos: diminuirTomMenos,
	tomMenorSwitch: tomMenorSwitch,
	tituloConfiguracaoTeclas: tituloConfiguracaoTeclas,
	textoConfiguracao: textoConfiguracao,
	tecladoTeclasDiv: tecladoTeclasDiv,
	inputTeclaLabel: inputTeclaLabel
};

deixarAcompanhamentoSelecionado('full');
verificarOrientacaoCelular();
manterTelaLigada_v2();
carregarConfiguracaoTeclas();
_notasAcordesJson = recuperarDadosStorage('dadosLocais');

document.addEventListener("visibilitychange", function () {
	if (isMobileDevice())
		if (document.visibilityState === 'visible')
			manterTelaLigada_v2();
});

document.addEventListener('keydown', function (event) {
	capturarTeclaPressionada(event.key);
});

window.onerror = function (message, source, lineno, colno, error) {
	alert("Erro!\n" + message + '\nArquivo: ' + source + '\nLinha: ' + lineno + '\nPosicao: ' + colno);
};

selectRitmo.addEventListener('change', function (e) {
	_grupoNotas = verificarGrupoNotasInstanciado(_grupoNotas);
});

bpm.addEventListener('change', function (e) {
	_grupoNotas = verificarGrupoNotasInstanciado(_grupoNotas);
});

autoCheck.addEventListener('change', function (e) {
	_autoMudarRitmo = this.checked;

	if (_autoMudarRitmo) {
		if (_cravoSelecionado)
			ocultarBotoesAcompanhamentoCravo();
		else
			ocultarBotoesAcompanhamentosRitmo();

		document.getElementById('trackerControls').style.display = 'none';
	}
	else {
		if (_cravoSelecionado)
			ocultarBotoesAcompanhamentoCravo(false);
		else
			ocultarBotoesAcompanhamentosRitmo(false);

		document.getElementById('trackerControls').style.display = '';
	}

	calcularAlturaIframe();
});

instrumentoSelect.addEventListener('change', (e) => {
	var semacentos = instrumentoSelect.value.normalize("NFD").replace(/[\u0300-\u036f]/g, '');
	_instrumentoSelecionado = semacentos.toLowerCase().replace('banda', 'epiano');
});

window.addEventListener("orientationchange", (event) => {
	orientacaoCelularAlterado(event);
});

musicaSearch.addEventListener('focus', function () {
	this.select();
});

esperarAudios(2000, true);
darkModeLocalStorage();

function esperarAudios(tempoMiliseg, esperar_audios) {
	if (esperar_audios == false) {
		container.style.display = 'block';
		document.getElementById('tracker-container').style.display = 'block';
		navBar.style.display = '';
		try {
			carregarConfiguracoesDoStorage();
		} catch { }
		mostrarCompartilhado();
	}
	else
		setTimeout(function () {
			container.style.display = 'block';
			document.getElementById('tracker-container').style.display = 'block';
			navBar.style.display = '';
			try {
				carregarConfiguracoesDoStorage();
			} catch { }
			mostrarCompartilhado();
		}, tempoMiliseg)
}

function mostrarMensagem(mensagem) {
	let mensagensElem = document.getElementById('mensagens');
	mensagensElem.innerText = mensagensElem.innerText + '\n' + mensagem;
}

function capturarTeclaPressionada(tecla) {
	if (_configurandoTeclas)
		mostrarTeclaConfiguracaoTeclas(tecla); //armazenarTeclaConfiguracaoTeclas(tecla);
	else if (_teclasConfiguracao[tecla] && modal01.style.display === 'none') {
		const elemento = elementos[_teclasConfiguracao[tecla][0]];
		const evento = eventos[_teclasConfiguracao[tecla][1]];

		if (_teclasConfiguracao[tecla][0].includes('Check'))
			elemento.checked = !elemento.checked;

		elemento.dispatchEvent(evento);
	}
}

function limparConfiguracaoTeclas() {
	if (confirm('Apagar as Configurações de Teclas?'))
		localStorage.removeItem('teclasConfiguracao');
}

function limparConfiguracaoTodas() {
	if (confirm('Tem certeza? Isso excluirá os salvamentos também')) {
		localStorage.clear();
		sessionStorage.clear();
		caches.delete();
		location.reload();
	}
}

function mostrarSalvarConfiguracaoTeclas() {
	_configurandoTeclas = true;
	modal01.style.display = 'none';

	tituloConfiguracaoTeclas.style.display = '';
	document.getElementById('linhaVermelha').style.display = '';

	titulo.style.display = 'none';
	botaoBuscar.style.display = 'none';
	play_pause.style.display = '';
	prepararBateriaBotao.style.display = 'none';
	pararBateriaBotao.style.display = '';
}

function ocultarGravarCifras() {
	_gravarCifras = false;
	document.getElementById('tituloGravacaoCifras').style.display = 'none';
	document.getElementById('linhaVermelha').style.display = 'none';
	botaoBuscar.style.display = '';
	play_pause.style.display = 'none';
	gravarCifrasControle.style.display = 'none';
	titulo.style.display = '';

	ocultarBotoesAcompanhamentosRitmo(false);
	voltarParaOrgao();

	acompCheckDiv.style.display = '';
	if (acompCheck.checked)
		mostrarBateria();
}

function ocultarSalvarConfiguracaoTeclas() {
	ocultarGravarCifras();

	_configurandoTeclas = false;
	tituloConfiguracaoTeclas.style.display = 'none';
	titulo.style.display = '';
	tecladoTeclasDiv.style.display = 'none';
	botaoBuscar.style.display = '';
	play_pause.style.display = 'none';
	prepararBateriaBotao.style.display = '';
	pararBateriaBotao.style.display = 'none';
}

function capturarTeclaConfiguracaoTeclas(elementoCapturado) {
	_configuracaoEvento = elementoCapturado.getAttribute('dataEventoTecla');
	selectConfiguracao.style.display = 'none';
	modal01.style.display = 'block';
	_configuracaoElemento = elementoCapturado.id;
	selectOpcoes.style.display = 'none';
	tecladoTeclasDiv.style.display = '';
	//inputTeclaLabel.focus();
}

function verificarSeTemValor(dicionario, elementoProcurar) {
	for (let chave in dicionario) {
		if (dicionario[chave][0].includes(elementoProcurar))
			delete dicionario[chave];
	}
}

function mostrarTeclaConfiguracaoTeclas(tecla) {
	inputTeclaLabel.innerText = tecla;
	botaoOkTecla.disabled = false;
}

function armazenarTeclaConfiguracaoTeclas() {
	verificarSeTemValor(_teclasConfiguracao, _configuracaoElemento);
	let tecla = inputTeclaLabel.innerText;
	let array = [_configuracaoElemento, _configuracaoEvento];
	_teclasConfiguracao[tecla] = array;
	botaoOkTecla.disabled = true;
	inputTeclaLabel.innerText = '';
	ocultarModal();
}

function salvarConfiguracaoTeclas() {
	if (_teclasConfiguracao) {
		localStorage.setItem('teclasConfiguracao', JSON.stringify(_teclasConfiguracao));
		ocultarSalvarConfiguracaoTeclas();
	}
	else
		alert('Nada foi configurado. Saindo...');

	carregarConfiguracaoTeclas();
}

function carregarConfiguracaoTeclas() {
	const dadosStorage = localStorage.getItem('teclasConfiguracao');
	if (dadosStorage)
		_teclasConfiguracao = JSON.parse(dadosStorage);
}

function capturarTeclaGravacaoCifras(botao) {
	let textoGravarCifras = document.getElementById('textoGravarCifras');
	if (textoGravarCifras.value)
		textoGravarCifras.value = textoGravarCifras.value + ' ' + botao.value;
	else
		textoGravarCifras.value = botao.value;
}

function handleTouchStart(event, element, bateria = false) {
	event.preventDefault();

	element.dispatchEvent(eventoMousedown);

	if (bateria)
		element.dispatchEvent(eventoClick);
}

function isMobileDevice() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function darkModeLocalStorage() {
	var darkMode = localStorage.getItem('darkMode');
	if (darkMode)
		if (darkMode === 'true') {
			switchDark.checked = true;
			switchDark.dispatchEvent(eventoClick);
		}
}

function manterTelaLigada_v2() {
	if (isMobileDevice()) {
		let wakeLock = null;
		try {
			wakeLock = navigator.wakeLock.request("screen");
		} catch { }
	}
}

function verificarOrientacaoCelular() {
	if (isMobileDevice()) {
		if (window.matchMedia("(orientation: portrait)").matches)
			_orientacaoCelularPe = true;

		if (window.matchMedia("(orientation: landscape)").matches)
			_orientacaoCelularPe = false;
	}
}

function orientacaoCelularAlterado(event) {
	if (event.target.screen.orientation.angle === 0) {
		_orientacaoCelularPe = true;

		if (textoCifras.style.display !== 'none')
			mostrarNavBar();
	}
	else {
		_orientacaoCelularPe = false;

		if (textoCifras.style.display !== 'none')
			ocultarNavBar();
	}

	if (exitfullscreen.style.display !== 'none')
		mudarParaFullscreen();

	calcularAlturaIframe();
}

function mostrarBateria(mostrar = true) {
	if (mostrar)
		bateriaBotoes.style.display = '';
	else
		bateriaBotoes.style.display = 'none';

	localStorage.setItem('acompCheck', acompCheck.checked);
}

function ocultarBotoesAcompanhamentoCravo(ocultar = true) {
	let cravoBotoes = document.getElementsByClassName('trCravoBotoes');

	if (ocultar) {
		for (let i = 0; i < cravoBotoes.length; i++)
			cravoBotoes[i].style.display = 'none';

		tdVolume.style.display = 'none';
	}
	else {
		for (let i = 0; i < cravoBotoes.length; i++)
			cravoBotoes[i].style.display = '';

		tdVolume.style.display = '';
	}
}

function ocultarBotoesCravo(ocultar = true) {
	let cravoBotoes = document.getElementsByClassName('trCravoBotoes');

	if (ocultar) {
		for (let i = 0; i < cravoBotoes.length; i++)
			cravoBotoes[i].style.display = 'none';

		baixo.style.display = 'none';
		mao.style.display = 'none';
		full.style.display = 'none';
		violaoBotao.style.display = '';
		pianoBotao.style.display = '';
		baixoBotao.style.display = '';
	}
	else {
		for (let i = 0; i < cravoBotoes.length; i++)
			cravoBotoes[i].style.display = '';

		let trCravoBotoes = document.getElementsByClassName('botoesAcompanhamentosRitmo');
		for (let i = 0; i < trCravoBotoes.length; i++)
			trCravoBotoes[i].style.display = '';

		violaoBotao.style.display = 'none';
		pianoBotao.style.display = 'none';
		baixoBotao.style.display = 'none';
		baixo.style.display = '';
		mao.style.display = '';
		full.style.display = '';
	}
}

function ocultarBotoesRitmo(ocultar = true) {
	var bateriaBotoes = document.getElementsByClassName('trBateriaBotoes');

	if (ocultar) {
		for (let i = 0; i < bateriaBotoes.length; i++)
			bateriaBotoes[i].style.display = 'none';
	}
	else {
		for (let i = 0; i < bateriaBotoes.length; i++)
			bateriaBotoes[i].style.display = '';
	}
}
function ocultarBotoesAcompanhamentosRitmo(ocultar = true) {
	let botoesAcompanhamentosRitmo = document.getElementsByClassName('botoesAcompanhamentosRitmo')[0];

	if (ocultar) {
		botoesAcompanhamentosRitmo.style.display = 'none';
		tdVolume.style.display = 'none';
	}
	else {
		botoesAcompanhamentosRitmo.style.display = '';
		tdVolume.style.display = '';
	}
}

function pressionarBotaoCravo() {
	var botaoCravoSelecionado = document.getElementsByClassName('selecionadoDrum');
	if (botaoCravoSelecionado.length > 0)
		botaoCravoSelecionado[0].dispatchEvent(eventoClick);
}

function deixarAcompanhamentoSelecionado(funcao) {
	escolherAcompanhamentoOrgao(funcao, document.getElementById(funcao));
}

function ocultarBotaoRec(ocultar = true) {
	botaoBuscar.style.display = ocultar ? 'none' : 'block';
	play_pause.style.display = ocultar ? 'block' : 'none';
}

function escolherAcorde(acorde, botao) {
	if (_configurandoTeclas) {
		capturarTeclaConfiguracaoTeclas(botao);
		return;
	}
	if (_gravarCifras) {
		capturarTeclaGravacaoCifras(botao);
		//return;
	}

	montarAcordeNotas(botao.value);

	if (_cifraId > 0) {
		_cifraParado = true;
		_cifraId--;
	}

	if (botao)
		levantarBotoesAcordes();

	if (_acordeSelecionado === '') {
		_acordeAntesSelecionado = _acordeSelecionado;
		pararOsAcordes();

		if (botao)
			ocultarBotaoRec(false);
	}
	else {
		tocarAcorde(botao.value, botao);

		if (botao)
			ocultarBotaoRec();
	}
}

function autoMudarRitmo(elementBotao = null, bateria = null) {
	if ((pararBateriaBotao.style.display !== 'none' && _autoMudarRitmo) || (_instrumentoSelecionado === 'orgao' && _autoMudarRitmo && prepararBateriaBotao.style.display === 'none')) {
		if (bateria) {
			if (elementBotao.id === 'brush') {
				pianoBotao.classList.toggle('instrumentoSelecionado', false);
				_epianoSelecionado = false;
				baixoBotao.classList.toggle('instrumentoSelecionado', false);
				_baixoSelecionado = false;
				violaoBotao.classList.toggle('instrumentoSelecionado', false);
				_violaoSelecionado = false;

				stringsBotao.classList.toggle('instrumentoSelecionado', true);
				if (_acordeSelecionado && !_stringsSelecionado) {
					_stringsSelecionado = true;
					_acordeAntesSelecionado = verificarAcompanhamentoEtocar(_acordeSelecionado, _acordeAntesSelecionado, null, true);
				}

				_guitarraSelecionado = false;
				stopGuitarra();
			}
			else if (elementBotao.id === 'aro') {
				pianoBotao.classList.toggle('instrumentoSelecionado', true);
				_epianoSelecionado = true;
				baixoBotao.classList.toggle('instrumentoSelecionado', true);
				_baixoSelecionado = true;
				violaoBotao.classList.toggle('instrumentoSelecionado', false);
				_violaoSelecionado = false;

				stringsBotao.classList.toggle('instrumentoSelecionado', false);
				_stringsSelecionado = false;
				pararOsAcordes(false, false);

				_guitarraSelecionado = false;
				stopGuitarra();
			}
			else if (elementBotao.id === 'caixa') {
				pianoBotao.classList.toggle('instrumentoSelecionado', true);
				_epianoSelecionado = true;
				baixoBotao.classList.toggle('instrumentoSelecionado', true);
				_baixoSelecionado = true;
				violaoBotao.classList.toggle('instrumentoSelecionado', true);
				_violaoSelecionado = true;

				stringsBotao.classList.toggle('instrumentoSelecionado', false);
				_stringsSelecionado = false;
				pararOsAcordes(false, false);

				_guitarraSelecionado = false;
				stopGuitarra();
			}
			else if (elementBotao.id === 'chimbal') {
				pianoBotao.classList.toggle('instrumentoSelecionado', true);
				_epianoSelecionado = true;
				baixoBotao.classList.toggle('instrumentoSelecionado', true);
				_baixoSelecionado = true;
				violaoBotao.classList.toggle('instrumentoSelecionado', true);
				_violaoSelecionado = true;

				stringsBotao.classList.toggle('instrumentoSelecionado', true);
				if (_acordeSelecionado && !_stringsSelecionado) {
					_stringsSelecionado = true;
					_acordeAntesSelecionado = verificarAcompanhamentoEtocar(_acordeSelecionado, _acordeAntesSelecionado, null, true);
				}
				_stringsSelecionado = true;
				_guitarraSelecionado = false;
				stopGuitarra();
			}
			else if (elementBotao.id === 'meiaLua') {
				pianoBotao.classList.toggle('instrumentoSelecionado', true);
				_epianoSelecionado = true;
				baixoBotao.classList.toggle('instrumentoSelecionado', true);
				_baixoSelecionado = true;
				violaoBotao.classList.toggle('instrumentoSelecionado', true);
				_violaoSelecionado = true;

				stringsBotao.classList.toggle('instrumentoSelecionado', true);
				if (_acordeSelecionado && !_stringsSelecionado) {
					_stringsSelecionado = true;
					_guitarraSelecionado = true;
					_acordeAntesSelecionado = verificarAcompanhamentoEtocar(_acordeSelecionado, _acordeAntesSelecionado, null, true);
					playGuitarra();
				}
				_stringsSelecionado = true;
				_guitarraSelecionado = true;
			}
		}

		else if (_instrumentoSelecionado === 'orgao') {
			var selecionadoElement = elementBotao || document.querySelector('.selecionado');

			if (selecionadoElement.id === 'baixo' || selecionadoElement.id === 'mao')
				brushCravo.dispatchEvent(eventoTouchstart);
			else if (selecionadoElement.id === 'full')
				cravo.dispatchEvent(eventoTouchstart);
		}
	}
}

function escolherAcompanhamentoBateria(botao, variavel) {
	if (_configurandoTeclas) {
		botao.classList.toggle('instrumentoSelecionado', false);
		capturarTeclaConfiguracaoTeclas(botao);
		return;
	}

	if (botao.classList.contains('instrumentoSelecionado') == false) {
		eval(variavel + ' = ' + JSON.stringify(true));

		if (variavel === '_stringsSelecionado' && _stringsParado)
			if (_acordeAntesSelecionado !== '') {
				_stringsParado = false;
				_grupoNotasStrings = verificarGrupoNotasInstanciado(_grupoNotasStrings);
				_grupoNotasStrings = montarAcorde(_acordeNotas, _acordeBaixo, _grupoNotasStrings, 'strings');
				_grupoNotasStrings.play();
			}

		botao.classList.toggle('instrumentoSelecionado', true);
	}
	else {
		eval(variavel + ' = ' + JSON.stringify(false));
		botao.classList.toggle('instrumentoSelecionado', false);

		if (_instrumentoSelecionado === 'epiano' && variavel === '_stringsSelecionado' && !_stringsSelecionado)
			pararOsAcordes();
	}
}

function escolherAcompanhamentoOrgao(funcao, botao) {
	if (_configurandoTeclas) {
		capturarTeclaConfiguracaoTeclas(botao);
		return;
	}
	_acompanhamentoSelecionado = funcao;
	pressionarBotaoAcompanhamento(botao);

	autoMudarRitmo(botao);
}

function tocarAcorde(acorde, botao) {
	const valor = botao ? botao.value : acorde;
	_acordeAntesSelecionado = verificarAcompanhamentoEtocar(valor, _acordeAntesSelecionado);
	if (botao)
		botao.classList.add('pressionado');
}

function setTom(acorde = 'C') {
	tomSelect.value = acorde;
}

function refinarAcorde(acorde) {
	if (acorde.length > 1 && acorde[1] === 'b') {
		const soNota = acorde.slice(0, 2);
		return acorde.replace(soNota, acidentesCorrespondentesJson[soNota]);
	}

	return acorde;
}

function getNotaBaixo(acorde) {
	let notaBaixo;
	if (acorde.includes('/')) {
		let acordeBaixo = refinarAcorde(acorde.split('/')[1]);
		acorde = refinarAcorde(acorde.split('/')[0]);
		notaBaixo = _notasAcordesJson[acordeBaixo][0];

		if (notaBaixo[0].toUpperCase() !== acordeBaixo[0]) {
			mostrarMensagem('notaBaixo errado (/): ' + notaBaixo);
			_notasAcordesJson = recuperarDadosStorage('dadosLocais');
			notaBaixo = _notasAcordesJson[acordeBaixo][0];
		}
	}
	else {
		acorde = refinarAcorde(acorde);
		notaBaixo = _notasAcordesJson[acorde][0];

		if (notaBaixo[0].toUpperCase() !== acorde[0]) {
			mostrarMensagem('notaBaixo errado: ' + notaBaixo);
			_notasAcordesJson = recuperarDadosStorage('dadosLocais');
			notaBaixo = _notasAcordesJson[acorde][0];
		}
	}

	return [acorde, notaBaixo];
}

function montarAcordeNotas(acorde) {
	if (acorde !== '') {
		acorde = acorde.replace('E#', 'F');
		let retorno = getNotaBaixo(acorde);
		acorde = retorno[0];
		_acordeBaixo = retorno[1];
		_acordeNotas = _notasAcordesJson[acorde];
	}

	_acordeSelecionado = acorde;
}

function montarAcorde(acordeNotas, acordeBaixo, grupoNotas, instrumento = 'orgao') {
	//if (instrumento === 'stringsSolo' && _stringsSelecionado)
	//	instrumento = 'strings';

	if (_guitarraSelecionado)
		playGuitarra();

	if (grupoNotas) {
		if (instrumento === 'strings' && _instrumentoSelecionado === 'epiano' && _stringsSelecionado && !_violaoSelecionado && !_baixoSelecionado && !_epianoSelecionado && !_autoMudarRitmo) {
			grupoNotas.addSound(acordes['strings_' + acordeNotas[0]]);
			grupoNotas.addSound(acordes['strings_' + acordeNotas[0] + '_baixo']);
			grupoNotas.addSound(acordes['strings_' + acordeNotas[0] + '_grave']);
		}

		else if (_instrumentoSelecionado === 'orgao') {
			if (_acompanhamentoSelecionado === 'full') {
				grupoNotas.addSound(acordes[instrumento + '_' + acordeBaixo + '_grave']);

				grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[0] + '_baixo']);
				grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[1] + '_baixo']);
				grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[2] + '_baixo']);

				grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[0]]);
				grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[1]]);
				grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[2]]);

				for (var i = 2, len = acordeNotas.length; i < len; i++)
					grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[i]]);
			}
			else if (_acompanhamentoSelecionado === 'baixo') {
				grupoNotas.addSound(acordes[instrumento + '_' + acordeBaixo + '_grave']);

				grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[0] + '_baixo']);
				grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[1] + '_baixo']);
				grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[2] + '_baixo']);

				for (var i = 2, len = acordeNotas.length; i < len; i++)
					grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[i] + '_baixo']);
			}
			else {
				grupoNotas.addSound(acordes[instrumento + '_' + acordeBaixo]);
				grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[1]]);
				grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[2]]);

				for (var i = 2, len = acordeNotas.length; i < len; i++)
					grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[i]]);
			}

			grupoNotas.attack = 0.1;
		}

		else {
			if (instrumento === 'strings' && _instrumentoSelecionado === 'orgao')
				grupoNotas.addSound(acordes[instrumento + '_' + acordeBaixo + '_grave']);

			grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[0] + '_baixo']);
			grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[1] + '_baixo']);
			grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[2] + '_baixo']);

			grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[0]]);
			grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[1]]);
			grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[2]]);

			for (var i = 2, len = acordeNotas.length; i < len; i++)
				grupoNotas.addSound(acordes[instrumento + '_' + acordeNotas[i]]);
		}
	}

	return grupoNotas;
}

function verificarGrupoNotasInstanciado(grupoNotas) {
	if (!grupoNotas) {
		grupoNotas = new Pizzicato.Group();

		grupoNotas.volume = _volume;
	}

	return grupoNotas;
}

function verificarAcompanhamentoEtocar(acorde, acordeAntesSelecionado, continuarStrings = null, soStrings = false) {
	if (acordeAntesSelecionado === acorde) {
		pararOsAcordes(true, continuarStrings != null ? continuarStrings : _stringsSelecionado);
		esperar = 50;
	}
	else
		pararOsAcordes(true);

	acordeAntesSelecionado = acorde;
	montarAcordeNotas(acorde);

	if (_instrumentoSelecionado === 'epiano' && !_violaoSelecionado && !_epianoSelecionado && !_baixoSelecionado && !_stringsSelecionado) {
		stringsBotao.classList.toggle('instrumentoSelecionado', true);
		_stringsSelecionado = true;
	}

	if (iconVolumeMute.style.display === 'none') {
		if (_stringsSelecionado) {
			_stringsParado = false;
			_grupoNotasStrings = verificarGrupoNotasInstanciado(_grupoNotasStrings);
			montarAcorde(_acordeNotas, _acordeBaixo, _grupoNotasStrings, 'strings').play();
		}
		if (_epianoSelecionado && _instrumentoSelecionado === 'epiano' && !soStrings) {
			_grupoNotas = verificarGrupoNotasInstanciado(_grupoNotas);
			montarAcorde(_acordeNotas, _acordeBaixo, _grupoNotas, 'epiano').play();
		}
		else if (_instrumentoSelecionado === 'orgao') {
			_grupoNotas = verificarGrupoNotasInstanciado(_grupoNotas);
			let tocar = montarAcorde(_acordeNotas, _acordeBaixo, _grupoNotas, _instrumentoSelecionado);
			setTimeout(() => {
				tocar.play();
			}, 60);
		}
	}

	return acordeAntesSelecionado;
}

function pararOsAcordes(removerSons = false, continuarStrings = false) {
	// Comentado para funcionar por enquanto
	// if (_somSolo) {
	// 	_somSolo.stop();
	// 	_notasSolo = null;
	// }

	if (_grupoNotas) {
		_grupoNotas.stop();

		if (removerSons) {
			var sons = _grupoNotas.sounds.length;
			for (let i = sons - 1; i > -1; i--)
				_grupoNotas.removeSound(_grupoNotas.sounds[i]);
		}
	}

	if (continuarStrings === false)
		if (_grupoNotasStrings) {
			_stringsParado = true;
			_grupoNotasStrings.stop();

			if (removerSons) {
				var sons = _grupoNotasStrings.sounds.length;
				for (let i = sons - 1; i > -1; i--)
					_grupoNotasStrings.removeSound(_grupoNotasStrings.sounds[i]);
			}
		}

	stopGuitarra(true);
}

function levantarBotoesAcordes() {
	const botoesPressionados = document.querySelectorAll('.pressionado');
	botoesPressionados.forEach(botao => botao.classList.remove('pressionado'));
}

function levantarBotoesAcompanhamento() {
	var botoes = document.getElementsByClassName('selecionado');
	for (let i = 0; i < botoes.length; i++)
		botoes[i].classList.toggle('selecionado', false);
}

function pressionarBotaoAcompanhamento(botao) {
	if (botaoAcompPressionado(botao) === false) {
		if (_acordeAntesSelecionado !== '')
			if (_instrumentoSelecionado !== 'epiano')
				_acordeAntesSelecionado = verificarAcompanhamentoEtocar(_acordeAntesSelecionado, _acordeAntesSelecionado, false);

		levantarBotoesAcompanhamento();
		pressionarBotaoAcomp(botao);
	}
}

function botaoAcompPressionado(botao) {
	if (botao.classList.contains('selecionado'))
		return true;
	else
		return false;
}

function pressionarBotaoAcomp(botao) {
	botao.classList.toggle('selecionado', true);
}

function alterarVolume(volume, padrao) {
	_volume = parseFloat(volume);

	if (_grupoNotas)
		_grupoNotas.volume = _volume;

	if (_grupoNotasStrings)
		_grupoNotasStrings.volume = _volume;

	if (volume === padrao)
		volumeTexto.innerHTML = volume * 10;
	else
		volumeTexto.innerHTML = (volume * 10) + '*';
}

function mudarTomCifra(aumentar, quant) {
	_tomSelectedIndexCifra = tomSelect.selectedIndex;
	var texto = textoCifras.contentDocument.body.innerHTML;

	let retorno = AlterarTom(texto, aumentar, quant);

	if (retorno.success) {
		textoCifras.contentDocument.body.innerHTML = retorno.message;
		addEventCifras(textoCifras, _cifraId - 1);
	}
	else
		alert(retorno.message);
}

function mudarTom(tomSelecionado) {
	if (!tomSelecionado) {
		tomSelect.value = acorde_0.value;
		return;
	}

	var acordesCampoHarmonico = acordesCampoHarmonicoJson[tomSelecionado];
	var acordesElements = document.getElementsByClassName('acorde');

	Array.from(acordesElements).forEach((acordesElement) => {
		var acordeIndex = acordesElement.id.split('_')[1];
		acordesElement.value = acordesCampoHarmonico[acordeIndex];
	});

	var botoesSelecionados = document.getElementsByClassName('pressionado');

	if (botoesSelecionados.length > 0) {
		var botaoSelecionado = botoesSelecionados[0];
		var acordeSelecionado = botaoSelecionado.value;
		escolherAcorde(acordeSelecionado, botaoSelecionado);
	}

	mudarTomMenor(tomSelect.selectedIndex);

	if (textoCifrasFrame.style.display === 'none')
		localStorage.setItem('tomSelecionadoIndex', tomSelect.selectedIndex);
}

function mudarTomMenor(acordeIndex) {
	textoAcordeMenor.innerText = acordesTons[acordeIndex + 12];
}

function aumentarTom(aumentar, quant, select) {
	if (_configurandoTeclas) {
		capturarTeclaConfiguracaoTeclas(document.activeElement);
		return;
	}
	var tomElement = document.getElementById(select);
	var tomSelecionadoIndex = tomElement.selectedIndex;

	if (tomElement.value.includes('m'))
		var tonsArray = tonsMenores;
	else
		var tonsArray = tonsMaiores;

	if (aumentar) {
		if (tomSelecionadoIndex + quant === tomElement.length)
			tomElement.value = tonsArray[0];
		else if (tomSelecionadoIndex + quant > tomElement.length)
			tomElement.value = tonsArray[-1 + quant];
		else
			tomElement.value = tonsArray[tomSelecionadoIndex + quant];
	}
	else {
		if (tomSelecionadoIndex - quant < 0)
			if (tomSelecionadoIndex === 0)
				tomElement.value = tonsArray[tomElement.length - quant];
			else
				tomElement.value = tonsArray[tomElement.length - 1];
		else
			tomElement.value = tonsArray[tomSelecionadoIndex - quant];
	}

	if (textoCifrasFrame.style.display !== "none" && liturgiaDiariaFrame.style.display === "none")
		mudarTomCifra(aumentar, quant);
	else
		mudarTom(tomElement.value);
}

function adicionarTonsSelect(element, index, maior) {
	var selectElem = document.getElementById(element);
	selectElem.innerHTML = "";

	var tons = tonsMaiores;
	if (maior === false)
		tons = tonsMenores;

	for (var i = 0; i < tons.length; i++) {
		let opt = document.createElement('option');
		opt.value = tons[i];
		opt.textContent += tons[i];
		selectElem.appendChild(opt);
	};

	selectElem.selectedIndex = index;
	textoAcordeMenor.innerText = tonsMenores[index];
}

function mostrarTextoCifrasCarregado(tom = null, texto = null) {
	if (tom) {
		tom = getAcorde(tom)[0];
		if (tom.includes('m'))
			adicionarTonsSelect('tomSelect', tonsMenores.indexOf(tom), false);
		else
			adicionarTonsSelect('tomSelect', tonsMaiores.indexOf(tom), true);

		_tomSelectedIndexCifra = tomSelect.selectedIndex;
	}

	if (texto)
		textoCifras.contentDocument.body.innerHTML = getAcordes(texto);

	if (document.body.classList.contains("bg-dark"))
		textoCifras.contentWindow.document.querySelector('pre').style.color = '#fff';
	else
		textoCifras.contentWindow.document.querySelector('pre').style.color = '#000';

	if (textoCifrasFrame.style.display === 'none') {
		mudarParaTelaFrame();
	}

	addEventCifras(textoCifras);
	mudarTamanhoFrameCifras(_orientacaoCelularPe);

	//tableRitmo.style.marginLeft = '';
}

function selecionarCifraId() {
	var cifraElems = textoCifras.contentDocument.getElementsByClassName('cifraSelecionada');

	if (cifraElems.length > 0) {
		_cifraId = cifraElems[0].id.split('cifra')[1] - 1;
		return cifraElems[0];
	}

	return;
}

function mudarParaTelaFrame() {
	textoCifrasFrame.style.display = 'block';
	textoCifras.style.display = '';
	document.getElementById('liturgiaDiariaFrame').style.display = 'none';

	var elements = document.getElementsByClassName('orgaoBotoes');
	for (var i = 0; i < elements.length; i++) {
		elements[i].style.display = 'none';
	}

	container.classList.remove('d-sm-flex');
	volumeDiv.style.display = 'none';
	voltar.style.display = 'block';
	//botaoTamanhoIframe.style.display = 'block';
	//selectTamanhoIframe.style.display = "none";
	tomMenorSwitchDiv.style.display = 'none';
	orgaoCifrasBotoes.style.display = '';

	tdVolume.setAttribute('rowspan', '');
	tdVolume.setAttribute('colspan', 5);
	volumeDiv.style.display = 'block';

	textoVolume.classList.remove('textoVertical');
	volumeInput.setAttribute('orient', '');

	$('#tdVolume').appendTo('#tableOrgao');
	$('#textoVolume').prependTo('#volumeDiv');
	$('#orgaoTable').prependTo('#bateriaBox');

	if (_orientacaoCelularPe === false)
		ocultarNavBar();

	calcularAlturaIframe();
}

function addEventCifras(frame, mudarTomCifraId) {
	var elements = frame.contentDocument.getElementsByTagName("b");

	for (var i = 0; i < elements.length; i++) {
		elements[i].addEventListener("click", function (e) {
			var cifraElements = textoCifras.contentDocument.getElementsByClassName('cifraSelecionada');

			if (cifraElements.length > 0)
				cifraElements[0].classList.remove('cifraSelecionada');

			e.target.classList.add('cifraSelecionada');
			e.target.scrollIntoView();
			parent.tocarCifraManualmente(e.target);

			parent.focus(); //Foca fora para funcionar o teclado físico
		});
	}

	if (mudarTomCifraId === -1)
		mudarTomCifraId = 0;

	if (mudarTomCifraId >= 0) {
		let cifra = elements[mudarTomCifraId];
		if (cifra || cifra >= 0) {
			cifra.classList.add('cifraSelecionada');
			if (!_cifraParado)
				_acordeAntesSelecionado = verificarAcompanhamentoEtocar(cifra.innerText, _acordeAntesSelecionado);
		}
	}
}

function tocarCifraManualmente(cifraElem) {
	_cifraId = cifraElem.id.split('cifra')[1] - 1;

	if (_cifraParado === false)
		avancarCifra('avancar', cifraAvancar);
}

function tocarSolo(solo) {
	_notasSolo = solo.split('.');
	_acordeSelecionado = _notasSolo[0];
	tocarAcorde(_notasSolo[0], null);
	if (_notasSolo)
		_notasSolo.shift();
	//for (var i = 0; i < notas.length; i++) {
	//	let nota = notas[i];
	//	if (nota.charAt(0) === nota.toUpperCase())
	//		tocarAcorde(nota, null);
	//	else if (nota) {
	//		acordes['epiano_' + nota].play();
	//	}
	//}
}

function avancarCifra(avancar_retroceder, botao) {
	if (_configurandoTeclas) {
		capturarTeclaConfiguracaoTeclas(botao);
		return;
	}
	if (avancar_retroceder === '') {
		escolherAcorde('', botao);
		botaoBuscar.style.display = 'block';
		play_pause.style.display = 'none';
	}

	else if (avancar_retroceder === 'repetir') {
		if (_cifraParado === false)
			_acordeAntesSelecionado = verificarAcompanhamentoEtocar(_acordeAntesSelecionado, _acordeAntesSelecionado, 50);
	}

	else {
		var frameContent = textoCifras.contentDocument;
		var elements_b = frameContent.getElementsByTagName('b');
		var cifraElems = frameContent.getElementsByClassName('cifraSelecionada');

		if (avancar_retroceder === 'avancar') {
			if (_cifraId < elements_b.length) {
				if (cifraElems.length > 0)
					cifraElems[0].classList.remove('cifraSelecionada');

				_cifraParado = false;

				let cifraElem = elements_b[_cifraId];
				let cifra = cifraElem.innerHTML.trim();

				if (cifra.includes('.'))
					tocarSolo(cifra);
				else
					tocarAcorde(cifra, null);

				if (cifraRetroceder.classList.contains('pressionado'))
					cifraRetroceder.classList.remove('pressionado');

				botao.classList.toggle('pressionado', true);
				cifraElem.classList.add('cifraSelecionada');
				cifraElem.scrollIntoView();

				_cifraId++;
			}
		}

		if (avancar_retroceder === 'retroceder') {
			if (_cifraId - 1 > 0) {
				if (cifraElems.length > 0)
					cifraElems[0].classList.remove('cifraSelecionada');

				if (_cifraParado === false)
					_cifraId--;

				var cifraElem = elements_b[_cifraId - 1];

				tocarAcorde(cifraElem.innerHTML.trim(), null);

				if (cifraAvancar.classList.contains('pressionado'))
					cifraAvancar.classList.remove('pressionado');

				botao.classList.toggle('pressionado', true);
				cifraElem.classList.add('cifraSelecionada');
				cifraElem.scrollIntoView();
			}
		}

		botaoBuscar.style.display = 'none';
		play_pause.style.display = 'block';
	}
}

function mudarTamanhoFrameCifras(aumentar) {
	//textoCifras.contentWindow.document.querySelector('pre').style.fontSize = selectFonte.value + 'px';
}

function rolagemTelaOracaoEucaristica(guardar = true) {
	if (oracoesEucaristicasDiv.style.display !== 'none') {
		var nomeVar = 'scrollOracoesEuc';

		if (guardar)
			localStorage.setItem(nomeVar, modal01.scrollTop);
		else {
			var scrollPosition = localStorage.getItem(nomeVar);
			if (scrollPosition)
				modal01.scrollTo(0, parseInt(scrollPosition));
		}
	}
}

function posicaoBotaoFecharModal(elemento, fixado) {
	if (fixado) {
		elemento.style.position = 'fixed';
		elemento.style.top = _spanBotaoFecharModalPositions.top + 'px';
		elemento.style.left = _spanBotaoFecharModalPositions.right + 'px';
	}
	else {
		elemento.style.position = '';
		elemento.style.top = '';
		elemento.style.left = '';
	}
}

function mostrarLiturgiaDiaria() {
	modal01.style.display = 'none';
	voltarParaOrgao();
	textoCifrasFrame.style.display = 'block';
	textoCifras.style.display = 'none';
	document.getElementById('liturgiaDiariaFrame').style.display = '';

	container.classList.remove('d-sm-flex');
	volumeDiv.style.display = 'none';
	voltar.style.display = 'block'; //tamanho incorreto
	tdVolume.setAttribute('rowspan', '');
	tdVolume.setAttribute('colspan', 5);
	volumeDiv.style.display = 'block';
	textoVolume.classList.remove('textoVertical');
	volumeInput.setAttribute('orient', '');
	$('#tdVolume').appendTo('#tableOrgao');
	$('#textoVolume').prependTo('#volumeDiv');
	$('#orgaoTable').prependTo('#bateriaBox');

	calcularAlturaIframe();
}

function voltarParaOrgao() {
	voltar.style.display = 'none'
	//botaoTamanhoIframe.style.display = 'none';
	//selectTamanhoIframe.style.display = "none";
	orgaoCifrasBotoes.style.display = 'none';

	textoCifrasFrame.style.display = 'none';
	tomMenorSwitchDiv.style.display = '';

	var elements = document.getElementsByClassName('orgaoBotoes');
	for (var i = 0; i < elements.length; i++) {
		elements[i].style.display = '';
	};

	container.classList.add('d-sm-flex');

	tdVolume.setAttribute('rowspan', 5);
	tdVolume.setAttribute('colspan', '');
	volumeDiv.style.display = 'flex';
	textoVolume.style.display = '';
	textoVolume.classList.add('textoVertical');
	volumeInput.setAttribute('orient', 'vertical');

	$('#tdVolume').appendTo('#orgaoControle');
	$('#textoVolume').appendTo('#volumeDiv');
	$('#orgaoTable').appendTo('#orgaoBox');

	mostrarNavBar();

	adicionarTonsSelect('tomSelect', 0, true);
	ultimoTomSelecionadoStorage();

	//tableRitmo.style.marginLeft = '-12px';
}

function mudarParaFullscreen() {
	exitfullscreen.style.display = 'flex';
	botaoFullscreen.style.display = 'none';

	bateria.style.display = 'none';
	switchDarkDiv.style.display = 'none';
	muteDiv.style.display = '';

	if (textoCifras.style.display !== 'none' && _orientacaoCelularPe === false && isMobileDevice())
		ocultarNavBar();

	var el = document.body;
	var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen
		|| el.mozRequestFullScreen || el.msRequestFullScreen;

	if (requestMethod)
		requestMethod.call(el);
}

function sairDeFullscreen() {
	const antes = exitfullscreen.style.display !== 'none';

	if (exitfullscreen.style.display !== 'none') {
		if (textoCifrasFrame.style.display === 'none')
			mostrarNavBar();

		exitfullscreen.style.display = 'none';
		botaoFullscreen.style.display = 'flex';
		switchDarkDiv.style.display = '';
		muteDiv.style.display = 'none';
		document.exitFullscreen();

		linhaSelectTom.classList.add('d-flex');

		mutarVolume(false);
	}

	return antes;
}

function mostrarNavBar() {
	$('#fullscreenDiv').prependTo('#linhaNavBar');
	$('#botaoOpcoes').prependTo('#linhaNavBar');
	$('#titulo').appendTo('#linhaNavBar');
	$('#botaoSalvar').appendTo('#linhaNavBar');
	$('#switchDarkDiv').appendTo('#linhaNavBar');
	$('#muteDiv').appendTo('#linhaNavBar');
	navBar.style.display = 'block';
	//linhaSelectTom.style.width = '';
}

function ocultarNavBar() {
	$('#titulo').prependTo('#linhaSelectTom');
	$('#fullscreenDiv').prependTo('#linhaSelectTom');
	$('#botaoOpcoes').prependTo('#linhaSelectTom');
	$('#botaoSalvar').appendTo('#linhaSelectTom');
	$('#muteDiv').appendTo('#linhaSelectTom');
	navBar.style.display = 'none';
	//linhaSelectTom.style.width = '100%';
}

function ultimoTomSelecionadoStorage() {
	var tomSelecionadoIndex = localStorage.getItem('tomSelecionadoIndex');
	if (tomSelecionadoIndex) {
		tomSelect.selectedIndex = tomSelecionadoIndex;
		tomSelect.dispatchEvent(new Event('change'));
	}
}

function recuperarDadosStorage(dadosStorage) {
	let notasAcordesJsonString = localStorage.getItem('notasAcordesJson');
	if (notasAcordesJsonString)
		return JSON.parse(notasAcordesJsonString);
	else
		return notasAcordesJson;

	

	// let dadosCompletosJson = localStorage.getItem(dadosStorage);

	// if (dadosCompletosJson) {
	// 	let dadosCompletos = JSON.parse(dadosCompletosJson);
	// 	// _acordesCampoHarmonicoJson = JSON.stringify(dadosCompletos.acordesCampoHarmonicoJson);
	// 	// _acidentesCorrespondentesJson = JSON.stringify(dadosCompletos.acidentesCorrespondentesJson);
	// 	notasAcordesJson = JSON.stringify(dadosCompletos.notasAcordesJson);
	// 	// _notasAcordes = dadosCompletos.notasAcordesJson;
	// 	// _acordesTons = dadosCompletos.acordesTons;
	// 	// _tonsMaiores = dadosCompletos.tonsMaiores;
	// 	// _tonsMenores = dadosCompletos.tonsMenores;
	// }
}

function salvarDadosStorage(dadosStorage) {
	// if (tonsMaiores) {
	// 	_acordesCampoHarmonicoJson = acordesCampoHarmonicoJson;
	// 	_acidentesCorrespondentesJson = acidentesCorrespondentesJson;
	// 	_notasAcordesJson = notasAcordesJson;
	// 	_notasAcordes = notasAcordes;
	// 	_acordesTons = acordesTons;
	// 	_tonsMaiores = tonsMaiores;
	// 	_tonsMenores = tonsMenores;
	// }

	let dadosCompletos = {
		// acordesCampoHarmonicoJson: _acordesCampoHarmonicoJson,
		// acidentesCorrespondentesJson: _acidentesCorrespondentesJson,
		notasAcordesJson: notasAcordesJson,
		// notasAcordes: notasAcordes,
		// acordesTons: _acordesTons,
		// tonsMaiores: _tonsMaiores,
		// tonsMenores: _tonsMenores
	};

	let dadosCompletosJson = JSON.stringify(dadosCompletos);
	localStorage.setItem(dadosStorage, dadosCompletosJson);
}

function carregarConfiguracoesDoStorage() {
	selecionarInstrumento();
	adicionarTonsSelect('tomSelect', 0, true);
	ultimoTomSelecionadoStorage();

	let storage = localStorage.getItem('acompCheck');
	if (storage && storage === 'true') {
		acompCheck.checked = true;
		acompCheck.dispatchEvent(eventoClick);
		mostrarBateria(true);
	}
	else
		acompCheck.checked = false;

	let index = localStorage.getItem('instrumentoSelecionadoIndex');
	if (index) {
		instrumentoSelect.selectedIndex = index;
		instrumentoSelect.dispatchEvent(eventoChange);
		var semacentos = instrumentoSelect.value.normalize("NFD").replace(/[\u0300-\u036f]/g, '');
		_instrumentoSelecionado = semacentos.toLowerCase().replace('banda', 'epiano');
	}

	//gerarRitmosNomes(ritmosNomes); Comentado para funcionar por enquanto
	//selecionarRitmo(selectRitmo.value); Comentado para funcionar por enquanto
	//salvarDadosStorage('dadosLocais');
}

prato.addEventListener('mousedown', function () {
	ativarBotao(prato)
});
prato.addEventListener('touchstart', function () {
	ativarBotao(prato)
});
pratoCravo.addEventListener('mousedown', function () {
	ativarBotao(prato)
});
pratoCravo.addEventListener('touchstart', function () {
	ativarBotao(prato)
});

play_pause_bateria.addEventListener('touchstart', function () {
	ativarBotao(play_pause_bateria)
});
play_pause_bateria.addEventListener('mouseup', function () {
	desativarBotao(play_pause_bateria)
});
play_pause_bateria.addEventListener('touchend', function () {
	desativarBotao(play_pause_bateria)
});

prato.addEventListener('mouseup', voltarIconeOriginal);
prato.addEventListener('touchend', voltarIconeOriginal);

pratoCravo.addEventListener('mouseup', voltarIconeOriginal);
pratoCravo.addEventListener('touchend', voltarIconeOriginal);

function ativarBotao(botao) {
	botao.classList.add('ativado');
}

function desativarBotao(botao) {
	botao.classList.remove('ativado');
}

function voltarIconeOriginal() {
	_chimesPressionado = false;
	clearTimeout(timer);

	iconPrato.style.display = 'none';
	iconPratoCravo.style.display = 'none';
	iconChimes.style.display = '';
	iconChimesCravo.style.display = '';

	desativarBotao(prato);
	desativarBotao(pratoCravo);
}

function mudarIconeAposTempo() {
	if (_chimesPressionado) {
		iconChimes.style.display = 'none';
		iconChimesCravo.style.display = 'none';
		iconPrato.style.display = '';
		iconPratoCravo.style.display = '';

		chimesSound.stop();
		pratoSound.play();
	}
}

function mudarIconeChimesPrato() {
	setTimeout(function () {
		_chimesPressionado = true;
		chimesSound.play();
	}, 180);

	timer = setTimeout(mudarIconeAposTempo, 180);
}

function selecionarTomMenor(selecionadoMenor) {
	if (selecionadoMenor) {
		textoAcordeMenor.style.color = 'black';
		tomSelect.style.color = 'grey';
		acorde_10.style.display = 'block';
		acorde_7.style.display = 'block';
		acorde_9.style.display = 'block';
	}
	else {
		textoAcordeMenor.style.color = 'grey';
		tomSelect.style.color = 'black';
		acorde_10.style.display = 'none';
		acorde_7.style.display = 'none';
		acorde_9.style.display = 'none';
	}
}

function aumentarTom_click(aumentar) {
	if (timer)
		clearTimeout(timer);
	timer = setTimeout(function () {
		aumentarTom(aumentar, 1, "tomSelect");
	}, 240);
}

function aumentarTom_clickDuplo(aumentar) {
	clearTimeout(timer);
	aumentarTom(aumentar, 2, "tomSelect");
}

function showselectIframe(mostrar) {
	// if (mostrar) {
	// 	botaoTamanhoIframe.style.display = "none";
	// 	selectTamanhoIframe.style.display = "";
	// }
	// else {
	// 	if (textoCifras.style.display !== 'none') {
	// 		textoCifrasFrame.style.height = selectTamanhoIframe.value + 'px';
	// 		textoCifras.style.height = selectTamanhoIframe.value + 'px';
	// 	}
	// }
}

function prepararMudarTomCifra(tomSelecionado) {
	if (salvarDiv.style.display !== 'none') {
		var esperar = 0;
		if (typeof mudarTom !== 'function' || typeof mudarTomCifra !== 'function') //1º carregamento
			esperar = 500;

		//setTimeout(function () {
		if (modal01.style.display === 'none') {
			if (textoCifrasFrame.style.display === "none")
				mudarTom(tomSelecionado);

			else {
				if (tomSelecionado.includes('m'))
					var index = tonsMenores.indexOf(tomSelecionado);
				else
					var index = tonsMaiores.indexOf(tomSelecionado);

				index = index - _tomIndex;

				if (index < 0)
					mudarTomCifra(false, Math.abs(index));
				else
					mudarTomCifra(true, index);
			}
		}
		//}, esperar);
	}
}

function pegarTomCifra(tomSelecionado) {
	if (tomSelecionado.includes('m'))
		_tomIndex = tonsMenores.indexOf(tomSelecionado);
	else
		_tomIndex = tonsMaiores.indexOf(tomSelecionado);
}

function primeiraLetraMaiuscula(string) {
	if (!string) return string;
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function isPar(numero) {
	return numero % 2 === 0;
}

function AlterarTom(texto, aumentar, quant) {
	try {
		if (!aumentar)
			quant = -1 * quant;

		var cifraTexto = GetAcordes(texto, quant);

		return {
			success: true,
			message: cifraTexto
		};
	} catch (ex) {
		return {
			success: false,
			message: ex.message
		};
	}
}

function EditarCifra(texto) {
	try {
		var cifraTexto = SearchAcordes(texto);

		return {
			success: true,
			message: cifraTexto
		};
	} catch (ex) {
		return {
			success: false,
			message: ex.message
		};
	}
}

function GetAcordes(cifraTexto, tom = 0) {
	if (!cifraTexto.includes("<b"))
		return SearchAcordes(cifraTexto);

	var notas = cifraTexto.split("<b");
	var texto = [];

	for (var i = 0; i < notas.length; i++) {
		if (i === 0)
			texto.push(notas[i]);
		else {
			var cifra = notas[i].split('>')[1].split('<')[0];
			var linhaRestante = notas[i].split('<')[1];

			var cifraFormatada = cifra;
			var retorno = GetAcorde(cifraFormatada);
			var cifraSomenteNota = retorno[0];
			var cifraAcordeAlteracoes = retorno[1];
			cifraFormatada = cifraSomenteNota;

			if (!cifraAcordeAlteracoes.includes('/'))
				cifraFormatada += cifraAcordeAlteracoes;

			while (!notasAcordes.includes(cifraFormatada))
				cifraFormatada = cifraFormatada.substring(0, cifraFormatada.length - 1);

			if (cifraAcordeAlteracoes.includes('/'))
				cifraFormatada += cifraAcordeAlteracoes;

			if (cifraFormatada !== "") {
				if (tom !== 0) {
					cifraFormatada = MudarCifraTom(tom, cifraSomenteNota);

					if (cifraAcordeAlteracoes.includes('/'))
						cifraAcordeAlteracoes = "/" + MudarCifraTom(tom, cifraAcordeAlteracoes.split('/')[1]);

					cifraFormatada += cifraAcordeAlteracoes;
				}

				cifraFormatada = ">" + cifraFormatada + "<" + linhaRestante;
				texto.push("<b id=\"cifra" + i + "\"" + cifraFormatada);
			} else {
				texto.push("       " + linhaRestante);
			}
		}
	}

	return texto.join("");
}

function GetAcorde(possivelAcorde) {
	possivelAcorde = possivelAcorde.replace("(9)", "9").replace("m(5-)", "°").replace("m7(5-)", "°7").replace('º', '°');

	var cifraFormatada = possivelAcorde;
	var cifraAcordeAlteracoes = "";
	var cifraAcordeBaixo = "";

	if (possivelAcorde.includes('('))
		cifraFormatada = possivelAcorde.split('(')[0];

	if (possivelAcorde.includes('/') && !possivelAcorde.includes('(')) {
		cifraFormatada = possivelAcorde.split('/')[0];
		var retorno = GetAcorde(possivelAcorde.split('/')[1]);
		cifraAcordeBaixo = "/" + retorno[0];
	}

	var cifraSomenteNota = cifraFormatada;

	if (cifraSomenteNota.length > 1) {
		if (cifraSomenteNota[1] === '#')
			cifraSomenteNota = cifraSomenteNota[0] + "#";
		else if (cifraSomenteNota[1] === 'b')
			cifraSomenteNota = cifraSomenteNota[0] + "b";
		else
			cifraSomenteNota = cifraSomenteNota[0];

		if (cifraAcordeAlteracoes === "")
			cifraAcordeAlteracoes = cifraFormatada.split(cifraSomenteNota)[1];

		cifraSomenteNota = acidentesCorrespondentesJson[cifraSomenteNota];
	}

	return [cifraSomenteNota, cifraAcordeAlteracoes + cifraAcordeBaixo];
}

function MudarCifraTom(tom, cifraSomenteNota) {
	var acordeIndex = tonsMaiores.indexOf(cifraSomenteNota);
	acordeIndex += tom;

	if (acordeIndex > 11)
		acordeIndex -= 12;
	else if (acordeIndex < 0)
		acordeIndex += 12;

	return tonsMaiores[acordeIndex];
}

function SearchNotasSolo(linhaSolo) {
	let acorde = linhaSolo;
	let soloArray = [];
	if (linhaSolo.includes('.')) {
		let partsSolo = linhaSolo.split('.');
		acorde = partsSolo[0];
		partsSolo[0] = '';

		if (partsSolo.length >= 1) {
			partsSolo.forEach(function (partSolo) {
				let oitava = partSolo.includes('0') ? '0' : partSolo.includes('-1') ? '-1' : '';
				let possivelNota = oitava ? partSolo.split(oitava)[0] : partSolo;
				possivelNota = possivelNota.length > 1 ? possivelNota[1] === 'b' ? possivelNota[0].toUpperCase() + 'b' : possivelNota.toUpperCase() : possivelNota.toUpperCase();
				let soloNota = _acidentesCorrespondentesJson[possivelNota];
				soloArray.push(soloNota ? soloNota.toLowerCase() + oitava : '');
			});
		}
	}

	//return [acorde, soloArray ? '.' + soloArray.join(".") : ''];
	return [acorde, soloArray ? soloArray.join(".") : ''];
}

function SearchAcordes(cifraTexto) {
	let linhasTexto = cifraTexto.split('\n');
	let texto = [];
	let somenteAcordes = /^[A-Ga-g0-9mM#bsus°º+/()| \.]*$/;
	let linhaIniciandoComAcorde = /\b[A-G()]/;
	let acordeId = 1;

	texto.push("<style>.cifraSelecionada{background-color:#ff0}pre{line-height:1.6;font-size:14px}</style><pre>");

	linhasTexto.forEach(function (linha) {
		let linhaFormatada = linha.replace("[Intro]", "").replace("[Solo]", "").replace("[Final]", "");

		if (linha && somenteAcordes.test(linhaFormatada)) {
			let acordes = linha.split(' ');

			acordes.forEach(function (acorde) {
				if (acorde && somenteAcordes.test(acorde) && linhaIniciandoComAcorde.test(acorde)) {
					let retornoSolo = SearchNotasSolo(acorde);
					acorde = retornoSolo[0];
					let solo = retornoSolo[1];

					let retorno;
					if (acorde[0] === '(') {
						texto.push("(");
						retorno = GetAcorde(acorde.split('(')[1].replace("|", ""));
					} else if (acorde[0] === ')') {
						texto.push(")");
						retorno = GetAcorde(acorde.split(')')[1].replace("|", ""));
					} else if (acorde.endsWith(')')) {
						texto.push(")");
						retorno = GetAcorde(acorde.split(')')[0].replace("|", ""));
					} else if (acorde.endsWith('(')) {
						texto.push("(");
						retorno = GetAcorde(acorde.split('(')[0].replace("|", ""));
					} else {
						retorno = GetAcorde(acorde.replace("|", ""));
					}

					let cifraSomenteNota = retorno[0];
					let cifraAcordeAlteracoes = retorno[1];
					let cifraFormatada = cifraSomenteNota + cifraAcordeAlteracoes;

					let cifraProcurar = cifraFormatada;
					if (acorde.includes('/')) {
						cifraProcurar = cifraProcurar.split('/')[0];
					}

					while (!notasAcordes.includes(cifraProcurar)) {
						cifraFormatada = cifraFormatada.substring(0, cifraFormatada.length - 1);
						if (cifraFormatada === '')
							break;
					}

					if (cifraFormatada) {
						cifraFormatada = ">" + cifraFormatada + solo + "</b>";
						texto.push("<b id=\"cifra" + acordeId + "\"" + cifraFormatada);

						//if (acorde !== acordes[acordes.length - 1]) {
						texto.push(" ");
						//}

						acordeId++;
					} else {
						texto.push("");
					}
				} else {
					texto.push(acorde + " ");
				}
			});
			texto.push("\n");
		} else {
			texto.push(linha + "\n");
		}
	});

	if (texto[texto.length - 1] === '\n')
		texto.pop(); //Remove o último '\n'
	if (texto[texto.length - 1] === ' ')
		texto.pop(); //Remove o último ' '
	texto.push("</pre>");

	return texto.join("");
}

function mudarTamanhoModal(aumentar) {
	if (aumentar) {
		var altura = window.innerHeight / 1.15;
		document.getElementById('liturgiaDiariaFrame').style.height = altura + 'px';
	}
}

function mutarVolume(mute = true) {
	if (_configurandoTeclas) {
		capturarTeclaConfiguracaoTeclas(botaoMute);
		return;
	}
	if (mute === false) {
		volumeInput.value = 0.9;
		volumeInput.dispatchEvent(eventoInput);
		iconVolume.style.display = '';
		iconVolumeMute.style.display = 'none';
	}
	else if (iconVolumeMute.style.display === 'none') {
		volumeInput.value = 0;
		volumeInput.dispatchEvent(eventoInput);
		iconVolume.style.display = 'none';
		iconVolumeMute.style.display = '';
	}
	else {
		volumeInput.value = 0.9;
		volumeInput.dispatchEvent(eventoInput);
		iconVolume.style.display = '';
		iconVolumeMute.style.display = 'none';
	}
}

function limparUrl() {
	let novaURL = window.location.href;
	if (window.location.href.includes('#')) {
		novaURL = window.location.href.split('#')[0];
	}
	if (window.location.href.includes('?')) {
		novaURL = window.location.href.split('?')[0];
	}

	window.history.replaceState({}, document.title, novaURL);
}

function ocultarModal() {
	rolagemTelaOracaoEucaristica();
	document.getElementById('liturgiaDiariaFrame').style.height = '';
	modal01.style.display = 'none';
	linksCifraClubList.style.display = 'none';
	botaoIniciar.style.display = '';
	escreverCifraTextArea.style.display = '';
	oracoesEucaristicasDiv.style.display = 'none';
	salvarDiv.style.display = 'none';
	selectInstrumento.style.display = 'none';
	//liturgiaDiariaDiv.style.display = 'none';
	sobreDiv.style.display = 'none';
	posicaoBotaoFecharModal(document.getElementById('botaoFecharModal'), false);

	limparUrl();
	mostrarAfinador(false);
}

function mostrarModal(nome) {
	modal01.style.display = 'block';

	switch (nome) {
		case 'opcoes':
			if (_configurandoTeclas)
				ocultarSalvarConfiguracaoTeclas();
			else if (_gravarCifras)
				ocultarGravarCifras();

			_spanBotaoFecharModalPositions = document.getElementById('spanBotaoFecharModal').getBoundingClientRect();

			selectInstrumento.style.display = 'none';
			modalGravar.style.display = 'none';
			selectOpcoes.style.display = 'block';
			salvarDiv.style.display = 'none';
			compartilharDiv.style.display = 'none';
			//compartilhadoDiv.style.display = 'none';
			selectConfiguracao.style.display = 'none';
			break;
		case 'instrumento':
			selectOpcoes.style.display = 'none';
			modalGravar.style.display = 'none';
			selectInstrumento.style.display = 'block';
			salvarDiv.style.display = 'none';
			compartilharDiv.style.display = 'none';
			//compartilhadoDiv.style.display = 'none';
			selectConfiguracao.style.display = 'none';
			break;
		case 'gravar':
			if (textoCifrasFrame.style.display === 'none' && textoCifras.contentDocument.body.innerHTML !== '') {
				escreverCifraTextArea.style.display = 'block';
				linksCifraClubList.style.display = 'none';
				//musicaSearch.value = "";
				//modal01.style.display = 'none';

				// Mostrar o textoCifrasFrame e depois ocultar porque textoCifras.contentDocument.body estava vindo como html
				textoCifrasFrame.style.display = '';
				musicaAcordesTextArea.value = textoCifras.contentDocument.body.innerText;
				textoCifrasFrame.style.display = 'none';

				//mostrarTextoCifrasCarregado();
				//tomSelect.selectedIndex = _tomSelectedIndexCifra;
			}

			else {
				selectOpcoes.style.display = 'none';
				selectInstrumento.style.display = 'none';
				salvarDiv.style.display = 'none';
				compartilharDiv.style.display = 'none';
				//compartilhadoDiv.style.display = 'none';
				selectConfiguracao.style.display = 'none';

				if (textoCifras.style.display !== 'none' && textoCifras.contentDocument.body.innerHTML !== '') {
					textoCifras.style.display = '';
					musicaAcordesTextArea.style.fontSize = '13px';
					musicaAcordesTextArea.value = textoCifras.contentDocument.body.innerText;

					if (formFile.value)
						textoCifras.style.display = 'none';
					// else
					//     textoCifras.style.display = '';
				}
			}
			modalGravar.style.display = 'block';
			break;
		case 'salvar':
			if (_configurandoTeclas) {
				const antesEstavaFull = sairDeFullscreen();

				if (confirm('Salvar Configuração de Teclas?')) {
					salvarConfiguracaoTeclas();
				}
				ocultarModal();

				if (antesEstavaFull)
					botaoFullscreen.dispatchEvent(eventoClick);
				break;
			}
			selectOpcoes.style.display = 'none';
			selectInstrumento.style.display = 'none';
			modalGravar.style.display = 'none';
			compartilharDiv.style.display = 'none';
			selectConfiguracao.style.display = 'none';
			salvarDiv.style.display = '';

			if (selectSalvamento.value === '') {
				let salvamentosStorage = localStorage.getItem('salvamentosv2');
				let compartilhadosStorage = localStorage.getItem('compartilhados');

				if (salvamentosStorage && compartilhadosStorage)
					compartilhadoDiv.style.display = 'block';
				else
					compartilhadoDiv.style.display = 'none';

				if (salvamentosStorage)
					carregarSalvamentosList('salvamentosv2');
				else if (compartilhadosStorage)
					carregarSalvamentosList('compartilhados');
			}
			break;
		case 'compartilhado':
			const arquivoIdStorage = localStorage.getItem('fileId');
			const nomeCompartilhamentoStorage = localStorage.getItem('nomeCompartilhamento');

			if (arquivoIdStorage && arquivoIdStorage !== 'undefined') {
				selectOpcoes.style.display = 'none';
				selectInstrumento.style.display = 'none';
				modalGravar.style.display = 'none';
				salvarDiv.style.display = 'none';
				compartilharDiv.style.display = 'block';
				//compartilhadoDiv.style.display = 'none';
				selectConfiguracao.style.display = 'none';

				const url = document.location.href.replace('#', '').replace('?compartilhado=1', '');
				const fileLink = `https://drive.google.com/file/d/${arquivoIdStorage}/view`;

				document.getElementById('arquivoIdText').innerText = url + '?compartilhado=' + arquivoIdStorage;
				document.getElementById('arquivoIdLink').innerText = fileLink;
				document.getElementById('arquivoIdLink').href = fileLink;

				if (nomeCompartilhamentoStorage)
					document.getElementById('nomeCompartilhamentoSpan').innerText = '"' + nomeCompartilhamentoStorage + '":';
			}

			break;
		case 'oracoesEucaristicas':
			oracoesEucaristicasDiv.style.display = '';
			selectOpcoes.style.display = 'none';
			rolagemTelaOracaoEucaristica(false);
			posicaoBotaoFecharModal(document.getElementById('botaoFecharModal'), true);
			break;
		case 'liturgiaDiaria':
			//liturgiaDiariaDiv.style.display = '';
			textoCifrasFrame.style.display = 'none';
			textoCifras.style.display = 'none';
			document.getElementById('liturgiaDiariaFrame').style.display = '';
			selectOpcoes.style.display = 'none';
			ocultarModal();
			//mudarTamanhoModal(true);
			break;
		case 'sobre':
			sobreDiv.style.display = '';
			selectOpcoes.style.display = 'none';
			break;
		case 'configuracao':
			mostrarSalvarConfiguracaoTeclas();
			break;
		case 'configuracaoOpcoes':
			selectConfiguracao.style.display = '';
			selectOpcoes.style.display = 'none';
			break;
		default:
			break;
	}
}

function mostrarAfinador(mostrar = true) {
	// Não usar afinador por enquanto
	// if (mostrar) {
	// 	tunerDiv.style.display = '';

	// 	if (autoTunerCheck.checked) {
	// 		autoTunerCheck.checked = false;
	// 		tunerDiv.style.display = 'none';
	// 	}
	// 	else
	// 		autoTunerCheck.checked = true;

	// 	autoTunerCheck.dispatchEvent(eventoClick);
	// }
	// else {
	// 	tunerDiv.style.display = 'none';
	// 	autoTunerCheck.checked = false;
	// 	autoTunerCheck.dispatchEvent(eventoClick);
	// }
}

function selecionarInstrumento(bateria = false, manualmente = false) {
	if (manualmente)
		localStorage.setItem('instrumentoSelecionadoIndex', instrumentoSelect.selectedIndex);

	var instrumentoSelecionado = instrumentoSelect.value;
	const elementos = [brush, aro, caixa, chimbal, meiaLua, prato];

	titulo.innerText = instrumentoSelecionado + ' ▼';
	modal01.style.display = 'none';

	orgaoBox.style.display = '';
	tunerDiv.style.display = 'none';

	Array.from(elementos).forEach((elemento) => {
		elemento.style.width = '77px';
		elemento.style.height = '44px';
		elemento.style.margin = '8px';
	});

	document.getElementsByClassName('centralizado-no-container')[1].style.width = '300px';

	if (bateria)
		if (selectRitmo.value === '')
			bateriaBotoes.style.display = 'none';
		else
			bateriaBotoes.style.display = 'block';


	if (instrumentoSelecionado === 'Órgão') {
		_cravoSelecionado = true;
		ocultarBotoesRitmo(true);
		ocultarBotoesCravo(false);
	}
	else {
		_cravoSelecionado = false;
		ocultarBotoesRitmo(false);
		ocultarBotoesCravo(true);
	}

	//mudarTempoCompasso(); Comentado para funcionar por enquanto
}

function calcularAlturaIframe() {
	var orgaoDiv = document.getElementById('bateriaBox');
	var elementosHeight = orgaoDiv.offsetHeight + linhaSelectTom.offsetHeight;

	if (navBar.style.display !== 'none') {
		elementosHeight += navBar.offsetHeight;
		elementosHeight += 30;
	}

	document.documentElement.style.setProperty('--element-height', elementosHeight + 'px');
}

function gravarCifra() {
	_gravarCifras = true;
	document.getElementById('tituloGravacaoCifras').style.display = '';
	document.getElementById('linhaVermelha').style.display = '';
	modal01.style.display = 'none';
	mostrarBateria(false);
	acompCheckDiv.style.display = 'none';
	botaoBuscar.style.display = 'none';
	play_pause.style.display = '';
	instrumentoSelect.selectedIndex = 0;
	instrumentoSelect.dispatchEvent(eventoChange);
	titulo.style.display = 'none';
	gravarCifrasControle.style.display = '';
	orgaoCifrasBotoes.style.display = '';
	ocultarBotoesAcompanhamentosRitmo();
}

function iniciarCifra() {
	if (musicaAcordesTextArea.value !== '') {
		modal01.style.display = 'none';
		modal_loading.style.display = 'block';

		let retorno = EditarCifra(musicaAcordesTextArea.value);
		if (retorno.success) {
			musicaAcordesTextArea.value = '';
			mudarParaTelaCifras(retorno);
		}
		else
			alert(retorno.message);

		modal_loading.style.display = 'none';
	}
}
function novoSalvamento() {
	let nomeStorage;
	let salvamentosStorage = localStorage.getItem('salvamentosv2');
	let compartilhadosStorage = localStorage.getItem('compartilhados');
	if (salvamentosStorage && compartilhadosStorage)
		nomeStorage = document.getElementById('selectConjuntoSalvamento').value;
	else if (salvamentosStorage)
		nomeStorage = 'salvamentosv2';
	else if (compartilhadosStorage)
		nomeStorage = 'compartilhados';

	const antesEstavaFull = sairDeFullscreen();

	var novoSalvamento = selectSalvamento;
	let nome = prompt('Nome do novo salvamento');

	if (nome !== '' && nome !== null) {
		nome = primeiraLetraMaiuscula(nome.trim());
		var opcoesSelect = novoSalvamento.options;
		var opcoesArray = [...opcoesSelect].map(el => el.value);

		if (opcoesArray.includes(nome)) {
			alert('Salvamento ' + nome + ' já existe!');
		} else {
			var option = document.createElement("option");

			option.text = nome;
			novoSalvamento.add(option);
			novoSalvamento.selectedIndex = novoSalvamento.length - 1;

			salvarSalvamento(novoSalvamento.value, nomeStorage);
		}
	}

	if (antesEstavaFull)
		botaoFullscreen.dispatchEvent(eventoClick);
}

function trocarSalvamento() {
	let compartilhados = localStorage.getItem('compartilhados');

	if (compartilhados) {
		if (confirm('SUBSTITUIR conjunto Salvamento (local) por Compartilhado?')) {
			localStorage.setItem('salvamentosv2', compartilhados);
			localStorage.removeItem('compartilhados');
			ocultarModal();
		}
	}
}

function deletarSalvamento(todos = false) {
	var nomeStorage = document.getElementById('selectConjuntoSalvamento').value;

	if (todos) {
		if (nomeStorage)
			if (confirm('Apagar TODOS os salvamentos deste conjunto?')) {
				localStorage.removeItem(nomeStorage);
				ocultarModal();
			}
	}
	else {
		if (!nomeStorage)
			nomeStorage = 'salvamentosv2';

		var gravacaoSelecionada = selectSalvamento;

		if (gravacaoSelecionada.value !== '') {
			const antesEstavaFull = sairDeFullscreen();

			if (confirm('Apagar salvamento?\n' + gravacaoSelecionada.value)) {
				var salvamentos = getSalvamentos(nomeStorage);
				delete salvamentos[gravacaoSelecionada.value];

				if (Object.keys(salvamentos).length === 0)
					localStorage.removeItem(nomeStorage);
				else
					localStorage.setItem(nomeStorage, JSON.stringify(salvamentos));
			}

			if (antesEstavaFull)
				botaoFullscreen.dispatchEvent(eventoClick);

			carregarSalvamentosList(nomeStorage);
		}
	}
}

function editarSalvamento() {
	let nomeStorage;
	let salvamentosStorage = localStorage.getItem('salvamentosv2');
	let compartilhadosStorage = localStorage.getItem('compartilhados');
	if (salvamentosStorage && compartilhadosStorage)
		nomeStorage = document.getElementById('selectConjuntoSalvamento').value;
	else if (salvamentosStorage)
		nomeStorage = 'salvamentosv2';
	else if (compartilhadosStorage)
		nomeStorage = 'compartilhados';

	var gravacaoSelecionada = selectSalvamento;

	if (gravacaoSelecionada.value !== '') {
		const antesEstavaFull = sairDeFullscreen();

		let novoNome = prompt('Novo nome do salvamento\n' + gravacaoSelecionada.value);

		if (novoNome !== '' && novoNome !== null) {
			novoNome = primeiraLetraMaiuscula(novoNome.trim());
			var opcoesSelect = gravacaoSelecionada.options;
			var opcoesArray = [...opcoesSelect].map(el => el.value);

			if (opcoesArray.includes(novoNome)) {
				alert('Salvamento ' + novoNome + ' já existe!');
			} else {
				var salvamentos = getSalvamentos(nomeStorage);
				salvamentos[novoNome] = salvamentos[gravacaoSelecionada.value];
				delete salvamentos[gravacaoSelecionada.value];

				localStorage.setItem(nomeStorage, JSON.stringify(salvamentos));
				carregarSalvamentosList(nomeStorage);
				gravacaoSelecionada.selectedIndex = gravacaoSelecionada.length - 1;
			}
		}

		if (antesEstavaFull)
			botaoFullscreen.dispatchEvent(eventoClick);
	}
}

function salvarOptionsNoStorage(nomeStorage) {
	opcoesSelect = selectSalvamento.options;
	opcoesArray = [...opcoesSelect].map(el => el.value);
	opcoesArray.shift(); //Remover o primeiro que é '' (em branco)

	localStorage.setItem(nomeStorage, JSON.stringify(opcoesArray));
}

function getSalvamentos(salvamentoStorage) {
	var salvamentos = localStorage.getItem(salvamentoStorage);
	return salvamentos ? JSON.parse(salvamentos) : {};
}

function carregarSalvamentosList(salvamentoStorage) {
	var salvamentos = getSalvamentos(salvamentoStorage);

	if (salvamentos) {
		selectSalvamento.innerHTML = "";

		var optionVazio = document.createElement("option");
		optionVazio.text = "";
		selectSalvamento.add(optionVazio);

		var keys = Object.keys(salvamentos).sort();

		keys.forEach(function (key) {
			var option = document.createElement("option");
			option.text = key;
			selectSalvamento.add(option);
		});
	}
}

function salvarSalvamentoNoStorage(salvamentoNome, nomeStorage) {
	var dadosSalvos = {
		instrumentoSelect: instrumentoSelect.selectedIndex,
		selectRitmo: selectRitmo.selectedIndex,
		tomSelect: tomSelect.selectedIndex,
		bpm: bpm.value,
		autoCheck: autoCheck.checked,
		acompCheck: acompCheck.checked
	};

	var maoBotaoSelecionado = document.getElementsByClassName('selecionado');
	if (maoBotaoSelecionado.length > 0)
		dadosSalvos[maoBotaoSelecionado[0].id] = 'selecionado';

	if (tomMenorSwitchDiv.style.display !== 'none')
		dadosSalvos.tomMenorSwitch = tomMenorSwitch.checked;

	if (textoCifrasFrame.style.display !== 'none') {
		dadosSalvos.frameTom = tomSelect.value;
		dadosSalvos.frameCifra = textoCifras.contentDocument.body.innerHTML;
	}

	var salvamentos = JSON.parse(localStorage.getItem(nomeStorage)) || {};
	salvamentos[salvamentoNome] = dadosSalvos;
	localStorage.setItem(nomeStorage, JSON.stringify(salvamentos));

	modal01.style.display = 'none';
}

function salvarSalvamento(salvamentoSelecionado = '', nomeStorage) {
	if (!nomeStorage) {
		const salvamentosStorage = localStorage.getItem('salvamentosv2');
		const compartilhadosStorage = localStorage.getItem('compartilhados');
		if (salvamentosStorage && compartilhadosStorage)
			nomeStorage = document.getElementById('selectConjuntoSalvamento').value;
		else if (salvamentosStorage)
			nomeStorage = 'salvamentosv2';
		else if (compartilhadosStorage)
			nomeStorage = 'compartilhados';
		else
			nomeStorage = 'salvamentosv2';
	}

	if (salvamentoSelecionado) {
		salvarSalvamentoNoStorage(salvamentoSelecionado, nomeStorage);
	} else if (selectSalvamento.value !== '') {
		const antesEstavaFull = sairDeFullscreen();

		salvamentoSelecionado = selectSalvamento.value;
		if (confirm(`Deseja salvar?\n${salvamentoSelecionado}`)) {
			salvarSalvamentoNoStorage(salvamentoSelecionado, nomeStorage);
		}

		if (antesEstavaFull) {
			botaoFullscreen.dispatchEvent(eventoClick);
		}
	}
}

function carregar_Salvamento() {
	voltarParaOrgao();

	const salvamentosStorage = localStorage.getItem('salvamentosv2');
	const compartilhadosStorage = localStorage.getItem('compartilhados');

	if (!salvamentosStorage && !compartilhadosStorage) {
		return;
	}

	let storage = salvamentosStorage || compartilhadosStorage;

	const nomeStorage = document.getElementById('selectConjuntoSalvamento').value;
	if (nomeStorage === 'compartilhados') {
		storage = compartilhadosStorage;
	}

	const salvamentoSelecionado = selectSalvamento.value;
	if (!salvamentoSelecionado) {
		return;
	}

	try {
		const dadosSalvos = JSON.parse(storage)[salvamentoSelecionado];

		if (dadosSalvos) {
			const temCifra = Object.keys(dadosSalvos).includes('frameCifra');
			if (temCifra) {
				const tom = dadosSalvos['frameTom'];
				const cifraTexto = dadosSalvos['frameCifra'];

				escreverCifraTextArea.style.display = 'block';
				mostrarTextoCifrasCarregado(tom, cifraTexto);
				//textoCifras.contentWindow.document.querySelector('pre').style.fontSize = selectFonte.value + 'px';

				const cifraElem = selecionarCifraId();
				if (cifraElem) {
					cifraElem.scrollIntoView();
				}
			} else {
				voltarParaOrgao();
			}

			Object.entries(dadosSalvos).forEach(([key, value]) => {
				const element = document.getElementById(key);
				if (element && element.id !== 'frameCifra' && element.id !== 'frameTom') {
					switch (key) {
						case 'bpm':
							element.value = value;
							bpmRange.value = bpm.value;
							break;
						case 'tomMenorSwitch':
						case 'autoCheck':
						case 'acompCheck':
							element.checked = value;
							break;
						case 'selecionado':
							escolherAcompanhamentoOrgao(element.id, element);
							break;
						default:
							element.selectedIndex = value;
							break;
					}

					if (!(temCifra && key === 'tomSelect')) {
						element.dispatchEvent(new Event('change'));
					}
				}
			});
		}
	} catch (error) {
		console.error('Erro ao carregar salvamento:', error);
	}

	ocultarModal();
}


function compartilhar_Salvamentos() {
	let compartilhados = localStorage.getItem('compartilhados');
	let salvamentosv2 = localStorage.getItem('salvamentosv2');

	if (salvamentosv2) {
		modal01.style.display = 'none';
		criarArquivodoStorage('salvamentosv2');
	}
	else if (compartilhados) {
		localStorage.setItem('salvamentosv2', compartilhados);
		modal01.style.display = 'none';
		criarArquivodoStorage('salvamentosv2');
	}
	else
		alert('Crie pelo menos um Salvamento');
}

function mostrarSalvamentoCompartilhado() {
	const arquivoIdText = document.getElementById('arquivoIdText').innerText;

	if (isMobileDevice())
		compartilharMobile(arquivoIdText);
	else
		copiarTextoParaClipboard(arquivoIdText);
}

function escolherArquivo(event) {
	const arquivos = event.target.files;

	if (arquivos.length > 0) {
		modal01.style.display = 'none';

		var formFile = document.getElementById('formFile');
		var file = formFile.files[0];

		const fileType = file.type;

		if (fileType !== 'image/png' && fileType !== 'image/jpg' && fileType !== 'image/jpeg') {
			alert('Selecione apenas arquivos de imagem');
			formFile.value = '';
		}
		else {
			var fileURL = URL.createObjectURL(file);

			let partituraFrame = document.getElementById('partituraFrame');

			partituraFrame.src = fileURL;

			if (textoCifrasFrame.style.display === 'none') {
				mudarParaTelaFrame();
			}

			iniciarCifra();

			partituraFrame.style.display = '';
			textoCifras.style.display = 'none';
		}
	}
	else {
		partituraFrame.style.display = 'none';

		//if (textoCifras.contentDocument.body.innerText !== '')
		textoCifras.style.display = '';
	}
}

async function pesquisarMusica() {
	modal_loading.style.display = 'block';
  
	listaMusicasCifra.innerHTML = '';
	var textoPesquisa = musicaSearch.value;
  
	try {
		const response = await fetch('https://apinode-h4wt.onrender.com/pesquisar', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({ texto: textoPesquisa }),
		  });
	  //const response = await fetch(`https://apinode-h4wt.onrender.com/pesquisar?texto=${textoPesquisa}`);
	  const data = await response.json();
  
	  if (data.success) {
		escreverCifraTextArea.style.display = 'none';
		linksCifraClubList.style.display = 'block';
		botaoIniciar.style.display = 'none';
  
		var titulosMusicas = data.lista;
		var linksMusicas = data.links;
  
		if (titulosMusicas.length > 0) {
		  for (let i = 0; i < titulosMusicas.length; i += 1) {
			$('#listaMusicasCifra').append(
			  `<div class="list-group-item list-group-item-action" onclick="escolherLink('${linksMusicas[i]}')">${titulosMusicas[i]}</div>`
			);
		  }
		} else {
		  alert('Não encontrado nenhuma cifra');
		}
	  } else {
		alert(data.message);
	  }
	} catch (error) {
	  console.error('Error fetching data:', error);
	  alert('Erro: ' + error);
	} finally {
	  modal_loading.style.display = 'none';
	}
  }
  
  async function escolherLink(urlLink) {
	modal_loading.style.display = 'block';
  
	try {
	  const response = await fetch('https://apinode-h4wt.onrender.com/downloadsite', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({ url: urlLink }),
	  });
  
	  const data = await response.json();
  
	  if (data.success) {
		mudarParaTelaCifras(data);
	  } else {
		alert(data.message);
	  }
	} catch (error) {
	  console.error('Error fetching data:', error);
	  alert('Erro ao baixar a cifra. Tente novamente mais tarde.');
	} finally {
	  modal_loading.style.display = 'none';
	}
  }

function mudarParaTelaCifras(data) {
	escreverCifraTextArea.style.display = 'block';
	linksCifraClubList.style.display = 'none';
	botaoIniciar.style.display = '';
	//musicaSearch.value = "";
	modal01.style.display = 'none';

	mostrarTextoCifrasCarregado(data.tom, data.message);
}