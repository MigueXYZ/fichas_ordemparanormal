import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TIPOS_DANO } from '../../../engine/danoRecetor.js';
import { prepararAtaques } from '../../../engine/combateAtaques.js';
import { danoNoCombatente, parcelasDeRolagem, resumoDefesasDano } from '../../../engine/campoBatalha.js';
import { rolarTeste } from '../../../engine/dados.js';
import { lerPool } from '../../../engine/fichaLivre.js';
import { calcPericias } from '../../../engine/calc.js';
import FichaLivreCard from '../FichaLivreCard.jsx';
import FichaNpcCard from '../FichaNpcCard.jsx';
import Ficha from '../../ficha/Ficha.jsx';
import tokenPlaceholder from '../../../assets/token-placeholder.png';
import { BarraRecurso, estadoVida } from './pecas.jsx';

const CONDICOES = [
  'Abalado', 'Agarrado', 'Apavorado', 'Asfixiado', 'Atordoado', 'Caído', 'Cego', 'Confuso', 'Debilitado',
  'Desprevenido', 'Enjoado', 'Enlouquecendo', 'Enredado', 'Envenenado', 'Exausto', 'Fascinado', 'Fatigado',
  'Fraco', 'Frustrado', 'Imóvel', 'Inconsciente', 'Indefeso', 'Lento', 'Morrendo', 'Ofuscado', 'Paralisado',
  'Pasmo', 'Sangrando', 'Surdo', 'Surpreendido', 'Vulnerável',
];
const CONDICOES_RAPIDAS = ['Abalado', 'Apavorado', 'Caído', 'Sangrando', 'Desprevenido', 'Atordoado'];
const NOMES_RECURSO = { pv: 'Pontos de Vida', san: 'Sanidade', pe: 'Pontos de Esforço' };

/** Testes que dá jeito rolar no meio do combate (resistências, Percepção…). */
function testesRapidos(c) {
  const f = c.ficha;
  if (!f) return [];
  if (f.tipo === 'ameaca') {
    const s = f.sentidos || {};
    const t = f.testes || {};
    return [['Percepção', s.percepcao], ['Fortitude', t.fortitude], ['Reflexos', t.reflexos], ['Vontade', t.vontade]]
      .map(([nome, txt]) => ({ nome, pool: lerPool(txt) })).filter((x) => x.pool);
  }
  if (f.fichaLivre) return (f.pericias || []).map((p) => ({ nome: p.nome, pool: { dados: Number(p.dados) || 1, bonus: Number(p.bonus) || 0 } }));
  try {
    const ids = ['fortitude', 'reflexos', 'vontade', 'percepcao', 'luta', 'pontaria'];
    return calcPericias(f).filter((p) => ids.includes(p.id)).map((p) => ({ nome: p.nome, pool: { dados: p.dados, bonus: p.bonus } }));
  } catch { return []; }
}

/**
 * Tudo sobre um combatente, sem sair do Campo de Batalha: vida/SAN/PE,
 * receber dano de um ou mais tipos (com Resistências, Imunidades e
 * Vulnerabilidades — engine/campoBatalha.js → danoNoCombatente), curar,
 * condições com duração, atacar um alvo (o dano já passa pelas defesas do
 * alvo), testes rápidos e, no separador Ficha, a ficha completa.
 */
