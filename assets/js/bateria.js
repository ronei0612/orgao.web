var _tempo = 90;
const ritmosNomes = Object.keys(ritmosJson);
var _somSolo;

function setBeats(ritmoMatrix) {//compasso
    if (ritmoMatrix === '6/8')
        measureLength.value = 24;
    else if (ritmoMatrix === '3/4' || ritmoMatrix === 'Valsa')
        measureLength.value = 12;
    else
        measureLength.value = 16;
        
    measureLength.dispatchEvent(eventoChange);
}

function selecionarRitmo(ritmo, virada = false) {
    if (_trocarRitmo && ritmo && ritmo !== undefined) {
        _viradaRitmo = fazerViradaBateria(_ritmoSelecionado);

        if (virada === false)
            _trocarRitmo = false;

        try {
            let ritmoMatrix = ritmo;
            if (ritmo.includes('_'))
                ritmoMatrix = ritmo.split('_')[0];

            if (ritmoMatrix != 'null') {
                setBeats(ritmoMatrix);

                let tabelaBateria = document.getElementById('tracker-table');
                let tdsAtivados = document.getElementsByClassName('tracker-enabled');

                Array.from(tdsAtivados).forEach((tdAtivado) => {
                    tdAtivado.classList.remove('tracker-enabled');
                });

                let tdsAtivar = tabelaBateria.getElementsByTagName('td');
                let numerosIndex = ritmosJson[ritmo];

                numerosIndex.forEach((numeroIndex) => {
                    tdsAtivar[numeroIndex].classList.add('tracker-enabled');
                });
            }
        } catch { }
    }

    mudarTempoCompasso();
}


function mudarTempoCompasso(alteradoRange) {
    if (alteradoRange) {
        _tempo = parseInt(bpmRange.value);
        bpm.value = bpmRange.value;

    }
    else {
        _tempo = parseInt(bpm.value);
        bpmRange.value = bpm.value;
    }

    let bpmValor = 60000 / _tempo;

    if (selectRitmo.value === '6/8')
        bpmValor = bpmValor / 2;

    lightCompasso.style.animation = 'blink ' + bpmValor + 'ms infinite';    
}

function fazerViradaBateria(ritmoSelecionado) {
    var viradaRitmo = ritmoSelecionado + '_fill';
    return viradaRitmo;
}

function fecharChimbal(instrumentName, sourceChimbalAberto, triggerTime) {
    if (instrumentName === 'chimbal' || instrumentName === 'chimbal2')
        if (_chimbalIsAberto) {
            sourceChimbalAberto.stop(triggerTime);
            _chimbalIsAberto = false;
        }
}

function pararBaixo(ctx) {
    if (_sourceBaixo) {
        //let node = _sourceBaixo.context.createGain();
        //_sourceBaixo.connect(node);
        //node.gain.setValueAtTime(1, ctx.currentTime);
        //node.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);

        // Parar o �udio ap�s o fading out
        //_sourceBaixo.stop(ctx.currentTime + 0.1);
        //_sourceBaixo.stop(ctx.currentTime + 0.05);
        _sourceBaixo.stop();
    }
}

function guardarChimbalAberto(instrumentName, instrument) {
    if (instrumentName === 'aberto') {
        _sourceChimbalAberto = instrument;
        _chimbalIsAberto = true;
    }
}

function guardarBaixo(instrument) {
    _sourceBaixo = instrument;
}

function mudarRitmo(ritmo) {
    _trocarRitmo = true;

    if (ritmo === '')
        _ritmoSelecionado = selectRitmo.value;
    else
        _ritmoSelecionado = selectRitmo.value + "_" + ritmo;

    selecionarRitmo(_ritmoSelecionado);
}

function gerarRitmosNomes(ritmosNomes) {
    selectRitmo.innerHTML = "";

    if (_instrumentoSelecionado === 'orgao') {
        for (var i = 0, len = ritmosNomes.length; i < len; i++) {
            if (ritmosNomes[i].includes('/') && !ritmosNomes[i].includes('_')) {
                let opt = document.createElement('option');
                opt.value = ritmosNomes[i];
                opt.textContent += ritmosNomes[i];
                selectRitmo.appendChild(opt);
            }
        }
    }
    else {
        for (var i = 0, len = ritmosNomes.length; i < len; i++) {
            if (!ritmosNomes[i].includes('_')) {
                let opt = document.createElement('option');
                opt.value = ritmosNomes[i];
                opt.textContent += ritmosNomes[i];
                selectRitmo.appendChild(opt);
            }
        }
    }
}

function verificarETocarBateria_2(tunerAcompanhamento, instrumentoAcompanhamento) {
    if (iconVolumeMute.style.display === 'none') {
        if (tunerDiv.style.display !== 'none') {
            if (tunerAcompanhamento) {
                if (autoTunerCheck.checked === false)
                    autoTunerCheck.checked = true;

                _instrumentoSelecionado = instrumentoAcompanhamento;
                _acordeAntesSelecionado = verificarAcompanhamentoEtocar(notaTuner.innerText, _acordeAntesSelecionado);

                autoTunerCheck.dispatchEvent(eventoChange);
            }
            else {
                if (autoTunerCheck.checked) {
                    pararOsAcordes();
                    autoTunerCheck.checked = false;
                    autoTunerCheck.dispatchEvent(eventoChange);
                }
            }
        }

        return true;
    }
}

function playGuitarra() {
    stopGuitarra();

    if (_guitarraSelecionado && _acordeNotas) {
        let notas = _acordeNotas;
        //notas.sort();
        primeiraGuitar.frequency = notasFrequencias[notas[0].replace('#', '_')];
        quintaGuitar.frequency = notasFrequencias[notas[2].replace('#', '_') + '1'];
        primeiraGuitar.play();
        quintaGuitar.play();
        _guitarraParado = false;
    }
}

function stopGuitarra(forcar) {
    if (!_guitarraParado || forcar) {
        primeiraGuitar.stop();
        quintaGuitar.stop();
        _guitarraParado = true;
    }
}