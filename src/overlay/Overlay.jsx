import React, { useEffect, useRef, useState } from 'react';
import { subscrever } from './transporte.js';
import { LAYOUT_PADRAO } from './layoutConfig.js';
import IconeD20 from '../components/IconeD20.jsx';
import { Dados } from '../components/PainelRolagem.jsx';
import { ExibirDanoSeparado } from '../components/ExibirDano.jsx';

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
function DadoResultado({ rolagem, cor, corTexto }) {
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
  const estiloDado = !rolagem.critico && !rolagem.falhaCritica && cor ? { color: cor } : undefined;
  const estiloTexto = !rolagem.critico && !rolagem.falhaCritica && corTexto ? { color: corTexto } : undefined;

  return (
    <div className={classe} key={rolagem.id} title={rolagem.nome}>
      <IconeD20 className="ov-dado-forma" style={estiloDado} />
      <span className="ov-dado-total" style={estiloTexto}>{rolagem.total}</span>
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
  }, [config.codigo]);

  if (!estado) {
    return semDiagnostico ? null : (
      <div className="ov-espera">
        <IconeD20 className="icone" />
        <div>
          <b>Overlay do Claudio</b>
          <div className="ov-detalhe">
            sala <code>{config.codigo}</code> · status: <b>{ligacao}</b>
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

  const fotoAvatar = estado.imagem || estado.tokenUrl || estado.token;
  const layout = estado.layout?.widgets ? estado.layout : LAYOUT_PADRAO;
  const widgets = layout.widgets || LAYOUT_PADRAO.widgets;

  function alturaTrilho(alt) {
    if (alt === 'fina') return 8;
    if (alt === 'grossa') return 18;
    return 12;
  }

  return (
    <div className="ov-canvas-livre">
      {/* 1. Avatar */}
      {widgets.avatar?.visivel !== false && fotoAvatar && (() => {
        const w = widgets.avatar;
        const formato = w.formato || 'circular';
        const bordaCor = w.cor || '#f04653';
        const bordaLargura = w.bordaLargura ?? 3;
        const borderRadius = formato === 'circular' ? '50%' : formato === 'quadrado' ? '16px' : formato === 'reto' ? '0px' : '50%';
        const border = formato === 'sem_borda' ? 'none' : `${bordaLargura}px solid ${bordaCor}`;
        const boxShadow = formato === 'sem_borda' ? 'none' : `0 14px 34px rgba(0,0,0,.9), 0 0 16px ${bordaCor}44`;

        return (
          <div
            className="ov-widget-absoluto"
            style={{
              transform: `translate(${w.x}px, ${w.y}px) scale(${w.escala || 1})`,
            }}
          >
            <div className="ov-retrato" style={{ borderRadius, border, boxShadow }}>
              <img src={fotoAvatar} alt="" className="overlay-avatar" style={{ borderRadius }} />
            </div>
          </div>
        );
      })()}

      {/* 2. Identidade */}
      {widgets.identidade?.visivel !== false && (() => {
        const w = widgets.identidade;
        const corTexto = w.cor || '#ffffff';
        const corSombra = w.sombraCor || '#f04653';
        const textTransform = w.maiusculas === false ? 'none' : 'uppercase';

        return (
          <div
            className="ov-widget-absoluto"
            style={{
              transform: `translate(${w.x}px, ${w.y}px) scale(${w.escala || 1})`,
            }}
          >
            <div
              className="ov-nome"
              style={{
                color: corTexto,
                textTransform,
                textShadow: `0 2px 6px #000, 0 0 24px ${corSombra}cc`,
              }}
            >
              {estado.nome || 'Agente'}
            </div>
          </div>
        );
      })()}

      {/* 3. Pontos de Vida (PV) */}
      {widgets.pv?.visivel !== false && (() => {
        const w = widgets.pv;
        const corPv = w.cor || '#f04653';
        const altura = alturaTrilho(w.alturaBarra);
        const largura = w.larguraBarra || 240;
        const atual = estado.pv?.atual ?? 0;
        const max = estado.pv?.max || 1;
        const temp = estado.pv?.temp || 0;
        const pctAtual = Math.max(0, Math.min(100, (atual / max) * 100));
        const pctTemp = Math.max(0, Math.min(100 - pctAtual, (temp / max) * 100));

        return (
          <div
            className="ov-widget-absoluto"
            style={{
              transform: `translate(${w.x}px, ${w.y}px) scale(${w.escala || 1})`,
            }}
          >
            {w.estilo === 'barra' ? (
              <div className="ov-barra-progresso ov-barra-pv" style={{ minWidth: largura, '--cor': corPv }}>
                <div className="ov-barra-topo">
                  <span className="ov-barra-rotulo">Pontos de Vida</span>
                  <span className="ov-barra-valores">
                    {atual}<i>/{max}</i>
                    {temp > 0 ? <b className="ov-temp">+{temp}</b> : null}
                  </span>
                </div>
                <div className="ov-barra-trilho" style={{ height: altura }}>
                  <div className="ov-barra-preenchimento" style={{ width: `${pctAtual}%` }} />
                  {temp > 0 && (
                    <div
                      className="ov-barra-temp"
                      style={{
                        left: `${pctAtual < 100 ? pctAtual : 0}%`,
                        width: `${pctAtual < 100 ? (pctTemp > 0 ? pctTemp : 6) : 100}%`,
                        opacity: pctAtual >= 100 ? 0.75 : 1,
                      }}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="ov-vida-grande" style={{ color: corPv, textShadow: `0 2px 8px #000, 0 0 26px ${corPv}77` }}>
                {atual}<i>/{max}</i>
                {temp > 0 ? <b className="ov-temp">+{temp}</b> : null}
              </div>
            )}
          </div>
        );
      })()}

      {/* 4. Sanidade / Determinação */}
      {widgets.san?.visivel !== false && (() => {
        const w = widgets.san;
        const corSan = w.cor || (estado.pd ? '#3fd0bb' : '#ad74f0');
        const altura = alturaTrilho(w.alturaBarra);
        const largura = w.larguraBarra || 200;

        if (estado.pd) {
          const atual = estado.pd.atual ?? 0;
          const max = estado.pd.max || 1;
          const temp = estado.pd.temp || 0;
          const pctAtual = Math.max(0, Math.min(100, (atual / max) * 100));
          const pctTemp = Math.max(0, Math.min(100 - pctAtual, (temp / max) * 100));

          return (
            <div
              className="ov-widget-absoluto"
              style={{
                transform: `translate(${w.x}px, ${w.y}px) scale(${w.escala || 1})`,
              }}
            >
              {w.estilo === 'barra' ? (
                <div className="ov-barra-progresso ov-barra-pd" style={{ minWidth: largura, '--cor': corSan }}>
                  <div className="ov-barra-topo">
                    <span className="ov-barra-rotulo">Determinação</span>
                    <span className="ov-barra-valores">
                      {atual}<i>/{max}</i>
                      {temp > 0 ? <b className="ov-temp">+{temp}</b> : null}
                    </span>
                  </div>
                  <div className="ov-barra-trilho" style={{ height: altura }}>
                    <div className="ov-barra-preenchimento" style={{ width: `${pctAtual}%` }} />
                    {temp > 0 && (
                      <div
                        className="ov-barra-temp"
                        style={{
                          left: `${pctAtual < 100 ? pctAtual : 0}%`,
                          width: `${pctAtual < 100 ? (pctTemp > 0 ? pctTemp : 6) : 100}%`,
                          opacity: pctAtual >= 100 ? 0.75 : 1,
                        }}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="ov-recurso ov-determinacao" style={{ '--cor': corSan }}>
                  <span className="ov-valor-recurso">
                    {atual}<i>/{max}</i>{temp > 0 ? <b className="ov-temp">+{temp}</b> : null}
                  </span>
                </div>
              )}
            </div>
          );
        }

        const atual = estado.san?.atual ?? 0;
        const max = estado.san?.max || 1;
        const temp = estado.san?.temp || 0;
        const pctAtual = Math.max(0, Math.min(100, (atual / max) * 100));
        const pctTemp = Math.max(0, Math.min(100 - pctAtual, (temp / max) * 100));

        return (
          <div
            className="ov-widget-absoluto"
            style={{
              transform: `translate(${w.x}px, ${w.y}px) scale(${w.escala || 1})`,
            }}
          >
            {w.estilo === 'barra' ? (
              <div className="ov-barra-progresso ov-barra-san" style={{ minWidth: largura, '--cor': corSan }}>
                <div className="ov-barra-topo">
                  <span className="ov-barra-rotulo">Sanidade</span>
                  <span className="ov-barra-valores">
                    {atual}<i>/{max}</i>
                    {temp > 0 ? <b className="ov-temp">+{temp}</b> : null}
                  </span>
                </div>
                <div className="ov-barra-trilho" style={{ height: altura }}>
                  <div className="ov-barra-preenchimento" style={{ width: `${pctAtual}%` }} />
                  {temp > 0 && (
                    <div
                      className="ov-barra-temp"
                      style={{
                        left: `${pctAtual < 100 ? pctAtual : 0}%`,
                        width: `${pctAtual < 100 ? (pctTemp > 0 ? pctTemp : 6) : 100}%`,
                        opacity: pctAtual >= 100 ? 0.75 : 1,
                      }}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="ov-recurso ov-sanidade" style={{ '--cor': corSan }}>
                <span className="ov-valor-recurso">
                  {atual}<i>/{max}</i>{temp > 0 ? <b className="ov-temp">+{temp}</b> : null}
                </span>
              </div>
            )}
          </div>
        );
      })()}

      {/* 5. Pontos de Esforço (PE) */}
      {!estado.pd && widgets.pe?.visivel !== false && (() => {
        const w = widgets.pe;
        const corPe = w.cor || '#f5a636';
        const altura = alturaTrilho(w.alturaBarra);
        const largura = w.larguraBarra || 200;
        const atual = estado.pe?.atual ?? 0;
        const max = estado.pe?.max || 1;
        const temp = estado.pe?.temp || 0;
        const pctAtual = Math.max(0, Math.min(100, (atual / max) * 100));
        const pctTemp = Math.max(0, Math.min(100 - pctAtual, (temp / max) * 100));

        return (
          <div
            className="ov-widget-absoluto"
            style={{
              transform: `translate(${w.x}px, ${w.y}px) scale(${w.escala || 1})`,
            }}
          >
            {w.estilo === 'barra' ? (
              <div className="ov-barra-progresso ov-barra-pe" style={{ minWidth: largura, '--cor': corPe }}>
                <div className="ov-barra-topo">
                  <span className="ov-barra-rotulo">Esforço</span>
                  <span className="ov-barra-valores">
                    {atual}<i>/{max}</i>
                    {temp > 0 ? <b className="ov-temp">+{temp}</b> : null}
                  </span>
                </div>
                <div className="ov-barra-trilho" style={{ height: altura }}>
                  <div className="ov-barra-preenchimento" style={{ width: `${pctAtual}%` }} />
                  {temp > 0 && (
                    <div
                      className="ov-barra-temp"
                      style={{
                        left: `${pctAtual < 100 ? pctAtual : 0}%`,
                        width: `${pctAtual < 100 ? (pctTemp > 0 ? pctTemp : 6) : 100}%`,
                        opacity: pctAtual >= 100 ? 0.75 : 1,
                      }}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="ov-recurso ov-esforco" style={{ '--cor': corPe }}>
                <span className="ov-valor-recurso">
                  {atual}<i>/{max}</i>{temp > 0 ? <b className="ov-temp">+{temp}</b> : null}
                </span>
              </div>
            )}
          </div>
        );
      })()}

      {/* 6. Dado D20 Ativo */}
      {widgets.dado?.visivel !== false && (() => {
        const w = widgets.dado;
        const corDado = w.cor || '#f04653';
        const corTexto = w.corTexto || '#f4ece8';

        return (
          <div
            className="ov-widget-absoluto"
            style={{
              transform: `translate(${w.x}px, ${w.y}px) scale(${w.escala || 1})`,
            }}
          >
            <DadoResultado rolagem={ultima} cor={corDado} corTexto={corTexto} />
          </div>
        );
      })()}

      {/* 7. Histórico de Rolagens */}
      {widgets.rolagens?.visivel !== false && rolagens.length > 0 && (() => {
        const w = widgets.rolagens;
        const corBorda = w.cor || '#8c1724';
        const opacidade = w.opacidade ?? 1;

        return (
          <div
            className="ov-widget-absoluto"
            style={{
              transform: `translate(${w.x}px, ${w.y}px) scale(${w.escala || 1})`,
            }}
          >
            <div className="ov-rolagens" style={{ opacity: opacidade }}>
              {rolagens.map((r) => (
                <div key={r.id} className={'ov-rolagem' + (r.critico ? ' critico' : '') + (r.falhaCritica ? ' falha' : '')} style={{ borderColor: corBorda }}>
                  <IconeD20 className="icone" />
                  <div className="ov-corpo">
                    <div className="ov-r-nome">
                      {r.nome}{r.critico ? ' · crítico' : ''}{r.falhaCritica ? ' · falha crítica' : ''}
                    </div>
                    <Dados r={r} />
                  </div>
                  <div className="ov-r-total">{r.tipo === 'dano' ? <ExibirDanoSeparado dano={r} /> : r.total}</div>
                  {r.dano && <div className="ov-r-dano"><span>dano</span><ExibirDanoSeparado dano={r.dano} /></div>}
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}