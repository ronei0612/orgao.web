class CifraPlayer {
    constructor(elements) {
        this.elements = elements;
        this.acordeGroup = null;
        this.parado = true;
        this.acordeTocando = '';
        this.indiceAcorde = 0;
        this.tomAtual = 'C';
        this.notasAcordesJson = JSON.parse('{"A#":["a#","d","f"],"A#4":["a#","d#","f"],"A#5+":["a#","d","f#"],"A#6":["a#","d","f","g"],"A#7":["a#","d","f","g#"],"A#7M":["a#","d","f","a"],"A#9":["a#","d","f","c"],"A#m":["a#","c#","f"],"A#m5+":["a#","c#","f#"],"A#m6":["a#","c#","f","g"],"A#m7":["a#","c#","f","g#"],"A#m7M":["a#","c#","f","a"],"A#°":["a#","c#","e"],"A#°7":["a#","c#","e","g#"],"A":["a","c#","e"],"A4":["a","d","e"],"A5+":["a","c#","f"],"A6":["a","c#","e","f#"],"A7":["a","c#","e","g"],"A7M":["a","c#","e","g#"],"A9":["a","c#","e","b"],"Am":["a","c","e"],"Am5+":["a","c","f"],"Am6":["a","c","e","f#"],"Am7":["a","c","e","g"],"Am7M":["a","c","e","g#"],"A°":["a","c","d#"],"A°7":["a","c","d#","g"],"Ab":["g#","c","d#"],"Ab4":["g#","c#","d#"],"Ab5+":["g#","c","e"],"Ab6":["g#","c","d#","f"],"Ab7":["g#","c","d#","f#"],"Ab7M":["g#","c","d#","g"],"Ab9":["g#","c","d#","a#"],"Abm":["g#","b","d#"],"Abm5+":["g#","b","e"],"Abm6":["g#","b","d#","f"],"Abm7":["g#","b","d#","f#"],"Abm7M":["g#","b","d#","g"],"Ab°":["g#","b","d"],"Ab°7":["g#","b","d","f#"],"B":["b","d#","f#"],"B4":["b","e","f#"],"B5+":["b","d#","g"],"B6":["b","d#","f#","g#"],"B7":["b","d#","f#","a"],"B7M":["b","d#","f#","a#"],"B9":["b","d#","f#","c#"],"Bm":["b","d","f#"],"Bm5+":["b","d","g"],"Bm6":["b","d","f#","g#"],"Bm7":["b","d","f#","a"],"Bm7M":["b","d","f#","a#"],"B°":["b","d","f"],"B°7":["b","d","f","a"],"Bb":["a#","d","f"],"Bb4":["a#","d#","f"],"Bb5+":["a#","d","f#"],"Bb6":["a#","d","f","g"],"Bb7":["a#","d","f","g#"],"Bb7M":["a#","d","f","a"],"Bb9":["a#","d","f","c"],"Bbm":["a#","c#","f"],"Bbm5+":["a#","c#","f#"],"Bbm6":["a#","c#","f","g"],"Bbm7":["a#","c#","f","g#"],"Bbm7M":["a#","c#","f","a"],"Bb°":["a#","c#","e"],"Bb°7":["a#","c#","e","g#"],"Cb":["b","d#","f#"],"Cb4":["b","e","f#"],"Cb5+":["b","d#","g"],"Cb6":["b","d#","f#","g#"],"Cb7":["b","d#","f#","a"],"Cb7M":["b","d#","f#","a#"],"Cb9":["b","d#","f#","c#"],"Cbm":["b","d","f#"],"Cbm5+":["b","d","g"],"Cbm6":["b","d","f#","g#"],"Cbm7":["b","d","f#","a"],"Cbm7M":["b","d","f#","a#"],"Cb°":["b","d","f"],"Cb°7":["b","d","f","a"],"C#":["c#","f","g#"],"C#4":["c#","f#","g#"],"C#5+":["c#","f","a"],"C#6":["c#","f","g#","a#"],"C#7":["c#","f","g#","b"],"C#7M":["c#","f","g#","c"],"C#9":["c#","f","g#","d#"],"C#m":["c#","e","g#"],"C#m5+":["c#","e","a"],"C#m6":["c#","e","g#","a#"],"C#m7":["c#","e","g#","b"],"C#m7M":["c#","e","g#","c"],"C#°":["c#","e","g"],"C#°7":["c#","e","g","b"],"C":["c","e","g"],"C4":["c","f","g"],"C5+":["c","e","g#"],"C6":["c","e","g","a"],"C7":["c","e","g","a#"],"C7M":["c","e","g","b"],"C9":["c","e","g","d"],"Cm":["c","d#","g"],"Cm5+":["c","d#","g#"],"Cm6":["c","d#","g","a"],"Cm7":["c","d#","g","a#"],"Cm7M":["c","d#","g","b"],"C°":["c","d#","f#"],"C°7":["c","d#","f#","a#"],"B#":["c","e","g"],"B#4":["c","f","g"],"B#5+":["c","e","g#"],"B#6":["c","e","g","a"],"B#7":["c","e","g","a#"],"B#7M":["c","e","g","b"],"B#9":["c","e","g","d"],"B#m":["c","d#","g"],"B#m5+":["c","d#","g#"],"B#m6":["c","d#","g","a"],"B#m7":["c","d#","g","a#"],"B#m7M":["c","d#","g","b"],"B#°":["c","d#","f#"],"B#°7":["c","d#","f#","a#"],"D":["d","f#","a"],"D#":["d#","g","a#"],"D#4":["d#","g#","a#"],"D#5+":["d#","g","b"],"D#6":["d#","g","a#","c"],"D#7":["d#","g","a#","c#"],"D#7M":["d#","g","a#","d"],"D#9":["d#","g","a#","f"],"D#m":["d#","f#","a#"],"D#m5+":["d#","f#","b"],"D#m6":["d#","f#","a#","c"],"D#m7":["d#","f#","a#","c#"],"D#m7M":["d#","f#","a#","d"],"D#°":["d#","f#","a"],"D#°7":["d#","f#","a","c#"],"D4":["d","g","a"],"D5+":["d","f#","a#"],"D6":["d","f#","a","b"],"D7":["d","f#","a","c"],"D7M":["d","f#","a","c#"],"D9":["d","f#","a","e"],"Db":["c#","f","g#"],"Db4":["c#","f#","g#"],"Db5+":["c#","f","a"],"Db6":["c#","f","g#","a#"],"Db7":["c#","f","g#","b"],"Db7M":["c#","f","g#","c"],"Db9":["c#","f","g#","d#"],"Dbm":["c#","e","g#"],"Dbm5+":["c#","e","a"],"Dbm6":["c#","e","g#","a#"],"Dbm7":["c#","e","g#","b"],"Dbm7M":["c#","e","g#","c"],"Db°":["c#","e","g"],"Db°7":["c#","e","g","b"],"Dm":["d","f","a"],"Dm5+":["d","f","a#"],"Dm6":["d","f","a","b"],"Dm7":["d","f","a","c"],"Dm7M":["d","f","a","c#"],"D°":["d","f","g#"],"D°7":["d","f","g#","c"],"Eb":["d#","g","a#"],"Eb4":["d#","g#","a#"],"Eb5+":["d#","g","b"],"Eb6":["d#","g","a#","c"],"Eb7":["d#","g","a#","c#"],"Eb7M":["d#","g","a#","d"],"Eb9":["d#","g","a#","f"],"Ebm":["d#","f#","a#"],"Ebm5+":["d#","f#","b"],"Ebm6":["d#","f#","a#","c"],"Ebm7":["d#","f#","a#","c#"],"Ebm7M":["d#","f#","a#","d"],"Eb°":["d#","f#","a"],"Eb°7":["d#","f#","a","c#"],"E":["e","g#","b"],"E4":["e","a","b"],"E5+":["e","g#","c"],"E6":["e","g#","b","c#"],"E7":["e","g#","b","d"],"E7M":["e","g#","b","d#"],"E9":["e","g#","b","f#"],"Em":["e","g","b"],"Em5+":["e","g","c"],"Em6":["e","g","b","c#"],"Em7":["e","g","b","d"],"Em7M":["e","g","b","d#"],"E°":["e","g","a#"],"E°7":["e","g","a#","d"],"Fb":["e","g#","b"],"Fb4":["e","a","b"],"Fb5+":["e","g#","c"],"Fb6":["e","g#","b","c#"],"Fb7":["e","g#","b","d"],"Fb7M":["e","g#","b","d#"],"Fb9":["e","g#","b","f#"],"Fbm":["e","g","b"],"Fbm5+":["e","g","c"],"Fbm6":["e","g","b","c#"],"Fbm7":["e","g","b","d"],"Fbm7M":["e","g","b","d#"],"Fb°":["e","g","a#"],"Fb°7":["e","g","a#","d"],"F#":["f#","a#","c#"],"F#4":["f#","b","c#"],"F#5+":["f#","a#","d"],"F#6":["f#","a#","c#","d#"],"F#7":["f#","a#","c#","e"],"F#7M":["f#","a#","c#","f"],"F#9":["f#","a#","c#","g#"],"F#m":["f#","a","c#"],"F#m5+":["f#","a","d"],"F#m6":["f#","a","c#","d#"],"F#m7":["f#","a","c#","e"],"F#m7M":["f#","a","c#","f"],"F#°":["f#","a","c"],"F#°7":["f#","a","c","e"],"E#":["f","a","c"],"E#4":["f","a#","c"],"E#5+":["f","a","c#"],"E#6":["f","a","c","d"],"E#7":["f","a","c","d#"],"E#7M":["f","a","c","e"],"E#9":["f","a","c","g"],"E#m":["f","g#","c"],"E#m5+":["f","g#","c#"],"E#m6":["f","g#","c","d"],"E#m7":["f","g#","c","d#"],"E#m7M":["f","g#","c","e"],"E#°":["f","g#","b"],"E#°7":["f","g#","b","d#"],"F":["f","a","c"],"F4":["f","a#","c"],"F5+":["f","a","c#"],"F6":["f","a","c","d"],"F7":["f","a","c","d#"],"F7M":["f","a","c","e"],"F9":["f","a","c","g"],"Fm":["f","g#","c"],"Fm5+":["f","g#","c#"],"Fm6":["f","g#","c","d"],"Fm7":["f","g#","c","d#"],"Fm7M":["f","g#","c","e"],"F°":["f","g#","b"],"F°7":["f","g#","b","d#"],"G":["g","b","d"],"G#":["g#","c","d#"],"G#4":["g#","c#","d#"],"G#5+":["g#","c","e"],"G#6":["g#","c","d#","f"],"G#7":["g#","c","d#","f#"],"G#7M":["g#","c","d#","g"],"G#9":["g#","c","d#","a#"],"G#m":["g#","b","d#"],"G#m5+":["g#","b","e"],"G#m6":["g#","b","d#","f"],"G#m7":["g#","b","d#","f#"],"G#m7M":["g#","b","d#","g"],"G#°":["g#","b","d"],"G#°7":["g#","b","d","f#"],"G4":["g","c","d"],"G5+":["g","b","d#"],"G6":["g","b","d","e"],"G7":["g","b","d","f"],"G7M":["g","b","d","f#"],"G9":["g","b","d","a"],"Gb":["f#","a#","c#"],"Gb4":["f#","b","c#"],"Gb5+":["f#","a#","d"],"Gb6":["f#","a#","c#","d#"],"Gb7":["f#","a#","c#","e"],"Gb7M":["f#","a#","c#","f"],"Gb9":["f#","a#","c#","g#"],"Gbm":["f#","a","c#"],"Gbm5+":["f#","a","d"],"Gbm6":["f#","a","c#","d#"],"Gbm7":["f#","a","c#","e"],"Gbm7M":["f#","a","c#","f"],"Gb°":["f#","a","c"],"Gb°7":["f#","a","c","e"],"Gm":["g","a#","d"],"Gm5+":["g","a#","d#"],"Gm6":["g","a#","d","e"],"Gm7":["g","a#","d","f"],"Gm7M":["g","a#","d","f#"],"G°":["g","a#","c#"],"G°7":["g","a#","c#","f"]}');
        this.notasAcordes = Object.keys(this.notasAcordesJson);
        this.acordeMap = {
            'c#': 'c_',
            'd#': 'd_',
            'e#': 'e_',
            'f#': 'f_',
            'g#': 'g_',
            'a#': 'a_',
            'b#': 'b_'
        };
        this.acordes = {};
        this.tonsMaiores = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        //this.tonsMaiores = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
        this.tonsMenores = this.tonsMaiores.map(tom => tom + 'm');
        this.acordesSustenidos = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        this.acordesBemol = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        this.acordesSustenidosBemol = this.acordesSustenidos.concat(this.acordesBemol);
        this.acordesMap = {
            'B#': 'C',
            'E#': 'F',
            'Cb': 'B',
            'Fb': 'E',
            'Bb': 'A#',
            'Db': 'C#',
            'Eb': 'D#',
            'Gb': 'F#',
            'Ab': 'G#'
        };
        this.acordesSustenidoMap = {
            'Bb': 'A#',
            'Db': 'C#',
            'Eb': 'D#',
            'Gb': 'F#',
            'Ab': 'G#'
        };
        this.acordesBemolMap = {
            'A#': 'Bb',
            'C#': 'Db',
            'D#': 'Eb',
            'F#': 'Gb',
            'G#': 'Ab'
        };
        this.audioPath = location.origin.includes('file:') ? 'https://roneicostasoares.com.br/orgao.web/assets/audio/' : './assets/audio/';
        this.carregarAcordes();
    }

    destacarCifras(texto, tom) {
        const linhas = texto.split('\n');
        let cifraNum = 1;
        const temPalavra = /[a-zA-Z]{4,}/;
        const temColchetes = /\[.*?\]/;
    
        const linhasDestacadas = linhas.map(linha => {
            //if (linha && ((!temLetrasNaoCifra.test(linha) && !temPalavra.test(linha)) || temColchetes.test(linha))) {
            //if (linha && (this.notasAcordes.includes(linha))) {// || !temColchetes.test(linha))) {
            if (linha) {
                const acordes = linha.trim().split(/\s+/);
                const primeiroAcordePuro = acordes[0].split('(')[0].split('/')[0];
                const segundoAcordePuro = acordes[1]?.split('(')[0].split('/')[0];
                const ehLinhaDeAcordeUnico = acordes.length === 1 && this.notasAcordes.includes(primeiroAcordePuro);
                const ehLinhaDeAcordesConsecutivos = acordes.length >= 2 && this.notasAcordes.includes(primeiroAcordePuro) && this.notasAcordes.includes(segundoAcordePuro);
                const linhDeColcheteseAcordes = temColchetes.test(linha) && acordes.length >= 2 && this.notasAcordes.includes(segundoAcordePuro);

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
    
        return `
            <style>
                .cifraSelecionada {
                    background-color: #DAA520;
                }
                pre {
                    font-size: 12pt;
                    font-family: Consolas, 'Courier New', Courier, monospace;
                }
                body {
                    -webkit-user-select: none; /* Safari */
                    -moz-user-select: none; /* Firefox */
                    -ms-user-select: none; /* Internet Explorer/Edge */
                    user-select: none; /* Padrão */
                    -webkit-touch-callout: none; /* Safari */
                    -webkit-user-drag: none; /* Safari */
                    -khtml-user-drag: none; /* Konqueror HTML */
                    -khtml-user-select: none; /* Konqueror HTML */
                    -moz-user-drag: none; /* Firefox */
                    -ms-user-drag: none; /* Internet Explorer/Edge */
                    -o-user-drag: none; /* Opera */
                }
            </style>
            <pre>${linhasDestacadas.join('\n')}</pre>
        `;
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
    
    processarAcorde(palavra, cifraNum, tom) {
        let acorde = palavra;
        let baixo = '';
    
        if (acorde.includes('/') && !acorde.includes('(')) {
            [acorde, baixo] = acorde.split('/');
            baixo = this.getAcorde(baixo, tom);
    
            while (!this.notasAcordes.includes(acorde) && acorde) {
                acorde = acorde.slice(0, -1);
            }
            acorde = this.getAcorde(acorde, tom);
            acorde = this.acordesSustenidosBemol.includes(baixo) ? `${acorde}/${baixo}` : palavra;
        } else {
            while (!this.notasAcordes.includes(acorde) && acorde) {
                acorde = acorde.slice(0, -1);
            }
            acorde = this.getAcorde(acorde, tom);
        }
    
        return this.notasAcordes.includes(acorde.split('/')[0]) ? `<b id="cifra${cifraNum}">${acorde}</b>` : palavra;
    }

    getAcorde(acorde, tom) {
        if (tom === 'C#' || tom === 'D' || tom === 'E' || tom === 'F#' || tom === 'G' || tom === 'A' || tom === 'B')
            return this.acordesSustenidoMap[acorde] || acorde;
        else if (tom === 'C' || tom === 'D#' || tom === 'Eb' || tom === 'F' || tom === 'G#' || tom === 'Ab' || tom === 'A#' || tom === 'Bb')
            return this.acordesBemolMap[acorde] || acorde;
        else
            return this.acordesMap[acorde] || acorde;
    }

    carregarAcordes() {
        const instrumentos = ['orgao', 'strings'];
        const oitavas = ['grave', 'baixo', ''];
        const notas = ['c', 'c_', 'd', 'd_', 'e', 'f', 'f_', 'g', 'g_', 'a', 'a_', 'b'];

        instrumentos.forEach(instrumento => {
            notas.forEach(nota => {
                oitavas.forEach(oitava => {
                    const key = `${instrumento}_${nota}${oitava ? '_' + oitava : ''}`;
                    this.acordes[key] = new Pizzicato.Sound({
                        source: 'file',
                        options: {
                            path: `${this.audioPath}${instrumento.charAt(0).toUpperCase() + instrumento.slice(1)}/${key}.ogg`,
                            loop: true,
                            release: 0.5,
                            attack: 0.1
                        }
                    });
                });
            });
        });
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

    transposeCifra() {
        if (this.elements.tomSelect.value) {
            const novoTom = this.elements.tomSelect.value;
            this.transporCifraNoIframe(novoTom);
            this.tomAtual = novoTom;

            const cifra = this.elements.iframeCifra.contentDocument.body.innerHTML;
            uiController.exibirTextoCifrasCarregado(novoTom, cifra);

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
        const steps = this.tonsMaiores.indexOf(novoTom) - this.tonsMaiores.indexOf(this.tomAtual);

        acordeButtons.forEach(acordeButton => {
            const antesAcorde = acordeButton.value;
            const antesAcordeSoNota = antesAcorde.replace('m', '');
            let novoAcorde = this.transposeAcorde(antesAcordeSoNota, steps);
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
        if (this.tonsMaiores.includes(novoTom)) {
            tons = this.tonsMaiores;
        } else if (this.tonsMenores.includes(novoTom)) {
            tons = this.tonsMenores;
        }
    
        const steps = tons.indexOf(novoTom) - tons.indexOf(this.tomAtual);
        const cifras = this.elements.iframeCifra.contentDocument.querySelectorAll('b');
    
        for (const cifra of cifras) {
            let acorde = cifra.innerText;
            if (acorde) {
                const partes = acorde.split('/');
                let acordePrincipal = partes[0];
                while (!this.acordesSustenidos.includes(acordePrincipal) && !this.acordesBemol.includes(acordePrincipal) && acordePrincipal) {
                    acordePrincipal = this.acordesMap[acordePrincipal] || acordePrincipal.slice(0, -1);
                }
                let novoTomAcorde = this.transposeAcorde(acordePrincipal, steps);
                let novoAcorde = partes[0].replace(acordePrincipal, novoTomAcorde);

                if (partes[1]) {
                    let acordeBaixo = partes[1];
                    while (!this.acordesSustenidos.includes(acordeBaixo) && !this.acordesBemol.includes(acordeBaixo) && acordeBaixo) {
                        acordeBaixo = this.acordesMap[acordeBaixo] || acordeBaixo.slice(0, -1);
                    }
                    novoTomAcorde = this.transposeAcorde(acordeBaixo, steps);
                    novoAcorde = `${novoAcorde}/${partes[1].replace(acordeBaixo, novoTomAcorde)}`;
                }
                
                cifra.innerText = cifra.innerText.replace(acorde, novoAcorde);
            }
        }
    }
    
    transposeAcorde(acorde, steps) {
        let tons = this.acordesSustenidos.includes(acorde) ? this.acordesSustenidos : this.acordesBemol;
        let index = tons.indexOf(acorde);
        let novoIndex = (index + steps + tons.length) % tons.length;
        let novoTom = this.getAcorde(tons[novoIndex], this.elements.tomSelect.value);

        return novoTom;
    }    

    addEventCifrasIframe(frame) {
        const elements = frame.contentDocument.getElementsByTagName("b");
    
        for (let i = 0; i < elements.length; i++) {
            elements[i].addEventListener("click", (e) => {
                this.removerClasseCifraSelecionada(frame.contentDocument, e.target);
    
                e.target.classList.add('cifraSelecionada');
                e.target.scrollIntoView({behavior: 'smooth'});
    
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
                    cifraElem.nextElementSibling.scrollIntoView({behavior: 'smooth'});
                    this.tocarAcorde(cifra);
                    this.indiceAcorde++;
                }
                else if (!cifra) {
                    cifraElem.scrollIntoView({behavior: 'smooth'});
                    this.indiceAcorde++;
                    this.avancarCifra(true);
                }
                else {
                    this.tocarAcorde(cifra);

                    cifraElem.classList.add('cifraSelecionada');
                    if (!inicioLinha)
                        cifraElem.scrollIntoView({behavior: 'smooth'});

                    this.indiceAcorde++;
                }
            }
        }
    }

    tocarAcorde(acorde) {
        this.pararAcorde();
        acorde = this.getAcorde(acorde);
        this.acordeTocando = acorde;
        uiController.desabilitarSelectSaves();
    
        if (!this.acordeGroup) {  
            this.acordeGroup = new Pizzicato.Group();
            this.acordeGroup.attack = 0.1;
        }
    
        let [notaPrincipal, baixo] = acorde.split('/');
        let notas = this.notasAcordesJson[notaPrincipal];
        if (!notas) return;

	//if (baixo && notas.includes(baixo.toLowerCase())) {
            //notas = this.inversaoDeAcorde(notas, baixo.toLowerCase());
	//}
    
        baixo = baixo ? baixo.replace('#', '_') : notas[0].replace('#', '_');
    
        this.adicionarSomAoGrupo('orgao', baixo, 'grave');
        if (!this.elements.notesButton.classList.contains('notaSolo'))
            this.adicionarSomAoGrupo('strings', baixo, 'grave', 0.9);
    
        notas.forEach(nota => {
            this.adicionarSomAoGrupo('orgao', nota.replace('#', '_'), 'baixo');
            if (!this.elements.notesButton.classList.contains('notaSolo'))
                this.adicionarSomAoGrupo('strings', nota.replace('#', '_'), 'baixo', 0.9);
    
            if (this.elements.notesButton.classList.contains('pressed')) {
                this.adicionarSomAoGrupo('orgao', nota.replace('#', '_', 0.5));
                if (!this.elements.notesButton.classList.contains('notaSolo'))
                    this.adicionarSomAoGrupo('strings', nota.replace('#', '_'));
            }
        });
    
        setTimeout(() => {
            if (!this.parado && this.acordeTocando) {
                try {
                    this.acordeGroup.play();
                } catch { }
            }
        }, 60);
    }    

    getNomeArquivoAudio(nota) {
        return this.acordeMap[nota] || nota;
    }

    adicionarSomAoGrupo(instrumento, nota, oitava = '', volume) {
        nota = nota.toLowerCase();
        nota = this.getNomeArquivoAudio(nota);
        const key = `${instrumento}_${nota}${oitava ? '_' + oitava : ''}`;
        if (this.acordes[key]) {
            if (volume) {
                this.acordes[key].volume = volume;
            }
            this.acordeGroup.addSound(this.acordes[key]);
        }
    }

    pararAcorde() {
        uiController.habilitarSelectSaves();
        if (this.acordeGroup) {
            this.acordeGroup.stop();

            const sons = this.acordeGroup.sounds.length;
            if (sons === 0) return;
            for (let i = sons - 1; i > -1; i--) {
                this.acordeGroup.removeSound(this.acordeGroup.sounds[i]);
            }
        }
    }

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

        if (this.acordeGroup) {
            // Ajusta a velocidade de reprodução do acorde atual (se houver)
            // ... (lógica para ajustar a velocidade com Pizzicato) ...
        }
    }

    inversaoDeAcorde(acorde, baixo) {
        const index = acorde.indexOf(baixo);
        if (index === -1) return acorde;
        
        return acorde.slice(index).concat(acorde.slice(0, index));
    }
}

class UIController {
    constructor(elements) {
        this.elements = elements;
    }

    exibirBotoesCifras() {
        this.elements.notesButton.classList.remove('d-none');
        this.elements.playButton.classList.remove('d-none');
        this.elements.nextButton.classList.remove('d-none');
        this.elements.prevButton.classList.remove('d-none');
        this.esconderBotoesAcordes();
    }

    esconderBotoesAcordes() {
        this.elements.acorde1.classList.add('d-none');
        this.elements.acorde2.classList.add('d-none');
        this.elements.acorde3.classList.add('d-none');
        this.elements.acorde4.classList.add('d-none');
        this.elements.acorde5.classList.add('d-none');
        this.elements.acorde6.classList.add('d-none');
        this.elements.acorde7.classList.add('d-none');
        this.elements.acorde8.classList.add('d-none');
        this.elements.acorde9.classList.add('d-none');
        this.elements.acorde10.classList.add('d-none');
        this.elements.acorde11.classList.add('d-none');
    }

    exibirBotoesAcordes() {
        this.atualizarBotoesNavegacao('centralizado');
        this.exibirBotoesTom();
        this.elements.notesButton.classList.remove('d-none');
        this.elements.playButton.classList.add('d-none');
        this.elements.nextButton.classList.add('d-none');
        this.elements.prevButton.classList.add('d-none');

        this.elements.acorde1.classList.remove('d-none');
        this.elements.acorde2.classList.remove('d-none');
        this.elements.acorde3.classList.remove('d-none');
        this.elements.acorde4.classList.remove('d-none');
        this.elements.acorde5.classList.remove('d-none');
        this.elements.acorde6.classList.remove('d-none');
        this.elements.acorde7.classList.remove('d-none');
        this.elements.acorde8.classList.remove('d-none');
        this.elements.acorde9.classList.remove('d-none');
        this.elements.acorde10.classList.remove('d-none');
        this.elements.acorde11.classList.remove('d-none');
        
        cifraPlayer.preencherSelect('C');
        
        this.elements.acorde1.value = 'C';
        this.elements.acorde1.textContent = 'C';
        this.elements.acorde2.value = 'Am';
        this.elements.acorde2.textContent = 'Am';
        this.elements.acorde3.value = 'F';
        this.elements.acorde3.textContent = 'F';
        this.elements.acorde4.value = 'Dm';
        this.elements.acorde4.textContent = 'Dm';
        this.elements.acorde5.value = 'G';
        this.elements.acorde5.textContent = 'G';
        this.elements.acorde6.value = 'Em';
        this.elements.acorde6.textContent = 'Em';
        this.elements.acorde7.value = 'A';
        this.elements.acorde7.textContent = 'A';
        this.elements.acorde8.value = 'E';
        this.elements.acorde8.textContent = 'E';
        this.elements.acorde9.value = 'Bb';
        this.elements.acorde9.textContent = 'Bb';
        this.elements.acorde10.value = 'D';
        this.elements.acorde10.textContent = 'D';
        this.elements.acorde11.value = 'B°';
        this.elements.acorde11.textContent = 'B°';
    }

    esconderBotoesTom() {
        this.elements.tomSelect.innerHTML = '<option value="">Letra</option>';
        this.elements.tomContainer.classList.remove('d-flex');
        this.elements.tomContainer.classList.add('d-none');
    }

    exibirBotoesTom() {
        this.elements.tomContainer.classList.remove('d-none');
        this.elements.tomContainer.classList.add('d-flex');
    }

    desabilitarSelectSaves() {
        this.elements.savesSelect.disabled = true;
        this.elements.addButton.disabled = true;
    }

    habilitarSelectSaves() {
        this.elements.savesSelect.disabled = false;
        this.elements.addButton.disabled = false;
    }

    exibirListaSaves(saveSelected) {
        this.elements.addButton.classList.add('rounded-right-custom');
        this.elements.addButton.classList.remove('rounded-0');
        this.elements.deleteSavesSelect.classList.add('d-none');
        this.elements.editSavesSelect.classList.add('d-none');

        this.elements.savesSelect.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = 'Selecione uma Música...';
        defaultOption.selected = true;
        defaultOption.hidden = true;
        this.elements.savesSelect.appendChild(defaultOption);

        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.text = '';
        this.elements.savesSelect.appendChild(emptyOption);

        this.elements.savesSelect.style.color = '';

        let saves = localStorage.getItem('saves');
        if (saves && saves !== '{}') {
            saves = JSON.parse(saves);

            let saveNames = Object.keys(saves).sort();

            saveNames.forEach(saveName => {
                const listItem = this.criarItemSelect(saveName, saves[saveName]);
                this.elements.savesSelect.appendChild(listItem);
            });

            if (saveSelected && saveNames.includes(saveSelected)) {
                this.elements.savesSelect.value = saveSelected;
                this.elements.savesSelect.style.color = 'black';
            }
        }
    }

    esconderBotoesPlay() {
        this.elements.notesButton.classList.add('d-none');
        this.elements.playButton.classList.add('d-none');
        this.elements.prevButton.classList.add('d-none');
        this.elements.nextButton.classList.add('d-none');
    }

    atualizarBotoesNavegacao(direcao) {
        if (direcao === 'esquerda') {
            this.elements.nextButton.classList.remove('d-none');
            if (this.elements.controlButtons.classList.contains('justify-content-center')) {
                this.elements.controlButtons.classList.remove('justify-content-center');
                this.elements.controlButtons.classList.add('justify-content-left');
                this.elements.prevButton.classList.add('d-none');
            } else if (this.elements.controlButtons.classList.contains('justify-content-end')) {
                this.elements.controlButtons.classList.remove('justify-content-end');
                this.elements.controlButtons.classList.add('justify-content-center');
            }
        } else if (direcao === 'direita') {
            this.elements.prevButton.classList.remove('d-none');
            if (this.elements.controlButtons.classList.contains('justify-content-center')) {
                this.elements.controlButtons.classList.remove('justify-content-center');
                this.elements.controlButtons.classList.add('justify-content-end');
                this.elements.nextButton.classList.add('d-none');
            } else if (this.elements.controlButtons.classList.contains('justify-content-left')) {
                this.elements.controlButtons.classList.remove('justify-content-left');
                this.elements.controlButtons.classList.add('justify-content-center');
            }
        } else if (direcao === 'centralizado') {
            this.elements.controlButtons.classList.add('justify-content-center');
            this.elements.prevButton.classList.remove('d-none');
            this.elements.nextButton.classList.remove('d-none');
        }
    }

    criarItemSelect(saveName, saveContent) {
        const option = document.createElement('option');

        option.value = saveName;
        option.textContent = saveName;

        this.elements.savesSelect.appendChild(option);
        return option;
    }

    resetarOkAlert() {
        this.elements.okButtonAlert.classList.remove('d-none');
        this.elements.simButtonAlert.classList.add('d-none');
        this.elements.naoButtonAlert.classList.add('d-none');
        this.elements.cancelButtonAlert.classList.add('d-none');
    }

    resetarSimNaoAlert(simText = '✓ Sim') {
        this.elements.simButtonAlert.textContent = simText;
        this.elements.simButtonAlert.classList.remove('d-none');
        this.elements.naoButtonAlert.classList.remove('d-none');
        this.elements.okButtonAlert.classList.add('d-none');
        this.elements.cancelButtonAlert.classList.add('d-none');
    }

    exibirInterfaceDePesquisa() {
        this.elements.editTextarea.classList.add('d-none');
        this.elements.searchIcon.classList.add('d-none');
        this.elements.spinner.classList.remove('d-none');
        this.elements.saveButton.classList.add('d-none');
        this.elements.startButton.classList.add('d-none');
        this.elements.searchButton.disabled = true;
    }

    esconderInterfaceDePesquisa() {
        this.elements.searchResultsList.classList.remove('d-none');
        this.elements.searchButton.disabled = false;
    }

    pararspinnerloading() {
        this.elements.searchIcon.classList.remove('d-none');
        this.elements.spinner.classList.add('d-none');
    }

    limparResultados() {
        this.elements.searchButton.disabled = true;
        this.elements.spinner.classList.remove('d-none');
        this.elements.searchIcon.classList.add('d-none');
        this.elements.searchResultsList.innerHTML = '';
    }

    exibirBotoesSalvarTocar() {
        this.elements.searchButton.disabled = false;
        this.elements.spinner.classList.add('d-none');
        this.elements.searchIcon.classList.remove('d-none');
        this.elements.searchResultsList.classList.add('d-none');
        
        this.elements.startButton.classList.remove('d-none');
        this.elements.saveButton.classList.remove('d-none');
        this.elements.addButton.classList.remove('d-none');
        this.elements.editTextarea.classList.remove('d-none');
    }

    exibirIframeCifra() {
        this.elements.iframeCifra.classList.remove('d-none');
        this.elements.liturgiaDiariaFrame.classList.add('d-none');
        this.elements.santamissaFrame.classList.add('d-none');
        this.elements.oracoesFrame.classList.add('d-none');
    }

    exibirTextoCifrasCarregado(tom = null, texto = null) {
        if (tom) {
            uiController.exibirBotoesTom();
            cifraPlayer.preencherSelect(tom);
        }
        else {
            uiController.esconderBotoesTom();
            let textoLetra = this.elements.iframeCifra.contentDocument.body.innerHTML;
            textoLetra = textoLetra.replace("font-family: Consolas, 'Courier New', Courier, monospace;", "font-family: 'Roboto', sans-serif;")
                .replace("font-size: 12pt;", "font-size: 15pt;");
            this.elements.iframeCifra.contentDocument.body.innerHTML = textoLetra;
        }

        if (texto) {
            if (texto.includes('<pre>')) {
                this.elements.editTextarea.value = texto.split('<pre>')[1].split('</pre>')[0].replace(/<\/?[^>]+(>|$)/g, "");
            }
            else {
                this.elements.editTextarea.value = texto;
            }
        }
    }

    esconderEditDeleteButtons() {
        if (this.elements.deleteSavesSelect.classList.contains('show')) {
            this.elements.deleteSavesSelect.classList.remove('show');
            this.elements.editSavesSelect.classList.remove('show');
            this.elements.addButton.classList.add('rounded-right-custom');
            this.elements.addButton.classList.remove('rounded-0');

            setTimeout(() => {
                this.elements.deleteSavesSelect.classList.add('d-none');
                this.elements.editSavesSelect.classList.add('d-none');
            }, 100);
        }
    }

    exibirFrame(frameId) {
        this.elements.oracoesFrame.classList.add('d-none');
        this.elements.santamissaFrame.classList.add('d-none');
        this.elements.iframeCifra.classList.add('d-none');
        this.elements.liturgiaDiariaFrame.classList.add('d-none');

        this.exibirBotoesAcordes();
        
        uiController.exibirTextoCifrasCarregado('C', elements.editTextarea.value);
        cifraPlayer.preencherSelect('C');

        this.exibirBotoesTom();

        if (frameId) {
            const frame = this.elements[frameId];
            if (frame) {
                frame.classList.remove('d-none');

                if (frameId === 'santamissaFrame') {
                    const scrollTop = localStorage.getItem('scrollTop');
                    if (scrollTop && !location.origin.includes('file:')) {
                        frame.contentWindow.scrollTo(0, parseInt(scrollTop));
                    }
                }
            }
        }

        this.elements.savesSelect.selectedIndex = 0;
        $('#optionsModal').modal('hide');
    }

    toggleEditDeleteButtons() {
        if (this.elements.deleteSavesSelect.classList.contains('d-none')) {
            this.elements.deleteSavesSelect.classList.remove('d-none');
            this.elements.editSavesSelect.classList.remove('d-none');

            setTimeout(() => {
                this.elements.deleteSavesSelect.classList.add('show');
                this.elements.editSavesSelect.classList.add('show');
            }, 10); // Pequeno atraso para permitir que o efeito seja aplicado
        } else {
            this.elements.deleteSavesSelect.classList.remove('show');
            this.elements.editSavesSelect.classList.remove('show');

            setTimeout(() => {
                this.elements.deleteSavesSelect.classList.add('d-none');
                this.elements.editSavesSelect.classList.add('d-none');
            }, 100);
        }

        this.elements.addButton.classList.toggle('rounded-0');
        this.elements.addButton.classList.toggle('rounded-right-custom');
    }

    exibirMensagemAlerta(mensagem, titulo) {
        this.elements.alertModalMessage.textContent = mensagem;
        this.elements.alertModalLabel.textContent = titulo;
        $('#alertModal').modal('show');
    }
}


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


const elements = {
    controlButtons: document.getElementById('controlButtons'),
    editTextarea: document.getElementById('editTextarea'),
    startButton: document.getElementById('startButton'),
    saveButton: document.getElementById('saveButton'),
    addButton: document.getElementById('addButton'),
    saveNewItemButton: document.getElementById('saveNewItemButton'),
    playButton: document.getElementById('playButton'),
    notesButton: document.getElementById('notesButton'),
    stopButton: document.getElementById('stopButton'),
    searchButton: document.getElementById('searchButton'),
    clearButton: document.getElementById('clearButton'),
    searchInput: document.getElementById('searchInput'),
    spinner: document.querySelector('.spinner-border'),
    searchIcon: document.getElementById('searchIcon'),
    searchResultsList: document.getElementById('searchResults'),
    savesList: document.getElementById('saves'),
    pulseRange: document.getElementById('pulseRange'),
    bpmValue: document.getElementById('bpmValue'),
    iframeCifra: document.getElementById('iframeCifra'),
    santamissaFrame: document.getElementById('santamissaFrame'),
    oracoesFrame: document.getElementById('oracoesFrame'),
    prevButton: document.getElementById('prevButton'),
    nextButton: document.getElementById('nextButton'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    searchModalLabel: document.getElementById('searchModalLabel'),
    savesSelect: document.getElementById('savesSelect'),
    editSavesSelect: document.getElementById('editSavesSelect'),
    deleteSavesSelect: document.getElementById('deleteSavesSelect'),
    tomSelect: document.getElementById('tomSelect'),
    decreaseTom: document.getElementById('decreaseTom'),
    increaseTom: document.getElementById('increaseTom'),
    tomContainer: document.getElementById('tomContainer'),
    pulseRange: document.getElementById('pulseRange'),
    itemNameInput: document.getElementById('itemNameInput'),
    alertModalLabel: document.getElementById('alertModalLabel'),
    alertModalMessage: document.getElementById('alertModalMessage'),
    itemModalLabel: document.getElementById('itemModalLabel'),
    cancelButtonAlert: document.getElementById('cancelButtonAlert'),
    simButtonAlert: document.getElementById('simButtonAlert'),
    naoButtonAlert: document.getElementById('naoButtonAlert'),
    okButtonAlert: document.getElementById('okButtonAlert'),
    oracoesEucaristicasLink: document.getElementById('oracoesEucaristicasLink'),
    missaOrdinarioLink: document.getElementById('missaOrdinarioLink'),
    liturgiaDiariaLink: document.getElementById('liturgiaDiariaLink'),
    oracoesLink: document.getElementById('oracoesLink'),
    aboutLink: document.getElementById('about'),
    downloadSavesLink: document.getElementById('downloadSavesLink'),
    uploadSavesLink: document.getElementById('uploadSavesLink'),
    liturgiaDiariaFrame: document.getElementById('liturgiaDiariaFrame'),
    santamissaFrame: document.getElementById('santamissaFrame'),
    acorde1: document.getElementById('acorde1'),
    acorde2: document.getElementById('acorde2'),
    acorde3: document.getElementById('acorde3'),
    acorde4: document.getElementById('acorde4'),
    acorde5: document.getElementById('acorde5'),
    acorde6: document.getElementById('acorde6'),
    acorde7: document.getElementById('acorde7'),
    acorde8: document.getElementById('acorde8'),
    acorde9: document.getElementById('acorde9'),
    acorde10: document.getElementById('acorde10'),
    acorde11: document.getElementById('acorde11'),
    borderRight: document.getElementById('borderRight'),
    borderLeft: document.getElementById('borderLeft')
};

const cifraPlayer = new CifraPlayer(elements);
const uiController = new UIController(elements);
const localStorageManager = new LocalStorageManager();

const camposHarmonicos = {
    // Campos harmônicos maiores
    'C': ['C', 'Dm', 'Em', 'F', 'G', 'Am'],
    'Db': ['Db', 'Ebm', 'Fm', 'Gb', 'Ab', 'Bbm'],
    'C#': ['C#', 'D#m', 'Fm', 'F#', 'G#', 'A#m'],
    'D': ['D', 'Em', 'F#m', 'G', 'A', 'Bm'],
    'Eb': ['Eb', 'Fm', 'Gm', 'Ab', 'Bb', 'Cm'],
    'D#': ['D#', 'Fm', 'Gm', 'G#', 'A#', 'Cm'],
    'E': ['E', 'F#m', 'G#m', 'A', 'B', 'C#m'],
    'F': ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm'],
    'F#': ['F#', 'G#m', 'A#m', 'B', 'C#', 'D#m'],
    'Gb': ['Gb', 'Abm', 'Bbm', 'B', 'Db', 'Ebm'],
    'G': ['G', 'Am', 'Bm', 'C', 'D', 'Em'],
    'G#': ['G#', 'A#m', 'B#m', 'C#', 'D#', 'Fm'],
    'Ab': ['Ab', 'Bbm', 'Cm', 'Db', 'Eb', 'Fm'],
    'A': ['A', 'Bm', 'C#m', 'D', 'E', 'F#m'],
    'A#': ['A#', 'B#m', 'Dm', 'D#', 'F', 'Gm'],
    'Bb': ['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm'],
    'B': ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m'],
    // Campos harmônicos menores
    'Am': ['Am', 'C', 'Dm', 'Em', 'F', 'G'],
    'Bbm': ['Bbm', 'Db', 'Ebm', 'Fm', 'Gb', 'Ab'],
    'B#m': ['B#m', 'D', 'E#m', 'F#m', 'G', 'A'],
    'Bm': ['Bm', 'D', 'Em', 'F#m', 'G', 'A'],
    'Cm': ['Cm', 'Eb', 'Fm', 'Gm', 'Ab', 'Bb'],
    'C#m': ['C#m', 'E', 'F#m', 'G#m', 'A', 'B'],
    'Dm': ['Dm', 'F', 'Gm', 'Am', 'Bb', 'C'],
    'D#m': ['D#m', 'Gb', 'Abm', 'Bbm', 'Cb', 'Db'],
    'Ebm': ['Ebm', 'Gb', 'Abm', 'Bbm', 'Cb', 'Db'],
    'Em': ['Em', 'G', 'Am', 'Bm', 'C', 'D'],
    'Fm': ['Fm', 'Ab', 'Bbm', 'Cm', 'Db', 'Eb'],
    'F#m': ['F#m', 'A', 'Bm', 'C#m', 'D', 'E'],
    'Gm': ['Gm', 'Bb', 'Cm', 'Dm', 'Eb', 'F'],
    'G#m': ['G#m', 'B', 'C#m', 'D#m', 'E', 'F#'],
    'Abm': ['Abm', 'Cb', 'Dbm', 'Ebm', 'Fb', 'Gb'],
    'A#m': ['A#m', 'D', 'E#m', 'F#m', 'G', 'A']
};

const version = 1;
const holdTime = 1000;
var held = false;
var timer;
var todasAsCifras = [];
var musicaEscolhida = false;

window.onerror = function (message, source, lineno, colno, error) {
	alert("Erro!\n" + message + '\nArquivo: ' + source + '\nLinha: ' + lineno + '\nPosicao: ' + colno);
};

// Faz o link Liturgia da Palavra de dentro do iframe LiturgiaDiaria funcionar
elements.santamissaFrame.addEventListener('load', () => {
    window.addEventListener('message', (event) => {
        if (event.data === 'mostrarLiturgiaDiaria') {
            elements.liturgiaDiariaFrame.classList.remove('d-none');
            elements.santamissaFrame.classList.add('d-none');
            elements.oracoesFrame.classList.add('d-none');
        }
    });
});

elements.saveNewItemButton.addEventListener("click", () => {
    elements.savesSelect.selectedIndex = 0;
    let newSaveName = elements.itemNameInput.value;
    if (newSaveName === '') return;
    salvarSave(newSaveName);
    $('#itemModal').modal('hide');
});

elements.saveButton.addEventListener('click', () => {
    const saveContent = elements.editTextarea.value;

    if (saveContent) {
        let saveName = elements.searchModalLabel.textContent;
        if (saveName) {
            if (saveName === "Música") {
                itemModalLabel.innerText = "Novo";
                $('#itemModal').modal('show');
                return;
            }
            let saves = JSON.parse(localStorage.getItem('saves')) || {};
            if (saves.hasOwnProperty(saveName)) {
                uiController.exibirMensagemAlerta(`Salvar "${saveName}"?`, `Salvar "${saveName}"`);
                uiController.resetarSimNaoAlert();
            }
            else {
                salvarSave(saveName);

                uiController.exibirMensagemAlerta(`"${saveName}" salvo com sucesso!`, 'Música');
                uiController.resetarOkAlert();

                $('#alertModal').modal('show');
            }
        }
    } else {
        elements.editTextarea.focus();
    }
});

elements.darkModeToggle.addEventListener('change', toggleDarkMode);

elements.startButton.addEventListener('click', () => {
    if (elements.editTextarea.value) {
        uiController.exibirBotoesCifras();
        const texto = elements.editTextarea.value;
        let musicaCifrada = cifraPlayer.destacarCifras(texto);
        const tom = descobrirTom(musicaCifrada);        
        musicaCifrada = cifraPlayer.destacarCifras(texto, tom);
        uiController.exibirTextoCifrasCarregado(tom, elements.editTextarea.value);
        elements.iframeCifra.contentDocument.body.innerHTML = musicaCifrada;
        if (!tom)
            elements.tomSelect.dispatchEvent(new Event('change'));
        if (tom === '') {
            let textoLetra = elements.iframeCifra.contentDocument.body.innerHTML;
            textoLetra = textoLetra.replace("font-family: Consolas, 'Courier New', Courier, monospace;", "font-family: 'Roboto', sans-serif;")
                .replace("font-size: 12pt;", "font-size: 15pt;");
            elements.iframeCifra.contentDocument.body.innerHTML = textoLetra;
        }
        uiController.exibirIframeCifra();
        cifraPlayer.addEventCifrasIframe(elements.iframeCifra);
        
        cifraPlayer.indiceAcorde = 0;
        $('#searchModal').modal('hide');
    }
    else {
        elements.searchInput.focus();
    }
});

elements.prevButton.addEventListener('click', () => {
    uiController.atualizarBotoesNavegacao('esquerda');
});

elements.nextButton.addEventListener('click', () => {
    uiController.atualizarBotoesNavegacao('direita');
});

elements.tomSelect.addEventListener('change', (event) => {
    if (elements.tomSelect.value) {// && !elements.tomContainer.classList.contains('d-none')) { // Selecionado Letra
        if (elements.acorde1.classList.contains('d-none')) {
            cifraPlayer.transposeCifra();
        }
        else {
            cifraPlayer.transporTom();
            if (!cifraPlayer.parado && !cifraPlayer.acordeTocando) {
                const button = event.currentTarget;
                cifraPlayer.pararReproducao();
                cifraPlayer.parado = false;
                cifraPlayer.tocarAcorde(button.value);
                button.classList.add('pressed');
            }
        }
    } else {
        cifraPlayer.removeCifras(elements.iframeCifra.contentDocument.body.innerHTML);
        uiController.exibirBotoesAcordes();
        uiController.esconderBotoesTom();
    }
});

elements.decreaseTom.addEventListener('click', () => {
    if (elements.tomSelect.value) {
        let tomIndex = parseInt(elements.tomSelect.selectedIndex);
        if (tomIndex === 1)
            tomIndex = 13;
        elements.tomSelect.value = elements.tomSelect.options[tomIndex - 1].value;
        elements.tomSelect.dispatchEvent(new Event('change'));
    }
});

elements.increaseTom.addEventListener('click', () => {
    if (elements.tomSelect.value) {
        let tomIndex = parseInt(elements.tomSelect.selectedIndex);
        if (tomIndex === 12)
            tomIndex = 0;
        elements.tomSelect.value = elements.tomSelect.options[tomIndex + 1].value;
        elements.tomSelect.dispatchEvent(new Event('change'));
    }
});

elements.savesSelect.addEventListener('change', () => {
    const selectItem = elements.savesSelect.value;

    if (selectItem) {
        const saves = JSON.parse(localStorage.getItem('saves'));
        elements.editTextarea.value = saves[selectItem];
        elements.searchModalLabel.textContent = selectItem;
        elements.savesSelect.style.color = 'black';
        const texto = elements.editTextarea.value;
        const musicaCifrada = cifraPlayer.destacarCifras(texto);
        const tom = descobrirTom(musicaCifrada);
        elements.iframeCifra.contentDocument.body.innerHTML = musicaCifrada;
        uiController.exibirTextoCifrasCarregado(tom, elements.editTextarea.value);

        if (tom !== '') {
            uiController.exibirBotoesCifras();
            elements.tomSelect.dispatchEvent(new Event('change'));
        }
        else {
            //uiController.exibirBotoesAcordes();            
            uiController.esconderBotoesAcordes();
            uiController.esconderBotoesPlay();
        }
        uiController.exibirIframeCifra();
        cifraPlayer.addEventCifrasIframe(elements.iframeCifra);
        
        cifraPlayer.indiceAcorde = 0;
    }
    else {
        uiController.exibirBotoesTom();
        uiController.exibirBotoesAcordes();
        elements.savesSelect.selectedIndex = 0;
        elements.iframeCifra.contentDocument.body.innerHTML = '';
    }
});

elements.addButton.addEventListener('click', function () {
    this.classList.add('pressed');

    setTimeout(() => {
        this.classList.remove('pressed');
    }, 100);

    if (!elements.deleteSavesSelect.classList.contains('d-none')) {
        itemModalLabel.innerText = "Novo";
        elements.itemNameInput.value = "";
        elements.savesSelect.selectedIndex = 0;
        $('#itemModal').modal('show');
    }

    uiController.toggleEditDeleteButtons();
});

elements.editSavesSelect.addEventListener('click', () => {
    const saveName = elements.savesSelect.value;
    if (elements.savesSelect.selectedIndex !== 0) {
        itemModalLabel.innerText = "Editar - " + saveName;
        elements.itemNameInput.value = saveName ? saveName : "";
        $('#itemModal').modal('show');
    }
});

elements.deleteSavesSelect.addEventListener('click', () => {
    const saveName = elements.savesSelect.value;
    if (elements.savesSelect.selectedIndex !== 0) {
        uiController.exibirMensagemAlerta(`Deseja excluir "${saveName}"?`, 'Deletar!');
        uiController.resetarSimNaoAlert();

        $('#alertModal').modal('show');
    }
});

elements.searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        elements.searchButton.click();
    }
});

elements.itemNameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        elements.saveNewItemButton.click();
    }
});

elements.searchButton.addEventListener('click', () => {
    if (elements.searchInput.value)
        searchMusic();
});

elements.clearButton.addEventListener('click', () => {
    elements.searchInput.value = '';
    elements.searchInput.focus();
});

elements.liturgiaDiariaLink.addEventListener('click', () => {
    uiController.exibirFrame('liturgiaDiariaFrame');
});

elements.oracoesLink.addEventListener('click', () => {
    uiController.exibirFrame('oracoesFrame');
});

elements.aboutLink.addEventListener('click', () => {
    alert('Projeto de Ronei Costa Soares. version: ' + version);
});

elements.downloadSavesLink.addEventListener('click', () => {
    downloadSaves();
});

elements.uploadSavesLink.addEventListener('click', () => {
    uploadSaves();
});

elements.missaOrdinarioLink.addEventListener('click', () => {
    uiController.exibirFrame('santamissaFrame');
});

elements.notesButton.addEventListener('click', () => {
    //cifraPlayer.alternarNotas();
    
    // quando pressionar botão das notas, não tocar o acorde denovo
    // if (!elements.acorde1.classList.contains('d-none')) {
    //     cifraPlayer.tocarAcorde(cifraPlayer.acordeTocando);
    // }
});

elements.stopButton.addEventListener('mousedown', () => {
    uiController.esconderEditDeleteButtons();
    cifraPlayer.pararReproducao();
});

elements.playButton.addEventListener('click', () => {
    cifraPlayer.iniciarReproducao();
})

elements.simButtonAlert.addEventListener('click', () => {
    if (elements.alertModalLabel.textContent === 'Deletar!') {
        const saveName = elements.savesSelect.value;
        deletarSave(saveName);
    }
    else {
        const saveName = elements.searchModalLabel.textContent;
        salvarSave(saveName);
        if (elements.savesSelect.value === saveName) //verificação se for item deletado
            elements.startButton.dispatchEvent(new Event('click'));
    }
});

elements.naoButtonAlert.addEventListener('click', () => {
    $('#itemModal').modal('show');
});

function handleInteractionStart() {
    held = false;
    timer = setTimeout(() => {
        held = true;
        const icon = elements.notesButton.querySelector('i');
        icon.classList.remove('bi-music-note-beamed');
        icon.classList.add('bi-music-note');
        elements.notesButton.classList.remove('pressed');
        elements.notesButton.classList.add('notaSolo');
    }, holdTime);
}

function handleInteractionEnd() {
    clearTimeout(timer);
}

document.addEventListener('mousedown', fullScreen);

document.addEventListener('click', (event) => {
    if (!elements.addButton.contains(event.target) &&
        !elements.deleteSavesSelect.contains(event.target) &&
        !elements.editSavesSelect.contains(event.target) &&
        !elements.savesSelect.contains(event.target)
    ) {
        uiController.esconderEditDeleteButtons();
    }
});

$('#itemModal').on('shown.bs.modal', () => {
    elements.itemNameInput.focus();
});

$('#searchModal').on('shown.bs.modal', () => {
    if (elements.savesSelect.value !== '')
        elements.searchModalLabel.textContent = elements.savesSelect.value;

    elements.editTextarea.value = elements.iframeCifra.contentDocument.body.innerText;
    elements.searchInput.focus();
    uiController.exibirBotoesSalvarTocar();
});

$('#alertModal').on('shown.bs.modal', () => {
    elements.itemNameInput.focus();
});

function descobrirTom(textoHtml) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = textoHtml;
    const cifrasTag = tempDiv.querySelectorAll('b');
    
    if (!cifrasTag.length) {
        return '';
    }
    
    const cifras = [];
    cifrasTag.forEach(acorde => {
        if (acorde.innerText)
            cifras.push(acorde.innerText.split('/')[0]);
    });
    
    const acordesOrdenados = cifras.sort();

    const padroesAcordes = {
        doisMenores: false,
        doisMaiores: false
    };

    for (let i = 0; i < acordesOrdenados.length - 1; i++) {
        if (acordesOrdenados[i].endsWith('m') && acordesOrdenados[i + 1].endsWith('m')) {
            padroesAcordes.doisMenores = true;
        }
        if (!acordesOrdenados[i].endsWith('m') && !acordesOrdenados[i + 1].endsWith('m')) {
            padroesAcordes.doisMaiores = true;
        }
    }

    const possiveisTons = {};
    for (const [tom, acordes] of Object.entries(camposHarmonicos)) {
        let pontos = 0;

        if (padroesAcordes.doisMenores) {
            for (let i = 0; i < acordes.length - 1; i++) {
                if (acordes[i].endsWith('m') && acordes[i + 1].endsWith('m')) {
                    pontos += 1;
                }
            }
        }
        if (padroesAcordes.doisMaiores) {
            for (let i = 0; i < acordes.length - 1; i++) {
                if (!acordes[i].endsWith('m') && !acordes[i + 1].endsWith('m')) {
                    pontos += 1;
                }
            }
        }

        pontos += cifras.filter(cifra => acordes.includes(cifra)).length;
        cifras.forEach(cifra => {
            if (!acordes.includes(cifra)) {
                pontos -= 1; // Subtrai 1 ponto se o acorde não estiver no campo harmônico
            }
        });

        possiveisTons[tom] = pontos;
    }

    const primeiroAcorde = cifras[0];
    const ultimoAcorde = cifras[cifras.length - 1];

    for (const tom in possiveisTons) {
        if (camposHarmonicos[tom][0] === primeiroAcorde) {
            possiveisTons[tom] += 1;
        }
        if (camposHarmonicos[tom][0] === ultimoAcorde) {
            possiveisTons[tom] += 1;
        }
    }

    const tomProvavel = Object.keys(possiveisTons).reduce((a, b) => possiveisTons[a] > possiveisTons[b] ? a : b);
    return tomProvavel;
}

function desselecionarTodos() {
    const allItems = document.querySelectorAll('.list-group-item');
    allItems.forEach(item => item.classList.remove('selected'));
}

function deletarSave(saveName) {
    let saves = JSON.parse(localStorage.getItem('saves') || '{}');
    delete saves[saveName];
    localStorage.setItem('saves', JSON.stringify(saves));
    elements.searchModalLabel.textContent = 'Música';
    elements.iframeCifra.contentDocument.body.innerHTML = '';
    elements.tomSelect.innerHTML = '<option value="">Letra</option>';

    uiController.exibirListaSaves();
}

async function searchMusic() {
    musicaEscolhida = false;
    uiController.limparResultados();
    uiController.exibirInterfaceDePesquisa();

    const textoPesquisa = elements.searchInput.value;
    var titlesCifraClub = [];

    var cifrasEncontradas = todasAsCifras.filter(cifra =>
        cifra.titulo.toLowerCase().includes(textoPesquisa.toLowerCase()) ||
        cifra.artista.toLowerCase().includes(textoPesquisa.toLowerCase())
    );

    if (cifrasEncontradas.length > 0) {
        const max = 3;
        const topTitles = cifrasEncontradas.slice(0, max);
            topTitles.forEach((cifra) => {
                const title = cifra.titulo + ' - ' + cifra.artista;
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                const link = document.createElement('a');
                link.href = '#';
                    link.onclick = () => choseCifraLocal(cifra.id);
                    link.textContent = title;
                    listItem.appendChild(link);
                    elements.searchResultsList.appendChild(listItem);
                });

        uiController.esconderInterfaceDePesquisa();
    }

    try {
        const response = await fetch('https://apinode-h4wt.onrender.com/pesquisar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: textoPesquisa }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (data.success) {
            if (musicaEscolhida)
                return;

            const { lista: titles, links } = data; // destructuring
            titlesCifraClub = titles;
            if (titles.length > 0) {
                const max = 3;
                const topTitles = titles.slice(0, max);
                topTitles.forEach((title, index) => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    const link = document.createElement('a');
                    link.href = '#';
                    link.onclick = () => choseLink(links[index], title);
                    link.textContent = title;
                    listItem.appendChild(link);
                    elements.searchResultsList.appendChild(listItem);
                });
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        alert(`Erro na busca: ${error.message}`);
        elements.savesList.classList.remove('d-none');
        elements.searchResultsList.classList.add('d-none');
    } finally {
        uiController.esconderInterfaceDePesquisa();
        uiController.pararspinnerloading();
    }

    if (cifrasEncontradas.length == 0 && titlesCifraClub == 0) {
        elements.searchResultsList.innerHTML = '<li class="list-group-item">Nenhuma cifra encontrada.</li>';
    }
}

async function choseCifraLocal(id) {
    musicaEscolhida = true;
    uiController.limparResultados();

    const musica = todasAsCifras.find(c => c.id === id);
    if (!musica) {
        alert('Cifra não encontrada.');
        return;
    }

    const texto = musica.cifra;
    const titulo = musica.titulo;

    let musicaCifrada = cifraPlayer.destacarCifras(texto);
    const tom = descobrirTom(musicaCifrada);
    musicaCifrada = cifraPlayer.destacarCifras(texto, tom);

    elements.editTextarea.value = texto;
    elements.iframeCifra.contentDocument.body.innerHTML = musicaCifrada;
    elements.searchModalLabel.textContent = titulo;

    uiController.exibirTextoCifrasCarregado(tom, texto);
    uiController.exibirBotoesSalvarTocar();

    cifraPlayer.addEventCifrasIframe(elements.iframeCifra);

    cifraPlayer.indiceAcorde = 0;
}

async function choseLink(urlLink, text) {
    uiController.limparResultados();

    try {
        const response = await fetch('https://apinode-h4wt.onrender.com/downloadsite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: urlLink }),
        });
        const data = await response.json();
        if (data.success) {
            uiController.exibirTextoCifrasCarregado(null, data.message);

            if (elements.searchModalLabel.textContent === 'Música') {
                elements.searchModalLabel.textContent = text.split(' - ')[0];
            }
            uiController.exibirBotoesSalvarTocar();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Erro ao baixar a cifra. Tente novamente mais tarde.');
    } finally {
        uiController.exibirBotoesSalvarTocar();
    }
}

const togglePressedState = (event) => {
    const button = event.currentTarget;
    const action = button.dataset.action;

    if (action === 'notes') {
        var icon = notesButton.querySelector('i');
        if (!held && icon.classList.contains('bi-music-note')) {
            icon.classList.remove('bi-music-note');
            icon.classList.add('bi-music-note-beamed');
            elements.notesButton.classList.remove('notaSolo');
        }
        else if (elements.notesButton.classList.contains('pressed')) {
            // adiciona essas linhas para ao clicar no botão notas, ter o comportamento das 3 ações
            //elements.notesButton.classList.remove('pressed');
            icon.classList.remove('bi-music-note-beamed');
            icon.classList.add('bi-music-note');
            elements.notesButton.classList.remove('pressed');
            elements.notesButton.classList.add('notaSolo');
        } else if (!elements.notesButton.classList.contains('notaSolo')) {
            elements.notesButton.classList.add('pressed');
        }
    } else {        
        if (action === 'acorde') {
            cifraPlayer.pararReproducao();
            cifraPlayer.parado = false;
            cifraPlayer.tocarAcorde(button.value);
        }
        button.classList.remove('pressed');
        setTimeout(() => button.classList.add('pressed'), 100);

        if (action === 'play' || action === 'acorde') {
            setTimeout(() => button.classList.add('pulse'), 100);
            elements.stopButton.classList.remove('pulse');
            elements.stopButton.innerHTML = '<i class="bi bi-stop-fill"></i>';
            elements.playButton.classList.remove('pulse');
        } else {
            if (action === 'stop' && elements.stopButton.innerHTML.includes('bi-search')) {
                $('#searchModal').modal('show');
            }
            elements.playButton.classList.remove('pressed', 'pulse');
            elements.stopButton.classList.add('pulse');
            elements.stopButton.innerHTML = '<i class="bi bi-search"></i>';
        }
    }
};

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    aplicarModoEscuroIframe();
};

const updateSwitchDarkMode = () => {
    const isDarkMode = document.body.classList.contains('dark-mode');
    if (isDarkMode) {
        elements.darkModeToggle.checked = false;
    } else {
        elements.darkModeToggle.checked = true;
    }
};

const aplicarModoEscuroIframe = () => {
    const iframeDoc = elements.iframeCifra.contentDocument || elements.iframeCifra.contentWindow.document;
    iframeDoc.body.style.color = document.body.classList.contains('dark-mode') ? '#FFFFFF' : '#4F4F4F';
    elements.liturgiaDiariaFrame.style.backgroundColor = document.body.classList.contains('dark-mode') ? '#e0dcb5' : '#FFFFFF'; //f5f5dc
    
    if (document.body.classList.contains('dark-mode')) {
        if (!location.origin.includes('file:')) {
            elements.santamissaFrame.style.backgroundColor = '#101524';
            elements.oracoesFrame.style.backgroundColor = '#101524';
            elements.oracoesFrame.contentDocument.body.style.color = '#FFFFFF';
            if (elements.santamissaFrame.contentDocument)
                elements.santamissaFrame.contentDocument.body.style.color = '#FFFFFF';
        }
    }
    else {
        if (!location.origin.includes('file:')) {
            elements.santamissaFrame.style.backgroundColor = '#FFFFFF';
            elements.oracoesFrame.style.backgroundColor = '#FFFFFF';
            elements.oracoesFrame.contentDocument.body.style.color = '#000000';
            if (elements.santamissaFrame.contentDocument)
                elements.santamissaFrame.contentDocument.body.style.color = '#000000';
        }
    }
    
    const scrollTop = localStorage.getItem('scrollTop');
    if (scrollTop && !location.origin.includes('file:')) {
        elements.santamissaFrame.contentWindow.scrollTo(0, parseInt(scrollTop));
    }
};

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function uploadSaves() {
    let input = document.getElementById('uploadSavesInput');
    if (!input) {
        input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.style.display = 'none';
        input.id = 'uploadSavesInput';
        document.body.appendChild(input);
    }

    input.value = ''; // Permite selecionar o mesmo arquivo novamente

    input.onchange = function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const importedSaves = JSON.parse(e.target.result);

                if (typeof importedSaves !== 'object' || Array.isArray(importedSaves)) {
                    alert('Arquivo inválido!');
                    return;
                }

                // Mescla com os saves existentes (ou substitui, se preferir)
                const currentSaves = JSON.parse(localStorage.getItem('saves') || '{}');
                const mergedSaves = { ...currentSaves, ...importedSaves };
                localStorage.setItem('saves', JSON.stringify(mergedSaves));

                // Atualiza a interface
                uiController.exibirListaSaves();
                alert('Importado com sucesso!');
            } catch (err) {
                alert('Erro: ' + err.message);
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

function downloadSaves() {
    const saves = localStorageManager.getSaves();
    const nomeDoArquivo = 'repertorio-orgao-web.json';

    if (Object.keys(saves).length === 0) {
        return;
    }

    const dataString = JSON.stringify(saves, null, 2);
    const blob = new Blob([dataString], { type: 'application/json' });

    // Cria um link temporário para gerar url em memória e simula um click no link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nomeDoArquivo;
    document.body.appendChild(link);
    link.click();

    // limpeza
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function fullScreen() {
    if (isMobileDevice()) {
        if (!document.fullscreenElement &&    // Opera 12.1, Firefox, Chrome, Edge, Safari
            !document.webkitFullscreenElement && // Old WebKit
            !document.mozFullScreenElement && // Old Firefox
            !document.msFullscreenElement) {  // IE/Edge
            var el = document.documentElement;
            var requestMethod = el.requestFullscreen || el.webkitRequestFullscreen ||
                el.mozRequestFullScreen || el.msRequestFullscreen;

            if (requestMethod) {
                requestMethod.call(el);
            }

            let wakeLock = null;
            try {
                wakeLock = navigator.wakeLock.request("screen");
            } catch { }
        }
    }
}

function salvarSave(newSaveName) {
    let saves = JSON.parse(localStorage.getItem('saves')) || {};

    if (newSaveName) {
        newSaveName = newSaveName.trim();
        //newSaveName = newSaveName.charAt(0).toUpperCase() + newSaveName.slice(1).toLowerCase();        
        let temSaveName = Object.keys(saves).some(saveName => saveName.toLowerCase() === newSaveName.toLowerCase());
        //saves.hasOwnProperty(newSaveName)

        if (temSaveName && elements.searchModalLabel.textContent !== newSaveName) {
            uiController.exibirMensagemAlerta(`Já existe esse nome!`, 'Atenção!');
            uiController.resetarOkAlert();

            $('#alertModal').modal('show');
            return;
        }

        let selectedOption = elements.savesSelect.options[elements.savesSelect.selectedIndex];
        let titulo = itemModalLabel.innerText;

        if (titulo.includes("Editar - ")) {
            var oldSaveName = titulo.split(' - ')[1];
            if (oldSaveName !== newSaveName) {
                var saveContent = saves[oldSaveName];
                saves[newSaveName] = saveContent;
                delete saves[oldSaveName];
                selectedOption.textContent = newSaveName;
                selectedOption.value = newSaveName;
                localStorage.setItem('saves', JSON.stringify(saves));
            }
        } else if (alertModalLabel.innerText === "Deletar!") {
            const saveName = elements.savesSelect.value;
            if (saveName) {
                deletarSave(saveName);
                $('#searchModal').modal('hide');
                $('#alertModal').modal('hide');
            }
        } else {
            let newOption = document.createElement("option");
            newOption.text = newSaveName;
            newOption.value = newSaveName;
            elements.savesSelect.add(newOption);
            elements.savesSelect.value = newSaveName;

            var saveContent = elements.editTextarea.value;

            const musicaCifrada = cifraPlayer.destacarCifras(saveContent);
            const tom = descobrirTom(musicaCifrada);
            uiController.exibirTextoCifrasCarregado(tom, elements.editTextarea.value);
            elements.iframeCifra.contentDocument.body.innerHTML = cifraPlayer.destacarCifras(saveContent, tom);
            uiController.exibirIframeCifra();
            cifraPlayer.addEventCifrasIframe(elements.iframeCifra);

            if (saveContent.includes('<pre>')) {
                saveContent = saveContent.split('<pre>')[1].split('</pre>')[0].replace(/<\/?[^>]+(>|$)/g, "");
            }
            //saveContent = saveContent.replace(/<style[\s\S]*?<\/style>|<\/?[^>]+(>|$)/g, "");
            saves[newSaveName] = saveContent;
            localStorage.setItem('saves', JSON.stringify(saves));
            elements.savesSelect.value = newSaveName;
            elements.searchModalLabel.textContent = newSaveName;
        }

        $('#searchModal').modal('hide');
        uiController.exibirListaSaves(newSaveName);
    }
}

['mousedown'].forEach(event => {
    elements.playButton.addEventListener(event, togglePressedState);
    elements.notesButton.addEventListener(event, togglePressedState);
    elements.stopButton.addEventListener(event, togglePressedState);
    elements.acorde1.addEventListener(event, togglePressedState);
    elements.acorde2.addEventListener(event, togglePressedState);
    elements.acorde3.addEventListener(event, togglePressedState);
    elements.acorde4.addEventListener(event, togglePressedState);
    elements.acorde5.addEventListener(event, togglePressedState);
    elements.acorde6.addEventListener(event, togglePressedState);
    elements.acorde7.addEventListener(event, togglePressedState);
    elements.acorde8.addEventListener(event, togglePressedState);
    elements.acorde9.addEventListener(event, togglePressedState);
    elements.acorde10.addEventListener(event, togglePressedState);
    elements.acorde11.addEventListener(event, togglePressedState);
});

document.addEventListener('DOMContentLoaded', () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('Service Worker registrado com sucesso:', registration.scope);
                })
                .catch(registrationError => {
                    console.log('Falha ao registrar o Service Worker:', registrationError);
                });
        });
    }

    var cifrasLocal = './cifras.json';
	cifrasLocal = 'https://raw.githubusercontent.com/ronei0612/orgao.web/main/cifras.json';
    if (location.origin.includes('file:')) {
        cifrasLocal = 'https://roneicostasoares.com.br/orgao.web/cifras.json';
    }

    fetch(cifrasLocal)
        .then(response => {
            if (!response.ok) {
                throw new Error('Não foi possível carregar o arquivo de cifras local.');
            }
            return response.json();
        })
        .then(data => {
            todasAsCifras = data;
            console.log(`${todasAsCifras.length} cifras locais carregadas com sucesso.`);
        })
        .catch(error => {
            console.error(error);
        });

    // acorda a api
    fetch('https://apinode-h4wt.onrender.com/')
        .then(response => response.json())

    // Zera a barra de rolagem de missa
    localStorage.setItem('scrollTop', 0);

    // Configura o estado inicial do toggle de modo escuro
    elements.darkModeToggle.checked = true;
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        updateSwitchDarkMode();
        aplicarModoEscuroIframe();
    }

    // Exibe a lista de saves ao carregar a página
    uiController.exibirListaSaves();
});
