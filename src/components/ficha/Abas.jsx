import React, { useState } from 'react';
import { PERICIAS } from '../../data/pericias.js';
import { RITUAIS, ELEMENTOS, CIRCULOS, circuloMaximoPorNex } from '../../data/rituais.js';
import { ITENS, TIPOS_ITEM } from '../../data/itens.js';
import { PODERES } from '../../data/poderes.js';
import { CLASSES_POR_ID, TRILHAS_POR_ID } from '../../data/classes.js';
import { ORIGENS_POR_ID } from '../../data/origens.js';
import { calcCarga, calcItensPorCategoria, nexEfetivo, calcMaximos } from '../../engine/calc.js';
import { PATENTES, PATENTES_POR_ID, CATEGORIAS, categoriaRomana } from '../../data/patentes.js';
import { novoAtaque, novoItem, novaHabilidade, novoRitual } from '../../engine/character.js';
import { rolarExpressao, rolarAtaqueCompleto, rolarDano, rolarTeste } from '../../engine/dados.js';
import { estatisticasArma, interpretarCritico, armaDoItem, ehArma, formulaTeste } from '../../engine/armas.js';
import { precoDoRitual } from '../../engine/rituais.js';
import EditorArma from './EditorArma.jsx';
import { calcPericias } from '../../engine/calc.js';
import IconeD20 from '../IconeD20.jsx';

const NOME_ATRIBUTO = { for: 'Força', agi: 'Agilidade', int: 'Intelecto', pre: 'Presença', vig: 'Vigor' };
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

/**
 * Combate é só para USAR: as armas que já tens e os rituais que já sabes.
 * Adicionar, editar e remover armas faz-se no Inventário.
 */
