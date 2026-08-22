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
import combatente from '../../data/classes/combatente.js';
import { TRILHAS_AS07 } from '../../data/extra/as07.js';
import { PERICIAS } from '../../data/pericias.js';
import { RITUAIS } from '../../data/rituais.js';
import { nexEfetivo } from '../../engine/calc.js';
import { ajustarRecursos } from '../../engine/character.js';
import { rolarExpressao } from '../../engine/dados.js';
import {
  classeMonstruosa, patamarAtual, elementoAtual, efeitosDiarios, nomePoderAtual, consequenciasAtivas,
  ativarHoje, desativarHoje, escolherElemento, limiteDrenagem, tudoPermanente,
  escolhasNecessarias, escolherRitual, escolherPericiasConhecimento, rituaisAtivos, resumoPorPatamar,
} from '../../engine/monstruoso.js';
import { ELEMENTOS_MONSTRUOSO, NOME_PODER_POR_PATAMAR, TRILHA_ID_POR_CLASSE, COR_ELEMENTO, DRENAGEM_ATRIBUTO } from '../../data/monstruoso.js';

const NOME_ATRIBUTO = { for: 'Força', agi: 'Agilidade', int: 'Intelecto', pre: 'Presença', vig: 'Vigor' };

const TRILHA_TEXTO = {
  combatente: combatente.trilhas.find((t) => t.id === TRILHA_ID_POR_CLASSE.combatente),
  especialista: TRILHAS_AS07.find((t) => t.id === TRILHA_ID_POR_CLASSE.especialista),
  ocultista: TRILHAS_AS07.find((t) => t.id === TRILHA_ID_POR_CLASSE.ocultista),
};

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
              <button className="fechar" onClick={() => setModal(null)}>×</button>
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
              <button className="fechar" onClick={() => setModal(null)}>×</button>
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
    </>
  );
}

