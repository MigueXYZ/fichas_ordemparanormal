import React, { useState } from 'react';
import { CLASSES } from '../data/classes.js';
import { ORIGENS } from '../data/origens.js';
import { NEX_TRACK } from '../engine/calc.js';
import {
  CONCEITOS, ARQUETIPOS_AMEACA, VD_SUGERIDOS, TAMANHOS,
  gerarFicha, gerarNpcAgente, gerarAmeaca, vdParaGrupo,
} from '../engine/geradores.js';

const SEPARADORES = [
  { id: 'ficha', nome: 'Ficha aleatória' },
  { id: 'npc', nome: 'NPC agente' },
  { id: 'ameaca', nome: 'Ameaça' },
];

function Resumo({ p }) {
  const classe = CLASSES.find((c) => c.id === p.classeId);
  const origem = ORIGENS.find((o) => o.id === p.origemId);
  const treinadas = Object.entries(p.pericias)
    .filter(([, v]) => v.grau !== 'destreinado')
    .map(([k]) => k);
  return (
    <div className="previa">
      <div className="previa-nome">{p.nome}</div>
      <div className="previa-linha">{[origem?.nome, classe?.nome, `NEX ${p.nex}%`].filter(Boolean).join(' · ')}</div>
      <div className="previa-attrs">
        {Object.entries(p.atributos).map(([k, v]) => (
          <span key={k}><b>{v}</b> {k.toUpperCase()}</span>
        ))}
      </div>
      <div className="previa-linha">{treinadas.length} perícias treinadas · {p.ataques?.[0]?.nome || 'sem arma'}</div>
    </div>
  );
}

function FichaAmeacaPrevia({ a }) {
  return (
    <div className="previa">
      <div className="previa-nome">{a.nome}</div>
      <div className="previa-linha">{a.descritores.join(' · ')} · {a.tamanho} · VD {a.vd}</div>
      <div className="previa-attrs">
        <span><b>{a.defesa}</b> DEFESA</span>
        <span><b>{a.pv}</b> PV</span>
        <span><b>{a.dt}</b> DT</span>
      </div>
      <div className="previa-linha">{a.ataque.nome}: {a.ataque.teste} · dano {a.ataque.dano} {a.ataque.tipo}</div>
    </div>
  );
}

export default function Geradores({ aoFechar, aoGuardar, aoAbrir }) {
  const [aba, setAba] = useState('ficha');
  const [nex, setNex] = useState(5);
  const [conceito, setConceito] = useState('surpresa');
  const [classeId, setClasseId] = useState('');
  const [origemId, setOrigemId] = useState('');
  const [vd, setVd] = useState(20);
  const [arquetipo, setArquetipo] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [nexGrupo, setNexGrupo] = useState(20);
  const [resultado, setResultado] = useState(null);

  function gerar() {
    if (aba === 'ameaca') {
      setResultado(gerarAmeaca({ vd: Number(vd), arquetipo: arquetipo || null, tamanho: tamanho || null }));
      return;
    }
    const opcoes = { nex: Number(nex), conceito, classeId: classeId || null, origemId: origemId || null };
    setResultado(aba === 'npc' ? gerarNpcAgente(opcoes) : gerarFicha(opcoes));
  }

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal">
        <div className="modal-topo">
          <h3>Geradores</h3>
          <button className="fechar" onClick={aoFechar} aria-label="Fechar">✕</button>
        </div>

        <div className="modal-corpo">
          <div className="abas" style={{ marginBottom: 20 }}>
            {SEPARADORES.map((s) => (
              <button
                key={s.id}
                className={aba === s.id ? 'ativa' : ''}
                onClick={() => { setAba(s.id); setResultado(null); }}
              >
                {s.nome}
              </button>
            ))}
          </div>

          {aba !== 'ameaca' && (
            <>
              <p className="dica" style={{ marginTop: 0 }}>
                {aba === 'npc'
                  ? 'NPC com ficha de agente completa — aliado da Ordem, rival ou vilão. Nome em português de Portugal.'
                  : 'Uma ficha jogável inteira: atributos, origem, classe, trilha, perícias, arma e equipamento.'}
              </p>
              <div className="grelha-editor">
                <div className="campo">
                  <label>NEX</label>
                  <select value={nex} onChange={(e) => setNex(Number(e.target.value))}>
                    {NEX_TRACK.map((n) => <option key={n} value={n}>{n}%</option>)}
                  </select>
                </div>
                <div className="campo">
                  <label>Conceito</label>
                  <select value={conceito} onChange={(e) => setConceito(e.target.value)}>
                    {CONCEITOS.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
                <div className="campo">
                  <label>Classe</label>
                  <select value={classeId} onChange={(e) => setClasseId(e.target.value)}>
                    <option value="">Ao acaso</option>
                    {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
                <div className="campo">
                  <label>Origem</label>
                  <select value={origemId} onChange={(e) => setOrigemId(e.target.value)}>
                    <option value="">Ao acaso</option>
                    {ORIGENS.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {aba === 'ameaca' && (
            <>
              <p className="dica" style={{ marginTop: 0 }}>
                Os números saem da média das 41 fichas de ameaça do Livro Base, ajustados ao VD.
                Regra do livro: soma o VD de todas as ameaças e compara com a soma do NEX do grupo.
              </p>
              <div className="grelha-editor">
                <div className="campo">
                  <label>Valor de desafio</label>
                  <select value={vd} onChange={(e) => setVd(Number(e.target.value))}>
                    {VD_SUGERIDOS.map((v) => <option key={v} value={v}>VD {v}</option>)}
                  </select>
                </div>
                <div className="campo">
                  <label>Arquétipo</label>
                  <select value={arquetipo} onChange={(e) => setArquetipo(e.target.value)}>
                    <option value="">Ao acaso</option>
                    {ARQUETIPOS_AMEACA.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
                  </select>
                </div>
                <div className="campo">
                  <label>Tamanho</label>
                  <select value={tamanho} onChange={(e) => setTamanho(e.target.value)}>
                    <option value="">Automático</option>
                    {TAMANHOS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="campo">
                  <label>NEX somado do grupo</label>
                  <input type="number" value={nexGrupo} onChange={(e) => setNexGrupo(Number(e.target.value))} />
                  <span className="dica">
                    fácil {vdParaGrupo(nexGrupo, 'facil')} · equilibrado {vdParaGrupo(nexGrupo)} · difícil {vdParaGrupo(nexGrupo, 'dificil')}
                  </span>
                </div>
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn" onClick={gerar}>Gerar</button>
            {resultado && <button className="btn ghost" onClick={gerar}>Outra vez</button>}
          </div>

          {resultado && (resultado.tipo === 'ameaca'
            ? <FichaAmeacaPrevia a={resultado} />
            : <Resumo p={resultado} />)}
        </div>

        <div className="modal-acoes">
          <button className="btn ghost" onClick={aoFechar}>Fechar</button>
          {resultado && (
            <>
              <button className="btn ghost" onClick={() => { aoGuardar(resultado); aoFechar(); }}>Guardar</button>
              {resultado.tipo !== 'ameaca' && (
                <button className="btn" onClick={() => { const g = aoGuardar(resultado); aoAbrir(g || resultado); }}>
                  Guardar e abrir
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
