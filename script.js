const botoes = document.querySelectorAll('.filtro-btn')
const categorias = document.querySelectorAll('#menu article')

for(let btn of botoes){
    btn.addEventListener('click' , function(){

        botoes.forEach(b => b.classList.remove('activo'))
        btn.classList.add('activo')

        //PASSO 1: ler qual Categoria foi clicada;
        const categoriaEscolhida = btn.getAttribute('data-categoria')

        //PASSO 2: Esconder todos os «articles»;
        categorias.forEach(cat => {
            cat.classList.add('escondido')
        })

        //PASSO 3: Mostrar o Correcto;
        if (categoriaEscolhida === 'todos'){
            categorias.forEach(cat => {
                cat.classList.remove('escondido')
            })
        } else {
            document.getElementById(categoriaEscolhida).classList.remove('escondido')
        }

        // Scroll suave até ao menu após filtrar;
        setTimeout(function(){
            document.getElementById('menu').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        },100)
    })
}

//Adicionando o resto dos Botões 'Adicionar';
const todosPratos = document.querySelectorAll('#menu article ul li')

todosPratos.forEach(li => {
    if(li.querySelector('.nome')){
        const botao = document.createElement('button')
        botao.setAttribute('class' , 'btn-adicionar')
        botao.textContent ='+ Adicionar'
        li.appendChild(botao)
    }
})

const botoes_adicionar = document .querySelectorAll('.btn-adicionar')

document.getElementById('btn-reset').addEventListener('click' , function(){
    carrinho = []
    actualizarCarrinho()
})

//Colecionador de itens;

let carrinho = [];

// Variável para guardar o botão que foi clicado
let botaoPizzaActual = null

// Modifica o addEventListener dos botões adicionar
botoes_adicionar.forEach(botao => {
    botao.addEventListener('click', function() {
        const li = botao.parentElement
        const nome = li.querySelector('.nome').textContent.trim()

        // Verifica se é uma pizza com dois preços
        const spanMedia = li.querySelector('.preco-media')
        const spanFamiliar = li.querySelector('.preco-familiar')

        if (spanMedia && spanFamiliar) {
            // É uma pizza — mostra o popup
            const precoMedia = spanMedia.textContent.trim()
            const precoFamiliar = spanFamiliar.textContent.trim()

            document.getElementById('popup-nome').textContent = nome
            document.getElementById('popup-preco-media').textContent = precoMedia
            document.getElementById('popup-preco-familiar').textContent = precoFamiliar

            botaoPizzaActual = botao  // guarda o botão para usar depois
            document.getElementById('popup-pizza').classList.remove('escondido')
            return  // para aqui — não adiciona ao carrinho ainda
        }

        // Não é pizza — processo normal
        adicionarAoCarrinho(botao, li, nome)
    })
})

// Função reutilizável para adicionar ao carrinho
function adicionarAoCarrinho(botao, li, nome, precoOverride = null) {
    let preco

    if (precoOverride !== null) {
        preco = precoOverride
    } else {
        const spanPreco = li.querySelector('.preço') ||
                          li.querySelector('.preco-media')
        if (!spanPreco) return
        preco = parseInt(
            spanPreco.textContent
            .replace('Kz', '').replace(/\./g, '').trim()
        )
    }

    if (isNaN(preco)) {
        alert('Este item ainda não tem preço definido!')
        return
    }

    const itens = { nome: nome, preco: preco }
    carrinho.push(itens)
    actualizarCarrinho()

    // Feedback visual
    botao.textContent = '✔️ Adicionado'
    botao.classList.add('btn-adicionado')
    botao.disabled = true

    setTimeout(function() {
        botao.textContent = '+ Adicionar'
        botao.classList.remove('btn-adicionado')
        botao.disabled = false
    }, 2000)
}

// Botão Média no popup
document.getElementById('btn-media').addEventListener('click', function() {
    if (!botaoPizzaActual) return
    const li = botaoPizzaActual.parentElement
    const nome = li.querySelector('.nome').textContent.trim()
    const precoTexto = li.querySelector('.preco-media').textContent
    const preco = parseInt(
        precoTexto.replace('Kz', '').replace(/\./g, '').trim()
    )

    adicionarAoCarrinho(botaoPizzaActual, li, nome + ' (Média)', preco)
    document.getElementById('popup-pizza').classList.add('escondido')
    botaoPizzaActual = null
})

