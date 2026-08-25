// TRILHA DO MONSTRUOSO — motor.
//
// Regra-mãe (ver cabeçalho de data/monstruoso.js): TUDO nesta trilha só está
// em efeito enquanto `personagem.monstruosoAtivoHoje` for verdadeiro. Nada é
// aplicado "à mão" nem fica registado num histórico — este ficheiro calcula
// ao vivo, a cada chamada, o que está atualmente em efeito a partir de
// (classe, elemento, patamar, ativo hoje). Ao desativar, tudo desaparece
// sozinho. As DUAS exceções (as únicas coisas que o livro chama de
// "permanente") são tratadas à parte: a perda de 1 Presença aos 65%/99%
// (aplicada uma vez, mutando `personagem.atributos.pre` de verdade — não é
// um efeito ao vivo), e o "tudo fica permanente" do Combatente aos 99%.
//
// Importante (não misturar):
//   - Testes de perícia/ataque usam um POOL de d20 (dadosPericia altera-o).
//   - Rolagens de DANO são outra coisa (dados fixos como 1d8, 1d6...).
//   - Alguns bónus do livro (ex.: "+1d8 em testes de ataque") não são nem
//     uma coisa nem outra — são um dado FIXO somado ao TOTAL do teste, à
//     parte da pool. Ver `dadosExtra` em engine/dados.js.
// As 3 classes desta trilha são estruturalmente diferentes (ver cabeçalho de
// data/monstruoso.js) — o Ocultista não tem RD nem dano extra, por exemplo.

import {
  PATAMARES_MONSTRUOSO, ATRIBUTO_DO_ELEMENTO, PERICIAS_PENALIZADAS,
  PROGRESSAO_PENALIDADE, RECUPERACAO_POR_PATAMAR, CONSOME_COMPONENTE,
  PE_POR_ATRIBUTO_DESDE, SOMA_ATRIBUTO_EM_PERICIAS, SOMA_ATRIBUTO_DESDE,
  EFEITOS_DIARIOS_COMBATENTE, DESLOCAMENTO_ENERGIA_EXTRA, deslocamentoEnergiaExtraAtual,
  PV_TEMP_IMEDIATO_MORTE, pvTempImediatoMorteAtual,
  PERICIAS_LIVRES_CONHECIMENTO_POR_PATAMAR, quantidadePericiasLivresConhecimento,
  TREINO_INICIAL, EFEITOS_POR_PATAMAR, TEXTOS_POR_PATAMAR, CONSEQUENCIAS, TRILHA_ID_POR_CLASSE,
  NOME_PODER_POR_PATAMAR, RESISTENCIA_POR_PATAMAR, RESISTENCIA_TIPOS_COMBATENTE,
  RESISTENCIA_TIPOS_COMBATENTE_IDS, RESISTENCIA_ENERGIA_QUIMICO_DESDE,
  DRENAGEM_ATRIBUTO, COR_ELEMENTO, TAMANHO_ESPECIALISTA_SANGUE,
  patamaresPresencaPermanente, TUDO_PERMANENTE_DESDE,
} from '../data/monstruoso.js';
import { PERICIAS } from '../data/pericias.js';
import { RITUAIS, RITUAIS_POR_ID } from '../data/rituais.js';
import { rolarDano } from './dados.js';
import { CONDICOES_POR_ID } from '../data/condicoes.js';

const CLASSES_MONSTRUOSAS = ['combatente', 'especialista', 'ocultista'];
const ATRIBUTOS_BASE = { for: 0, agi: 0, int: 0, pre: 0, vig: 0 };

/** A classe atual segue a trilha do Monstruoso? Devolve o id da classe, ou null. */
export function classeMonstruosa(personagem) {
  const classeId = personagem?.classeId;
  if (!CLASSES_MONSTRUOSAS.includes(classeId)) return null;
  return personagem.trilhaId === TRILHA_ID_POR_CLASSE[classeId] ? classeId : null;
}

/** O maior patamar (10/40/65/99) já alcançado por este NEX, ou 0. */
export function patamarAtual(nex) {
  const n = Number(nex) || 0;
  let p = 0;
  for (const v of PATAMARES_MONSTRUOSO) if (n >= v) p = v;
  return p;
}

export function elementoAtual(personagem) {
  return personagem?.monstruosoElemento || null;
}

/** Só o Combatente, aos 99%: tudo fica sempre ligado (ver data/monstruoso.js). */
export function tudoPermanente(personagem, nex) {
  const classe = classeMonstruosa(personagem);
  if (!classe) return false;
  const desde = TUDO_PERMANENTE_DESDE[classe];
  return desde != null && patamarAtual(nex) >= desde;
}

/**
 * O "interruptor mestre" usado por tudo nesta trilha: os efeitos diários
 * estão em vigor quando a etapa de hoje foi feita OU quando o Combatente já
 * passou o ponto em que tudo fica permanente.
 */
export function efetivamenteAtivo(personagem, nex) {
  return Boolean(personagem?.monstruosoAtivoHoje) || tudoPermanente(personagem, nex);
}

function chaveGanho(classe, elemento, g, idx) {
  return `${classe}|${elemento}|${g.patamar}|${g.tipo}|${g.elemento || g.nome || g.pericia || idx}`;
}

/** Todas as entradas de EFEITOS_POR_PATAMAR já desbloqueadas (patamar <= atual), com id estável. */
function entradasDesbloqueadas(personagem, nex) {
  const classe = classeMonstruosa(personagem);
  const elemento = elementoAtual(personagem);
  if (!classe || !elemento) return [];
  const patamar = patamarAtual(nex);
  const lista = EFEITOS_POR_PATAMAR[classe]?.[elemento] || [];
  return lista
    .filter((g) => g.patamar <= patamar)
    .map((g, idx) => ({ ...g, id: chaveGanho(classe, elemento, g, idx) }));
}

