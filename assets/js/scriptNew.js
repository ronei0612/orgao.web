class CifraPlayer {
    constructor(elements) {
        this.elements = elements;
        this.acordeGroup = null;
        this.parado = true;
        this.acordeTocando = '';
        this.indiceAcorde = 0;
        this.tomAtual = 'C';
        this.notasAcordesJson = JSON.parse('{"A#":["a#","d","f"],"A#4":["a#","d#","f"],"A#5+":["a#","d","f#"],"A#6":["a#","d","f","g"],"A#7":["a#","d","f","g#"],"A#7M":["a#","d","f","a"],"A#9":["a#","d","f","c"],"A#m":["a#","c#","f"],"A#m5+":["a#","c#","f#"],"A#m6":["a#","c#","f","g"],"A#m7":["a#","c#","f","g#"],"A#m7M":["a#","c#","f","a"],"A#°":["a#","c#","e"],"A#°7":["a#","c#","e","g#"],"A":["a","c#","e"],"A4":["a","d","e"],"A5+":["a","c#","f"],"A6":["a","c#","e","f#"],"A7":["a","c#","e","g"],"A7M":["a","c#","e","g#"],"A9":["a","c#","e","b"],"Am":["a","c","e"],"Am5+":["a","c","f"],"Am6":["a","c","e","f#"],"Am7":["a","c","e","g"],"Am7M":["a","c","e","g#"],"A°":["a","c","d#"],"A°7":["a","c","d#","g"],"Ab":["g#","c","d#"],"Ab4":["g#","c#","d#"],"Ab5+":["g#","c","e"],"Ab6":["g#","c","d#","f"],"Ab7":["g#","c","d#","f#"],"Ab7M":["g#","c","d#","g"],"Ab9":["g#","c","d#","a#"],"Abm":["g#","b","d#"],"Abm5+":["g#","b","e"],"Abm6":["g#","b","d#","f"],"Abm7":["g#","b","d#","f#"],"Abm7M":["g#","b","d#","g"],"Ab°":["g#","b","d"],"Ab°7":["g#","b","d","f#"],"B":["b","d#","f#"],"B4":["b","e","f#"],"B5+":["b","d#","g"],"B6":["b","d#","f#","g#"],"B7":["b","d#","f#","a"],"B7M":["b","d#","f#","a#"],"B9":["b","d#","f#","c#"],"Bm":["b","d","f#"],"Bm5+":["b","d","g"],"Bm6":["b","d","f#","g#"],"Bm7":["b","d","f#","a"],"Bm7M":["b","d","f#","a#"],"B°":["b","d","f"],"B°7":["b","d","f","a"],"Bb":["a#","d","f"],"Bb4":["a#","d#","f"],"Bb5+":["a#","d","f#"],"Bb6":["a#","d","f","g"],"Bb7":["a#","d","f","g#"],"Bb7M":["a#","d","f","a"],"Bb9":["a#","d","f","c"],"Bbm":["a#","c#","f"],"Bbm5+":["a#","c#","f#"],"Bbm6":["a#","c#","f","g"],"Bbm7":["a#","c#","f","g#"],"Bbm7M":["a#","c#","f","a"],"Bb°":["a#","c#","e"],"Bb°7":["a#","c#","e","g#"],"Cb":["b","d#","f#"],"Cb4":["b","e","f#"],"Cb5+":["b","d#","g"],"Cb6":["b","d#","f#","g#"],"Cb7":["b","d#","f#","a"],"Cb7M":["b","d#","f#","a#"],"Cb9":["b","d#","f#","c#"],"Cbm":["b","d","f#"],"Cbm5+":["b","d","g"],"Cbm6":["b","d","f#","g#"],"Cbm7":["b","d","f#","a"],"Cbm7M":["b","d","f#","a#"],"Cb°":["b","d","f"],"Cb°7":["b","d","f","a"],"C#":["c#","f","g#"],"C#4":["c#","f#","g#"],"C#5+":["c#","f","a"],"C#6":["c#","f","g#","a#"],"C#7":["c#","f","g#","b"],"C#7M":["c#","f","g#","c"],"C#9":["c#","f","g#","d#"],"C#m":["c#","e","g#"],"C#m5+":["c#","e","a"],"C#m6":["c#","e","g#","a#"],"C#m7":["c#","e","g#","b"],"C#m7M":["c#","e","g#","c"],"C#°":["c#","e","g"],"C#°7":["c#","e","g","b"],"C":["c","e","g"],"C4":["c","f","g"],"C5+":["c","e","g#"],"C6":["c","e","g","a"],"C7":["c","e","g","a#"],"C7M":["c","e","g","b"],"C9":["c","e","g","d"],"Cm":["c","d#","g"],"Cm5+":["c","d#","g#"],"Cm6":["c","d#","g","a"],"Cm7":["c","d#","g","a#"],"Cm7M":["c","d#","g","b"],"C°":["c","d#","f#"],"C°7":["c","d#","f#","a#"],"B#":["c","e","g"],"B#4":["c","f","g"],"B#5+":["c","e","g#"],"B#6":["c","e","g","a"],"B#7":["c","e","g","a#"],"B#7M":["c","e","g","b"],"B#9":["c","e","g","d"],"B#m":["c","d#","g"],"B#m5+":["c","d#","g#"],"B#m6":["c","d#","g","a"],"B#m7":["c","d#","g","a#"],"B#m7M":["c","d#","g","b"],"B#°":["c","d#","f#"],"B#°7":["c","d#","f#","a#"],"D":["d","f#","a"],"D#":["d#","g","a#"],"D#4":["d#","g#","a#"],"D#5+":["d#","g","b"],"D#6":["d#","g","a#","c"],"D#7":["d#","g","a#","c#"],"D#7M":["d#","g","a#","d"],"D#9":["d#","g","a#","f"],"D#m":["d#","f#","a#"],"D#m5+":["d#","f#","b"],"D#m6":["d#","f#","a#","c"],"D#m7":["d#","f#","a#","c#"],"D#m7M":["d#","f#","a#","d"],"D#°":["d#","f#","a"],"D#°7":["d#","f#","a","c#"],"D4":["d","g","a"],"D5+":["d","f#","a#"],"D6":["d","f#","a","b"],"D7":["d","f#","a","c"],"D7M":["d","f#","a","c#"],"D9":["d","f#","a","e"],"Db":["c#","f","g#"],"Db4":["c#","f#","g#"],"Db5+":["c#","f","a"],"Db6":["c#","f","g#","a#"],"Db7":["c#","f","g#","b"],"Db7M":["c#","f","g#","c"],"Db9":["c#","f","g#","d#"],"Dbm":["c#","e","g#"],"Dbm5+":["c#","e","a"],"Dbm6":["c#","e","g#","a#"],"Dbm7":["c#","e","g#","b"],"Dbm7M":["c#","e","g#","c"],"Db°":["c#","e","g"],"Db°7":["c#","e","g","b"],"Dm":["d","f","a"],"Dm5+":["d","f","a#"],"Dm6":["d","f","a","b"],"Dm7":["d","f","a","c"],"Dm7M":["d","f","a","c#"],"D°":["d","f","g#"],"D°7":["d","f","g#","c"],"Eb":["d#","g","a#"],"Eb4":["d#","g#","a#"],"Eb5+":["d#","g","b"],"Eb6":["d#","g","a#","c"],"Eb7":["d#","g","a#","c#"],"Eb7M":["d#","g","a#","d"],"Eb9":["d#","g","a#","f"],"Ebm":["d#","f#","a#"],"Ebm5+":["d#","f#","b"],"Ebm6":["d#","f#","a#","c"],"Ebm7":["d#","f#","a#","c#"],"Ebm7M":["d#","f#","a#","d"],"Eb°":["d#","f#","a"],"Eb°7":["d#","f#","a","c#"],"E":["e","g#","b"],"E4":["e","a","b"],"E5+":["e","g#","c"],"E6":["e","g#","b","c#"],"E7":["e","g#","b","d"],"E7M":["e","g#","b","d#"],"E9":["e","g#","b","f#"],"Em":["e","g","b"],"Em5+":["e","g","c"],"Em6":["e","g","b","c#"],"Em7":["e","g","b","d"],"Em7M":["e","g","b","d#"],"E°":["e","g","a#"],"E°7":["e","g","a#","d"],"Fb":["e","g#","b"],"Fb4":["e","a","b"],"Fb5+":["e","g#","c"],"Fb6":["e","g#","b","c#"],"Fb7":["e","g#","b","d"],"Fb7M":["e","g#","b","d#"],"Fb9":["e","g#","b","f#"],"Fbm":["e","g","b"],"Fbm5+":["e","g","c"],"Fbm6":["e","g","b","c#"],"Fbm7":["e","g","b","d"],"Fbm7M":["e","g","b","d#"],"Fb°":["e","g","a#"],"Fb°7":["e","g","a#","d"],"F#":["f#","a#","c#"],"F#4":["f#","b","c#"],"F#5+":["f#","a#","d"],"F#6":["f#","a#","c#","d#"],"F#7":["f#","a#","c#","e"],"F#7M":["f#","a#","c#","f"],"F#9":["f#","a#","c#","g#"],"F#m":["f#","a","c#"],"F#m5+":["f#","a","d"],"F#m6":["f#","a","c#","d#"],"F#m7":["f#","a","c#","e"],"F#m7M":["f#","a","c#","f"],"F#°":["f#","a","c"],"F#°7":["f#","a","c","e"],"E#":["f","a","c"],"E#4":["f","a#","c"],"E#5+":["f","a","c#"],"E#6":["f","a","c","d"],"E#7":["f","a","c","d#"],"E#7M":["f","a","c","e"],"E#9":["f","a","c","g"],"E#m":["f","g#","c"],"E#m5+":["f","g#","c#"],"E#m6":["f","g#","c","d"],"E#m7":["f","g#","c","d#"],"E#m7M":["f","g#","c","e"],"E#°":["f","g#","b"],"E#°7":["f","g#","b","d#"],"F":["f","a","c"],"F4":["f","a#","c"],"F5+":["f","a","c#"],"F6":["f","a","c","d"],"F7":["f","a","c","d#"],"F7M":["f","a","c","e"],"F9":["f","a","c","g"],"Fm":["f","g#","c"],"Fm5+":["f","g#","c#"],"Fm6":["f","g#","c","d"],"Fm7":["f","g#","c","d#"],"Fm7M":["f","g#","c","e"],"F°":["f","g#","b"],"F°7":["f","g#","b","d#"],"G":["g","b","d"],"G#":["g#","c","d#"],"G#4":["g#","c#","d#"],"G#5+":["g#","c","e"],"G#6":["g#","c","d#","f"],"G#7":["g#","c","d#","f#"],"G#7M":["g#","c","d#","g"],"G#9":["g#","c","d#","a#"],"G#m":["g#","b","d#"],"G#m5+":["g#","b","e"],"G#m6":["g#","b","d#","f"],"G#m7":["g#","b","d#","f#"],"G#m7M":["g#","b","d#","g"],"G#°":["g#","b","d"],"G#°7":["g#","b","d","f#"],"G4":["g","c","d"],"G5+":["g","b","d#"],"G6":["g","b","d","e"],"G7":["g","b","d","f"],"G7M":["g","b","d","f#"],"G9":["g","b","d","a"],"Gb":["f#","a#","c#"],"Gb4":["f#","b","c#"],"Gb5+":["f#","a#","d"],"Gb6":["f#","a#","c#","d#"],"Gb7":["f#","a#","c#","e"],"Gb7M":["f#","a#","c#","f"],"Gb9":["f#","a#","c#","g#"],"Gbm":["f#","a","c#"],"Gbm5+":["f#","a","d"],"Gbm6":["f#","a","c#","d#"],"Gbm7":["f#","a","c#","e"],"Gbm7M":["f#","a","c#","f"],"Gb°":["f#","a","c"],"Gb°7":["f#","a","c","e"],"Gm":["g","a#","d"],"Gm5+":["g","a#","d#"],"Gm6":["g","a#","d","e"],"Gm7":["g","a#","d","f"],"Gm7M":["g","a#","d","f#"],"G°":["g","a#","c#"],"G°7":["g","a#","c#","f"]}');
        //"A#", "A#4", "A#5+", "A#6", "A#7", "A#7M", "A#9", "A#m", "A#m5+", "A#m6", "A#m7", "A#m7M", "A#°", "A#°7", "A", "A4", "A5+", "A6", "A7", "A7M", "A9", "Am", "Am5+", "Am6", "Am7", "Am7M", "A°", "A°7", "Ab", "Ab4", "Ab5+", "Ab6", "Ab7", "Ab7M", "Ab9", "Abm", "Abm5+", "Abm6", "Abm7", "Abm7M", "Ab°", "Ab°7", "B", "B4", "B5+", "B6", "B7", "B7M", "B9", "Bm", "Bm5+", "Bm6", "Bm7", "Bm7M", "B°", "B°7", "Bb", "Bb4", "Bb5+", "Bb6", "Bb7", "Bb7M", "Bb9", "Bbm", "Bbm5+", "Bbm6", "Bbm7", "Bbm7M", "Bb°", "Bb°7", "Cb", "Cb4", "Cb5+", "Cb6", "Cb7", "Cb7M", "Cb9", "Cbm", "Cbm5+", "Cbm6", "Cbm7", "Cbm7M", "Cb°", "Cb°7", "C#", "C#4", "C#5+", "C#6", "C#7", "C#7M", "C#9", "C#m", "C#m5+", "C#m6", "C#m7", "C#m7M", "C#°", "C#°7", "C", "C4", "C5+", "C6", "C7", "C7M", "C9", "Cm", "Cm5+", "Cm6", "Cm7", "Cm7M", "C°", "C°7", "B#", "B#4", "B#5+", "B#6", "B#7", "B#7M", "B#9", "B#m", "B#m5+", "B#m6", "B#m7", "B#m7M", "B#°", "B#°7", "D", "D#", "D#4", "D#5+", "D#6", "D#7", "D#7M", "D#9", "D#m", "D#m5+", "D#m6", "D#m7", "D#m7M", "D#°", "D#°7", "D4", "D5+", "D6", "D7", "D7M", "D9", "Db", "Db4", "Db5+", "Db6", "Db7", "Db7M", "Db9", "Dbm", "Dbm5+", "Dbm6", "Dbm7", "Dbm7M", "Db°", "Db°7", "Dm", "Dm5+", "Dm6", "Dm7", "Dm7M", "D°", "D°7", "Eb", "Eb4", "Eb5+", "Eb6", "Eb7", "Eb7M", "Eb9", "Ebm", "Ebm5+", "Ebm6", "Ebm7", "Ebm7M", "Eb°", "Eb°7", "E", "E4", "E5+", "E6", "E7", "E7M", "E9", "Em", "Em5+", "Em6", "Em7", "Em7M", "E°", "E°7", "Fb", "Fb4", "Fb5+", "Fb6", "Fb7", "Fb7M", "Fb9", "Fbm", "Fbm5+", "Fbm6", "Fbm7", "Fbm7M", "Fb°", "Fb°7", "F#", "F#4", "F#5+", "F#6", "F#7", "F#7M", "F#9", "F#m", "F#m5+", "F#m6", "F#m7", "F#m7M", "F#°", "F#°7", "E#", "E#4", "E#5+", "E#6", "E#7", "E#7M", "E#9", "E#m", "E#m5+", "E#m6", "E#m7", "E#m7M", "E#°", "E#°7", "F", "F4", "F5+", "F6", "F7", "F7M", "F9", "Fm", "Fm5+", "Fm6", "Fm7", "Fm7M", "F°", "F°7", "G", "G#", "G#4", "G#5+", "G#6", "G#7", "G#7M", "G#9", "G#m", "G#m5+", "G#m6", "G#m7", "G#m7M", "G#°", "G#°7", "G4", "G5+", "G6", "G7", "G7M", "G9", "Gb", "Gb4", "Gb5+", "Gb6", "Gb7", "Gb7M", "Gb9", "Gbm", "Gbm5+", "Gbm6", "Gbm7", "Gbm7M", "Gb°", "Gb°7", "Gm", "Gm5+", "Gm6", "Gm7", "Gm7M", "G°", "G°7"
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
        this.tonsMenores = this.tonsMaiores.map(tom => tom + 'm');
        this.acordesSustenidos = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        this.acordesBemol = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        this.acordesSustenidosBemol = this.acordesSustenidos.concat(this.acordesBemol);
        this.acordesMap = {
            'B#': 'C',
            'E#': 'F',
            'Cb': 'B',
            'Fb': 'E'
        };
        this.audioPath = location.origin.includes('file:') ? 'https://roneicostasoares.com.br/orgao.web/assets/audio/' : './assets/audio/';
        this.carregarAcordes();
    }

    destacarCifras(texto) {
        const linhas = texto.split('\n');
        let cifraNum = 1;
        const temPalavra = /[a-zA-Z]{4,}/;
        const temColchetes = /\[.*?\]/;
    
        const linhasDestacadas = linhas.map(linha => {
            //if (linha && ((!temLetrasNaoCifra.test(linha) && !temPalavra.test(linha)) || temColchetes.test(linha))) {
            //if (linha && (this.notasAcordes.includes(linha))) {// || !temColchetes.test(linha))) {
            if (linha) {
                const acordes = linha.trim().split(/\s+/);                
                const ehLinhaDeAcordeUnico = acordes.length === 1 && this.notasAcordes.includes(acordes[0].split('/')[0]);
                const ehLinhaDeAcordesConsecutivos = acordes.length >= 2 && this.notasAcordes.includes(acordes[0].split('/')[0]) && this.notasAcordes.includes(acordes[1].split('/')[0]);
                const linhDeColcheteseAcordes = temColchetes.test(linha) && acordes.length >= 2 && this.notasAcordes.includes(acordes[1].split('/')[0]);

                if (ehLinhaDeAcordeUnico || ehLinhaDeAcordesConsecutivos || linhDeColcheteseAcordes) {
                    const espacos = linha.match(/\s+/g) || [];
                    const linhaProcessada = acordes.map((palavra, index) => {
                        let acorde = this.processarAcorde(palavra, cifraNum);
                        if (acorde.startsWith('<b'))
                            cifraNum++;
                        return index < acordes.length - 1 && espacos[index] ? acorde + espacos[index] : acorde;
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
        const tempElement = document.createElement('div');
        tempElement.innerHTML = musica;
    
        const spans = tempElement.querySelectorAll('span');
        spans.forEach(span => span.remove());
    
        let final = tempElement.innerHTML.replace("font-family: Consolas, 'Courier New', Courier, monospace;", "font-family: 'Roboto', sans-serif;")
            .replace("font-size: 12pt;", "font-size: 15pt;");
    
        //final = final.replace(/(\r\n|\n|\r){2,}/g, '$1');
        final = final.replace(/(\n\n)/g, '\n');
    
        this.elements.iframeCifra.contentDocument.body.innerHTML = final;
    }
    
    processarAcorde(palavra, cifraNum) {
        let acorde = palavra;
        let baixo = '';
    
        if (acorde.includes('/') && !acorde.includes('(')) {
            [acorde, baixo] = acorde.split('/');
            baixo = this.getAcorde(baixo);
    
            while (!this.notasAcordes.includes(acorde) && acorde) {
                acorde = acorde.slice(0, -1);
            }
            acorde = this.getAcorde(acorde);
            acorde = this.acordesSustenidosBemol.includes(baixo) ? `${acorde}/${baixo}` : palavra;
        } else {
            while (!this.notasAcordes.includes(acorde) && acorde) {
                acorde = acorde.slice(0, -1);
            }
            acorde = this.getAcorde(acorde);
        }
    
        return this.notasAcordes.includes(acorde.split('/')[0]) ? `<b id="cifra${cifraNum}">${acorde}</b>` : palavra;
    }    

    getAcorde(acorde) {
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
            mostrarTextoCifrasCarregado(novoTom, cifra);

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
        
        localStorage.setItem('tomAcordes', novoTom);

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
        return tons[novoIndex];
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
        this.acordeTocando = acorde;
    
        if (!this.acordeGroup) {  
            this.acordeGroup = new Pizzicato.Group();
            this.acordeGroup.attack = 0.1;
        }
    
        let [notaPrincipal, baixo] = acorde.split('/');
        const notas = this.notasAcordesJson[notaPrincipal];
        if (!notas) return;
    
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
                    this.adicionarSomAoGrupo('strings', nota.replace('#', '_', 0.9));
            }
        });
    
        setTimeout(() => {
            if (!this.parado && this.acordeTocando) {
                console.log(`Playing: ${acorde}`);
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

const holdTime = 1000;
var held = false;
var timer;

window.onerror = function (message, source, lineno, colno, error) {
	alert("Erro!\n" + message + '\nArquivo: ' + source + '\nLinha: ' + lineno + '\nPosicao: ' + colno);
};

document.addEventListener('DOMContentLoaded', () => {
    // acorda a api
    fetch('https://apinode-h4wt.onrender.com/')
        .then(response => response.json())

    // Zera a barra de rolagem de missa
    localStorage.setItem('scrollTop', 0);
    localStorage.setItem('tomAcordes', '');

    elements.darkModeToggle.checked = true;
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        updateSwitchDarkMode();
        aplicarModoEscuroIframe();
    }
    exibirListaSaves();
});

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
                elements.alertModalMessage.textContent = `Salvar "${saveName}"?`;
                //elements.alertModalMessage.textContent = `Atenção! Já existe "${saveName}". Deseja sobrescrever?`;
                elements.alertModalLabel.textContent = `Salvar "${saveName}"`;
                elements.simButtonAlert.textContent = '✓ Sim';
                elements.simButtonAlert.classList.remove('d-none');
                elements.naoButtonAlert.classList.remove('d-none');
                elements.okButtonAlert.classList.add('d-none');
                elements.cancelButtonAlert.classList.add('d-none');

                $('#alertModal').modal('show');
            }
            else {
                salvarSave(saveName);

                elements.alertModalMessage.textContent = `"${saveName}" salvo com sucesso!`;
                elements.alertModalLabel.textContent = 'Música';
                elements.simButtonAlert.classList.add('d-none');
                elements.naoButtonAlert.classList.add('d-none');
                elements.okButtonAlert.classList.remove('d-none');
                elements.cancelButtonAlert.classList.add('d-none');

                $('#alertModal').modal('show');
            }
        }

        //fullScreen();
    } else {
        elements.editTextarea.focus();
    }
});

elements.darkModeToggle.addEventListener('change', toggleDarkMode);

elements.startButton.addEventListener('click', () => {
    if (elements.editTextarea.value) {
        mostrarBotoesCifras();
        const texto = elements.editTextarea.value;
        const musicaCifrada = cifraPlayer.destacarCifras(texto);        
        const tom = descobrirTom(musicaCifrada);
        mostrarTextoCifrasCarregado(tom, elements.editTextarea.value);
        elements.iframeCifra.contentDocument.body.innerHTML = musicaCifrada;
        if (!tom)
            elements.tomSelect.dispatchEvent(new Event('change'));
        elements.iframeCifra.classList.remove('d-none');
        elements.liturgiaDiariaFrame.classList.add('d-none');
        elements.santamissaFrame.classList.add('d-none');
        elements.oracoesFrame.classList.add('d-none');
        cifraPlayer.addEventCifrasIframe(elements.iframeCifra);
        
        cifraPlayer.indiceAcorde = 0;
        $('#searchModal').modal('hide');
    }
    else {
        elements.searchInput.focus();
    }
});

elements.prevButton.addEventListener('click', () => {
    elements.nextButton.classList.remove('d-none');
    if (elements.controlButtons.classList.contains('justify-content-center')) {
        elements.controlButtons.classList.remove('justify-content-center');
        elements.controlButtons.classList.add('justify-content-left');
        elements.prevButton.classList.add('d-none');
    }
    else if (elements.controlButtons.classList.contains('justify-content-end')) {
        elements.controlButtons.classList.remove('justify-content-end');
        elements.controlButtons.classList.add('justify-content-center');
    }
});

elements.nextButton.addEventListener('click', () => {
    elements.prevButton.classList.remove('d-none');
    if (elements.controlButtons.classList.contains('justify-content-center')) {
        elements.controlButtons.classList.remove('justify-content-center');
        elements.controlButtons.classList.add('justify-content-end');
        elements.nextButton.classList.add('d-none');
    }
    else if (elements.controlButtons.classList.contains('justify-content-left')) {
        elements.controlButtons.classList.remove('justify-content-left');
        elements.controlButtons.classList.add('justify-content-center');
    }
});

elements.tomSelect.addEventListener('change', (event) => {
    if (elements.tomSelect.value) { // Selecionado Letra
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
        mostrarBotoesCifras();
        const saves = JSON.parse(localStorage.getItem('saves'));
        elements.editTextarea.value = saves[selectItem];
        elements.searchModalLabel.textContent = selectItem;
        elements.savesSelect.style.color = 'black';
        const texto = elements.editTextarea.value;
        const musicaCifrada = cifraPlayer.destacarCifras(texto);
        const tom = descobrirTom(musicaCifrada);
        elements.iframeCifra.contentDocument.body.innerHTML = musicaCifrada;
        mostrarTextoCifrasCarregado(tom, elements.editTextarea.value);
        if (!tom)
            elements.tomSelect.dispatchEvent(new Event('change'));
        elements.iframeCifra.classList.remove('d-none');
        elements.liturgiaDiariaFrame.classList.add('d-none');
        elements.santamissaFrame.classList.add('d-none');
        elements.oracoesFrame.classList.add('d-none');
        cifraPlayer.addEventCifrasIframe(elements.iframeCifra);
        
        cifraPlayer.indiceAcorde = 0;
    }
    else {
        mostrarBotoesAcordes();
        elements.savesSelect.selectedIndex = 0;
        elements.iframeCifra.contentDocument.body.innerHTML = '';
        const tom = localStorage.getItem('tomAcordes');
        if (tom) {
            cifraPlayer.preencherSelect(tom);
        }
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

    toggleEditDeleteButtons();
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
        elements.alertModalMessage.textContent = `Deseja excluir "${saveName}"?`;
        elements.alertModalLabel.textContent = 'Atenção!';
        elements.simButtonAlert.textContent = '✓ Sim';
        elements.simButtonAlert.classList.remove('d-none');
        elements.okButtonAlert.classList.add('d-none');
        elements.cancelButtonAlert.classList.remove('d-none');

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

elements.liturgiaDiariaLink.addEventListener('click', () => {
    elements.oracoesFrame.classList.add('d-none');
    elements.santamissaFrame.classList.add('d-none');
    elements.iframeCifra.classList.add('d-none');
    elements.liturgiaDiariaFrame.classList.remove('d-none');
    elements.savesSelect.selectedIndex = 0;
    $('#optionsModal').modal('hide');
});

elements.oracoesLink.addEventListener('click', () => {
    elements.oracoesFrame.classList.remove('d-none');
    elements.santamissaFrame.classList.add('d-none');
    elements.iframeCifra.classList.add('d-none');
    elements.liturgiaDiariaFrame.classList.add('d-none');
    elements.savesSelect.selectedIndex = 0;
    $('#optionsModal').modal('hide');
});

elements.missaOrdinarioLink.addEventListener('click', () => {
    elements.santamissaFrame.classList.remove('d-none');

    const scrollTop = localStorage.getItem('scrollTop');
    if (scrollTop && !location.origin.includes('file:')) {
        elements.santamissaFrame.contentWindow.scrollTo(0, parseInt(scrollTop));
    }

    elements.oracoesFrame.classList.add('d-none');
    elements.liturgiaDiariaFrame.classList.add('d-none');
    elements.iframeCifra.classList.add('d-none');
    elements.savesSelect.selectedIndex = 0;
    $('#optionsModal').modal('hide');
});

elements.notesButton.addEventListener('click', () => {
    //cifraPlayer.alternarNotas();
    
    // quando pressionar botão das notas, não tocar o acorde denovo
    // if (!elements.acorde1.classList.contains('d-none')) {
    //     cifraPlayer.tocarAcorde(cifraPlayer.acordeTocando);
    // }
});

elements.stopButton.addEventListener('mousedown', () => {
    cifraPlayer.pararReproducao();
});

elements.playButton.addEventListener('click', () => {
    cifraPlayer.iniciarReproducao();
})

elements.simButtonAlert.addEventListener('click', () => {
    if (elements.alertModalMessage.textContent.toLowerCase().includes('?')) {
        const saveName = elements.searchModalLabel.textContent;
        salvarSave(saveName);
        elements.startButton.dispatchEvent(new Event('click'));
    }
    else {
        const saveName = elements.savesSelect.value;
        deletarSave(saveName);
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
        hideEditDeleteButtons();
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
    elements.searchResultsList.classList.add('d-none');
    elements.editTextarea.classList.remove('d-none');
});

$('#alertModal').on('shown.bs.modal', () => {
    elements.itemNameInput.focus();
});

function hideEditDeleteButtons() {
    if (elements.deleteSavesSelect.classList.contains('show')) {
        elements.deleteSavesSelect.classList.remove('show');
        elements.editSavesSelect.classList.remove('show');
        elements.addButton.classList.add('rounded-right-custom');
        elements.addButton.classList.remove('rounded-0');

        setTimeout(() => {
            elements.deleteSavesSelect.classList.add('d-none');
            elements.editSavesSelect.classList.add('d-none');
        }, 100);
    }
}

function toggleEditDeleteButtons() {
    if (elements.deleteSavesSelect.classList.contains('d-none')) {
        elements.deleteSavesSelect.classList.remove('d-none');
        elements.editSavesSelect.classList.remove('d-none');

        setTimeout(() => {
            elements.deleteSavesSelect.classList.add('show');
            elements.editSavesSelect.classList.add('show');
        }, 10); // Pequeno atraso para permitir que o efeito seja aplicado
    } else {
        elements.deleteSavesSelect.classList.remove('show');
        elements.editSavesSelect.classList.remove('show');

        setTimeout(() => {
            elements.deleteSavesSelect.classList.add('d-none');
            elements.editSavesSelect.classList.add('d-none');
        }, 100);
    }

    elements.addButton.classList.toggle('rounded-0');
    elements.addButton.classList.toggle('rounded-right-custom');
}

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

function exibirListaSaves(saveSelected) {
    elements.addButton.classList.add('rounded-right-custom');
    elements.addButton.classList.remove('rounded-0');
    elements.deleteSavesSelect.classList.add('d-none');
    elements.editSavesSelect.classList.add('d-none');

    elements.savesSelect.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Selecione uma Música...';
    defaultOption.selected = true;
    defaultOption.hidden = true;
    elements.savesSelect.appendChild(defaultOption);

    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.text = '';
    elements.savesSelect.appendChild(emptyOption);

    elements.savesSelect.style.color = '';

    let saves = localStorage.getItem('saves');
    if (saves && saves !== '{}') {
        saves = JSON.parse(saves);

        let saveNames = Object.keys(saves).sort();

        saveNames.forEach(function (saveName) {
            const listItem = criarItemSelect(saveName, saves[saveName]);
            elements.savesSelect.appendChild(listItem);
        });

        if (saveSelected) {
            elements.savesSelect.value = saveSelected;
            elements.savesSelect.style.color = 'black';
        }
    }
}

function criarItemSelect(saveName, saveContent) {
    const option = document.createElement('option');

    option.value = saveName;
    option.textContent = saveName;

    // Important: Check if the option already exists to avoid duplicates
    const existingOption = elements.savesSelect.querySelector(`option[value="${saveName}"]`);
    if (!existingOption) {
        elements.savesSelect.appendChild(option);
    }

    // Optionally, add an event listener for the select option
    option.addEventListener('click', () => {
        //Handle what happens when the option is selected
        //You would likely want to load the saveContent into editTextarea
        //Example, but adjust this to your needs.
        elements.editTextarea.value = saveContent;
        elements.searchModalLabel.textContent = saveName; //Update modal label
    });

    return option;
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

    exibirListaSaves();
}

async function searchMusic() {
    elements.editTextarea.classList.add('d-none');
    elements.searchIcon.classList.add('d-none');
    elements.spinner.classList.remove('d-none');
    elements.saveButton.classList.add('d-none');
    elements.startButton.classList.add('d-none');
    elements.searchResultsList.classList.remove('d-none');
    elements.searchResultsList.innerHTML = '';
    elements.searchButton.disabled = true;

    const textoPesquisa = elements.searchInput.value;

    try {
        const response = await fetch('https://apinode-h4wt.onrender.com/pesquisar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: textoPesquisa }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (data.success) {
            const { lista: titles, links } = data; // destructuring
            const max = 5;
            if (titles.length > 0) {
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
            } else {
                elements.searchResultsList.innerHTML = '<li class="list-group-item">Nenhuma cifra encontrada.</li>';
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        alert(`Erro na busca: ${error.message}`);
        elements.savesList.classList.remove('d-none');
        elements.searchResultsList.classList.add('d-none');
    } finally {
        elements.searchButton.disabled = false;
        elements.spinner.classList.add('d-none');
        elements.searchIcon.classList.remove('d-none');
    }
}

async function choseLink(urlLink, text) {
    elements.searchButton.disabled = true;
    elements.spinner.classList.remove('d-none');
    elements.searchIcon.classList.add('d-none');
    elements.searchResultsList.innerHTML = '';

    try {
        const response = await fetch('https://apinode-h4wt.onrender.com/downloadsite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: urlLink }),
        });
        const data = await response.json();
        if (data.success) {
            mostrarTextoCifrasCarregado(null, data.message);

            if (elements.searchModalLabel.textContent === 'Música') {
                elements.searchModalLabel.textContent = text.split(' - ')[0];
            }
            elements.editTextarea.classList.remove('d-none');
            elements.startButton.classList.remove('d-none');
            elements.addButton.classList.remove('d-none');
            elements.saveButton.classList.remove('d-none');
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Erro ao baixar a cifra. Tente novamente mais tarde.');
    } finally {
        elements.searchButton.disabled = false;
        elements.spinner.classList.add('d-none');
        elements.searchIcon.classList.remove('d-none');
        elements.searchResultsList.classList.add('d-none');
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
            elements.santamissaFrame.contentDocument.body.style.color = '#FFFFFF';
            elements.oracoesFrame.contentDocument.body.style.color = '#FFFFFF';
        }
    }
    else {
        if (!location.origin.includes('file:')) {
            elements.santamissaFrame.style.backgroundColor = '#FFFFFF';
            elements.oracoesFrame.style.backgroundColor = '#FFFFFF';
            elements.santamissaFrame.contentDocument.body.style.color = '#000000';
            elements.oracoesFrame.contentDocument.body.style.color = '#000000';
        }
    }
    
    const scrollTop = localStorage.getItem('scrollTop');
    if (scrollTop && !location.origin.includes('file:')) {
        elements.santamissaFrame.contentWindow.scrollTo(0, parseInt(scrollTop));
    }
};

function mostrarTextoCifrasCarregado(tom = null, texto = null) {
    if (tom) {
        cifraPlayer.preencherSelect(tom);
    }
    else {
        elements.tomSelect.innerHTML = '<option value="">Letra</option>';
    }

    if (texto) {
        //const textoSemTags = texto.replace(/<style[\s\S]*?<\/style>|<\/?[^>]+(>|$)/g, "");
        if (texto.includes('<pre>')) {
            elements.editTextarea.value = texto.split('<pre>')[1].split('</pre>')[0].replace(/<\/?[^>]+(>|$)/g, "");
        }
        else {
            elements.editTextarea.value = texto;
        }
    }
}

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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
            elements.alertModalMessage.textContent = `Já existe esse nome!`;
            elements.alertModalLabel.textContent = 'Atenção!';
            elements.okButtonAlert.classList.remove('d-none');
            elements.simButtonAlert.classList.add('d-none');
            elements.naoButtonAlert.classList.add('d-none');
            elements.cancelButtonAlert.classList.add('d-none');

            $('#alertModal').modal('show');
            return;
        }

        let selectedOption = elements.savesSelect.options[elements.savesSelect.selectedIndex];
        let titulo = itemModalLabel.innerText;

        if (titulo.includes("Editar - ")) {
            var oldSaveName = titulo.split(' - ')[1];
            var saveContent = saves[oldSaveName];
            saves[newSaveName] = saveContent;
            delete saves[oldSaveName];
            selectedOption.textContent = newSaveName;
            selectedOption.value = newSaveName;
            localStorage.setItem('saves', JSON.stringify(saves));
        } else {
            let newOption = document.createElement("option");
            newOption.text = newSaveName;
            newOption.value = newSaveName;
            elements.savesSelect.add(newOption);
            elements.savesSelect.value = newSaveName;

            var saveContent = elements.editTextarea.value;

            const musicaCifrada = cifraPlayer.destacarCifras(saveContent);
            const tom = descobrirTom(musicaCifrada);
            mostrarTextoCifrasCarregado(tom, elements.editTextarea.value);
            elements.iframeCifra.contentDocument.body.innerHTML = cifraPlayer.destacarCifras(tom, saveContent);
            elements.iframeCifra.classList.remove('d-none');
            elements.liturgiaDiariaFrame.classList.add('d-none');
            elements.santamissaFrame.classList.add('d-none');
            elements.oracoesFrame.classList.add('d-none');
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
        exibirListaSaves(newSaveName);
    }
}

function mostrarBotoesCifras() {
    elements.playButton.classList.remove('d-none');
    elements.nextButton.classList.remove('d-none');
    elements.prevButton.classList.remove('d-none');
    elements.acorde1.classList.add('d-none');
    elements.acorde2.classList.add('d-none');
    elements.acorde3.classList.add('d-none');
    elements.acorde4.classList.add('d-none');
    elements.acorde5.classList.add('d-none');
    elements.acorde6.classList.add('d-none');
    elements.acorde7.classList.add('d-none');
    elements.acorde8.classList.add('d-none');
    elements.acorde9.classList.add('d-none');
    elements.acorde10.classList.add('d-none');
    elements.acorde11.classList.add('d-none');
    // elements.borderLeft.classList.add('d-none');
    // elements.borderRight.classList.add('d-none');
}

function mostrarBotoesAcordes() {
    elements.playButton.classList.add('d-none');
    elements.nextButton.classList.add('d-none');
    elements.prevButton.classList.add('d-none');
    elements.acorde1.classList.remove('d-none');
    elements.acorde2.classList.remove('d-none');
    elements.acorde3.classList.remove('d-none');
    elements.acorde4.classList.remove('d-none');
    elements.acorde5.classList.remove('d-none');
    elements.acorde6.classList.remove('d-none');
    elements.acorde7.classList.remove('d-none');
    elements.acorde8.classList.remove('d-none');
    elements.acorde9.classList.remove('d-none');
    elements.acorde10.classList.remove('d-none');
    elements.acorde11.classList.remove('d-none');
    // elements.borderLeft.classList.remove('d-none');
    // elements.borderRight.classList.remove('d-none');
}

//comentado para não funcionar mais o segurar do notes
// elements.notesButton.addEventListener('mousedown', handleInteractionStart);
// elements.notesButton.addEventListener('touchstart', handleInteractionStart);

// elements.notesButton.addEventListener('mouseup', handleInteractionEnd);
// elements.notesButton.addEventListener('mouseleave', handleInteractionEnd);
// elements.notesButton.addEventListener('touchend', handleInteractionEnd);
// elements.notesButton.addEventListener('touchcancel', handleInteractionEnd);

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