export default function PainelCombatente({
  c, combatentes, equipas, ehVez, onFechar, onRolar, onAplicarDano, onDefinirRecurso,
  onAdicionarEfeito, onRemoverEfeito, onRolarIniciativa, onMudarLado, onRemover, onAtualizarFicha, registar,
}) {
  const [aba, setAba] = useState('combate');
  const vida = estadoVida(c);
  const tipoTexto = c.codigo ? 'Jogador ligado' : c.tipo === 'agente' ? 'Agente' : c.tipo === 'ameaca' ? (c.ficha?.categoria || 'Ameaça') : 'NPC';
  const peso = c.tipo === 'agente' ? (c.nex ? `NEX ${c.nex}%` : null) : (c.vd ? `VD ${c.vd}` : null);

  useEffect(() => {
    const tecla = (e) => { if (e.key === 'Escape') onFechar(); };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [onFechar]);

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="modal cb-painel" role="dialog" aria-label={c.nome}>
        <div className="cb-painel-topo">
          <span className={`cb-painel-token${vida ? ` ${vida}` : ''}`} style={{ backgroundImage: `url(${c.ficha?.imagem || tokenPlaceholder})` }} />
          <div className="cb-painel-titulo">
            <h3>{c.nome}</h3>
            <div className="cb-painel-sub">
              {[tipoTexto, peso].filter(Boolean).join(' · ')}
              {ehVez && <span className="cb-selo vez">na vez</span>}
              {vida === 'caido' && <span className="cb-selo caido">caído</span>}
              {vida === 'machucado' && <span className="cb-selo machucado">machucado</span>}
            </div>
          </div>
          <div className="cb-painel-numeros">
            <div className="cb-num" title="Defesa"><span>Defesa</span><b>{c.defesa ?? '—'}</b></div>
            <div className="cb-num" title="Iniciativa — clica no dado para rolar">
              <span>Iniciativa</span>
              <b>{c.iniciativa ?? '—'} <button type="button" className="cb-ini-dado" onClick={onRolarIniciativa} title="Rolar iniciativa">🎲</button></b>
            </div>
          </div>
          <button className="fechar" onClick={onFechar} aria-label="Fechar">×</button>
        </div>

        <div className="cb-painel-abas">
          <div className="cb-filtros">
            <button type="button" className={aba === 'combate' ? 'ativo' : ''} onClick={() => setAba('combate')}>Combate</button>
            <button type="button" className={aba === 'ficha' ? 'ativo' : ''} onClick={() => setAba('ficha')}>Ficha completa</button>
          </div>
          <div className="cb-painel-extra">
            <label>Lado
              <select value={c.equipaId} onChange={(e) => onMudarLado(e.target.value)}>
                {equipas.map((eq) => <option key={eq.id} value={eq.id}>{eq.nome}</option>)}
              </select>
            </label>
            <button type="button" className="btn ghost sm" onClick={() => { if (window.confirm(`Tirar ${c.nome} do combate?`)) onRemover(); }}>Tirar do combate</button>
          </div>
        </div>

        <div className="cb-painel-corpo">
          {aba === 'combate' ? (
            <div className="cb-painel-colunas">
              <div className="cb-painel-coluna">
                <Recursos c={c} onDefinir={onDefinirRecurso} />
                <ReceberDano c={c} onAplicar={(r, desc) => onAplicarDano(c.id, r, desc)} onCurar={(n) => onDefinirRecurso(c.id, 'pv', (Number(c.pv?.atual) || 0) + n)} />
                <Condicoes c={c} onAdicionar={onAdicionarEfeito} onRemover={onRemoverEfeito} />
              </div>
              <div className="cb-painel-coluna">
                <Atacar c={c} combatentes={combatentes} equipas={equipas} onRolar={onRolar} onAplicarDano={onAplicarDano} registar={registar} />
                <Testes c={c} onRolar={onRolar} />
              </div>
            </div>
          ) : (
            <FichaNoPainel c={c} onRolar={onRolar} onAtualizarFicha={onAtualizarFicha} />
          )}
        </div>
      </div>
    </div>
  );
}

function Cartao({ titulo, extra, children }) {
  return (
    <section className="cb-cartao-painel">
      <header><h4>{titulo}</h4>{extra}</header>
      {children}
    </section>
  );
}

// ------------------------------------------------------------ recursos

function Recursos({ c, onDefinir }) {
  const recursos = ['pv', 'san', 'pe'].filter((k) => c[k]);
  return (
    <Cartao titulo="Vida e recursos" extra={c.codigo ? <span className="dica" title="A ficha do jogador manda: quando ele mudar os PV lá, o valor daqui acompanha">sincronizado com o jogador</span> : null}>
      {recursos.map((k) => <LinhaRecurso key={k} k={k} r={c[k]} onDefinir={(v) => onDefinir(c.id, k, v)} />)}
    </Cartao>
  );
}