/** As mesmas entradas, mas só as que estão EM EFEITO agora (etapa ativa, ou Combatente 99%+). */
export function ganhosAtivos(personagem, nex) {
  if (!efetivamenteAtivo(personagem, nex)) return [];
  return entradasDesbloqueadas(personagem, nex);
}

/** Notas informativas (TEXTOS_POR_PATAMAR) atualmente em efeito, na ordem do patamar. */
export function textosAtivos(personagem, nex) {
  if (!efetivamenteAtivo(personagem, nex)) return [];
  const classe = classeMonstruosa(personagem);
  const elemento = elementoAtual(personagem);
  if (!classe || !elemento) return [];
  const patamar = patamarAtual(nex);
  const lista = TEXTOS_POR_PATAMAR[classe]?.[elemento] || [];
  return lista.filter((t) => t.patamar <= patamar);
}

/**
 * Escolhas do jogador que a trilha pede (ritual à escolha, perícias livres).
 * Ficam disponíveis para configurar assim que o patamar é alcançado — não
 * dependem da etapa estar ativa hoje (tal como a escolha do elemento em si);
 * só o EFEITO da escolha (perícia treinada, ritual conhecido) é diário.
 */
export function escolhasNecessarias(personagem, nex) {
  return entradasDesbloqueadas(personagem, nex).filter((g) => g.tipo === 'ritual-escolha' || g.tipo === 'pericias-livres');
}

function escolhasDe(personagem) {
  return personagem?.monstruosoEscolhas || { periciasConhecimento: [], rituais: {} };
}

/** Guarda a escolha de um ritual "à escolha" (ex.: Ocultista Sangue 99%, dois slots). */
export function escolherRitual(personagem, ganhoId, ritualId) {
  const escolhas = escolhasDe(personagem);
  return { patch: { monstruosoEscolhas: { ...escolhas, rituais: { ...(escolhas.rituais || {}), [ganhoId]: ritualId } } } };
}

/** Guarda a escolha das perícias livres (Especialista, Conhecimento: 2 desde os 10%, 3 desde os 99%). */
export function escolherPericiasConhecimento(personagem, periciaIds) {
  const escolhas = escolhasDe(personagem);
  return { patch: { monstruosoEscolhas: { ...escolhas, periciasConhecimento: periciaIds } } };
}

export { quantidadePericiasLivresConhecimento };

/**
 * Combatente-Conhecimento, 65%+ (Ser Assustador): pode deixar de ser
 * treinado numa perícia para ganhar um banco de dados de bónus (= Intelecto)
 * — até ao fim da cena, gasta 1 de cada vez para +1 dado no pool de um
 * teste. Recupera a perícia (e esvazia o banco) no próximo interlúdio —
 * ver `calcularInterludio`/`aplicarDescansoPleno` em engine/interludio.js.
 */
export function podeUsarBancoConhecimento(personagem, nex) {
  return classeMonstruosa(personagem) === 'combatente'
    && elementoAtual(personagem) === 'Conhecimento'
    && patamarAtual(nex) >= 65
    && efetivamenteAtivo(personagem, nex);
}

/**
 * Escolhe a perícia a destreinar e abre o banco de dados. O tamanho do banco
 * usa o Intelecto EFETIVO (`atributosEfetivos`, não o atributo base) — o
 * próprio Combatente-Conhecimento já tem +1 Intelecto vivo desde os 40% e
 * outro +1 (total +2) aos 99%, e esse bónus tem de entrar na conta. Só uma
 * perícia destreinada de cada vez.
 */
export function escolherPericiaParaDestreinar(personagem, periciaId, nex) {
  if (personagem.monstruosoPericiaDestreinada) {
    return { erro: 'Já tens uma perícia destreinada por esta habilidade — recupera-a num interlúdio antes de escolher outra.' };
  }
  const atual = personagem.pericias?.[periciaId];
  if (!atual || !atual.grau || atual.grau === 'destreinado') {
    return { erro: 'Escolhe uma perícia que já esteja treinada.' };
  }
  const intelecto = Math.max(0, Number(atributosEfetivos(personagem, nex).int || 0));
  return {
    patch: {
      pericias: { ...(personagem.pericias || {}), [periciaId]: { ...atual, grau: 'destreinado' } },
      monstruosoPericiaDestreinada: periciaId,
      monstruosoBancoDados: intelecto,
      monstruosoBancoPendente: false,
    },
  };
}

/** Gasta 1 dado do banco — fica pendente para somar +1 ao pool do PRÓXIMO teste rolado. */
export function gastarDadoBanco(personagem) {
  const banco = Number(personagem.monstruosoBancoDados || 0);
  if (banco <= 0) return { erro: 'Não tens dados no banco.' };
  return { patch: { monstruosoBancoDados: banco - 1, monstruosoBancoPendente: true } };
}

/** Soma o dado pendente do banco (se houver) ao tamanho do pool de um teste prestes a ser rolado. */
export function comBancoPendente(personagem, dados) {
  return personagem?.monstruosoBancoPendente ? Number(dados || 0) + 1 : Number(dados || 0);
}

/**
 * Ocultista-Sangue (Trilha do Monstruoso, AS07, 40%+ "Ser Perfurado"): a
 * Tatuagem Ritualística (poder base do Ocultista) passa a aplicar-se a
 * QUALQUER ritual de Sangue marcado na pele, não só aos de alcance Pessoal
 * com você como alvo. Verbatim: "ele também se aplica a todos os rituais
 * de Sangue marcados em sua pele, não apenas aos de alcance pessoal que
 * têm você como alvo".
 */
export function tatuagemAlargadaSangue(personagem, nex) {
  return classeMonstruosa(personagem) === 'ocultista'
    && elementoAtual(personagem) === 'Sangue'
    && patamarAtual(nex) >= 40
    && efetivamenteAtivo(personagem, nex);
}

