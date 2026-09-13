import React, { useMemo, useState } from 'react';
import {
  COMPENDIO_AMEACAS,
  LIVROS_COMPENDIO,
  CATEGORIAS_COMPENDIO,
  DESCRITORES_COMPENDIO,
  clonarAmeacaOficial,
} from '../../data/ameacas/index.js';

function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/**
 * Compêndio Oficial: todas as ameaças/criaturas dos livros oficiais, prontas
 * a consultar e a clonar para o Bestiário. Isto é só leitura — "Adicionar ao
 * Bestiário" cria uma cópia independente e editável; a entrada aqui nunca
 * muda, por isso o compêndio serve sempre de referência original.
 */
export default function CompendioOficial({ aoGuardar, aoAbrir }) {
  const [busca, setBusca] = useState('');
  const [filtroLivro, setFiltroLivro] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroDescritor, setFiltroDescritor] = useState('');
  const [adicionados, setAdicionados] = useState({});

  const termoBusca = normalizar(busca.trim());
  const listaFiltrada = useMemo(() => {
    return COMPENDIO_AMEACAS
      .filter((a) => {
        if (filtroLivro && a.livro !== filtroLivro) return false;
        if (filtroCategoria && a.categoria !== filtroCategoria) return false;
        if (filtroDescritor && !(a.descritores || []).includes(filtroDescritor)) return false;
        if (!termoBusca) return true;
        const nome = normalizar(a.nome);
        const descritores = normalizar((a.descritores || []).join(' '));
        return nome.includes(termoBusca) || descritores.includes(termoBusca);
      })
      .sort((a, b) => (a.vd || 0) - (b.vd || 0) || String(a.nome).localeCompare(String(b.nome), 'pt'));
  }, [termoBusca, filtroLivro, filtroCategoria, filtroDescritor]);

  function adicionar(oficial) {
    const nova = clonarAmeacaOficial(oficial);
    const guardada = aoGuardar ? aoGuardar(nova) : nova;
    setAdicionados((s) => ({ ...s, [oficial.id]: guardada?.id || nova.id }));
    return guardada || nova;
  }

  function adicionarEAbrir(oficial) {
    const guardada = adicionar(oficial);
    if (aoAbrir) aoAbrir(guardada);
  }

  const semFiltros = !filtroLivro && !filtroCategoria && !filtroDescritor;

  return (
    <div>
      <p className="dica" style={{ marginTop: 0 }}>
        Ameaças oficiais com estatísticas prontas a usar, extraídas dos livros de Ordem Paranormal.
        "Adicionar ao Bestiário" cria uma cópia editável tua — o compêndio em si nunca muda.
      </p>

      <div className="barra-pesquisa-home" style={{ marginTop: 0 }}>
        <input
          type="text"
          placeholder="Pesquisar por nome ou descritor..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        {busca && (
          <button type="button" className="limpar-pesquisa" onClick={() => setBusca('')} title="Limpar pesquisa">×</button>
        )}
      </div>

      <div className="compendio-filtros">
        <select value={filtroLivro} onChange={(e) => setFiltroLivro(e.target.value)}>
          <option value="">Todos os livros</option>
          {LIVROS_COMPENDIO.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
          <option value="">Todas as categorias</option>
          {CATEGORIAS_COMPENDIO.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filtroDescritor} onChange={(e) => setFiltroDescritor(e.target.value)}>
          <option value="">Todos os descritores</option>
          {DESCRITORES_COMPENDIO.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        {!semFiltros && (
          <button
            type="button"
            className="btn ghost sm"
            onClick={() => { setFiltroLivro(''); setFiltroCategoria(''); setFiltroDescritor(''); }}
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="compendio-lista">
        {listaFiltrada.map((a) => (
          <div key={a.id} className="compendio-cartao">
            <div className="nome">
              <span>{a.nome}</span>
              <span className="vd">VD {a.vd}</span>
            </div>
            <div className="det">
              {[a.categoria, a.tamanho, (a.descritores || []).join(' · '), `${a.livro}${a.fonte?.pagina ? `, p.${a.fonte.pagina}` : ''}`]
                .filter(Boolean).join(' · ')}
            </div>
            {a.flavorText && <div className="flavor">{a.flavorText}</div>}
            <div className="acoes-cartao">
              <button type="button" className="btn ghost sm" onClick={() => adicionar(a)}>+ Adicionar ao Bestiário</button>
              <button type="button" className="btn sm" onClick={() => adicionarEAbrir(a)}>Adicionar e Abrir</button>
            </div>
            {adicionados[a.id] && <div className="compendio-adicionado">Adicionado ao teu Bestiário ✓</div>}
          </div>
        ))}
      </div>

      {listaFiltrada.length === 0 && (
        <p style={{ color: 'var(--txt-fraco)', marginTop: 20, fontSize: 14 }}>
          Nenhuma ameaça encontrada{busca ? ` para "${busca}"` : ''}.
        </p>
      )}
    </div>
  );
}
