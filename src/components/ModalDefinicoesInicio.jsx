import React, { useRef, useState } from 'react';
import { IconeJSON, IconeSom } from './Icones.jsx';
import {
  exportarTudo,
  importarCopia,
  importarJson,
  marcarCopiaFeita,
  ultimaCopia,
} from '../engine/armazenamento.js';

/**
 * Definições do ecrã inicial — a roda dentada da barra do topo.
 *
 * Junta aqui as cópias de segurança (guardar/repor tudo) e a importação de
 * uma ficha solta, que antes andavam soltas por baixo do título, e as opções
 * de som que estavam na barra. Ver `engine/armazenamento.js` para o formato
 * do ficheiro de cópia.
 */
function dataLegivel(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function ModalDefinicoesInicio({
  som,
  aoAlternarSom,
  coracao,
  aoAlternarCoracao,
  aoRecarregar,
  aoAbrirAgente,
  aoFechar,
}) {
  const refCopia = useRef(null);
  const refFicha = useRef(null);
  const [erro, setErro] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [feitaEm, setFeitaEm] = useState(() => ultimaCopia());

  function guardarCopia() {
    setErro(null);
    try {
      const n = exportarTudo();
      marcarCopiaFeita();
      setFeitaEm(ultimaCopia());
      setAviso(n === 1 ? '1 agente guardado no ficheiro.' : `${n} agentes guardados no ficheiro.`);
    } catch (err) {
      setAviso(null);
      setErro(err.message);
    }
  }

  async function reporCopia(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErro(null);
    setAviso(null);
    try {
      const r = await importarCopia(f, 'juntar');
      aoRecarregar?.();
      setAviso(r.importados === 1 ? '1 agente reposto.' : `${r.importados} agentes repostos.`);
    } catch (err) {
      setErro(err.message);
    } finally {
      e.target.value = '';
    }
  }

  async function importarFicha(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErro(null);
    setAviso(null);
    try {
      const novo = await importarJson(f);
      aoRecarregar?.();
      aoFechar();
      aoAbrirAgente?.(novo);
    } catch (err) {
      setErro(err.message);
    } finally {
      e.target.value = '';
    }
  }

  const dataCopia = dataLegivel(feitaEm);

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal modal-definicoes" style={{ maxWidth: 480 }}>
        <div className="modal-topo">
          <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 20 }}>Definições</h3>
          <button className="fechar" onClick={aoFechar} aria-label="Fechar">×</button>
        </div>

        <div className="modal-corpo" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {erro && <div className="aviso"><strong>Erro:</strong> {erro}</div>}
          {aviso && <div className="aviso ok-aviso">{aviso}</div>}

          <div className="seccao-def">
            <label className="rotulo-def">Cópias de Segurança</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              <div className="card-opcao-def">
                <div>
                  <b style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
                    <IconeJSON size={16} style={{ color: 'var(--sangue-claro)' }} />
                    Guardar cópia
                  </b>
                  <span className="dica" style={{ display: 'block', marginTop: 2 }}>
                    Descarrega TODOS os agentes num único ficheiro .json.
                    {dataCopia ? ` Última cópia: ${dataCopia}.` : ' Ainda não fizeste nenhuma.'}
                  </span>
                </div>
                <button type="button" className="btn sm" onClick={guardarCopia} style={{ minWidth: 120 }}>
                  Guardar
                </button>
              </div>

              <div className="card-opcao-def">
                <div>
                  <b style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
                    <IconeJSON size={16} style={{ color: 'var(--txt-dim)' }} />
                    Repor cópia
                  </b>
                  <span className="dica" style={{ display: 'block', marginTop: 2 }}>
                    Junta os agentes de um ficheiro de cópia aos que já tens. Nunca apaga nada.
                  </span>
                </div>
                <button
                  type="button"
                  className="btn ghost sm"
                  onClick={() => refCopia.current?.click()}
                  style={{ minWidth: 120 }}
                >
                  Repor
                </button>
              </div>

              <div className="card-opcao-def">
                <div>
                  <b style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
                    <IconeJSON size={16} style={{ color: 'var(--txt-dim)' }} />
                    Importar .json
                  </b>
                  <span className="dica" style={{ display: 'block', marginTop: 2 }}>
                    Traz uma ficha solta exportada de outra sessão e abre-a.
                  </span>
                </div>
                <button
                  type="button"
                  className="btn ghost sm"
                  onClick={() => refFicha.current?.click()}
                  style={{ minWidth: 120 }}
                >
                  Importar
                </button>
              </div>
            </div>

            <input ref={refCopia} type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={reporCopia} />
            <input ref={refFicha} type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={importarFicha} />
          </div>

          <div className="seccao-def">
            <label className="rotulo-def">Áudio & Efeitos</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              <div className="card-opcao-def">
                <div>
                  <b style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
                    <IconeSom mudo={!som} size={16} style={{ color: som ? 'var(--sangue-claro)' : 'var(--txt-dim)' }} />
                    Som dos Dados
                  </b>
                  <span className="dica" style={{ display: 'block', marginTop: 2 }}>
                    Efeito sonoro ao rolar dados e dados críticos.
                  </span>
                </div>
                <div className="interruptor" style={{ width: 'fit-content' }}>
                  <button type="button" className={!som ? 'ativo' : ''} onClick={aoAlternarSom}>Mudo</button>
                  <button type="button" className={som ? 'ativo' : ''} onClick={aoAlternarSom}>Ligado</button>
                </div>
              </div>

              <div className="card-opcao-def">
                <div>
                  <b style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
                    <svg
                      width="15" height="15" viewBox="0 0 24 24"
                      fill={coracao ? 'var(--sangue-claro)' : 'none'}
                      stroke={coracao ? 'var(--sangue-claro)' : 'currentColor'}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    Batimento Cardíaco
                  </b>
                  <span className="dica" style={{ display: 'block', marginTop: 2 }}>
                    Pulsação sonora tensa quando em vida baixa.
                  </span>
                </div>
                <div className="interruptor" style={{ width: 'fit-content' }}>
                  <button type="button" className={!coracao ? 'ativo' : ''} onClick={aoAlternarCoracao}>Desligado</button>
                  <button type="button" className={coracao ? 'ativo' : ''} onClick={aoAlternarCoracao}>Ligado</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-acoes" style={{ marginTop: 24 }}>
          <button type="button" className="btn" onClick={aoFechar} style={{ width: '100%' }}>Concluído</button>
        </div>
      </div>
    </div>
  );
}