/**
 * -1 PE se o ritual estiver marcado (tatuado): pela regra base (alcance
 * Pessoal + alvo "você", qualquer elemento) ou, alargado, por
 * `tatuagemAlargadaSangue` (qualquer ritual de elemento 'sangue' marcado).
 */
export function reducaoTatuagemRitualistica(personagem, nex, ritual, marcado) {
  if (!marcado || !ritual) return 0;
  const basico = ritual.alcance === 'Pessoal' && ritual.alvo === 'você';
  const alargado = ritual.elemento === 'sangue' && tatuagemAlargadaSangue(personagem, nex);
  return (basico || alargado) ? 1 : 0;
}

/**
 * Ocultista-Sangue 40%+: +5 em testes de Concentração ao conjurar/manter um
 * ritual de Sangue marcado na pele (verbatim AS07). Devolve 0 se não se
 * aplicar (elemento diferente, ritual não marcado, ou patamar insuficiente).
 */
export function bonusConcentracaoTatuagem(personagem, nex, ritual, marcado) {
  if (!marcado || !ritual || ritual.elemento !== 'sangue') return 0;
  return tatuagemAlargadaSangue(personagem, nex) ? 5 : 0;
}

/**
 * Ocultista-Sangue 40%+: 1x/cena, se machucado ou sob condição de fadiga,
 * pode conjurar como reação (em vez da ação normal exigida para conjurar
 * um ritual) um ritual de Sangue marcado na pele — continua a gastar o
 * custo de PE normal do ritual. "Cena" não tem fronteira automática nesta
 * app (ver nota geral em engine/interludio.js) — o próprio jogador repõe
 * manualmente.
 */
export function podeReagirTatuagemSangue(personagem, nex, ritual, marcado) {
  if (!marcado || !ritual || ritual.elemento !== 'sangue') return false;
  if (!tatuagemAlargadaSangue(personagem, nex)) return false;
  if (personagem.monstruosoReacaoTatuagemUsada) return false;
  const condicoes = personagem.condicoes || [];
  const machucado = condicoes.includes('machucado');
  const fadigado = condicoes.some((id) => CONDICOES_POR_ID[id]?.tipo === 'fadiga');
  return machucado || fadigado;
}

/**
 * Soma viva de todos os deltas de atributo em efeito agora (ganhos por
 * patamar + a drenagem de "Ser Testado", que também é diária e reverte ao
 * desativar). Não inclui a perda de Presença permanente — essa já está
 * dentro de `personagem.atributos.pre` (foi mutada a sério, uma vez) — por
 * isso os deltas de 'atributo' com atributo 'pre' (ex.: a segunda perda do
 * Combatente-Morte aos 99%) são ignorados aqui: são tratados por
 * `presencaPendente`/`ativarHoje`, não como efeito ao vivo.
 */
function deltasAtributoAtivos(personagem, nex) {
  const deltas = { ...ATRIBUTOS_BASE };
  for (const g of ganhosAtivos(personagem, nex)) {
    if (g.tipo === 'atributo' && g.atributo !== 'pre') deltas[g.atributo] = (deltas[g.atributo] || 0) + g.delta;
  }
  const classe = classeMonstruosa(personagem);
  const elemento = elementoAtual(personagem);
  const patamar = patamarAtual(nex);
  if (efetivamenteAtivo(personagem, nex) && classe === 'especialista' && elemento && patamar >= 40) {
    const n = Math.max(0, Number(personagem.monstruosoDrenagem || 0));
    if (n > 0) deltas[DRENAGEM_ATRIBUTO[elemento]] = (deltas[DRENAGEM_ATRIBUTO[elemento]] || 0) - n;
  }
  return deltas;
}

/**
 * Atributos "efetivos" da personagem, já com os bónus/penalidades ao vivo da
 * trilha do Monstruoso somados (For/Agi/Int/Vig — nunca Presença, que só
 * muda pela perda permanente, já dentro do atributo base). Usar isto em vez
 * de `personagem.atributos` em qualquer cálculo (PV, PE, perícias, carga,
 * Defesa) para que os bónus/penalidades da trilha se reflitam em tudo.
 */
export function atributosEfetivos(personagem, nex) {
  const base = { ...ATRIBUTOS_BASE, ...(personagem?.atributos || {}) };
  const classe = classeMonstruosa(personagem);
  if (!classe) return base;
  const deltas = deltasAtributoAtivos(personagem, nex);
  const efetivos = { ...base };
  for (const attr of Object.keys(ATRIBUTOS_BASE)) {
    if (attr === 'pre') continue; // Presença nunca muda por aqui — ver perda permanente
    efetivos[attr] = Math.max(0, Number(base[attr] || 0) + Number(deltas[attr] || 0));
  }
  return efetivos;
}

/** Armas naturais concedidas pela trilha, atualmente em efeito (lista pronta para o combate). */
export function ataquesNaturaisAtivos(personagem, nex) {
  return ganhosAtivos(personagem, nex)
    .filter((g) => g.tipo === 'ataque-natural')
    .map((g) => ({
      nome: g.nome, pericia: 'luta', bonus: '', dano: g.dano,
      critico: g.critico, tipo: g.tipoDano, alcance: '', espacos: 0,
      categoria: '', atributoDano: 'for', equipado: true, danoExtra: [], modificacoes: [],
      notas: 'Concedido pela Trilha do Monstruoso — só existe enquanto a etapa de hoje está ativa.',
      _monstruoso: true, _monstruosoId: g.id,
    }));
}

