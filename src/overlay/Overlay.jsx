import React, { useEffect, useRef, useState } from 'react';
import { subscrever } from './transporte.js';
import IconeD20 from '../components/IconeD20.jsx';
import { Dados } from '../components/PainelRolagem.jsx';

const SEGUNDOS_ROLAGEM = 8;

function Recurso({ titulo, classe, atual, max, temp = 0 }) {
  return (
    <div className={'ov-recurso ' + classe}>
      <span className="ov-nome-recurso">{titulo}</span>
      <span className="ov-valor-recurso">
        {atual}<i>/{max}</i>{temp > 0 ? <b className="ov-temp">+{temp}</b> : null}
      </span>
    </div>
  );
}

/** O último resultado, dentro de um d20, ao lado do nome. */
function DadoResultado({ rolagem }) {
  if (!rolagem) return null;
  const classe = 'ov-dado' + (rolagem.critico ? ' critico' : '') + (rolagem.falhaCritica ? ' falha' : '');
  return (
    <div className={classe} key={rolagem.id} title={rolagem.nome}>
      <IconeD20 className="ov-dado-forma" />
      <span className="ov-dado-total">{rolagem.total}</span>
    </div>
  );
}

export default function Overlay({ config, semDiagnostico = false }) {
  const [estado, setEstado] = useState(null);
  const [ligacao, setLigacao] = useState('à espera');
  const [rolagens, setRolagens] = useState([]);
  const [ultima, setUltima] = useState(null);   // fica no d20 ao lado do nome
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
          setUltima(r);
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
      <div className="ov-cartao">
        {estado.token && <div className="ov-retrato"><img src={estado.token} alt="" /></div>}

        <div className="ov-linha-nome">
          <div className="ov-identidade">
            <div className="ov-nome">{estado.nome || 'Agente'}</div>
            <div className="ov-vida-grande">
              {estado.pv?.atual ?? 0}<i>/{estado.pv?.max ?? 0}</i>
              {estado.pv?.temp > 0 ? <b className="ov-temp">+{estado.pv.temp}</b> : null}
            </div>
          </div>
          <DadoResultado rolagem={ultima} />
        </div>

        <div className="ov-secundarias">
          {estado.pd
            ? <Recurso titulo="Determinação" classe="ov-determinacao" atual={estado.pd.atual} max={estado.pd.max} temp={estado.pd.temp} />
            : (
              <>
                <Recurso titulo="Sanidade" classe="ov-sanidade" atual={estado.san?.atual ?? 0} max={estado.san?.max ?? 0} />
                <Recurso titulo="Esforço" classe="ov-esforco" atual={estado.pe?.atual ?? 0} max={estado.pe?.max ?? 0} temp={estado.pe?.temp} />
              </>
            )}
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
