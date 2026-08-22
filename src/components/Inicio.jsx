import React, { useRef, useState } from 'react';
import { CLASSES_POR_ID } from '../data/classes.js';
import { ORIGENS_POR_ID } from '../data/origens.js';
import { listarAgentes, apagarAgente, apagarVariosAgentes, duplicarAgente, importarJson, guardarAgente } from '../engine/armazenamento.js';
import Geradores from './Geradores.jsx';
import { ELEMENTOS, ORDEM_ELEMENTOS } from '../data/rituais.js';

function descrever(a) {
  if (a.tipo === 'ameaca') return [`VD ${a.vd}`, `Defesa ${a.defesa}`, `${a.pv} PV`].join(' · ');
  const classe = CLASSES_POR_ID[a.classeId]?.nome;
  const origem = a.origemId === '__custom__' ? a.origemCustom?.nome : ORIGENS_POR_ID[a.origemId]?.nome;
  return [origem, classe, `NEX ${a.nex}%`].filter(Boolean).join(' · ');
}

export default function Inicio({ aoCriar, aoAbrir }) {
  const [lista, setLista] = useState(listarAgentes);
  const [erro, setErro] = useState(null);
  const [gerador, setGerador] = useState(false);
  const [modoSelecao, setModoSelecao] = useState(false);
  const [selecionados, setSelecionados] = useState(new Set());
  const [confirmarApagar, setConfirmarApagar] = useState(null); // { tipo: 'individual', agente } | { tipo: 'massa', agentes }
  const ficheiro = useRef(null);

  function recarregar() {
    setLista(listarAgentes());
  }

  async function importar(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErro(null);
    try {
      const novo = await importarJson(f);
      recarregar();
      aoAbrir(novo);
    } catch (err) {
      setErro(err.message);
    } finally {
      e.target.value = '';
    }
  }

  function alternarSelecao(id) {
    setSelecionados((prev) => {
      const novo = new Set(prev);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  }

  function selecionarTodos() {
    setSelecionados(new Set(lista.map((a) => a.id)));
  }

  function desmarcarTodos() {
    setSelecionados(new Set());
  }

  function cancelarSelecao() {
    setSelecionados(new Set());
    setModoSelecao(false);
  }

  function abrirApagarIndividual(e, a) {
    e.stopPropagation();
    setConfirmarApagar({ tipo: 'individual', agente: a });
  }

  function abrirApagarMassa() {
    const agentes = lista.filter((a) => selecionados.has(a.id));
    if (agentes.length === 0) return;
    setConfirmarApagar({ tipo: 'massa', agentes });
  }

  function executarApagar() {
    if (!confirmarApagar) return;
    if (confirmarApagar.tipo === 'individual') {
      apagarAgente(confirmarApagar.agente.id);
      setSelecionados((prev) => {
        const novo = new Set(prev);
        novo.delete(confirmarApagar.agente.id);
        return novo;
      });
    } else if (confirmarApagar.tipo === 'massa') {
      apagarVariosAgentes(confirmarApagar.agentes.map((a) => a.id));
      setSelecionados(new Set());
      setModoSelecao(false);
    }
    setConfirmarApagar(null);
    recarregar();
  }

  return (
    <div className="inicio">
      <div className="roda-sigilos" aria-hidden="true" />
      <div className="assinatura">Claudio</div>
      <h1 className="marca">Ordem<em>Paranormal</em></h1>
      <div className="sub">Ordo Realitas · Ficha de Agente</div>
      <div className="elementos">
        {ORDEM_ELEMENTOS.map((id) => ELEMENTOS.find((e) => e.id === id)).filter(Boolean).map((e) => (
          <span
            key={e.id}
            title={e.nome}
            style={{ color: e.cor, '--sigilo': `url(/img/sigilo-${e.id}.png)` }}
          />
        ))}
      </div>

      {erro && <div className="aviso"><strong>Erro:</strong> {erro}</div>}

      <div className="barra-acoes" style={{ marginTop: 30 }}>
        <button className="btn" onClick={aoCriar}>Criar agente</button>
        <button className="btn ghost" onClick={() => setGerador(true)}>Geradores</button>
        <button className="btn ghost" onClick={() => ficheiro.current?.click()}>Importar .json</button>
        {lista.length > 0 && (
          <button
            className={'btn ghost' + (modoSelecao ? ' ativo' : '')}
            onClick={() => {
              if (modoSelecao) cancelarSelecao();
              else setModoSelecao(true);
            }}
          >
            {modoSelecao ? 'Sair da Seleção' : 'Selecionar'}
          </button>
        )}
        <input ref={ficheiro} type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={importar} />
      </div>

      {modoSelecao && lista.length > 0 && (
        <div className="barra-massa">
          <div className="barra-massa-info">
            <span><b>{selecionados.size}</b> de <b>{lista.length}</b> selecionado(s)</span>
            <button type="button" className="btn ghost sm" onClick={selecionados.size === lista.length ? desmarcarTodos : selecionarTodos}>
              {selecionados.size === lista.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn danger sm"
              disabled={selecionados.size === 0}
              onClick={abrirApagarMassa}
            >
              Apagar Selecionados ({selecionados.size})
            </button>
            <button type="button" className="btn ghost sm" onClick={cancelarSelecao}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {gerador && (
        <Geradores
          aoFechar={() => { setGerador(false); recarregar(); }}
          aoGuardar={(p) => { const g = guardarAgente(p); recarregar(); return g; }}
          aoAbrir={(p) => aoAbrir(p)}
        />
      )}

      <div className="agentes">
        {!modoSelecao && (
          <button className="agente-cartao novo" onClick={aoCriar}>+ Novo agente</button>
        )}

        {lista.map((a) => {
          const estaSelecionado = selecionados.has(a.id);
          return (
            <div
              key={a.id}
              className={'agente-cartao' + (estaSelecionado ? ' selecionado' : '')}
              onClick={() => {
                if (modoSelecao) alternarSelecao(a.id);
                else aoAbrir(a);
              }}
            >
              {modoSelecao && (
                <div
                  className="seletor-check"
                  onClick={(e) => {
                    e.stopPropagation();
                    alternarSelecao(a.id);
                  }}
                >
                  {estaSelecionado ? '✓' : ''}
                </div>
              )}
              <div className="foto" style={a.imagem ? { backgroundImage: `url(${a.imagem})` } : undefined}>
                {!a.imagem && (a.nome?.[0]?.toUpperCase() || '?')}
              </div>
              <div className="info">
                <div className="nome">
                  {a.nome || 'Sem nome'}
                  {a.tipo === 'ameaca' && <span className="pill" style={{ marginLeft: 8 }}>Ameaça</span>}
                  {a.tipo === 'npc' && <span className="pill" style={{ marginLeft: 8 }}>NPC</span>}
                </div>
                <div className="det">{descrever(a)}</div>
                {!modoSelecao && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    <button
                      className="btn ghost sm"
                      onClick={(e) => { e.stopPropagation(); duplicarAgente(a.id); recarregar(); }}
                    >
                      Duplicar
                    </button>
                    <button
                      className="btn danger sm"
                      onClick={(e) => abrirApagarIndividual(e, a)}
                    >
                      Apagar
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {lista.length === 0 && (
        <p style={{ color: 'var(--txt-fraco)', marginTop: 24, fontSize: 14 }}>
          Ainda não há agentes guardados neste browser.
        </p>
      )}

      {confirmarApagar && (
        <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && setConfirmarApagar(null)}>
          <div className="modal" style={{ maxWidth: 440 }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, color: 'var(--sangue-claro)' }}>
                {confirmarApagar.tipo === 'individual' ? 'Apagar Personagem' : `Apagar ${confirmarApagar.agentes.length} Personagens`}
              </h3>
              <button className="fechar" onClick={() => setConfirmarApagar(null)}>×</button>
            </div>
            <div className="modal-corpo">
              {confirmarApagar.tipo === 'individual' ? (
                <p style={{ margin: '0 0 12px', fontSize: '15px', lineHeight: '1.5' }}>
                  Tens a certeza de que desejas apagar <b>{confirmarApagar.agente.nome || 'Sem nome'}</b>?
                </p>
              ) : (
                <>
                  <p style={{ margin: '0 0 12px', fontSize: '15px', lineHeight: '1.5' }}>
                    Tens a certeza de que desejas apagar os seguintes <b>{confirmarApagar.agentes.length}</b> personagens?
                  </p>
                  <ul style={{ maxHeight: 140, overflowY: 'auto', paddingLeft: 20, margin: '8px 0 14px', fontSize: '14px', color: 'var(--txt-dim)' }}>
                    {confirmarApagar.agentes.map((ag) => (
                      <li key={ag.id} style={{ marginBottom: 4 }}>{ag.nome || 'Sem nome'}</li>
                    ))}
                  </ul>
                </>
              )}
              <div className="aviso" style={{ margin: 0, fontSize: '13px' }}>
                <strong>Atenção:</strong> Esta ação é permanente e não poderá ser desfeita. Os dados serão eliminados deste browser.
              </div>
            </div>
            <div className="modal-acoes">
              <button type="button" className="btn ghost" onClick={() => setConfirmarApagar(null)}>Cancelar</button>
              <button type="button" className="btn danger" onClick={executarApagar} style={{ background: 'var(--sangue)', color: '#fff' }}>
                {confirmarApagar.tipo === 'individual' ? 'Apagar Personagem' : `Apagar (${confirmarApagar.agentes.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
