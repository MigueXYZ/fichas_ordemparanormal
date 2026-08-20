import React, { useRef, useState } from 'react';
import RodaAtributos from '../RodaAtributos.jsx';
import BarraRecurso from './BarraRecurso.jsx';
import TabelaPericias from './TabelaPericias.jsx';
import { AbaCombate, AbaHabilidades, AbaRituais, AbaInventario, AbaDescricao } from './Abas.jsx';
import { CLASSES, trilhasDaClasse } from '../../data/classes.js';
import { ORIGENS } from '../../data/origens.js';
import { REGRAS_ATRIBUTOS } from '../../data/atributos.js';
import { calcMaximos, calcDefesas, calcPePorRodada, degrauNex, nexEfetivo, NEX_TRACK } from '../../engine/calc.js';
import RegrasOpcionais from './RegrasOpcionais.jsx';
import { ajustarRecursos } from '../../engine/character.js';
import { lerImagem } from '../../engine/armazenamento.js';
import { rolarTeste } from '../../engine/dados.js';

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

  const trilhaAtual = (personagem.trilhaId || '').toLowerCase();
  const ehMonstruoso = trilhaAtual.includes('monstruoso');

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
          <div className="campo-linha" style={{ position: 'relative' }}>
            <label>Trilha</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <select
                style={{ width: '100%', paddingRight: ehMonstruoso ? '36px' : '10px' }}
                value={personagem.trilhaId || ''}
                disabled={nexUtil < 10}
                onChange={(e) => {
                  const novaTrilha = e.target.value || null;
                  if (novaTrilha && novaTrilha.toLowerCase().includes('monstruoso') && !personagem.monstruosoElemento) {
                    const elem = prompt('Escolhe o elemento (Sangue, Morte, Conhecimento ou Energia):', 'Sangue');
                    if (elem) {
                      const limpo = elem.trim().toLowerCase();
                      const valido = ['sangue', 'morte', 'conhecimento', 'energia'].find(el => limpo.includes(el));
                      if (valido) {
                        set({ trilhaId: novaTrilha, monstruosoElemento: valido });
                        return;
                      }
                    }
                  }
                  set({ trilhaId: novaTrilha });
                }}
              >
                <option value="">{nexUtil < 10 ? (regras.nivelSeparado ? 'A partir do nível 2' : 'A partir de NEX 10%') : '—'}</option>
                {trilhasDaClasse(personagem.classeId).map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>

              {ehMonstruoso && (
                <button
                  type="button"
                  title={personagem.monstruosoAtivo ? `Monstruoso (${personagem.monstruosoElemento}) Ativo` : `Ativar Monstruoso (${personagem.monstruosoElemento || 'Elemento'})`}
                  onClick={() => {
                    if (!personagem.monstruosoElemento) {
                      const elem = prompt('Escolhe o elemento (Sangue, Morte, Conhecimento ou Energia):', 'Sangue');
                      if (!elem) return;
                      const limpo = elem.trim().toLowerCase();
                      const valido = ['sangue', 'morte', 'conhecimento', 'energia'].find(el => limpo.includes(el));
                      if (!valido) return;
                      set({ monstruosoElemento: valido });
                      return;
                    }

                    if (personagem.monstruosoAtivo) {
                      set({ monstruosoAtivo: false });
                      return;
                    }

                    const inv = [...(personagem.inventario || [])];
                    const idxComp = inv.findIndex(item => 
                      item.nome && item.nome.toLowerCase().includes('componentes')
                    );

                    if (idxComp === -1) {
                      alert('Não tens "Componentes Ritualísticos" no inventário para realizar o experimento!');
                      return;
                    }

                    const itemComp = inv[idxComp];
                    const qtd = Number(itemComp.quantidade || 1);
                    if (qtd > 1) {
                      inv[idxComp] = { ...itemComp, quantidade: qtd - 1 };
                    } else {
                      inv.splice(idxComp, 1);
                    }

                    setComRecursos({
                      inventario: inv,
                      monstruosoAtivo: true,
                    });
                    
                    onRolar(rolarTeste({ nome: `Experimento Monstruoso (${personagem.monstruosoElemento})`, dados: 1, bonus: 0, detalhe: 'Ativado' }));
                  }}
                  style={{
                    position: 'absolute',
                    right: '24px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '1px solid var(--sangue)',
                    background: personagem.monstruosoAtivo ? 'var(--sangue)' : 'var(--bg-4)',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '9px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textTransform: 'uppercase',
                    zIndex: 5
                  }}
                >
                  {personagem.monstruosoElemento ? personagem.monstruosoElemento[0] : 'M'}
                </button>
              )}
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

      <div className="ficha">
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

          <div className="linha-regras">
            <button className="btn ghost sm" onClick={() => setVerRegras(true)}>
              Regras opcionais
              {(regras.nivelSeparado || regras.semSanidade) && <span className="ponto-ligado" title="Há regras ligadas" />}
            </button>
          </div>

          <div className="nex-linha">
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
              <div className="caixa">{personagem.deslocamento} m / {Math.round(personagem.deslocamento / 1.5)} q</div>
            </div>
          </div>

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
          <div className="defesas">
            <div className="defesa-caixa">
              <div className="rotulo">Defesa</div>
              <span className="num">{d.defesa}</span>
              <div className="conta">
                10 + AGI +
                <input type="number" value={personagem.defesaEquipamento} onChange={(e) => set({ defesaEquipamento: Number(e.target.value) })} title="Equipamento" />
                +
                <input type="number" value={personagem.defesaOutros} onChange={(e) => set({ defesaOutros: Number(e.target.value) })} title="Outros" />
              </div>
            </div>

            <div className={'defesa-caixa' + (d.bloqueio.disponivel ? '' : ' inativa')} title={d.bloqueio.formula}>
              <div className="rotulo">Bloqueio</div>
              <input
                className="num"
                type="number"
                value={d.bloqueio.manual ? personagem.bloqueioManual : (d.bloqueio.disponivel ? d.bloqueio.valor : '')}
                placeholder=""
                title="Escreve o valor à mão; deixa vazio para voltar ao automático"
                onChange={(e) => set({ bloqueioManual: e.target.value === '' ? null : Number(e.target.value) })}
              />
              <div className="conta">
                RD = Fortitude {d.bloqueio.base >= 0 ? '+' : '−'}{Math.abs(d.bloqueio.base)}
                <br />
                extra <input type="number" value={personagem.bloqueioExtra || 0} onChange={(e) => set({ bloqueioExtra: Number(e.target.value) })} />
                {d.bloqueio.manual && (
                  <button type="button" className="voltar-auto" onClick={() => set({ bloqueioManual: null })}>auto ({d.bloqueio.auto})</button>
                )}
              </div>
            </div>

            <div className={'defesa-caixa' + (d.esquiva.disponivel ? '' : ' inativa')} title={d.esquiva.formula}>
              <div className="rotulo">Esquiva</div>
              <input
                className="num"
                type="number"
                value={d.esquiva.manual ? personagem.esquivaManual : (d.esquiva.disponivel ? d.esquiva.valor : '')}
                placeholder=""
                title="Escreve o valor à mão; deixa vazio para voltar ao automático"
                onChange={(e) => set({ esquivaManual: e.target.value === '' ? null : Number(e.target.value) })}
              />
              <div className="conta">
                Defesa + Reflexos {d.esquiva.base >= 0 ? '+' : '−'}{Math.abs(d.esquiva.base)}
                <br />
                extra <input type="number" value={personagem.esquivaExtra || 0} onChange={(e) => set({ esquivaExtra: Number(e.target.value) })} />
                {d.esquiva.manual && (
                  <button type="button" className="voltar-auto" onClick={() => set({ esquivaManual: null })}>auto ({d.esquiva.auto})</button>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <div className="campo-linha"><label>Proteção</label><input type="text" value={personagem.protecao} onChange={(e) => set({ protecao: e.target.value })} /></div>
            <div className="campo-linha"><label>Resistências</label><input type="text" value={personagem.resistencias} onChange={(e) => set({ resistencias: e.target.value })} /></div>
            <div className="campo-linha"><label>Proficiências</label><input type="text" value={personagem.proficiencias} onChange={(e) => set({ proficiencias: e.target.value })} /></div>
          </div>
        </div>

        <div>
          <TabelaPericias personagem={personagem} setPersonagem={setPersonagem} onRolar={onRolar} />
        </div>

        <div>
          <div className="abas">
            {ABAS.map((a) => (
              <button key={a.id} className={aba === a.id ? 'ativa' : ''} onClick={() => setAba(a.id)}>{a.nome}</button>
            ))}
          </div>
          {aba === 'combate' && <AbaCombate personagem={personagem} setPersonagem={setPersonagem} onRolar={onRolar} />}
          {aba === 'habilidades' && <AbaHabilidades personagem={personagem} setPersonagem={setPersonagem} />}
          {aba === 'rituais' && <AbaRituais personagem={personagem} setPersonagem={setPersonagem} />}
          {aba === 'inventario' && <AbaInventario personagem={personagem} setPersonagem={setPersonagem} />}
          {aba === 'descricao' && <AbaDescricao personagem={personagem} setPersonagem={setPersonagem} />}
        </div>
      </div>
    </div>
  );
}