// TRILHA DO MONSTRUOSO — interface.
//
// Regra-mãe: tudo aqui é calculado AO VIVO a partir de (classe, elemento,
// patamar, etapa de hoje ativa) — não há botões de "aplicar"/"desfazer" nem
// histórico. Ao desativar a etapa, os bónus somem sozinhos (voltam a
// aparecer se ativar de novo). As únicas exceções são a perda permanente de
// Presença aos 65%/99% (nunca reverte) e, só no Combatente aos 99%, tudo
// ficar sempre ligado. A mecânica vive em `engine/monstruoso.js` +
// `data/monstruoso.js`; este ficheiro só desenha. O texto oficial de cada
// poder continua a vir de `data/classes/combatente.js` e
// `data/extra/as07.js` — não duplicamos esse texto aqui.
import React, { useState } from 'react';
import { PERICIAS } from '../../data/pericias.js';
import { RITUAIS } from '../../data/rituais.js';
import { nexEfetivo, calcMaximos, calcDtRitual } from '../../engine/calc.js';
import { ajustarRecursos } from '../../engine/character.js';
import { rolarExpressao } from '../../engine/dados.js';
import {
  classeMonstruosa, patamarAtual, elementoAtual, efeitosDiarios, nomePoderAtual, consequenciasAtivas,
  ativarHoje, desativarHoje, escolherElemento, limiteDrenagem, tudoPermanente,
  escolhasNecessarias, escolherRitual, escolherPericiasConhecimento, rituaisAtivos, resumoPorPatamar,
  atributosEfetivos, escolherPericiaParaDestreinar, gastarDadoBanco,
  podeServirSangue, servirSangueArmado, servirSangue,
  podeRevelacaoConhecimento, revelacaoConhecimentoArmada, obterRevelacaoConhecimento,
  podeDefesaEnergia, defesaEnergiaArmada, peGastoRitualEnergia, ativarDefesaEnergia, removerDefesaEnergia,
  podeSerMarcadoNaPele,
  estadoReacaoTatuagem, usarReacaoTatuagem, reporReacaoTatuagem,
} from '../../engine/monstruoso.js';
import {
  ELEMENTOS_MONSTRUOSO, NOME_PODER_POR_PATAMAR, COR_ELEMENTO, DRENAGEM_ATRIBUTO,
  SERVIR_SANGUE, REVELACAO_CONHECIMENTO, DEFESA_ENERGIA,
} from '../../data/monstruoso.js';
import { marcadoDoRitual, patchEstadoRitual, conjurarRitual, custoEfetivoRitual } from '../../engine/rituais.js';
import CabecalhoSeta from './CabecalhoSeta.jsx';

const NOME_ATRIBUTO = { for: 'Força', agi: 'Agilidade', int: 'Intelecto', pre: 'Presença', vig: 'Vigor' };

const IMG_ELEMENTO = {
  Sangue: '/img/sigilo-sangue.png', Morte: '/img/sigilo-morte.png',
  Conhecimento: '/img/sigilo-conhecimento.png', Energia: '/img/sigilo-energia.png',
};

