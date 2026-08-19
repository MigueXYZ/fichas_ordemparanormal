import React, { useRef, useState } from 'react';
import { CLASSES_POR_ID } from '../data/classes.js';
import { ORIGENS_POR_ID } from '../data/origens.js';
import { listarAgentes, apagarAgente, duplicarAgente, importarJson, guardarAgente } from '../engine/armazenamento.js';
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
        <input ref={ficheiro} type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={importar} />
      </div>

      {gerador && (
        <Geradores
          aoFechar={() => { setGerador(false); recarregar(); }}
          aoGuardar={(p) => { const g = guardarAgente(p); recarregar(); return g; }}
          aoAbrir={(p) => aoAbrir(p)}
        />
      )}

      <div className="agentes">
        <button className="agente-cartao novo" onClick={aoCriar}>+ Novo agente</button>

        {lista.map((a) => (
          <div key={a.id} className="agente-cartao" onClick={() => aoAbrir(a)}>
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


    </div>
  );
}