export function AbaCombate({ personagem, setPersonagem, onRolar }) {
  const { lista, editar } = useLista(personagem, setPersonagem, 'ataques');
  const [expr, setExpr] = useState('');
  const [acertos, setAcertos] = useState({});     // último ataque por índice

  function rolar() {
    const r = rolarExpressao(expr);
    if (r) onRolar(r);
  }

  function atacar(a, i) {
    const e = estatisticasArma(personagem, a);
    // acerto e dano saem juntos, num só cartão com as duas secções
    const r = rolarAtaqueCompleto({
      nome: a.nome || 'Ataque',
      dados: e.dados, bonusAtaque: e.bonusAtaque, margem: e.margem,
      dano: e.dano, bonusDano: e.bonusDano, extras: e.extras, multiplicador: e.multiplicador,
    });
    setAcertos({ ...acertos, [i]: r });
    onRolar(r);
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
      </div>

      {lista.length === 0 ? (
        <div className="painel-vazio">Sem armas. Escolhe-as no separador Inventário.</div>
      ) : (
        <div className="lista-blocos">
          {lista.map((a, i) => {
            const e = estatisticasArma(personagem, a);
            const acerto = acertos[i];
            const equipado = a.equipado !== false;   // fichas antigas não tinham o campo
            return (
              <div className={'bloco arma' + (equipado ? '' : ' guardada')} key={i}>
                <div className="topo">
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    {a.imagem && <div className="miniatura-arma" style={{ backgroundImage: `url(${a.imagem})` }} />}
                    <div>
                    <b>{a.nome || 'Sem nome'}</b>
                    <div className="arma-stats">
                      <span title={`Teste de ${e.pericia.nome} com ${NOME_ATRIBUTO[e.atributoTeste] || ''}${e.dados > 0 ? '' : ' — com o atributo a 0 rolas 2 dados e fica o pior'}`}>
                        {e.pericia.nome}{' '}
                        <span style={{ color: e.dados === 0 ? '#ef4444' : '#22c55e' }}>
                          {e.dados === 0 ? 2 : e.dados}d20
                        </span>
                        {e.bonusAtaque ? (e.bonusAtaque > 0 ? ` +${e.bonusAtaque}` : ` ${e.bonusAtaque}`) : ''}
                      </span>
                      {e.agilAtiva && <span title="Arma ágil: usa Agilidade em vez de Força no ataque e no dano" style={{ opacity: 0.8 }}>ÁGIL</span>}
                      <span title="Dano">{e.dano}{e.bonusDano ? (e.bonusDano > 0 ? ` + ${e.bonusDano}` : ` − ${Math.abs(e.bonusDano)}`) : ''}</span>
                      <span>{e.margem === 20 ? '20' : `${e.margem}–20`} / ×{e.multiplicador}</span>
                      {a.tipo && <span>{a.tipo}</span>}
                      {e.alcance && <span>{e.alcance}</span>}
                      <span title="Ocupa este espaço na carga, esteja na mão ou guardada">{Number(a.espacos) || 0} esp.</span>
                      {e.extras.map((x) => <span key={x}>+{x}</span>)}
                    </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className={'toggle-equipar' + (equipado ? ' equipado' : '')}
                      onClick={() => editar(i, { equipado: !equipado })}
                      title={equipado ? 'Está na mão. Carrega para a guardar.' : 'Está guardada. Carrega para a equipar.'}
                    >
                      <span className="bolinha" />
                      {equipado ? 'Equipada' : 'Guardada'}
                    </button>
                    <button className="btn sm" disabled={!equipado} title={equipado ? '' : 'Equipa a arma primeiro'} onClick={() => atacar(a, i)}>Atacar</button>
                    <button
                      className={'btn sm' + (acerto?.critico ? '' : ' ghost')}
                      disabled={!acerto || !equipado}
                      title={acerto ? (acerto.critico ? `Crítico: dados ×${e.multiplicador}` : 'Rolar dano normal') : 'Faz primeiro o teste de ataque'}
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
                        {acerto.dano.bonus ? ` ${acerto.dano.bonus > 0 ? '+' : '−'} ${Math.abs(acerto.dano.bonus)}` : ''}
                        {acerto.dano.critico ? ` · dados ×${acerto.dano.multiplicador}` : ''})
                      </span>
                    )}
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

      <RituaisEmCombate personagem={personagem} setPersonagem={setPersonagem} onRolar={onRolar} />
    </div>
  );
}

/**
 * Os rituais que o agente já sabe, prontos a conjurar. Conjurar desconta os PE
 * (ou PD) e mostra a DT para quem tiver de resistir. Aprendem-se no separador
 * Rituais — aqui é só para usar.
 */
function RituaisEmCombate({ personagem, setPersonagem, onRolar }) {
  const rituais = personagem.rituais || [];
  if (!rituais.length) return null;

  const max = calcMaximos(personagem);
  const usaPd = max.semSanidade;
  const atual = usaPd ? (personagem.pdAtual ?? max.pd) : (personagem.peAtual ?? max.pe);
  const dt = Number(personagem.dtRitual) || null;

  /**
   * Conjurar custa pontos e cobra ao corpo: fazes um teste de Ocultismo e,
   * se ele não chegar, o Outro Lado leva a sua parte da tua Sanidade.
   *   total < 20 + círculo  ->  −1 de Sanidade
   *   total < 10 + círculo  ->  −1 de Sanidade PERMANENTE (baixa o máximo)
   * Com a regra "Jogando sem Sanidade" isto cai nos Pontos de Determinação.
   */
  function conjurar(r) {
    const custo = Number(String(r.custo).replace(/\D/g, '')) || 0;
    if (custo > atual) return;

    const circulo = Number(r.circulo) || 1;
    const oc = calcPericias(personagem).find((x) => x.id === 'ocultismo') || { dados: 0, bonus: 0 };
    const teste = rolarTeste({ nome: `${r.nome || 'Ritual'} — Ocultismo`, dados: oc.dados, bonus: oc.bonus });

    const { perdeSan, perdePermanente, limiteSan, limitePermanente } = precoDoRitual(teste.total, circulo);

    const campoAtual = usaPd ? 'pdAtual' : 'sanAtual';
    const campoExtra = usaPd ? 'pdExtra' : 'sanExtra';
    const maximoMental = usaPd ? max.pd : max.san;
    const mentalAtual = personagem[campoAtual] ?? maximoMental;

    const patch = { [usaPd ? 'pdAtual' : 'peAtual']: atual - custo };
    if (usaPd) {
      // com PD é tudo o mesmo poço: o custo e a perda saem do mesmo sítio
      let pd = atual - custo;
      if (perdeSan) pd = Math.max(0, pd - 1);
      patch.pdAtual = pd;
      if (perdePermanente) patch.pdExtra = (Number(personagem.pdExtra) || 0) - 1;
    } else {
      if (perdeSan) patch.sanAtual = Math.max(0, mentalAtual - 1);
      if (perdePermanente) {
        patch.sanExtra = (Number(personagem.sanExtra) || 0) - 1;
        patch.sanAtual = Math.max(0, Math.min(patch.sanAtual ?? mentalAtual, maximoMental - 1));
      }
    }
    setPersonagem({ ...personagem, ...patch });

    const nomeMental = usaPd ? 'Determinação' : 'Sanidade';
    const notas = [
      `${custo} ${usaPd ? 'PD' : 'PE'} gastos`,
      dt ? `DT ${dt} para resistir` : null,
      perdePermanente
        ? `falhou por muito (< ${limitePermanente}): −1 de ${nomeMental} e −1 permanente`
        : perdeSan
          ? `abaixo de ${limiteSan}: −1 de ${nomeMental}`
          : `${limiteSan} ou mais: a mente aguentou`,
    ].filter(Boolean);

    onRolar({ ...teste, tipo: 'ritual', nome: r.nome || 'Ritual', detalhe: `${circulo}º círculo`, notas, sofreu: perdeSan });
  }

  return (
    <div className="rituais-combate">
      <div className="rotulo-lista">Rituais · {usaPd ? `${atual} PD` : `${atual} PE`} disponíveis{dt ? ` · DT ${dt}` : ''}</div>
      <div className="lista-blocos">
        {rituais.map((r, i) => {
          const custo = Number(String(r.custo).replace(/\D/g, '')) || 0;
          const circulo = Number(r.circulo) || 1;
          const podeGastar = custo <= atual;
          return (
            <div className={'bloco ritual el-' + (r.elemento || 'variavel')} key={i}>
              <div className="topo">
                <div>
                  <b>{r.nome || 'Sem nome'}</b>
                  <div className="arma-stats">
                    <span>{circulo}º círculo</span>
                    {r.elemento && <span>{r.elemento}</span>}
                    <span>{custo} {usaPd ? 'PD' : 'PE'}</span>
                    <span title="Abaixo disto perdes 1 de Sanidade; abaixo de 10 + círculo, perdes 1 permanente">
                      Ocultismo {20 + circulo} / {10 + circulo}
                    </span>
                    {r.execucao && <span>{r.execucao}</span>}
                    {r.alcance && <span>{r.alcance}</span>}
                    {r.resistencia && <span>resistência: {r.resistencia}</span>}
                  </div>
                </div>
                <button
                  className="btn sm"
                  disabled={!podeGastar}
                  title={podeGastar ? `Gasta ${custo} ${usaPd ? 'PD' : 'PE'} e faz o teste de Ocultismo` : 'Não tens pontos que cheguem'}
                  onClick={() => conjurar(r)}
                >
                  Conjurar
                </button>
              </div>
            </div>
          );
        })}
      </div>
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
  const nex = nexEfetivo(personagem);

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
  const circuloMax = circuloMaximoPorNex(nexEfetivo(personagem));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
        <div className="campo" style={{ maxWidth: 140, marginBottom: 0 }}>
          <label>DT de ritual</label>
          <input type="number" value={personagem.dtRitual ?? ''} onChange={(e) => setPersonagem({ ...personagem, dtRitual: e.target.value })} />
        </div>
        <span className="pill">Círculo máximo em NEX {nexEfetivo(personagem)}%: {circuloMax}º</span>
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
  const armas = useLista(personagem, setPersonagem, 'ataques');
  const [aEscolher, setAEscolher] = useState(false);
  const [aEscolherArma, setAEscolherArma] = useState(false);
  const [aEditarArma, setAEditarArma] = useState(null);   // { indice, arma } | 'nova'
  const [aviso, setAviso] = useState(null);
  const catalogoArmas = ITENS.filter(ehArma);
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
        <div className="campo" style={{ maxWidth: 190, marginBottom: 0 }}>
          <label>Carga</label>
          <input
            type="text" readOnly
            className={carga.sobrecarregado ? 'mau' : ''}
            value={`${carga.usados} / ${carga.max}`}
            title={`5 espaços por ponto de Força · máximo absoluto ${carga.limiteAbsoluto}`}
          />
          <span className="dica">
            {carga.dosItens} em itens · {carga.dasArmas} em armas
            {carga.bonus ? ` · +${carga.bonus} de equipamento` : ''}
          </span>
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

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', margin: '14px 0', flexWrap: 'wrap' }}>
        <button className="btn ghost" onClick={() => setAEscolherArma(true)}>Armas do catálogo</button>
        <button className="btn ghost" onClick={() => setAEditarArma('nova')}>Nova arma</button>
        <span style={{ flex: 1 }} />
        <button className="btn ghost" onClick={() => setAEscolher(true)}>Do catálogo</button>
        <button className="btn" onClick={() => adicionar(novoItem())}>Novo Item</button>
      </div>

      {aEscolherArma && (
        <Seletor
          titulo={`Armas (${catalogoArmas.length})`}
          itens={catalogoArmas}
          filtros={[{ id: 'grupo', label: 'Todos os grupos', valorDe: (i) => i.grupo, opcoes: [...new Set(catalogoArmas.map((a) => a.grupo).filter(Boolean))].map((g) => ({ valor: g, label: g })) }]}
          aoProcurar={(i, t) => i.nome.toLowerCase().includes(t) || (i.descricao || '').toLowerCase().includes(t)}
          render={(a) => (
            <>
              <b>{a.nome}</b>
              <span className="meta">{[a.dano, a.critico, a.tipoDano, a.alcance, a.grupo, a.espacos != null ? `${a.espacos} esp.` : null].filter(Boolean).join(' · ')}</span>
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
            // uma arma vai para a lista de ataques (é lá que se usa), mas continua
            // a contar para a carga como qualquer outro item
            if (ehArma(i)) {
              armas.adicionar(armaDoItem(i));
              setAviso(`${i.nome} foi para o separador Combate, já equipada.`);
            } else {
              adicionar({
                nome: i.nome,
                categoria: categoriaRomana(i.categoria) ?? '',
                espacos: i.espacos ?? 1,
                cargaBonus: i.cargaBonus ?? 0,
                descricao: i.descricao || '',
              });
              setAviso(null);
            }
            setAEscolher(false);
          }}
          onFechar={() => setAEscolher(false)}
        />
      )}

      {aviso && <div className="aviso"><strong>Arma:</strong> {aviso}</div>}

      {(personagem.ataques || []).length > 0 && (
        <div className="armas-carregadas">
          <div className="rotulo-lista">Armas ({carga.dasArmas} espaços)</div>
          <ul>
            {(personagem.ataques || []).map((a, i) => {
              const equipado = a.equipado !== false;
              return (
                <li key={i}>
                  <button
                    type="button"
                    className={'ponto botao' + (equipado ? ' equipado' : '')}
                    title={equipado ? 'Equipada — carrega para guardar' : 'Guardada — carrega para equipar'}
                    onClick={() => armas.editar(i, { equipado: !equipado })}
                  />
                  <span className="nome">{a.nome || 'Sem nome'}</span>
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
