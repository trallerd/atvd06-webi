let jogo;

const elementos = {
  telaInicial: document.getElementById('inicial'),
  telaJogo: document.getElementById('jogo'),
  telaCadastra: document.getElementById('cadastrar'),
  telaMensagem: document.querySelector('.mensagem'),
  textoMensagem: document.querySelector('.mensagem .texto'),
  teclado: document.querySelector('.teclado'),
  palavra: document.querySelector('.palavra'),
  botoes: {
    facil: document.querySelector('.botao-facil'),
    medio: document.querySelector('.botao-medio'),
    dificil: document.querySelector('.botao-dificil'),
    reiniciar: document.querySelector('.reiniciar'),
    cena: document.querySelector('.botao-cadastra'),
    cadastra: document.querySelector('.botao-palavra'),
    volta: document.querySelector('.botao-voltar'),
  },
  boneco: [
    document.querySelector('.boneco-cabeca'),
    document.querySelector('.boneco-corpo'),
    document.querySelector('.boneco-braco-esquerdo'),
    document.querySelector('.boneco-braco-direito'),
    document.querySelector('.boneco-perna-esquerda'),
    document.querySelector('.boneco-perna-direita'),
  ],
};

const palavras = {
  facil: [
    { palavra: 'anciã', dica: 'pessoa idosa' },
    { palavra: 'série', dica: 'entretenimento televisivo' },
    { palavra: 'avaro', dica: 'AVARENTO' },
    { palavra: 'maior', dica: 'Que não é pequeno' },
    { palavra: 'noite', dica: 'contrario de dia' },
    { palavra: 'ímpar', dica: 'contrario de par' },
    { palavra: 'salvo', dica: 'contrario de perdido' },
    { palavra: 'vetor', dica: 'geometria' },
    { palavra: 'prado', dica: 'municipio do estado da Bahia' },
    { palavra: 'pecha', dica: 'O mesmo que percha' },
  ],
  medio: [
    { palavra: 'cônjuge', dica: 'casal' },
    { palavra: 'exceção', dica: 'não é regra' },
    { palavra: 'efêmero', dica: 'que dura um dia' },
    { palavra: 'prolixo', dica: 'que não sabe sintetizar o pensamento' },
    { palavra: 'idílico', dica: 'relativo a ou que tem o caráter de idílio' },
    { palavra: 'análogo', dica: 'referente a analogia' },
    { palavra: 'caráter', dica: 'sinal' },
    { palavra: 'genuíno', dica: 'verdadeiro' },
    { palavra: 'estória', dica: 'narrativa de cunho popular e tradicional' },
    { palavra: 'sublime', dica: 'elevado' },
  ],
  dificil: [
    { palavra: 'concepção', dica: 'criação' },
    { palavra: 'plenitude', dica: 'integridade' },
    { palavra: 'essencial', dica: 'primordial' },
    { palavra: 'hipócrita', dica: 'ato de fingir ter crenças, virtudes' },
    { palavra: 'corolário', dica: 'afirmação deduzida de uma verdade já demonstrada' },
    { palavra: 'paradigma', dica: ' conceito das ciências e da epistemologia que define um exemplo típico ou modelo de algo' },
    { palavra: 'dicotomia', dica: 'é uma partição de um todo em duas partes' },
    { palavra: 'hegemonia', dica: 'supremacia' },
    { palavra: 'ratificar', dica: 'confirmar' },
    { palavra: 'propósito', dica: 'intensão' },
  ],
};

const novoJogo = () => {
  jogo = {
    dificuldade: undefined,
    palavra: {
      original: undefined,
      semAcentos: undefined,
      tamanho: undefined,
    },
    acertos: undefined,
    jogadas: [],
    chances: 6,
    definirPalavra: function (palavra) {
      this.palavra.original = palavra;
      this.palavra.tamanho = palavra.length;
      this.acertos = '';
      this.palavra.semAcentos = this.palavra.original.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      for (let i = 0; i < this.palavra.tamanho; i++) {
        this.acertos += ' ';
      }
    },
    jogar: function (letraJogada) {
      let acertou = false;
      for (let i = 0; i < this.palavra.tamanho; i++) {
        const letra = this.palavra.semAcentos[i].toLowerCase();
        if (letra === letraJogada.toLowerCase()) {
          acertou = true;
          this.acertos = replace(this.acertos, i, this.palavra.original[i]);
        }
      }
      if (!acertou) {
        this.chances--;
      }
      return acertou;
    },
    ganhou: function () {
      return !this.acertos.includes(' ');
    },
    perdeu: function () {
      return this.chances <= 0;
    },
    acabou: function () {
      return this.ganhou() || this.perdeu();
    },
  };

  elementos.telaInicial.style.display = 'flex';
  elementos.telaCadastra.style.display = 'none';
  elementos.telaJogo.style.display = 'none';
  elementos.telaMensagem.style.display = 'none';
  elementos.telaMensagem.classList.remove('mensagem-vitoria');
  elementos.telaMensagem.classList.remove('mensagem-derrota');
  for (const parte of elementos.boneco) {
    parte.classList.remove('escondido');
    parte.classList.add('escondido');
  }

  criarTeclado();
};

