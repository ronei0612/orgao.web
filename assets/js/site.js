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