/** Rituais concedidos pela trilha, atualmente em efeito (só os já escolhidos, quando aplicável). */
export function rituaisAtivos(personagem, nex) {
  const escolhas = escolhasDe(personagem);
  const resultado = [];
  for (const g of ganhosAtivos(personagem, nex)) {
    if (g.tipo === 'ritual-toque') {
      // Poder de toque (ex.: Especialista-Conhecimento 65%: Detecção de
      // Ameaças/Mergulho Mental) — NÃO é uma conjuração normal (livro: ação
      // completa + custo fixo de PE, sem teste de Ocultismo, sem custo por
      // círculo). Aparece na lista de rituais por pedido explícito, mas
      // `_semTeste` avisa a interface para desconta só o PE, sem rolar.
      resultado.push({
        nome: g.nome, circulo: '', elemento: '',
        execucao: 'ação completa (toque)', alcance: 'toque', alvo: '', duracao: '',
        resistencia: '', custo: `${g.custoPe} PE`,
        descricao: 'Concedido pela Trilha do Monstruoso — poder de toque fixo, sem teste de Ocultismo.',
        _monstruoso: true, _monstruosoId: g.id, _semTeste: true, _custoFixoPe: g.custoPe,
      });
      continue;
    }
    if (g.tipo !== 'ritual' && g.tipo !== 'ritual-escolha') continue;
    let ritual = null;
    if (g.tipo === 'ritual') {
      ritual = RITUAIS.find((r) => r.nome.toLowerCase() === g.nome.toLowerCase()) || null;
    } else {
      const ritualId = escolhas.rituais?.[g.id];
      if (!ritualId) continue; // ainda não escolheu — nada a mostrar
      ritual = RITUAIS_POR_ID[ritualId] || null;
    }
    const entrada = ritual
      ? {
          nome: ritual.nome, circulo: ritual.circulo, elemento: ritual.elemento,
          execucao: ritual.execucao || '', alcance: ritual.alcance || '', alvo: ritual.alvo || '',
          duracao: ritual.duracao || '', resistencia: ritual.resistencia || '', custo: ritual.custo || '',
          descricao: ritual.descricao || '', _monstruoso: true, _monstruosoId: g.id,
        }
      : {
          // Nem todos os rituais citados pela trilha estão (ainda) transcritos
          // no catálogo local (ex.: "Fim Inevitável"). Não inventamos círculo,
          // elemento ou custo — só mostramos o nome e um aviso.
          nome: g.nome || '(ritual por escolher)', circulo: '', elemento: '',
          descricao: 'Ritual não encontrado no catálogo local — confirma o texto exato no livro.',
          _monstruoso: true, _monstruosoId: g.id,
        };
    resultado.push(entrada);
  }
  return resultado;
}

/**
 * Perícias treinadas pela trilha, em efeito agora: Ocultismo (10%+, todas as
 * classes) e as perícias livres do Especialista/Conhecimento (2 desde os
 * 10%, sobe para 3 aos 99% — ver PERICIAS_LIVRES_CONHECIMENTO_POR_PATAMAR).
 * `forcar` = ids a tratar como treinadas mesmo destreinadas; `flatExtra` =
 * bónus plano (o "+2 em vez de treinar" quando já é treinada por outra via);
 * `expertForcado` = ids que, aos 99%, sobem diretamente a grau Expert (a
 * trilha substitui o próprio grau que ela deu em Ser Experimentado, não é
 * cumulativo com o progresso normal de NEX da personagem).
 */
export function periciasTreinadasAtivas(personagem, nex) {
  const resultado = { forcar: new Set(), flatExtra: {}, expertForcado: new Set() };
  if (!efetivamenteAtivo(personagem, nex)) return resultado;
  const classe = classeMonstruosa(personagem);
  const elemento = elementoAtual(personagem);
  const patamar = patamarAtual(nex);
  if (!classe || !elemento || patamar < 10) return resultado;

  const treino = TREINO_INICIAL[classe];
  const jaTreinada = (personagem.pericias?.[treino.pericia]?.grau || 'destreinado') !== 'destreinado';
  if (treino.flatSempre) resultado.flatExtra[treino.pericia] = (resultado.flatExtra[treino.pericia] || 0) + treino.flatSempre;
  else if (jaTreinada && treino.flatSeJaTreinado) resultado.flatExtra[treino.pericia] = (resultado.flatExtra[treino.pericia] || 0) + treino.flatSeJaTreinado;
  else resultado.forcar.add(treino.pericia);

  if (classe === 'especialista' && elemento === 'Conhecimento') {
    const escolhas = escolhasDe(personagem);
    for (const id of escolhas.periciasConhecimento || []) {
      if (!id) continue;
      resultado.forcar.add(id);
      if (patamar >= 99) resultado.expertForcado.add(id);
    }
  }
  return resultado;
}

/** O máximo de pontos que dá para drenar hoje (limitado pelo atributo drenado). */
export function limiteDrenagem(personagem, nex) {
  const classe = classeMonstruosa(personagem);
  const elemento = elementoAtual(personagem);
  if (classe !== 'especialista' || !elemento || patamarAtual(nex) < 40) return 0;
  return Math.max(0, Number(personagem.atributos?.[DRENAGEM_ATRIBUTO[elemento]] || 0));
}

/**
 * "Ser Testado" (Especialista, 40%+): drenar pontos de um atributo (não o do
 * elemento) intensifica o efeito do dia. Cada elemento tem uma fórmula
 * PRÓPRIA e diferente — todas com uma base fixa (concedida mesmo com 0
 * pontos drenados) mais um incremento por ponto drenado (ver p.82 do livro,
 * verbatim). `personagem.monstruosoDrenagem` guarda quantos pontos o
 * jogador escolheu drenar.
 */