/** Botão-sigilo do cabeçalho: escolhe elemento (1ª vez) ou liga/desliga a etapa de hoje. */
export function MonstruosoBotao({ personagem, setPersonagem, onRolar }) {
  const [modal, setModal] = useState(null); // 'escolher' | 'ativar' | 'desativar' | null
  const [erro, setErro] = useState('');
  const [drenagem, setDrenagem] = useState(0);

  const classe = classeMonstruosa(personagem);
  if (!classe) return null;

  const nex = nexEfetivo(personagem);
  const elemento = elementoAtual(personagem);
  const ativo = Boolean(personagem.monstruosoAtivoHoje);
  const permanente = tudoPermanente(personagem, nex);
  const patamar = patamarAtual(nex);
  const cor = elemento ? COR_ELEMENTO[elemento] : 'var(--txt-fraco)';
  const img = elemento ? IMG_ELEMENTO[elemento] : '/img/roda-sigilos.png';
  const podeDrenar = classe === 'especialista' && patamar >= 40;
  const limDren = podeDrenar ? limiteDrenagem(personagem, nex) : 0;

  function abrir() {
    setErro('');
    setDrenagem(0);
    if (!elemento) setModal('escolher');
    // Nada para ligar/desligar — a etapa já está sempre ativa (ver
    // TUDO_PERMANENTE_DESDE em data/monstruoso.js). Antes o clique não fazia
    // literalmente nada (setModal(null)), o que parecia um botão avariado —
    // agora mostra uma explicação em vez de ficar em silêncio.
    else if (permanente) setModal('permanente');
    else setModal(ativo ? 'desativar' : 'ativar');
  }

  function confirmarElemento(el) {
    setPersonagem((p) => ({ ...p, ...escolherElemento(el).patch }));
    setModal(null);
  }

  function confirmarAtivar() {
    const r = ativarHoje(personagem, nex, { onRolar });
    if (r.erro) { setErro(r.erro); return; }
    const patch = podeDrenar ? { ...r.patch, monstruosoDrenagem: drenagem } : r.patch;
    // Ao ligar a etapa, os máximos de PV/PE sobem (bónus de atributo, PV do
    // Combatente/Morte, etc.) — o ATUAL sobe pela mesma diferença, não só o
    // máximo, tal como já acontece quando o NEX sobe (ajustarRecursos).
    setPersonagem((prev) => ajustarRecursos(prev, { ...prev, ...patch }));
    setModal(null);
  }

  function confirmarDesativar() {
    const r = desativarHoje();
    setPersonagem((prev) => ajustarRecursos(prev, { ...prev, ...r.patch }));
    setModal(null);
  }

  return (
    <>
      <button
        type="button"
        title={
          !elemento ? 'Escolher elemento do Monstruoso'
          : permanente ? `Sempre ativo (${elemento}) — a transformação já é permanente`
          : ativo ? `Desativar etapa de hoje (${elemento})` : `Fazer a etapa ritualística de hoje (${elemento})`
        }
        onClick={abrir}
        style={{
          flexShrink: 0, width: 38, height: 38, background: 'transparent', border: 'none', padding: 0,
          cursor: permanente ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'translateY(-2px)', outline: 'none',
        }}
      >
        <img
          src={img} alt="Monstruoso"
          style={{
            width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'screen',
            opacity: ativo || permanente ? 1 : 0.6,
            filter: ativo || permanente ? `drop-shadow(0 0 6px ${cor})` : 'drop-shadow(0 0 3px rgba(255,255,255,0.4))',
          }}
        />
      </button>

      {modal === 'escolher' && (
        <div className="modal-fundo" style={{ zIndex: 100 }}>
          <div className="modal" style={{ maxWidth: 440, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>Escolhe o Elemento Paranormal</h3>
              <button className="fechar" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: 14.5, marginBottom: 24 }}>
                Escolha permanente da trilha (10%). Depois disto, ativa/desativa-se a etapa de hoje pelo mesmo botão.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {ELEMENTOS_MONSTRUOSO.map((el) => (
                  <button
                    key={el} className="btn ghost"
                    style={{ borderColor: COR_ELEMENTO[el], color: COR_ELEMENTO[el], padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    onClick={() => confirmarElemento(el)}
                  >
                    <img src={IMG_ELEMENTO[el]} alt={el} style={{ width: 46, height: 46, objectFit: 'contain', mixBlendMode: 'screen', marginBottom: 8 }} />
                    <strong style={{ fontSize: 15 }}>{el.toUpperCase()}</strong>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {modal === 'ativar' && (
        <div className="modal-fundo" style={{ zIndex: 100 }}>
          <div className="modal" style={{ maxWidth: 440, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>Etapa Ritualística — {elemento}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button type="button" onClick={() => setModal('confirmarMudarElemento')} title="Trocar de elemento (não é suposto — só para engano ou exceção do mestre)" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: 'var(--txt-fraco)' }}></button>
                <button className="fechar" onClick={() => setModal(null)}>×</button>
              </div>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: 14.5, marginBottom: 16 }}>
                Confirma que fizeste hoje a etapa ritualística de <strong>{elemento}</strong>
                {classe !== 'combatente' && <> (consome 1 Componente Ritualístico do inventário)</>}.
                Os efeitos duram até ao fim do dia.
              </p>
              {podeDrenar && (
                <div style={{ margin: '0 0 18px', padding: 12, border: '1px solid var(--linha)', borderRadius: 4, textAlign: 'left' }}>
                  <div style={{ fontSize: 13.5 }}>
                    Queres sacrificar pontos de {NOME_ATRIBUTO[DRENAGEM_ATRIBUTO[elemento]]} para intensificar o efeito? (máx. {limDren})
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, justifyContent: 'center' }}>
                    <button type="button" className="btn ghost sm" disabled={drenagem <= 0} onClick={() => setDrenagem((d) => Math.max(0, d - 1))}>−</button>
                    <strong style={{ fontSize: 18, minWidth: 24, textAlign: 'center' }}>{drenagem}</strong>
                    <button type="button" className="btn ghost sm" disabled={drenagem >= limDren} onClick={() => setDrenagem((d) => Math.min(limDren, d + 1))}>+</button>
                  </div>
                  <div style={{ fontSize: 11, marginTop: 6, opacity: 0.8 }}>
                    Volta a {NOME_ATRIBUTO[DRENAGEM_ATRIBUTO[elemento]]} normal e a 0 automaticamente ao desativar.
                  </div>
                </div>
              )}
              {erro && <p style={{ color: 'var(--sangue-claro)', fontSize: 13.5, marginBottom: 16 }}>{erro}</p>}
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                <button className="btn ghost" onClick={() => setModal(null)}>Cancelar</button>
                <button className="btn" style={{ borderColor: COR_ELEMENTO[elemento], background: COR_ELEMENTO[elemento] }} onClick={confirmarAtivar}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal === 'desativar' && (
        <div className="modal-fundo" style={{ zIndex: 100 }}>
          <div className="modal" style={{ maxWidth: 400, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>Desativar Etapa de Hoje</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button type="button" onClick={() => setModal('confirmarMudarElemento')} title="Trocar de elemento (não é suposto — só para engano ou exceção do mestre)" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: 'var(--txt-fraco)' }}></button>
                <button className="fechar" onClick={() => setModal(null)}>×</button>
              </div>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: 14.5, marginBottom: 24 }}>
                Desliga todos os bónus/penalidades de hoje — voltam a aparecer se ativares de novo. A afinidade com{' '}
                <strong>{elemento}</strong> mantém-se, e qualquer perda permanente de Presença já aplicada não volta.
                Sem a etapa feita, sofres os efeitos de fome e sede do livro.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                <button className="btn ghost" onClick={() => setModal(null)}>Cancelar</button>
                <button className="btn" style={{ borderColor: 'var(--sangue)', background: 'var(--sangue)' }} onClick={confirmarDesativar}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal === 'permanente' && (
        <div className="modal-fundo" style={{ zIndex: 100 }} onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal" style={{ maxWidth: 420, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>Sempre Ativo ({elemento})</h3>
              <button className="fechar" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: 14.5, marginBottom: 8 }}>
                Ultrapassaste o patamar em que a Trilha do Monstruoso fica sempre ligada (Ser Aterrorizante, 99%)
                — todos os bónus e penalidades da etapa de hoje ficam permanentemente em efeito, mesmo sem os
                ativar manualmente. Não há nada para ligar ou desligar aqui.
              </p>
              <p style={{ color: 'var(--txt-fraco)', fontSize: 12.5, marginBottom: 22 }}>
                (Continuas a precisar de fazer a etapa ritualística para não sofreres os efeitos de fome e sede
                do livro — só não muda mais nada na ficha.)
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                <button type="button" onClick={() => setModal('confirmarMudarElemento')} title="Trocar de elemento (não é suposto — só para engano ou exceção do mestre)" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--txt-fraco)', textDecoration: 'underline' }}>Trocar de elemento</button>
                <button className="btn" onClick={() => setModal(null)}>Entendido</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal === 'confirmarMudarElemento' && (
        <div className="modal-fundo" style={{ zIndex: 100 }}>
          <div className="modal" style={{ maxWidth: 420, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>Trocar de elemento?</h3>
              <button className="fechar" onClick={() => setModal(permanente ? 'permanente' : ativo ? 'desativar' : 'ativar')}>×</button>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: 14.5, marginBottom: 22 }}>
                A escolha do elemento da Trilha do Monstruoso é <strong>permanente</strong> — não é suposto voltar
                atrás depois de a fazeres. Isto aqui é só para quando isso aconteceu por engano, ou o mestre
                permitir uma exceção.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                <button className="btn ghost" onClick={() => setModal(permanente ? 'permanente' : ativo ? 'desativar' : 'ativar')}>Cancelar</button>
                <button className="btn" style={{ borderColor: 'var(--sangue)', background: 'var(--sangue)' }} onClick={() => setModal('escolher')}>Sim, escolher outro elemento</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Uma escolha permanente que a trilha pede (ritual à escolha, ou as
 * perícias livres do Especialista-Conhecimento).
 *
 * As perícias livres NÃO podem ser trocadas depois de guardadas — o livro
 * não dá essa opção, é uma escolha feita uma vez aos 10%. Aos 99% (`Ser
 * Apavorante` substitui `Ser Experimentado`), abre-se uma 3ª vaga nova, que
 * depois de escolhida também fica fixa; as 2 primeiras nunca se mexem.
 */
function LinhaEscolha({ ganho, personagem, setPersonagem, patamarAtualNum }) {
  const escolhas = personagem.monstruosoEscolhas || { periciasConhecimento: [], rituais: {} };

  if (ganho.tipo === 'pericias-livres') {
    const guardadas = escolhas.periciasConhecimento || [];
    const [a, b, c] = guardadas;
    const feitaInicial = Boolean(a && b);
    const alvo = patamarAtualNum >= 99 ? 3 : 2;
    const nomeDe = (id) => PERICIAS.find((p) => p.id === id)?.nome || id;

    const [periciaA, setPericiaA] = useState(a || '');
    const [periciaB, setPericiaB] = useState(b || '');
    const [periciaC, setPericiaC] = useState(c || '');

    function guardarIniciais() {
      setPersonagem((p) => ({ ...p, ...escolherPericiasConhecimento(p, [periciaA, periciaB]).patch }));
    }
    function guardarTerceira() {
      setPersonagem((p) => ({ ...p, ...escolherPericiasConhecimento(p, [a, b, periciaC]).patch }));
    }

    return (
      <div style={{ padding: '8px 0', borderBottom: '1px solid var(--linha)' }}>
        <div style={{ fontSize: 13, marginBottom: 6 }}>
          {ganho.patamar}% · Escolhe {alvo} perícias treinadas{alvo > 2 ? ' (3ª desde os 99% — todas ficam em grau Expert)' : ''}
        </div>

        {!feitaInicial && (
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={periciaA} onChange={(e) => setPericiaA(e.target.value)} style={{ flex: 1, fontSize: 12 }}>
              <option value="">-- 1ª perícia --</option>
              {PERICIAS.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
            <select value={periciaB} onChange={(e) => setPericiaB(e.target.value)} style={{ flex: 1, fontSize: 12 }}>
              <option value="">-- 2ª perícia --</option>
              {PERICIAS.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
            <button className="btn sm" disabled={!periciaA || !periciaB || periciaA === periciaB} onClick={guardarIniciais}>Guardar</button>
          </div>
        )}

        {feitaInicial && (
          <div style={{ fontSize: 12.5, color: 'var(--txt-dim)' }}>
            Escolhidas (fixas — não podem ser trocadas): <strong style={{ color: 'var(--txt)' }}>{nomeDe(a)}</strong> e <strong style={{ color: 'var(--txt)' }}>{nomeDe(b)}</strong>
          </div>
        )}

        {feitaInicial && alvo > 2 && !c && (
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <select value={periciaC} onChange={(e) => setPericiaC(e.target.value)} style={{ flex: 1, fontSize: 12 }}>
              <option value="">-- 3ª perícia (99%) --</option>
              {PERICIAS.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
            <button className="btn sm" disabled={!periciaC} onClick={guardarTerceira}>Guardar</button>
          </div>
        )}

        {feitaInicial && alvo > 2 && c && (
          <div style={{ fontSize: 12.5, color: 'var(--txt-dim)', marginTop: 4 }}>
            3ª (fixa, desde os 99%): <strong style={{ color: 'var(--txt)' }}>{nomeDe(c)}</strong>
          </div>
        )}
      </div>
    );
  }

  // ritual-escolha
  const atual = escolhas.rituais?.[ganho.id] || '';
  const [ritualId, setRitualId] = useState(atual);
  const opcoes = RITUAIS.filter((r) => r.circulo === ganho.circulo && String(r.elemento).includes(ganho.elemento));
  function guardar() {
    setPersonagem((p) => ({ ...p, ...escolherRitual(p, ganho.id, ritualId).patch }));
  }
  return (
    <div style={{ padding: '8px 0', borderBottom: '1px solid var(--linha)' }}>
      <div style={{ fontSize: 13, marginBottom: 6 }}>{ganho.patamar}% · Ritual de {ganho.elemento} de {ganho.circulo}º círculo {atual ? '(já escolhido — podes trocar)' : ''}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <select value={ritualId} onChange={(e) => setRitualId(e.target.value)} style={{ flex: 1, fontSize: 12 }}>
          <option value="">-- escolhe o ritual --</option>
          {opcoes.map((r) => <option key={r.id} value={r.id}>{r.nome}</option>)}
        </select>
        <button className="btn sm" disabled={!ritualId || ritualId === atual} onClick={guardar}>Guardar</button>
      </div>
    </div>
  );
}

/** Cartão principal — vai na aba Combate. Mostra só o que está ATIVO agora — nunca patamares futuros. */
export function MonstruosoPainel({ personagem, setPersonagem, onRolar }) {
  // Quais patamares o jogador já mexeu na seta (abriu/fechou à mão) — quem
  // nunca mexeu segue a regra de omissão (só o patamar atual vem aberto).
  // Guardamos isto como "está aberto?" só para os que já foram tocados.
  const [alterados, setAlterados] = useState(() => new Map());
  // Regra dos Hooks: TODOS os useState têm de vir antes de qualquer "return
  // null" condicional — senão, no exato momento em que `elemento` passa de
  // vazio a escolhido (primeira escolha do elemento), este componente passa
  // a chamar mais hooks do que na renderização anterior e o React crasha
  // ("Rendered more hooks than during the previous render"). Foi isto que
  // estava a rebentar o botão do Monstruoso ao escolher o elemento a
  // primeira vez, e a impedir qualquer interação depois (incluindo
  // desativar) — os dois hooks abaixo estavam depois dos "return null".
  const [peModalAberto, setPeModalAberto] = useState(false);
  const [peRascunho, setPeRascunho] = useState(1);
  const [periciaBancoEscolha, setPericiaBancoEscolha] = useState('');
  const [erroBanco, setErroBanco] = useState('');
  const [modalReacaoAberto, setModalReacaoAberto] = useState(false);
  const [ritualReacaoEscolhidoId, setRitualReacaoEscolhidoId] = useState('');
  const [erroReacao, setErroReacao] = useState('');

  const classe = classeMonstruosa(personagem);
  if (!classe) return null;
  const elemento = elementoAtual(personagem);
  if (!elemento) return null;

  const nex = nexEfetivo(personagem);
  const patamar = patamarAtual(nex);
  const cor = COR_ELEMENTO[elemento];
  const titulo = nomePoderAtual(personagem, nex) || NOME_PODER_POR_PATAMAR[classe][10];
  const permanente = tudoPermanente(personagem, nex);
  const ativo = Boolean(personagem.monstruosoAtivoHoje) || permanente;
  const ef = efeitosDiarios(personagem, nex);
  const consequencias = consequenciasAtivas(nex);
  const semSanidade = Boolean(personagem.regras?.semSanidade);
  const rituaisConcedidos = ativo ? rituaisAtivos(personagem, nex) : [];
  const escolhas = escolhasNecessarias(personagem, nex);
  // Resumo por patamar: por omissão só o patamar ATUAL vem expandido — os
  // anteriores ficam reduzidos a uma linha — mas TODOS têm a mesma setinha,
  // incluindo o atual, e cada um abre/fecha por si sem perder informação
  // nenhuma. Patamares ainda por desbloquear nem chegam a aparecer aqui.
  const blocos = ativo ? resumoPorPatamar(personagem, nex) : [];
  const patamarMaisAlto = blocos.length ? blocos[blocos.length - 1].patamar : null;

  // Setinha genérica (abre/fecha) — usada tanto nos blocos por patamar como
  // na caixa de consequências permanentes. `chave` identifica cada bloco;
  // `padrao` é o estado inicial antes de o jogador alguma vez clicar.
  function aberto(chave, padrao) {
    return alterados.has(chave) ? alterados.get(chave) : padrao;
  }

  function alternar(chave, padrao) {
    setAlterados((prev) => {
      const novo = new Map(prev);
      novo.set(chave, !aberto(chave, padrao));
      return novo;
    });
  }

  function patamarAberto(p) {
    return aberto(p, p === patamarMaisAlto);
  }

  function alternarPatamar(p) {
    alternar(p, p === patamarMaisAlto);
  }

  function aplicarSanidadeMinima(valor) {
    setPersonagem((p) => ({ ...p, sanAtual: valor }));
  }

  function concederPvTempCena() {
    if (!ef.pvTempCena) return;
    const r = rolarExpressao(`${ef.pvTempCena.dados}d${ef.pvTempCena.faces}`);
    if (r) onRolar(r);
    setPersonagem((p) => ({ ...p, pvTemp: Number(p.pvTemp || 0) + (r ? r.total : 0) }));
  }

  // Combatente-Sangue 40% (Ser Macabro): Ação de movimento + 1 ou mais PE
  // (limitado pela Força) — recupera 1d8 PV por PE gasto. Popup no estilo
  // dos outros modais da ficha (não o prompt feio do browser). Estado
  // declarado lá em cima (antes dos "return null") — ver nota da Regra dos Hooks.

  function limitePeRecuperarVida() {
    const max = calcMaximos(personagem);
    const peAtual = Number(personagem.peAtual ?? max.pe);
    const forca = atributosEfetivos(personagem, nex).for;
    return Math.max(0, Math.min(peAtual, forca));
  }

  function abrirModalPe() {
    const limite = limitePeRecuperarVida();
    if (limite <= 0) return;
    setPeRascunho(1);
    setPeModalAberto(true);
  }

  function confirmarGastarPe() {
    const limite = limitePeRecuperarVida();
    const n = Math.max(0, Math.min(limite, Math.trunc(Number(peRascunho) || 0)));
    setPeModalAberto(false);
    if (n <= 0) return;
    const max = calcMaximos(personagem);
    const r = rolarExpressao(`${n}d8`);
    if (r) onRolar(r);
    const cura = r ? r.total : 0;
    setPersonagem((p) => ({
      ...p,
      peAtual: Number(p.peAtual ?? max.pe) - n,
      pvAtual: Math.min(max.pv, Number(p.pvAtual ?? max.pv) + cura),
    }));
  }

  // Combatente-Conhecimento 65% (Ser Assustador): deixar de ser treinado
  // numa perícia para abrir um banco de dados de bónus (= Intelecto);
  // gastar 1 dado dá +1 ao pool do PRÓXIMO teste de perícia rolado (ver
  // TabelaPericias.jsx). Recupera a perícia e esvazia o banco sozinho no
  // próximo interlúdio (engine/interludio.js).
  function confirmarDestreinar() {
    setErroBanco('');
    if (!periciaBancoEscolha) return;
    const r = escolherPericiaParaDestreinar(personagem, periciaBancoEscolha, nex);
    if (r.erro) { setErroBanco(r.erro); return; }
    setPersonagem((p) => ({ ...p, ...r.patch }));
    setPericiaBancoEscolha('');
  }

  function confirmarGastarDadoBanco() {
    const r = gastarDadoBanco(personagem);
    if (r.erro) { setErroBanco(r.erro); return; }
    setPersonagem((p) => ({ ...p, ...r.patch }));
  }

  // Combatente-Sangue 65% (Ser Assustador): 50% de chance de ignorar o dano
  // adicional de um crítico ou ataque furtivo — 1d2, 1 falha e 2 sucesso.
  function rolarChanceIgnorarDano() {
    const r = rolarExpressao('1d2');
    if (!r) return;
    const sucesso = r.total >= 2;
    onRolar({
      ...r,
      nome: 'Ser Assustador — ignorar dano adicional',
      notas: [sucesso ? 'Sucesso (2) — ignora o dano adicional do crítico/ataque furtivo' : 'Falha (1) — sofre o dano adicional normalmente'],
      sofreu: !sucesso,
    });
  }

  // Combatente-Energia 65% (Ser Assustador): ação de movimento + tocar uma
  // fonte de eletricidade — recupera PE conforme o tamanho da fonte e
  // descarrega-a por completo (livro: 1d4 portátil / 2d4 grande / 4d4 do
  // tamanho de uma casa). Sem estado a guardar — é uma ação pontual.
  const FONTES_ENERGIA = [
    { id: 'portatil', nome: 'Dispositivo portátil (telemóvel, tablet)', dados: '1d4' },
    { id: 'grande', nome: 'Dispositivo grande (mota, carro elétrico)', dados: '2d4' },
    { id: 'casa', nome: 'Fonte do tamanho de uma casa', dados: '4d4' },
  ];

  function extrairEnergiaFonte(fonte) {
    const r = rolarExpressao(fonte.dados);
    if (!r) return;
    onRolar({
      ...r,
      nome: `Ser Assustador — extrair energia (${fonte.nome})`,
      notas: [`Recupera ${r.total} PE — a fonte fica completamente descarregada.`],
    });
    const max = calcMaximos(personagem);
    setPersonagem((p) => ({ ...p, peAtual: Math.min(max.pe, Number(p.peAtual ?? max.pe) + r.total) }));
  }

  // Ocultista-Sangue 65% (Ser Rasgado): servir sangue a um aliado adjacente.
  // Só fica clicável depois de conjurar um ritual de Sangue — é esse o
  // gatilho do livro ("Quando conjura um ritual de Sangue..."). Custa
  // 2d8+2 PV, sem limite de usos por cena.
  function confirmarServirSangue() {
    const max = calcMaximos(personagem);
    const r = servirSangue(personagem, nex, { onRolar, pvMax: max.pv });
    if (r.erro || !r.patch) return;
    setPersonagem((p) => ({ ...p, ...r.patch }));
  }

  // Ocultista-Conhecimento 65% (Ser Rasgado): revelações sobre o alvo / visão do oculto.
  // Destranca-se após conjurar um ritual de Conhecimento. Custa 2 PE (sem rolagem).
  function confirmarRevelacaoConhecimento() {
    const max = calcMaximos(personagem);
    const r = obterRevelacaoConhecimento(personagem, nex, { peMax: max.pe });
    if (r.erro || !r.patch) return;
    setPersonagem((p) => ({ ...p, ...r.patch }));
  }

  // Ocultista-Energia 65% (Ser Rasgado): teletransportar 3m e ganhar Defesa igual aos PE gastos.
  // Destranca-se após conjurar um ritual de Energia. Custa 3 PE (sem rolagem).
  function confirmarDefesaEnergia() {
    const max = calcMaximos(personagem);
    const r = ativarDefesaEnergia(personagem, nex, { peMax: max.pe });
    if (r.erro || !r.patch) return;
    setPersonagem((p) => ({ ...p, ...r.patch }));
  }

  // Ocultista 40% (Ser Perfurado): a reação 1x/cena da Tatuagem Ritualística.
  // Destranca-se com as condições próprias do elemento estarem LIGADAS na
  // ficha (Painel de Condições) — nada a ver com o +5 de concentração, que
  // vale sempre. Repõe-se à mão: não há fronteira automática de cena.
  const reacao = estadoReacaoTatuagem(personagem, nex);

  function abrirModalReacao() {
    setErroReacao('');
    const todos = [...(personagem.rituais || []), ...rituaisConcedidos];
    const marcados = todos.filter((r) => marcadoDoRitual(personagem, r));
    if (marcados.length > 0) {
      const primeiro = marcados[0];
      setRitualReacaoEscolhidoId(primeiro._monstruosoId || primeiro.id || primeiro.nome);
    } else if (todos.length > 0) {
      const primeiro = todos[0];
      setRitualReacaoEscolhidoId(primeiro._monstruosoId || primeiro.id || primeiro.nome);
    } else {
      setRitualReacaoEscolhidoId('');
    }
    setModalReacaoAberto(true);
  }

  function confirmarConjurarReacao() {
    setErroReacao('');
    const todos = [...(personagem.rituais || []), ...rituaisConcedidos];
    const r = todos.find((x) => (x._monstruosoId && x._monstruosoId === ritualReacaoEscolhidoId) || (x.id && x.id === ritualReacaoEscolhidoId) || (x.nome && x.nome === ritualReacaoEscolhidoId)) || todos.find((x) => marcadoDoRitual(personagem, x)) || todos[0];
    if (!r) {
      setErroReacao('Escolhe um ritual para conjurar como reação.');
      return;
    }
    const idxProprio = (personagem.rituais || []).findIndex((x) => x === r || (x.id && x.id === r.id && x.nome === r.nome));
    
    // Se o ritual ainda não estava marcado na pele, marca-o agora
    let patchExtra = {};
    if (!marcadoDoRitual(personagem, r)) {
      patchExtra = patchEstadoRitual(personagem, r, idxProprio >= 0 ? idxProprio : null, 'marcado', true);
    }
    const personagemComRitualMarcado = { ...personagem, ...patchExtra };
    const res = conjurarRitual(personagemComRitualMarcado, r, { onRolar, index: idxProprio >= 0 ? idxProprio : null, ehReacao: true });
    if (res.erro) {
      setErroReacao(res.erro);
      return;
    }
    if (res.patch) {
      setPersonagem((prev) => ({ ...prev, ...patchExtra, ...res.patch }));
    }
    setModalReacaoAberto(false);
  }

  const cartaoAberto = aberto('cartao', true);

  return (
    <div style={{ border: `1px solid ${cor}`, borderRadius: 6, padding: 14, marginBottom: 16, background: 'rgba(0,0,0,0.4)' }}>
      <h3
        onClick={() => alternar('cartao', true)}
        style={{ color: cor, margin: 0, textTransform: 'uppercase', fontSize: 16, letterSpacing: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <span style={{ fontSize: 12, transform: cartaoAberto ? 'rotate(90deg)' : 'none', transition: 'transform .1s' }}>▶</span>
        {titulo} ({elemento})
      </h3>

      {cartaoAberto && <>

      {consequencias.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <CabecalhoSeta estaAberto={aberto('consequencias', true)} corSeta="var(--sangue-claro)" onClick={() => alternar('consequencias', true)}>
            Consequências permanentes da trilha
          </CabecalhoSeta>
          {aberto('consequencias', true) && (
            <div style={{ marginTop: 6, padding: 10, borderRadius: 4, border: '1px solid var(--sangue)', background: 'rgba(192,21,33,.08)' }}>
              {consequencias.map((c, i) => {
                const usaVariante = semSanidade && c.notaSemSanidade;
                return (
                  <p key={i} style={{ margin: i ? '6px 0 0' : 0, fontSize: 12.5, color: 'var(--txt-dim)' }}>
                    {usaVariante ? c.notaSemSanidade : c.nota}
                    {c.valor != null && !semSanidade && (
                      <button
                        className="btn ghost sm"
                        style={{ marginLeft: 8, padding: '1px 8px', fontSize: 11, color: 'var(--txt)' }}
                        title="Aplica a redução de facto, agora — a caixa de Sanidade passa a este valor"
                        onClick={() => aplicarSanidadeMinima(c.valor)}
                      >
                        aplicar (Sanidade → {c.valor})
                      </button>
                    )}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      )}

      {ativo && blocos.map((b) => {
        const atual = b.patamar === patamarMaisAlto;
        const aberto = patamarAberto(b.patamar);
        return (
          <div key={b.patamar} style={{ marginTop: aberto ? 12 : 6 }}>
            <CabecalhoSeta estaAberto={aberto} corSeta={cor} onClick={() => alternarPatamar(b.patamar)}>
              {b.patamar}% — {b.titulo}{atual ? ' (atual)' : ''}
            </CabecalhoSeta>
            {aberto && b.linhas.length > 0 && (
              <ul style={{ margin: '4px 0 0', paddingLeft: 18, color: 'var(--txt-dim)', fontSize: 13.5, lineHeight: 1.55 }}>
                {b.linhas.map((linha, i) => <li key={i}>{linha}</li>)}
              </ul>
            )}
            {aberto && classe === 'combatente' && elemento === 'Sangue' && b.patamar === 40 && (
              <button
                className="btn ghost sm"
                style={{ marginTop: 8 }}
                title="Ser Macabro (40%) — Ação de movimento + 1 ou mais PE (limitado pela Força): recupera 1d8 PV por PE gasto"
                onClick={abrirModalPe}
              >
                Gastar PE para recuperar vida
              </button>
            )}
            {aberto && classe === 'combatente' && elemento === 'Sangue' && b.patamar === 65 && (
              <button
                className="btn ghost sm"
                style={{ marginTop: 8 }}
                title="Ser Assustador (65%) — 50% de chance de ignorar o dano adicional de um crítico ou ataque furtivo"
                onClick={rolarChanceIgnorarDano}
              >
                Rolar 1d2 (ignorar dano adicional)
              </button>
            )}
            {aberto && classe === 'combatente' && elemento === 'Energia' && b.patamar === 65 && (
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {FONTES_ENERGIA.map((fonte) => (
                  <button
                    key={fonte.id}
                    className="btn ghost sm"
                    title={`Ação de movimento + tocar a fonte — recupera ${fonte.dados} PE e descarrega-a por completo`}
                    onClick={() => extrairEnergiaFonte(fonte)}
                  >
                    Extrair de {fonte.nome} ({fonte.dados} PE)
                  </button>
                ))}
              </div>
            )}
            {aberto && reacao && b.patamar === 40 && (
              <div style={{ marginTop: 8, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn ghost sm"
                  disabled={!reacao.disponivel}
                  title={reacao.usada
                    ? 'Já usaste a reação desta cena — repõe-na quando a cena mudar'
                    : reacao.condicao
                      ? `Destrancada por: ${reacao.condicao}. Gasta a reação da cena para conjurar um ritual marcado na pele.`
                      : `Só ${reacao.gatilho} — liga a condição no Painel de Condições`}
                  onClick={abrirModalReacao}
                >
                  Conjurar ritual marcado como reação
                </button>
                {reacao.usada ? (
                  <>
                    <span style={{ fontSize: 12.5, color: 'var(--txt-fraco)' }}>reação desta cena já usada</span>
                    <button
                      className="btn ghost sm"
                      style={{ padding: '1px 8px', fontSize: 11 }}
                      title="Cena nova — devolve a reação"
                      onClick={() => setPersonagem((p) => ({ ...p, ...reporReacaoTatuagem().patch }))}
                    >
                      repor (cena nova)
                    </button>
                  </>
                ) : reacao.condicao ? (
                  <span style={{ fontSize: 12.5, color: cor }}>disponível — {reacao.condicao}</span>
                ) : (
                  <span style={{ fontSize: 12.5, color: 'var(--txt-fraco)' }}>trancada — só {reacao.gatilho}</span>
                )}
              </div>
            )}
            {aberto && podeServirSangue(personagem, nex) && b.patamar === 65 && (
              <div style={{ marginTop: 8, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn ghost sm"
                  disabled={!servirSangueArmado(personagem, nex)}
                  title={servirSangueArmado(personagem, nex)
                    ? `Ação de movimento — gasta ${SERVIR_SANGUE.custoPv} PV. O aliado adjacente que aceitar e ingerir como reação recebe ${SERVIR_SANGUE.bonus} em ${SERVIR_SANGUE.bonusEm}.`
                    : 'Só depois de conjurar um ritual de Sangue — é preciso haver "esse sangue" para servir.'}
                  onClick={confirmarServirSangue}
                >
                  Servir sangue a um aliado ({SERVIR_SANGUE.custoPv} PV)
                </button>
                {!servirSangueArmado(personagem, nex) && (
                  <span style={{ fontSize: 12.5, color: 'var(--txt-fraco)' }}>conjura um ritual de Sangue para destrancar</span>
                )}
              </div>
            )}
            {aberto && podeRevelacaoConhecimento(personagem, nex) && b.patamar === 65 && (
              <div style={{ marginTop: 8, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn ghost sm"
                  disabled={!revelacaoConhecimentoArmada(personagem, nex)}
                  title={revelacaoConhecimentoArmada(personagem, nex)
                    ? `Ação de movimento — gasta ${REVELACAO_CONHECIMENTO.custoPe} PE. Obtém revelações sobre o alvo (5 perguntas sim/não ao mestre) ou visão do oculto/invisível se o alvo fores tu.`
                    : 'Só depois de conjurar um ritual de Conhecimento — conjura um ritual de Conhecimento para destrancar.'}
                  onClick={confirmarRevelacaoConhecimento}
                >
                  Obter revelações do Conhecimento ({REVELACAO_CONHECIMENTO.custoPe} PE)
                </button>
                {!revelacaoConhecimentoArmada(personagem, nex) && (
                  <span style={{ fontSize: 12.5, color: 'var(--txt-fraco)' }}>conjura um ritual de Conhecimento para destrancar</span>
                )}
              </div>
            )}
            {aberto && podeDefesaEnergia(personagem, nex) && b.patamar === 65 && (
              <div style={{ marginTop: 8, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn ghost sm"
                  disabled={!defesaEnergiaArmada(personagem, nex)}
                  title={defesaEnergiaArmada(personagem, nex)
                    ? `Ação de movimento — gasta ${DEFESA_ENERGIA.custoPe} PE. Teletransporta-te 3m e recebes +${peGastoRitualEnergia(personagem)} na Defesa até ao fim da rodada (igual aos PE gastos no ritual de Energia).`
                    : 'Só depois de conjurar um ritual de Energia — conjura um ritual de Energia para destrancar.'}
                  onClick={confirmarDefesaEnergia}
                >
                  Teletransportar 3m e ganhar +{peGastoRitualEnergia(personagem)} Defesa ({DEFESA_ENERGIA.custoPe} PE)
                </button>
                {Number(personagem.monstruosoDefesaEnergiaBonus || 0) > 0 ? (
                  <>
                    <span style={{ fontSize: 12.5, color: cor }}>
                      +{personagem.monstruosoDefesaEnergiaBonus} Defesa ativa (1 rodada)
                    </span>
                    <button
                      className="btn ghost sm"
                      style={{ padding: '1px 8px', fontSize: 11 }}
                      title="Fim da rodada — remove o bónus de Defesa"
                      onClick={() => setPersonagem((p) => ({ ...p, ...removerDefesaEnergia().patch }))}
                    >
                      terminar rodada
                    </button>
                  </>
                ) : !defesaEnergiaArmada(personagem, nex) ? (
                  <span style={{ fontSize: 12.5, color: 'var(--txt-fraco)' }}>conjura um ritual de Energia para destrancar</span>
                ) : null}
              </div>
            )}
            {aberto && classe === 'combatente' && elemento === 'Conhecimento' && b.patamar === 65 && (
              <div style={{ marginTop: 8 }}>
                {!personagem.monstruosoPericiaDestreinada ? (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <select
                      value={periciaBancoEscolha}
                      onChange={(e) => setPericiaBancoEscolha(e.target.value)}
                      style={{ fontSize: 12 }}
                    >
                      <option value="">-- escolhe uma perícia treinada --</option>
                      {PERICIAS.filter((per) => {
                        const g = personagem.pericias?.[per.id]?.grau;
                        return g && g !== 'destreinado';
                      }).map((per) => (
                        <option key={per.id} value={per.id}>{per.nome}</option>
                      ))}
                    </select>
                    <button
                      className="btn ghost sm"
                      disabled={!periciaBancoEscolha}
                      title="Deixa de ser treinado nessa perícia e abre um banco de dados de bónus igual ao Intelecto"
                      onClick={confirmarDestreinar}
                    >
                      Deixar de ser treinado (banco = Intelecto)
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: 13, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--txt-dim)' }}>
                      <b>{PERICIAS.find((per) => per.id === personagem.monstruosoPericiaDestreinada)?.nome}</b> destreinada
                      · banco: <b>{Number(personagem.monstruosoBancoDados || 0)}</b> dado(s)
                      {' '}(recupera a perícia e o banco no próximo interlúdio)
                    </span>
                    <button
                      className="btn ghost sm"
                      disabled={!(Number(personagem.monstruosoBancoDados || 0) > 0)}
                      title="Gasta 1 dado do banco — o PRÓXIMO teste de perícia rolado ganha +1 dado no pool"
                      onClick={confirmarGastarDadoBanco}
                    >
                      Gastar 1 dado (+1 no próximo teste)
                    </button>
                    {personagem.monstruosoBancoPendente && (
                      <span style={{ color: cor, fontSize: 12.5 }}>pronto — o próximo teste de perícia leva +1 dado</span>
                    )}
                  </div>
                )}
                {erroBanco && <p style={{ color: 'var(--sangue-claro)', fontSize: 12.5, marginTop: 6 }}>{erroBanco}</p>}
              </div>
            )}
          </div>
        );
      })}

      {ativo && ((classe === 'especialista' && patamar >= 40) || rituaisConcedidos.length > 0) && (
        <div style={{ marginTop: 10 }}>
          <CabecalhoSeta estaAberto={aberto('extras', true)} corSeta={cor} onClick={() => alternar('extras', true)}>
            Outros efeitos ativos
          </CabecalhoSeta>
          {aberto('extras', true) && (
            <>
              {classe === 'especialista' && patamar >= 40 && (
                <ul style={{ margin: '6px 0 0', paddingLeft: 18, color: cor, fontSize: 13.5, lineHeight: 1.6 }}>
                  {ef.danoExtra.length > 0 && <li>Dano extra nos ataques (com a drenagem de hoje): +{ef.danoExtra.join(' + ')} {elemento}</li>}
                  {ef.resistenciaDano > 0 && elemento === 'Sangue' && <li>Resistência a dano {ef.resistenciaDano} (geral, qualquer tipo — já somada ao Bloqueio)</li>}
                  {ef.turnosMorrendoExtra > 0 && <li>+{ef.turnosMorrendoExtra} turno(s) de tolerância a "morrendo" (com a drenagem de hoje)</li>}
                  {ef.pvTempCena && (
                    <li>
                      PV temporários no início da cena (com a drenagem de hoje): {ef.pvTempCena.dados}d{ef.pvTempCena.faces}{' '}
                      <button className="btn ghost sm" style={{ padding: '1px 8px', fontSize: 11, color: 'var(--txt)' }} onClick={concederPvTempCena}>conceder</button>
                    </li>
                  )}
                  {ef.testeBonusDadoGenerico && (
                    <li>
                      +{ef.testeBonusDadoGenerico.quantidade}d{ef.testeBonusDadoGenerico.faces} {ef.testeBonusDadoGenerico.descricao} (com a drenagem de hoje — já entra sozinho nessas rolagens de perícia, na aba de Perícias)
                    </li>
                  )}
                  <li style={{ color: 'var(--txt-fraco)' }}>Pontos drenados hoje: {Number(personagem.monstruosoDrenagem || 0)}</li>
                </ul>
              )}
              {rituaisConcedidos.length > 0 && (
                <ul style={{ margin: '6px 0 0', paddingLeft: 18, color: cor, fontSize: 13.5, lineHeight: 1.6 }}>
                  {rituaisConcedidos.map((r) => (
                    <li key={r._monstruosoId}>Ritual concedido: {r.nome}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      )}

      {!ativo && (
        <p style={{ marginTop: 10, fontSize: 12.5, color: 'var(--txt-fraco)' }}>
          Sem a etapa de hoje feita, sofres os efeitos de fome e sede do livro (não é automatizado — é narrativo).
        </p>
      )}

      {escolhas.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <CabecalhoSeta estaAberto={aberto('escolhas', true)} corSeta={cor} onClick={() => alternar('escolhas', true)}>
            Escolhas da trilha
          </CabecalhoSeta>
          {aberto('escolhas', true) && escolhas.map((g) => (
            <LinhaEscolha key={g.id} ganho={g} personagem={personagem} setPersonagem={setPersonagem} patamarAtualNum={patamar} />
          ))}
        </div>
      )}

      </>}

      {peModalAberto && (
        <div className="modal-fundo" style={{ zIndex: 100 }} onClick={(e) => e.target === e.currentTarget && setPeModalAberto(false)}>
          <div className="modal" style={{ maxWidth: 380, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>Ser Macabro — gastar PE</h3>
              <button className="fechar" onClick={() => setPeModalAberto(false)}>×</button>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: 14.5, marginBottom: 20 }}>
                Quantos PE queres gastar? Recuperas 1d8 PV por PE gasto (máx. {limitePeRecuperarVida()}, limitado pela Força).
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 22 }}>
                <button type="button" className="btn ghost sm" onClick={() => setPeRascunho((v) => Math.max(1, (Number(v) || 0) - 1))}>−</button>
                <strong style={{ fontSize: 22, minWidth: 40, textAlign: 'center', fontFamily: 'var(--numeros)' }}>{peRascunho}</strong>
                <button type="button" className="btn ghost sm" onClick={() => setPeRascunho((v) => Math.min(limitePeRecuperarVida(), (Number(v) || 0) + 1))}>+</button>
              </div>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                <button className="btn ghost" onClick={() => setPeModalAberto(false)}>Cancelar</button>
                <button className="btn" style={{ borderColor: cor, background: cor }} onClick={confirmarGastarPe}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalReacaoAberto && (
        <div className="modal-fundo" style={{ zIndex: 100 }} onClick={(e) => e.target === e.currentTarget && setModalReacaoAberto(false)}>
          <div className="modal" style={{ maxWidth: 480, textAlign: 'left' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>Conjurar Ritual Marcado como Reação</h3>
              <button className="fechar" onClick={() => setModalReacaoAberto(false)}>×</button>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: 13.5, marginBottom: 14 }}>
                Como reação (1x por cena), podes conjurar um ritual marcado na pele em vez da ação normal que ele exige.
                {reacao?.condicao && <span style={{ display: 'block', marginTop: 4, color: cor }}>Destrancada por: <strong>{reacao.condicao}</strong></span>}
              </p>

              {(() => {
                const todosRituais = [...(personagem.rituais || []), ...rituaisConcedidos];
                if (todosRituais.length === 0) {
                  return (
                    <div style={{ padding: 14, background: 'rgba(0,0,0,0.3)', borderRadius: 4, border: '1px solid var(--linha)', marginBottom: 16 }}>
                      <p style={{ margin: 0, fontSize: 13.5, color: 'var(--txt-fraco)' }}>
                        Ainda não tens nenhum ritual aprendido na ficha.
                      </p>
                      <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--txt-dim)' }}>
                        Adiciona rituais na aba <strong>Rituais</strong> para poderes marcá-los e conjurá-los como reação.
                      </p>
                    </div>
                  );
                }

                const ritualSel = todosRituais.find((x) => (x._monstruosoId && x._monstruosoId === ritualReacaoEscolhidoId) || (x.id && x.id === ritualReacaoEscolhidoId) || (x.nome && x.nome === ritualReacaoEscolhidoId)) || todosRituais.find((x) => marcadoDoRitual(personagem, x)) || todosRituais[0];
                const chaveSel = ritualSel?._monstruosoId || ritualSel?.id || ritualSel?.nome;

                return (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 8 }}>Escolhe o ritual a conjurar como reação:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto', marginBottom: 16, paddingRight: 4 }}>
                      {todosRituais.map((r, idx) => {
                        const chave = r._monstruosoId || r.id || r.nome || idx;
                        const selecionado = chave === chaveSel;
                        const marcado = marcadoDoRitual(personagem, r);
                        const elegivel = podeSerMarcadoNaPele(personagem, nex, r);
                        const custo = custoEfetivoRitual(personagem, nex, r);
                        const dt = calcDtRitual(personagem, r, true);
                        const idxProprio = (personagem.rituais || []).findIndex((x) => x === r || (x.id && x.id === r.id && x.nome === r.nome));
                        return (
                          <div
                            key={chave}
                            onClick={() => setRitualReacaoEscolhidoId(chave)}
                            style={{
                              padding: '10px 12px',
                              borderRadius: 4,
                              border: `1px solid ${selecionado ? cor : 'var(--linha)'}`,
                              background: selecionado ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.2)',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 6,
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <strong style={{ fontSize: 14.5, color: selecionado ? cor : 'var(--txt)' }}>
                                  {r.nome || 'Ritual'}
                                </strong>
                                {marcado ? (
                                  <span className="pill" style={{ borderColor: cor, color: cor, fontSize: 10 }}> NA PELE</span>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn ghost sm"
                                    style={{ padding: '0 6px', fontSize: 10 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPersonagem((p) => ({ ...p, ...patchEstadoRitual(p, r, idxProprio, 'marcado', true) }));
                                    }}
                                  >
                                    + marcar na pele
                                  </button>
                                )}
                              </div>
                              <span style={{ fontSize: 12.5, fontWeight: 'bold', color: 'var(--txt)' }}>
                                {custo} {personagem?.regras?.semSanidade ? 'PD' : 'PE'}
                              </span>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--txt-dim)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                              <span>{r.circulo || 1}º círculo</span>
                              <span>{r.elemento}</span>
                              {r.alcance && <span>Alcance: {r.alcance}</span>}
                              {r.duracao && <span>Duração: {r.duracao}</span>}
                              {dt ? <span style={{ color: 'var(--txt)', fontWeight: 'bold' }}>DT {dt}</span> : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}

              {erroReacao && <p style={{ color: 'var(--sangue-claro)', fontSize: 13, margin: '0 0 14px' }}>{erroReacao}</p>}

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" className="btn ghost" onClick={() => setModalReacaoAberto(false)}>Cancelar</button>
                {(() => {
                  const todosRituais = [...(personagem.rituais || []), ...rituaisConcedidos];
                  if (todosRituais.length === 0) return null;
                  return (
                    <button
                      type="button"
                      className="btn"
                      style={{ borderColor: cor, background: cor }}
                      onClick={confirmarConjurarReacao}
                    >
                      Conjurar como Reação
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
