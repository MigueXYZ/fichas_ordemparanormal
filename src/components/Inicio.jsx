import React, { useRef, useState } from 'react';
import { CLASSES_POR_ID } from '../data/classes.js';
import { ORIGENS_POR_ID } from '../data/origens.js';
import { listarAgentes, apagarAgente, duplicarAgente, importarJson } from '../engine/armazenamento.js';

function descrever(a) {
  const classe = CLASSES_POR_ID[a.classeId]?.nome;
  const origem = a.origemId === '__custom__' ? a.origemCustom?.nome : ORIGENS_POR_ID[a.origemId]?.nome;
  return [origem, classe, `NEX ${a.nex}%`].filter(Boolean).join(' · ');
}

export default function Inicio({ aoCriar, aoAbrir }) {
  const [lista, setLista] = useState(listarAgentes);
  const [erro, setErro] = useState(null);
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

  return (
    <div className="inicio">
      <h1 className="marca">Ordem<em>Paranormal</em></h1>
      <div className="sub">Ordo Realitas · Ficha de Agente</div>
      <div className="sigilo">✶ ❖ ✷ ❖ ✶</div>

      {erro && <div className="aviso"><strong>Erro:</strong> {erro}</div>}

      <div className="agentes">
        <button className="agente-cartao novo" onClick={aoCriar}>+ Novo agente</button>

        {lista.map((a) => (
          <div key={a.id} className="agente-cartao" onClick={() => aoAbrir(a)}>
            <div className="foto" style={a.imagem ? { backgroundImage: `url(${a.imagem})` } : undefined}>
              {!a.imagem && (a.nome?.[0]?.toUpperCase() || '?')}
            </div>
            <div className="info">
              <div className="nome">{a.nome || 'Sem nome'}</div>
              <div className="det">{descrever(a)}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                <button
                  className="btn ghost sm"
                  onClick={(e) => { e.stopPropagation(); duplicarAgente(a.id); recarregar(); }}
                >
                  Duplicar
                </button>
                <button
                  className="btn danger sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Apagar "${a.nome || 'Sem nome'}"? Não dá para desfazer.`)) { apagarAgente(a.id); recarregar(); }
                  }}
                >
                  Apagar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {lista.length === 0 && (
        <p style={{ color: 'var(--txt-fraco)', marginTop: 24, fontSize: 14 }}>
          Ainda não há agentes guardados neste browser.
        </p>
      )}

      <div className="barra-acoes">
        <button className="btn ghost" onClick={() => ficheiro.current?.click()}>Importar ficha (.json)</button>
        <input ref={ficheiro} type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={importar} />
      </div>
    </div>
  );
}
