import React, { useEffect, useRef, useState } from 'react';
import RodaAtributos from '../RodaAtributos.jsx';
import BarraRecurso from './BarraRecurso.jsx';
import TabelaPericias from './TabelaPericias.jsx';
import PainelCondicoes from './PainelCondicoes.jsx';
import { AbaCombate, AbaHabilidades, AbaRituais, AbaInventario, AbaDescricao } from './Abas.jsx';
import { MonstruosoBotao, MonstruosoPainel } from './Monstruoso.jsx';
import { CLASSES, trilhasDaClasse } from '../../data/classes.js';
import { ORIGENS } from '../../data/origens.js';
import { REGRAS_ATRIBUTOS } from '../../data/atributos.js';
import { calcMaximos, calcDefesas, calcPePorRodada, calcDeslocamento, degrauNex, nexEfetivo, NEX_TRACK } from '../../engine/calc.js';
import RegrasOpcionais from './RegrasOpcionais.jsx';
import { ajustarRecursos } from '../../engine/character.js';
import { lerImagem } from '../../engine/armazenamento.js';
import { rolarTeste } from '../../engine/dados.js';
import { atributosEfetivos } from '../../engine/monstruoso.js';
import {
  lerLayoutFicha,
  guardarLayoutFicha,
  resetarLayoutFicha,
  PRESETS_FICHA,
  WIDGETS_EMBUTIDOS,
  moverWidget,
  soltarWidgetSobre,
  soltarWidgetNaColuna,
  reordenarWidgetDrag,
  ocultarWidget,
  mostrarWidget,
  alterarNumColunas,
  adicionarWidgetCustomizado,
  atualizarWidgetCustomizado,
  removerWidgetCustomizado,
} from '../../engine/sheetLayout.js';
import WidgetContainer from './WidgetContainer.jsx';
import ModalWidgetCustom from './ModalWidgetCustom.jsx';
import { IconeEngrenagem } from '../Icones.jsx';

function InputNumeroScroll({ value, onChange, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY < 0 ? 1 : -1;
      const atual = Number(el.value) || 0;
      onChange(atual + delta);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [onChange]);

  return (
    <input
      ref={ref}
      type="number"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      {...props}
    />
  );
}

const ABAS = [
  { id: 'combate', nome: 'Combate' },
  { id: 'habilidades', nome: 'Habilidades' },
  { id: 'rituais', nome: 'Rituais' },
  { id: 'inventario', nome: 'Inventário' },
  { id: 'descricao', nome: 'Descrição' },
];

