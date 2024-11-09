function getAcorde(possivelAcorde) {
	//possivelAcorde = possivelAcorde.replace("(9)", "9").replace("m(5-)", "°").replace("m7(5-)", "°7").replace('º', '°');
	possivelAcorde = possivelAcorde.replace("(9)", "").replace('(9-)', '').replace('(4)', '').replace("m(5-)", "°").replace("m7(5-)", "°7").replace('º', '°');
  
	let cifraFormatada = possivelAcorde;
	let cifraAcordeAlteracoes = "";
  
	// Retira acordes compostos mais complexos como C7(9)
	if (possivelAcorde.includes('(')) {
	  cifraFormatada = possivelAcorde.split('(')[0];
	}
  
	if (possivelAcorde.includes('/') && !possivelAcorde.includes('(')) {
	  cifraFormatada = possivelAcorde.split('/')[0];
	  const retorno = getAcorde(possivelAcorde.split('/')[1]);
	  cifraAcordeAlteracoes = "/" + retorno[0];
	}
  
	let cifraSomenteNota = cifraFormatada;
  
	if (cifraSomenteNota.length > 1) {
	  if (cifraSomenteNota[1] === '#') {
		cifraSomenteNota = cifraSomenteNota[0] + "#";
	  } else if (cifraSomenteNota[1] === 'b') {
		cifraSomenteNota = cifraSomenteNota[0] + "b";
	  } else {
		cifraSomenteNota = cifraSomenteNota[0];
	  }
  
	  if (cifraAcordeAlteracoes === "") {
		cifraAcordeAlteracoes = cifraFormatada.split(cifraSomenteNota)[1];
	  }
  
	  cifraSomenteNota = acidentesCorrespondentes[cifraSomenteNota];
	}
  
	return [cifraSomenteNota, cifraAcordeAlteracoes];
  }
  
  function getAcordes(cifraTexto, tom = 0) {
	if (!cifraTexto.includes("<b")) {
	  return searchAcordes(cifraTexto);
	}
  
	const notas = cifraTexto.split("<b");
	const texto = [];
  
	for (let i = 0; i < notas.length; i++) {
	  if (i === 0) {
		texto.push(notas[i]);
	  } else {
		const cifra = notas[i].split('>')[1].split('<')[0];
		const linhaRestante = notas[i].split('<')[1];
  
		let cifraFormatada = cifra;
  
		const retorno = getAcorde(cifraFormatada);
		let cifraSomenteNota = retorno[0];
		let cifraAcordeAlteracoes = retorno[1];
		cifraFormatada = cifraSomenteNota;
  
		if (!cifraAcordeAlteracoes.includes('/')) {
		  cifraFormatada += cifraAcordeAlteracoes;
		}
  
		// Vai removendo os últimos caracateres até chegar num que conheça como C#7sus encontra C#7
		while (!notasAcordes.includes(cifraFormatada)) {
		  cifraFormatada = cifraFormatada.slice(0, -1);
		}
  
		if (cifraAcordeAlteracoes.includes('/')) {
		  cifraFormatada += cifraAcordeAlteracoes;
		}
  
		if (cifraFormatada !== "") {
		  if (tom !== 0) {
			cifraFormatada = mudarCifraTom(tom, cifraSomenteNota);
  
			if (cifraAcordeAlteracoes.includes('/')) {
			  cifraAcordeAlteracoes = "/" + mudarCifraTom(tom, cifraAcordeAlteracoes.split('/')[1]);
			}
  
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
  
  function mudarCifraTom(tom, cifraSomenteNota) {
	const acordeIndex = tonsMaiores.indexOf(cifraSomenteNota);
	let newIndex = acordeIndex + tom;
  
	if (newIndex > 11) {
	  newIndex -= 12;
	} else if (newIndex < 0) {
	  newIndex += 12;
	}
  
	return tonsMaiores[newIndex];
  }
  
  function searchAcordes(cifraTexto) {
	const linhasTexto = cifraTexto.split('\n');
	const texto = [];
	const somenteAcordes = /^[A-Ga-g0-9m#bsus°º+/()| \.]*$/;
	const linhaIniciandoComAcorde = /\b[A-G()]/;
	let acordeId = 1;
  
	texto.push("<style>.cifraSelecionada{background-color:#ff0}pre{line-height:1.6;font-size:14px}</style><pre>");
  
	for (const linha of linhasTexto) {
	  const linhaFormatada = linha.replace("[Intro]", "").replace("[Solo]", "").replace("[Final]", "");
  
	  if (linha !== "" && somenteAcordes.test(linhaFormatada)) {
		const acordes = linha.split(' ');
  
		for (let i = 0; i < acordes.length; i++) {
		  if (acordes[i] !== "" && somenteAcordes.test(acordes[i]) && linhaIniciandoComAcorde.test(acordes[i])) {
			//System.Diagnostics.Debug.WriteLine(acordes[i]);
			let acorde = acordes[i];
			let solo = "";
  
			if (acorde.includes('.')) {
			  const parts = acorde.split('.', 2); // Dividir a string em duas partes usando o ponto como delimitador
  
			  acorde = parts[0]; // Armazenar o texto antes do primeiro ponto
			  solo = parts.length > 1 ? "." + parts[1] : ""; // Armazenar o texto depois do primeiro ponto
			  //solo = solo[0] == '.' ? solo : "";
			}
  
			let retorno;
			if (acorde.includes('B7(9-)')){
				debugger;
			  acorde = acorde;
			}
			if (acorde[0] === '(') {
			  texto.push("(");
			  retorno = getAcorde(acorde.split('(')[1].replace("|", ""));
			} else if (acorde[0] === ')') {
			  texto.push(")");
			  retorno = getAcorde(acorde.split(')')[1].replace("|", ""));
			} else if (acorde.endsWith(')')) {
			  //texto.push(")");
			  retorno = getAcorde(acorde.split(')')[0].replace("|", "") + ')');
			} else if (acorde.endsWith('(')) {
			  texto.push("(");
			  retorno = getAcorde(acorde.split('(')[0].replace("|", ""));
			} else {
			  retorno = getAcorde(acorde.replace("|", ""));
			}
  
			const cifraSomenteNota = retorno[0];
			const cifraAcordeAlteracoes = retorno[1];
			let cifraFormatada = cifraSomenteNota + cifraAcordeAlteracoes;
  
			// Vai removendo os últimos caracateres até chegar num que conheça como C#7sus encontra C#7
			let cifraProcurar = cifraFormatada;
			if (acorde.includes('/')) {
			  cifraProcurar = cifraProcurar.split('/')[0];
			}
  
			while (!notasAcordes.includes(cifraProcurar)) {
			  cifraFormatada = cifraFormatada.slice(0, -1);
			}
  
			if (cifraFormatada !== "") {
			  cifraFormatada = ">" + cifraFormatada + solo + "</b>";
			  texto.push("<b id=\"cifra" + acordeId + "\"" + cifraFormatada);
  
			  if (i !== acordes.length - 1) {
				texto.push(" ");
			  }
  
			  acordeId++;
			} else {
			  texto.push("");
			}
		  } else {
			texto.push(acordes[i] + " ");
		  }
		}
		texto.push('\n');
	  } else {
		texto.push(linha + '\n');
	  }
	}
  
	texto.pop();
  
	texto.push("</pre>");
  
	return texto.join("");
  }
  
  const acidentes = ["5+", "6", "7", "7+", "9", "11"];
  //let tonsMaiores = "C, C#, D, D#, E, F, F#, G, G#, A, A#, B".split(", ");
  //let tonsMenores = "Am, A#m, Bm, Cm, C#m, Dm, D#m, Em, Fm, F#m, Gm, G#m".split(", ");
  let certificadoVencendo = false;
  
  let textoRitmos = "";
  let textoNotasAcordes = "";
  
  const acordesLinks = {}; // Substitua por uma implementação real de Dictionary
  const notasLinks = {}; // Substitua por uma implementação real de Dictionary
  
  const tonsMaioresString = "C, C#, D, D#, E, F, F#, G, G#, A, A#, B";
  const tonsMenoresString = "Am, A#m, Bm, Cm, C#m, Dm, D#m, Em, Fm, F#m, Gm, G#m";
  
  const acordesMenoresRelativos = {
	"C": "Am",
	"C#": "A#m",
	"D": "Bm",
	"Eb": "Cm",
	"D#": "Cm",
	"E": "C#m",
	"F": "Dm",
	"F#": "D#m",
	"G": "Em",
	"Ab": "Fm",
	"G#": "Fm",
	"A": "F#m",
	"Bb": "Gm",
	"A#": "Gm",
	"B": "G#m"
  };
  
  const acidentesCorrespondentes = {
	"Cb": "B",
	"C": "C",
	"C#": "C#",
	"Db": "C#",
	"D": "D",
	"D#": "D#",
	"Eb": "D#",
	"E": "E",
	"E#": "F",
	"Fb": "E",
	"F": "F",
	"F#": "F#",
	"Gb": "F#",
	"G": "G",
	"G#": "G#",
	"Ab": "G#",
	"A": "A",
	"A#": "A#",
	"Bb": "A#",
	"B": "B",
	"B#": "C"
  };
  
//   const acordes = {
// 	"C": ["C", "Dm", "Em", "F", "G", "Am", "Bb", "D", "Cm", "A", "E"],
// 	"C#": ["C#", "D#m", "E#m", "F#", "G#", "A#m", "B", "D#", "C#m", "A#", "E#"],
// 	"D": ["D", "Em", "F#m", "G", "A", "Bm", "C", "E", "Dm", "B", "F#"],
// 	"D#": ["D#", "Fm", "Gm", "G#", "A#", "Cm", "C#", "F", "D#m", "C", "G"],
// 	"E": ["E", "F#m", "G#m", "A", "B", "C#m", "D", "F#", "Em", "C#", "G#"],
// 	"F": ["F", "Gm", "Am", "Bb", "C", "Dm", "Eb", "G", "Fm", "D", "A"],
// 	"F#": ["F#", "G#m", "A#m", "B", "C#", "D#m", "E", "G#", "F#m", "D#", "A#"],
// 	"G": ["G", "Am", "Bm", "C", "D", "Em", "F", "A", "Gm", "E", "B"],
// 	"G#": ["G#", "Bbm", "Cm", "C#", "D#", "Fm", "F#", "A#", "G#m", "F", "C"],
// 	"A": ["A", "Bm", "C#m", "D", "E", "F#m", "G", "B", "Am", "F#", "C#"],
// 	"A#": ["A#", "Cm", "Dm", "D#", "F", "Gm", "G#", "C", "A#m", "G", "D"],
// 	"B": ["B", "C#m", "D#m", "E", "F#", "G#m", "A", "C#", "Bm", "G#", "D#"],
  
// 	"Am": ["C", "Dm", "Em", "F", "G", "Am", "A", "E", "", "", ""],
// 	"A#m": ["C#", "D#m", "E#m", "F#", "G#", "A#m", "A#", "E#", "", "", ""],
// 	"Bm": ["D", "Em", "F#m", "G", "A", "Bm", "B", "F#", "", "", ""],
// 	"Cm": ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "C", "G", "", "", ""],
// 	"C#m": ["E", "F#m", "G#m", "A", "B", "Cm", "C#", "G#", "", "", ""],
// 	"Dm": ["F", "Gm", "Am", "Bb", "C", "Dm", "D", "A", "", "", ""],
// 	"D#m": ["F#", "G#m", "A#m", "C", "C#", "D#m", "D#", "A#", "", "", ""],
// 	"Em": ["G", "Am", "Bm", "C", "D", "Em", "E", "B", "", "", ""],
// 	"Fm": ["Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "F", "C", "", "", ""],
// 	"F#m": ["A", "Bm", "C#m", "D", "E", "F#m", "F#", "C#", "", "", ""],
// 	"Gm": ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "G", "D", "", "", ""],
// 	"G#m": ["B", "C#m", "D#m", "E", "F#", "G#m", "G#", "D#", "", "", ""]
//   };
  
//   const notasAcordes = {
// 	"C": ["c", "e", "g"],
// 	"C4": ["c", "f", "g"],
// 	"C5+": ["c", "e", "g#"],
// 	"C6": ["c", "e", "g", "a"],
// 	"C7": ["c", "e", "g", "a#"],
// 	"C7M": ["c", "e", "g", "b"],
// 	"C9": ["c", "e", "g", "d"],
// 	"C°": ["c", "d#", "f#"],
// 	"C°7": ["c", "d#", "f#", "a#"],
// 	"Cm": ["c", "d#", "g"],
// 	"Cm5+": ["c", "d#", "g#"],
// 	"Cm6": ["c", "d#", "g", "a"],
// 	"Cm7": ["c", "d#", "g", "a#"],
// 	"Cm7M": ["c", "d#", "g", "b"],
  
// 	"C#": ["c#", "f", "g#"],
// 	"C#4": ["c#", "f#", "g#"],
// 	"C#5+": ["c#", "f", "a"],
// 	"C#6": ["c#", "f", "g#", "a#"],
// 	"C#7": ["c#", "f", "g#", "b"],
// 	"C#7M": ["c#", "f", "g#", "c"],
// 	"C#9": ["c#", "f", "g#", "d#"],
// 	"C#°": ["c#", "e", "g"],
// 	"C#°7": ["c#", "e", "g", "b"],
// 	"C#m": ["c#", "e", "g#"],
// 	"C#m5+": ["c#", "e", "a"],
// 	"C#m6": ["c#", "e", "g#", "a#"],
// 	"C#m7": ["c#", "e", "g#", "b"],
// 	"C#m7M": ["c#", "e", "g#", "c"],
  
// 	"D": ["d", "f#", "a"],
// 	"D4": ["d", "g", "a"],
// 	"D5+": ["d", "f#", "a#"],
// 	"D6": ["d", "f#", "a", "b"],
// 	"D7": ["d", "f#", "a", "c"],
// 	"D7M": ["d", "f#", "a", "c#"],
// 	"D9": ["d", "f#", "a", "e"],
// 	"D°": ["d", "f", "g#"],
// 	"D°7": ["d", "f", "g#", "c"],
// 	"Dm": ["d", "f", "a"],
// 	"Dm5+": ["d", "f", "a#"],
// 	"Dm6": ["d", "f", "a", "b"],
// 	"Dm7": ["d", "f", "a", "c"],
// 	"Dm7M": ["d", "f", "a", "c#"],
  
// 	"D#": ["d#", "g", "a#"],
// 	"D#4": ["d#", "g#", "a#"],
// 	"D#5+": ["d#", "g", "b"],
// 	"D#6": ["d#", "g", "a#", "c"],
// 	"D#7": ["d#", "g", "a#", "c#"],
// 	"D#7M": ["d#", "g", "a#", "d"],
// 	"D#9": ["d#", "g", "a#", "f"],
// 	"D#°": ["d#", "f#", "a"],
// 	"D#°7": ["d#", "f#", "a", "c#"],
// 	"D#m": ["d#", "f#", "a#"],
// 	"D#m5+": ["d#", "f#", "b"],
// 	"D#m6": ["d#", "f#", "a#", "c"],
// 	"D#m7": ["d#", "f#", "a#", "c#"],
// 	"D#m7M": ["d#", "f#", "a#", "d"],
  
// 	"E": ["e", "g#", "b"],
// 	"E4": ["e", "a", "b"],
// 	"E5+": ["e", "g#", "c"],
// 	"E6": ["e", "g#", "b", "c#"],
// 	"E7": ["e", "g#", "b", "d"],
// 	"E7M": ["e", "g#", "b", "d#"],
// 	"E9": ["e", "g#", "b", "f#"],
// 	"E°": ["e", "g", "a#"],
// 	"E°7": ["e", "g", "a#", "d"],
// 	"Em": ["e", "g", "b"],
// 	"Em5+": ["e", "g", "c"],
// 	"Em6": ["e", "g", "b", "c#"],
// 	"Em7": ["e", "g", "b", "d"],
// 	"Em7M": ["e", "g", "b", "d#"],
  
// 	"F": ["f", "a", "c"],
// 	"F4": ["f", "a#", "c"],
// 	"F5+": ["f", "a", "c#"],
// 	"F6": ["f", "a", "c", "d"],
// 	"F7": ["f", "a", "c", "d#"],
// 	"F7M": ["f", "a", "c", "e"],
// 	"F9": ["f", "a", "c", "g"],
// 	"F°": ["f", "g#", "b"],
// 	"F°7": ["f", "g#", "b", "d#"],
// 	"Fm": ["f", "g#", "c"],
// 	"Fm5+": ["f", "g#", "c#"],
// 	"Fm6": ["f", "g#", "c", "d"],
// 	"Fm7": ["f", "g#", "c", "d#"],
// 	"Fm7M": ["f", "g#", "c", "e"],
  
// 	"F#": ["f#", "a#", "c#"],
// 	"F#4": ["f#", "b", "c#"],
// 	"F#5+": ["f#", "a#", "d"],
// 	"F#6": ["f#", "a#", "c#", "d#"],
// 	"F#7": ["f#", "a#", "c#", "e"],
// 	"F#7M": ["f#", "a#", "c#", "f"],
// 	"F#9": ["f#", "a#", "c#", "g#"],
// 	"F#°": ["f#", "a", "c"],
// 	"F#°7": ["f#", "a", "c", "e"],
// 	"F#m": ["f#", "a", "c#"],
// 	"F#m5+": ["f#", "a", "d"],
// 	"F#m6": ["f#", "a", "c#", "d#"],
// 	"F#m7": ["f#", "a", "c#", "e"],
// 	"F#m7M": ["f#", "a", "c#", "f"],
  
// 	"G": ["g", "b", "d"],
// 	"G4": ["g", "c", "d"],
// 	"G5+": ["g", "b", "d#"],
// 	"G6": ["g", "b", "d", "e"],
// 	"G7": ["g", "b", "d", "f"],
// 	"G7M": ["g", "b", "d", "f#"],
// 	"G9": ["g", "b", "d", "a"],
// 	"G°": ["g", "a#", "c#"],
// 	"G°7": ["g", "a#", "c#", "f"],
// 	"Gm": ["g", "a#", "d"],
// 	"Gm5+": ["g", "a#", "d#"],
// 	"Gm6": ["g", "a#", "d", "e"],
// 	"Gm7": ["g", "a#", "d", "f"],
// 	"Gm7M": ["g", "a#", "d", "f#"],
  
// 	"G#": ["g#", "c", "d#"],
// 	"G#4": ["g#", "c#", "d#"],
// 	"G#5+": ["g#", "c", "e"],
// 	"G#6": ["g#", "c", "d#", "f"],
// 	"G#7": ["g#", "c", "d#", "f#"],
// 	"G#7M": ["g#", "c", "d#", "g"],
// 	"G#9": ["g#", "c", "d#", "a#"],
// 	"G#°": ["g#", "b", "d"],
// 	"G#°7": ["g#", "b", "d", "f#"],
// 	"G#m": ["g#", "b", "d#"],
// 	"G#m5+": ["g#", "b", "e"],
// 	"G#m6": ["g#", "b", "d#", "f"],
// 	"G#m7": ["g#", "b", "d#", "f#"],
// 	"G#m7M": ["g#", "b", "d#", "g"],
  
// 	"A": ["a", "c#", "e"],
// 	"A4": ["a", "d", "e"],
// 	"A5+": ["a", "c#", "f"],
// 	"A6": ["a", "c#", "e", "f#"],
// 	"A7": ["a", "c#", "e", "g"],
// 	"A7M": ["a", "c#", "e", "g#"],
// 	"A9": ["a", "c#", "e", "b"],
// 	"A°": ["a", "c", "d#"],
// 	"A°7": ["a", "c", "d#", "g"],
// 	"Am": ["a", "c", "e"],
// 	"Am5+": ["a", "c", "f"],
// 	"Am6": ["a", "c", "e", "f#"],
// 	"Am7": ["a", "c", "e", "g"],
// 	"Am7M": ["a", "c", "e", "g#"],
  
// 	"A#": ["a#", "d", "f"],
// 	"A#4": ["a#", "d#", "f"],
// 	"A#5+": ["a#", "d", "f#"],
// 	"A#6": ["a#", "d", "f", "g"],
// 	"A#7": ["a#", "d", "f", "g#"],
// 	"A#7M": ["a#", "d", "f", "a"],
// 	"A#9": ["a#", "d", "f", "c"],
// 	"A#°": ["a#", "c#", "e"],
// 	"A#°7": ["a#", "c#", "e", "g#"],
// 	"A#m": ["a#", "c#", "f"],
// 	"A#m5+": ["a#", "c#", "f#"],
// 	"A#m6": ["a#", "c#", "f", "g"],
// 	"A#m7": ["a#", "c#", "f", "g#"],
// 	"A#m7M": ["a#", "c#", "f", "a"],
  
// 	"B": ["b", "d#", "f#"],
// 	"B4": ["b", "e", "f#"],
// 	"B5+": ["b", "d#", "g"],
// 	"B6": ["b", "d#", "f#", "g#"],
// 	"B7": ["b", "d#", "f#", "a"],
// 	"B7M": ["b", "d#", "f#", "a#"],
// 	"B9": ["b", "d#", "f#", "c#"],
// 	"B°": ["b", "d", "f"],
// 	"B°7": ["b", "d", "f", "a"],
// 	"Bm": ["b", "d", "f#"],
// 	"Bm5+": ["b", "d", "g"],
// 	"Bm6": ["b", "d", "f#", "g#"],
// 	"Bm7": ["b", "d", "f#", "a"],
// 	"Bm7M": ["b", "d", "f#", "a#"]
//   };