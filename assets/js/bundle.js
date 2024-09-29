// Main Script
var _ritmoSelecionado;
var _notasSoloIndex = 0;
var _brushSelecionado = false;
var _tocandoBateria = false;

let instrumentData = {};
let audioContext;
let schedule;

function setupTrackerHtml(data, measureLength) {
  if (typeof data === 'undefined')
    alert('Erro nos sons! Recarregue a página por favor.');

  instrumentData = data;
  instrumentData.title = instrumentData.filename;
  schedule.drawTracker(data.filename.length, measureLength, instrumentData);
  return;
}

function scheduleAudioBeat(rowId, triggerTime) { //tocar os beats
  let instrumentName = instrumentData.filename[rowId];
  let instrument = buffers[instrumentName].get();

  function play(source) {
    let node = routeGain(source)
    node.connect(audioContext.destination);
    fecharChimbal(instrumentName, _sourceChimbalAberto, triggerTime);
    source.start(triggerTime);
    //console.log(triggerTime);
  }

  function routeGain(source) {
    let gain = new AdsrGainNode(audioContext);
    gain.mode = 'linearRampToValueAtTime';
    let options = getSetAudioOptions.getTrackerControls();

    let gainNode;
    gain.setOptions(options);
    gainNode = gain.getGainNode(triggerTime);
    source.connect(gainNode);

    return gainNode;
  }

  function playBaixo() {
    if (instrumentName === '-' && instrumentoSelect.value === 'Banda' && _baixoSelecionado) {
      setTimeout(function () {
        let notaBaixo = _acordeBaixo.includes('#') ? _acordeBaixo[0] + '_' : _acordeBaixo;
        let baixoAudio = buffers['baixo_' + notaBaixo].get();
        //guardarBaixo(baixoAudio);
        play(baixoAudio);
      }, 130);
    }
  }

  function playViolao() {
    if (_violaoSelecionado && (instrumentoSelect.value === 'Banda') &&
      (instrumentName === '0' || instrumentName === '1' || instrumentName === '2')) {
      setTimeout(function () {
        let violaoAudio;
        if (instrumentName === '2') {
          violaoAudio = buffers['violao_'].get();
          play(violaoAudio);
        }
        else {
          let acordeViolao = _acordeSelecionado;

          if (acordeViolao.includes('°'))
            acordeViolao = _notasAcordesJson[acordeViolao][1].toUpperCase() + 'm';

          let matches = acordeViolao.match(/^[A-Z]#?m?/);
          if (matches) {
            let nota = matches[0];
            nota = nota.replace('#', '_').toLowerCase();

            if (instrumentName === '1')
              nota = nota + '1';

            violaoAudio = buffers['violao_' + nota].get();

            play(violaoAudio);
          }
        }
      }, 100);
    }
  }

  function playCravo() {
    if ((instrumentName === '0' || instrumentName === '1' || instrumentName === '2') && _acordeSelecionado) {
      setTimeout(function () {
        let notas = _acordeNotas;
        notas.sort();

        let nota = notas[instrumentName];
        nota = nota.includes('#') ? nota.split('#')[0] + '_' : nota[0];

        play(buffers['cravo_' + nota].get());
      }, 100);
    }
  }

  if (_acordeSelecionado) {
    playViolao();
    playBaixo();
  }

  if (_cravoSelecionado)
    playCravo();
  else
    guardarChimbalAberto(instrumentName, instrument);

  play(instrument);
}

function playBateria() {
  schedule.stop();
  schedule.runSchedule(_tempo);

  prepararBateriaBotao.style.display = 'none';
  pararBateriaBotao.style.display = '';
}

function stopBateria(trocandoInstrumento) {
  if (schedule.running) {
    //if (_autoMudarRitmo && !trocandoInstrumento && !_brushSelecionado && !_cravoSelecionado)
    //    prato.dispatchEvent(eventoClick);

    if (_cravoSelecionado || trocandoInstrumento) {
      schedule.stop();
      schedule = new Tracker(audioContext, scheduleAudioBeat);

      _violaoSelecionado = false;
      _epianoSelecionado = false;
      _baixoSelecionado = false;
      _guitarraSelecionado = false;
      _tocandoBateria = false;

      let botoesAcompanhamento = document.getElementsByClassName('instrumentoSelecionado');
      Array.from(botoesAcompanhamento).forEach((elemento) => {
        if (elemento.id !== 'stringsBotao')
          elemento.classList.remove('instrumentoSelecionado');
      });

      prepararBateriaBotao.style.display = '';
      pararBateriaBotao.style.display = 'none';
    }
    else {
      _tocandoBateria = false;
      mudarRitmo('');
    }

    _brushSelecionado = false;
  }

  _ritmoSelecionado = null;
}

function tocarBateria(botao = null, tocar) {
  if (botao) {
    if (!schedule.running)
      playBateria();
    else if (!tocar)
      stopBateria();
  }
  else
    stopBateria();
}

function setupBaseEvents() {
  function verificarETocarBateria(mudarRitmoNome, tunerAcompanhamento, instrumentoAcompanhamento) {
    if (verificarETocarBateria_2(tunerAcompanhamento, instrumentoAcompanhamento)) {
      tocarBateria(document.activeElement, mudarRitmoNome === 'cravo' || mudarRitmoNome === 'brushCravo');
      mudarRitmo(mudarRitmoNome);
    }
  }

  function setTempoRitmo() {
    getSetAudioOptions.setTrackerControls();

    if (schedule.running) {
      schedule.stop();
      schedule.runSchedule(_tempo);
    }
  }

  selectRitmo.addEventListener('change', function (e) {
    var ritmoSelecionado = document.getElementsByClassName('selecionadoDrum');
    _trocarRitmo = true;

    selecionarRitmo(selectRitmo.value);

    if (ritmoSelecionado.length > 0)
      ritmoSelecionado[0].dispatchEvent(eventoClick);
    else if (_baixoSelecionado || _violaoSelecionado)
      verificarETocarBateria('', false);
  });

  aro.addEventListener('click', function (e) {
    if (_configurandoTeclas) {
      capturarTeclaConfiguracaoTeclas(aro);
      return;
    }
    verificarETocarBateria('aro', false);
    autoMudarRitmo(aro, true);
    _tocandoBateria = true;
  });

  meiaLua.addEventListener('click', function (e) {
    if (_configurandoTeclas) {
      capturarTeclaConfiguracaoTeclas(meiaLua);
      return;
    }
    verificarETocarBateria('meiaLua', true, 'stringsSolo');
    autoMudarRitmo(meiaLua, true);
    _tocandoBateria = true;
  });

  caixa.addEventListener('click', function (e) {
    if (_configurandoTeclas) {
      capturarTeclaConfiguracaoTeclas(caixa);
      return;
    }
    verificarETocarBateria('caixa', false);
    autoMudarRitmo(caixa, true);
    _tocandoBateria = true;
  });

  brush.addEventListener('click', function (e) {
    if (_configurandoTeclas) {
      capturarTeclaConfiguracaoTeclas(brush);
      return;
    }
    _brushSelecionado = true;
    verificarETocarBateria('brush', false);
    autoMudarRitmo(brush, true);
    _tocandoBateria = true;
  });

  chimbal.addEventListener('click', function (e) {
    if (_configurandoTeclas) {
      capturarTeclaConfiguracaoTeclas(chimbal);
      return;
    }
    verificarETocarBateria('chimbal', true, 'stringsSolo');
    autoMudarRitmo(chimbal, true);
    _tocandoBateria = true;
  });

  cravo.addEventListener('click', function (e) {
    if (_configurandoTeclas) {
      capturarTeclaConfiguracaoTeclas(cravo);
      return;
    }
    verificarETocarBateria('cravo', true, 'stringsSolo');
  });

  brushCravo.addEventListener('click', function (e) {
    if (_configurandoTeclas) {
      capturarTeclaConfiguracaoTeclas(brushCravo);
      return;
    }
    verificarETocarBateria('brushCravo', true, 'stringsSolo');
  });

  baixoBotao.addEventListener('click', function (e) {
    if (_configurandoTeclas) {
      capturarTeclaConfiguracaoTeclas(baixoBotao);
      return;
    }
    if (_baixoSelecionado && !_ritmoSelecionado)
      verificarETocarBateria('', false)
  });

  violaoBotao.addEventListener('click', function (e) {
    if (_configurandoTeclas) {
      capturarTeclaConfiguracaoTeclas(violaoBotao);
      return;
    }
    if (_violaoSelecionado && !_ritmoSelecionado)
      verificarETocarBateria('', false)
  });

  cifraAvancar.addEventListener('click', function (e) {
    if (_configurandoTeclas) {
      return;
    }
    if (_notasSolo)
      if (!schedule.running)
        playBateria();
  });

  play_pause_bateria.addEventListener('mousedown', function (e) {
    if (_configurandoTeclas) {
      capturarTeclaConfiguracaoTeclas(play_pause_bateria);
      return;
    }

    ativarBotao(play_pause_bateria);

    if (tunerDiv.style.display !== 'none' || _autoMudarRitmo) {
      autoTunerCheck.checked = false;
      //pararOsAcordes();
      play_pause.dispatchEvent(eventoClick);
    }

    if (pararBateriaBotao.style.display !== 'none' && _tocandoBateria === false)
      stopBateria(true);
    else
      tocarBateria();
  });

  bpm.addEventListener('change', function (e) {
    mudarTempoCompasso(false);
    setTempoRitmo();
  });

  bpmRange.addEventListener('input', function (e) {
    bpm.value = parseInt(bpmRange.value);
    _tempo = bpmRange.value;
  });

  bpmRange.addEventListener('change', function (e) {
    setTempoRitmo();
  });

  measureLength.addEventListener('change', (e) => {
    let length = parseInt(measureLength.value);
    if (length < 1) return;

    schedule.measureLength = length;
    let track = schedule.getTrackerValues();
    setupTrackerHtml(currentSampleData, length);
    schedule.measureLength = length;
    schedule.loadTrackerValues(track);
    schedule.setupEvents();
  });

  instrumentoSelect.addEventListener('change', (e) => {
    autoCheck.checked = false;
    try {
      autoCheck.dispatchEvent(eventoChange);
    } catch { }
    stopBateria(true);
    pararOsAcordes();
    gerarRitmosNomes(ritmosNomes);
  });

  $('.base').on('change', function () {
    getSetAudioOptions.setTrackerControls();
  });
}

$('#sampleSet').on('change', function () {
  initializeSampleSet(audioContext, this.value);
});
