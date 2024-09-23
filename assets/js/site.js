function DarkMode() {
	localStorage.setItem('darkMode', switchDark.checked);
	const modal = document.getElementsByClassName("w3-modal-content");

	if (document.body.classList.contains("bg-dark")) {
		document.body.classList = "bg-light text-dark orgao-background";
		navBar.classList = "navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-light border-bottom box-shadow mb-3";

		if (modal.length > 0)
			modal[0].style.cssText = 'background-color: #fff!important';

		if (typeof textoCifras !== 'undefined')
			if (textoCifras.style.display !== 'none')
				textoCifras.contentWindow.document.querySelector('pre').style.color = '#000';

		var elements = document.getElementsByClassName("nav-link orgao");
		for (var i = 0; i < elements.length; i++)
			elements[i].style.color = '#0d6efd';
			//elements[i].style.color = 'rgba(0, 0, 0, .55)';

		elements = document.getElementsByClassName("TextoMissal");
		for (var i = 0; i < elements.length; i++)
			elements[i].style.color = '#9c7b3e';

		elements = document.getElementsByClassName("tituloImagem");
		for (var i = 0; i < elements.length; i++)
			elements[i].style.color = '#000';
    }
    else {
		document.body.classList = "bg-dark text-light orgao-background-dark";
		navBar.classList = "navbar navbar-expand-sm navbar-toggleable-sm navbar-dark bg-black box-shadow mb-3";

		if (modal.length > 0)
			modal[0].style.cssText = 'background-color: #505050!important';

		if (typeof textoCifras !== 'undefined')
			if (textoCifras.style.display !== 'none')
				textoCifras.contentWindow.document.querySelector('pre').style.color = '#fff';
				
		var elements = document.getElementsByClassName("nav-link orgao");
		for (var i = 0; i < elements.length; i++)
			elements[i].style.color = '#74acff';
			//elements[i].style.color = rgba(0, 0, 0, .55);

		elements = document.getElementsByClassName("TextoMissal");
		for (var i = 0; i < elements.length; i++)
			elements[i].style.color = '#b3a58a';

		elements = document.getElementsByClassName("tituloImagem");
		for (var i = 0; i < elements.length; i++)
			elements[i].style.color = '#fff';
    }
}

window.addEventListener('DOMContentLoaded', function () {
	removerComercial();
	if (699 >= window.innerWidth) {
		var imgs = document.querySelectorAll('img');
		imgs.forEach(function (img) {
			img.style.maxWidth = '100%';
			img.style.minWidth = '100%';
			img.style.objectFit = 'fill';
			img.style.height = 'auto';
		});

		var iframes = document.querySelectorAll('iframe');
		iframes.forEach(function (iframe) {
			iframe.style.width = '100%';
		});
	}
});

async function verificarCertificadoVencendo() {
	let validadeCertificadoCookieExists = document.cookie.indexOf('validadeCertificado=') !== -1;

	if (!validadeCertificadoCookieExists) {
		const dataHoje = new Date();
		dataHoje.setHours(23, 59, 59, 999);
		document.cookie = `validadeCertificado=VerificadoHoje; expires=${dataHoje.toUTCString()}; path=/`;

		var url = window.location.origin + "/Home/ObterDataValidadeCertificado";

		fetch(url)
			.then(response => response.json())
			.then(data => {
				if (!data.success) {
					alert("Se você é ADMINISTRADOR: O certificado está próximo de expirar!");
				}
			})
			.catch(error => console.error("Erro ao verificar a validade do certificado:", error));
	}
}

function removerComercial() {
	setTimeout(function () {
		$("div[style='opacity: 0.9; z-index: 2147483647; position: fixed; left: 0px; bottom: 0px; height: 65px; right: 0px; display: block; width: 100%; background-color: #202020; margin: 0px; padding: 0px;']").remove();
		$("div[style='margin: 0px; padding: 0px; left: 0px; width: 100%; height: 65px; right: 0px; bottom: 0px; display: block; position: fixed; z-index: 2147483647; opacity: 0.9; background-color: rgb(32, 32, 32);']").remove();
		$("div[onmouseover='S_ssac();']").remove();
		$("center").remove();
	}, 500);
}

document.addEventListener('click', removerComercial);
document.addEventListener('touchstart', removerComercial);

verificarCertificadoVencendo();