function efeitosDrenagem(personagem, patamar) {
  const vazio = {
    danoExtra: [], rdExtra: 0, defesaExtra: 0, turnosMorrendoExtra: 0, pvTempCena: null,
    ataqueBonusDados: [], testeBonusDadoGenerico: null,
  };
  const classe = classeMonstruosa(personagem);
  const elemento = elementoAtual(personagem);
  if (classe !== 'especialista' || !elemento || patamar < 40) return vazio;
  const n = Math.max(0, Number(personagem.monstruosoDrenagem || 0));

  if (elemento === 'Sangue') {
    // Base: +1d6 dano de Sangue e RD 2. Por ponto devorado (Intelecto):
    // +1d6 dano e RD +2. Aos 65%+, o dado do dano passa de d6 para d8.
    const faces = patamar >= 65 ? 8 : 6;
    return { ...vazio, danoExtra: [`${1 + n}d${faces}`], rdExtra: 2 + n * 2 };
  }
  if (elemento === 'Morte') {
    // Base: +1 turno de tolerância a "morrendo" e +2d8 PV temp. no início de
    // cada cena. Por ponto necrosado (Força): +1 turno e +2d8 PV temp.
    return { ...vazio, turnosMorrendoExtra: 1 + n, pvTempCena: { dados: 2 * (1 + n), faces: 8 } };
  }
  if (elemento === 'Conhecimento') {
    // Base: +1d6 em testes baseados em Intelecto. Por ponto inexistido
    // (Agilidade): +1d6. Isto é amplo (qualquer teste de Intelecto), não só
    // ataque — fica como bónus genérico (botão manual), não é aplicado
    // automaticamente a cada teste de perícia da ficha.
    return { ...vazio, testeBonusDadoGenerico: { faces: 6, quantidade: 1 + n, descricao: 'em testes baseados em Intelecto' } };
  }
  if (elemento === 'Energia') {
    // Base: +1d6 em testes de ATAQUE e +2 na Defesa. Por ponto queimado
    // (Vigor): +1d6 em testes de ataque e +2 na Defesa. Isto é
    // especificamente testes de ataque, por isso soma-se automaticamente à
    // rolagem de ataque (ver ataqueBonusDados).
    return { ...vazio, defesaExtra: 2 + n * 2, ataqueBonusDados: [{ faces: 6, quantidade: 1 + n, corpoACorpoApenas: false }] };
  }
  return vazio;
}

/**
 * Efeitos da ETAPA DE HOJE (só valem enquanto `efetivamenteAtivo`). É o que
 * `engine/calc.js` lê para ajustar pools de dados, perícias, PV máximo,
 * Defesa e deslocamento; `engine/armas.js` lê `ataqueBonusDados` para somar
 * dados extra aos testes de ataque.
 */
export function efeitosDiarios(personagem, nex) {
  const vazio = {
    dadosPericia: {}, flatPericia: {}, atributoPericia: {}, defesaExtra: 0, deslocamentoExtra: 0,
    peAtributo: null, resistenciaDano: 0, danoExtra: [], ataqueBonusDados: [],
    testeBonusDadoGenerico: null, pvTempCena: null, turnosMorrendoExtra: 0,
  };
  const classe = classeMonstruosa(personagem);
  const elemento = elementoAtual(personagem);
  if (!classe || !elemento || !efetivamenteAtivo(personagem, nex)) return vazio;

  const patamar = patamarAtual(nex);
  if (patamar < 10) return vazio;

  const dadosPericia = {};
  const flatPericia = {};
  const atributoPericia = {};

  const penalizadas = PERICIAS_PENALIZADAS[classe]?.[elemento] || [];
  const prog = PROGRESSAO_PENALIDADE[classe]?.[patamar];
  if (prog) {
    for (const id of penalizadas) {
      if (prog.dados) dadosPericia[id] = (dadosPericia[id] || 0) + prog.dados;
      if (prog.flat) flatPericia[id] = (flatPericia[id] || 0) + prog.flat;
    }
  }

  const efAtr = atributosEfetivos(personagem, nex);
  if (SOMA_ATRIBUTO_EM_PERICIAS[classe] && patamar >= SOMA_ATRIBUTO_DESDE[elemento]) {
    const attrId = ATRIBUTO_DO_ELEMENTO[elemento];
    const attrVal = Number(efAtr[attrId] || 0);
    for (const p of PERICIAS) {
      if (p.attr === attrId) flatPericia[p.id] = (flatPericia[p.id] || 0) + attrVal;
    }
  }

  // Nota: o treino/bónus de Ocultismo da trilha (periciasTreinadasAtivas) NÃO
  // entra aqui — `engine/calc.js` (calcPericias) já o lê diretamente, para
  // poder também forçar o grau "treinado" (não só somar um número). Somar
  // aqui outra vez duplicava o bónus.

  let defesaExtra = 0;
  let ataqueBonusDados = [];
  let turnosMorrendoExtraCombatente = 0;

  if (classe === 'combatente') {
    const efC = EFEITOS_DIARIOS_COMBATENTE.Conhecimento;
    if (elemento === 'Conhecimento') {
      if (patamar >= efC.defesaSomaAtributo.desde) defesaExtra += Number(efAtr[efC.defesaSomaAtributo.atributo] || 0);
      if (patamar >= efC.atributoPericia.desde) atributoPericia[efC.atributoPericia.pericia] = efC.atributoPericia.atributo;
    }
    const efM = EFEITOS_DIARIOS_COMBATENTE.Morte;
    if (elemento === 'Morte') {
      if (patamar >= efM.dadosPericia.desde) {
        dadosPericia[efM.dadosPericia.pericia] = (dadosPericia[efM.dadosPericia.pericia] || 0) + efM.dadosPericia.dados;
      }
      if (patamar >= efM.turnosMorrendoExtra.desde) turnosMorrendoExtraCombatente = efM.turnosMorrendoExtra.valor;
    }
  }

  // Grande/Enorme (Especialista, Sangue): penalidade real de Furtividade. O
  // bónus de "manobras" não existe como perícia autónoma nesta ficha — fica
  // só na nota informativa.
  if (classe === 'especialista' && elemento === 'Sangue') {
    const tamanho = patamar >= 99 ? TAMANHO_ESPECIALISTA_SANGUE[99] : patamar >= 10 ? TAMANHO_ESPECIALISTA_SANGUE[10] : null;
    if (tamanho) flatPericia.furtividade = (flatPericia.furtividade || 0) + tamanho.furtividade;
  }

  // Especialista Sangue 65%+: "+1d8 em testes de ataques corpo a corpo" —
  // sempre ativo a partir daqui, independente da drenagem.
  if (classe === 'especialista' && elemento === 'Sangue' && patamar >= 65) {
    ataqueBonusDados.push({ faces: 8, quantidade: 1, corpoACorpoApenas: true });
  }

  const deslocamentoExtra = elemento === 'Energia' ? deslocamentoEnergiaExtraAtual(classe, patamar) : 0;
  const peDesde = PE_POR_ATRIBUTO_DESDE[classe]?.[elemento];
  const peAtributo = peDesde != null && patamar >= peDesde ? ATRIBUTO_DO_ELEMENTO[elemento] : null;

  const drenagem = efeitosDrenagem(personagem, patamar);
  const resistenciaDano = drenagem.rdExtra;
  defesaExtra += drenagem.defesaExtra;
  ataqueBonusDados = [...ataqueBonusDados, ...drenagem.ataqueBonusDados];

  return {
    dadosPericia, flatPericia, atributoPericia, defesaExtra, deslocamentoExtra, peAtributo, resistenciaDano,
    danoExtra: drenagem.danoExtra, ataqueBonusDados,
    testeBonusDadoGenerico: drenagem.testeBonusDadoGenerico,
    pvTempCena: drenagem.pvTempCena, turnosMorrendoExtra: drenagem.turnosMorrendoExtra + turnosMorrendoExtraCombatente,
  };
}

