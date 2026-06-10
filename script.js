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
            Document.getElementById('menu').scrollIntoView({
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

botoes_adicionar.forEach(botao => {
    botao.addEventListener('click' , function(){
        const li = botao.parentElement
        const nome = li.querySelector('.nome').textContent

        const spanPreco = li.querySelector('.preço') || 
                          li.querySelector('.preco-media')

        if (!spanPreco) return

        const preco = parseInt(
            spanPreco.textContent
            .replace('Kz', '').replace(/\./g, '')
        )

        if (isNaN(preco)) {
            alert('Este item ainda não tem preço definido!')
            return
        }

        //Criar um Objecto com os daddos do prato;
        const itens = {
            nome: nome,
            preco: preco
        }

        //Adicionar os itens selecionados ao carrinho;
        carrinho.push(itens)
        actualizarCarrinho()     

        //Feedback Visual dos Botões;
        botao.textContent = '✔️'
        botao.classList.add('btn-adicionado')
        botao.disable = true //Impede clicar duas vezes antes de 2 segundos;

        //Volta ao Estado Original após 2 segundos;
        setTimeout(function(){
            botao.textContent = '+ Adicionar'
            botao.classList.remove('btn-adicionado')
            botao.disable = false
        }, 2000)
    }) 
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

//Scrool Reveal;

ScrollReveal().reveal('#serviços article' , {
    delay:150,
    distance:'40px',
    origin:'bottom',
    interval:120,
    reset: false
})


//Detecta se o dispositivo é Mobile;

const isMobile = window.innerWidth <= 768

ScrollReveal().reveal('#serviços article' , {
    delay: isMobile ? 50 : 200,
    distance: isMobile ? '20px' : '50px',
    origin: 'bottom',
    interval: isMobile ? 80 : 150
})

ScrollReveal.reveal('#menu article' ,  {
    delay: isMobile ? 30 : 100,
    distance: isMobile ? '15px' : '30px',
    origin: 'left'
})


//Implementação de emojis externos:twemoji;
twemoji.parse(document.body)



