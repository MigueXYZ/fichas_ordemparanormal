import React, { useEffect, useRef, useState } from 'react';
import { subscrever } from './transporte.js';
import IconeD20 from '../components/IconeD20.jsx';
import { Dados } from '../components/PainelRolagem.jsx';

const SEGUNDOS_ROLAGEM = 8;

function Barra({ titulo, classe, atual, max }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (atual / max) * 100)) : 0;
  return (
    <div className={'ov-barra ' + classe}>
      <div className="ov-titulo">{titulo}</div>
      <div className="ov-calha">
        <div className="ov-cheio" style={{ width: pct + '%' }} />
        <span className="ov-num">{atual} / {max}</span>
      </div>
    </div>
  );
}

export default function Overlay({ config, semDiagnostico = false }) {
  const [estado, setEstado] = useState(null);
  const [ligacao, setLigacao] = useState('à espera');
  const [rolagens, setRolagens] = useState([]);
  const vistas = useRef(new Set());

  useEffect(() => {
    return subscrever(
      config,
      (novo) => {
        setEstado(novo);
        // cada rolagem só aparece uma vez, e desaparece sozinha
        const r = novo?.rolagem;
        if (r && !vistas.current.has(r.id)) {
          vistas.current.add(r.id);
          setRolagens((lista) => [...lista.slice(-2), r]);
          setTimeout(() => setRolagens((lista) => lista.filter((x) => x.id !== r.id)), SEGUNDOS_ROLAGEM * 1000);
        }
      },
      setLigacao
    );
  }, [config.modo, config.url, config.codigo]);

  if (!estado) {
    return semDiagnostico ? null : (
      <div className="ov-espera">
        <IconeD20 className="icone" />
        <div>
          <b>Overlay do Claudio</b>
          <div className="ov-detalhe">
            sala <code>{config.codigo}</code> · {config.modo}
            {config.modo === 'remoto' ? ` · ${config.url}` : ''} · {ligacao}
          </div>
          <div className="ov-detalhe">À espera da ficha…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ov">
      <div className="ov-agente">
        {estado.token && <img className="ov-token" src={estado.token} alt="" />}
        <div className="ov-info">
          <div className="ov-nome">{estado.nome || 'Agente'}</div>
          {estado.legenda && <div className="ov-legenda">{estado.legenda}</div>}
          <div className="ov-barras">
            <Barra titulo="Vida" classe="ov-vida" atual={estado.pv?.atual ?? 0} max={estado.pv?.max ?? 0} />
            {estado.pd
              ? <Barra titulo="Determinação" classe="ov-determinacao" atual={estado.pd.atual} max={estado.pd.max} />
              : (
                <>
                  <Barra titulo="Sanidade" classe="ov-sanidade" atual={estado.san?.atual ?? 0} max={estado.san?.max ?? 0} />
                  <Barra titulo="Esforço" classe="ov-esforco" atual={estado.pe?.atual ?? 0} max={estado.pe?.max ?? 0} />
                </>
              )}
          </div>
        </div>
      </div>

      <div className="ov-rolagens">
        {rolagens.map((r) => (
          <div key={r.id} className={'ov-rolagem' + (r.critico ? ' critico' : '') + (r.falhaCritica ? ' falha' : '')}>
            <IconeD20 className="icone" />
            <div className="ov-corpo">
              <div className="ov-r-nome">
                {r.nome}{r.critico ? ' · crítico' : ''}{r.falhaCritica ? ' · falha crítica' : ''}
              </div>
              <Dados r={r} />
            </div>
            <div className="ov-r-total">{r.total}</div>
            {r.dano && <div className="ov-r-dano"><span>dano</span><b>{r.dano.total}</b></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
