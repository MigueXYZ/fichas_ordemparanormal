import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORIAS_BUSCA, INDICE_BUSCA, pesquisar } from '../../engine/buscaGlobal.js';

/**
 * Busca Rápida Global (Ctrl+K) — pesquisa instantânea sobre rituais, poderes,
 * perícias, itens e condições, sem precisar de navegar pelas abas. Consulta
 * apenas o conteúdo já indexado a partir dos módulos de dados (ver
 * engine/buscaGlobal.js); não calcula nem altera nada na ficha.
 */
export default function BuscaGlobal({ aoFechar }) {
  const [query, setQuery] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState(null);
  const [selecionado, setSelecionado] = useState(null);
  const [destaque, setDestaque] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const resultados = useMemo(
    () => pesquisar(query, { categoria: categoriaFiltro }),
    [query, categoriaFiltro]
  );

  useEffect(() => {
    setDestaque(0);
  }, [query, categoriaFiltro]);

  const entrada = selecionado ? INDICE_BUSCA.find((l) => l.chave === selecionado) : null;

  function abrir(chave) {
    setSelecionado(chave);
  }

  function voltar() {
    setSelecionado(null);
    inputRef.current?.focus();
  }

  function aoTeclar(e) {
    if (e.key === 'Escape') {
      if (selecionado) { voltar(); } else { aoFechar(); }
      return;
    }
    if (selecionado) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setDestaque((d) => Math.min(d + 1, resultados.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setDestaque((d) => Math.max(d - 1, 0));
    } else if (e.key === 'Enter' && resultados[destaque]) {
      e.preventDefault();
      abrir(resultados[destaque].chave);
    }
  }

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()} onKeyDown={aoTeclar}>
      <div className="modal busca-global">
        <div className="modal-topo">
          {entrada ? (
            <h3 className="guia-combate-titulo">
              <button type="button" className="guia-combate-voltar" onClick={voltar}>‹ Resultados</button>
              {entrada.nome}
            </h3>
          ) : (
            <h3>Busca Rápida <span className="dica-atalho">Ctrl+K</span></h3>
          )}
          <button className="fechar" onClick={aoFechar} aria-label="Fechar"></button>
        </div>

        {!entrada && (
          <div className="busca-global-topo">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar rituais, poderes, perícias, itens, condições…"
              className="busca-global-input"
            />
            <div className="busca-global-categorias">
              <button
                type="button"
                className={'busca-global-chip' + (categoriaFiltro === null ? ' ativa' : '')}
                onClick={() => setCategoriaFiltro(null)}
              >
                Tudo
              </button>
              {CATEGORIAS_BUSCA.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  className={'busca-global-chip' + (categoriaFiltro === c.id ? ' ativa' : '')}
                  onClick={() => setCategoriaFiltro(categoriaFiltro === c.id ? null : c.id)}
                >
                  {c.nome}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="modal-corpo busca-global-corpo">
          {!entrada && !query.trim() && (
            <p className="dica busca-global-vazio">
              Escreve para pesquisar por nome ou por texto — por exemplo "sangue", "abalado" ou "proteção pesada".
            </p>
          )}

          {!entrada && query.trim() && resultados.length === 0 && (
            <p className="dica busca-global-vazio">Sem resultados para "{query.trim()}".</p>
          )}

          {!entrada && resultados.length > 0 && (
            <ul className="busca-global-lista">
              {resultados.map((r, i) => (
                <li key={r.chave}>
                  <button
                    type="button"
                    className={'busca-global-item' + (i === destaque ? ' destaque' : '')}
                    onMouseEnter={() => setDestaque(i)}
                    onClick={() => abrir(r.chave)}
                  >
                    <span className="busca-global-item-topo">
                      <b>{r.nome}</b>
                      <span className={'busca-global-categoria cat-' + r.categoria}>
                        {CATEGORIAS_BUSCA.find((c) => c.id === r.categoria)?.nome}
                      </span>
                    </span>
                    {r.sub && <span className="busca-global-sub">{r.sub}</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {entrada && (
            <div className="busca-global-detalhe">
              <div className="busca-global-detalhe-topo">
                <span className={'busca-global-categoria cat-' + entrada.categoria}>
                  {CATEGORIAS_BUSCA.find((c) => c.id === entrada.categoria)?.nome}
                </span>
                {entrada.sub && <span className="busca-global-sub">{entrada.sub}</span>}
                {entrada.pagina && <span className="pagina">{entrada.pagina}</span>}
              </div>
              {entrada.meta && <p className="busca-global-meta">{entrada.meta}</p>}
              {entrada.descricao && <p className="busca-global-descricao">{entrada.descricao}</p>}
              {entrada.extra && <p className="busca-global-extra">{entrada.extra}</p>}
            </div>
          )}
        </div>

        <div className="modal-acoes">
          <button className="btn" onClick={aoFechar}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
