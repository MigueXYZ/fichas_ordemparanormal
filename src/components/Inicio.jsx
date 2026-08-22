import React, { useRef, useState, useMemo } from 'react';
import { CLASSES_POR_ID, TRILHAS_POR_ID } from '../data/classes.js';
import { ORIGENS_POR_ID } from '../data/origens.js';
import { listarAgentes, apagarAgente, apagarVariosAgentes, duplicarAgente, importarJson, guardarAgente } from '../engine/armazenamento.js';
import Geradores from './Geradores.jsx';
import EditorTags from './EditorTags.jsx';
import { IconeCopiar, IconeLixo, IconeTag } from './Icones.jsx';
import { ELEMENTOS, ORDEM_ELEMENTOS } from '../data/rituais.js';

function descrever(a) {
  if (a.tipo === 'ameaca') return [`VD ${a.vd}`, `Defesa ${a.defesa}`, `${a.pv} PV`].join(' · ');
  const classe = CLASSES_POR_ID[a.classeId]?.nome;
  const origem = a.origemId === '__custom__' ? a.origemCustom?.nome : ORIGENS_POR_ID[a.origemId]?.nome;
  return [origem, classe, `NEX ${a.nex}%`].filter(Boolean).join(' · ');
}

function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function Inicio({ aoCriar, aoAbrir }) {
  const [lista, setLista] = useState(listarAgentes);
  const [busca, setBusca] = useState('');
  const [tagSelecionada, setTagSelecionada] = useState(null);
  const [editarTagsAgente, setEditarTagsAgente] = useState(null);
  const [erro, setErro] = useState(null);
  const [gerador, setGerador] = useState(false);
  const [modoSelecao, setModoSelecao] = useState(false);
  const [selecionados, setSelecionados] = useState(new Set());
  const [confirmarApagar, setConfirmarApagar] = useState(null); // { tipo: 'individual', agente } | { tipo: 'massa', agentes }
  const ficheiro = useRef(null);

  function recarregar() {
    setLista(listarAgentes());
  }

  const todasAsTagsComContagem = useMemo(() => {
    const mapa = new Map();
    for (const a of lista) {
      if (Array.isArray(a.tags)) {
        for (const t of a.tags) {
          const limpo = String(t || '').trim();
          if (limpo) {
            mapa.set(limpo, (mapa.get(limpo) || 0) + 1);
          }
        }
      }
    }
    return Array.from(mapa.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt'))
      .map(([nome, contagem]) => ({ nome, contagem }));
  }, [lista]);

  const termoBusca = normalizar(busca.trim());
  const listaFiltrada = lista.filter((a) => {
    if (tagSelecionada) {
      const tagsAgente = Array.isArray(a.tags) ? a.tags.map((t) => t.toLowerCase()) : [];
      if (!tagsAgente.includes(tagSelecionada.toLowerCase())) return false;
    }

    if (!termoBusca) return true;
    const nome = normalizar(a.nome);
    const jogador = normalizar(a.jogador);
    const classe = normalizar(CLASSES_POR_ID[a.classeId]?.nome);
    const trilha = normalizar(TRILHAS_POR_ID[a.trilhaId]?.nome);
    const origem = normalizar(a.origemId === '__custom__' ? a.origemCustom?.nome : ORIGENS_POR_ID[a.origemId]?.nome);
    const nex = `${a.nex}% ${a.nex}`;
    const tipo = normalizar(a.tipo);
    const detalhes = normalizar(descrever(a));
    const tagsTexto = (a.tags || []).map(normalizar).join(' ');
    return (
      nome.includes(termoBusca) ||
      jogador.includes(termoBusca) ||
      classe.includes(termoBusca) ||
      trilha.includes(termoBusca) ||
      origem.includes(termoBusca) ||
      nex.includes(termoBusca) ||
      tipo.includes(termoBusca) ||
      detalhes.includes(termoBusca) ||
      tagsTexto.includes(termoBusca)
    );
  });

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
    setSelecionados(new Set(listaFiltrada.map((a) => a.id)));
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

      {/* Barra de Pesquisa */}
      {lista.length > 0 && (
        <div className="barra-pesquisa-home">
          <span className="icone-lupa" aria-hidden="true">🔍</span>
          <input
            type="text"
            placeholder="Pesquisar por nome, jogador, classe, trilha, tags..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {busca && (
            <button
              type="button"
              className="limpar-pesquisa"
              onClick={() => setBusca('')}
              title="Limpar pesquisa"
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Barra de Filtro de Tags */}
      {lista.length > 0 && todasAsTagsComContagem.length > 0 && (
        <div className="barra-filtro-tags">
          <span className="rotulo-filtro-tags">Tags:</span>
          <div className="lista-filtro-tags">
            <button
              type="button"
              className={'btn-tag-filtro' + (!tagSelecionada ? ' ativo' : '')}
              onClick={() => setTagSelecionada(null)}
            >
              Todas <span className="contagem-tag">({lista.length})</span>
            </button>
            {todasAsTagsComContagem.map(({ nome, contagem }) => (
              <button
                key={nome}
                type="button"
                className={'btn-tag-filtro' + (tagSelecionada?.toLowerCase() === nome.toLowerCase() ? ' ativo' : '')}
                onClick={() => setTagSelecionada((prev) => (prev?.toLowerCase() === nome.toLowerCase() ? null : nome))}
                title={`Filtrar por ${nome}`}
              >
                #{nome} <span className="contagem-tag">({contagem})</span>
              </button>
            ))}
          </div>
          {tagSelecionada && (
            <button
              type="button"
              className="btn-limpar-tag"
              onClick={() => setTagSelecionada(null)}
              title="Remover filtro de tag"
            >
              Filtro ativo: <b>#{tagSelecionada}</b> ×
            </button>
          )}
        </div>
      )}

      {modoSelecao && lista.length > 0 && (
        <div className="barra-massa">
          <div className="barra-massa-info">
            <span>
              <b>{selecionados.size}</b> de <b>{listaFiltrada.length}</b> selecionado(s)
              {(termoBusca || tagSelecionada) && <span style={{ opacity: 0.7, marginLeft: 4 }}>(filtrados de {lista.length})</span>}
            </span>
            <button type="button" className="btn ghost sm" onClick={selecionados.size === listaFiltrada.length ? desmarcarTodos : selecionarTodos}>
              {selecionados.size === listaFiltrada.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
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

        {listaFiltrada.map((a) => {
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

                {/* Chips de tags no cartão */}
                {Array.isArray(a.tags) && a.tags.length > 0 && (
                  <div className="cartao-tags">
                    {a.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className={'cartao-tag-chip' + (tagSelecionada?.toLowerCase() === t.toLowerCase() ? ' ativo' : '')}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTagSelecionada((prev) => (prev?.toLowerCase() === t.toLowerCase() ? null : t));
                        }}
                        title={`Filtrar por tag "${t}"`}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {!modoSelecao && (
                  <div className="cartao-acoes">
                    <button
                      type="button"
                      className="btn-cartao-acao"
                      title="Editar tags"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditarTagsAgente(a);
                      }}
                    >
                      <IconeTag size={14} /> Tags
                    </button>
                    <button
                      type="button"
                      className="btn-cartao-acao btn-cartao-icone"
                      title="Duplicar agente"
                      aria-label="Duplicar agente"
                      onClick={(e) => { e.stopPropagation(); duplicarAgente(a.id); recarregar(); }}
                    >
                      <IconeCopiar size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn-cartao-acao btn-cartao-icone danger"
                      title="Eliminar agente"
                      aria-label="Eliminar agente"
                      onClick={(e) => abrirApagarIndividual(e, a)}
                    >
                      <IconeLixo size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {lista.length > 0 && listaFiltrada.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: 30, color: 'var(--txt-dim)' }}>
          <p style={{ fontSize: 15, marginBottom: 10 }}>
            Nenhum personagem encontrado{busca ? ` para "${busca}"` : ''}{tagSelecionada ? ` com a tag "#${tagSelecionada}"` : ''}.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            {busca && (
              <button type="button" className="btn ghost sm" onClick={() => setBusca('')}>
                Limpar pesquisa
              </button>
            )}
            {tagSelecionada && (
              <button type="button" className="btn ghost sm" onClick={() => setTagSelecionada(null)}>
                Limpar filtro de tag
              </button>
            )}
          </div>
        </div>
      )}

      {lista.length === 0 && (
        <p style={{ color: 'var(--txt-fraco)', marginTop: 24, fontSize: 14 }}>
          Ainda não há agentes guardados neste browser.
        </p>
      )}

      {/* Modal de Edição Rápida de Tags */}
      {editarTagsAgente && (
        <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && setEditarTagsAgente(null)}>
          <div className="modal" style={{ maxWidth: 460 }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 18 }}>
                Tags de <b>{editarTagsAgente.nome || 'Sem nome'}</b>
              </h3>
              <button className="fechar" onClick={() => setEditarTagsAgente(null)}>×</button>
            </div>
            <div className="modal-corpo">
              <EditorTags
                tags={editarTagsAgente.tags || []}
                onChange={(novasTags) => {
                  const atualizado = { ...editarTagsAgente, tags: novasTags };
                  guardarAgente(atualizado);
                  setEditarTagsAgente(atualizado);
                  recarregar();
                }}
              />
            </div>
            <div className="modal-acoes" style={{ marginTop: 20 }}>
              <button type="button" className="btn" onClick={() => setEditarTagsAgente(null)} style={{ width: '100%' }}>
                Concluído
              </button>
            </div>
          </div>
        </div>
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
