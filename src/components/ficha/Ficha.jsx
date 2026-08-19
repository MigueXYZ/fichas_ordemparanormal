import React, { useRef, useState } from 'react';
import RodaAtributos from '../RodaAtributos.jsx';
import BarraRecurso from './BarraRecurso.jsx';
import TabelaPericias from './TabelaPericias.jsx';
import { AbaCombate, AbaHabilidades, AbaRituais, AbaInventario, AbaDescricao } from './Abas.jsx';
import { CLASSES, trilhasDaClasse } from '../../data/classes.js';
import { ORIGENS } from '../../data/origens.js';
import { REGRAS_ATRIBUTOS } from '../../data/atributos.js';
import { calcMaximos, calcDefesas, calcPePorRodada, NEX_TRACK } from '../../engine/calc.js';
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

  const max = calcMaximos(personagem);
  const d = calcDefesas(personagem);
  const set = (patch) => setPersonagem({ ...personagem, ...patch });
  const setComRecursos = (patch) => setPersonagem(ajustarRecursos(personagem, { ...personagem, ...patch }));
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
            <select
              value={personagem.trilhaId || ''}
              disabled={personagem.nex < 10}
              onChange={(e) => set({ trilhaId: e.target.value || null })}
            >
              <option value="">{personagem.nex < 10 ? 'A partir de NEX 10%' : '—'}</option>
              {trilhasDaClasse(personagem.classeId).map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="ficha">
        {/* ---------------- coluna esquerda ---------------- */}
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

          <div className="nex-linha">
            <div className="nex-bloco">
              <span>NEX</span>
              <div className="caixa">
                <select
                  value={personagem.nex}
                  onChange={(e) => setComRecursos({ nex: Number(e.target.value) })}
                  style={{ background: 'transparent', border: 'none', padding: 0, boxShadow: 'none' }}
                >
                  {NEX_TRACK.map((n) => <option key={n} value={n}>{n}%</option>)}
                </select>
              </div>
            </div>
            <div className="nex-bloco">
              <span>PE / turno</span>
              <div className="caixa">{calcPePorRodada(personagem.nex)}</div>
            </div>
            <div className="nex-bloco">
              <span>Deslocamento</span>
              <div className="caixa">{personagem.deslocamento} m / {Math.round(personagem.deslocamento / 1.5)} q</div>
            </div>
          </div>

          <BarraRecurso titulo="VIDA" classe="barra-vida" atual={personagem.pvAtual ?? max.pv} max={max.pv} onChange={(v) => set({ pvAtual: v })} />
          <BarraRecurso titulo="SANIDADE" classe="barra-sanidade" atual={personagem.sanAtual ?? max.san} max={max.san} onChange={(v) => set({ sanAtual: v })} />
          <BarraRecurso titulo="ESFORÇO" classe="barra-esforco" atual={personagem.peAtual ?? max.pe} max={max.pe} onChange={(v) => set({ peAtual: v })} />

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

            <div className={'defesa-caixa' + (d.bloqueio.disponivel ? '' : ' inativa')} title={d.bloqueio.disponivel ? d.bloqueio.formula : d.bloqueio.requisito}>
              <div className="rotulo">Bloqueio</div>
              <span className="num">{d.bloqueio.disponivel ? d.bloqueio.valor : '—'}</span>
              <div className="conta">
                RD = Fortitude {d.bloqueio.base >= 0 ? '+' : '−'}{Math.abs(d.bloqueio.base)}
                <br />
                extra <input type="number" value={personagem.bloqueioExtra || 0} onChange={(e) => set({ bloqueioExtra: Number(e.target.value) })} />
              </div>
            </div>

            <div className={'defesa-caixa' + (d.esquiva.disponivel ? '' : ' inativa')} title={d.esquiva.disponivel ? d.esquiva.formula : d.esquiva.requisito}>
              <div className="rotulo">Esquiva</div>
              <span className="num">{d.esquiva.disponivel ? d.esquiva.valor : '—'}</span>
              <div className="conta">
                Defesa + Reflexos {d.esquiva.base >= 0 ? '+' : '−'}{Math.abs(d.esquiva.base)}
                <br />
                extra <input type="number" value={personagem.esquivaExtra || 0} onChange={(e) => set({ esquivaExtra: Number(e.target.value) })} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <div className="campo-linha"><label>Proteção</label><input type="text" value={personagem.protecao} onChange={(e) => set({ protecao: e.target.value })} /></div>
            <div className="campo-linha"><label>Resistências</label><input type="text" value={personagem.resistencias} onChange={(e) => set({ resistencias: e.target.value })} /></div>
            <div className="campo-linha"><label>Proficiências</label><input type="text" value={personagem.proficiencias} onChange={(e) => set({ proficiencias: e.target.value })} /></div>
          </div>
        </div>

        {/* ---------------- coluna do meio ---------------- */}
        <div>
          <TabelaPericias personagem={personagem} setPersonagem={setPersonagem} onRolar={onRolar} />
        </div>

        {/* ---------------- coluna direita ---------------- */}
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
