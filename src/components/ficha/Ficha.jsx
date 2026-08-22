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
  }

  return (
    <div className="container">
      <style>{`
        /* Força o alinhamento e centralização rigorosa da coluna esquerda do token */
        .ficha > div:first-child {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
        }
      `}</style>

      <div className="cabecalho-ficha">
        <div>
          <label className="retrato" style={personagem.imagem ? { backgroundImage: `url(${personagem.imagem})` } : undefined}>
            {!personagem.imagem && 'Foto ou GIF'}
            <input type="file" accept="image/*,image/gif" onChange={escolherFoto} />
          </label>
          {personagem.imagem && (
            <button className="btn ghost sm" style={{ marginTop: 6, width: '100%' }} onClick={() => set({ imagem: null })}>
              Tirar foto
            </button>
          )}
          {erroFoto && <div className="aviso" style={{ maxWidth: 200, fontSize: 11 }}>{erroFoto}</div>}
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

      {/* Grid Principal da Ficha */}
      <div className="ficha">
        {/* Coluna Esquerda com o Token/Imagem do Agente Centrados */}
        <div>
          <RodaAtributos
            atributos={personagem.atributos}
            mini
            onRolar={(a, valor) => onRolar(rolarTeste({ nome: a.nome, dados: valor, bonus: 0, detalhe: a.sigla }))}
            onChange={(id, v) => {
              if (v < 0 || v > REGRAS_ATRIBUTOS.maximoAbsoluto) return;
              setComRecursos({ atributos: { ...personagem.atributos, [id]: v } });
            }}
            podeSubir={(id) => personagem.atributos[id] < REGRAS_ATRIBUTOS.maximoAbsoluto}
            podeDescer={(id) => personagem.atributos[id] > 0}
          />

          <div className="linha-regras" style={{ width: '100%', textAlign: 'center' }}>
            <button className="btn ghost sm" onClick={() => setVerRegras(true)}>
              Regras opcionais
              {(regras.nivelSeparado || regras.semSanidade) && <span className="ponto-ligado" title="Há regras ligadas" />}
            </button>
          </div>

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
              maxManual={personagem.pvMaxManual} onMaxManualChange={(v) => set({ pvMaxManual: v })}
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
                  maxManual={personagem.sanMaxManual} onMaxManualChange={(v) => set({ sanMaxManual: v })}
                />
                <BarraRecurso
                  titulo="ESFORÇO" classe="barra-esforco"
                  atual={personagem.peAtual ?? max.pe} max={max.pe} onChange={(v) => set({ peAtual: v })}
                  temp={personagem.peTemp || 0} onTemp={(v) => set({ peTemp: v })}
                  maxManual={personagem.peMaxManual} onMaxManualChange={(v) => set({ peMaxManual: v })}
                />
              </>
            )}
          </div>

          <div className="defesas" style={{ width: '100%' }}>
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

          <div style={{ width: '100%' }}>
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
        </div>

        {/* Coluna do Meio */}
        <div>
          <TabelaPericias personagem={personagem} setPersonagem={setPersonagem} onRolar={onRolar} />
        </div>

        {/* Coluna Direita */}
        <div>
          <div className="abas">
            {ABAS.map((a) => (
              <button key={a.id} className={aba === a.id ? 'ativa' : ''} onClick={() => setAba(a.id)}>{a.nome}</button>
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
      </div>
    </div>
  );
}