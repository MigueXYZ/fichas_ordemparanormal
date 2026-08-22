import React, { useRef, useState } from 'react';
import { PERICIAS } from '../../data/pericias.js';
import { ATRIBUTOS } from '../../data/atributos.js';
import { TIPOS_DANO } from '../../data/itens.js';
import { CATEGORIAS } from '../../data/patentes.js';
import { MODIFICACOES_ARMA, ALCANCES, aplicarModificacoes } from '../../data/modificacoesArma.js';
import { lerImagem } from '../../engine/armazenamento.js';
import { obterInfoTipoDano } from '../ExibirDano.jsx';

const MULTIPLICADORES = [2, 3, 4];

/** Janela de edição de uma arma/ataque, com modificações do livro. */
export default function EditorArma({ arma, aoGuardar, aoFechar }) {
  const [a, setA] = useState({
    nome: '', dano: '', margem: 20, multiplicador: 2, bonus: 0, tipo: '', alcance: '',
    pericia: 'luta', atributoDano: '', espacos: '', categoria: '', agil: false, danoExtra: [], modificacoes: [], notas: '',
    ...arma,
  });
  const set = (patch) => setA({ ...a, ...patch });
  const mods = aplicarModificacoes(a);
  const [novoExtraExpr, setNovoExtraExpr] = useState('');
  const [novoExtraTipo, setNovoExtraTipo] = useState('');
  const [erroImagem, setErroImagem] = useState(null);
  const ficheiro = useRef(null);

  async function escolherImagem(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErroImagem(null);
    try {
      set({ imagem: await lerImagem(f, 260) });
    } catch (err) {
      setErroImagem(err.message);
    }
    e.target.value = '';
  }

  function alternarMod(id) {
    const lista = a.modificacoes || [];
    set({ modificacoes: lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id] });
  }

  function adicionarDanoExtra() {
    if (!novoExtraExpr.trim()) return;
    const m = novoExtraExpr.trim().match(/^(\d*d\d+(?:[+-]\d+)?)(?:\s+([a-zA-Záàãâéêíóôõúç]+))?/i);
    const expr = m ? m[1] : novoExtraExpr.trim();
    const tipo = novoExtraTipo || (m ? m[2] : '') || '';
    const item = { expr, tipoDano: tipo || '' };
    set({ danoExtra: [...(a.danoExtra || []), item] });
    setNovoExtraExpr('');
  }

  function guardarFinal() {
    let danoExtraFinal = [...(a.danoExtra || [])];
    if (novoExtraExpr.trim()) {
      const m = novoExtraExpr.trim().match(/^(\d*d\d+(?:[+-]\d+)?)(?:\s+([a-zA-Záàãâéêíóôõúç]+))?/i);
      const expr = m ? m[1] : novoExtraExpr.trim();
      const tipo = novoExtraTipo || (m ? m[2] : '') || '';
      danoExtraFinal.push({ expr, tipoDano: tipo || '' });
    }
    aoGuardar({ ...a, danoExtra: danoExtraFinal });
  }

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal">
        <div className="modal-topo">
          <h3>{arma?.nome ? `Editar — ${arma.nome}` : 'Nova arma'}</h3>
          <button className="fechar" onClick={aoFechar} aria-label="Fechar">✕</button>
        </div>

        <div className="modal-corpo">
          <div className="campo">
            <label>Nome</label>
            <input type="text" value={a.nome} onChange={(e) => set({ nome: e.target.value })} placeholder="Ex.: Machete" />
          </div>

          <div className="grelha-editor">
            <div className="campo">
              <label>Dano</label>
              <input type="text" value={a.dano} onChange={(e) => set({ dano: e.target.value })} placeholder="1d6" />
            </div>
            <div className="campo">
              <label>Margem de crítico</label>
              <input type="number" min="2" max="20" value={a.margem} onChange={(e) => set({ margem: Number(e.target.value) })} />
              <span className="dica">19 = crítico com 19 ou 20</span>
            </div>
            <div className="campo">
              <label>Multiplicador</label>
              <select value={a.multiplicador} onChange={(e) => set({ multiplicador: Number(e.target.value) })}>
                {MULTIPLICADORES.map((m) => <option key={m} value={m}>×{m}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Ataque bónus</label>
              <input type="number" value={a.bonus} onChange={(e) => set({ bonus: Number(e.target.value) })} />
            </div>
            <div className="campo">
              <label>Tipo de dano</label>
              <select value={a.tipo} onChange={(e) => set({ tipo: e.target.value })}>
                <option value="">—</option>
                {TIPOS_DANO.map((t) => <option key={t.id} value={t.nome}>{t.nome}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Alcance</label>
              <select value={a.alcance} onChange={(e) => set({ alcance: e.target.value })}>
                <option value="">Corpo a corpo</option>
                {ALCANCES.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Perícia de ataque</label>
              <select value={a.pericia} onChange={(e) => set({ pericia: e.target.value })}>
                {PERICIAS.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Atributo no dano</label>
              <select value={a.atributoDano} onChange={(e) => set({ atributoDano: e.target.value })}>
                <option value="">Nenhum</option>
                {ATRIBUTOS.map((x) => <option key={x.id} value={x.id}>{x.nome}</option>)}
              </select>
              <span className="dica">Corpo a corpo e arremesso somam Força</span>
            </div>
            <div className="campo">
              <label>Espaços</label>
              <input type="number" value={a.espacos} onChange={(e) => set({ espacos: e.target.value })} />
            </div>
            <div className="campo">
              <label>Categoria</label>
              <select value={a.categoria} onChange={(e) => set({ categoria: e.target.value })}>
                <option value="">—</option>
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Arma ágil</label>
              <div className="interruptor" style={{ width: 'fit-content' }}>
                <button type="button" className={a.agil ? '' : 'ativo'} onClick={() => set({ agil: false })}>Não</button>
                <button type="button" className={a.agil ? 'ativo' : ''} onClick={() => set({ agil: true })}>Sim</button>
              </div>
              <span className="dica">Facas, punhais, cajados, nunchakus, floretes e katanas: usam Agilidade em vez de Força no ataque e no dano</span>
            </div>
          </div>

          <div className="campo">
            <label>Dano extra</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {(a.danoExtra || []).map((d, i) => {
                const expr = typeof d === 'string' ? d : d?.expr;
                const tipo = typeof d === 'object' ? d?.tipoDano : '';
                const info = obterInfoTipoDano(tipo);
                return (
                  <span
                    key={i}
                    className="pill"
                    style={{
                      display: 'inline-flex',
                      gap: 6,
                      alignItems: 'center',
                      borderColor: info.cor ? info.cor : undefined,
                      color: info.cor ? info.cor : undefined,
                    }}
                  >
                    <span>+{expr}{info.abrev ? ` ${info.abrev}` : ''}</span>
                    <button
                      type="button"
                      className="fechar"
                      style={{ fontSize: 12, color: 'inherit' }}
                      onClick={() => set({ danoExtra: a.danoExtra.filter((_, j) => j !== i) })}
                    >
                      ✕
                    </button>
                  </span>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 8 }}>
              <input
                type="text"
                placeholder="Dano (ex.: 1d6)"
                value={novoExtraExpr}
                onChange={(e) => setNovoExtraExpr(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    adicionarDanoExtra();
                  }
                }}
                style={{ maxWidth: 140 }}
              />
              <select
                value={novoExtraTipo}
                onChange={(e) => setNovoExtraTipo(e.target.value)}
                style={{ maxWidth: 170 }}
              >
                <option value="">Tipo (Padrão/Físico)</option>
                <optgroup label="Elementos Paranormais">
                  <option value="Sangue">🩸 Sangue</option>
                  <option value="Morte">💀 Morte</option>
                  <option value="Energia">⚡ Energia</option>
                  <option value="Conhecimento">👁️ Conhecimento</option>
                  <option value="Medo">🕯️ Medo</option>
                </optgroup>
                <optgroup label="Físico & Outros">
                  <option value="Balístico">Balístico</option>
                  <option value="Corte">Corte</option>
                  <option value="Impacto">Impacto</option>
                  <option value="Perfuração">Perfuração</option>
                  <option value="Fogo">Fogo</option>
                  <option value="Eletricidade">Eletricidade</option>
                  <option value="Químico">Químico</option>
                  <option value="Mental">Mental</option>
                </optgroup>
              </select>
              <button
                type="button"
                className="btn sm ghost"
                onClick={adicionarDanoExtra}
              >
                + Adicionar
              </button>
            </div>
            <span className="dica">Dados extra não são multiplicados num acerto crítico.</span>
          </div>

          <div className="campo">
            <label>Modificações</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {MODIFICACOES_ARMA.map((m) => {
                const ativa = (a.modificacoes || []).includes(m.id);
                return (
                  <button
                    key={m.id} type="button" title={m.texto}
                    className={'btn sm' + (ativa ? '' : ' ghost')}
                    onClick={() => alternarMod(m.id)}
                  >
                    {m.nome}
                  </button>
                );
              })}
            </div>
            {mods.lista.length > 0 && (
              <div className="resumo-mods">
                {mods.ataque ? <span className="pill">ataque +{mods.ataque}</span> : null}
                {mods.dano ? <span className="pill">dano +{mods.dano}</span> : null}
                {mods.margem ? <span className="pill">margem +{mods.margem}</span> : null}
                {mods.dadosDano ? <span className="pill">+{mods.dadosDano} dado de dano</span> : null}
                {mods.espacos ? <span className="pill">espaços {mods.espacos}</span> : null}
                {mods.danoExtra.map((d) => <span key={d} className="pill">dano extra {d}</span>)}
                <span className="pill">categoria +{mods.categoriaExtra}</span>
              </div>
            )}
          </div>

          <div className="campo">
            <label>Imagem ou GIF da arma</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div className="miniatura-arma" style={a.imagem ? { backgroundImage: `url(${a.imagem})` } : undefined}>
                {!a.imagem && '—'}
              </div>
              <button className="btn ghost sm" onClick={() => ficheiro.current?.click()}>Escolher</button>
              {a.imagem && <button className="btn danger sm" onClick={() => set({ imagem: null })}>Remover</button>}
              <input ref={ficheiro} type="file" accept="image/*,image/gif" style={{ display: 'none' }} onChange={escolherImagem} />
            </div>
            {erroImagem && <span className="dica" style={{ color: 'var(--warn)' }}>{erroImagem}</span>}
          </div>

          <div className="campo">
            <label>Notas</label>
            <textarea value={a.notas} onChange={(e) => set({ notas: e.target.value })} style={{ minHeight: 60 }} />
          </div>
        </div>

        <div className="modal-acoes">
          <button className="btn ghost" onClick={aoFechar}>Cancelar</button>
          <button className="btn" onClick={guardarFinal}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
