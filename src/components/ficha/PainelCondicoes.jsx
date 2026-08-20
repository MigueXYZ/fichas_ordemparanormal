import React, { useMemo, useState } from 'react';
import { CONDICOES, CONDICOES_POR_ID, CATEGORIAS_CONDICAO } from '../../data/condicoes.js';

export default function PainelCondicoes({ condicoes = [], aoMudar }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('todas');

  const ativas = useMemo(() => {
    return (condicoes || []).map((id) => CONDICOES_POR_ID[id]).filter(Boolean);
  }, [condicoes]);

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return CONDICOES.filter((c) => {
      const matchCategoria = categoria === 'todas' || c.tipo === categoria;
      const matchBusca = !termo || c.nome.toLowerCase().includes(termo) || c.descricao.toLowerCase().includes(termo);
      return matchCategoria && matchBusca;
    });
  }, [busca, categoria]);

  function alternarCondicao(id) {
    const existe = condicoes.includes(id);
    if (existe) {
      aoMudar(condicoes.filter((c) => c !== id));
    } else {
      aoMudar([...condicoes, id]);
    }
  }

  function limparTodas() {
    aoMudar([]);
  }

  return (
    <div className="painel-condicoes">
      <div className="topo-condicoes">
        <div className="rotulo-condicoes">
          <span>Condições {ativas.length > 0 ? `(${ativas.length})` : ''}</span>
          {ativas.length > 0 && (
            <button
              type="button"
              className="btn-limpar-condicoes"
              onClick={limparTodas}
              title="Remover todas as condições"
            >
              Limpar
            </button>
          )}
        </div>
        <button
          type="button"
          className="btn-add-condicao"
          onClick={() => setModalAberto(true)}
          title="Adicionar ou gerir condições do personagem"
        >
          + Condição
        </button>
      </div>

      {ativas.length === 0 ? (
        <div className="condicoes-vazia">Nenhuma condição ativa.</div>
      ) : (
        <div className="chips-condicoes">
          {ativas.map((c) => (
            <div
              key={c.id}
              className={`chip-condicao tipo-${c.tipo}`}
              title={`${c.nome}: ${c.descricao}`}
            >
              <span className="nome-condicao">{c.nome}</span>
              <button
                type="button"
                className="btn-remover-chip"
                onClick={() => alternarCondicao(c.id)}
                aria-label={`Remover condição ${c.nome}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {modalAberto && (
        <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && setModalAberto(false)}>
          <div className="modal modal-condicoes">
            <div className="modal-topo">
              <h3>Condições do Personagem</h3>
              <button className="fechar" onClick={() => setModalAberto(false)} aria-label="Fechar">✕</button>
            </div>

            <div className="modal-corpo">
              <div className="barra-pesquisa-condicoes">
                <input
                  type="search"
                  placeholder="Procurar condição (ex: Abalado, Desprevenido, Caído)..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="abas-categorias-condicoes">
                {CATEGORIAS_CONDICAO.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`aba-cat ${categoria === cat.id ? 'ativa' : ''}`}
                    onClick={() => setCategoria(cat.id)}
                  >
                    {cat.nome}
                  </button>
                ))}
              </div>

              <div className="lista-selecao-condicoes">
                {filtradas.map((c) => {
                  const ativa = condicoes.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      className={`card-selecao-condicao tipo-${c.tipo} ${ativa ? 'selecionada' : ''}`}
                      onClick={() => alternarCondicao(c.id)}
                    >
                      <div className="cabecalho-card-condicao">
                        <span className="nome">{c.nome}</span>
                        <span className={`tag-tipo tipo-${c.tipo}`}>{c.tipo}</span>
                      </div>
                      <p className="descricao">{c.descricao}</p>
                      <div className="estado-card">
                        {ativa ? <span className="marcado">✓ Ativa (clique para remover)</span> : <span className="desmarcado">+ Clique para aplicar</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modal-acoes" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {ativas.length > 0 && (
                <button type="button" className="btn ghost danger sm" onClick={limparTodas}>
                  Limpar todas ({ativas.length})
                </button>
              )}
              <div style={{ flex: 1 }} />
              <button type="button" className="btn" onClick={() => setModalAberto(false)}>
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
