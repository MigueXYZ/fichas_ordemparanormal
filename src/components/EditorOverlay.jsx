import React, { useEffect, useRef, useState } from 'react';
import {
  LAYOUT_PADRAO,
  PRESETS_LAYOUT,
  WIDGETS_DISPONIVEIS,
  PALETA_CORES,
  resetarLayout,
  exportarLayoutJson,
  importarLayoutJson,
} from '../overlay/layoutConfig.js';
import IconeD20 from './IconeD20.jsx';

export default function EditorOverlay({ layoutInicial, personagem, aoGuardar, aoFechar }) {
  const [layout, setLayout] = useState(() => JSON.parse(JSON.stringify(layoutInicial || LAYOUT_PADRAO)));
  const [widgetAtivo, setWidgetAtivo] = useState('pv');
  const [escalaCanvas, setEscalaCanvas] = useState(0.6);
  const [mensagem, setMensagem] = useState(null);
  const containerRef = useRef(null);
  const arrastoRef = useRef(null);
  const ficheiroImportarRef = useRef(null);

  // Calcula a escala ideal para o canvas de 1280x720 caber confortavelmente no monitor
  useEffect(() => {
    function atualizarEscala() {
      const w = window.innerWidth - 40;
      const h = window.innerHeight - 150;
      const s = Math.min(w / 1280, h / 720, 1);
      setEscalaCanvas(Math.max(0.2, s));
    }
    atualizarEscala();
    window.addEventListener('resize', atualizarEscala);
    return () => window.removeEventListener('resize', atualizarEscala);
  }, []);

  // Controla o movimento de arrasto (drag & drop)
  useEffect(() => {
    function onPointerMove(e) {
      if (!arrastoRef.current) return;
      const { id, startX, startY, origX, origY } = arrastoRef.current;
      const deltaX = (e.clientX - startX) / escalaCanvas;
      const deltaY = (e.clientY - startY) / escalaCanvas;

      const novoX = Math.max(0, Math.min(1280 - 40, Math.round(origX + deltaX)));
      const novoY = Math.max(0, Math.min(720 - 40, Math.round(origY + deltaY)));

      setLayout((prev) => ({
        ...prev,
        widgets: {
          ...prev.widgets,
          [id]: {
            ...prev.widgets[id],
            x: novoX,
            y: novoY,
          },
        },
      }));
    }

    function onPointerUp() {
      arrastoRef.current = null;
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [escalaCanvas]);

  function iniciarArrasto(e, id) {
    e.stopPropagation();
    setWidgetAtivo(id);
    const w = layout.widgets[id];
    arrastoRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: w?.x ?? 0,
      origY: w?.y ?? 0,
    };
  }

  function alterarWidgetAtivo(patch) {
    if (!widgetAtivo) return;
    setLayout((prev) => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [widgetAtivo]: {
          ...prev.widgets[widgetAtivo],
          ...patch,
        },
      },
    }));
  }

  function removerWidget(id) {
    setLayout((prev) => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [id]: {
          ...prev.widgets[id],
          visivel: false,
        },
      },
    }));
    if (widgetAtivo === id) setWidgetAtivo(null);
  }

  function adicionarWidget(id) {
    const padrao = WIDGETS_DISPONIVEIS.find((w) => w.id === id);
    if (!padrao) return;

    setLayout((prev) => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [id]: {
          ...(prev.widgets[id] || padrao),
          visivel: true,
          x: prev.widgets[id]?.x ?? padrao.x,
          y: prev.widgets[id]?.y ?? padrao.y,
          escala: prev.widgets[id]?.escala ?? padrao.escala,
        },
      },
    }));
    setWidgetAtivo(id);
  }

  function carregarPreset(presetId) {
    const p = PRESETS_LAYOUT.find((x) => x.id === presetId);
    if (p) {
      setLayout(JSON.parse(JSON.stringify(p.layout)));
      setMensagem(`Preset "${p.nome}" aplicado!`);
      setTimeout(() => setMensagem(null), 3000);
    }
  }

  function restaurar() {
    setLayout(resetarLayout());
    setMensagem('Layout padrão restaurado!');
    setTimeout(() => setMensagem(null), 3000);
  }

  async function importarArquivo(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const importado = await importarLayoutJson(f);
      setLayout(importado);
      setMensagem('Preset JSON importado com sucesso!');
      setTimeout(() => setMensagem(null), 3000);
    } catch (err) {
      alert(`Erro ao importar preset: ${err.message}`);
    } finally {
      e.target.value = '';
    }
  }

  // Lista de widgets que atualmente estão ocultos/removidos
  const widgetsOcultos = WIDGETS_DISPONIVEIS.filter((w) => layout.widgets[w.id]?.visivel === false || !layout.widgets[w.id]);

  // Dados de amostra para pré-visualização realista
  const dados = {
    nome: personagem?.nome || 'Agente da Ordem',
    foto: personagem?.imagem || personagem?.token || null,
    pv: { atual: personagem?.pvAtual ?? 35, max: 40, temp: personagem?.pvTemp ?? 5 },
    san: { atual: personagem?.sanAtual ?? 22, max: 30, temp: personagem?.sanTemp ?? 0 },
    pe: { atual: personagem?.peAtual ?? 8, max: 12, temp: personagem?.peTemp ?? 2 },
    pd: personagem?.pdAtual ? { atual: personagem.pdAtual, max: 30, temp: personagem.pdTemp ?? 0 } : null,
  };

  const wAtivo = layout.widgets[widgetAtivo] || null;

  // Utilitário para altura da barra
  function alturaTrilho(alt) {
    if (alt === 'fina') return 8;
    if (alt === 'grossa') return 18;
    return 12;
  }

  return (
    <div className="editor-fundo">
      {/* Topo com Presets, Importar/Exportar e Botões de Guardar */}
      <div className="editor-topo">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span className="editor-topo-titulo">🎨 Editor Visual de Overlay (720p)</span>
          <select
            style={{ width: 'auto', padding: '6px 12px', fontSize: 13 }}
            onChange={(e) => {
              carregarPreset(e.target.value);
              e.target.value = '';
            }}
            defaultValue=""
          >
            <option value="" disabled>Carregar Preset...</option>
            {PRESETS_LAYOUT.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>

          {/* Menu Adicionar Componente */}
          <select
            style={{ width: 'auto', padding: '6px 12px', fontSize: 13, borderColor: 'var(--sangue-claro)' }}
            onChange={(e) => {
              if (e.target.value) {
                adicionarWidget(e.target.value);
                e.target.value = '';
              }
            }}
            defaultValue=""
            disabled={widgetsOcultos.length === 0}
          >
            <option value="" disabled>
              {widgetsOcultos.length === 0 ? '✓ Todos os componentes ativos' : '+ Adicionar Componente...'}
            </option>
            {widgetsOcultos.map((w) => (
              <option key={w.id} value={w.id}>+ {w.nome}</option>
            ))}
          </select>

          <button type="button" className="btn ghost sm" onClick={restaurar} title="Repor layout original">
            Restaurar Padrão
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {mensagem && (
            <span style={{ fontSize: 12, color: 'var(--ok)', background: 'rgba(74, 222, 128, 0.1)', padding: '4px 8px', borderRadius: 4 }}>
              {mensagem}
            </span>
          )}
          <button type="button" className="btn ghost sm" onClick={() => ficheiroImportarRef.current?.click()} title="Importar ficheiro de preset .json">
            Importar .json
          </button>
          <input ref={ficheiroImportarRef} type="file" accept=".json,application/json" style={{ display: 'none' }} onChange={importarArquivo} />

          <button type="button" className="btn ghost sm" onClick={() => exportarLayoutJson(layout, 'overlay-preset-720p')} title="Exportar layout atual para ficheiro .json">
            Exportar .json
          </button>

          <button type="button" className="btn ghost" onClick={aoFechar}>Cancelar</button>
          <button type="button" className="btn" onClick={() => aoGuardar(layout)}>Guardar Layout</button>
        </div>
      </div>

      {/* Área Central: Canvas 1280x720 */}
      <div
        className="editor-area-canvas"
        onClick={(e) => {
          if (e.target === e.currentTarget || e.target.classList.contains('editor-grid-guias')) {
            setWidgetAtivo(null);
          }
        }}
      >
        <div
          ref={containerRef}
          className="editor-canvas-container"
          style={{ transform: `scale(${escalaCanvas})`, transformOrigin: 'center center' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setWidgetAtivo(null);
            }
          }}
        >
          <div className="editor-grid-guias" />

          {/* 1. Avatar */}
          {layout.widgets.avatar?.visivel !== false && (() => {
            const w = layout.widgets.avatar;
            const formato = w.formato || 'circular';
            const bordaCor = w.cor || '#f04653';
            const bordaLargura = w.bordaLargura ?? 3;
            const borderRadius = formato === 'circular' ? '50%' : formato === 'quadrado' ? '16px' : formato === 'reto' ? '0px' : '50%';
            const border = formato === 'sem_borda' ? 'none' : `${bordaLargura}px solid ${bordaCor}`;
            const boxShadow = formato === 'sem_borda' ? 'none' : `0 14px 34px rgba(0,0,0,.9), 0 0 16px ${bordaCor}44`;

            return (
              <div
                className={'editor-widget-caixa' + (widgetAtivo === 'avatar' ? ' selecionado' : '')}
                style={{
                  transform: `translate(${w.x}px, ${w.y}px) scale(${w.escala || 1})`,
                  transformOrigin: 'top left',
                }}
                onPointerDown={(e) => iniciarArrasto(e, 'avatar')}
                onClick={(e) => { e.stopPropagation(); setWidgetAtivo('avatar'); }}
              >
                {widgetAtivo === 'avatar' && (
                  <span className="editor-widget-tag" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Retrato
                    <span
                      style={{ cursor: 'pointer', opacity: 0.8, fontSize: 12, marginLeft: 2 }}
                      title="Remover componente"
                      onClick={(e) => { e.stopPropagation(); removerWidget('avatar'); }}
                    >
                      ×
                    </span>
                  </span>
                )}
                <div className="ov-retrato" style={{ borderRadius, border, boxShadow }}>
                  {dados.foto ? (
                    <img src={dados.foto} alt="" className="overlay-avatar" style={{ borderRadius }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#666', fontSize: 32 }}>👁️</div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* 2. Identidade / Nome */}
          {layout.widgets.identidade?.visivel !== false && (() => {
            const w = layout.widgets.identidade;
            const corTexto = w.cor || '#ffffff';
            const corSombra = w.sombraCor || '#f04653';
            const textTransform = w.maiusculas === false ? 'none' : 'uppercase';

            return (
              <div
                className={'editor-widget-caixa' + (widgetAtivo === 'identidade' ? ' selecionado' : '')}
                style={{
                  transform: `translate(${w.x}px, ${w.y}px) scale(${w.escala || 1})`,
                  transformOrigin: 'top left',
                }}
                onPointerDown={(e) => iniciarArrasto(e, 'identidade')}
                onClick={(e) => { e.stopPropagation(); setWidgetAtivo('identidade'); }}
              >
                {widgetAtivo === 'identidade' && (
                  <span className="editor-widget-tag" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Nome
                    <span
                      style={{ cursor: 'pointer', opacity: 0.8, fontSize: 12, marginLeft: 2 }}
                      title="Remover componente"
                      onClick={(e) => { e.stopPropagation(); removerWidget('identidade'); }}
                    >
                      ×
                    </span>
                  </span>
                )}
                <div
                  className="ov-nome"
                  style={{
                    color: corTexto,
                    textTransform,
                    textShadow: `0 2px 6px #000, 0 0 24px ${corSombra}cc`,
                  }}
                >
                  {dados.nome}
                </div>
              </div>
            );
          })()}

          {/* 3. Pontos de Vida (PV) */}
          {layout.widgets.pv?.visivel !== false && (() => {
            const w = layout.widgets.pv;
            const corPv = w.cor || '#f04653';
            const altura = alturaTrilho(w.alturaBarra);
            const largura = w.larguraBarra || 240;
            const atual = dados.pv.atual;
            const max = dados.pv.max;
            const temp = dados.pv.temp || 0;
            const pctAtual = Math.max(0, Math.min(100, (atual / max) * 100));
            const pctTemp = Math.max(0, Math.min(100 - pctAtual, (temp / max) * 100));

            return (
              <div
                className={'editor-widget-caixa' + (widgetAtivo === 'pv' ? ' selecionado' : '')}
                style={{
                  transform: `translate(${w.x}px, ${w.y}px) scale(${w.escala || 1})`,
                  transformOrigin: 'top left',
                }}
                onPointerDown={(e) => iniciarArrasto(e, 'pv')}
                onClick={(e) => { e.stopPropagation(); setWidgetAtivo('pv'); }}
              >
                {widgetAtivo === 'pv' && (
                  <span className="editor-widget-tag" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Vida (PV)
                    <span
                      style={{ cursor: 'pointer', opacity: 0.8, fontSize: 12, marginLeft: 2 }}
                      title="Remover componente"
                      onClick={(e) => { e.stopPropagation(); removerWidget('pv'); }}
                    >
                      ×
                    </span>
                  </span>
                )}
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
          {layout.widgets.san?.visivel !== false && (() => {
            const w = layout.widgets.san;
            const corSan = w.cor || (dados.pd ? '#3fd0bb' : '#ad74f0');
            const altura = alturaTrilho(w.alturaBarra);
            const largura = w.larguraBarra || 200;
            const atual = dados.san.atual;
            const max = dados.san.max;
            const temp = dados.san.temp || 0;
            const pctAtual = Math.max(0, Math.min(100, (atual / max) * 100));
            const pctTemp = Math.max(0, Math.min(100 - pctAtual, (temp / max) * 100));

            return (
              <div
                className={'editor-widget-caixa' + (widgetAtivo === 'san' ? ' selecionado' : '')}
                style={{
                  transform: `translate(${w.x}px, ${w.y}px) scale(${w.escala || 1})`,
                  transformOrigin: 'top left',
                }}
                onPointerDown={(e) => iniciarArrasto(e, 'san')}
                onClick={(e) => { e.stopPropagation(); setWidgetAtivo('san'); }}
              >
                {widgetAtivo === 'san' && (
                  <span className="editor-widget-tag" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Sanidade
                    <span
                      style={{ cursor: 'pointer', opacity: 0.8, fontSize: 12, marginLeft: 2 }}
                      title="Remover componente"
                      onClick={(e) => { e.stopPropagation(); removerWidget('san'); }}
                    >
                      ×
                    </span>
                  </span>
                )}
                {w.estilo === 'barra' ? (
                  <div className="ov-barra-progresso ov-barra-san" style={{ minWidth: largura, '--cor': corSan }}>
                    <div className="ov-barra-topo">
                      <span className="ov-barra-rotulo">{dados.pd ? 'Determinação' : 'Sanidade'}</span>
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
          {layout.widgets.pe?.visivel !== false && (() => {
            const w = layout.widgets.pe;
            const corPe = w.cor || '#f5a636';
            const altura = alturaTrilho(w.alturaBarra);
            const largura = w.larguraBarra || 200;
            const atual = dados.pe.atual;
            const max = dados.pe.max;
            const temp = dados.pe.temp || 0;
            const pctAtual = Math.max(0, Math.min(100, (atual / max) * 100));
            const pctTemp = Math.max(0, Math.min(100 - pctAtual, (temp / max) * 100));

            return (
              <div
                className={'editor-widget-caixa' + (widgetAtivo === 'pe' ? ' selecionado' : '')}
                style={{
                  transform: `translate(${w.x}px, ${w.y}px) scale(${w.escala || 1})`,
                  transformOrigin: 'top left',
                }}
                onPointerDown={(e) => iniciarArrasto(e, 'pe')}
                onClick={(e) => { e.stopPropagation(); setWidgetAtivo('pe'); }}
              >
                {widgetAtivo === 'pe' && (
                  <span className="editor-widget-tag" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Esforço (PE)
                    <span
                      style={{ cursor: 'pointer', opacity: 0.8, fontSize: 12, marginLeft: 2 }}
                      title="Remover componente"
                      onClick={(e) => { e.stopPropagation(); removerWidget('pe'); }}
                    >
                      ×
                    </span>
                  </span>
                )}
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

          {/* 6. Dado D20 */}
          {layout.widgets.dado?.visivel !== false && (() => {
            const w = layout.widgets.dado;
            const corDado = w.cor || '#f04653';
            const corTexto = w.corTexto || '#f4ece8';

            return (
              <div
                className={'editor-widget-caixa' + (widgetAtivo === 'dado' ? ' selecionado' : '')}
                style={{
                  transform: `translate(${w.x}px, ${w.y}px) scale(${w.escala || 1})`,
                  transformOrigin: 'top left',
                }}
                onPointerDown={(e) => iniciarArrasto(e, 'dado')}
                onClick={(e) => { e.stopPropagation(); setWidgetAtivo('dado'); }}
              >
                {widgetAtivo === 'dado' && (
                  <span className="editor-widget-tag" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    D20 Ativo
                    <span
                      style={{ cursor: 'pointer', opacity: 0.8, fontSize: 12, marginLeft: 2 }}
                      title="Remover componente"
                      onClick={(e) => { e.stopPropagation(); removerWidget('dado'); }}
                    >
                      ×
                    </span>
                  </span>
                )}
                <div className="ov-dado" style={{ animation: 'none', opacity: 1 }}>
                  <IconeD20 className="ov-dado-forma" style={{ color: corDado }} />
                  <span className="ov-dado-total" style={{ color: corTexto }}>20</span>
                </div>
              </div>
            );
          })()}

          {/* 7. Histórico de Rolagens */}
          {layout.widgets.rolagens?.visivel !== false && (() => {
            const w = layout.widgets.rolagens;
            const corBorda = w.cor || '#8c1724';
            const opacidade = w.opacidade ?? 1;

            return (
              <div
                className={'editor-widget-caixa' + (widgetAtivo === 'rolagens' ? ' selecionado' : '')}
                style={{
                  transform: `translate(${w.x}px, ${w.y}px) scale(${w.escala || 1})`,
                  transformOrigin: 'top left',
                }}
                onPointerDown={(e) => iniciarArrasto(e, 'rolagens')}
                onClick={(e) => { e.stopPropagation(); setWidgetAtivo('rolagens'); }}
              >
                {widgetAtivo === 'rolagens' && (
                  <span className="editor-widget-tag" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Histórico
                    <span
                      style={{ cursor: 'pointer', opacity: 0.8, fontSize: 12, marginLeft: 2 }}
                      title="Remover componente"
                      onClick={(e) => { e.stopPropagation(); removerWidget('rolagens'); }}
                    >
                      ×
                    </span>
                  </span>
                )}
                <div className="ov-rolagens" style={{ minWidth: 300, opacity: opacidade }}>
                  <div className="ov-rolagem critico" style={{ borderColor: corBorda }}>
                    <IconeD20 className="icone" />
                    <div className="ov-corpo">
                      <div className="ov-r-nome">Pontaria · crítico</div>
                      <div className="ov-conta">3d20 → maior 20 + 5</div>
                    </div>
                    <div className="ov-r-total">25</div>
                    <div className="ov-r-dano"><span>dano</span><b>18</b></div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Inspetor Flutuante Inferior para o Widget Selecionado */}
      {wAtivo && (
        <div className="editor-inspetor" onClick={(e) => e.stopPropagation()}>
          <span style={{ fontWeight: 'bold', color: 'var(--sangue-claro)', fontSize: 13, borderRight: '1px solid var(--linha)', paddingRight: 12 }}>
            {wAtivo.nome}
          </span>

          {/* Escala */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <span>Escala:</span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={wAtivo.escala || 1}
              onChange={(e) => alterarWidgetAtivo({ escala: parseFloat(e.target.value) })}
              style={{ width: 85 }}
            />
            <span style={{ width: 34, fontFamily: 'var(--numeros)' }}>{(wAtivo.escala || 1).toFixed(2)}x</span>
          </div>

          {/* Seletor de Cor Paranormal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderLeft: '1px solid var(--linha)', paddingLeft: 12 }}>
            <span style={{ fontSize: 13 }}>Cor:</span>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {PALETA_CORES.slice(0, 5).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  title={c.nome}
                  onClick={() => alterarWidgetAtivo({ cor: c.hex })}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: c.hex,
                    border: wAtivo.cor === c.hex ? '2px solid #fff' : '1px solid rgba(0,0,0,0.5)',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                />
              ))}
              <input
                type="color"
                value={wAtivo.cor || '#f04653'}
                onChange={(e) => alterarWidgetAtivo({ cor: e.target.value })}
                title="Cor personalizada"
                style={{ width: 22, height: 22, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
              />
            </div>
          </div>

          {/* Opções exclusivas do Avatar */}
          {widgetAtivo === 'avatar' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderLeft: '1px solid var(--linha)', paddingLeft: 12 }}>
              <span style={{ fontSize: 13 }}>Formato:</span>
              <select
                style={{ width: 'auto', padding: '3px 8px', fontSize: 12 }}
                value={wAtivo.formato || 'circular'}
                onChange={(e) => alterarWidgetAtivo({ formato: e.target.value })}
              >
                <option value="circular">Circular</option>
                <option value="quadrado">Arredondado</option>
                <option value="reto">Quadrado</option>
                <option value="sem_borda">Sem Borda</option>
              </select>
            </div>
          )}

          {/* Opções exclusivas dos Recursos (PV, SAN, PE) */}
          {(widgetAtivo === 'pv' || widgetAtivo === 'san' || widgetAtivo === 'pe') && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderLeft: '1px solid var(--linha)', paddingLeft: 12 }}>
                <span style={{ fontSize: 13 }}>Estilo:</span>
                <div className="interruptor" style={{ width: 'fit-content' }}>
                  <button
                    type="button"
                    className={wAtivo.estilo !== 'barra' ? 'ativo' : ''}
                    onClick={() => alterarWidgetAtivo({ estilo: 'numerico' })}
                    style={{ padding: '3px 8px', fontSize: 11 }}
                  >
                    Numérico
                  </button>
                  <button
                    type="button"
                    className={wAtivo.estilo === 'barra' ? 'ativo' : ''}
                    onClick={() => alterarWidgetAtivo({ estilo: 'barra' })}
                    style={{ padding: '3px 8px', fontSize: 11 }}
                  >
                    Barra
                  </button>
                </div>
              </div>

              {wAtivo.estilo === 'barra' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderLeft: '1px solid var(--linha)', paddingLeft: 12 }}>
                  <span style={{ fontSize: 13 }}>Espessura:</span>
                  <select
                    style={{ width: 'auto', padding: '3px 8px', fontSize: 12 }}
                    value={wAtivo.alturaBarra || 'media'}
                    onChange={(e) => alterarWidgetAtivo({ alturaBarra: e.target.value })}
                  >
                    <option value="fina">Fina</option>
                    <option value="media">Média</option>
                    <option value="grossa">Grossa</option>
                  </select>
                </div>
              )}
            </>
          )}

          {/* Posição X e Y */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderLeft: '1px solid var(--linha)', paddingLeft: 12, fontSize: 12, color: 'var(--txt-dim)' }}>
            <span>X: {wAtivo.x}</span>
            <span>Y: {wAtivo.y}</span>
          </div>

          {/* Remover Componente */}
          <div style={{ borderLeft: '1px solid var(--linha)', paddingLeft: 12 }}>
            <button
              type="button"
              className="btn danger sm"
              onClick={() => removerWidget(widgetAtivo)}
              title="Remover este componente do overlay"
              style={{ padding: '4px 10px', fontSize: 12 }}
            >
              Remover
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
