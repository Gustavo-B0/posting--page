const formularioPost = document.querySelector('#formulario-post');
const tituloInput = document.querySelector('#titulo-input');
const conteudoInput = document.querySelector('#conteudo-input');

const tituloRenderizar = document.querySelector('#renderizador-titulo');
const conteudoRenderizar = document.querySelector('#renderizador-conteudo');
const postIdElement = document.querySelector('#post-id');
const postUserElement = document.querySelector('#post-user');

const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const API_HEADERS = {
    'Content-Type': 'application/json; charset=UTF-8'
};

formularioPost.addEventListener('submit', function(event) {

    event.preventDefault();
    

    const titulo = tituloInput.value.trim();
    const conteudo = conteudoInput.value.trim();
    

    if (!validarCampos(titulo, conteudo)) {
        exibirMensagemErro('Por favor, preencha todos os campos do formulário.');
        return;
    }
    

    criarPost(titulo, conteudo);
});

function validarCampos(titulo, conteudo) {
    if (titulo.length === 0 || conteudo.length === 0) {
        return false;
    }
    
    if (titulo.length < 3) {
        exibirMensagemErro('O título deve ter no mínimo 3 caracteres.');
        return false;
    }
    
    if (conteudo.length < 10) {
        exibirMensagemErro('O conteúdo deve ter no mínimo 10 caracteres.');
        return false;
    }
    
    return true;
}

function criarPost(titulo, conteudo) {

    const botao = formularioPost.querySelector('button[type="submit"]');
    botao.disabled = true;
    botao.textContent = 'Publicando...';
    

    const data = {
        title: titulo,
        body: conteudo,
        userId: 1
    };
    

    const opcoesFetch = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: API_HEADERS
    };
    

    fetch(API_URL, opcoesFetch)
        .then(resposta => {

            if (!resposta.ok) {
                throw new Error(`Erro na resposta da API: ${resposta.status}`);
            }
            return resposta.json();
        })
        .then(respostaJson => {

            renderizarPost(respostaJson);
            

            limparFormulario();
            

            exibirMensagemSucesso('Post publicado com sucesso!');
            

            botao.disabled = false;
            botao.textContent = 'Publicar Post';
        })
        .catch(erro => {

            console.error('Erro ao criar post:', erro);
            exibirMensagemErro('Erro ao publicar o post. Tente novamente.');
            

            botao.disabled = false;
            botao.textContent = 'Publicar Post';
        });
}

function renderizarPost(post) {

    tituloRenderizar.innerHTML = post.title;
    

    conteudoRenderizar.innerHTML = post.body;
    

    postIdElement.textContent = `ID do Post: ${post.id}`;
    postUserElement.textContent = `Usuário: ${post.userId}`;
    

    animarElemento(document.querySelector('.post-preview-section'));
}

function limparFormulario() {
    tituloInput.value = '';
    conteudoInput.value = '';
    tituloInput.focus();
}

function exibirMensagemSucesso(mensagem) {
    const elementoMensagem = criarElementoMensagem(mensagem, 'success-message');
    adicionarMensagemAoFormulario(elementoMensagem);
}

function exibirMensagemErro(mensagem) {
    const elementoMensagem = criarElementoMensagem(mensagem, 'error-message');
    adicionarMensagemAoFormulario(elementoMensagem);
}

function criarElementoMensagem(mensagem, classe) {
    const div = document.createElement('div');
    div.className = classe;
    div.setAttribute('role', 'alert');
    div.textContent = mensagem;
    
    return div;
}

function adicionarMensagemAoFormulario(elemento) {

    const mensagensAnteriores = formularioPost.querySelectorAll('.success-message, .error-message');
    mensagensAnteriores.forEach(msg => msg.remove());
    

    formularioPost.parentNode.insertBefore(elemento, formularioPost.nextSibling);
    

    setTimeout(() => {
        if (elemento.parentNode) {
            elemento.remove();
        }
    }, 5000);
}

function animarElemento(elemento) {
    elemento.style.animation = 'none';
    

    void elemento.offsetWidth;
    
    elemento.style.animation = 'flashAnimation 0.6s ease-in-out';
}

const style = document.createElement('style');
style.textContent = `
    @keyframes flashAnimation {
        0% {
            background-color: #f8f9fa;
        }
        50% {
            background-color: #fff3cd;
        }
        100% {
            background-color: #f8f9fa;
        }
    }
`;
document.head.appendChild(style);

console.log('Social Post Creator inicializado com sucesso!');
console.log('API utilizada:', API_URL);
console.log('Pronto para criar posts!');
