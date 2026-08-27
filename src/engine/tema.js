/**
 * Escolha de tema — global e guardada no browser (localStorage), como o resto
 * das preferências desta app. Aplica-se pondo `data-tema` no <html>, que é o
 * elemento onde o CSS declara as variáveis de paleta.
 */
import { TEMA_PADRAO, temaExiste } from '../data/temas.js';

// NOTA: a app passou a chamar-se Ordo, mas as chaves de localStorage
// mantêm o prefixo antigo de propósito — mudá-las apagava o tema e as
// preferências de quem já usa a app.
const CHAVE = 'claudio:tema';

export function lerTema() {
  try {
    const id = localStorage.getItem(CHAVE);
    return temaExiste(id) ? id : TEMA_PADRAO;
  } catch {
    return TEMA_PADRAO;
  }
}

export function guardarTema(id) {
  try {
    if (temaExiste(id)) localStorage.setItem(CHAVE, id);
  } catch {
    /* modo privado / storage cheio — o tema fica só nesta sessão */
  }
}

/**
 * Põe o tema em vigor. O tema base (`sangue`) não escreve atributo nenhum —
 * é o que está no `:root`, e assim o HTML fica limpo por omissão.
 */
export function aplicarTema(id) {
  const alvo = temaExiste(id) ? id : TEMA_PADRAO;
  const raiz = document.documentElement;
  if (alvo === TEMA_PADRAO) raiz.removeAttribute('data-tema');
  else raiz.setAttribute('data-tema', alvo);
  return alvo;
}

// --------------------------------------------------- fundo escuro (acessibilidade)

const CHAVE_FUNDO = 'claudio:fundo-escuro';

/**
 * Modo de fundo escuro: baixa a decoração toda (mosaico de sigilos, entidade,
 * roda, brasas e halos) para quem tenha dificuldade em ler por cima dela.
 * NÃO troca a paleta — o tema escolhido mantém-se; só se apaga o cenário.
 * Ver `body.fundo-escuro` em styles.css.
 */
export function lerFundoEscuro() {
  try {
    return localStorage.getItem(CHAVE_FUNDO) === '1';
  } catch {
    return false;
  }
}

export function guardarFundoEscuro(ligado) {
  try {
    if (ligado) localStorage.setItem(CHAVE_FUNDO, '1');
    else localStorage.removeItem(CHAVE_FUNDO);
  } catch {
    /* modo privado / storage cheio — fica só nesta sessão */
  }
}

export function aplicarFundoEscuro(ligado) {
  document.body.classList.toggle('fundo-escuro', Boolean(ligado));
  return Boolean(ligado);
}
