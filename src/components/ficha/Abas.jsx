import React, { useState } from 'react';
import { PERICIAS } from '../../data/pericias.js';
import { RITUAIS, ELEMENTOS, CIRCULOS, circuloMaximoPorNex } from '../../data/rituais.js';
import { ITENS, TIPOS_ITEM } from '../../data/itens.js';
import { PODERES } from '../../data/poderes.js';
import { CLASSES_POR_ID, TRILHAS_POR_ID } from '../../data/classes.js';
import { ORIGENS_POR_ID } from '../../data/origens.js';
import { calcCarga, calcItensPorCategoria } from '../../engine/calc.js';
import { PATENTES, PATENTES_POR_ID, CATEGORIAS, categoriaRomana } from '../../data/patentes.js';
import { novoAtaque, novoItem, novaHabilidade, novoRitual } from '../../engine/character.js';
import { rolarExpressao, rolarAtaque, rolarDano } from '../../engine/dados.js';
import { estatisticasArma, interpretarCritico } from '../../engine/armas.js';
import EditorArma from './EditorArma.jsx';
import { calcPericias } from '../../engine/calc.js';
import IconeD20 from '../IconeD20.jsx';
import Seletor from './Seletor.jsx';

function Campo({ label, valor, onChange, tipo = 'text', opcoes }) {
  return (
    <div className="campo">
      <label>{label}</label>
      {opcoes ? (
        <select value={valor} onChange={(e) => onChange(e.target.value)}>
          {opcoes.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input type={tipo} value={valor ?? ''} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function useLista(personagem, setPersonagem, chave) {
  const lista = personagem[chave] || [];
  const setLista = (nova) => setPersonagem({ ...personagem, [chave]: nova });
  return {
    lista,
    adicionar: (item) => setLista([...lista, item]),
    editar: (i, patch) => setLista(lista.map((x, j) => (j === i ? { ...x, ...patch } : x))),
    remover: (i) => setLista(lista.filter((_, j) => j !== i)),
  };
}

// ---------------------------------------------------------------- COMBATE

export function AbaCombate({ personagem, setPersonagem, onRolar }) {
  const { lista, adicionar, editar, remover } = useLista(personagem, setPersonagem, 'ataques');
  const [expr, setExpr] = useState('');
  const [aEscolher, setAEscolher] = useState(false);
  const [aEditar, setAEditar] = useState(null);   // { indice, arma } | 'nova'
  const [acertos, setAcertos] = useState({});     // último ataque por índice
  const armas = ITENS.filter((i) => i.tipo === 'arma' || (i.tipo === 'amaldicoado' && i.subtipo === 'Arma'));

  function rolar() {
    const r = rolarExpressao(expr);
    if (r) onRolar(r);
  }

  function atacar(a, i) {
    const e = estatisticasArma(personagem, a);
    const r = rolarAtaque({ nome: a.nome || 'Ataque', dados: e.dados, bonus: e.bonusAtaque, margem: e.margem });
    setAcertos({ ...acertos, [i]: r });
    onRolar(r);
    // o dano da arma sai logo a seguir, já a contar com as modificações e o crítico
    const d = rolarDano({
      nome: `${a.nome || 'Ataque'} — dano`,
      dano: e.dano, bonus: e.bonusDano, extras: e.extras,
      critico: r.critico, multiplicador: e.multiplicador,
    });
    if (d) setTimeout(() => onRolar(d), 320);
  }

  function danificar(a, i) {
    const e = estatisticasArma(personagem, a);
    const critico = Boolean(acertos[i]?.critico);
    const r = rolarDano({
      nome: `${a.nome || 'Ataque'} — dano`,
      dano: e.dano, bonus: e.bonusDano, extras: e.extras,
      critico, multiplicador: e.multiplicador,
    });
    if (r) onRolar(r);
    else onRolar({ id: String(Math.random()), tipo: 'dano', nome: 'Dano inválido', rolagens: [], bonus: 0, total: 0 });
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          type="text" placeholder="Rolar dados (ex.: 2d20+3)" value={expr}
          onChange={(e) => setExpr(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && rolar()}
          style={{ flex: 1, minWidth: 170 }}
        />
        <button className="btn ghost" onClick={rolar}>Rolar</button>
        <button className="btn ghost" onClick={() => setAEscolher(true)}>Do catálogo</button>
        <button className="btn" onClick={() => setAEditar('nova')}>Nova arma</button>
      </div>

      {aEscolher && (
        <Seletor
          titulo={`Armas (${armas.length})`}
          itens={armas}
          filtros={[{ id: 'grupo', label: 'Todos os grupos', valorDe: (i) => i.grupo, opcoes: [...new Set(armas.map((a) => a.grupo).filter(Boolean))].map((g) => ({ valor: g, label: g })) }]}
          aoProcurar={(i, t) => i.nome.toLowerCase().includes(t) || (i.descricao || '').toLowerCase().includes(t)}
          render={(a) => (
            <>
              <b>{a.nome}</b>
              <span className="meta">{[a.dano, a.critico, a.tipoDano, a.alcance, a.grupo].filter(Boolean).join(' · ')}</span>
            </>
          )}
          onEscolher={(a) => {
            const c = interpretarCritico(a.critico);
            const corpoACorpo = !a.alcance || /corpo/i.test(a.grupo || '');
            adicionar({
              nome: a.nome, pericia: a.pericia || (corpoACorpo ? 'luta' : 'pontaria'), bonus: 0,
              dano: a.dano || '', margem: c.margem, multiplicador: c.multiplicador,
              tipo: a.tipoDano || '', alcance: a.alcance || '', espacos: a.espacos ?? '',
              categoria: a.categoria ?? '', atributoDano: corpoACorpo ? 'for' : '',
              danoExtra: [], modificacoes: [], notas: a.descricao || '',
            });
            setAEscolher(false);
          }}
          onFechar={() => setAEscolher(false)}
        />
      )}

      {aEditar !== null && (
        <EditorArma
          arma={aEditar === 'nova' ? null : aEditar.arma}
          aoFechar={() => setAEditar(null)}
          aoGuardar={(nova) => {
            if (aEditar === 'nova') adicionar(nova);
            else editar(aEditar.indice, nova);
            setAEditar(null);
          }}
        />
      )}

      {lista.length === 0 ? (
        <div className="painel-vazio">Ainda não possuis ataques</div>
      ) : (
        <div className="lista-blocos">
          {lista.map((a, i) => {
            const e = estatisticasArma(personagem, a);
            const acerto = acertos[i];
            return (
              <div className="bloco arma" key={i}>
                <div className="topo">
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    {a.imagem && <div className="miniatura-arma" style={{ backgroundImage: `url(${a.imagem})` }} />}
                    <div>
                    <b>{a.nome || 'Sem nome'}</b>
                    <div className="arma-stats">
                      <span>{e.dados}d20 {e.bonusAtaque >= 0 ? '+' : '−'}{Math.abs(e.bonusAtaque)}</span>
                      <span>{e.dano}{e.bonusDano ? (e.bonusDano > 0 ? ` + ${e.bonusDano}` : ` − ${Math.abs(e.bonusDano)}`) : ''}</span>
                      <span>{e.margem === 20 ? '20' : `${e.margem}–20`} / ×{e.multiplicador}</span>
                      {a.tipo && <span>{a.tipo}</span>}
                      {e.alcance && <span>{e.alcance}</span>}
                      {e.extras.map((x) => <span key={x}>+{x}</span>)}
                    </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <button className="btn sm" onClick={() => atacar(a, i)}>Atacar</button>
                    <button
                      className={'btn sm' + (acerto?.critico ? '' : ' ghost')}
                      disabled={!acerto}
                      title={acerto ? (acerto.critico ? `Crítico: dados ×${e.multiplicador}` : 'Rolar dano normal') : 'Faz primeiro o teste de ataque'}
                      onClick={() => danificar(a, i)}
                    >
                      {acerto?.critico ? `Dano ×${e.multiplicador}` : 'Só dano'}
                    </button>
                    <button className="btn ghost sm" onClick={() => setAEditar({ indice: i, arma: a })}>Editar</button>
                    <button className="btn danger sm" onClick={() => remover(i)}>Remover</button>
                  </div>
                </div>

                {acerto && (
                  <div className={'resultado-ataque' + (acerto.critico ? ' critico' : '')}>
                    Ataque: <b>{acerto.total}</b> ({acerto.dados}d20 [{acerto.rolagens.join(', ')}] → maior {acerto.escolhido}
                    {acerto.bonus ? ` ${acerto.bonus > 0 ? '+' : '−'} ${Math.abs(acerto.bonus)}` : ''})
                    {acerto.critico ? ' · ACERTO CRÍTICO' : ''}
                  </div>
                )}

                {(a.modificacoes || []).length > 0 && (
                  <div className="resumo-mods">
                    {e.mods.lista.map((m) => <span key={m.id} className="pill" title={m.texto}>{m.nome}</span>)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------- HABILIDADES

export function AbaHabilidades({ personagem, setPersonagem }) {
  const { lista, adicionar, editar, remover } = useLista(personagem, setPersonagem, 'habilidades');
  const [aEscolher, setAEscolher] = useState(false);

  const classe = CLASSES_POR_ID[personagem.classeId];
  const trilha = personagem.trilhaId ? TRILHAS_POR_ID[personagem.trilhaId] : null;
  const origem = personagem.origemId === '__custom__' ? personagem.origemCustom : ORIGENS_POR_ID[personagem.origemId];
  const nex = Number(personagem.nex);

  const automaticas = [
    origem?.poder?.nome && { nome: origem.poder.nome, descricao: origem.poder.descricao, fonte: 'Origem' },
    ...(classe?.habilidades || []).filter((h) => !h.nex || Number(h.nex) <= nex).map((h) => ({ ...h, fonte: classe.nome })),
    ...(trilha?.poderes || []).filter((p) => !p.nex || Number(p.nex) <= nex).map((p) => ({ ...p, fonte: trilha.nome })),
  ].filter(Boolean);

  const catalogo = [
    ...PODERES,
    ...(classe?.poderes || []).map((p) => ({ ...p, tipo: 'classe', classe: classe.nome })),
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 14 }}>
        <button className="btn ghost" onClick={() => setAEscolher(true)}>Do catálogo</button>
        <button className="btn" onClick={() => adicionar(novaHabilidade())}>Nova Habilidade</button>
      </div>

      {aEscolher && (
        <Seletor
          titulo={`Poderes (${catalogo.length})`}
          itens={catalogo}
          filtros={[{ id: 'tipo', label: 'Todos os tipos', valorDe: (i) => i.tipo, opcoes: [...new Set(catalogo.map((p) => p.tipo))].map((t) => ({ valor: t, label: t })) }]}
          aoProcurar={(i, t) => i.nome.toLowerCase().includes(t) || (i.descricao || '').toLowerCase().includes(t)}
          render={(p) => (
            <>
              <b>{p.nome}</b>
              <span className="meta">{[p.tipo, p.classe, p.elemento, p.prerequisito].filter(Boolean).join(' · ')}</span>
              <span className="corte">{p.descricao}</span>
            </>
          )}
          onEscolher={(p) => { adicionar({ nome: p.nome, descricao: p.descricao, origem: p.tipo }); setAEscolher(false); }}
          onFechar={() => setAEscolher(false)}
        />
      )}

      {automaticas.length > 0 && (
        <div className="lista-blocos" style={{ marginBottom: 14 }}>
          {automaticas.map((h, i) => (
            <div className="bloco" key={'auto' + i}>
              <div className="topo"><b>{h.nome}</b><span className="pill">{h.fonte}{h.nex ? ` · NEX ${h.nex}%` : ''}</span></div>
              <div style={{ color: 'var(--txt-dim)', fontSize: 13, marginTop: 6 }}>{h.descricao}</div>
            </div>
          ))}
        </div>
      )}

      {lista.length === 0 && automaticas.length === 0 ? (
        <div className="painel-vazio">Ainda não possuis habilidades</div>
      ) : (
        <div className="lista-blocos">
          {lista.map((h, i) => (
            <div className="bloco" key={i}>
              <div className="topo">
                <input type="text" placeholder="Nome da habilidade" value={h.nome} onChange={(e) => editar(i, { nome: e.target.value })} />
                <button className="btn sm danger" onClick={() => remover(i)}>Remover</button>
              </div>
              <div className="campo" style={{ marginTop: 10, marginBottom: 0 }}>
                <textarea placeholder="Descrição" value={h.descricao} onChange={(e) => editar(i, { descricao: e.target.value })} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------- RITUAIS

export function AbaRituais({ personagem, setPersonagem }) {
  const { lista, adicionar, editar, remover } = useLista(personagem, setPersonagem, 'rituais');
  const [aEscolher, setAEscolher] = useState(false);
  const circuloMax = circuloMaximoPorNex(personagem.nex);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
        <div className="campo" style={{ maxWidth: 140, marginBottom: 0 }}>
          <label>DT de ritual</label>
          <input type="number" value={personagem.dtRitual ?? ''} onChange={(e) => setPersonagem({ ...personagem, dtRitual: e.target.value })} />
        </div>
        <span className="pill">Círculo máximo em NEX {personagem.nex}%: {circuloMax}º</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn ghost" onClick={() => setAEscolher(true)}>Do catálogo</button>
          <button className="btn" onClick={() => adicionar(novoRitual())}>Novo Ritual</button>
        </div>
      </div>

      {aEscolher && (
        <Seletor
          titulo={`Rituais (${RITUAIS.length})`}
          itens={RITUAIS}
          filtros={[
            { id: 'circulo', label: 'Todos os círculos', valorDe: (r) => r.circulo, opcoes: CIRCULOS.map((c) => ({ valor: c, label: `${c}º círculo` })) },
            { id: 'elemento', label: 'Todos os elementos', valorDe: (r) => r.elemento, opcoes: ELEMENTOS.map((e) => ({ valor: e.id, label: e.nome })) },
          ]}
          aoProcurar={(r, t) => r.nome.toLowerCase().includes(t) || (r.descricao || '').toLowerCase().includes(t)}
          render={(r) => (
            <>
              <b>{r.nome}</b>
              <span className="meta">{r.elemento} {r.circulo}º · {r.execucao} · {r.alcance}</span>
              <span className="corte">{r.descricao}</span>
            </>
          )}
          onEscolher={(r) => { adicionar({ ...r, custo: r.circulo }); setAEscolher(false); }}
          onFechar={() => setAEscolher(false)}
        />
      )}

      {lista.length === 0 ? (
        <div className="painel-vazio">Ainda não conheces rituais</div>
      ) : (
        <div className="lista-blocos">
          {lista.map((r, i) => (
            <div className="bloco" key={i}>
              <div className="topo">
                <input type="text" placeholder="Nome do ritual" value={r.nome} onChange={(e) => editar(i, { nome: e.target.value })} />
                <button className="btn sm danger" onClick={() => remover(i)}>Remover</button>
              </div>
              <div className="grelha">
                <Campo label="Círculo" valor={r.circulo} onChange={(v) => editar(i, { circulo: Number(v) })} opcoes={CIRCULOS.map((c) => ({ value: c, label: `${c}º` }))} />
                <Campo label="Elemento" valor={r.elemento} onChange={(v) => editar(i, { elemento: v })} opcoes={ELEMENTOS.map((e) => ({ value: e.id, label: e.nome }))} />
                <Campo label="Execução" valor={r.execucao} onChange={(v) => editar(i, { execucao: v })} />
                <Campo label="Alcance" valor={r.alcance} onChange={(v) => editar(i, { alcance: v })} />
                <Campo label="Alvo" valor={r.alvo} onChange={(v) => editar(i, { alvo: v })} />
                <Campo label="Duração" valor={r.duracao} onChange={(v) => editar(i, { duracao: v })} />
                <Campo label="Resistência" valor={r.resistencia} onChange={(v) => editar(i, { resistencia: v })} />
                <Campo label="Custo (PE)" valor={r.custo} onChange={(v) => editar(i, { custo: v })} />
              </div>
              <div className="campo" style={{ marginTop: 10, marginBottom: 0 }}>
                <textarea placeholder="Descrição" value={r.descricao} onChange={(e) => editar(i, { descricao: e.target.value })} />
              </div>
              {(r.discente || r.verdadeiro) && (
                <div style={{ fontSize: 12, color: 'var(--txt-dim)', marginTop: 8 }}>
                  {r.discente && <div><b>Discente ({r.discente.custo}):</b> {r.discente.texto} {r.discente.requer}</div>}
                  {r.verdadeiro && <div><b>Verdadeiro ({r.verdadeiro.custo}):</b> {r.verdadeiro.texto} {r.verdadeiro.requer}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------ INVENTÁRIO

export function AbaInventario({ personagem, setPersonagem }) {
  const { lista, adicionar, editar, remover } = useLista(personagem, setPersonagem, 'inventario');
  const [aEscolher, setAEscolher] = useState(false);
  const carga = calcCarga(personagem);
  const cats = calcItensPorCategoria(personagem);
  const set = (patch) => setPersonagem({ ...personagem, ...patch });

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
        <div className="campo" style={{ maxWidth: 150, marginBottom: 0 }}>
          <label>Carga</label>
          <input
            type="text" readOnly
            className={carga.sobrecarregado ? 'mau' : ''}
            value={`${carga.usados} / ${carga.max}`}
            title={`5 espaços por ponto de Força · máximo absoluto ${carga.limiteAbsoluto}`}
          />
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

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', margin: '14px 0' }}>
        <button className="btn ghost" onClick={() => setAEscolher(true)}>Do catálogo</button>
        <button className="btn" onClick={() => adicionar(novoItem())}>Novo Item</button>
      </div>

      {aEscolher && (
        <Seletor
          titulo={`Itens (${ITENS.length})`}
          itens={ITENS}
          filtros={[
            { id: 'tipo', label: 'Todos os tipos', valorDe: (i) => i.tipo, opcoes: TIPOS_ITEM.map((t) => ({ valor: t.id, label: t.nome })) },
            { id: 'categoria', label: 'Todas as categorias', valorDe: (i) => categoriaRomana(i.categoria), opcoes: CATEGORIAS.map((c) => ({ valor: c, label: `Categoria ${c}` })) },
          ]}
          aoProcurar={(i, t) => i.nome.toLowerCase().includes(t) || (i.descricao || '').toLowerCase().includes(t)}
          render={(i) => (
            <>
              <b>{i.nome}</b>
              <span className="meta">
                {[
                  TIPOS_ITEM.find((t) => t.id === i.tipo)?.nome,
                  categoriaRomana(i.categoria) ? `Cat. ${categoriaRomana(i.categoria)}` : null,
                  i.espacos != null ? `${i.espacos} esp.` : null,
                  i.dano, i.defesa ? `Defesa +${i.defesa}` : null, i.elemento,
                ].filter(Boolean).join(' · ')}
              </span>
              <span className="corte">{i.descricao}</span>
            </>
          )}
          onEscolher={(i) => {
            adicionar({
              nome: i.nome,
              categoria: categoriaRomana(i.categoria) ?? '',
              espacos: i.espacos ?? 1,
              descricao: i.descricao || '',
            });
            setAEscolher(false);
          }}
          onFechar={() => setAEscolher(false)}
        />
      )}

      {lista.length === 0 ? (
        <div className="painel-vazio">Inventário vazio</div>
      ) : (
        <div className="lista-blocos">
          {lista.map((it, i) => (
            <div className="bloco" key={i}>
              <div className="topo">
                <input type="text" placeholder="Nome do item" value={it.nome} onChange={(e) => editar(i, { nome: e.target.value })} />
                <button className="btn sm danger" onClick={() => remover(i)}>Remover</button>
              </div>
              <div className="grelha">
                <Campo label="Categoria" valor={it.categoria} onChange={(v) => editar(i, { categoria: v })}
                  opcoes={[{ value: '', label: '—' }, ...CATEGORIAS.map((c) => ({ value: c, label: c }))]} />
                <Campo label="Espaços" valor={it.espacos} onChange={(v) => editar(i, { espacos: v })} />
              </div>
              {it.descricao && <div className="descricao-item">{it.descricao}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------- DESCRIÇÃO

export function AbaDescricao({ personagem, setPersonagem }) {
  const d = personagem.descricao;
  const set = (campo, valor) => setPersonagem({ ...personagem, descricao: { ...d, [campo]: valor } });
  return (
    <div>
      <div className="campo"><label>Aparência</label><textarea value={d.aparencia} onChange={(e) => set('aparencia', e.target.value)} /></div>
      <div className="campo"><label>Personalidade</label><textarea value={d.personalidade} onChange={(e) => set('personalidade', e.target.value)} /></div>
      <div className="campo"><label>Histórico</label><textarea value={d.historico} onChange={(e) => set('historico', e.target.value)} /></div>
      <div className="campo"><label>Objetivo</label><textarea value={d.objetivo} onChange={(e) => set('objetivo', e.target.value)} /></div>
      <div className="campo"><label>Anotações</label><textarea value={personagem.anotacoes} onChange={(e) => setPersonagem({ ...personagem, anotacoes: e.target.value })} /></div>
    </div>
  );
}