/** Nome do poder (título) do patamar atual, para mostrar no cabeçalho do cartão. */
export function nomePoderAtual(personagem, nex) {
  const classe = classeMonstruosa(personagem);
  if (!classe) return null;
  const patamar = patamarAtual(nex);
  if (patamar < 10) return null;
  return NOME_PODER_POR_PATAMAR[classe][patamar];
}

/**
 * Texto de resistência a dano no patamar atual — informativo (colorido pelo
 * elemento na interface); o NÚMERO real de cada uma já entra no cálculo de
 * Bloqueio (ver `engine/calc.js` → `calcDefesas`), cada uma à sua maneira:
 *   - Combatente: RD só de TIPOS específicos por elemento (ex.: "balístico e
 *     Sangue") — como a ficha só guarda um número de Bloqueio sem tipos de
 *     dano, esta fica de fora da soma automática (não faria sentido fingir
 *     que protege de tudo) — aparece só como nota.
 *   - Especialista, Sangue (drenagem "Ser Testado", 40%+): RD GERAL, sem
 *     tipo nenhum associado no livro (só o DANO extra é "de Sangue"; a
 *     resistência em si cobre qualquer dano) — esta soma-se de facto ao
 *     Bloqueio.
 *   - Ocultista: nunca tem RD.
 */
export function resistenciaTextoAtual(personagem, nex) {
  const classe = classeMonstruosa(personagem);
  const elemento = elementoAtual(personagem);
  if (!classe || !elemento || !efetivamenteAtivo(personagem, nex)) return null;
  const patamar = patamarAtual(nex);
  if (patamar < 10) return null;
  if (classe === 'combatente') {
    return `Resistência a ${RESISTENCIA_TIPOS_COMBATENTE[elemento]} ${RESISTENCIA_POR_PATAMAR[patamar]} (só esses tipos — não soma ao Bloqueio)`;
  }
  if (classe === 'especialista' && elemento === 'Sangue' && patamar >= 40) {
    const rd = efeitosDiarios(personagem, nex).resistenciaDano;
    return rd > 0 ? `Resistência a dano ${rd} (geral, qualquer tipo — já somada ao Bloqueio)` : null;
  }
  return null;
}

/**
 * Redução de Dano automática do Combatente, por tipo de dano (id de
 * `TIPOS_DANO`, engine/danoRecetor.js) — pronta a somar ao que a personagem
 * marcar à mão na aba "Redução de Dano" da ficha (confirmado pelo
 * utilizador: soma-se, não substitui). Só o Combatente tem RD por tipo
 * específico (o Especialista-Sangue tem RD GERAL, sem tipo, já somada ao
 * Bloqueio em `engine/calc.js` → `calcDefesas`; o Ocultista não tem RD
 * nenhuma). Só está em efeito enquanto `efetivamenteAtivo` (etapa de hoje
 * ativa, ou Combatente 99%+ — "tudo permanente").
 */
export function reducaoDanoTrilhaAtiva(personagem, nex) {
  const classe = classeMonstruosa(personagem);
  const elemento = elementoAtual(personagem);
  if (classe !== 'combatente' || !elemento || !efetivamenteAtivo(personagem, nex)) return {};
  const patamar = patamarAtual(nex);
  if (patamar < 10) return {};
  const valor = RESISTENCIA_POR_PATAMAR[patamar];
  const tipos = [...(RESISTENCIA_TIPOS_COMBATENTE_IDS[elemento] || [])];
  if (elemento === 'Energia' && patamar >= RESISTENCIA_ENERGIA_QUIMICO_DESDE) tipos.push('quimico');
  const mapa = {};
  for (const id of tipos) mapa[id] = valor;
  return mapa;
}

/** Cor de referência do elemento atual (para colorir textos de dano/resistência). */
export function corElementoAtual(personagem) {
  const elemento = elementoAtual(personagem);
  return elemento ? COR_ELEMENTO[elemento] : null;
}

/** Consequências narrativas (75%/99%) já atingidas — por NEX, não pela etapa de hoje. */
export function consequenciasAtivas(nex) {
  const n = Number(nex) || 0;
  const ativas = [];
  if (n >= CONSEQUENCIAS.perturbado.desde) ativas.push(CONSEQUENCIAS.perturbado);
  if (n >= CONSEQUENCIAS.sanidadeMinima.desde) ativas.push(CONSEQUENCIAS.sanidadeMinima);
  return ativas;
}

