const notasAcordesJson = JSON.parse('{"C":["c","e","g"],"C4":["c","f","g"],"C5+":["c","e","g#"],"C6":["c","e","g","a"],"C7":["c","e","g","a#"],"C7M":["c","e","g","b"],"C9":["c","e","g","d"],"C°":["c","d#","f#"],"C°7":["c","d#","f#","a#"],"Cm":["c","d#","g"],"Cm5+":["c","d#","g#"],"Cm6":["c","d#","g","a"],"Cm7":["c","d#","g","a#"],"Cm7M":["c","d#","g","b"],"C#":["c#","f","g#"],"C#4":["c#","f#","g#"],"C#5+":["c#","f","a"],"C#6":["c#","f","g#","a#"],"C#7":["c#","f","g#","b"],"C#7M":["c#","f","g#","c"],"C#9":["c#","f","g#","d#"],"C#°":["c#","e","g"],"C#°7":["c#","e","g","b"],"C#m":["c#","e","g#"],"C#m5+":["c#","e","a"],"C#m6":["c#","e","g#","a#"],"C#m7":["c#","e","g#","b"],"C#m7M":["c#","e","g#","c"],"D":["d","f#","a"],"D4":["d","g","a"],"D5+":["d","f#","a#"],"D6":["d","f#","a","b"],"D7":["d","f#","a","c"],"D7M":["d","f#","a","c#"],"D9":["d","f#","a","e"],"D°":["d","f","g#"],"D°7":["d","f","g#","c"],"Dm":["d","f","a"],"Dm5+":["d","f","a#"],"Dm6":["d","f","a","b"],"Dm7":["d","f","a","c"],"Dm7M":["d","f","a","c#"],"D#":["d#","g","a#"],"D#4":["d#","g#","a#"],"D#5+":["d#","g","b"],"D#6":["d#","g","a#","c"],"D#7":["d#","g","a#","c#"],"D#7M":["d#","g","a#","d"],"D#9":["d#","g","a#","f"],"D#°":["d#","f#","a"],"D#°7":["d#","f#","a","c#"],"D#m":["d#","f#","a#"],"D#m5+":["d#","f#","b"],"D#m6":["d#","f#","a#","c"],"D#m7":["d#","f#","a#","c#"],"D#m7M":["d#","f#","a#","d"],"E":["e","g#","b"],"E4":["e","a","b"],"E5+":["e","g#","c"],"E6":["e","g#","b","c#"],"E7":["e","g#","b","d"],"E7M":["e","g#","b","d#"],"E9":["e","g#","b","f#"],"E°":["e","g","a#"],"E°7":["e","g","a#","d"],"Em":["e","g","b"],"Em5+":["e","g","c"],"Em6":["e","g","b","c#"],"Em7":["e","g","b","d"],"Em7M":["e","g","b","d#"],"F":["f","a","c"],"F4":["f","a#","c"],"F5+":["f","a","c#"],"F6":["f","a","c","d"],"F7":["f","a","c","d#"],"F7M":["f","a","c","e"],"F9":["f","a","c","g"],"F°":["f","g#","b"],"F°7":["f","g#","b","d#"],"Fm":["f","g#","c"],"Fm5+":["f","g#","c#"],"Fm6":["f","g#","c","d"],"Fm7":["f","g#","c","d#"],"Fm7M":["f","g#","c","e"],"F#":["f#","a#","c#"],"F#4":["f#","b","c#"],"F#5+":["f#","a#","d"],"F#6":["f#","a#","c#","d#"],"F#7":["f#","a#","c#","e"],"F#7M":["f#","a#","c#","f"],"F#9":["f#","a#","c#","g#"],"F#°":["f#","a","c"],"F#°7":["f#","a","c","e"],"F#m":["f#","a","c#"],"F#m5+":["f#","a","d"],"F#m6":["f#","a","c#","d#"],"F#m7":["f#","a","c#","e"],"F#m7M":["f#","a","c#","f"],"G":["g","b","d"],"G4":["g","c","d"],"G5+":["g","b","d#"],"G6":["g","b","d","e"],"G7":["g","b","d","f"],"G7M":["g","b","d","f#"],"G9":["g","b","d","a"],"G°":["g","a#","c#"],"G°7":["g","a#","c#","f"],"Gm":["g","a#","d"],"Gm5+":["g","a#","d#"],"Gm6":["g","a#","d","e"],"Gm7":["g","a#","d","f"],"Gm7M":["g","a#","d","f#"],"G#":["g#","c","d#"],"G#4":["g#","c#","d#"],"G#5+":["g#","c","e"],"G#6":["g#","c","d#","f"],"G#7":["g#","c","d#","f#"],"G#7M":["g#","c","d#","g"],"G#9":["g#","c","d#","a#"],"G#°":["g#","b","d"],"G#°7":["g#","b","d","f#"],"G#m":["g#","b","d#"],"G#m5+":["g#","b","e"],"G#m6":["g#","b","d#","f"],"G#m7":["g#","b","d#","f#"],"G#m7M":["g#","b","d#","g"],"A":["a","c#","e"],"A4":["a","d","e"],"A5+":["a","c#","f"],"A6":["a","c#","e","f#"],"A7":["a","c#","e","g"],"A7M":["a","c#","e","g#"],"A9":["a","c#","e","b"],"A°":["a","c","d#"],"A°7":["a","c","d#","g"],"Am":["a","c","e"],"Am5+":["a","c","f"],"Am6":["a","c","e","f#"],"Am7":["a","c","e","g"],"Am7M":["a","c","e","g#"],"A#":["a#","d","f"],"A#4":["a#","d#","f"],"A#5+":["a#","d","f#"],"A#6":["a#","d","f","g"],"A#7":["a#","d","f","g#"],"A#7M":["a#","d","f","a"],"A#9":["a#","d","f","c"],"A#°":["a#","c#","e"],"A#°7":["a#","c#","e","g#"],"A#m":["a#","c#","f"],"A#m5+":["a#","c#","f#"],"A#m6":["a#","c#","f","g"],"A#m7":["a#","c#","f","g#"],"A#m7M":["a#","c#","f","a"],"B":["b","d#","f#"],"B4":["b","e","f#"],"B5+":["b","d#","g"],"B6":["b","d#","f#","g#"],"B7":["b","d#","f#","a"],"B7M":["b","d#","f#","a#"],"B9":["b","d#","f#","c#"],"B°":["b","d","f"],"B°7":["b","d","f","a"],"Bm":["b","d","f#"],"Bm5+":["b","d","g"],"Bm6":["b","d","f#","g#"],"Bm7":["b","d","f#","a"],"Bm7M":["b","d","f#","a#"]}');
    const acordesCampoHarmonicoJson = JSON.parse('{"C":["C","Dm","Em","F","G","Am","Bb","D","Cm","A","E"],"C#":["C#","D#m","E#m","F#","G#","A#m","B","D#","C#m","A#","E#"],"D":["D","Em","F#m","G","A","Bm","C","E","Dm","B","F#"],"D#":["D#","Fm","Gm","G#","A#","Cm","C#","F","D#m","C","G"],"E":["E","F#m","G#m","A","B","C#m","D","F#","Em","C#","G#"],"F":["F","Gm","Am","Bb","C","Dm","Eb","G","Fm","D","A"],"F#":["F#","G#m","A#m","B","C#","D#m","E","G#","F#m","D#","A#"],"G":["G","Am","Bm","C","D","Em","F","A","Gm","E","B"],"G#":["G#","Bbm","Cm","C#","D#","Fm","F#","A#","G#m","F","C"],"A":["A","Bm","C#m","D","E","F#m","G","B","Am","F#","C#"],"A#":["A#","Cm","Dm","D#","F","Gm","G#","C","A#m","G","D"],"B":["B","C#m","D#m","E","F#","G#m","A","C#","Bm","G#","D#"],"Am":["C","Dm","Em","F","G","Am","A","E","","",""],"A#m":["C#","D#m","E#m","F#","G#","A#m","A#","E#","","",""],"Bm":["D","Em","F#m","G","A","Bm","B","F#","","",""],"Cm":["Eb","Fm","Gm","Ab","Bb","Cm","C","G","","",""],"C#m":["E","F#m","G#m","A","B","Cm","C#","G#","","",""],"Dm":["F","Gm","Am","Bb","C","Dm","D","A","","",""],"D#m":["F#","G#m","A#m","C","C#","D#m","D#","A#","","",""],"Em":["G","Am","Bm","C","D","Em","E","B","","",""],"Fm":["Ab","Bbm","Cm","Db","Eb","Fm","F","C","","",""],"F#m":["A","Bm","C#m","D","E","F#m","F#","C#","","",""],"Gm":["Bb","Cm","Dm","Eb","F","Gm","G","D","","",""],"G#m":["B","C#m","D#m","E","F#","G#m","G#","D#","","",""]}');
    const acidentesCorrespondentesJson = JSON.parse('{"Cb":"B","C":"C","C#":"C#","Db":"C#","D":"D","D#":"D#","Eb":"D#","E":"E","E#":"F","Fb":"E","F":"F","F#":"F#","Gb":"F#","G":"G","G#":"G#","Ab":"G#","A":"A","A#":"A#","Bb":"A#","B":"B","B#":"C"}');
	const acordesTons = Object.keys(acordesCampoHarmonicoJson);
	const tonsMaiores = 'C, C#, D, D#, E, F, F#, G, G#, A, A#, B'.split(', ');
	const tonsMenores = 'Am, A#m, Bm, Cm, C#m, Dm, D#m, Em, Fm, F#m, Gm, G#m'.split(', ');

    var audioPath = './assets/audio/';
    if (location.origin.includes('file:'))
        audioPath = 'https://roneicostasoares.com.br/Orgao.Web/assets/audio/';

	localStorage.setItem('notasAcordesJson', JSON.stringify(notasAcordesJson));

	 var acordes = {
	 	'orgao_c': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_c.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_c#': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_c_.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_d': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_d.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_d#': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_d_.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_e': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_e.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_f': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_f.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_f#': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_f_.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_g': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_g.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_g#': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_g_.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_a': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_a.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_a#': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_a_.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_b': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_b.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		
		'orgao_c_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_c_baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_c#_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_c__baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_d_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_d_baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_d#_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_d__baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_e_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_e_baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_f_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_f_baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_f#_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_f__baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_g_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_g_baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_g#_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_g__baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_a_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_a_baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_a#_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_a__baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_b_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_b_baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),

		'orgao_c_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_c_grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_c#_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_c__grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_d_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_d_grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_d#_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_d__grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_e_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_e_grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_f_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_f_grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_f#_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_f__grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_g_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_g_grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_g#_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_g__grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_a_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_a_grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_a#_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_a__grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'orgao_b_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Orgao/orgao_b_grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),

		'epiano_c': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_c.ogg' } }),
		'epiano_c#': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_c_.ogg' } }),
		'epiano_d': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_d.ogg' } }),
		'epiano_d#': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_d_.ogg' } }),
		'epiano_e': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_e.ogg' } }),
		'epiano_f': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_f.ogg' } }),
		'epiano_f#': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_f_.ogg' } }),
		'epiano_g': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_g.ogg' } }),
		'epiano_g#': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_g_.ogg' } }),
		'epiano_a': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_a.ogg' } }),
		'epiano_a#': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_a_.ogg' } }),
		'epiano_b': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_b.ogg' } }),

		'epiano_c_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_c_baixo.ogg' } }),
		'epiano_c#_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_c__baixo.ogg' } }),
		'epiano_d_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_d_baixo.ogg' } }),
		'epiano_d#_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_d__baixo.ogg' } }),
		'epiano_e_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_e_baixo.ogg' } }),
		'epiano_f_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_f_baixo.ogg' } }),
		'epiano_f#_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_f__baixo.ogg' } }),
		'epiano_g_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_g_baixo.ogg' } }),
		'epiano_g#_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_g__baixo.ogg' } }),
		'epiano_a_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_a_baixo.ogg' } }),
		'epiano_a#_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_a__baixo.ogg' } }),
		'epiano_b_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_b_baixo.ogg' } }),

		'epiano_c_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_c_grave.ogg' } }),
		'epiano_c#_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_c__grave.ogg' } }),
		'epiano_d_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_d_grave.ogg' } }),
		'epiano_d#_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_d__grave.ogg' } }),
		'epiano_e_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_e_grave.ogg' } }),
		'epiano_f_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_f_grave.ogg' } }),
		'epiano_f#_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_f__grave.ogg' } }),
		'epiano_g_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_g_grave.ogg' } }),
		'epiano_g#_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_g__grave.ogg' } }),
		'epiano_a_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_a_grave.ogg' } }),
		'epiano_a#_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_a__grave.ogg' } }),
		'epiano_b_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Epiano/epiano_b_grave.ogg' } }),

		'strings_c': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_c.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_c#': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_c_.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_d': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_d.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_d#': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_d_.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_e': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_e.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_f': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_f.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_f#': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_f_.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_g': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_g.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_g#': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_g_.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_a': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_a.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_a#': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_a_.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_b': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_b.ogg', loop: true, release: 0.5, attack: 0.1 } }),

		'strings_c_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_c_baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_c#_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_c__baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_d_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_d_baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_d#_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_d__baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_e_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_e_baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_f_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_f_baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_f#_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_f__baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_g_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_g_baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_g#_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_g__baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_a_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_a_baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_a#_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_a__baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_b_baixo': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_b_baixo.ogg', loop: true, release: 0.5, attack: 0.1 } }),

		'strings_c_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_c_grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_c#_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_c__grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_d_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_d_grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_d#_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_d__grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_e_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_e_grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_f_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_f_grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_f#_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_f__grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_g_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_g_grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_g#_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_g__grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_a_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_a_grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_a#_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_a__grave.ogg', loop: true, release: 0.5, attack: 0.1 } }),
		'strings_b_grave': new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Strings/strings_b_grave.ogg', loop: true, release: 0.5, attack: 0.1 } })
	 };

	var pratoSound = new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Percussao/prato.ogg' } });
	var chimesSound = new Pizzicato.Sound({ source: 'file', options: { path: audioPath + 'Percussao/chimes.ogg' } });