import React, { useState } from 'react';
import RodaAtributos from '../RodaAtributos.jsx';
import BarraRecurso from './BarraRecurso.jsx';
import TabelaPericias from './TabelaPericias.jsx';
import { AbaCombate, AbaHabilidades, AbaRituais, AbaInventario, AbaDescricao } from './Abas.jsx';
import { CLASSES, trilhasDaClasse } from '../../data/classes.js';
import { ORIGENS } from '../../data/origens.js';
import { REGRAS_ATRIBUTOS } from '../../data/atributos.js';
import { calcMaximos, calcDefesa, calcPePorRodada, NEX_TRACK } from '../../engine/calc.js';
import { ajustarRecursos } from '../../engine/character.js';

const ABAS = [
  { id: 'combate', nome: 'Combate' },
  { id: 'habilidades', nome: 'Habilidades' },
  { id: 'rituais', nome: 'Rituais' },
  { id: 'inventario', nome: 'Inventário' },
  { id: 'descricao', nome: 'Descrição' },
];

export default function Ficha({ personagem, setPersonagem }) {
  const [aba, setAba] = useState('combate');
  const [rolagem, setRolagem] = useState(null);

  const max = calcMaximos(personagem);
  const defesa = calcDefesa(personagem);
  const set = (patch) => setPersonagem({ ...personagem, ...patch });
  // mudanças que alteram os máximos: acompanha os valores atuais
  const setComRecursos = (patch) => setPersonagem(ajustarRecursos(personagem, { ...personagem, ...patch }));
  const nomeOrigem = personagem.origemId === '__custom__'
    ? personagem.origemCustom?.nome || 'Personalizada'
    : ORIGENS.find((o) => o.id === personagem.origemId)?.nome || '';

  return (
    <div className="container">
      <div className="cabecalho-ficha">
        <div>
          <div className="campo-linha">
            <label>Personagem</label>
            <input type="text" value={personagem.nome} onChange={(e) => set({ nome: e.target.value })} />
          </div>
          <div className="campo-linha">
            <label>Origem</label>
            <input type="text" value={nomeOrigem} readOnly />
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
              {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div className="campo-linha">
            <label>Trilha</label>
            <select
              value={personagem.trilhaId || ''}
              disabled={personagem.nex < 10}
              onChange={(e) => set({ trilhaId: e.target.value || null })}
              title={personagem.nex < 10 ? 'A trilha é escolhida em NEX 10%' : ''}
            >
              <option value="">{personagem.nex < 10 ? 'Escolhe a classe e chega a NEX 10%' : '—'}</option>
              {trilhasDaClasse(personagem.classeId).map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="ficha">
        {/* coluna esquerda */}
        <div>
          <RodaAtributos
            atributos={personagem.atributos}
            mini
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
                  style={{ background: 'transparent', border: 'none', padding: 0 }}
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

          <div className="defesa-bloco">
            <div className="escudo">{defesa}</div>
            <div className="defesa-info">
              <b>DEFESA</b>
              = 10 + AGI +
              <input
                type="number"
                style={{ width: 46, margin: '0 4px' }}
                value={personagem.defesaEquipamento}
                onChange={(e) => set({ defesaEquipamento: Number(e.target.value) })}
              />
              equip. +
              <input
                type="number"
                style={{ width: 46, margin: '0 4px' }}
                value={personagem.defesaOutros}
                onChange={(e) => set({ defesaOutros: Number(e.target.value) })}
              />
              outros
            </div>
          </div>

          <div style={{ display: 'flex', gap: 14, marginTop: 12 }}>
            <div className="campo" style={{ flex: 1 }}>
              <label>Bloqueio</label>
              <input type="number" value={personagem.bloqueio} onChange={(e) => set({ bloqueio: Number(e.target.value) })} />
            </div>
            <div className="campo" style={{ flex: 1 }}>
              <label>Esquiva</label>
              <input type="number" value={personagem.esquiva} onChange={(e) => set({ esquiva: Number(e.target.value) })} />
            </div>
          </div>

          <div className="campo-linha"><label>Proteção</label><input type="text" value={personagem.protecao} onChange={(e) => set({ protecao: e.target.value })} /></div>
          <div className="campo-linha"><label>Resistências</label><input type="text" value={personagem.resistencias} onChange={(e) => set({ resistencias: e.target.value })} /></div>
          <div className="campo-linha"><label>Proficiências</label><input type="text" value={personagem.proficiencias} onChange={(e) => set({ proficiencias: e.target.value })} /></div>
        </div>

        {/* coluna do meio */}
        <div>
          <TabelaPericias personagem={personagem} setPersonagem={setPersonagem} onRolagem={(r) => { setRolagem(r); setAba('combate'); }} />
        </div>

        {/* coluna direita */}
        <div>
          <div className="abas">
            {ABAS.map((a) => (
              <button key={a.id} className={aba === a.id ? 'ativa' : ''} onClick={() => setAba(a.id)}>{a.nome}</button>
            ))}
          </div>
          {aba === 'combate' && <AbaCombate personagem={personagem} setPersonagem={setPersonagem} rolagem={rolagem} setRolagem={setRolagem} />}
          {aba === 'habilidades' && <AbaHabilidades personagem={personagem} setPersonagem={setPersonagem} />}
          {aba === 'rituais' && <AbaRituais personagem={personagem} setPersonagem={setPersonagem} />}
          {aba === 'inventario' && <AbaInventario personagem={personagem} setPersonagem={setPersonagem} />}
          {aba === 'descricao' && <AbaDescricao personagem={personagem} setPersonagem={setPersonagem} />}
        </div>
      </div>
    </div>
  );
}