function normalizar(txt) {
  return String(txt || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Procura "Componentes Ritualísticos de <Elemento>" no inventário — TEM de
 * ser exatamente o elemento certo. Não existe componente "genérico" que
 * sirva para qualquer elemento: o livro é claro, "componentes ritualísticos
 * são necessários para a conjuração de rituais do elemento em questão" — só
 * Sangue serve para rituais/etapa de Sangue, só Morte para Morte, etc.
 */
export function encontrarComponente(inventario, elemento) {
  const lista = inventario || [];
  const elNorm = normalizar(elemento);
  return lista.findIndex((i) => normalizar(i.nome).includes('componentes ritualistic') && normalizar(i.nome).includes(elNorm));
}

/** Tem no inventário Componentes Ritualísticos do elemento certo? */
export function temComponentesDoElemento(inventario, elemento) {
  return encontrarComponente(inventario, elemento) !== -1;
}

/**
 * Quais patamares de perda permanente de Presença (65%/99%, ver
 * `patamaresPresencaPermanente`) ainda faltam aplicar, dado o patamar atual
 * e o que já foi aplicado antes.
 */
function presencaPendente(personagem, nex) {
  const classe = classeMonstruosa(personagem);
  const elemento = elementoAtual(personagem);
  if (!classe || !elemento) return [];
  const jaPerdida = new Set(personagem.monstruosoPresencaPerdida || []);
  const patamar = patamarAtual(nex);
  return patamaresPresencaPermanente(classe, elemento).filter((p) => patamar >= p && !jaPerdida.has(p));
}

/**
 * Aplica a perda permanente de Presença ainda pendente (se houver alguma) —
 * usada dentro de `ativarHoje` (fluxo normal, ao clicar "ativar" no dia) e
 * também sozinha quando o Combatente atinge o patamar em que tudo fica
 * permanente (99%, ver `tudoPermanente`): nesse ponto o botão deixa de abrir
 * modal nenhum (nada para ligar/desligar), por isso já não há clique nenhum
 * para disparar esta perda — ver o useEffect em `MonstruosoBotao`
 * (components/ficha/Monstruoso.jsx). Devolve `null` se não houver nada
 * pendente.
 */
export function aplicarPresencaPendente(personagem, nex) {
  const pendentes = presencaPendente(personagem, nex);
  if (pendentes.length === 0) return null;
  const atributos = { ...(personagem.atributos || {}) };
  atributos.pre = Number(atributos.pre || 0) - pendentes.length;
  return {
    patch: {
      atributos,
      monstruosoPresencaPerdida: [...(personagem.monstruosoPresencaPerdida || []), ...pendentes],
    },
  };
}

/**
 * Faz a etapa ritualística de hoje: consome o componente (se a classe
 * pedir), rola a recuperação de PV/PE (se houver), aplica a perda
 * permanente de Presença (se for a primeira vez neste patamar) e liga os
 * efeitos do dia. O ajuste de PV/PE ATUAL (não só o máximo) fica a cargo de
 * quem chama isto — ver `ajustarRecursos` em `engine/character.js`.
 */
export function ativarHoje(personagem, nex, { onRolar } = {}) {
  const classe = classeMonstruosa(personagem);
  const elemento = elementoAtual(personagem);
  if (!classe) return { erro: 'A trilha atual não é o Monstruoso.' };
  if (!elemento) return { erro: 'Escolhe primeiro um elemento paranormal.' };

  const patamar = patamarAtual(nex);
  const patch = {};
  let inventario = personagem.inventario || [];

  if (CONSOME_COMPONENTE[classe]) {
    const idx = encontrarComponente(inventario, elemento);
    if (idx === -1) {
      return { erro: `Precisas de "Componentes Ritualísticos de ${elemento}" no inventário — os de outro elemento não servem.` };
    }
    inventario = [...inventario];
    const item = inventario[idx];
    const qtd = Number(item.quantidade || 1);
    if (qtd > 1) inventario[idx] = { ...item, quantidade: qtd - 1 };
    else inventario.splice(idx, 1);
    patch.inventario = inventario;
  }

  const recuperacao = RECUPERACAO_POR_PATAMAR[classe]?.[patamar];
  if (recuperacao) {
    const rolo = rolarDano({
      nome: `Etapa Ritualística — ${NOME_PODER_POR_PATAMAR[classe][patamar]} (${elemento})`,
      dano: `${recuperacao.dados}d${recuperacao.faces}`,
      bonus: recuperacao.bonus,
    });
    if (rolo && onRolar) onRolar(rolo);
    if (rolo && recuperacao.recurso === 'pv') {
      patch.pvAtual = Number(personagem.pvAtual || 0) + rolo.total;
    } else if (rolo && recuperacao.recurso === 'pe') {
      patch.peAtual = Number(personagem.peAtual || 0) + rolo.total;
    }
  }

  // Especialista-Morte (10%+): PV temporários IMEDIATOS ao ativar a etapa de
  // hoje ("no início da transformação") — 2d6, sobe para 4d6 aos 99%. É uma
  // mecânica DIFERENTE do "+2d8 por cena" da drenagem 40%+ (ver
  // efeitosDrenagem/pvTempCena) — as duas coexistem, não se substituem.
  if (classe === 'especialista' && elemento === 'Morte') {
    const tabelaPvTemp = pvTempImediatoMorteAtual(patamar);
    if (tabelaPvTemp) {
      const roloPvTemp = rolarDano({
        nome: `PV Temporário Imediato — ${NOME_PODER_POR_PATAMAR[classe][patamar]} (Morte)`,
        dano: `${tabelaPvTemp.dados}d${tabelaPvTemp.faces}`,
      });
      if (roloPvTemp && onRolar) onRolar(roloPvTemp);
      if (roloPvTemp) patch.pvTemp = Number(personagem.pvTemp || 0) + roloPvTemp.total;
    }
  }

  // Perda permanente de Presença (65%/99%, por classe/elemento) — só na
  // primeira vez, nunca reverte.
  const presenca = aplicarPresencaPendente(personagem, nex);
  if (presenca) Object.assign(patch, presenca.patch);

  patch.monstruosoAtivoHoje = true;
  return { patch };
}

/**
 * Desliga só os efeitos de hoje (e o número de drenagem, que também volta ao
 * normal) — não mexe na Presença perdida nem no elemento escolhido.
 */
export function desativarHoje() {
  return { patch: { monstruosoAtivoHoje: false, monstruosoDrenagem: 0 } };
}

/** Primeira escolha de elemento (10%, permanente). */
export function escolherElemento(elemento) {
  return { patch: { monstruosoElemento: elemento } };
}

// ------------------------------------------------------- resumo por patamar

const NOME_ATRIBUTO = { for: 'Força', agi: 'Agilidade', int: 'Intelecto', pre: 'Presença', vig: 'Vigor' };

function nomePericia(id) {
  return PERICIAS.find((p) => p.id === id)?.nome || id;
}

function textoEntradaMecanica(g) {
  switch (g.tipo) {
    case 'atributo': return `${g.delta > 0 ? '+' : ''}${g.delta} ${NOME_ATRIBUTO[g.atributo]}`;
    case 'dados-pericia': return `${g.dados > 0 ? '+' : ''}${g.dados} dado(s) em testes de ${nomePericia(g.pericia)}`;
    case 'atributo-pericia': return `${nomePericia(g.pericia)} passa a usar ${NOME_ATRIBUTO[g.atributo]}`;
    case 'flat-pericia': return `${g.flat > 0 ? '+' : ''}${g.flat} em ${nomePericia(g.pericia)}`;
    case 'ataque-bonus-dado': return `+1d${g.faces} em testes de ataque${g.corpoACorpoApenas ? ' corpo a corpo' : ''}`;
    case 'ataque-natural': return `Arma natural: ${g.nome} (${g.dano}, crítico ${g.critico})`;
    default: return null;
  }
}

/**
 * Junta as regras "gerais" da classe (RD, penalidade de perícia, troca de
 * atributo para PE, "soma o atributo em testes", deslocamento, tamanho) que
 * não vivem em EFEITOS_POR_PATAMAR (são fórmulas da classe/elemento, não
 * entradas avulsas) — devolve as linhas que pertencem exatamente a este
 * patamar (o valor "atual" desse patamar, tal como o livro o reafirma a
 * cada novo patamar).
 */
function linhasGeraisNoPatamar(classe, elemento, patamar) {
  const linhas = [];

  if (classe === 'combatente') {
    linhas.push(`Resistência a ${RESISTENCIA_TIPOS_COMBATENTE[elemento]} ${RESISTENCIA_POR_PATAMAR[patamar]}`);
  }

  const pen = PROGRESSAO_PENALIDADE[classe]?.[patamar];
  if (pen) {
    const lista = (PERICIAS_PENALIZADAS[classe]?.[elemento] || []).map(nomePericia).join(', ');
    const valor = pen.dados ? `${Math.abs(pen.dados)} dado${Math.abs(pen.dados) > 1 ? 's' : ''} a menos` : `${pen.flat}`;
    linhas.push(`Penalidade em ${lista}: ${valor}`);
  }

  const peDesde = PE_POR_ATRIBUTO_DESDE[classe]?.[elemento];
  if (peDesde === patamar) {
    linhas.push(`Pontos de Esforço calculados por ${NOME_ATRIBUTO[ATRIBUTO_DO_ELEMENTO[elemento]]} (em vez de Presença)`);
  }

  if (SOMA_ATRIBUTO_EM_PERICIAS[classe] && SOMA_ATRIBUTO_DESDE[elemento] === patamar) {
    linhas.push(`Soma ${NOME_ATRIBUTO[ATRIBUTO_DO_ELEMENTO[elemento]]} em testes baseados nesse atributo`);
  }

  if (classe === 'especialista' && elemento === 'Energia' && DESLOCAMENTO_ENERGIA_EXTRA.especialista[patamar]) {
    linhas.push(`Deslocamento +${DESLOCAMENTO_ENERGIA_EXTRA.especialista[patamar]}m${patamar > 10 ? ' (substitui o valor anterior)' : ''}`);
  }

  if (classe === 'especialista' && elemento === 'Sangue' && TAMANHO_ESPECIALISTA_SANGUE[patamar]) {
    const t = TAMANHO_ESPECIALISTA_SANGUE[patamar];
    linhas.push(`Considerado(a) ${t.nome} (+${t.manobras} em manobras, ${t.furtividade} em Furtividade)`);
  }

  return linhas;
}

/**
 * Resumo pronto para a interface: uma entrada por patamar já desbloqueado,
 * com o nome do poder e todas as linhas (mecânicas + notas informativas)
 * concedidas NESSE patamar especificamente. Só é chamado quando a etapa está
 * em efeito (ver `efetivamenteAtivo`) — a caixa de informação não deve
 * mostrar nada disto quando a personagem não fez a etapa hoje.
 */
export function resumoPorPatamar(personagem, nex) {
  const classe = classeMonstruosa(personagem);
  const elemento = elementoAtual(personagem);
  if (!classe || !elemento) return [];
  const patamarAtualN = patamarAtual(nex);
  const efeitos = EFEITOS_POR_PATAMAR[classe]?.[elemento] || [];
  const textos = TEXTOS_POR_PATAMAR[classe]?.[elemento] || [];

  return PATAMARES_MONSTRUOSO.filter((p) => p <= patamarAtualN).map((patamar) => {
    const linhas = [
      ...linhasGeraisNoPatamar(classe, elemento, patamar),
      ...efeitos.filter((g) => g.patamar === patamar).map(textoEntradaMecanica).filter(Boolean),
      ...textos.filter((t) => t.patamar === patamar).map((t) => t.texto),
    ];
    return { patamar, titulo: NOME_PODER_POR_PATAMAR[classe][patamar], linhas };
  });
}
