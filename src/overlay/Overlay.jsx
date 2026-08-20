import React, { useEffect, useRef, useState } from 'react';
import { subscrever } from './transporte.js';
import IconeD20 from '../components/IconeD20.jsx';
import { Dados } from '../components/PainelRolagem.jsx';

const SEGUNDOS_ROLAGEM = 6;

function Recurso({ classe, atual, max, temp = 0 }) {
  return (
    <div className={'ov-recurso ' + classe}>
      <span className="ov-valor-recurso">
        {atual}<i>/{max}</i>{temp > 0 ? <b className="ov-temp">+{temp}</b> : null}
      </span>
    </div>
  );
}

/** O dado só aparece quando rolas e desvanece passado uns segundos */
function DadoResultado({ rolagem }) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (!rolagem) return;
    setVisivel(true);
    const t = setTimeout(() => {
      setVisivel(false);
    }, SEGUNDOS_ROLAGEM * 1000);
    return () => clearTimeout(t);
  }, [rolagem?.id]);

  if (!rolagem || !visivel) return null;

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
  const [ultima, setUltima] = useState(null);
  const vistas = useRef(new Set());

  useEffect(() => {
    return subscrever(
      config,
      (novo) => {
        setEstado(novo);
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
            sala <code>{config.codigo}</code> · modo <code>{config.modo}</code> · status: <b>{ligacao}</b>
            {config.modo === 'remoto' ? ` · ${config.url}` : ''}
          </div>
          <div className="ov-detalhe" style={{ marginTop: 4 }}>
            {ligacao === 'ligado'
              ? 'Conectado! A carregar dados do agente...'
              : 'À espera que o jogador abra a ficha e ative a transmissão nesta sala...'}
          </div>
        </div>
      </div>
    );
  }

  // Garante que vai buscar a imagem do avatar da ficha, ignorando tokens secundários
  const fotoAvatar = estado.imagem || estado.tokenUrl || estado.token;

  return (
    <div className="ov">
      <div className="ov-cartao-principal">
        {/* Bloco do Avatar e do Nome/Vida lado a lado, tal como na imagem de referência */}
        {fotoAvatar && (
          <div className="ov-retrato">
            <img src={fotoAvatar} alt="" className="overlay-avatar" />
          </div>
        )}

        <div className="ov-conteudo-principal">
          <div className="ov-linha-nome">
            <div className="ov-identidade">
              <div className="ov-nome">{estado.nome || 'Agente'}</div>
              <div className="ov-vida-grande">
                {estado.pv?.atual ?? 0}<i>/{estado.pv?.max ?? 0}</i>
                {estado.pv?.temp > 0 ? <b className="ov-temp">+{estado.pv.temp}</b> : null}
              </div>
            </div>
            {/* O d20 que aparece, cai e desvanece */}
            <DadoResultado rolagem={ultima} />
          </div>

          <div className="ov-secundarias">
            {estado.pd
              ? <Recurso classe="ov-determinacao" atual={estado.pd.atual} max={estado.pd.max} temp={estado.pd.temp} />
              : (
                <>
                  <Recurso classe="ov-sanidade" atual={estado.san?.atual ?? 0} max={estado.san?.max ?? 0} />
                  <Recurso classe="ov-esforco" atual={estado.pe?.atual ?? 0} max={estado.pe?.max ?? 0} temp={estado.pe?.temp} />
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