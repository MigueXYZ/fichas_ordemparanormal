import React, { useMemo, useState } from 'react';
import { ORIGENS, ORIGENS_POR_ID } from '../../data/origens.js';
import { PERICIAS, PERICIAS_POR_ID } from '../../data/pericias.js';
import { aplicarConcessoes } from '../../engine/concessoes.js';
import { NOMES_ORIGENS_OFICIAIS } from '../../data/pdfCodigos.js';

function SelectPericia({ valor, onChange, excluir }) {
  return (
    <select value={valor || ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">—</option>
      {PERICIAS.filter((p) => p.id === valor || p.id !== excluir).map((p) => (
        <option key={p.id} value={p.id}>{p.nome}</option>
      ))}
    </select>
  );
}

const LIVROS = [...new Set(ORIGENS.map((o) => o.livro))];

export default function StepOrigem({ personagem, setPersonagem }) {
  const custom = personagem.origemCustom || { nome: '', descricao: '', pericias: ['', ''], poder: { nome: '', descricao: '' } };
  const [modoCustom, setModoCustom] = useState(personagem.origemId === '__custom__');
  const [busca, setBusca] = useState('');
  const [livro, setLivro] = useState('todos');

  const lista = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return ORIGENS.filter(
      (o) =>
        (livro === 'todos' || o.livro === livro) &&
        (!t || o.nome.toLowerCase().includes(t) || (o.descricao || '').toLowerCase().includes(t) || (o.poder?.nome || '').toLowerCase().includes(t))
    );
  }, [busca, livro]);

  function escolherOrigem(origem) {
    setPersonagem(
      aplicarConcessoes(
        { ...personagem, origemId: origem.id, origemCustom: null, periciasOrigemLivres: origem.periciasLivres || 0 },
        'origem',
        origem.pericias || []
      )
    );
  }

  function aleatoria() {
    const o = ORIGENS[Math.floor(Math.random() * ORIGENS.length)];
    setModoCustom(false);
    escolherOrigem(o);
    setBusca('');
    setLivro('todos');
  }

  function atualizarCustom(patch) {
    const novo = { ...custom, ...patch };
    const pericias = (novo.pericias || []).filter(Boolean);
    setPersonagem(
      aplicarConcessoes({ ...personagem, origemId: '__custom__', origemCustom: novo }, 'origem', pericias)
    );
  }

  const escolhida = personagem.origemId && personagem.origemId !== '__custom__' ? ORIGENS_POR_ID[personagem.origemId] : null;

  return (
    <div>
      <p className="texto-regra" style={{ fontSize: 15 }}>
        O que fazia o teu personagem antes de se envolver com o paranormal e entrar na Ordem da Realidade?
        A origem representa como a vida pregressa influencia a carreira de investigador.
      </p>
      <p className="texto-regra" style={{ fontSize: 15 }}>
        <strong>Ao escolher uma origem, recebes duas perícias treinadas e um poder da origem.</strong>
      </p>
      <p className="texto-regra" style={{ fontSize: 13, color: 'var(--txt-dim)' }}>
        As perícias concedidas são adicionadas automaticamente. Perícias opcionais podem ser adicionadas ao agente depois de criado.
      </p>

      <div className="filtros">
        <input
          type="text"
          placeholder={`Procurar entre ${ORIGENS.length} origens…`}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ maxWidth: 320 }}
        />
        <select value={livro} onChange={(e) => setLivro(e.target.value)} style={{ maxWidth: 220 }}>
          <option value="todos">Todos os livros</option>
          {LIVROS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <button className="btn ghost sm" onClick={aleatoria}>Aleatória</button>
        <button className="btn ghost sm" onClick={() => setModoCustom((v) => !v)}>
          {modoCustom ? 'Fechar personalizada' : 'Origem personalizada'}
        </button>
        <span className="contador">{lista.length} de {ORIGENS.length}</span>
      </div>

      {escolhida && (
        <div className="escolhido">
          <b>{escolhida.nome}</b>
          <span className="pill">{escolhida.livro}</span>
          <span style={{ color: 'var(--txt-dim)' }}>
            {escolhida.pericias?.length
              ? escolhida.pericias.map((id) => PERICIAS_POR_ID[id]?.nome).join(' · ')
              : escolhida.periciasNota}
          </span>
        </div>
      )}

      {modoCustom && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ fontSize: 18 }}>Origem personalizada</h3>
          <div className="barra" />
          <div className="linha">
            <div className="campo">
              <label>Nome da origem</label>
              <input
                type="text"
                list="origens-oficiais"
                value={custom.nome}
                onChange={(e) => atualizarCustom({ nome: e.target.value })}
                placeholder="Ex.: Acadêmico"
              />
              <datalist id="origens-oficiais">
                {NOMES_ORIGENS_OFICIAIS.map((n) => <option key={n} value={n} />)}
              </datalist>
              <span className="dica">Se usares um nome oficial, a exportação para PDF preenche a origem certa.</span>
            </div>
            <div className="campo">
              <label>Nome do poder</label>
              <input type="text" value={custom.poder?.nome || ''} onChange={(e) => atualizarCustom({ poder: { ...custom.poder, nome: e.target.value } })} />
            </div>
          </div>
          <div className="campo">
            <label>Descrição</label>
            <textarea value={custom.descricao} onChange={(e) => atualizarCustom({ descricao: e.target.value })} />
          </div>
          <div className="campo">
            <label>Descrição do poder</label>
            <textarea value={custom.poder?.descricao || ''} onChange={(e) => atualizarCustom({ poder: { ...custom.poder, descricao: e.target.value } })} />
          </div>
          <div className="linha">
            <div className="campo">
              <label>1.ª perícia treinada</label>
              <SelectPericia valor={custom.pericias?.[0]} excluir={custom.pericias?.[1]} onChange={(v) => atualizarCustom({ pericias: [v, custom.pericias?.[1] || ''] })} />
            </div>
            <div className="campo">
              <label>2.ª perícia treinada</label>
              <SelectPericia valor={custom.pericias?.[1]} excluir={custom.pericias?.[0]} onChange={(v) => atualizarCustom({ pericias: [custom.pericias?.[0] || '', v] })} />
            </div>
          </div>
        </div>
      )}

      <div className="cards">
        {lista.map((o) => (
          <div key={o.id} className={'card' + (personagem.origemId === o.id ? ' selecionado' : '')}>
            <h3 style={{ fontSize: 20 }}>{o.nome}</h3>
            <div className="barra" />
            <div className="corpo">
              <p>{o.descricao}</p>
              <p>
                <b>Perícias treinadas.</b>{' '}
                {o.pericias?.length ? o.pericias.map((id) => PERICIAS_POR_ID[id]?.nome || id).join(' e ') : o.periciasNota || '—'}
              </p>
              {o.poder?.nome && <p><b>{o.poder.nome}.</b> {o.poder.descricao}</p>}
            </div>
            <div className="acao" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="pill">{o.livro}</span>
              <button className="btn" onClick={() => { setModoCustom(false); escolherOrigem(o); }}>
                {personagem.origemId === o.id ? 'Escolhida' : 'Escolher'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {lista.length === 0 && <div className="vazio" style={{ marginTop: 18 }}><strong>Sem resultados</strong>Nenhuma origem corresponde à procura.</div>}
    </div>
  );
}
