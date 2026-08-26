import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PERICIAS } from '../../data/pericias.js';
import { RITUAIS, ELEMENTOS, CIRCULOS, circuloMaximoPorNex } from '../../data/rituais.js';
import { ITENS, TIPOS_ITEM } from '../../data/itens.js';
import { PODERES } from '../../data/poderes.js';
import { CLASSES, TRILHAS, CLASSES_POR_ID, TRILHAS_POR_ID } from '../../data/classes.js';
import { ORIGENS, ORIGENS_POR_ID } from '../../data/origens.js';
import { calcCarga, calcItensPorCategoria, nexEfetivo, calcMaximos, calcDtRitual, detalheDtRitual, calcPericias } from '../../engine/calc.js';
import { PATENTES, PATENTES_POR_ID, CATEGORIAS, categoriaRomana } from '../../data/patentes.js';
import { novoAtaque, novoItem, novaHabilidade, novoRitual } from '../../engine/character.js';
import { rolarAtaqueCompleto, rolarDano, rolarTeste, quantidadeDados } from '../../engine/dados.js';
import { estatisticasArma, interpretarCritico, armaDoItem, ehArma, formulaTeste } from '../../engine/armas.js';
import { precoDoRitual, podeFicarAtivo, CONDICOES_CONCENTRACAO, dtConcentracao, marcadoDoRitual, ativoDoRitual, patchEstadoRitual, conjurarRitual, custoBaseDeRitual, custoEfetivoRitual } from '../../engine/rituais.js';
import { efeitosDe } from '../../data/rituaisEfeitos.js';
import { ataquesNaturaisAtivos, rituaisAtivos, temComponentesDoElemento, classeMonstruosa, elementoAtual, patamarAtual, efetivamenteAtivo, atributosEfetivos, reducaoTatuagemRitualistica, bonusConcentracaoTatuagem, poderesAtivos, temTatuagemRitualistica, podeSerMarcadoNaPele, armarServirSangue, armarRevelacaoConhecimento } from '../../engine/monstruoso.js';
import { ELEMENTOS_MONSTRUOSO, COR_ELEMENTO } from '../../data/monstruoso.js';
import EditorArma from './EditorArma.jsx';
import IconeD20 from '../IconeD20.jsx';
import CabecalhoSeta from './CabecalhoSeta.jsx';
import Seletor from './Seletor.jsx';
import EditorTags from '../EditorTags.jsx';

const NOME_ATRIBUTO = { for: 'Força', agi: 'Agilidade', int: 'Intelecto', pre: 'Presença', vig: 'Vigor' };

function Campo({ label, valor, onChange, tipo = 'text', opcoes, readOnly = false }) {
  return (
    <div className="campo">
      <label>{label}</label>
      {opcoes && !readOnly ? (
        <select value={valor} onChange={(e) => onChange(e.target.value)}>
          {opcoes.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input type={tipo} value={valor ?? ''} onChange={(e) => onChange(e.target.value)} readOnly={readOnly} />
      )}
    </div>
  );
}

function SeletorQuantidade({ valor, onChange, min = 1, max = 99 }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    function handleWheel(e) {
      if (document.activeElement !== el) return;
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY < 0 ? 1 : -1;
      const novo = Math.max(min, Math.min(max, (Number(el.value) || min) + delta));
      onChange(novo);
    }
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [onChange, min, max]);

  return (
    <div className="seletor-quantidade" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <button
        type="button"
        className="btn ghost sm"
        onClick={() => onChange(Math.max(min, (Number(valor) || min) - 1))}
        style={{ minWidth: 28, padding: '2px 8px' }}
      >
        −
      </button>
      <input
        ref={inputRef}
        type="number"
        min={min}
        max={max}
        value={valor}
        onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))}
        style={{ width: 48, textAlign: 'center', fontWeight: 'bold' }}
      />
      <button
        type="button"
        className="btn ghost sm"
        onClick={() => onChange(Math.min(max, (Number(valor) || min) + 1))}
        style={{ minWidth: 28, padding: '2px 8px' }}
      >
        +
      </button>
    </div>
  );
}

function TextoExpandivel({ texto }) {
  const [expandido, setExpandido] = useState(false);
  if (!texto) return null;
  const longo = texto.length > 180;
  return (
    <div className="texto-expandivel">
      <p style={{ margin: 0, whiteSpace: 'pre-line', fontSize: '13.5px', color: 'var(--txt-suave, #ccc)' }}>
        {expandido || !longo ? texto : `${texto.slice(0, 180)}…`}
      </p>
      {longo && (
        <button
          type="button"
          className="btn-link"
          style={{ fontSize: 12, marginTop: 4, padding: 0, background: 'none', border: 'none', color: 'var(--sangue-claro)', cursor: 'pointer' }}
          onClick={() => setExpandido((v) => !v)}
        >
          {expandido ? 'Ver menos' : 'Ver mais'}
        </button>
      )}
    </div>
  );
}

function useLista(personagem, setPersonagem, campo) {
  const lista = personagem[campo] || [];
  function adicionar(item) { setPersonagem({ ...personagem, [campo]: [...lista, item] }); }
  function editar(index, patch) {
    const copia = [...lista];
    copia[index] = { ...copia[index], ...patch };
    setPersonagem({ ...personagem, [campo]: copia });
  }
  function remover(index) {
    setPersonagem({ ...personagem, [campo]: lista.filter((_, i) => i !== index) });
  }
  return { lista, adicionar, editar, remover };
}

// ------------------------------------------------------------- COMBATE

