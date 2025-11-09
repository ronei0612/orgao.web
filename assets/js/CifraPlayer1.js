class CifraPlayer {
    constructor(elements, uiController, musicTheory) {
        this.uiController = uiController;
        this.musicTheory = musicTheory; // Injetado
        this.elements = elements;

        // NOVO: Inicialização do AudioContextManager
        this.audioContextManager = new AudioContextManager();

        this.parado = true;
        this.acordeTocando = '';
        this.indiceAcorde = 0;
        this.tomAtual = 'C';

        this.acordeMap = musicTheory.acordeMap;
        this.notasAcordes = musicTheory.notasAcordes;
        this.tonsMaiores = musicTheory.tonsMaiores;
        this.tonsMenores = musicTheory.tonsMenores;
        this.acordesSustenidos = musicTheory.acordesSustenidos;
        this.acordesBemol = musicTheory.acordesBemol;
        this.acordesSustenidosBemol = musicTheory.acordesSustenidosBemol;
        this.acordesMapCore = musicTheory.acordesMap;

        this.audioPath = location.origin.includes('file:') ? 'https://roneicostasoares.com.br/orgao.web/assets/audio/' : './assets/audio/';
        this.acordeUrls = new Map(); // Armazena a URL para cada arquivo de áudio
        this.carregarAcordes(); // Chamada para carregar todos os áudios
    }

    // Método auxiliar para obter a URL do arquivo de áudio
    _getUrl(instrumento, nota, oitava = '') {
        nota = nota.toLowerCase();
        nota = this.getNomeArquivoAudio(nota);
        const key = `${instrumento}_${nota}${oitava ? '_' + oitava : ''}`;
        return this.acordeUrls.get(key);
    }

    descobrirTom(textoHtml) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = textoHtml;
        const cifrasTag = tempDiv.querySelectorAll('b');
        if (!cifrasTag.length) return '';
        const cifras = Array.from(cifrasTag).map(b => b.innerText.split('/')[0]).filter(c => c);

        return this.musicTheory.descobrirTom(cifras);
    }

    filtrarLetraCifra(texto) {
        if (texto) {
            if (texto.includes('<pre>')) {
                return texto.split('<pre>')[1].split('</pre>')[0].replace(/<\/?[^>]+(>|$)/g, "");
            }
            else {
                return texto;
            }
        }
        return '';
    }

    destacarCifras(texto, tom) {
        const linhas = texto.split('\n');
        let cifraNum = 1;
        const temColchetes = /\[.*?\]/;

        const linhasDestacadas = linhas.map(linha => {
            if (linha) {
                const acordes = linha.trim().split(/\s+/);
                const primeiroAcordePuro = acordes[0].split('(')[0].split('/')[0];
                const segundoAcordePuro = acordes[1]?.split('(')[0].split('/')[0];
                const ehLinhaDeAcordeUnico = acordes.length === 1 && this.musicTheory.notasAcordes.includes(primeiroAcordePuro);
                const ehLinhaDeAcordesConsecutivos = acordes.length >= 2 && this.musicTheory.notasAcordes.includes(primeiroAcordePuro) && this.musicTheory.notasAcordes.includes(segundoAcordePuro);
                const linhDeColcheteseAcordes = temColchetes.test(linha) && acordes.length >= 2 && this.musicTheory.notasAcordes.includes(segundoAcordePuro);

                if (ehLinhaDeAcordeUnico || ehLinhaDeAcordesConsecutivos || linhDeColcheteseAcordes) {
                    let espacos = [''];
                    if (linha.startsWith(' ')) {
                        espacos = linha.match(/\s+/g);
                    } else {
                        espacos = espacos.concat(linha.match(/\s+/g) || []);
                    }
                    const linhaProcessada = acordes.map((palavra, index) => {
                        let acorde = this.processarAcorde(palavra, cifraNum, tom);
                        if (acorde.startsWith('<b'))
                            cifraNum++;

                        return espacos[index] + acorde;
                    }).join('');
                    if (cifraNum > 1)
                        return `<span><b></b>${linhaProcessada}<b></b></span>`;
                    else
                        return `${linhaProcessada}`;
                }
            }
            return linha;
        });

        return `<pre>${linhasDestacadas.join('\n')}</pre>`;
    }

    processarAcorde(palavra, cifraNum, tom) {
        let acorde = palavra;
        let baixo = '';

        if (acorde.includes('/') && !acorde.includes('(')) {
            [acorde, baixo] = acorde.split('/');

            baixo = this.musicTheory.getAcorde(baixo, tom);

            while (!this.musicTheory.notasAcordes.includes(acorde) && acorde) {
                acorde = acorde.slice(0, -1);
            }

            acorde = this.musicTheory.getAcorde(acorde, tom);
            acorde = this.musicTheory.acordesSustenidosBemol.includes(baixo) ? `${acorde}/${baixo}` : palavra;
        } else {
            while (!this.musicTheory.notasAcordes.includes(acorde) && acorde) {
                acorde = acorde.slice(0, -1);
            }

            acorde = this.musicTheory.getAcorde(acorde, tom);
        }

        return this.musicTheory.notasAcordes.includes(acorde.split('/')[0]) ? `<b id="cifra${cifraNum}">${acorde}</b>` : palavra;
    }

    carregarAcordes() {
        const urlsSet = new Set();
        const instrumentos = ['orgao', 'strings'];
        const oitavas = ['grave', 'baixo', ''];
        const notas = ['c', 'c_', 'd', 'd_', 'e', 'f', 'f_', 'g', 'g_', 'a', 'a_', 'b'];

        instrumentos.forEach(instrumento => {
            notas.forEach(nota => {
                oitavas.forEach(oitava => {
                    const key = `${instrumento}_${nota}${oitava ? '_' + oitava : ''}`;
                    const url = `${this.audioPath}${instrumento.charAt(0).toUpperCase() + instrumento.slice(1)}/${key}.ogg`;
                    this.acordeUrls.set(key, url);
                    urlsSet.add(url);
                });
            });
        });

        const allUniqueUrls = Array.from(urlsSet);

        // 1. Registra um grupo dummy no AudioContextManager com TODAS as URLs (para pré-carregamento).
        // Isso garante que todos os buffers de notas estejam em cache.
        this.audioContextManager.addAcorde('__PRELOAD_ALL_KEYS__', allUniqueUrls);

        // 2. Inicia o pré-carregamento.
        this.audioContextManager.preloadAll().catch(error => {
            console.error("Falha ao pré-carregar todos os áudios:", error);
        });
    }

    transposeCifra() {
        if (this.elements.tomSelect.value) {
            const novoTom = this.elements.tomSelect.value;
            this.transporCifraNoIframe(novoTom);
            this.tomAtual = novoTom;

            this.preencherSelect(novoTom);

            if (this.indiceAcorde > 0) {
                this.indiceAcorde--;
            }

            if (!this.parado && this.acordeTocando) {
                this.pararAcorde();
                this.avancarCifra();
            }
        }
    }

    transporTom() {
        const novoTom = this.elements.tomSelect.value;
        const acordeButtons = document.querySelectorAll('button[data-action="acorde"]');

        const steps = this.musicTheory.tonsMaiores.indexOf(novoTom) - this.musicTheory.tonsMaiores.indexOf(this.tomAtual);

        acordeButtons.forEach(acordeButton => {
            const antesAcorde = acordeButton.value;
            const antesAcordeSoNota = antesAcorde.replace('m', '').replace('°', '');

            let novoAcorde = this.musicTheory.transposeAcorde(antesAcordeSoNota, steps, novoTom);

            novoAcorde = antesAcorde.replace(antesAcordeSoNota, novoAcorde);
            acordeButton.value = novoAcorde;
            acordeButton.innerHTML = novoAcorde;
        });

        this.tomAtual = novoTom;

        if (this.indiceAcorde > 0) {
            this.indiceAcorde--;
        }
    }

    transporCifraNoIframe(novoTom) {
        let tons;
        if (this.musicTheory.tonsMaiores.includes(novoTom)) {
            tons = this.musicTheory.tonsMaiores;
        } else if (this.musicTheory.tonsMenores.includes(novoTom)) {
            tons = this.musicTheory.tonsMenores;
        }

        const steps = tons.indexOf(novoTom) - tons.indexOf(this.tomAtual);
        const cifras = this.elements.iframeCifra.contentDocument.querySelectorAll('b');

        for (const cifra of cifras) {
            let acorde = cifra.innerText;
            if (acorde) {
                const partes = acorde.split('/');
                let acordePrincipal = partes[0];

                // Usa as propriedades de MusicTheory
                while (!this.musicTheory.acordesSustenidos.includes(acordePrincipal) && !this.musicTheory.acordesBemol.includes(acordePrincipal) && acordePrincipal) {
                    acordePrincipal = this.musicTheory.acordesMap[acordePrincipal] || acordePrincipal.slice(0, -1);
                }

                // Delega a transposição
                let novoTomAcorde = this.musicTheory.transposeAcorde(acordePrincipal, steps, novoTom);
                let novoAcorde = partes[0].replace(acordePrincipal, novoTomAcorde);

                if (partes[1]) {
                    let acordeBaixo = partes[1];
                    // Usa as propriedades de MusicTheory
                    while (!this.musicTheory.acordesSustenidos.includes(acordeBaixo) && !this.musicTheory.acordesBemol.includes(acordeBaixo) && acordeBaixo) {
                        acordeBaixo = this.musicTheory.acordesMap[acordeBaixo] || acordeBaixo.slice(0, -1);
                    }
                    // Delega a transposição
                    novoTomAcorde = this.musicTheory.transposeAcorde(acordeBaixo, steps, novoTom);
                    novoAcorde = `${novoAcorde}/${partes[1].replace(acordeBaixo, novoTomAcorde)}`;
                }

                cifra.innerText = cifra.innerText.replace(acorde, novoAcorde);
            }
        }
    }

    tocarAcorde(acorde) {
        // CORREÇÃO ESSENCIAL: REMOVER A CHAMADA DE PARADA AQUI
        // this.pararAcorde(); // <-- REMOVIDO! O AudioContextManager fará o crossfade.

        acorde = this.musicTheory.getAcorde(acorde, this.tomAtual);
        const acordeKey = acorde;

        // Se for o mesmo acorde, evita re-processar e re-tocar
        if (acordeKey === this.acordeTocando) return;

        this.acordeTocando = acordeKey; // Atualiza o acorde tocando ANTES de chamar o play

        this.desabilitarSelectSaves();

        // 1. Coletar as URLs de áudio necessárias para este acorde
        const urls = new Set();
        let [notaPrincipal, baixo] = acorde.split('/');
        let notas = this.musicTheory.getAcordeNotas(notaPrincipal);
        if (!notas) return;

        baixo = baixo ? baixo.replace('#', '_') : notas[0].replace('#', '_');

        // Adiciona Baixo (Grave)
        urls.add(this._getUrl('orgao', baixo, 'grave'));
        if (!this.elements.notesButton.classList.contains('notaSolo')) {
            urls.add(this._getUrl('strings', baixo, 'grave'));
        }

        // Adiciona Notas do Acorde (Baixo)
        notas.forEach(nota => {
            const notaKey = nota.replace('#', '_');

            urls.add(this._getUrl('orgao', notaKey, 'baixo'));
            if (!this.elements.notesButton.classList.contains('notaSolo')) {
                urls.add(this._getUrl('strings', notaKey, 'baixo'));
            }

            // Adiciona Notas do Acorde (Padrão, se botão "notes" estiver pressionado)
            if (this.elements.notesButton.classList.contains('pressed')) {
                urls.add(this._getUrl('orgao', notaKey));
                if (!this.elements.notesButton.classList.contains('notaSolo')) {
                    urls.add(this._getUrl('strings', notaKey));
                }
            }
        });

        const uniqueUrls = Array.from(urls).filter(url => url);

        // 2. Configurar o Acorde no AudioContextManager (Cria o GainNode se ainda não existir)
        // Isso é crucial, pois o play() precisa do playerConfigs[acordeKey].gainNode
        if (!this.audioContextManager.playerConfigs.has(acordeKey)) {
            this.audioContextManager.addAcorde(acordeKey, uniqueUrls);
        }

        // 3. Iniciar a reprodução. O AudioContextManager.play() irá parar o anterior
        // e iniciar o novo com crossfade, usando os buffers já carregados.
        this.audioContextManager.play(acordeKey);
    }

    desabilitarSelectSaves() {
        this.elements.savesSelect.disabled = true;
        this.elements.addButton.disabled = true;
    }

    habilitarSelectSaves() {
        this.elements.savesSelect.disabled = false;
        this.elements.addButton.disabled = false;
    }

    async pararAcorde() {
        this.habilitarSelectSaves();

        // Garantir que a parada use a chave correta e seja uma parada TOTAL
        if (this.acordeTocando) {
            // isTotalStop = true irá suspender o AudioContext
            //this.audioContextManager.stop(this.acordeTocando, true);

            await this.audioContextManager.stop();
        }
        // NÃO RESETAMOS this.acordeTocando aqui, pois AudioContextManager.stop() fará isso internamente (setando currentAcordeKey = null)
        // e ele será resetado em pararReproducao() de qualquer forma.
    }

    inversaoDeAcorde(acorde, baixo) {
        return this.musicTheory.inversaoDeAcorde(acorde, baixo);
    }

    removeCifras(musica) {
        let linhasFinal = [];
        const conteudoPre = musica.split('<pre>')[1]?.split('</pre>')[0];

        if (conteudoPre) {
            let linhas = conteudoPre.split('\n');

            linhas.forEach(linha => {
                if (!linha.includes('span'))
                    linhasFinal.push(linha);
            });
        }

        let final = linhasFinal.join('\n');

        this.elements.iframeCifra.contentDocument.body.innerText = final;
        this.elements.iframeCifra.contentDocument.body.style.fontSize = '15pt';
        this.elements.iframeCifra.contentDocument.body.style.fontFamily = "'Roboto', sans-serif";
    }

    addEventCifrasIframe(frame) {
        const elements = frame.contentDocument.getElementsByTagName("b");

        for (let i = 0; i < elements.length; i++) {
            elements[i].addEventListener("click", (e) => {
                this.removerClasseCifraSelecionada(frame.contentDocument, e.target);

                e.target.classList.add('cifraSelecionada');
                e.target.scrollIntoView({ behavior: 'smooth' });

                this.tocarCifraManualmente(e.target);
                parent.focus(); // Mantém o foco fora do iframe para o teclado físico funcionar
            });
        }
    }

    iniciarReproducao() {
        if (!this.parado && this.acordeTocando) {
            this.pararAcorde();
        }
        this.avancarCifra();
    }

    alternarNotas() {
        if (this.indiceAcorde > 0) {
            this.indiceAcorde--;
        }

        if (!this.parado && this.acordeTocando) {
            this.pararAcorde();
            this.avancarCifra();
        }
    }

    pararReproducao() {
        this.pararAcorde();
        const frameContent = this.elements.iframeCifra.contentDocument;
        const cifraElems = frameContent.getElementsByClassName('cifraSelecionada');

        Array.from(cifraElems).forEach(elemento => {
            elemento.classList.remove('cifraSelecionada');
        });


        const acordeButtons = document.querySelectorAll('button[data-action="acorde"]');
        acordeButtons.forEach(acordeButton => {
            acordeButton.classList.remove('pressed');
        });

        if (this.indiceAcorde > 0) {
            this.indiceAcorde--;
        }

        this.parado = true;
        this.acordeTocando = '';
    }

    avancarCifra(inicioLinha) {
        const frameContent = this.elements.iframeCifra.contentDocument;
        const elements_b = frameContent.getElementsByTagName('b');

        this.parado = false;

        if (this.indiceAcorde < elements_b.length) {
            this.removerClasseCifraSelecionada(frameContent);

            const cifraElem = elements_b[this.indiceAcorde];
            if (cifraElem) {
                const cifra = cifraElem.innerHTML.trim();
                const proximacifra = cifraElem.nextElementSibling?.innerHTML.trim() ?? '';

                if (cifraElem.nextElementSibling && !proximacifra) {
                    cifraElem.classList.add('cifraSelecionada');
                    cifraElem.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
                    this.tocarAcorde(cifra);
                    this.indiceAcorde++;
                }
                else if (!cifra) {
                    cifraElem.scrollIntoView({ behavior: 'smooth' });
                    this.indiceAcorde++;
                    this.avancarCifra(true);
                }
                else {
                    this.tocarAcorde(cifra);

                    cifraElem.classList.add('cifraSelecionada');
                    if (!inicioLinha)
                        cifraElem.scrollIntoView({ behavior: 'smooth' });

                    this.indiceAcorde++;
                }
            }
        }
    }

    getNomeArquivoAudio(nota) {
        return this.acordeMap[nota] || nota;
    }

    // REMOVIDO: adicionarSomAoGrupo (substituído por _getUrl)

    removerClasseCifraSelecionada(iframeDoc, excecao = null) {
        const elementos = iframeDoc.querySelectorAll('.cifraSelecionada');
        elementos.forEach(elemento => {
            if (elemento !== excecao) {
                elemento.classList.remove('cifraSelecionada');
            }
        });
    }

    mudarTempoCompasso(bpm) {
        const tempo = parseInt(bpm.value);
        const bpmValor = 60000 / tempo;
        this.elements.bpmValue.textContent = tempo;

        // Define a duração da animação nos botões de play e stop
        this.elements.playButton.style.animationDuration = `${bpmValor}ms`;
        this.elements.stopButton.style.animationDuration = `${bpmValor}ms`;

        // Lógica de ajuste de velocidade de reprodução REMOVIDA, pois não era implementada no Pizzicato
        // if (this.acordeGroup) {
        //     // ... (lógica para ajustar a velocidade com Pizzicato) ...
        // }
    }

    preencherSelect(tom) {
        this.elements.tomSelect.innerHTML = '<option value="">Letra</option>';

        const tons = this.tonsMaiores.includes(tom) ? this.tonsMaiores : this.tonsMenores.includes(tom) ? this.tonsMenores : [];

        tons.forEach(t => {
            const option = document.createElement('option');
            option.value = t;
            option.text = t;
            this.elements.tomSelect.appendChild(option);
        });

        this.elements.tomSelect.value = tom;
        this.tomAtual = tom;
    }

    tocarCifraManualmente(cifraElem) {
        const elements_b = this.elements.iframeCifra.contentDocument.getElementsByTagName("b");
        const cifraid = parseInt(cifraElem.id.split('cifra')[1]);
        this.indiceAcorde = Array.from(elements_b).findIndex(b => parseInt(b.id.split('cifra')[1]) === cifraid);

        if (!this.parado && this.acordeTocando) {
            this.iniciarReproducao();
        }
    }
}