const criarTeclado = () => {
  const letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  elementos.teclado.textContent = '';
  for (const letra of letras) {
    const button = document.createElement('button');
    button.appendChild(document.createTextNode(letra.toUpperCase()));
    button.classList.add(`botao-${letra}`);

    elementos.teclado.appendChild(button);

    document.addEventListener('keydown', event => {
      if (!jogo.jogadas.includes(event.key) && !jogo.acabou()) {
        const acertou = jogo.jogar(event.key);
        jogo.jogadas.push(event.key);
        button.classList.add(acertou ? 'certo' : 'errado');
        mostrarPalavra();

        if (!acertou) {
          mostrarErro();
        }

        if (jogo.ganhou()) {
          mostrarMensagem(true);
        } else if (jogo.perdeu()) {
          mostrarMensagem(false);
        }
      }
    });

    button.addEventListener('click', () => {
      if (!jogo.jogadas.includes(letra) && !jogo.acabou()) {
        const acertou = jogo.jogar(letra);
        jogo.jogadas.push(letra);
        button.classList.add(acertou ? 'certo' : 'errado');
        mostrarPalavra();

        if (!acertou) {
          mostrarErro();
        }

        if (jogo.ganhou()) {
          mostrarMensagem(true);
        } else if (jogo.perdeu()) {
          mostrarMensagem(false);
        }
      }
    });
  }
};

const mostrarErro = () => {
  const parte = elementos.boneco[5 - jogo.chances];
  parte.classList.remove('escondido');
};

const mostrarMensagem = vitoria => {
  const mensagem = vitoria ? '<p>Parabéns!</p><p>Você GANHOU!</p>' : '<p>Que pena!</p><p>Você PERDEU!</p>';
  elementos.textoMensagem.innerHTML = mensagem;
  elementos.telaMensagem.style.display = 'flex';
  elementos.telaMensagem.classList.add(`mensagem-${vitoria ? 'vitoria' : 'derrota'}`);
};

const sortearPalavra = () => {
  const i = Math.floor(Math.random() * palavras[jogo.dificuldade].length);
  const palavra = palavras[jogo.dificuldade][i].palavra;
  document.querySelector('.dica').textContent = palavras[jogo.dificuldade][i].dica;
  jogo.definirPalavra(palavra);

  console.log(jogo.palavra.original);

  return jogo.palavra.original;
};

const mostrarPalavra = () => {
  elementos.palavra.textContent = '';
  for (let i = 0; i < jogo.acertos.length; i++) {
    const letra = jogo.acertos[i].toUpperCase();
    elementos.palavra.innerHTML += `<div class="letra-${i}">${letra}</div>`;
  }
};

const iniciarJogo = dificuldade => {
  jogo.dificuldade = dificuldade;
  elementos.telaInicial.style.display = 'none';
  elementos.telaCadastra.style.display = 'none';
  elementos.telaJogo.style.display = 'flex';

  sortearPalavra();
  mostrarPalavra();
};

const cenaPalavra = () => {
  elementos.telaInicial.style.display = 'none';
  elementos.telaCadastra.style.display = 'flex';
  elementos.telaJogo.style.display = 'none';
};

const cadastraPalavras = () => {
  let palav = document.querySelector('#input-palavra');
  let dificult = document.querySelector('#select-dificuldade');
  let dic = document.querySelector('#input-dica');
  if (dificult.value == 'facil') {
    palavras.facil.push({ palavra: palav.value, dica: dic.value });
    novoJogo();
  } else if (dificult.value == 'medio') {
    palavras.medio.push({ palavra: palav.value, dica: dic.value });
    novoJogo();
  }
  if (dificult.value == 'dificil') {
    palavras.dificil.push({ palavra: palav.value, dica: dic.value });
    novoJogo();
  }
};

const replace = (str, i, newChar) => str.substring(0, i) + newChar + str.substring(i + 1);

elementos.botoes.facil.addEventListener('click', () => iniciarJogo('facil'));
elementos.botoes.medio.addEventListener('click', () => iniciarJogo('medio'));
elementos.botoes.dificil.addEventListener('click', () => iniciarJogo('dificil'));
elementos.botoes.cena.addEventListener('click', () => cenaPalavra());
elementos.botoes.volta.addEventListener('click', () => novoJogo());
elementos.botoes.cadastra.addEventListener('click', () => cadastraPalavras());

elementos.botoes.reiniciar.addEventListener('click', () => novoJogo());

novoJogo();