// Botão Familiar no popup
document.getElementById('btn-familiar').addEventListener('click', function() {
    if (!botaoPizzaActual) return
    const li = botaoPizzaActual.parentElement
    const nome = li.querySelector('.nome').textContent.trim()
    const precoTexto = li.querySelector('.preco-familiar').textContent
    const preco = parseInt(
        precoTexto.replace('Kz', '').replace(/\./g, '').trim()
    )

    adicionarAoCarrinho(botaoPizzaActual, li, nome + ' (Familiar)', preco)
    document.getElementById('popup-pizza').classList.add('escondido')
    botaoPizzaActual = null
})

// Botão Cancelar
document.getElementById('btn-cancelar-pizza').addEventListener('click', function() {
    document.getElementById('popup-pizza').classList.add('escondido')
    botaoPizzaActual = null
})

// Fecha popup ao clicar fora
document.getElementById('popup-pizza').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.add('escondido')
        botaoPizzaActual = null
    }
})

function actualizarCarrinho(){
    const lista = document.getElementById('carrinho-lista')
    const total = document.getElementById('carrinho-total')
    document.getElementById('carrinho-contador').textContent = carrinho.length

    //Limpa a lista antes de redesenhar;
    lista.innerHTML = ''

    //Variável Para somar o Total;
    let totalValor = 0

    //Para cada item no array carrinho;
    carrinho.forEach((item , index) => {
        //Cria itens com o nome e preço;
        const li = document.createElement('li')
        li.classList.add('carrinho-item')
        li.textContent = `${item.nome} - ${item.preco} Kz`
        lista.appendChild(li)

        //Botão Eliminar Item;
        const btnEliminar = document.createElement('button')
        btnEliminar.textContent = '🗙'
        btnEliminar.classList.add('btn-eliminar')
        btnEliminar.addEventListener('click' , function(){
            carrinho.splice(index , 1)
            actualizarCarrinho()
        })

        li.appendChild(btnEliminar)
        lista.appendChild(li)

        //Soma o Total;
        totalValor += item.preco
    })

    //Actualiza o texto do total;
    total.textContent = totalValor + ' Kz'

    //Mostrar Botão de carrinho apenas se houver Item;
    const btnCarrinho = document.getElementById('btn-carrinho')
    if(carrinho.length > 0){
        btnCarrinho.classList.add('visivel')

    } else {
        btnCarrinho.classList.remove('visivel')
    }

    const painel = document.getElementById('carrinho-painel')
    if(carrinho.length === 0){
        painel.classList.add('escondido')

    } else {

    }

    //Re-processa os emojis criados dinamicamente;
    twemoji.parse(document.getElementById('carrinho-painel'))
}

//Adicionando Toggle do Painel;
document.getElementById('btn-carrinho').addEventListener('click' , function(){
    document.getElementById('carrinho-painel').classList.toggle('escondido')
})

//Botão WhatsApp!

document.getElementById('btn-whatsapp').addEventListener('click', function() {
    
    let mensagem = '🍽️ *Pedido - Captain Bob*\n\n'
    
    carrinho.forEach(item => {
        mensagem += `• ${item.nome} — ${item.preco} Kz\n`
    })
    
    // Calcula o total — como fizeste na função actualizarCarrinho
    let total = 0
    carrinho.forEach(item => {
        total += item.preco
    })
    
    mensagem += `\n*Total: ${total} Kz*`
    
    
    // Abre o WhatsApp — preenche o ???
    window.open('https://wa.me/244943567154?text=' + encodeURIComponent(mensagem))
})

//Animações;
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visivel-anim')
            observer.unobserve(entry.target)  // só anima uma vez
        }
    })
}, { threshold: 0.1 })

// Observa serviços e contactos
document.querySelectorAll('#serviços article, #contactos > div').forEach(el => {
    observer.observe(el)
})

//Implementação de emojis externos:twemoji;
twemoji.parse(document.body)