export function AbaCombate({ personagem, setPersonagem, onRolar }) {
  const { lista: ataquesBase, editar } = useLista(personagem, setPersonagem, 'ataques');
  const [aEditarArma, setAEditarArma] = useState(null);
  const [acertos, setAcertos] = useState({});
  const [peEnergia, setPeEnergia] = useState({});

  const nex = nexEfetivo(personagem);
  const naturais = ataquesNaturaisAtivos(personagem, nex);
  const lista = [...naturais, ...ataquesBase];

  const podeGastarPeEnergia =
    classeMonstruosa(personagem) === 'combatente' &&
    elementoAtual(personagem) === 'energia' &&
    patamarAtual(nex) >= 40 &&
    efetivamenteAtivo(personagem, nex);

  function limitePeEnergia() {
    const ef = atributosEfetivos(personagem, nex);
    return Math.max(1, Number(ef.agi || 1));
  }

  function atacar(a, i) {
    const e = estatisticasArma(personagem, a);
    const r = rolarAtaqueCompleto({
      nome: a.nome || 'Ataque',
      dados: e.dados,
      bonusAtaque: e.bonusAtaque,
      dadosExtraAtaque: e.dadosExtraAtaque,
      dano: e.dano,
      bonusDano: e.bonusDano,
      extras: e.extras,
      margem: e.margem,
      multiplicador: e.multiplicador,
    });
    setAcertos((prev) => ({ ...prev, [i]: r }));
    onRolar(r);
  }

  function danificar(a, i) {
    const e = estatisticasArma(personagem, a);
    const critico = Boolean(acertos[i]?.critico);
    const corpoACorpo = a.pericia === 'luta';
    const nEnergia = podeGastarPeEnergia && corpoACorpo ? Math.max(0, Math.min(Number(peEnergia[i]) || 0, limitePeEnergia())) : 0;
    const extras = nEnergia > 0 ? [...e.extras, { expr: `${nEnergia}d6`, elemental: true, tipoDano: 'Energia' }] : e.extras;
    const r = rolarDano({
      nome: `${a.nome || 'Ataque'} — dano`,
      dano: e.dano,
      bonus: e.bonusDano,
      extras,
      critico,
      multiplicador: e.multiplicador,
    });
    if (r) {
      onRolar(r);
      if (nEnergia > 0) {
        const max = calcMaximos(personagem);
        setPersonagem((p) => ({ ...p, peAtual: Number(p.peAtual ?? max.pe) - nEnergia }));
        setPeEnergia((prev) => ({ ...prev, [i]: 0 }));
      }
    }
  }

  return (
    <div>
      {lista.length === 0 ? (
        <div className="painel-vazio">Sem armas. Escolhe-as no separador Inventário.</div>
      ) : (
        <div className="lista-blocos">
          {lista.map((a, i) => {
            const e = estatisticasArma(personagem, a);
            const acerto = acertos[i];
            const equipado = a.equipado !== false;
            return (
              <div className={'bloco arma' + (equipado ? '' : ' guardada')} key={a._monstruosoId || i}>
                <div className="topo">
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    {a.imagem && <div className="miniatura-arma" style={{ backgroundImage: `url(${a.imagem})` }} />}
                    <div>
                      <b style={{ fontSize: '18px', letterSpacing: '0.5px' }}>
                        {a.nome || 'Sem nome'}
                        {a._monstruoso && <span className="pill" style={{ marginLeft: 8, fontSize: 10 }}>MONSTRUOSO</span>}
                      </b>
                      <div className="arma-stats" style={{ fontSize: '14px' }}>
                        <span>
                          {e.pericia.nome} <span style={{ color: e.dados <= 0 ? '#ef4444' : '#22c55e' }}>{quantidadeDados(e.dados)}d20</span>
                          {e.bonusAtaque ? (e.bonusAtaque > 0 ? ` +${e.bonusAtaque}` : ` ${e.bonusAtaque}`) : ''}
                        </span>
                        {e.agilAtiva && <span className="pill">ÁGIL</span>}
                        {e.dano && e.dano !== '-' && <span>Dano: {e.dano}{e.bonusDano ? (e.bonusDano > 0 ? ` + ${e.bonusDano}` : ` − ${Math.abs(e.bonusDano)}`) : ''}</span>}
                        <span>{e.margem === 20 ? '20' : `${e.margem}–20`} / ×{e.multiplicador}</span>
                        {a.tipo && <span>{a.tipo}</span>}
                        {e.alcance && <span>{e.alcance}</span>}
                        <span>{Number(a.espacos) || 0} esp.</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {!a._monstruoso && (
                      <button
                        type="button"
                        className={'toggle-equipar' + (equipado ? ' equipado' : '')}
                        onClick={() => editar(i - naturais.length, { equipado: !equipado })}
                      >
                        <span className="bolinha" />
                        {equipado ? 'Equipada' : 'Guardada'}
                      </button>
                    )}
                    <button className="btn sm" disabled={!equipado} onClick={() => atacar(a, i)}>Atacar</button>
                    {!a._monstruoso && (
                      <button className="btn ghost sm" onClick={() => setAEditarArma({ indice: i - naturais.length, arma: a })}>Editar</button>
                    )}
                    <button
                      className={'btn sm' + (acerto?.critico ? '' : ' ghost')}
                      disabled={!acerto || !equipado}
                      onClick={() => danificar(a, i)}
                    >
                      {acerto?.critico ? `Dano ×${e.multiplicador}` : 'Só dano'}
                    </button>
                  </div>
                </div>

                {acerto && (
                  <div className={'resultado-ataque' + (acerto.critico ? ' critico' : '')}>
                    <span>
                      Acerto: <b>{acerto.total}</b> ({acerto.dados}d20 [{acerto.rolagens.join(', ')}] → maior {acerto.escolhido}
                      {acerto.bonus ? ` ${acerto.bonus > 0 ? '+' : '−'} ${Math.abs(acerto.bonus)}` : ''})
                      {acerto.critico ? ' · ACERTO CRÍTICO' : ''}
                    </span>
                    {acerto.dano && (
                      <span>
                        Dano: <b>{acerto.dano.total}</b> ({acerto.dano.expressao} [{acerto.dano.rolagens.join(', ')}]
                        {acerto.dano.bonus ? ` ${acerto.dano.bonus > 0 ? '+' : '−'} ${Math.abs(acerto.dano.bonus)}` : ''})
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {aEditarArma !== null && (
        <EditorArma
          arma={aEditarArma.arma}
          aoFechar={() => setAEditarArma(null)}
          aoGuardar={(nova) => {
            editar(aEditarArma.indice, nova);
            setAEditarArma(null);
          }}
        />
      )}

      <RituaisEmCombate personagem={personagem} setPersonagem={setPersonagem} onRolar={onRolar} />
    </div>
  );
}

function RituaisEmCombate({ personagem, setPersonagem, onRolar }) {
  const [modalConc, setModalConc] = useState(null);
  const [condConc, setCondConc] = useState('ruim');
  const [danoConc, setDanoConc] = useState(0);

  const nex = nexEfetivo(personagem);
  const rituais = [...(personagem.rituais || []), ...rituaisAtivos(personagem, nex)];
  if (!rituais.length) return null;

  const max = calcMaximos(personagem);
  const usaPd = max.semSanidade;

  function custoDe(r) { return custoEfetivoRitual(personagem, nex, r); }
  function precisaComponente(r) { return Boolean(r.elemento) && r.elemento !== 'medo' && r.elemento !== 'variavel'; }
  function temComponente(r) { return !precisaComponente(r) || temComponentesDoElemento(personagem.inventario, r.elemento); }

  function conjurar(r, i) {
    const res = conjurarRitual(personagem, r, { onRolar, index: i });
    if (res.patch) setPersonagem({ ...personagem, ...res.patch });
  }

  /**
   * Teste de concentração (Livro Base, p. 120). "Se você estiver em uma
   * situação difícil ou sofrer dano durante a execução, precisa passar em um
   * teste de Vontade. Se falhar, o ritual não funciona e os PE são perdidos."
   * Os PE já foram gastos ao conjurar, por isso o que se faz ao falhar é
   * desligar o ritual.
   */
  function confirmarConcentracao() {
    const { r, i } = modalConc || {};
    setModalConc(null);
    if (!r) return;
    const marcado = marcadoDoRitual(personagem, r);
    const { dt: dtConc, conta } = dtConcentracao(condConc, { custoPe: custoDe(r), dano: danoConc });
    const von = calcPericias(personagem).find((x) => x.id === 'vontade') || { dados: 0, bonus: 0 };
    const bonusTat = bonusConcentracaoTatuagem(personagem, nex, r, marcado);
    const teste = rolarTeste({
      nome: `${r.nome || 'Ritual'} — Concentração (Vontade)`,
      dados: von.dados,
      bonus: von.bonus + bonusTat,
    });
    const passou = teste.total >= dtConc;
    if (!passou) setPersonagem({ ...personagem, ...patchEstadoRitual(personagem, r, i, 'ativo', false) });
    onRolar({
      ...teste, tipo: 'teste',
      notas: [
        conta,
        bonusTat ? `+${bonusTat} de Tatuagem Ritualística (ritual de ${elementoAtual(personagem)} marcado na pele)` : null,
        passou ? 'Passou — a concentração aguentou' : 'Falhou — o ritual não funciona e os PE são perdidos',
      ].filter(Boolean),
      sofreu: !passou,
    });
  }

  return (
    <div style={{ marginTop: 24 }}>
      <div className="rotulo-lista" style={{ marginBottom: 10 }}>Rituais Rápidos em Combate</div>
      <div className="lista-blocos">
        {rituais.map((r, i) => {
          const custo = custoDe(r);
          const compOk = temComponente(r);
          const ritualAtivo = ativoDoRitual(personagem, r);
          const marcado = marcadoDoRitual(personagem, r);
          const dtInfo = detalheDtRitual(personagem, r, marcado);
          return (
            <div className={'bloco ritual el-' + (r.elemento || 'variavel')} key={r._monstruosoId || i}>
              <div className="topo">
                <div>
                  <b style={{ fontSize: '18px' }}>{r.nome}</b>
                  <div className="arma-stats" style={{ fontSize: '14px' }}>
                    <span>{custo} {usaPd ? 'PD' : 'PE'}</span>
                    <span title={`10 + ${dtInfo.bonusNex} (NEX ${dtInfo.nex}%) + ${dtInfo.presenca} (${dtInfo.atributoDt ? NOME_ATRIBUTO[dtInfo.atributoDt] : 'Presença'})${dtInfo.bonusTrilha ? ` + ${dtInfo.bonusTrilha} (marcado na pele, 65%)` : ''} = ${dtInfo.total}`}>
                      DT {dtInfo.total}{r.resistencia ? ` · ${r.resistencia}` : ''}
                    </span>
                    {marcado && <span style={{ color: 'var(--txt-fraco)' }}>na pele</span>}
                    {r.alcance && <span>{r.alcance}</span>}
                    {r.duracao && <span>{r.duracao}</span>}
                    {!compOk && <span style={{ color: 'var(--sangue-claro)' }}>sem componentes</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {podeFicarAtivo(r) && (
                    <button
                      className={'btn sm' + (ritualAtivo ? '' : ' ghost')}
                      onClick={() => setPersonagem({ ...personagem, ...patchEstadoRitual(personagem, r, i, 'ativo', !ritualAtivo) })}
                    >
                      {ritualAtivo ? 'Ativo' : 'Inativo'}
                    </button>
                  )}
                  {ritualAtivo && (
                    <button
                      className="btn sm ghost"
                      title="Teste de Vontade para manter a concentração — DT 15/20 + custo em PE, ou igual ao dano se fores ferido. Falhar termina o ritual e os PE perdem-se."
                      onClick={() => { setCondConc('ruim'); setDanoConc(0); setModalConc({ r, i }); }}
                    >
                      Concentração
                    </button>
                  )}
                  <button className="btn sm" disabled={!compOk} onClick={() => conjurar(r, i)}>Conjurar</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modalConc && (
        <div className="modal-fundo" style={{ zIndex: 100 }} onClick={(e) => e.target === e.currentTarget && setModalConc(null)}>
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>Concentração — {modalConc.r.nome || 'Ritual'}</h3>
              <button className="fechar" onClick={() => setModalConc(null)}>×</button>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: 14.5, marginBottom: 16 }}>
                Em que situação estás? Falhar o teste de Vontade termina o ritual e os PE perdem-se.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {CONDICOES_CONCENTRACAO.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={'btn' + (condConc === c.id ? '' : ' ghost')}
                    style={{ textAlign: 'left', ...(condConc === c.id ? { borderColor: 'var(--sangue)', background: 'var(--sangue)' } : {}) }}
                    onClick={() => setCondConc(c.id)}
                  >
                    <div style={{ fontWeight: 'bold' }}>
                      {c.rotulo} · {c.base === null ? 'DT = dano sofrido' : `DT ${c.base} + custo em PE`}
                    </div>
                    <div style={{ fontSize: 12, opacity: .85, fontWeight: 'normal', whiteSpace: 'normal' }}>{c.exemplos}</div>
                  </button>
                ))}
              </div>

              {condConc === 'ferido' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 13, color: 'var(--txt-dim)' }}>Dano sofrido</span>
                  <button type="button" className="btn ghost sm" onClick={() => setDanoConc((v) => Math.max(0, (Number(v) || 0) - 1))}>−</button>
                  <strong style={{ fontSize: 22, minWidth: 48, textAlign: 'center', fontFamily: 'var(--numeros)' }}>{danoConc}</strong>
                  <button type="button" className="btn ghost sm" onClick={() => setDanoConc((v) => (Number(v) || 0) + 1)}>+</button>
                </div>
              )}

              <div style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--txt-dim)', marginBottom: 18 }}>
                {dtConcentracao(condConc, { custoPe: custoDe(modalConc.r), dano: danoConc }).conta}
                {bonusConcentracaoTatuagem(personagem, nex, modalConc.r, marcadoDoRitual(personagem, modalConc.r)) > 0 && (
                  <div style={{ color: 'var(--txt)' }}>
                    +{bonusConcentracaoTatuagem(personagem, nex, modalConc.r, marcadoDoRitual(personagem, modalConc.r))} no teste — Tatuagem Ritualística
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                <button className="btn ghost" onClick={() => setModalConc(null)}>Cancelar</button>
                <button className="btn" onClick={confirmarConcentracao}>Rolar Vontade</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------- HABILIDADES / PODERES

export function AbaHabilidades({ personagem, setPersonagem }) {
  const { lista, adicionar, editar, remover } = useLista(personagem, setPersonagem, 'habilidades');
  const [aEscolher, setAEscolher] = useState(false);

  const classe = CLASSES_POR_ID[personagem.classeId];
  const trilha = personagem.trilhaId ? TRILHAS_POR_ID[personagem.trilhaId] : null;
  const origem = personagem.origemId === '__custom__' ? personagem.origemCustom : ORIGENS_POR_ID[personagem.origemId];
  const nex = nexEfetivo(personagem);

  const automaticasHabilidades = [
    origem?.poder?.nome && { nome: origem.poder.nome, descricao: origem.poder.descricao, fonte: 'Origem', tipo: 'habilidade' },
    ...(classe?.habilidades || []).filter((h) => !h.nex || Number(h.nex) <= nex).map((h) => ({ ...h, fonte: classe.nome, tipo: 'habilidade' })),
  ].filter(Boolean);

  const automaticasPoderes = [
    ...(trilha?.poderes || []).filter((p) => !p.nex || Number(p.nex) <= nex).map((p) => ({ ...p, fonte: trilha.nome, tipo: 'poder' })),
    ...poderesAtivos(personagem, nex)
      .filter((p) => !(lista || []).some((h) => String(h?.nome || '').toLowerCase() === String(p.nome).toLowerCase()))
      .map((p) => ({ nome: p.nome, descricao: p.descricao, nex: p.patamar, fonte: trilha?.nome || 'Trilha', tipo: 'poder' })),
  ].filter(Boolean);

  const listaHabilidades = lista
    .map((item, idx) => ({ ...item, indiceOriginal: idx }))
    .filter((item) => item.tipo === 'habilidade' || /habilidade/i.test(item.origem || ''));

  const listaPoderes = lista
    .map((item, idx) => ({ ...item, indiceOriginal: idx }))
    .filter((item) => item.tipo !== 'habilidade' && !/habilidade/i.test(item.origem || ''));

  const catalogo = useMemo(() => {
    const todos = [
      ...PODERES.map((p) => ({
        ...p,
        tipo: p.tipo === 'paranormal' ? 'Poder Paranormal' : 'Poder Geral',
        grupoTipo: p.tipo === 'paranormal' ? 'Poder Paranormal' : 'Poder Geral',
        categoriaSecao: 'poder',
      })),
      ...CLASSES.flatMap((c) =>
        (c.poderes || []).map((p) => ({
          ...p,
          id: p.id || `poder-classe-${c.id}-${p.nome}`,
          tipo: `Poder de ${c.nome}`,
          grupoTipo: c.nome,
          classe: c.nome,
          categoriaSecao: 'poder',
        }))
      ),
      ...CLASSES.flatMap((c) =>
        (c.habilidades || []).map((h) => ({
          ...h,
          id: h.id || `hab-classe-${c.id}-${h.nome}`,
          tipo: `Habilidade de ${c.nome}`,
          grupoTipo: c.nome,
          classe: c.nome,
          categoriaSecao: 'habilidade',
        }))
      ),
      ...TRILHAS.flatMap((t) =>
        (t.poderes || []).map((p) => ({
          ...p,
          id: p.id || `trilha-${t.id}-${p.nome}`,
          tipo: `Trilha: ${t.nome}`,
          grupoTipo: 'Trilhas',
          trilha: t.nome,
          classe: t.classeNome,
          categoriaSecao: 'poder',
        }))
      ),
      ...ORIGENS.filter((o) => o.poder?.nome).map((o) => ({
        id: `origem-${o.id}`,
        nome: o.poder.nome,
        descricao: o.poder.descricao,
        tipo: 'Poder de Origem',
        grupoTipo: 'Origens',
        origem: o.nome,
        categoriaSecao: 'habilidade',
      })),
    ];
    const vistos = new Set();
    return todos.filter((item) => {
      const chave = (item.nome || '').trim().toLowerCase();
      if (!chave || vistos.has(chave)) return false;
      vistos.add(chave);
      return true;
    });
  }, []);

  const opcoesFiltroTipo = [
    { valor: 'Poder Geral', label: 'Poderes Gerais' },
    { valor: 'Poder Paranormal', label: 'Poderes Paranormais' },
    { valor: 'Combatente', label: 'Combatente' },
    { valor: 'Especialista', label: 'Especialista' },
    { valor: 'Ocultista', label: 'Ocultista' },
    { valor: 'Sobrevivente', label: 'Sobrevivente' },
    { valor: 'Trilhas', label: 'Poderes de Trilhas' },
    { valor: 'Origens', label: 'Poderes de Origem' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <button className="btn ghost" onClick={() => setAEscolher((v) => !v)}>Do catálogo</button>
        <button className="btn ghost" onClick={() => adicionar({ ...novaHabilidade(), tipo: 'habilidade', origem: 'Habilidade' })}>+ Nova Habilidade</button>
        <button className="btn" onClick={() => adicionar({ ...novaHabilidade(), tipo: 'poder', origem: 'Poder' })}>+ Novo Poder</button>
      </div>

      {aEscolher && (
        <Seletor
          titulo={`Habilidades e Poderes (${catalogo.length})`}
          itens={catalogo}
          filtros={[
            {
              id: 'grupoTipo',
              label: 'Todos os tipos',
              valorDe: (i) => i.grupoTipo,
              opcoes: opcoesFiltroTipo,
            },
          ]}
          aoProcurar={(i, t) =>
            i.nome.toLowerCase().includes(t) ||
            (i.descricao || '').toLowerCase().includes(t) ||
            (i.classe || '').toLowerCase().includes(t) ||
            (i.trilha || '').toLowerCase().includes(t) ||
            (i.origem || '').toLowerCase().includes(t)
          }
          render={(p) => (
            <>
              <b style={{ fontSize: '18px' }}>{p.nome}</b>
              <span className="meta">
                {[p.tipo, p.classe, p.trilha, p.origem, p.elemento, p.prerequisito].filter(Boolean).join(' · ')}
              </span>
              <span className="corte">{p.descricao}</span>
            </>
          )}
          onEscolher={(p) => {
            adicionar({ nome: p.nome, descricao: p.descricao, origem: p.tipo, tipo: p.categoriaSecao || 'poder' });
            setAEscolher(false);
          }}
          onFechar={() => setAEscolher(false)}
        />
      )}

      {/* SEÇÃO 1: HABILIDADES */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--display)', color: 'var(--txt)', borderBottom: '1px solid var(--borda)', paddingBottom: 6, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Habilidades</span>
          <span className="pill" style={{ fontSize: 11 }}>{automaticasHabilidades.length + listaHabilidades.length}</span>
        </div>

        {automaticasHabilidades.length === 0 && listaHabilidades.length === 0 ? (
          <div className="painel-vazio" style={{ padding: 14 }}>Sem habilidades nesta secção</div>
        ) : (
          <div className="lista-blocos">
            {automaticasHabilidades.map((h, i) => (
              <div className="bloco" key={'autohab' + i}>
                <div className="topo"><b style={{ fontSize: '18px' }}>{h.nome}</b><span className="pill">{h.fonte}{h.nex ? ` · NEX ${h.nex}%` : ''}</span></div>
                <TextoExpandivel texto={h.descricao} />
              </div>
            ))}
            {listaHabilidades.map((h) => (
              <div className="bloco" key={'manhab' + h.indiceOriginal}>
                <div className="topo">
                  <input type="text" placeholder="Nome da habilidade" value={h.nome} onChange={(e) => editar(h.indiceOriginal, { nome: e.target.value })} style={{ fontSize: '18px', fontWeight: 'bold' }} />
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span className="pill">{h.origem || 'Habilidade'}</span>
                    <button className="btn sm danger" onClick={() => remover(h.indiceOriginal)}>Remover</button>
                  </div>
                </div>
                <div className="campo"><textarea placeholder="Descrição da habilidade" value={h.descricao} onChange={(e) => editar(h.indiceOriginal, { descricao: e.target.value })} /></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEÇÃO 2: PODERES */}
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--display)', color: 'var(--sangue-claro)', borderBottom: '1px solid rgba(239,68,68,0.2)', paddingBottom: 6, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Poderes</span>
          <span className="pill" style={{ fontSize: 11, background: 'rgba(239,68,68,0.15)', color: 'var(--sangue-claro)' }}>{automaticasPoderes.length + listaPoderes.length}</span>
        </div>

        {automaticasPoderes.length === 0 && listaPoderes.length === 0 ? (
          <div className="painel-vazio" style={{ padding: 14 }}>Sem poderes nesta secção</div>
        ) : (
          <div className="lista-blocos">
            {automaticasPoderes.map((p, i) => (
              <div className="bloco" key={'autopod' + i}>
                <div className="topo"><b style={{ fontSize: '18px' }}>{p.nome}</b><span className="pill" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#fca5a5' }}>{p.fonte}{p.nex ? ` · NEX ${p.nex}%` : ''}</span></div>
                <TextoExpandivel texto={p.descricao} />
              </div>
            ))}
            {listaPoderes.map((p) => (
              <div className="bloco" key={'manpod' + p.indiceOriginal}>
                <div className="topo">
                  <input type="text" placeholder="Nome do poder" value={p.nome} onChange={(e) => editar(p.indiceOriginal, { nome: e.target.value })} style={{ fontSize: '18px', fontWeight: 'bold' }} />
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span className="pill" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#fca5a5' }}>{p.origem || 'Poder'}</span>
                    <button className="btn sm danger" onClick={() => remover(p.indiceOriginal)}>Remover</button>
                  </div>
                </div>
                <div className="campo"><textarea placeholder="Descrição do poder" value={p.descricao} onChange={(e) => editar(p.indiceOriginal, { descricao: e.target.value })} /></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------- RITUAIS

export function AbaRituais({ personagem, setPersonagem, onRolar }) {
  const { lista, adicionar, editar, remover } = useLista(personagem, setPersonagem, 'rituais');
  const [aEscolher, setAEscolher] = useState(false);
  const [avisoRepetido, setAvisoRepetido] = useState(null);
  // Um ritual vindo do catálogo já traz tudo certo (é conteúdo do livro), por
  // isso mostra-se de consulta com um botão "Editar" ao lado. Só um ritual em
  // branco ("Novo Ritual") é que nasce no formulário — nesse não há nada para
  // ler. `emEdicao` guarda os índices que estão agora abertos.
  const [emEdicao, setEmEdicao] = useState(() => new Set());
  function alternarEdicao(i) {
    setEmEdicao((prev) => { const n = new Set(prev); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  }
  function novoRitualEmBranco() {
    const i = lista.length;
    adicionar(novoRitual());
    setEmEdicao((prev) => new Set(prev).add(i));
  }
  const nex = nexEfetivo(personagem);
  const circuloMax = circuloMaximoPorNex(nex, personagem.classeId);

  const catalogo = RITUAIS;

  // Um ritual não se aprende duas vezes. A comparação é por nome normalizado
  // (sem acentos, sem maiúsculas) e, nos rituais de elemento "variável" — que
  // se escolhem ao aprender, tipo Amaldiçoar Arma — também pelo elemento,
  // porque aí as duas cópias são mesmo rituais diferentes.
  function chaveRitual(r) {
    const nome = String(r?.nome || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const el = String(r?.elemento || '').toLowerCase().trim();
    return el === 'variavel' || r?.elementos?.length > 1 ? `${nome}|${el}` : nome;
  }
  const jaTem = (r) => lista.some((x) => chaveRitual(x) === chaveRitual(r));

  // O interruptor "marcado na pele" (Tatuagem Ritualística) só faz sentido a
  // quem tem o poder — por escolha própria, ou concedido pela Trilha do
  // Monstruoso aos 40%. Não se exige a etapa do dia ativa: senão o jogador
  // perdia a forma de marcar rituais sempre que a desligasse.
  const podeMarcarNaPele = temTatuagemRitualistica(personagem, nex)
    || (classeMonstruosa(personagem) === 'ocultista' && patamarAtual(nex) >= 40);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 14 }}>
        <button className="btn ghost" onClick={() => setAEscolher((v) => !v)}>Do catálogo</button>
        <button className="btn" onClick={novoRitualEmBranco}>Novo Ritual</button>
      </div>

      {aEscolher && (
        <Seletor
          titulo={`Rituais (${catalogo.length})`}
          itens={catalogo}
          filtros={[
            { id: 'elemento', label: 'Todos os elementos', valorDe: (r) => r.elemento, opcoes: ELEMENTOS.map((e) => ({ valor: e.id, label: e.nome })) },
            { id: 'circulo', label: 'Todos os círculos', valorDe: (r) => r.circulo, opcoes: CIRCULOS.map((c) => ({ valor: c.id, label: c.nome })) },
          ]}
          aoProcurar={(r, t) => r.nome.toLowerCase().includes(t) || (r.descricao || '').toLowerCase().includes(t)}
          render={(r) => (
            <>
              <b style={{ fontSize: '18px' }}>
                {r.nome}
                {jaTem(r) && <span className="pill" style={{ marginLeft: 8, fontSize: 10 }}>já aprendido</span>}
              </b>
              <span className="meta">{[r.elemento, `${r.circulo}º círculo`, r.execucao, r.alcance, r.duracao].filter(Boolean).join(' · ')}</span>
              <span className="corte">{r.descricao}</span>
            </>
          )}
          onEscolher={(r) => {
            if (jaTem(r)) { setAvisoRepetido(r.nome); return; }
            setAvisoRepetido(null);
            adicionar(r);
            setAEscolher(false);
          }}
          onFechar={() => setAEscolher(false)}
        />
      )}

      {avisoRepetido && (
        <div className="aviso" style={{ marginBottom: 12 }}>
          <strong>{avisoRepetido}</strong> já está na tua lista — um ritual não se aprende duas vezes.
          <button className="btn ghost sm" style={{ marginLeft: 10 }} onClick={() => setAvisoRepetido(null)}>ok</button>
        </div>
      )}

      {lista.length === 0 ? (
        <div className="painel-vazio">Sem rituais aprendidos</div>
      ) : (
        <div className="lista-blocos">
          {lista.map((r, i) => {
            const marcado = marcadoDoRitual(personagem, r);
            const dtInfo = detalheDtRitual(personagem, r, marcado);
            const ef = efeitosDe(r);
            const cabecalho = (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="pill" title={`DT para resistir a este ritual${dtInfo.bonusTrilha ? ' (já com o +2 de estar marcado na pele)' : ''}`}>
                  DT {dtInfo.total}
                </span>
                {podeMarcarNaPele && (podeSerMarcadoNaPele(personagem, nex, r) || marcado) && (
                  <button
                    type="button"
                    className={'btn sm' + (marcado ? '' : ' ghost')}
                    title={marcado
                      ? 'Marcado na pele — clica para desmarcar'
                      : 'Marcar na pele (Tatuagem Ritualística): −1 PE onde o poder se aplica e +5 em testes de concentração'}
                    onClick={() => setPersonagem({ ...personagem, ...patchEstadoRitual(personagem, r, i, 'marcado', !marcado) })}
                  >
                    {marcado ? '✦ Na pele' : 'Marcar na pele'}
                  </button>
                )}
                <button className="btn ghost sm" onClick={() => alternarEdicao(i)}>
                  {emEdicao.has(i) ? 'Concluir edição' : 'Editar'}
                </button>
                <button className="btn sm danger" onClick={() => remover(i)}>Remover</button>
              </div>
            );

            if (!emEdicao.has(i)) {
              return (
                <div className={'bloco ritual el-' + (r.elemento || 'variavel')} key={i}>
                  <div className="topo">
                    <b style={{ fontSize: '18px' }}>{r.nome || 'Sem nome'}</b>
                    {cabecalho}
                  </div>
                  <div className="arma-stats" style={{ fontSize: '14px' }}>
                    {r.circulo !== '' && r.circulo != null && <span>{r.circulo}º círculo</span>}
                    {r.elemento && <span>{ELEMENTOS.find((e) => e.id === r.elemento)?.nome || r.elemento}</span>}
                    {r.execucao && <span>{r.execucao}</span>}
                    {r.alcance && <span>{r.alcance}</span>}
                    {r.alvo && <span>{r.alvo}</span>}
                    {r.duracao && <span>{r.duracao}</span>}
                    {r.resistencia && <span>resistência: {r.resistencia}</span>}
                  </div>
                  {ef && (
                    <div style={{ fontSize: 13, color: 'var(--sangue-claro)', marginTop: 6 }}>
                      {ef.ativo ? '⚙ Automatizado — o bónus entra na ficha enquanto o ritual estiver Ativo.' : '⚙ Automatizado — o dano é rolado ao conjurar.'}
                      {ef.nota ? ` ${ef.nota}` : ''}
                    </div>
                  )}
                  <TextoExpandivel texto={r.descricao} />
                </div>
              );
            }

            return (
              <div className={'bloco ritual el-' + (r.elemento || 'variavel')} key={i}>
                <div className="topo">
                  <input type="text" placeholder="Nome do ritual" value={r.nome} onChange={(e) => editar(i, { nome: e.target.value })} style={{ fontSize: '18px', fontWeight: 'bold' }} />
                  {cabecalho}
                </div>
                <div className="grelha" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))' }}>
                  <Campo label="Círculo" valor={r.circulo} onChange={(v) => editar(i, { circulo: Number(v) })} tipo="number" />
                  <Campo label="Elemento" valor={r.elemento} onChange={(v) => editar(i, { elemento: v })} opcoes={[{ value: '', label: '—' }, ...ELEMENTOS.map((e) => ({ value: e.id, label: e.nome }))]} />
                  <Campo label="Execução" valor={r.execucao} onChange={(v) => editar(i, { execucao: v })} />
                  <Campo label="Alcance" valor={r.alcance} onChange={(v) => editar(i, { alcance: v })} />
                  <Campo label="Duração" valor={r.duracao} onChange={(v) => editar(i, { duracao: v })} />
                  <Campo label="Resistência" valor={r.resistencia} onChange={(v) => editar(i, { resistencia: v })} />
                </div>
                <div className="campo"><textarea placeholder="Descrição e efeitos do ritual" value={r.descricao} onChange={(e) => editar(i, { descricao: e.target.value })} /></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------ INVENTÁRIO

export function AbaInventario({ personagem, setPersonagem }) {
  const { lista, adicionar, editar, remover } = useLista(personagem, setPersonagem, 'inventario');
  const armas = useLista(personagem, setPersonagem, 'ataques');
  const [aEscolher, setAEscolher] = useState(false);
  const [aEscolherArma, setAEscolherArma] = useState(false);
  const [aEditarArma, setAEditarArma] = useState(null);
  const [aEditarItem, setAEditarItem] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [aEscolherElementoComponente, setAEscolherElementoComponente] = useState(null);
  const [aEscolherQtd, setAEscolherQtd] = useState(null);

  const catalogoArmas = ITENS.filter(ehArma);
  const catalogoItens = ITENS.filter((i) => !ehArma(i));
  const carga = calcCarga(personagem);
  const cats = calcItensPorCategoria(personagem);
  const set = (patch) => setPersonagem({ ...personagem, ...patch });

  function adicionarItemComQtd(i, qtd, nomeOverride) {
    const nome = nomeOverride || i.nome;
    const indiceExistente = lista.findIndex((x) => x.manual !== true && x.nome === nome);
    if (indiceExistente !== -1) {
      editar(indiceExistente, { quantidade: (Number(lista[indiceExistente].quantidade) || 1) + qtd });
    } else {
      adicionar({
        nome,
        categoria: categoriaRomana(i.categoria) ?? '',
        espacos: i.espacos ?? 1,
        cargaBonus: i.cargaBonus ?? 0,
        descricao: i.descricao || '',
        manual: false,
        itemId: i.id,
        tipo: i.tipo || 'geral',
        defesa: i.defesa || 0,
        pericia: i.pericia || '',
        bonus: i.bonus || 0,
        vestido: false,
        quantidade: qtd,
      });
    }
    setAviso(null);
  }

  function ehVestivel(it) {
    const n = String(it.nome || '').toLowerCase();
    const id = String(it.itemId || '').toLowerCase();
    return (
      it.tipo === 'vestimenta' ||
      it.tipo === 'protecao' ||
      Boolean(it.defesa) ||
      Boolean(it.pericia) ||
      id.includes('protecao') ||
      id.includes('escudo') ||
      n.includes('vestimenta') ||
      n.includes('proteção') ||
      n.includes('protecao') ||
      n.includes('escudo') ||
      n.includes('traje') ||
      n.includes('armadura')
    );
  }

  function alternarVestir(i, it) {
    const novoVestido = !it.vestido;
    editar(i, { vestido: novoVestido });

    const nomeNorm = String(it.nome || '').toLowerCase();
    const itemId = String(it.itemId || '').toLowerCase();
    let idProtecao = null;

    if (itemId === 'protecao-leve' || nomeNorm.includes('proteção leve') || nomeNorm.includes('protecao leve')) {
      idProtecao = 'protecao-leve';
    } else if (itemId === 'protecao-pesada' || nomeNorm.includes('proteção pesada') || nomeNorm.includes('protecao pesada')) {
      idProtecao = 'protecao-pesada';
    } else if (itemId === 'escudo' || nomeNorm.includes('escudo')) {
      idProtecao = 'escudo';
    }

    if (idProtecao) {
      const protecoesAtuais = Array.isArray(personagem.protecao) ? personagem.protecao : [];
      let novasProtecoes;
      if (novoVestido) {
        novasProtecoes = [...new Set([...protecoesAtuais, idProtecao])];
      } else {
        novasProtecoes = protecoesAtuais.filter((p) => p !== idProtecao);
      }
      setPersonagem((prev) => ({ ...prev, protecao: novasProtecoes }));
    }
  }

  return (
    <div>
      <div className="painel-patente">
        <div className="campo" style={{ maxWidth: 190, marginBottom: 0 }}>
          <label>Patente</label>
          <select
            value={personagem.patenteId || cats.patente.id}
            onChange={(e) => set({ patenteId: e.target.value, patente: PATENTES_POR_ID[e.target.value]?.nome || '' })}
          >
            {PATENTES.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
        <div className="campo" style={{ maxWidth: 120, marginBottom: 0 }}>
          <label>Prestígio</label>
          <input type="number" value={personagem.pontosPrestigio || 0} onChange={(e) => set({ pontosPrestigio: Number(e.target.value) })} />
        </div>
        <div className="campo" style={{ maxWidth: 130, marginBottom: 0 }}>
          <label>Crédito</label>
          <input type="text" readOnly value={cats.patente.credito} />
        </div>
        <div className="campo" style={{ maxWidth: 280, marginBottom: 0 }}>
          <label>Carga</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="text" readOnly
              className={carga.sobrecarregado ? 'mau' : ''}
              value={`${carga.usados} / ${carga.max}`}
              title={`5 espaços por ponto de Força · máximo absoluto ${carga.limiteAbsoluto}`}
              style={{ width: 90, flexShrink: 0 }}
            />
            <span className="dica" style={{ whiteSpace: 'nowrap' }}>
              {carga.dosItens} em itens · {carga.dasArmas} em armas
              {carga.bonus ? ` · +${carga.bonus} de equipamento` : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="slots">
        {cats.linhas.map((l) => (
          <div key={l.categoria} className={'slot' + (l.usados > l.limite ? ' excedido' : '')}>
            <div className="cat">Categoria {l.categoria}</div>
            <div className="valor">{l.usados} / {l.limite === Infinity ? '∞' : l.limite}</div>
          </div>
        ))}
      </div>

      {carga.sobrecarregado && (
        <div className="aviso">
          <strong>Sobrecarregado:</strong> −5 na Defesa e nas perícias com penalidade de carga, deslocamento −3m.
          {carga.excedido && ' Passaste o dobro do limite: não consegues carregar isto.'}
        </div>
      )}
      {cats.excedeu && (
        <div className="aviso"><strong>Acima da patente:</strong> tens mais itens do que a Ordem te libera nesta missão.</div>
      )}

      <div className="grelha-botoes-inventario">
        <button type="button" className="btn ghost" onClick={() => setAEscolherArma((v) => !v)}>Armas do catálogo</button>
        <button type="button" className="btn" onClick={() => setAEditarArma((v) => (v === 'nova' ? null : 'nova'))}>Nova arma</button>
        <button type="button" className="btn ghost" onClick={() => setAEscolher((v) => !v)}>Itens do catálogo</button>
        <button type="button" className="btn" onClick={() => adicionar({ ...novoItem(), manual: true })}>Novo Item</button>
      </div>

      {aEscolherArma && (
        <Seletor
          titulo={`Armas (${catalogoArmas.length})`}
          itens={catalogoArmas}
          filtros={[
            {
              id: 'grupo',
              label: 'Todos os grupos',
              valorDe: (i) => i.grupo,
              opcoes: [...new Set(catalogoArmas.map((a) => a.grupo).filter(Boolean))].map((g) => ({ valor: g, label: g })),
            },
            {
              id: 'categoria',
              label: 'Todas as categorias',
              valorDe: (i) => categoriaRomana(i.categoria),
              opcoes: CATEGORIAS.map((c) => ({ valor: c, label: `Categoria ${c}` })),
            },
          ]}
          aoProcurar={(i, t) => i.nome.toLowerCase().includes(t) || (i.descricao || '').toLowerCase().includes(t)}
          render={(a) => (
            <>
              <b style={{ fontSize: '18px' }}>{a.nome}</b>
              <span className="meta">
                {[
                  categoriaRomana(a.categoria) ? `Cat. ${categoriaRomana(a.categoria)}` : 'Cat. 0',
                  a.dano ? `Dano ${a.dano}` : null,
                  a.critico && a.critico !== '-' ? `Crítico ${a.critico}` : null,
                  a.tipoDano,
                  a.alcance,
                  a.grupo,
                  a.espacos != null ? `${a.espacos} esp.` : null,
                ].filter(Boolean).join(' · ')}
              </span>
              {a.descricao && <span className="corte">{a.descricao}</span>}
            </>
          )}
          onEscolher={(a) => { armas.adicionar(armaDoItem(a)); setAEscolherArma(false); setAviso(null); }}
          onFechar={() => setAEscolherArma(false)}
        />
      )}

      {aEditarArma !== null && (
        <EditorArma
          arma={aEditarArma === 'nova' ? null : aEditarArma.arma}
          aoFechar={() => setAEditarArma(null)}
          aoGuardar={(nova) => {
            if (aEditarArma === 'nova') armas.adicionar({ equipado: true, ...nova });
            else armas.editar(aEditarArma.indice, nova);
            setAEditarArma(null);
          }}
        />
      )}

      {aEditarItem !== null && (
        <div className="modal-fundo" style={{ zIndex: 100 }}>
          <div className="modal" style={{ maxWidth: 460 }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>Editar Item</h3>
              <button className="fechar" onClick={() => setAEditarItem(null)}>×</button>
            </div>
            <div className="modal-corpo">
              <div className="campo">
                <label>Nome</label>
                <input type="text" value={aEditarItem.item.nome} onChange={(e) => setAEditarItem({ ...aEditarItem, item: { ...aEditarItem.item, nome: e.target.value } })} />
              </div>
              <div className="grelha" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <Campo label="Categoria" valor={aEditarItem.item.categoria} onChange={(v) => setAEditarItem({ ...aEditarItem, item: { ...aEditarItem.item, categoria: v } })}
                  opcoes={[{ value: '', label: '—' }, ...CATEGORIAS.map((c) => ({ value: c, label: c }))]} />
                <Campo label="Espaços" valor={aEditarItem.item.espacos} onChange={(v) => setAEditarItem({ ...aEditarItem, item: { ...aEditarItem.item, espacos: Number(v) } })} tipo="number" />
              </div>
              <div className="grelha" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
                <div className="campo">
                  <label>Perícia Beneficiada (Vestimenta)</label>
                  <select
                    value={aEditarItem.item.pericia || ''}
                    onChange={(e) => setAEditarItem({ ...aEditarItem, item: { ...aEditarItem.item, pericia: e.target.value } })}
                  >
                    <option value="">Nenhuma / Não aplicável</option>
                    {PERICIAS.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                  </select>
                </div>
                <Campo
                  label="Bónus na Perícia"
                  valor={aEditarItem.item.bonus ?? ''}
                  onChange={(v) => setAEditarItem({ ...aEditarItem, item: { ...aEditarItem.item, bonus: Number(v) || 0 } })}
                  tipo="number"
                />
              </div>
              <div className="campo">
                <label>Descrição</label>
                <textarea value={aEditarItem.item.descricao} onChange={(e) => setAEditarItem({ ...aEditarItem, item: { ...aEditarItem.item, descricao: e.target.value } })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button className="btn ghost" onClick={() => setAEditarItem(null)}>Cancelar</button>
                <button className="btn" onClick={() => { editar(aEditarItem.indice, aEditarItem.item); setAEditarItem(null); }}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {aEscolher && (
        <Seletor
          titulo={`Itens (${catalogoItens.length})`}
          itens={catalogoItens}
          filtros={[
            {
              id: 'tipo',
              label: 'Todos os tipos',
              valorDe: (i) => i.tipo,
              opcoes: [
                { valor: 'geral', label: 'Equipamento Geral' },
                { valor: 'protecao', label: 'Proteções' },
                { valor: 'amaldicoado', label: 'Itens Amaldiçoados & Paranormais' },
              ],
            },
            {
              id: 'categoria',
              label: 'Todas as categorias',
              valorDe: (i) => categoriaRomana(i.categoria),
              opcoes: CATEGORIAS.map((c) => ({ valor: c, label: `Categoria ${c}` })),
            },
          ]}
          aoProcurar={(i, t) => i.nome.toLowerCase().includes(t) || (i.descricao || '').toLowerCase().includes(t)}
          render={(i) => (
            <>
              <b style={{ fontSize: '18px' }}>{i.nome}</b>
              <span className="meta">
                {[
                  TIPOS_ITEM.find((t) => t.id === i.tipo)?.nome,
                  categoriaRomana(i.categoria) ? `Cat. ${categoriaRomana(i.categoria)}` : null,
                  i.espacos != null ? `${i.espacos} esp.` : null,
                  i.defesa ? `Defesa +${i.defesa}` : null, i.elemento,
                ].filter(Boolean).join(' · ')}
              </span>
              <span className="corte">{i.descricao}</span>
            </>
          )}
          onEscolher={(i) => {
            setAEscolher(false);
            if (i.id === 'componentes-ritualisticos-de-elemento') {
              setAEscolherElementoComponente(i);
            } else {
              setAEscolherQtd({ item: i, quantidade: 1, nomeOverride: null });
            }
          }}
          onFechar={() => setAEscolher(false)}
        />
      )}

      {aEscolherElementoComponente && (
        <div className="modal-fundo" style={{ zIndex: 100 }} onClick={(e) => e.target === e.currentTarget && setAEscolherElementoComponente(null)}>
          <div className="modal" style={{ maxWidth: 440, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>De que elemento são os Componentes?</h3>
              <button className="fechar" onClick={() => setAEscolherElementoComponente(null)}>×</button>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: 14.5, marginBottom: 24 }}>
                Componentes ritualísticos são específicos de um elemento (Sangue, Morte, Conhecimento ou Energia).
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {ELEMENTOS_MONSTRUOSO.map((el) => (
                  <button
                    key={el} className="btn ghost"
                    style={{ borderColor: COR_ELEMENTO[el], color: COR_ELEMENTO[el], padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    onClick={() => {
                      setAEscolherQtd({ item: aEscolherElementoComponente, quantidade: 1, nomeOverride: `Componentes Ritualísticos de ${el}` });
                      setAEscolherElementoComponente(null);
                    }}
                  >
                    <img src={`/img/sigilo-${el.toLowerCase()}.png`} alt={el} style={{ width: 46, height: 46, objectFit: 'contain', mixBlendMode: 'screen', marginBottom: 8 }} />
                    <strong style={{ fontSize: 15 }}>{el.toUpperCase()}</strong>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {aEscolherQtd && (
        <div className="modal-fundo" style={{ zIndex: 100 }} onClick={(e) => e.target === e.currentTarget && setAEscolherQtd(null)}>
          <div className="modal" style={{ maxWidth: 360, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>
                {aEscolherQtd.nomeOverride || aEscolherQtd.item.nome}
              </h3>
              <button className="fechar" onClick={() => setAEscolherQtd(null)}>×</button>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: 13.5, marginBottom: 16 }}>Quantos queres meter no inventário?</p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <SeletorQuantidade
                  valor={aEscolherQtd.quantidade}
                  onChange={(v) => setAEscolherQtd({ ...aEscolherQtd, quantidade: v })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
                <button className="btn ghost" onClick={() => setAEscolherQtd(null)}>Cancelar</button>
                <button
                  className="btn"
                  onClick={() => {
                    adicionarItemComQtd(aEscolherQtd.item, aEscolherQtd.quantidade, aEscolherQtd.nomeOverride);
                    setAEscolherQtd(null);
                  }}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {aviso && <div className="aviso"><strong>Arma:</strong> {aviso}</div>}

      {armas.lista.length > 0 && (
        <div className="armas-carregadas">
          <div className="rotulo-lista">Armas ({carga.dasArmas} espaços)</div>
          <ul>
            {armas.lista.map((a, i) => {
              const equipado = a.equipado !== false;
              return (
                <li key={i}>
                  <button
                    type="button"
                    className={'ponto botao' + (equipado ? ' equipado' : '')}
                    title={equipado ? 'Equipada — carrega para guardar' : 'Guardada — carrega para equipar'}
                    onClick={() => armas.editar(i, { equipado: !equipado })}
                  />
                  <span className="nome" style={{ fontSize: '18px', fontWeight: 'bold' }}>{a.nome || 'Sem nome'}</span>
                  <span className="estado" style={{ color: 'var(--txt-dim)', fontSize: '13px' }}>{categoriaRomana(a.categoria) ? `CAT. ${categoriaRomana(a.categoria)}` : 'CAT. 0'}</span>
                  <span className="estado">{equipado ? 'equipada' : 'guardada'}</span>
                  <span className="esp">{Number(a.espacos) || 0} esp.</span>
                  <button className="btn ghost sm" onClick={() => setAEditarArma({ indice: i, arma: a })}>Editar</button>
                  <button className="btn danger sm" onClick={() => armas.remover(i)}>Remover</button>
                </li>
              );
            })}
          </ul>
          <div className="dica">Usam-se no separador Combate. Uma arma pesa na carga esteja equipada ou guardada.</div>
        </div>
      )}

      {lista.length === 0 ? (
        <div className="painel-vazio">Inventário vazio</div>
      ) : (
        <div className="lista-blocos">
          <div className="armas-carregadas" style={{ marginTop: 10 }}>
            <div className="rotulo-lista">Itens ({carga.dosItens} espaços)</div>
            <ul>
              {lista.map((it, i) => {
                const ehUltimo = i === lista.length - 1;
                const vestivel = ehVestivel(it);
                return (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '12px 14px', borderBottom: ehUltimo ? 'none' : '1px solid var(--linha)', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 150 }}>
                      <span className="nome" style={{ fontSize: '18px', fontWeight: 'bold' }}>{it.nome || 'Sem nome'}</span>
                      <span className="estado" style={{ color: 'var(--txt-dim)', fontSize: '13px' }}>CAT. {it.categoria || '0'}</span>
                      <span className="esp" style={{ color: 'var(--txt-dim)', fontSize: '13px' }}>{Number(it.espacos) || 0} esp.</span>
                      {it.vestido && (
                        <span className="pill" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', borderColor: 'rgba(34, 197, 94, 0.3)', fontSize: 11 }}>
                          VESTIDO / ATIVO
                        </span>
                      )}
                      {it.pericia && it.vestido && (
                        <span className="pill" style={{ fontSize: 11 }}>
                          +{it.bonus || 2} {it.pericia}
                        </span>
                      )}
                    </div>
                    {it.descricao && (
                      <div style={{ width: '100%' }}>
                        <TextoExpandivel texto={it.descricao} />
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {vestivel && (
                        <button
                          type="button"
                          className={'btn sm' + (it.vestido ? '' : ' ghost')}
                          style={it.vestido ? { background: '#22c55e', borderColor: '#22c55e', color: '#000', fontWeight: 700 } : {}}
                          onClick={() => alternarVestir(i, it)}
                          title={it.vestido ? 'Vestido. Clica para despir.' : 'Despido. Clica para vestir e aplicar os bónus na ficha.'}
                        >
                          {it.vestido ? 'Despir' : 'Vestir'}
                        </button>
                      )}
                      <SeletorQuantidade
                        valor={Number(it.quantidade) || 1}
                        onChange={(v) => editar(i, { quantidade: v })}
                      />
                      <button className="btn ghost sm" onClick={() => setAEditarItem({ indice: i, item: it })}>Editar</button>
                      <button className="btn danger sm" onClick={() => remover(i)}>Remover</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------- DESCRIÇÃO

export function AbaDescricao({ personagem, setPersonagem }) {
  const d = personagem.descricao || {};
  const set = (campo, valor) => setPersonagem({ ...personagem, descricao: { ...d, [campo]: valor } });
  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <EditorTags
          tags={personagem.tags || []}
          onChange={(novasTags) => setPersonagem({ ...personagem, tags: novasTags })}
        />
      </div>
      <div className="campo"><label>Aparência</label><textarea value={d.aparencia || ''} onChange={(e) => set('aparencia', e.target.value)} /></div>
      <div className="campo"><label>Personalidade</label><textarea value={d.personalidade || ''} onChange={(e) => set('personalidade', e.target.value)} /></div>
      <div className="campo"><label>Histórico</label><textarea value={d.historico || ''} onChange={(e) => set('historico', e.target.value)} /></div>
      <div className="campo"><label>Objetivo</label><textarea value={d.objetivo || ''} onChange={(e) => set('objetivo', e.target.value)} /></div>
      <div className="campo"><label>Anotações</label><textarea value={personagem.anotacoes || ''} onChange={(e) => setPersonagem({ ...personagem, anotacoes: e.target.value })} /></div>
    </div>
  );
}
