import React, { useMemo, useState } from 'react';
import { ORIGENS, ORIGENS_POR_ID } from '../../data/origens.js';
import { PERICIAS, PERICIAS_POR_ID } from '../../data/pericias.js';
import { aplicarConcessoes } from '../../engine/concessoes.js';
import { NOMES_ORIGENS_OFICIAIS } from '../../data/pdfCodigos.js';
import SeletorCrt from './SeletorCrt.jsx';

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

// Perícias que pelo menos uma origem concede — só estas fazem sentido no
// filtro (origens com perícia "à escolha do mestre" não têm um id fixo para
// filtrar por elas).
const PERICIAS_EM_ORIGENS = [...new Set(ORIGENS.flatMap((o) => o.pericias || []))]
  .map((id) => PERICIAS_POR_ID[id])
  .filter(Boolean)
  .sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));

/**
 * Passo de Origem — desde a última afinação, vive dentro do mesmo ecrã
 * "registo" que os Atributos (ver CrtEcra.jsx em Wizard.jsx). Em vez da
 * grelha de cartões sempre abertos, é uma lista compacta com um título por
 * linha e um botão para expandir — mais direto e mais "ficheiro antigo a
 * consultar" do que um mural cheio de texto já todo à mostra.
 */
export default function StepOrigem({ personagem, setPersonagem }) {
  const custom = personagem.origemCustom || { nome: '', descricao: '', pericias: ['', ''], poder: { nome: '', descricao: '' } };
  const [modoCustom, setModoCustom] = useState(personagem.origemId === '__custom__');
  const [busca, setBusca] = useState('');
  const [livro, setLivro] = useState('todos');
  const [periciaFiltro, setPericiaFiltro] = useState('todas');
  const [aberta, setAberta] = useState(null);

  const lista = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return ORIGENS.filter(
      (o) =>
        (livro === 'todos' || o.livro === livro) &&
        (periciaFiltro === 'todas' || (o.pericias || []).includes(periciaFiltro)) &&
        (!t || o.nome.toLowerCase().includes(t) || (o.descricao || '').toLowerCase().includes(t) || (o.poder?.nome || '').toLowerCase().includes(t))
    );
  }, [busca, livro, periciaFiltro]);

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
    setPericiaFiltro('todas');
    setAberta(o.id);
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
    <>
      <p className="texto-regra crt-regra">
        O que fazia o teu personagem antes de se envolver com o paranormal e entrar na Ordem da Realidade?
        A origem representa como a vida pregressa influencia a carreira de investigador.
      </p>
      <p className="texto-regra crt-regra" style={{ marginBottom: 16 }}>
        <strong>Ao escolher uma origem, recebes duas perícias treinadas e um poder da origem.</strong> As
        perícias concedidas são adicionadas automaticamente — as opcionais podem ser ajustadas depois de criado.
      </p>

      <div className="filtros">
        <input
          type="text"
          placeholder={`Procurar entre ${ORIGENS.length} origens…`}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ maxWidth: 320 }}
        />
        <SeletorCrt
          valor={livro}
          onChange={setLivro}
          opcoes={[{ value: 'todos', label: 'Todos os livros' }, ...LIVROS.map((l) => ({ value: l, label: l }))]}
        />
        <SeletorCrt
          valor={periciaFiltro}
          onChange={setPericiaFiltro}
          opcoes={[
            { value: 'todas', label: 'Qualquer perícia concedida' },
            ...PERICIAS_EM_ORIGENS.map((p) => ({ value: p.id, label: p.nome })),
          ]}
        />
        <button type="button" className="btn ghost sm" onClick={aleatoria}>Aleatória</button>
        <button type="button" className="btn ghost sm" onClick={() => setModoCustom((v) => !v)}>
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

      <div className="lista-origens-crt">
        {lista.map((o) => {
          const expandida = aberta === o.id;
          const selecionada = personagem.origemId === o.id;
          return (
            <div key={o.id} className={'linha-origem-crt' + (expandida ? ' aberta' : '') + (selecionada ? ' selecionada' : '')}>
              <button
                type="button"
                className="origem-cabecalho"
                onClick={() => setAberta(expandida ? null : o.id)}
                aria-expanded={expandida}
              >
                <span className="origem-titulo">
                  <span className="origem-nome">{o.nome}</span>
                  <span className="origem-livro">{o.livro}</span>
                  {selecionada && <span className="pill origem-pill-escolhida">Escolhida</span>}
                </span>
                <span className="origem-chevron" aria-hidden="true">▾</span>
              </button>

              <div className="origem-corpo-wrap">
                <div className="origem-corpo-inner">
                  <div className="origem-corpo">
                    <p>{o.descricao}</p>
                    <p>
                      <b>Perícias treinadas.</b>{' '}
                      {o.pericias?.length ? o.pericias.map((id) => PERICIAS_POR_ID[id]?.nome || id).join(' e ') : o.periciasNota || '—'}
                    </p>
                    {o.poder?.nome && <p><b>{o.poder.nome}.</b> {o.poder.descricao}</p>}
                    <div className="origem-acao">
                      <button type="button" className="btn sm" onClick={() => { setModoCustom(false); escolherOrigem(o); }}>
                        {selecionada ? 'Escolhida' : 'Escolher esta origem'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {lista.length === 0 && <div className="vazio" style={{ marginTop: 18 }}><strong>Sem resultados</strong>Nenhuma origem corresponde à procura.</div>}
    </>
  );
}