function TextoPoderOficial({ classe, elemento, patamar }) {
  const [aberto, setAberto] = useState(false);
  const trilha = TRILHA_TEXTO[classe];
  if (!trilha) return null;
  const poderes = trilha.poderes.filter((p) => p.nex <= patamar);
  return (
    <div style={{ marginTop: 10 }}>
      <button type="button" className="btn ghost sm" onClick={() => setAberto((v) => !v)}>
        {aberto ? 'Esconder' : 'Ver'} texto oficial ({trilha.livro})
      </button>
      {aberto && (
        <div style={{ marginTop: 10, fontSize: 13, color: 'var(--txt-dim)', lineHeight: 1.55, maxHeight: 320, overflowY: 'auto', paddingRight: 6 }}>
          {trilha.descricao && <p style={{ whiteSpace: 'pre-wrap', margin: '0 0 10px' }}>{trilha.descricao}</p>}
          {trilha.especial && <p style={{ whiteSpace: 'pre-wrap', margin: '0 0 10px', fontStyle: 'italic' }}>{trilha.especial}</p>}
          {trilha.nota && (
            <div style={{ marginBottom: 14, padding: 8, border: '1px solid var(--linha)', borderRadius: 4 }}>
              <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{trilha.nota}</p>
            </div>
          )}
          {poderes.map((p) => (
            <div key={p.nex} style={{ marginBottom: 14 }}>
              <strong style={{ color: 'var(--txt)' }}>{p.nex}% — {p.nome}</strong>
              <p style={{ whiteSpace: 'pre-wrap', margin: '4px 0 0' }}>{p.descricao}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Uma escolha permanente que a trilha pede (ritual à escolha, ou as 2 perícias livres). */
function LinhaEscolha({ ganho, personagem, setPersonagem }) {
  const escolhas = personagem.monstruosoEscolhas || { periciasConhecimento: [], rituais: {} };

  if (ganho.tipo === 'pericias-livres') {
    const [a, b] = escolhas.periciasConhecimento || [];
    const [periciaA, setPericiaA] = useState(a || '');
    const [periciaB, setPericiaB] = useState(b || '');
    const feita = Boolean(a && b);
    function guardar() {
      setPersonagem((p) => ({ ...p, ...escolherPericiasConhecimento(p, [periciaA, periciaB]).patch }));
    }
    return (
      <div style={{ padding: '8px 0', borderBottom: '1px solid var(--linha)' }}>
        <div style={{ fontSize: 13, marginBottom: 6 }}>{ganho.patamar}% · Escolhe 2 perícias treinadas {feita ? '(já escolhidas — podes trocar)' : ''}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={periciaA} onChange={(e) => setPericiaA(e.target.value)} style={{ flex: 1, fontSize: 12 }}>
            <option value="">-- 1ª perícia --</option>
            {PERICIAS.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
          <select value={periciaB} onChange={(e) => setPericiaB(e.target.value)} style={{ flex: 1, fontSize: 12 }}>
            <option value="">-- 2ª perícia --</option>
            {PERICIAS.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
          <button className="btn sm" disabled={!periciaA || !periciaB || periciaA === periciaB} onClick={guardar}>Guardar</button>
        </div>
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
  const rituaisConcedidos = ativo ? rituaisAtivos(personagem, nex) : [];
  const escolhas = escolhasNecessarias(personagem, nex);
  const blocos = ativo ? resumoPorPatamar(personagem, nex) : [];

  function rolarBonusGenerico() {
    if (!ef.testeBonusDadoGenerico) return;
    const r = rolarExpressao(`${ef.testeBonusDadoGenerico.quantidade}d${ef.testeBonusDadoGenerico.faces}`);
    if (r) onRolar(r);
  }

  function concederPvTempCena() {
    if (!ef.pvTempCena) return;
    const r = rolarExpressao(`${ef.pvTempCena.dados}d${ef.pvTempCena.faces}`);
    if (r) onRolar(r);
    setPersonagem((p) => ({ ...p, pvTemp: Number(p.pvTemp || 0) + (r ? r.total : 0) }));
  }

  return (
    <div style={{ border: `1px solid ${cor}`, borderRadius: 6, padding: 14, marginBottom: 16, background: 'rgba(0,0,0,0.4)' }}>
      <h3 style={{ color: cor, margin: 0, textTransform: 'uppercase', fontSize: 16, letterSpacing: 1 }}>
        {titulo} ({elemento})
      </h3>

      {consequencias.length > 0 && (
        <div style={{ marginTop: 10, padding: 10, borderRadius: 4, border: '1px solid var(--sangue)', background: 'rgba(192,21,33,.08)' }}>
          {consequencias.map((c, i) => (
            <p key={i} style={{ margin: i ? '6px 0 0' : 0, fontSize: 12.5, color: 'var(--txt-dim)' }}>{c.nota}</p>
          ))}
        </div>
      )}

      {ativo && blocos.map((b) => (
        <div key={b.patamar} style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12.5, textTransform: 'uppercase', letterSpacing: 0.5, color: cor }}>
            {b.patamar}% — {b.titulo}
          </div>
          {b.linhas.length > 0 && (
            <ul style={{ margin: '4px 0 0', paddingLeft: 18, color: 'var(--txt-dim)', fontSize: 13.5, lineHeight: 1.55 }}>
              {b.linhas.map((linha, i) => <li key={i}>{linha}</li>)}
            </ul>
          )}
        </div>
      ))}

      {ativo && classe === 'especialista' && patamar >= 40 && (
        <ul style={{ margin: '10px 0 0', paddingLeft: 18, color: cor, fontSize: 13.5, lineHeight: 1.6 }}>
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
              +{ef.testeBonusDadoGenerico.quantidade}d{ef.testeBonusDadoGenerico.faces} {ef.testeBonusDadoGenerico.descricao} (com a drenagem de hoje){' '}
              <button className="btn ghost sm" style={{ padding: '1px 8px', fontSize: 11, color: 'var(--txt)' }} onClick={rolarBonusGenerico}>rolar</button>
            </li>
          )}
          <li style={{ color: 'var(--txt-fraco)' }}>Pontos drenados hoje: {Number(personagem.monstruosoDrenagem || 0)}</li>
        </ul>
      )}

      {ativo && rituaisConcedidos.length > 0 && (
        <ul style={{ margin: '10px 0 0', paddingLeft: 18, color: cor, fontSize: 13.5, lineHeight: 1.6 }}>
          {rituaisConcedidos.map((r) => (
            <li key={r._monstruosoId}>Ritual concedido: {r.nome}</li>
          ))}
        </ul>
      )}

      {!ativo && (
        <p style={{ marginTop: 10, fontSize: 12.5, color: 'var(--txt-fraco)' }}>
          Sem a etapa de hoje feita, sofres os efeitos de fome e sede do livro (não é automatizado — é narrativo).
        </p>
      )}

      {escolhas.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12.5, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--txt-fraco)', marginBottom: 4 }}>
            Escolhas da trilha (permanentes — não dependem da etapa de hoje)
          </div>
          {escolhas.map((g) => (
            <LinhaEscolha key={g.id} ganho={g} personagem={personagem} setPersonagem={setPersonagem} />
          ))}
        </div>
      )}

      <TextoPoderOficial classe={classe} elemento={elemento} patamar={patamar} />
    </div>
  );
}