export default function Ficha({ personagem, setPersonagem, onRolar }) {
  const [aba, setAba] = useState('combate');
  const [erroFoto, setErroFoto] = useState(null);
  const [verRegras, setVerRegras] = useState(false);
  const [menuAvatarAberto, setMenuAvatarAberto] = useState(false);
  const [layoutFicha, setLayoutFicha] = useState(lerLayoutFicha);
  const [modoEdicaoLayout, setModoEdicaoLayout] = useState(false);
  const [arrastandoId, setArrastandoId] = useState(null);
  const [modalCustomAberto, setModalCustomAberto] = useState(false);
  const [widgetParaEditar, setWidgetParaEditar] = useState(null);
  const [avisoLayout, setAvisoLayout] = useState(null);

  const fileInputRef = useRef(null);
  const containerAvatarRef = useRef(null);

  useEffect(() => {
    function cliqueFora(e) {
      if (containerAvatarRef.current && !containerAvatarRef.current.contains(e.target)) {
        setMenuAvatarAberto(false);
      }
    }
    function limparDragGlobal() {
      setArrastandoId(null);
    }

    window.addEventListener('dragend', limparDragGlobal);
    window.addEventListener('drop', limparDragGlobal);

    if (menuAvatarAberto) {
      document.addEventListener('mousedown', cliqueFora);
    }
    return () => {
      window.removeEventListener('dragend', limparDragGlobal);
      window.removeEventListener('drop', limparDragGlobal);
      document.removeEventListener('mousedown', cliqueFora);
    };
  }, [menuAvatarAberto]);

  const regras = personagem.regras || {};
  const nexUtil = nexEfetivo(personagem);

  const max = calcMaximos(personagem);
  const d = calcDefesas(personagem);

  const set = (patch) => setPersonagem(prev => ({ ...prev, ...patch }));
  const setComRecursos = (patch) => setPersonagem(prev => ajustarRecursos(prev, { ...prev, ...patch }));
  const nomeOrigem = personagem.origemId === '__custom__'
    ? personagem.origemCustom?.nome || 'Personalizada'
    : ORIGENS.find((o) => o.id === personagem.origemId)?.nome || '';

  async function escolherFoto(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErroFoto(null);
    try {
      set({ imagem: await lerImagem(f) });
    } catch (err) {
      setErroFoto(err.message);
    }
    e.target.value = '';
    setMenuAvatarAberto(false);
  }

  function lidarCliqueRetrato() {
    if (!personagem.imagem) {
      fileInputRef.current?.click();
    } else {
      setMenuAvatarAberto(!menuAvatarAberto);
    }
  }

  function mudarLayout(novo) {
    setArrastandoId(null);
    const guardado = guardarLayoutFicha(novo);
    setLayoutFicha(guardado);
  }

  function carregarPreset(presetId) {
    const p = PRESETS_FICHA.find((x) => x.id === presetId);
    if (p) {
      mudarLayout(JSON.parse(JSON.stringify(p.layout)));
      setAvisoLayout(`Preset "${p.nome}" aplicado!`);
      setTimeout(() => setAvisoLayout(null), 3000);
    }
  }

  function restaurarPadrao() {
    const padrao = resetarLayoutFicha();
    setLayoutFicha(padrao);
    setAvisoLayout('Layout padrão restaurado!');
    setTimeout(() => setAvisoLayout(null), 3000);
  }

  const widgetsNaGrelha = new Set(layoutFicha.colunas.slice(0, layoutFicha.numColunas).flat());
  const widgetsOcultos = [
    ...WIDGETS_EMBUTIDOS.filter((w) => !widgetsNaGrelha.has(w.id)),
    ...Object.values(layoutFicha.customWidgets || {}).filter((w) => !widgetsNaGrelha.has(w.id)),
  ];

  function renderizarWidget(id, colIdx, itemIdx) {
    const isCustom = id.startsWith('cw-');
    const dadosCustom = isCustom ? layoutFicha.customWidgets[id] : null;

    if (!isCustom && layoutFicha.widgets[id]?.visivel === false) return null;
    if (isCustom && (!dadosCustom || dadosCustom.visivel === false)) return null;

    const col = layoutFicha.colunas[colIdx] || [];
    const podeMoverCima = itemIdx > 0;
    const podeMoverBaixo = itemIdx < col.length - 1;
    const podeMoverEsquerda = colIdx > 0;
    const podeMoverDireita = colIdx < layoutFicha.numColunas - 1;

    const titulo = isCustom
      ? (dadosCustom?.titulo || 'Widget')
      : (WIDGETS_EMBUTIDOS.find((w) => w.id === id)?.nome || id);

    return (
      <WidgetContainer
        key={id}
        id={id}
        titulo={titulo}
        modoEdicao={modoEdicaoLayout}
        custom={isCustom}
        dadosCustom={dadosCustom}
        estaArrastando={arrastandoId === id}
        onArrastoInicio={(wId) => setArrastandoId(wId)}
        onArrastoFim={() => setArrastandoId(null)}
        onDropSobre={(srcId, targetId, pos) => {
          if (srcId && targetId && srcId !== targetId) {
            mudarLayout(soltarWidgetSobre(layoutFicha, srcId, targetId, pos));
          }
        }}
        aoMudarCustom={(atualizado) => mudarLayout(atualizarWidgetCustomizado(layoutFicha, atualizado))}
        aoEditarCustom={() => { setWidgetParaEditar(dadosCustom); setModalCustomAberto(true); }}
        aoEliminarCustom={() => mudarLayout(removerWidgetCustomizado(layoutFicha, id))}
        aoOcultar={() => mudarLayout(ocultarWidget(layoutFicha, id))}
        aoMoverCima={() => mudarLayout(moverWidget(layoutFicha, id, 'cima'))}
        aoMoverBaixo={() => mudarLayout(moverWidget(layoutFicha, id, 'baixo'))}
        aoMoverEsquerda={() => mudarLayout(moverWidget(layoutFicha, id, 'esquerda'))}
        aoMoverDireita={() => mudarLayout(moverWidget(layoutFicha, id, 'direita'))}
        podeMoverCima={podeMoverCima}
        podeMoverBaixo={podeMoverBaixo}
        podeMoverEsquerda={podeMoverEsquerda}
        podeMoverDireita={podeMoverDireita}
      >
        {id === 'atributos' && (
          <div className="seccao-bloco">
            <RodaAtributos
              atributos={personagem.atributos}
              efetivos={atributosEfetivos(personagem, nexUtil)}
              mini
              onRolar={(a, valor) => onRolar(rolarTeste({ nome: a.nome, dados: valor, bonus: 0, detalhe: a.sigla }))}
              onChange={(attrId, v) => {
                if (v < 0 || v > REGRAS_ATRIBUTOS.maximoAbsoluto) return;
                setComRecursos({ atributos: { ...personagem.atributos, [attrId]: v } });
              }}
              podeSubir={(attrId) => personagem.atributos[attrId] < REGRAS_ATRIBUTOS.maximoAbsoluto}
              podeDescer={(attrId) => personagem.atributos[attrId] > 0}
            />
            <div className="linha-regras" style={{ width: '100%', textAlign: 'center' }}>
              <button type="button" className="btn ghost sm" onClick={() => setVerRegras(true)}>
                Regras opcionais
                {(regras.nivelSeparado || regras.semSanidade) && <span className="ponto-ligado" title="Há regras ligadas" />}
              </button>
            </div>
          </div>
        )}

        {id === 'recursos' && (
          <div className="seccao-bloco" style={{ width: '100%' }}>
            <div className="nex-linha" style={{ width: '100%' }}>
              {regras.nivelSeparado && (
                <div className="nex-bloco">
                  <span>Nível</span>
                  <div className="caixa">
                    <input
                      type="number" min="1" max={NEX_TRACK.length}
                      value={personagem.nivel ?? 1}
                      onChange={(e) => setComRecursos({ nivel: Math.max(1, Math.min(NEX_TRACK.length, Number(e.target.value) || 1)) })}
                      className="campo-nu"
                    />
                  </div>
                </div>
              )}
              <div className="nex-bloco">
                <span>NEX</span>
                <div className="caixa">
                  <input
                    type="number" min="0" max="99" step="1"
                    value={personagem.nex}
                    onChange={(e) => setComRecursos({ nex: e.target.value === '' ? 0 : Number(e.target.value) })}
                    className="campo-nu"
                    title="Escreve a percentagem que quiseres — as contas usam o degrau abaixo"
                  />
                  <span className="sufixo">%</span>
                </div>
                {!regras.nivelSeparado && degrauNex(personagem.nex) !== Number(personagem.nex) && (
                  <small className="degrau">conta como {degrauNex(personagem.nex)}%</small>
                )}
              </div>
              <div className="nex-bloco">
                <span>{max.semSanidade ? 'PD / turno' : 'PE / turno'}</span>
                <div className="caixa">{calcPePorRodada(personagem)}</div>
              </div>
              <div className="nex-bloco">
                <span>Deslocamento</span>
                <div className="caixa">
                  {calcDeslocamento(personagem)} m / {Math.round(calcDeslocamento(personagem) / 1.5)} q
                </div>
              </div>
            </div>

            <div style={{ width: '100%' }}>
              <BarraRecurso
                titulo="VIDA" classe="barra-vida"
                atual={personagem.pvAtual ?? max.pv} max={max.pv} onChange={(v) => set({ pvAtual: v })}
                temp={personagem.pvTemp || 0} onTemp={(v) => set({ pvTemp: v })}
                extra={personagem.pvExtra} onExtraChange={(v) => set({ pvExtra: v })}
              />
              {max.semSanidade ? (
                <BarraRecurso
                  titulo="DETERMINAÇÃO" classe="barra-determinacao"
                  atual={personagem.pdAtual ?? max.pd} max={max.pd} onChange={(v) => set({ pdAtual: v })}
                  temp={personagem.pdTemp || 0} onTemp={(v) => set({ pdTemp: v })}
                />
              ) : (
                <>
                  <BarraRecurso
                    titulo="SANIDADE" classe="barra-sanidade"
                    atual={personagem.sanAtual ?? max.san} max={max.san} onChange={(v) => set({ sanAtual: v })}
                    temp={personagem.sanTemp || 0} onTemp={(v) => set({ sanTemp: v })}
                    extra={personagem.sanExtra} onExtraChange={(v) => set({ sanExtra: v })}
                  />
                  <BarraRecurso
                    titulo="ESFORÇO" classe="barra-esforco"
                    atual={personagem.peAtual ?? max.pe} max={max.pe} onChange={(v) => set({ peAtual: v })}
                    temp={personagem.peTemp || 0} onTemp={(v) => set({ peTemp: v })}
                    extra={personagem.peExtra} onExtraChange={(v) => set({ peExtra: v })}
                  />
                </>
              )}
            </div>
          </div>
        )}

        {id === 'defesas' && (
          <div className="seccao-bloco defesas" style={{ width: '100%' }}>
            <div className="defesa-caixa">
              <div className="rotulo">Defesa</div>
              <span className="num">{d.defesa}</span>
              <div className="conta">
                10 + AGI +
                <InputNumeroScroll
                  value={personagem.defesaEquipamento}
                  onChange={(v) => set({ defesaEquipamento: v ?? 0 })}
                  title="Equipamento · Altera com o scroll"
                />
                +
                <InputNumeroScroll
                  value={personagem.defesaOutros}
                  onChange={(v) => set({ defesaOutros: v ?? 0 })}
                  title="Outros · Altera com o scroll"
                />
              </div>
            </div>

            <div className={'defesa-caixa' + (d.bloqueio.disponivel ? '' : ' inativa')} title={d.bloqueio.formula}>
              <div className="rotulo">Bloqueio</div>
              <InputNumeroScroll
                className="num"
                value={d.bloqueio.manual ? personagem.bloqueioManual : (d.bloqueio.disponivel ? d.bloqueio.valor : '')}
                placeholder=""
                title="Escreve o valor à mão ou roda o scroll; deixa vazio para voltar ao automático"
                onChange={(v) => set({ bloqueioManual: v })}
              />
              <div className="conta">
                RD = Fortitude {d.bloqueio.base >= 0 ? '+' : '−'}{Math.abs(d.bloqueio.base)}
                <br />
                extra <InputNumeroScroll
                  value={personagem.bloqueioExtra || 0}
                  onChange={(v) => set({ bloqueioExtra: v ?? 0 })}
                  title="Extra · Altera com o scroll"
                />
                {d.bloqueio.manual && (
                  <button type="button" className="voltar-auto" onClick={() => set({ bloqueioManual: null })}>auto ({d.bloqueio.auto})</button>
                )}
              </div>
              {d.bloqueio.trilhaTexto && (
                <div className="conta" style={{ color: 'var(--sangue-claro)', marginTop: 4 }}>{d.bloqueio.trilhaTexto}</div>
              )}
            </div>

            <div className={'defesa-caixa' + (d.esquiva.disponivel ? '' : ' inativa')} title={d.esquiva.formula}>
              <div className="rotulo">Esquiva</div>
              <InputNumeroScroll
                className="num"
                value={d.esquiva.manual ? personagem.esquivaManual : (d.esquiva.disponivel ? d.esquiva.valor : '')}
                placeholder=""
                title="Escreve o valor à mão ou roda o scroll; deixa vazio para voltar ao automático"
                onChange={(v) => set({ esquivaManual: v })}
              />
              <div className="conta">
                Defesa + Reflexos {d.esquiva.base >= 0 ? '+' : '−'}{Math.abs(d.esquiva.base)}
                <br />
                extra <InputNumeroScroll
                  value={personagem.esquivaExtra || 0}
                  onChange={(v) => set({ esquivaExtra: v ?? 0 })}
                  title="Extra · Altera com o scroll"
                />
                {d.esquiva.manual && (
                  <button type="button" className="voltar-auto" onClick={() => set({ esquivaManual: null })}>auto ({d.esquiva.auto})</button>
                )}
              </div>
            </div>
          </div>
        )}

        {id === 'condicoes' && (
          <div className="seccao-bloco seccao-condicoes" style={{ width: '100%' }}>
            <PainelCondicoes
              condicoes={personagem.condicoes || []}
              aoMudar={(novas) => set({ condicoes: novas })}
            />

            <div style={{ marginTop: 16 }}>
              <div className="campo-linha"><label>Proteção</label><input type="text" value={personagem.protecao} onChange={(e) => set({ protecao: e.target.value })} /></div>
              <div className="campo-linha"><label>Resistências</label><input type="text" value={personagem.resistencias} onChange={(e) => set({ resistencias: e.target.value })} /></div>
              <div className="campo-linha"><label>Proficiências</label><input type="text" value={personagem.proficiencias} onChange={(e) => set({ proficiencias: e.target.value })} /></div>
            </div>
          </div>
        )}

        {id === 'pericias' && (
          <div className="seccao-bloco seccao-pericias" style={{ width: '100%' }}>
            <TabelaPericias personagem={personagem} setPersonagem={setPersonagem} onRolar={onRolar} />
          </div>
        )}

        {id === 'abas' && (
          <div className="seccao-bloco seccao-abas" style={{ width: '100%' }}>
            <div className="abas">
              {ABAS.map((a) => (
                <button type="button" key={a.id} className={aba === a.id ? 'ativa' : ''} onClick={() => setAba(a.id)}>{a.nome}</button>
              ))}
            </div>
            {aba === 'combate' && (
              <>
                <MonstruosoPainel personagem={personagem} setPersonagem={setPersonagem} onRolar={onRolar} />
                <AbaCombate personagem={personagem} setPersonagem={setPersonagem} onRolar={onRolar} />
              </>
            )}
            {aba === 'habilidades' && <AbaHabilidades personagem={personagem} setPersonagem={setPersonagem} />}
            {aba === 'rituais' && <AbaRituais personagem={personagem} setPersonagem={setPersonagem} />}
            {aba === 'inventario' && <AbaInventario personagem={personagem} setPersonagem={setPersonagem} />}
            {aba === 'descricao' && <AbaDescricao personagem={personagem} setPersonagem={setPersonagem} />}
          </div>
        )}

        {id === 'combate_direto' && (
          <div className="seccao-bloco seccao-painel-direto" style={{ width: '100%' }}>
            <div className="rotulo-seccao-direta">⚔️ Combate & Armas</div>
            <MonstruosoPainel personagem={personagem} setPersonagem={setPersonagem} onRolar={onRolar} />
            <AbaCombate personagem={personagem} setPersonagem={setPersonagem} onRolar={onRolar} />
          </div>
        )}

        {id === 'habilidades_direto' && (
          <div className="seccao-bloco seccao-painel-direto" style={{ width: '100%' }}>
            <div className="rotulo-seccao-direta">⚡ Habilidades & Poderes</div>
            <AbaHabilidades personagem={personagem} setPersonagem={setPersonagem} />
          </div>
        )}

        {id === 'rituais_direto' && (
          <div className="seccao-bloco seccao-painel-direto" style={{ width: '100%' }}>
            <div className="rotulo-seccao-direta">🔮 Rituais & Ocultismo</div>
            <AbaRituais personagem={personagem} setPersonagem={setPersonagem} />
          </div>
        )}

        {id === 'inventario_direto' && (
          <div className="seccao-bloco seccao-painel-direto" style={{ width: '100%' }}>
            <div className="rotulo-seccao-direta">🎒 Inventário & Carga</div>
            <AbaInventario personagem={personagem} setPersonagem={setPersonagem} />
          </div>
        )}

        {id === 'descricao_direto' && (
          <div className="seccao-bloco seccao-painel-direto" style={{ width: '100%' }}>
            <div className="rotulo-seccao-direta">📜 Descrição, Anotações & Tags</div>
            <AbaDescricao personagem={personagem} setPersonagem={setPersonagem} />
          </div>
        )}
      </WidgetContainer>
    );
  }

  return (
    <div className="container">
      {/* Barra de Controlo de Personalização de Layout */}
      <div className="barra-layout-topo">
        {!modoEdicaoLayout ? (
          <button
            type="button"
            className="btn ghost sm btn-personalizar-layout"
            onClick={() => setModoEdicaoLayout(true)}
            title="Personalizar colunas e widgets da ficha (Estilo Football Manager)"
          >
            <IconeEngrenagem size={13} /> Personalizar Layout
          </button>
        ) : (
          <div className="painel-edicao-layout">
            <div className="grupo-edicao-colunas">
              <span className="rotulo-edicao">Colunas:</span>
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={'btn ghost sm' + (layoutFicha.numColunas === num ? ' ativo' : '')}
                  onClick={() => mudarLayout(alterarNumColunas(layoutFicha, num))}
                >
                  {num} Coluna{num > 1 ? 's' : ''}
                </button>
              ))}
            </div>

            <div className="grupo-edicao-presets">
              <select
                className="select-preset-layout"
                onChange={(e) => {
                  if (e.target.value) {
                    carregarPreset(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>Carregar Preset...</option>
                {PRESETS_FICHA.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            <div className="grupo-edicao-widgets">
              <select
                className="select-widget-oculto"
                disabled={widgetsOcultos.length === 0}
                onChange={(e) => {
                  if (e.target.value) {
                    mudarLayout(mostrarWidget(layoutFicha, e.target.value, 0));
                    e.target.value = '';
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  {widgetsOcultos.length === 0 ? '✓ Todos os componentes na tela' : `+ Adicionar Oculto (${widgetsOcultos.length})...`}
                </option>
                {widgetsOcultos.map((w) => (
                  <option key={w.id} value={w.id}>
                    + {w.titulo || w.nome || w.id}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="btn ghost sm"
                onClick={() => { setWidgetParaEditar(null); setModalCustomAberto(true); }}
                title="Criar um bloco de anotações, contador ou checklist customizado"
              >
                + Widget Custom
              </button>
            </div>

            {avisoLayout && (
              <span className="aviso-layout-inline">{avisoLayout}</span>
            )}

            <div className="grupo-edicao-fim">
              <button
                type="button"
                className="btn ghost sm"
                onClick={restaurarPadrao}
                title="Restaurar layout original da ficha"
              >
                Restaurar Padrão
              </button>
              <button
                type="button"
                className="btn sm btn-concluir-layout"
                onClick={() => setModoEdicaoLayout(false)}
              >
                ✓ Concluir Edição
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="cabecalho-ficha">
        <div ref={containerAvatarRef} style={{ position: 'relative' }}>
          <div 
            className="retrato" 
            onClick={lidarCliqueRetrato}
            style={{ 
              cursor: 'pointer', 
              backgroundImage: personagem.imagem ? `url(${personagem.imagem})` : undefined 
            }}
          >
            {!personagem.imagem && 'AVATAR'}
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*,image/gif" 
              onChange={escolherFoto} 
              style={{ display: 'none' }} 
            />
          </div>

          {menuAvatarAberto && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              background: '#1a0505',
              border: '1px solid var(--sangue)',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.8)',
              zIndex: 50,
              width: '140px',
              overflow: 'hidden'
            }}>
              <button
                type="button"
                className="btn ghost sm"
                style={{ width: '100%', textAlign: 'left', borderRadius: 0, border: 'none', padding: '10px 12px', fontSize: '12px' }}
                onClick={() => { setMenuAvatarAberto(false); fileInputRef.current?.click(); }}
              >
                Trocar avatar
              </button>
              <button
                type="button"
                className="btn ghost sm"
                style={{ width: '100%', textAlign: 'left', borderRadius: 0, border: 'none', padding: '10px 12px', fontSize: '12px', color: '#ef4444' }}
                onClick={() => { set({ imagem: null }); setMenuAvatarAberto(false); }}
              >
                Remover avatar
              </button>
            </div>
          )}

          {erroFoto && <div className="aviso" style={{ maxWidth: 200, fontSize: 11, marginTop: 4 }}>{erroFoto}</div>}
        </div>

        <div>
          <div className="campo-linha">
            <label>Personagem</label>
            <input type="text" value={personagem.nome} onChange={(e) => set({ nome: e.target.value })} />
          </div>
          <div className="campo-linha">
            <label>Origem</label>
            <input type="text" value={nomeOrigem} readOnly />
          </div>
          <div className="campo-linha">
            <label>Patente</label>
            <input type="text" value={personagem.patente} onChange={(e) => set({ patente: e.target.value })} />
          </div>
        </div>

        <div>
          <div className="campo-linha">
            <label>Jogador</label>
            <input type="text" value={personagem.jogador} onChange={(e) => set({ jogador: e.target.value })} />
          </div>
          <div className="campo-linha">
            <label>Classe</label>
            <select value={personagem.classeId || ''} onChange={(e) => set({ classeId: e.target.value, trilhaId: null })}>
              <option value="">—</option>
              {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          
          <div className="campo-linha">
            <label>Trilha</label>
            <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '14px', borderBottom: 'none' }}>
              <select
                style={{ flex: 1, minWidth: 0, borderBottom: '1px solid var(--linha-forte)' }}
                value={personagem.trilhaId || ''}
                disabled={nexUtil < 10}
                onChange={(e) => set({ trilhaId: e.target.value || null })}
              >
                <option value="">{nexUtil < 10 ? (regras.nivelSeparado ? 'A partir do nível 2' : 'A partir de NEX 10%') : '—'}</option>
                {trilhasDaClasse(personagem.classeId).map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>

              <MonstruosoBotao personagem={personagem} setPersonagem={setPersonagem} onRolar={onRolar} />
            </div>
          </div>
        </div>
      </div>

      {verRegras && (
        <RegrasOpcionais
          regras={regras}
          aoMudar={(novas) => setComRecursos({ regras: novas })}
          nex={personagem.nex}
          exposicao={personagem.exposicao || {}}
          aoMudarExposicao={(nova) => setComRecursos({ exposicao: nova })}
          aoFechar={() => setVerRegras(false)}
        />
      )}

      {/* Grelha Modular por Widgets da Ficha */}
      <div className={`ficha colunas-${layoutFicha.numColunas || 3}`}>
        {layoutFicha.colunas.slice(0, layoutFicha.numColunas).map((col, colIdx) => (
          <div
            key={colIdx}
            className="coluna-ficha"
            onDragOver={(e) => {
              if (modoEdicaoLayout) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }
            }}
            onDrop={(e) => {
              if (modoEdicaoLayout) {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/plain') || arrastandoId;
                if (srcId) {
                  mudarLayout(soltarWidgetNaColuna(layoutFicha, srcId, colIdx));
                }
              }
            }}
          >
            {col.map((widgetId, itemIdx) => renderizarWidget(widgetId, colIdx, itemIdx))}
            {col.length === 0 && modoEdicaoLayout && (
              <div className="coluna-vazia-edicao">
                Coluna {colIdx + 1} Vazia (arrasta ou move widgets para aqui)
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal para Criar/Editar Widget Customizado */}
      {modalCustomAberto && (
        <ModalWidgetCustom
          widgetParaEditar={widgetParaEditar}
          aoGuardar={(w) => {
            if (widgetParaEditar) {
              mudarLayout(atualizarWidgetCustomizado(layoutFicha, w));
            } else {
              mudarLayout(adicionarWidgetCustomizado(layoutFicha, w));
            }
          }}
          aoFechar={() => { setModalCustomAberto(false); setWidgetParaEditar(null); }}
        />
      )}
    </div>
  );
}