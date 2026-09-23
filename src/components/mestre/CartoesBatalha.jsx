import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { calcMaximos, calcDefesas } from '../../engine/calc.js';
import { COMPENDIO_AMEACAS, clonarAmeacaOficial } from '../../data/ameacas/index.js';
import Ficha from '../ficha/Ficha.jsx';
import FichaAmeaca from '../ficha/FichaAmeaca.jsx';
import PainelRolagem from '../PainelRolagem.jsx';
import PainelDetalheUnidade from './PainelDetalheUnidade.jsx';

let contadorId = 1;
function novoIdMembro() {
  return `cb-${Date.now()}-${contadorId++}`;
}

function normalizar(texto) {
  return String(texto || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Estado vazio dos dois lados. Vive em memória em ModoMestre.jsx — não é
 * guardado em lado nenhum, fecha-se sozinho quando sais desta aba. */
export function ladosVazios() {
  return {
    ladoA: { nome: 'Lado 1', membros: [] },
    ladoB: { nome: 'Lado 2', membros: [] },
    rodada: 1,
    turnoAtual: null, // instanceId do membro cujo turno é agora
  };
}

function pvDeFicha(ficha, tipo) {
  if (!ficha) return null;
  const max = tipo === 'ameaca' ? (Number(ficha.pv) || 20) : (calcMaximos(ficha)?.pv ?? 20);
  const atual = Number(ficha.pvAtual ?? max);
  const pct = Math.max(0, Math.min(100, Math.round((atual / Math.max(1, max)) * 100)));
  return { atual, max, pct };
}

/** Transforma uma ficha (agente ou ameaça) na forma comum que a caixa de
 * ataque/dano (PainelDetalheUnidade) espera. */
function unidadeDeFicha(ficha, tipo, ladoKey) {
  if (!ficha) return null;
  if (tipo === 'ameaca') {
    const max = Number(ficha.pv) || 20;
    return {
      id: ficha.id,
      nome: ficha.nome,
      tipo: 'ameaca',
      subtipo: ficha.subtipo || 'criatura',
      ficha,
      equipaId: ladoKey,
      pv: { atual: Number(ficha.pvAtual ?? max), max },
      defesa: Number(ficha.defesa || 10),
    };
  }
  const max = calcMaximos(ficha)?.pv ?? 20;
  return {
    id: ficha.id,
    nome: ficha.nome,
    tipo: 'agente',
    subtipo: 'agente',
    ficha,
    equipaId: ladoKey,
    pv: { atual: Number(ficha.pvAtual ?? max), max },
    defesa: Number(calcDefesas(ficha)?.defesa || 10),
  };
}

/** Membros dos dois lados já com a ficha resolvida (ignora membros cuja ficha
 * foi apagada entretanto). */
function membrosResolvidos(estado, agentes, ameacas) {
  const comLado = (ladoKey) => (estado[ladoKey]?.membros || []).map((m) => ({
    ...m,
    ladoKey,
    ficha: (m.tipo === 'ameaca' ? ameacas : agentes).find((x) => x.id === m.id),
  }));
  return [...comLado('ladoA'), ...comLado('ladoB')].filter((m) => m.ficha);
}

/** Ordem de turnos: iniciativa mais alta primeiro, quem não tem iniciativa
 * numerada fica sempre no fim. */
function ordemTurnos(estado, agentes, ameacas) {
  const membros = membrosResolvidos(estado, agentes, ameacas);
  return [...membros].sort((a, b) => {
    const ai = a.iniciativa === null || a.iniciativa === undefined || a.iniciativa === '' ? -Infinity : Number(a.iniciativa);
    const bi = b.iniciativa === null || b.iniciativa === undefined || b.iniciativa === '' ? -Infinity : Number(b.iniciativa);
    return bi - ai;
  });
}

/**
 * Vista simples para a mesa: cartões de um lado, cartões do outro, com o
 * avatar como fundo do cartão, e um contador de iniciativa em cima
 * (numerada à mão). Carregar num cartão abre a caixa de atacar/dar dano —
 * rolar ataques, aplicar dano ao alvo escolhido — e de lá dá para abrir a
 * ficha a sério para editar. Tudo grava sozinho, tal como o resto da app.
 */
export default function CartoesBatalha({ agentes = [], ameacas = [], lados, setLados, aoGuardar }) {
  const estado = lados || ladosVazios();

  const [aAdicionar, setAAdicionar] = useState(null); // 'ladoA' | 'ladoB' | null
  const [detalhe, setDetalhe] = useState(null); // { ladoKey, tipo, id } — caixa de atacar/dar dano
  const [editorAberto, setEditorAberto] = useState(null); // { tipo, id } — ficha completa
  const [fichaEmEdicao, setFichaEmEdicao] = useState(null);
  const [rolagens, setRolagens] = useState([]);

  const onRolar = useCallback((r) => {
    if (!r) return;
    setRolagens((antes) => [...antes.slice(-9), r]);
  }, []);
  const fecharRolagem = useCallback((id) => setRolagens((a) => a.filter((r) => r.id !== id)), []);
  const limparRolagens = useCallback(() => setRolagens([]), []);

  // Grava sozinho, 800ms depois da última alteração — o mesmo esquema que a
  // ficha normal usa (ver App.jsx). Só grava fichas que já existiam (agente
  // guardado ou item do Bestiário); esta vista nunca cria fichas novas.
  useEffect(() => {
    if (!fichaEmEdicao) return undefined;
    const t = setTimeout(() => { aoGuardar(fichaEmEdicao); }, 800);
    return () => clearTimeout(t);
  }, [fichaEmEdicao, aoGuardar]);

  function abrirCartao(ladoKey, tipo, id) {
    setDetalhe({ ladoKey, tipo, id });
  }

  function abrirEditor(tipo, id) {
    const lista = tipo === 'ameaca' ? ameacas : agentes;
    const ficha = lista.find((x) => x.id === id);
    if (!ficha) return;
    setFichaEmEdicao(ficha);
    setEditorAberto({ tipo, id });
    setDetalhe(null);
  }

  function fecharEditor() {
    setEditorAberto(null);
    setFichaEmEdicao(null);
  }

  function aplicarDano(alvoId, quantidade) {
    const ehAmeaca = ameacas.some((a) => a.id === alvoId);
    const ficha = (ehAmeaca ? ameacas : agentes).find((a) => a.id === alvoId);
    if (!ficha) return;
    const max = ehAmeaca ? (Number(ficha.pv) || 20) : (calcMaximos(ficha)?.pv ?? 20);
    const atual = Number(ficha.pvAtual ?? max);
    const novo = Math.max(0, atual - quantidade);
    aoGuardar({ ...ficha, pvAtual: novo });
  }

  function adicionar(ladoKey, tipo, id) {
    setLados((est) => {
      const atual = est || ladosVazios();
      const lado = atual[ladoKey];
      if (lado.membros.some((m) => m.tipo === tipo && m.id === id)) return atual;
      return {
        ...atual,
        [ladoKey]: { ...lado, membros: [...lado.membros, { instanceId: novoIdMembro(), tipo, id, iniciativa: null }] },
      };
    });
    setAAdicionar(null);
  }

  function adicionarDoCatalogo(ladoKey, oficial) {
    const nova = clonarAmeacaOficial(oficial);
    const guardada = aoGuardar(nova);
    adicionar(ladoKey, 'ameaca', guardada.id);
  }

  function remover(ladoKey, instanceId) {
    setLados((est) => {
      const atual = est || ladosVazios();
      const lado = atual[ladoKey];
      return {
        ...atual,
        [ladoKey]: { ...lado, membros: lado.membros.filter((m) => m.instanceId !== instanceId) },
        turnoAtual: atual.turnoAtual === instanceId ? null : atual.turnoAtual,
      };
    });
  }

  function renomear(ladoKey, nome) {
    setLados((est) => {
      const atual = est || ladosVazios();
      return { ...atual, [ladoKey]: { ...atual[ladoKey], nome } };
    });
  }

  function definirIniciativa(instanceId, valorTexto) {
    const valor = valorTexto === '' ? null : Number(valorTexto);
    setLados((est) => {
      const atual = est || ladosVazios();
      const upd = (lado) => ({
        ...lado,
        membros: lado.membros.map((m) => (m.instanceId === instanceId ? { ...m, iniciativa: valor } : m)),
      });
      return { ...atual, ladoA: upd(atual.ladoA), ladoB: upd(atual.ladoB) };
    });
  }

  function avancarTurno() {
    setLados((est) => {
      const atual = est || ladosVazios();
      const ordem = ordemTurnos(atual, agentes, ameacas);
      if (ordem.length === 0) return atual;
      const idxAtual = ordem.findIndex((m) => m.instanceId === atual.turnoAtual);
      const proximoIdx = idxAtual === -1 ? 0 : (idxAtual + 1) % ordem.length;
      const novaRodada = idxAtual !== -1 && proximoIdx === 0 ? (Number(atual.rodada) || 1) + 1 : (Number(atual.rodada) || 1);
      return { ...atual, turnoAtual: ordem[proximoIdx].instanceId, rodada: novaRodada };
    });
  }

  function retrocederTurno() {
    setLados((est) => {
      const atual = est || ladosVazios();
      const ordem = ordemTurnos(atual, agentes, ameacas);
      if (ordem.length === 0) return atual;
      const idxAtual = ordem.findIndex((m) => m.instanceId === atual.turnoAtual);
      const anteriorIdx = idxAtual <= 0 ? ordem.length - 1 : idxAtual - 1;
      const novaRodada = idxAtual === 0 ? Math.max(1, (Number(atual.rodada) || 1) - 1) : (Number(atual.rodada) || 1);
      return { ...atual, turnoAtual: ordem[anteriorIdx].instanceId, rodada: novaRodada };
    });
  }

  return (
    <div>
      <p className="dica" style={{ marginTop: 0 }}>
        Vista rápida para a mesa: põe os agentes de um lado e as ameaças do outro (ou escolhe direto do catálogo
        oficial), carrega num cartão para abrir a caixa de atacar/rolar dano, e de lá dá para abrir a ficha
        completa para editar. Numera a iniciativa à mão na barra de cima. Esta arrumação em si não fica
        guardada: fecha-se quando saíres desta aba.
      </p>

      <BarraIniciativa
        estado={estado}
        agentes={agentes}
        ameacas={ameacas}
        onDefinirIniciativa={definirIniciativa}
        onAvancar={avancarTurno}
        onRetroceder={retrocederTurno}
      />

      <div className="cartoes-batalha-grelha" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {['ladoA', 'ladoB'].map((ladoKey) => (
          <LadoCartoes
            key={ladoKey}
            ladoKey={ladoKey}
            lado={estado[ladoKey]}
            agentes={agentes}
            ameacas={ameacas}
            aAdicionar={aAdicionar === ladoKey}
            onAlternarAdicionar={() => setAAdicionar((v) => (v === ladoKey ? null : ladoKey))}
            onAdicionar={(tipo, id) => adicionar(ladoKey, tipo, id)}
            onAdicionarCatalogo={(oficial) => adicionarDoCatalogo(ladoKey, oficial)}
            onRemover={(instanceId) => remover(ladoKey, instanceId)}
            onRenomear={(nome) => renomear(ladoKey, nome)}
            onAbrirCartao={abrirCartao}
            turnoAtual={estado.turnoAtual}
          />
        ))}
      </div>

      {detalhe && (() => {
        const lista = detalhe.tipo === 'ameaca' ? ameacas : agentes;
        const ficha = lista.find((x) => x.id === detalhe.id);
        if (!ficha) return null;
        const unidade = unidadeDeFicha(ficha, detalhe.tipo, detalhe.ladoKey);
        const alvos = membrosResolvidos(estado, agentes, ameacas)
          .filter((m) => m.ficha.id !== ficha.id)
          .map((m) => {
            const u = unidadeDeFicha(m.ficha, m.tipo, m.ladoKey);
            return { id: u.id, nome: u.nome, defesa: u.defesa, equipaId: u.equipaId };
          });
        return (
          <PainelDetalheUnidade
            unidade={unidade}
            alvos={alvos}
            onFechar={() => setDetalhe(null)}
            onRolar={onRolar}
            onAplicarDano={aplicarDano}
            onEditar={() => abrirEditor(detalhe.tipo, detalhe.id)}
          />
        );
      })()}

      {editorAberto && fichaEmEdicao && (
        <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && fecharEditor()}>
          <div className="modal" style={{ maxWidth: 960, width: '95vw', maxHeight: '92vh', overflowY: 'auto' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>{fichaEmEdicao.nome}</h3>
              <button className="fechar" onClick={fecharEditor}>×</button>
            </div>
            <div className="modal-corpo" style={{ padding: 16 }}>
              {editorAberto.tipo === 'ameaca'
                ? <FichaAmeaca ameaca={fichaEmEdicao} setAmeaca={setFichaEmEdicao} onRolar={onRolar} aoConcluir={fecharEditor} />
                : <Ficha personagem={fichaEmEdicao} setPersonagem={setFichaEmEdicao} onRolar={onRolar} />}
            </div>
          </div>
        </div>
      )}

      <PainelRolagem rolagens={rolagens} aoFechar={fecharRolagem} aoLimpar={limparRolagens} />
    </div>
  );
}

function BarraIniciativa({ estado, agentes, ameacas, onDefinirIniciativa, onAvancar, onRetroceder }) {
  const ordem = useMemo(() => ordemTurnos(estado, agentes, ameacas), [estado, agentes, ameacas]);
  return (
    <div className="painel" style={{ padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontSize: 10, color: 'var(--txt-fraco)', textTransform: 'uppercase', letterSpacing: 1 }}>Rodada</div>
        <div style={{ fontSize: 20, fontFamily: 'var(--display)', fontWeight: 'bold' }}>{estado.rodada || 1}</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button type="button" className="btn ghost sm" onClick={onRetroceder} disabled={ordem.length === 0}>← Anterior</button>
        <button type="button" className="btn sm" onClick={onAvancar} disabled={ordem.length === 0}>Próximo Turno →</button>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
        {ordem.length === 0 && <span className="dica" style={{ fontSize: 12 }}>Sem cartões ainda — a ordem aparece aqui assim que adicionares alguém.</span>}
        {ordem.map((m) => (
          <div
            key={m.instanceId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 8px',
              borderRadius: 6,
              background: estado.turnoAtual === m.instanceId ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)',
              border: estado.turnoAtual === m.instanceId ? '1px solid var(--sangue-claro)' : '1px solid var(--borda)',
            }}
            title={m.ficha.nome}
          >
            <span style={{ fontSize: 12, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {m.ficha.nome}
            </span>
            <input
              type="number"
              value={m.iniciativa ?? ''}
              onChange={(e) => onDefinirIniciativa(m.instanceId, e.target.value)}
              placeholder="Ini"
              style={{ width: 48, fontSize: 12, padding: '1px 4px' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function LadoCartoes({ ladoKey, lado, agentes, ameacas, aAdicionar, onAlternarAdicionar, onAdicionar, onAdicionarCatalogo, onRemover, onRenomear, onAbrirCartao, turnoAtual }) {
  const membros = lado?.membros || [];
  const [buscaCatalogo, setBuscaCatalogo] = useState('');

  const resultadosCatalogo = useMemo(() => {
    const termo = normalizar(buscaCatalogo.trim());
    if (termo.length < 2) return [];
    return COMPENDIO_AMEACAS.filter((a) => normalizar(a.nome).includes(termo)).slice(0, 30);
  }, [buscaCatalogo]);

  return (
    <div className="painel" style={{ padding: 14, minHeight: 320 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <input
          type="text"
          value={lado?.nome || ''}
          onChange={(e) => onRenomear(e.target.value)}
          style={{ background: 'transparent', border: 'none', fontWeight: 'bold', fontSize: 17, fontFamily: 'var(--display)', flex: 1, color: 'var(--txt)' }}
        />
        <button type="button" className={`btn sm ${aAdicionar ? '' : 'ghost'}`} onClick={onAlternarAdicionar}>
          {aAdicionar ? 'Fechar' : '+ Adicionar'}
        </button>
      </div>

      {aAdicionar && (
        <div style={{ marginBottom: 12, padding: 10, border: '1px solid var(--borda)', borderRadius: 6, background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--txt-fraco)', marginBottom: 4 }}>
            Agentes ({agentes.length})
          </div>
          {agentes.length === 0 && <p className="dica" style={{ fontSize: 12 }}>Nenhuma ficha guardada.</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {agentes.map((a) => (
              <button key={a.id} type="button" className="btn ghost sm" onClick={() => onAdicionar('agente', a.id)}>
                + {a.nome}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--txt-fraco)', marginBottom: 4 }}>
            Bestiário & Ocultistas ({ameacas.length})
          </div>
          {ameacas.length === 0 && <p className="dica" style={{ fontSize: 12 }}>Nada guardado no Bestiário.</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {ameacas.map((a) => (
              <button key={a.id} type="button" className="btn ghost sm" onClick={() => onAdicionar('ameaca', a.id)}>
                + {a.nome}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--txt-fraco)', marginBottom: 4 }}>
            Catálogo Oficial ({COMPENDIO_AMEACAS.length})
          </div>
          <input
            type="text"
            placeholder="Pesquisar no compêndio oficial (mín. 2 letras)…"
            value={buscaCatalogo}
            onChange={(e) => setBuscaCatalogo(e.target.value)}
            style={{ width: '100%', marginBottom: 6 }}
          />
          {buscaCatalogo.trim().length >= 2 && (
            resultadosCatalogo.length === 0 ? (
              <p className="dica" style={{ fontSize: 12 }}>Nada encontrado.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {resultadosCatalogo.map((of) => (
                  <button key={of.id} type="button" className="btn ghost sm" onClick={() => onAdicionarCatalogo(of)}>
                    + {of.nome} <span style={{ opacity: 0.6 }}>(VD {of.vd})</span>
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      )}

      {membros.length === 0 ? (
        <div style={{ border: '2px dashed rgba(255,255,255,0.08)', borderRadius: 6, padding: 30, textAlign: 'center', color: 'var(--txt-fraco)', fontSize: 13 }}>
          Sem cartões ainda — usa "+ Adicionar".
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
          {membros.map((m) => (
            <Cartao
              key={m.instanceId}
              membro={m}
              ficha={(m.tipo === 'ameaca' ? ameacas : agentes).find((x) => x.id === m.id)}
              ativo={turnoAtual === m.instanceId}
              onAbrir={() => onAbrirCartao(ladoKey, m.tipo, m.id)}
              onRemover={() => onRemover(m.instanceId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Cartao({ membro, ficha, ativo, onAbrir, onRemover }) {
  if (!ficha) {
    return (
      <div style={{ padding: 10, border: '1px dashed var(--borda)', borderRadius: 8, fontSize: 12, color: 'var(--txt-fraco)' }}>
        (ficha apagada)
        <button type="button" className="btn ghost sm" style={{ marginTop: 6, width: '100%' }} onClick={onRemover}>Remover</button>
      </div>
    );
  }

  const pv = pvDeFicha(ficha, membro.tipo);
  const rotulo = membro.tipo === 'ameaca' ? `VD ${ficha.vd ?? '—'}` : `NEX ${ficha.nex ?? '—'}%`;

  return (
    <div
      onClick={onAbrir}
      style={{
        position: 'relative',
        aspectRatio: '3 / 4',
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'pointer',
        background: ficha.imagem ? `#111 url(${ficha.imagem}) center / cover no-repeat` : 'rgba(255,255,255,0.04)',
        border: ativo ? '2px solid var(--sangue-claro)' : '1px solid var(--borda)',
        boxShadow: ativo ? '0 0 10px rgba(239, 68, 68, 0.35)' : 'none',
      }}
      title="Atacar / rolar dano"
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemover(); }}
        style={{
          position: 'absolute', top: 4, right: 4, width: 20, height: 20, lineHeight: '18px',
          borderRadius: '50%', background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none',
          cursor: 'pointer', fontSize: 13, padding: 0,
        }}
        title="Remover deste lado"
      >
        ×
      </button>

      {membro.iniciativa !== null && membro.iniciativa !== undefined && (
        <div
          style={{
            position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.6)', color: '#fff',
            fontSize: 11, fontWeight: 'bold', borderRadius: 4, padding: '1px 6px',
          }}
        >
          {membro.iniciativa}
        </div>
      )}

      {!ficha.imagem && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--txt-fraco)', padding: 8, textAlign: 'center' }}>
          Sem imagem
        </div>
      )}

      <div
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          padding: '18px 8px 8px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.05))',
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: 13, color: '#fff', lineHeight: 1.2 }}>{ficha.nome}</div>
        <div style={{ fontSize: 10, color: '#ccc', marginTop: 2 }}>{rotulo}</div>
        {pv && (
          <>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.25)', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pv.pct}%`, background: pv.pct > 50 ? '#22c55e' : pv.pct > 25 ? '#eab308' : '#ef4444' }} />
            </div>
            <div style={{ fontSize: 10, color: '#ccc', marginTop: 2 }}>{pv.atual}/{pv.max} PV</div>
          </>
        )}
      </div>
    </div>
  );
}
