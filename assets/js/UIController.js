class UIController {
    constructor(elements) {
        this.elements = elements;
    }

    exibirBotoesCifras() {
        this.elements.notesButton.classList.remove('d-none');
        this.elements.playButton.classList.remove('d-none');
        this.elements.nextButton.classList.remove('d-none');
        this.elements.prevButton.classList.remove('d-none');
        this.elements.notesButton.classList.remove('mx-2');
        this.elements.notesButton.classList.add('ml-4');
        this.esconderBotoesAcordes();
    }

    esconderBotoesAvancarVoltarCifra() {
        this.elements.voltarButton.classList.remove('fade-in');
        this.elements.voltarButton.classList.add('d-none');
        this.elements.avancarButton.classList.remove('fade-in');
        this.elements.avancarButton.classList.add('d-none');
        this.elements.notesButton.classList.remove('mx-2');
        this.elements.notesButton.classList.add('ml-4');
        this.atualizarBotoesNavegacao();
    }

    exibirBotoesAvancarVoltarCifra() {
        this.elements.voltarButton.classList.remove('d-none');
        this.elements.voltarButton.classList.add('fade-in');
        this.elements.avancarButton.classList.remove('d-none');
        this.elements.avancarButton.classList.add('fade-in');
        this.elements.nextButton.classList.add('d-none');
        this.elements.prevButton.classList.add('d-none');
        this.elements.notesButton.classList.remove('ml-4');
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

    editarMusica() {
        this.elements.iframeCifra.classList.add('d-none');
        this.elements.editTextarea.classList.remove('d-none');
        this.elements.selectContainer.classList.add('d-none');
        this.elements.itemNameInput.classList.remove('d-none');
        this.elements.saveButton.classList.remove('d-none');
        this.elements.cancelButton.classList.remove('d-none');
        this.elements.editSavesSelect.classList.add('d-none');
        this.elements.deleteSavesSelect.classList.add('d-none');
        this.elements.addButton.classList.add('d-none');
    }

    exibirBotoesAcordes() {
        this.atualizarBotoesNavegacao('centralizado');
        this.exibirBotoesTom();
        this.elements.notesButton.classList.remove('d-none');
        this.elements.notesButton.classList.remove('ml-4');
        this.elements.notesButton.classList.add('mx-2');
        //this.elements.playButton.classList.add('d-none');
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
        emptyOption.value = 'acordes__';
        emptyOption.text = 'Acordes';
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

    atualizarBotoesNavegacao(direcao = '') {
        if (direcao === 'esquerda' || this.elements.controlButtons.classList.contains('justify-content-left')) {
            this.elements.nextButton.classList.remove('d-none');
            if (this.elements.controlButtons.classList.contains('justify-content-center')) {
                this.elements.controlButtons.classList.remove('justify-content-center');
                this.elements.controlButtons.classList.add('justify-content-left');
                this.elements.prevButton.classList.add('d-none');
            } else if (this.elements.controlButtons.classList.contains('justify-content-end')) {
                this.elements.controlButtons.classList.remove('justify-content-end');
                this.elements.controlButtons.classList.add('justify-content-center');
            }
        } else if (direcao === 'direita' || this.elements.controlButtons.classList.contains('justify-content-end')) {
            this.elements.prevButton.classList.remove('d-none');
            if (this.elements.controlButtons.classList.contains('justify-content-center')) {
                this.elements.controlButtons.classList.remove('justify-content-center');
                this.elements.controlButtons.classList.add('justify-content-end');
                this.elements.nextButton.classList.add('d-none');
            } else if (this.elements.controlButtons.classList.contains('justify-content-left')) {
                this.elements.controlButtons.classList.remove('justify-content-left');
                this.elements.controlButtons.classList.add('justify-content-center');
            }
        } else if (direcao === 'centralizado' || this.elements.controlButtons.classList.contains('justify-content-center')) {
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

    exibirInterfaceDePesquisa() {
        this.elements.cifraDisplay.classList.add('d-none');
        this.elements.searchIcon.classList.add('d-none');
        this.elements.spinner.classList.remove('d-none');
        this.elements.saveButton.classList.add('d-none');
        this.elements.cancelButton.classList.add('d-none');
        this.elements.tocarButton.classList.add('d-none');
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

    exibirBotaoTocar() {
        this.elements.searchButton.disabled = false;
        this.elements.spinner.classList.add('d-none');
        this.elements.searchIcon.classList.remove('d-none');
        this.elements.searchResultsList.classList.add('d-none');
        
        this.elements.tocarButton.classList.remove('d-none');
        this.elements.addButton.classList.remove('d-none');
        this.elements.cifraDisplay.classList.remove('d-none');
    }

    resetInterface() {
        this.elements.editTextarea.classList.add('d-none');
        this.elements.itemNameInput.classList.add('d-none');
        this.elements.saveButton.classList.add('d-none');
        this.elements.cancelButton.classList.add('d-none');
        this.elements.selectContainer.classList.remove('d-none');
        this.elements.addButton.classList.remove('d-none');
        this.elements.iframeCifra.classList.remove('d-none');
    }

    exibirIframeCifra() {
        this.resetInterface();
        this.elements.iframeCifra.classList.remove('d-none');
        this.elements.liturgiaDiariaFrame.classList.add('d-none');
        this.elements.santamissaFrame.classList.add('d-none');
        this.elements.oracoesFrame.classList.add('d-none');
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

    exibirSavesSelect() {
        this.elements.savesSelect.value = this.elements.selectedButton.innerText;
        this.elements.selectContainer.classList.remove('d-none');
        this.elements.selectedButton.classList.add('d-none');
        this.elements.savesSelect.click();
    }

    exibirFrame(frameId) {
        if (this.elements.savesSelect.value) {
            this.elements.selectContainer.classList.add('d-none');
            this.elements.selectedButton.classList.remove('d-none');
            this.elements.selectedButton.innerText = this.elements.savesSelect.value;
        }
        this.elements.oracoesFrame.classList.add('d-none');
        this.elements.santamissaFrame.classList.add('d-none');
        this.elements.iframeCifra.classList.add('d-none');
        this.elements.liturgiaDiariaFrame.classList.add('d-none');

        this.exibirBotoesAcordes();
        
        this.exibirTextoCifrasCarregado('C', elements.editTextarea.value);

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
}