function LinhaRecurso({ k, r, onDefinir }) {
  const [texto, setTexto] = useState(String(r.atual ?? ''));
  useEffect(() => { setTexto(String(r.atual ?? '')); }, [r.atual]);
  const confirmar = () => { if (texto !== '' && Number(texto) !== Number(r.atual)) onDefinir(Number(texto)); else setTexto(String(r.atual ?? '')); };
  return (
    <div className={`cb-recurso ${k}`}>
      <div className="cb-recurso-topo">
        <span>{NOMES_RECURSO[k]}</span>
        <span className="cb-recurso-passos">
          <button type="button" onClick={() => onDefinir(Number(r.atual) - 1)} aria-label={`−1 ${k}`}>−</button>
          <input type="number" value={texto} onChange={(e) => setTexto(e.target.value)} onBlur={confirmar}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }} aria-label={`${NOMES_RECURSO[k]} atuais`} />
          <span className="cb-recurso-max">/ {r.max}</span>
          <button type="button" onClick={() => onDefinir(Number(r.atual) + 1)} aria-label={`+1 ${k}`}>+</button>
        </span>
      </div>
      <BarraRecurso r={r} classe={k} fina />
    </div>
  );
}

// ------------------------------------------------------------ dano

function ReceberDano({ c, onAplicar, onCurar }) {
  const [parcelas, setParcelas] = useState([{ valor: '', tipoId: 'geral' }]);
  const [cura, setCura] = useState('');
  const primeiro = useRef(null);
  const defesas = useMemo(() => resumoDefesasDano(c), [c]);
  const resultado = useMemo(() => danoNoCombatente(c, parcelas), [c, parcelas]);
  const bruto = parcelas.reduce((s, p) => s + (Number(p.valor) || 0), 0);

  const mudar = (i, patch) => setParcelas((ps) => ps.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  function aplicar(e) {
    e.preventDefault();
    if (!bruto) return;
    const desc = parcelas.filter((p) => Number(p.valor)).map((p) => `${p.valor} ${TIPOS_DANO.find((t) => t.id === p.tipoId)?.nome.toLowerCase() || ''}`).join(' + ');
    onAplicar(resultado, desc);
    setParcelas([{ valor: '', tipoId: parcelas[0].tipoId }]);
    primeiro.current?.focus();
  }
  function curar(e) {
    e.preventDefault();
    const n = Number(cura) || 0;
    if (!n) return;
    onCurar(n);
    setCura('');
  }

  const temDefesas = defesas.resistencias.length || defesas.imunidades.length || defesas.vulnerabilidades.length || defesas.imuneMental;
  return (
    <Cartao titulo="Receber dano">
      {temDefesas ? (
        <div className="cb-defesas">
          {defesas.resistencias.length > 0 && <div><span>Resistências</span> {defesas.resistencias.join(' · ')}</div>}
          {defesas.imunidades.length > 0 && <div><span>Imune</span> {defesas.imunidades.join(' · ')}</div>}
          {defesas.vulnerabilidades.length > 0 && <div><span>Vulnerável</span> {defesas.vulnerabilidades.join(' · ')}</div>}
          {defesas.imuneMental && <div><span>Paranormal</span> imune a dano mental</div>}
        </div>
      ) : <p className="dica" style={{ marginTop: 0 }}>Sem resistências na ficha.</p>}
      <form onSubmit={aplicar}>
        {parcelas.map((p, i) => (
          <div key={i} className="cb-parcela">
            <input ref={i === 0 ? primeiro : undefined} type="number" min="0" placeholder="Dano" value={p.valor}
              onChange={(e) => mudar(i, { valor: e.target.value })} aria-label="Quantidade de dano" autoFocus={i === 0} />
            <select value={p.tipoId} onChange={(e) => mudar(i, { tipoId: e.target.value })} aria-label="Tipo de dano">
              {TIPOS_DANO.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
            {parcelas.length > 1 && <button type="button" className="cb-x" onClick={() => setParcelas((ps) => ps.filter((_, j) => j !== i))} aria-label="Tirar esta parcela">×</button>}
          </div>
        ))}
        <button type="button" className="cb-link" onClick={() => setParcelas((ps) => [...ps, { valor: '', tipoId: 'geral' }])}>+ outro tipo de dano</button>
        {bruto > 0 && (
          <div className="cb-previa">
            <div>
              {bruto} de dano → <b>−{resultado.totalLiquidoPv} PV</b>
              {resultado.totalLiquidoSan > 0 && <> e <b>−{resultado.totalLiquidoSan} SAN</b></>}
              <span className="cb-previa-fica"> (fica com {resultado.novoPvAtual} PV{c.san && resultado.totalLiquidoSan > 0 ? `, ${resultado.novoSanAtual} SAN` : ''})</span>
            </div>
            {resultado.notas.length > 0 && <ul>{resultado.notas.map((n, i) => <li key={i}>{n}</li>)}</ul>}
          </div>
        )}
        <button type="submit" className="btn sm cb-aplicar" disabled={!bruto}>Aplicar dano</button>
      </form>
      <form className="cb-cura" onSubmit={curar}>
        <input type="number" min="0" placeholder="PV" value={cura} onChange={(e) => setCura(e.target.value)} aria-label="PV a curar" />
        <button type="submit" className="btn ghost sm" disabled={!Number(cura)}>Curar PV</button>
      </form>
    </Cartao>
  );
}

// ------------------------------------------------------------ condições

function Condicoes({ c, onAdicionar, onRemover }) {
  const [nome, setNome] = useState('');
  const [duracao, setDuracao] = useState('permanente');
  const efeitos = c.efeitos || [];
  const juntar = (n) => { const t = String(n || '').trim(); if (t) { onAdicionar({ nome: t, duracao }); setNome(''); } };
  return (
    <Cartao titulo="Condições e efeitos">
      {efeitos.length > 0 ? (
        <div className="cb-chips grandes">
          {efeitos.map((e) => (
            <span key={e.id} className="cb-chip">
              {e.nome}{e.duracao !== 'permanente' && <em> {e.duracao} rod.</em>}
              <button type="button" onClick={() => onRemover(e.id)} aria-label={`Tirar ${e.nome}`}>×</button>
            </span>
          ))}
        </div>
      ) : <p className="dica" style={{ marginTop: 0 }}>Nenhuma. As com duração acabam sozinhas quando a rodada passa.</p>}
      <div className="cb-chips-rapidas">
        {CONDICOES_RAPIDAS.filter((n) => !efeitos.some((e) => e.nome === n)).map((n) => (
          <button key={n} type="button" onClick={() => juntar(n)}>+ {n}</button>
        ))}
      </div>
      <form className="cb-condicao-form" onSubmit={(e) => { e.preventDefault(); juntar(nome); }}>
        <input type="text" list="cb-condicoes" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Outra condição ou efeito…" aria-label="Condição" />
        <datalist id="cb-condicoes">{CONDICOES.map((n) => <option key={n} value={n} />)}</datalist>
        <select value={duracao} onChange={(e) => setDuracao(e.target.value)} aria-label="Duração">
          <option value="permanente">até tirar</option>
          <option value="1">1 rodada</option>
          <option value="2">2 rodadas</option>
          <option value="3">3 rodadas</option>
          <option value="5">5 rodadas</option>
        </select>
        <button type="submit" className="btn ghost sm" disabled={!nome.trim()}>Juntar</button>
      </form>
    </Cartao>
  );
}

// ------------------------------------------------------------ atacar

function Atacar({ c, combatentes, equipas, onRolar, onAplicarDano, registar }) {
  const ataques = useMemo(() => prepararAtaques({ nome: c.nome, tipo: c.tipo, subtipo: c.subtipo, ficha: c.ficha }), [c.nome, c.tipo, c.subtipo, c.ficha]);
  const outros = combatentes.filter((x) => x.id !== c.id);
  const padrao = (outros.find((x) => x.equipaId !== c.equipaId && estadoVida(x) !== 'caido') || outros[0] || {}).id || '';
  const [alvoId, setAlvoId] = useState(padrao);
  const [resultados, setResultados] = useState({});
  const alvo = combatentes.find((x) => x.id === alvoId) || null;

  function aplicarNoAlvo(dano, descricao) {
    if (!alvo || !dano) return null;
    const r = danoNoCombatente(alvo, parcelasDeRolagem(dano));
    onAplicarDano(alvo.id, r, descricao);
    return r;
  }

  function atacar(item) {
    const { acerto, dano } = item.rolar();
    const acertou = Boolean(alvo && acerto && acerto.total >= Number(alvo.defesa || 10));
    // o dano só aparece se acertou (ou se não há alvo para comparar)
    if (acerto && alvo && !acertou) onRolar({ ...acerto, tipo: 'teste', dano: undefined });
    else if (acerto && dano && !acerto.dano) onRolar({ ...acerto, tipo: 'ataque', dano });
    else if (acerto) onRolar(acerto);
    else if (dano) onRolar(dano);
    if (!alvo || !acerto) { setResultados((a) => ({ ...a, [item.id]: acerto ? `Total ${acerto.total}` : '' })); return; }
    let msg = `${acerto.total} contra Defesa ${alvo.defesa}: ${acertou ? 'acertou' : 'falhou'}${acerto.critico && acertou ? ' — crítico!' : ''}`;
    registar({ tipo: 'evento', texto: `${c.nome} ataca ${alvo.nome} com ${item.nome}: ${msg}` });
    const golpe = acerto.dano || dano;
    if (acertou && golpe) {
      const r = aplicarNoAlvo(golpe, `${item.nome} de ${c.nome}`);
      if (r) msg += ` · −${r.totalLiquidoPv} PV${r.totalLiquidoSan ? `, −${r.totalLiquidoSan} SAN` : ''}${r.totalBruto !== r.totalLiquidoPv + r.totalLiquidoSan ? ` (de ${golpe.total})` : ''}`;
    }
    setResultados((a) => ({ ...a, [item.id]: msg }));
  }

  function soDano(item) {
    const { acerto, dano } = item.rolar();
    const golpe = acerto?.dano || dano;
    if (!golpe) return;
    onRolar(golpe);
    if (!alvo) { setResultados((a) => ({ ...a, [item.id]: `Dano ${golpe.total} (sem alvo)` })); return; }
    const r = aplicarNoAlvo(golpe, `${item.nome} de ${c.nome}`);
    setResultados((a) => ({ ...a, [item.id]: `−${r.totalLiquidoPv} PV em ${alvo.nome}${r.totalLiquidoPv !== golpe.total ? ` (de ${golpe.total})` : ''}` }));
  }

  return (
    <Cartao titulo="Atacar">
      {outros.length > 0 ? (
        <label className="cb-alvo">
          <span>Alvo</span>
          <select value={alvoId} onChange={(e) => setAlvoId(e.target.value)}>
            <option value="">— só rolar —</option>
            {equipas.map((eq) => {
              const doLado = outros.filter((x) => x.equipaId === eq.id);
              if (!doLado.length) return null;
              return (
                <optgroup key={eq.id} label={eq.nome}>
                  {doLado.map((x) => <option key={x.id} value={x.id}>{x.nome} — Def {x.defesa} · {x.pv?.atual}/{x.pv?.max} PV</option>)}
                </optgroup>
              );
            })}
          </select>
        </label>
      ) : <p className="dica" style={{ marginTop: 0 }}>Não há mais ninguém no combate para atacar.</p>}
      {ataques.length === 0 ? (
        <p className="dica">Sem ataques na ficha{c.codigo ? ' (o jogador ataca na ficha dele — as rolagens aparecem no registo)' : ''}.</p>
      ) : (
        <div className="cb-ataques">
          {ataques.map((item) => (
            <div key={item.id} className="cb-ataque">
              <div className="cb-ataque-info">
                <b>{item.nome}</b>
                {item.detalhe && <span>{item.detalhe}</span>}
                {resultados[item.id] && <span className="cb-ataque-res">{resultados[item.id]}</span>}
              </div>
              <div className="cb-ataque-botoes">
                {item.temTeste !== false && <button type="button" className="btn sm" onClick={() => atacar(item)}>Atacar</button>}
                <button type="button" className="btn ghost sm" onClick={() => soDano(item)} title="Rola só o dano e aplica-o ao alvo (acerto dado como certo)">Só dano</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Cartao>
  );
}

// ------------------------------------------------------------ testes

function Testes({ c, onRolar }) {
  const testes = useMemo(() => testesRapidos(c), [c]);
  if (!testes.length) return null;
  return (
    <Cartao titulo="Testes rápidos">
      <div className="cb-testes">
        {testes.map((t) => (
          <button key={t.nome} type="button" onClick={() => onRolar(rolarTeste({ nome: `${c.nome} — ${t.nome}`, dados: t.pool.dados, bonus: t.pool.bonus }))}>
            <span>{t.nome}</span><b>{t.pool.dados}d20{t.pool.bonus >= 0 ? '+' : ''}{t.pool.bonus}</b>
          </button>
        ))}
      </div>
    </Cartao>
  );
}

// ------------------------------------------------------------ ficha

function FichaNoPainel({ c, onRolar, onAtualizarFicha }) {
  const [editando, setEditando] = useState(false);
  const f = c.ficha;
  if (!f) return <p className="dica">Este combatente não tem ficha associada.</p>;
  if (c.codigo) {
    return <p className="dica">A ficha deste jogador está no computador dele. Os PV, SAN e PE daqui acompanham o que ele muda lá, e as rolagens dele aparecem no registo.</p>;
  }
  if (f.fichaLivre || f.tipo === 'ameaca') {
    return (
      <div>
        <div className="cb-ficha-barra">
          {c.tipo === 'ameaca' && <span className="dica">As alterações ficam também na ficha do Bestiário.</span>}
          <button type="button" className={`btn sm ${editando ? '' : 'ghost'}`} onClick={() => setEditando((v) => !v)}>{editando ? 'Concluir edição' : 'Editar ficha'}</button>
        </div>
        <FichaLivreCard f={f} editando={editando} onAtualizar={onAtualizarFicha} onRolar={onRolar} />
      </div>
    );
  }
  if (f.tipo === 'npc') {
    return <FichaNpcCard p={f} aoVerDetalhe={() => {}} editando={false} onAtualizarCampo={(k, v) => onAtualizarFicha({ [k]: v })} aoUploadImagem={(img) => onAtualizarFicha({ imagem: img })} />;
  }
  return <FichaAgente f={f} onRolar={onRolar} onAtualizarFicha={onAtualizarFicha} />;
}

/** A ficha de agente trabalha com atualizações em função (setPersonagem(prev => …)):
 * fica com uma cópia local e grava-a pouco depois de cada alteração. */
function FichaAgente({ f, onRolar, onAtualizarFicha }) {
  const [local, setLocal] = useState(f);
  const primeira = useRef(true);
  useEffect(() => {
    if (primeira.current) { primeira.current = false; return undefined; }
    const t = setTimeout(() => onAtualizarFicha(local), 600);
    return () => clearTimeout(t);
  }, [local]); // eslint-disable-line react-hooks/exhaustive-deps
  return <div className="gerador-editor-completo"><Ficha personagem={local} setPersonagem={setLocal} onRolar={onRolar} /></div>;
}
