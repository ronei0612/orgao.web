//Autorizar google api: https://console.developers.google.com/apis/api/drive.googleapis.com/overview?project=982717214287

// Configurações de OAuth2
const clientId = '982717214287-u57uddj8lrd7dq0n5i4fquuvci8umd60.apps.googleusercontent.com';
//const redirectUri = 'https://localhost:7188/orgao'; // URL de redirecionamento após a autorização
const redirectUri = 'https://' + window.location.host + '/orgao'; // URL de redirecionamento aps a autorização
const scope = 'https://www.googleapis.com/auth/drive';

var accessToken;

function authorizeGoogle() {
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
}

async function processToken() {
    const urlParams = new URLSearchParams(window.location.hash.substr(1));
    const accessToken = urlParams.get('access_token');
    //const state = urlParams.get('state');

    //if (accessToken && state) {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('accessTokenExpiry', Date.now() + 3600000);
    } else {
        console.error('Erro ao obter o token de acesso ou ID da pasta.');
    }
}

function verificarSeObtendoTokenGoogle() {
    if (window.location.href.includes('#access_token')) {
        processToken();

        if (localStorage.getItem('accessToken')) {
            document.location.hash = '';
        }
    }
}

async function editarArquivoNoGoogleDrive(arquivoId, texto) {
    if (await validarToken()) {
        const url = `https://www.googleapis.com/upload/drive/v3/files/${arquivoId}`;

        fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: texto
        })
        .then(response => {
            if (!response.ok) {
                console.error('Erro ao editar o arquivo:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Erro ao editar o arquivo:', error);
        });
    }
}

async function criarArquivoNoGoogleDrive(nome, texto) {    
    nome = 'LiturgiaOrgao-' + nome;
    const url = 'https://www.googleapis.com/drive/v3/files';

    try {
        const requestBody = {
            name: nome,
            mimeType: 'text/txt'
        };

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            const data = await response.json();

            // Adicionar texto ao arquivo
            const fileId = data.id;
            const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;

            response = await fetch(updateUrl, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'text/plain'
                },
                body: texto
            });

            if (response.ok) {
                // Compartilhar o arquivo para que qualquer pessoa com o link possa ler
                const permissionUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`;
                const permissionBody = {
                    role: 'reader',
                    type: 'anyone'
                };

                response = await fetch(permissionUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(permissionBody)
                });

                if (response.ok) {
                    localStorage.setItem('fileId', fileId);
                    localStorage.setItem('nomeCompartilhamento', nome);
                    
                    mostrarModal('compartilhado');

                } else {
                    console.error('Erro ao compartilhar o arquivo:', response.statusText);
                }
            } else {
                console.error('Erro ao adicionar texto ao arquivo:', response.statusText);
            }
        } else {
            console.error('Erro ao criar o arquivo:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao criar o arquivo:', error);
    }
}

async function criarArquivodoStorage(nomeSalvamento) {
    const texto = verificarSeJaCompartilhado(nomeSalvamento);

    if (texto !== '') {
        if (await validarToken()) {
            let nome = prompt('Nome do novo compartilhamento:');
            if (nome !== '' && nome !== null) {
                let textoDoStorageCriptografado = criptografarTexto(texto);
                localStorage.setItem('compartilhadoMD5', textoDoStorageCriptografado);
                criarArquivoNoGoogleDrive(nome, texto);
            }
        }
    }
    else {
        mostrarModal('compartilhado');
    }
}

async function validarToken() {
    accessToken = localStorage.getItem('accessToken');
    const accessTokenExpiry = localStorage.getItem('accessTokenExpiry');

    if (accessToken) {
        if (accessTokenExpiry) {
            if (!(Date.now() < parseInt(accessTokenExpiry))) {
                localStorage.removeItem('accessToken');
            }
        }

        try {
            const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
            if (!response.ok) {
                throw new Error('Erro ao validar o token:', response.status);
            }
            const data = await response.json();
        } catch (error) {
            console.error(error);
            localStorage.removeItem('accessToken');

            if (confirm('Conectando à conta Google para obter autorização'))
                authorizeGoogle();

            return false;
        }
    } else {
        if (confirm('Conectando à conta Google para obter autorização'))
            authorizeGoogle();

        return false;
    }

    return true;
}

function carregarSalvosLocalStorage() {
    const localStorageSalvamentos = localStorage.getItem('salvamentosv2');
    const localStorageKeys = localStorageSalvamentos.split(',');
    localStorageKeys.shift();
    var retorno = '';

    // Passo 2: Verificar se existem dados no localStorage
    if (localStorageKeys && localStorageKeys.length > 0) {
        // Passo 3: Criar um objeto para armazenar os dados
        const dataObject = {};

        // Passo 4: Iterar sobre as chaves do localStorage
        localStorageKeys.forEach(key => {
            // Obter os dados para cada chave
            const data = localStorage.getItem(key);
            // Adicionar os dados ao objeto
            dataObject[key] = data;
        });

        // Passo 5: Converter o objeto em uma string no formato desejado (JSON)
        const jsonData = JSON.stringify(dataObject);
        retorno = jsonData;
    }

    return retorno;
}

function criptografarTexto(texto) {
    return CryptoJS.MD5(texto).toString();
}

function verificarSeJaCompartilhado(nomeSalvamento) {
    let arquivoId = localStorage.getItem('fileId');
    if (arquivoId === 'undefined') {
        localStorage.removeItem('compartilhadoMD5');
        arquivoId = '';
    }

    let textoDoStorage = localStorage.getItem(nomeSalvamento);//'salvamentosv2'
    let textoDoStorageCriptografado = criptografarTexto(textoDoStorage);
    const compartilhadoMD5 = localStorage.getItem('compartilhadoMD5');

    if (compartilhadoMD5 && arquivoId) {
        if (textoDoStorageCriptografado === compartilhadoMD5)
            return '';
        else {
            let nomeCompartilhamento = localStorage.getItem('nomeCompartilhamento');
            if (nomeCompartilhamento && arquivoId) {
                if (confirm('Salvar no compartilhamento "' + nomeCompartilhamento + '"?')) {
                    editarArquivoNoGoogleDrive(arquivoId, textoDoStorage);
                    return '';
                }
            }
        }
    }
    return textoDoStorage;
}

function copiarTextoParaClipboard(texto) {
    // Cria uma área de seleção para copiar o texto
    var areaSelecao = document.createElement("textarea");
    areaSelecao.value = texto;
    document.body.appendChild(areaSelecao);

    areaSelecao.select();
    document.execCommand("copy");

    // Remove a área de seleção
    document.body.removeChild(areaSelecao);

    alert("Texto copiado! Cole onde quiser.");
    ocultarModal();
}

function compartilharMobile(texto) {
    // Verifica se o navegador suporta a Web Share API
    if (navigator.share) {
        navigator.share({
            title: 'Compartilhar',
            text: texto,
        })
            .then(() => console.log('Conteúdo compartilhado!'))
            .catch((error) => console.error('Erro ao compartilhar:', error));
    } else {
        window.location.href = 'https://api.whatsapp.com/send?text=' + texto;
    }
}

function verificarSewww() {
    if (!window.location.href.includes('localhost')) {
        // Necessário www no mobile para funcionar api, e como o certificado é www então precisa para computador também
        if (!window.location.href.includes('https://www.'))
            window.location.href = 'https://www.' + window.location.host.replace('www.', '') + window.location.pathname;
    }
}