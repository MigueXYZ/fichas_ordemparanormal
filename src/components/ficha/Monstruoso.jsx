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
import { nexEfetivo, calcMaximos } from '../../engine/calc.js';
import { ajustarRecursos } from '../../engine/character.js';
import { rolarExpressao } from '../../engine/dados.js';
import {
  classeMonstruosa, patamarAtual, elementoAtual, efeitosDiarios, nomePoderAtual, consequenciasAtivas,
  ativarHoje, desativarHoje, escolherElemento, limiteDrenagem, tudoPermanente,
  escolhasNecessarias, escolherRitual, escolherPericiasConhecimento, rituaisAtivos, resumoPorPatamar,
  atributosEfetivos,
} from '../../engine/monstruoso.js';
import { ELEMENTOS_MONSTRUOSO, NOME_PODER_POR_PATAMAR, COR_ELEMENTO, DRENAGEM_ATRIBUTO } from '../../data/monstruoso.js';
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
    else if (permanente) setModal(null); // nada para ligar/desligar — está sempre ativo
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
                <button type="button" onClick={() => setModal('confirmarMudarElemento')} title="Trocar de elemento (não é suposto — só para engano ou exceção do mestre)" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: 'var(--txt-fraco)' }}>✎</button>
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
                <button type="button" onClick={() => setModal('confirmarMudarElemento')} title="Trocar de elemento (não é suposto — só para engano ou exceção do mestre)" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: 'var(--txt-fraco)' }}>✎</button>
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

      {modal === 'confirmarMudarElemento' && (
        <div className="modal-fundo" style={{ zIndex: 100 }}>
          <div className="modal" style={{ maxWidth: 420, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>Trocar de elemento?</h3>
              <button className="fechar" onClick={() => setModal(ativo ? 'desativar' : 'ativar')}>×</button>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: 14.5, marginBottom: 22 }}>
                A escolha do elemento da Trilha do Monstruoso é <strong>permanente</strong> — não é suposto voltar
                atrás depois de a fazeres. Isto aqui é só para quando isso aconteceu por engano, ou o mestre
                permitir uma exceção.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                <button className="btn ghost" onClick={() => setModal(ativo ? 'desativar' : 'ativar')}>Cancelar</button>
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
    </div>
  );
}
