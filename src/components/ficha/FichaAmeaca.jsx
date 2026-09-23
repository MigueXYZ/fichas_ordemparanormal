import React, { useState } from 'react';
import IconeD20 from '../IconeD20.jsx';
import EditorTags from '../EditorTags.jsx';
import { rolarTeste, rolarDano } from '../../engine/dados.js';

const TIPOS_ACAO = ['Padrão', 'Movimento', 'Livre', 'Reação', 'Completa'];
const DESCRITORES_CONHECIDOS = ['Sangue', 'Morte', 'Conhecimento', 'Energia', 'Medo', 'Humano', 'Humanoide', 'Animal', 'Criatura', 'Ocultista'];

/** Lê "3d20+10", "-2d20+0", "1d20-5", "5d20" — ou o mesmo com uma nota a seguir tipo
 * "4d20+15 (Percepção às cegas)" — e devolve {dados,bonus}, ou null se não achar a pool de d20. */
function parseTesteTexto(txt) {
  const m = String(txt || '').replace(/\s/g, '').match(/^(-?\d+)d20([+-]\d+)?/i);
  if (!m) return null;
  return { dados: Number(m[1]), bonus: Number(m[2] || 0) };
}

/** Lê "2d12+10 impacto" e devolve {dano:'2d12+10', tipoDano:'impacto'} para rolarDano. */
function parseDanoTexto(txt) {
  const m = String(txt || '').trim().match(/^(\d*d\d+(?:[+-]\d+)?)\s*(.*)$/i);
  if (!m) return null;
  return { dano: m[1], tipoDano: m[2] || null };
}

/** Uma lista simples de linhas de texto (resistências, imunidades, vulnerabilidades...). */
function ListaLinhas({ rotulo, dica, valores, onChange, placeholder }) {
  const lista = Array.isArray(valores) ? valores : [];
  const [novo, setNovo] = useState('');

  function adicionar() {
    if (!novo.trim()) return;
    onChange([...lista, novo.trim()]);
    setNovo('');
  }

  return (
    <div className="ameaca-bloco largo">
      <h4>{rotulo}</h4>
      {dica && <div className="dica" style={{ marginBottom: 8 }}>{dica}</div>}
      {lista.map((linha, i) => (
        <div key={i} className="ameaca-linha-editavel">
          <input
            type="text"
            value={linha}
            onChange={(e) => {
              const novas = [...lista];
              novas[i] = e.target.value;
              onChange(novas);
            }}
          />
          <button type="button" className="btn-remover-linha" title="Remover" onClick={() => onChange(lista.filter((_, j) => j !== i))}>×</button>
        </div>
      ))}
      <div className="ameaca-linha-editavel ameaca-linha-nova">
        <input
          type="text"
          value={novo}
          placeholder={placeholder || 'Escreve e prime Enter...'}
          onChange={(e) => setNovo(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); adicionar(); } }}
        />
        <button type="button" className="btn-remover-linha btn-adicionar-linha" title="Adicionar" onClick={adicionar}>+</button>
      </div>
    </div>
  );
}

/** Ficha de ameaça, no formato do capítulo 7 do Livro Base — suporta tanto criaturas
 * geradas/oficiais com o esquema completo (atributos, várias ações, habilidades,
 * imunidades, vulnerabilidades, enigma de medo...) como o esquema mais simples usado
 * pelo gerador aleatório antigo (um só `ataque`, sem atributos). Tudo é editável. */
export default function FichaAmeaca({ ameaca, setAmeaca, onRolar, aoConcluir }) {
  const a = ameaca;
  const set = (patch) => setAmeaca({ ...a, ...patch });

  function rolar(nome, dados, bonus) {
    if (dados == null || Number.isNaN(Number(dados))) return;
    onRolar(rolarTeste({ nome: `${a.nome} — ${nome}`, dados: Number(dados), bonus: Number(bonus) || 0 }));
  }

  function rolarDeTexto(nomeAmigavel, texto) {
    const parsed = parseTesteTexto(texto);
    if (!parsed) return;
    rolar(nomeAmigavel, parsed.dados, parsed.bonus);
  }

  function rolarDanoDeTexto(nomeAmigavel, texto) {
    const parsed = parseDanoTexto(texto);
    if (!parsed) return;
    onRolar(rolarDano({ nome: `${a.nome} — ${nomeAmigavel}`, dano: parsed.dano, tipoDano: parsed.tipoDano }));
  }

  // -------------------------------------------------------------- perícias
  const pericias = Array.isArray(a.pericias) ? a.pericias : [];
  function atualizarPericia(i, patch) {
    const novas = [...pericias];
    novas[i] = { ...novas[i], ...patch };
    set({ pericias: novas });
  }
  function removerPericia(i) {
    set({ pericias: pericias.filter((_, j) => j !== i) });
  }
  function adicionarPericia() {
    set({ pericias: [...pericias, { nome: 'Nova perícia', dados: 1, bonus: 0 }] });
  }

  // ---------------------------------------------------------------- ações
  // Migra o esquema antigo (`a.ataque` único) para o novo (`a.acoes`, array),
  // assim que o utilizador mexer em qualquer ação — sem perder o ataque já lá.
  const acoesAtuais = Array.isArray(a.acoes)
    ? a.acoes
    : a.ataque
      ? [{ tipo: 'Padrão', nome: a.ataque.nome || 'Agredir', detalhe: a.ataque.tipo || '', teste: a.ataque.teste || '', dano: a.ataque.dano || '', critico: a.ataque.critico || '', descricao: '' }]
      : [];

  function definirAcoes(novas) {
    const patch = { acoes: novas };
    if (a.ataque) patch.ataque = null;
    setAmeaca({ ...a, ...patch });
  }
  function atualizarAcao(i, patch) {
    const novas = [...acoesAtuais];
    novas[i] = { ...novas[i], ...patch };
    definirAcoes(novas);
  }
  function removerAcao(i) {
    definirAcoes(acoesAtuais.filter((_, j) => j !== i));
  }
  function adicionarAcao() {
    definirAcoes([...acoesAtuais, { tipo: 'Padrão', nome: 'Nova ação', detalhe: '', teste: '', dano: '', critico: '', descricao: '' }]);
  }

  // ----------------------------------------------------------- habilidades
  const habilidades = Array.isArray(a.habilidades) ? a.habilidades : [];
  function atualizarHabilidade(i, patch) {
    const novas = [...habilidades];
    novas[i] = { ...novas[i], ...patch };
    set({ habilidades: novas });
  }
  function removerHabilidade(i) {
    set({ habilidades: habilidades.filter((_, j) => j !== i) });
  }
  function adicionarHabilidade() {
    set({ habilidades: [...habilidades, { nome: 'Nova habilidade', descricao: '' }] });
  }

  // --------------------------------------------------------------- poderes
  // Separado das habilidades — sobretudo para ocultistas/cultistas (que têm
  // poderes paranormais próprios, distintos das habilidades passivas da
  // criatura) — para não amontoar tudo numa lista só.
  const poderes = Array.isArray(a.poderes) ? a.poderes : [];
  function atualizarPoder(i, patch) {
    const novos = [...poderes];
    novos[i] = { ...novos[i], ...patch };
    set({ poderes: novos });
  }
  function removerPoder(i) {
    set({ poderes: poderes.filter((_, j) => j !== i) });
  }
  function adicionarPoder() {
    set({ poderes: [...poderes, { nome: 'Novo poder', descricao: '' }] });
  }

  // -------------------------------------------------------------- atributos
  const atributos = a.atributos || {};
  function definirAtributo(chave, valor) {
    set({ atributos: { ...atributos, [chave]: valor === '' ? '' : (Number.isNaN(Number(valor)) ? valor : Number(valor)) } });
  }

  const presenca = a.presencaPerturbadora || (a.dt != null ? { dt: a.dt, dano: a.presencaDano || '', nex: a.presencaNex } : null);
  function definirPresenca(patch) {
    set({ presencaPerturbadora: { ...(presenca || {}), ...patch } });
  }

  const temPresenca = presenca && (presenca.dt || presenca.dano);

  return (
    <div className="container">
      <div className="ameaca">
        <div className="ameaca-topo">
          <input className="ameaca-nome" value={a.nome || ''} onChange={(e) => set({ nome: e.target.value })} />
          <div className="ameaca-vd">
            <span>VD</span>
            <input type="number" value={a.vd ?? ''} onChange={(e) => set({ vd: Number(e.target.value) })} />
          </div>
        </div>

        {a.origemCompendio?.fonte && (
          <div className="ameaca-fonte-badge">
            Do Compêndio Oficial — {a.origemCompendio.fonte.livro}{a.origemCompendio.fonte.pagina ? `, p.${a.origemCompendio.fonte.pagina}` : ''}
          </div>
        )}
        {!a.origemCompendio?.fonte && a.fonte && (
          <div className="ameaca-fonte-badge">{a.fonte.livro}{a.fonte.pagina ? `, p.${a.fonte.pagina}` : ''}</div>
        )}

        <div className="campo" style={{ marginTop: 12 }}>
          <label>Descritores</label>
          <EditorTags
            tags={a.descritores || []}
            onChange={(novos) => set({ descritores: novos })}
            rotulo=""
            dica=""
            placeholder="Sangue, Morte, Conhecimento, Energia, Medo, Humano, Animal, Criatura..."
            sugestoesPersonalizadas={DESCRITORES_CONHECIDOS}
          />
        </div>

        <div className="ameaca-grelha" style={{ marginTop: 4 }}>
          <div className="campo" style={{ marginBottom: 0 }}>
            <label>Tamanho</label>
            <input type="text" value={a.tamanho || ''} onChange={(e) => set({ tamanho: e.target.value })} />
          </div>
          <div className="campo" style={{ marginBottom: 0 }}>
            <label>Categoria / Ocupação</label>
            <input
              type="text"
              value={a.categoria || a.ocupacao || ''}
              placeholder="Pessoa, Animal, Ocupação..."
              onChange={(e) => set({ categoria: e.target.value })}
            />
          </div>
          <div className="campo" style={{ marginBottom: 0 }}>
            <label>Deslocamento</label>
            <input type="text" value={a.deslocamento ?? ''} onChange={(e) => set({ deslocamento: e.target.value })} />
          </div>
        </div>

        {temPresenca && (
          <div className="ameaca-bloco largo" style={{ marginTop: 14 }}>
            <h4>Presença Perturbadora</h4>
            <div className="ameaca-grelha">
              <div className="linha-stat"><span>DT</span>
                <input type="number" value={presenca.dt ?? ''} onChange={(e) => definirPresenca({ dt: Number(e.target.value) })} />
              </div>
              <div className="linha-stat"><span>Dano</span>
                <input type="text" value={presenca.dano ?? ''} onChange={(e) => definirPresenca({ dano: e.target.value })} />
              </div>
              <div className="linha-stat"><span>NEX (imunidade)</span>
                <input type="text" value={presenca.nex ?? ''} placeholder="ex: 40" onChange={(e) => definirPresenca({ nex: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        <div className="ameaca-grelha" style={{ marginTop: 14 }}>
          <div className="ameaca-bloco">
            <h4>Sentidos</h4>
            <div className="linha-stat">
              <span>Percepção</span>
              <input type="text" value={a.sentidos?.percepcao ?? ''} onChange={(e) => set({ sentidos: { ...a.sentidos, percepcao: e.target.value } })} />
              <button className="dado-btn" title="Rolar Percepção" onClick={() => rolarDeTexto('Percepção', a.sentidos?.percepcao)}><IconeD20 /></button>
            </div>
            <div className="linha-stat">
              <span>Iniciativa</span>
              <input type="text" value={a.sentidos?.iniciativa ?? ''} onChange={(e) => set({ sentidos: { ...a.sentidos, iniciativa: e.target.value } })} />
              <button className="dado-btn" title="Rolar Iniciativa" onClick={() => rolarDeTexto('Iniciativa', a.sentidos?.iniciativa)}><IconeD20 /></button>
            </div>
            {a.sentidos?.extra != null && (
              <div className="linha-stat">
                <span>Extra</span>
                <input type="text" value={a.sentidos?.extra ?? ''} onChange={(e) => set({ sentidos: { ...a.sentidos, extra: e.target.value } })} />
              </div>
            )}
          </div>

          <div className="ameaca-bloco">
            <h4>Defesa</h4>
            <div className="linha-stat"><span>Defesa</span>
              <input type="text" value={a.defesa ?? ''} onChange={(e) => set({ defesa: /^-?\d+$/.test(e.target.value) ? Number(e.target.value) : e.target.value })} />
            </div>
            <div className="linha-stat">
              <span>Fortitude</span>
              <input type="text" value={a.testes?.fortitude ?? ''} onChange={(e) => set({ testes: { ...a.testes, fortitude: e.target.value } })} />
              <button className="dado-btn" title="Rolar Fortitude" onClick={() => rolarDeTexto('Fortitude', a.testes?.fortitude)}><IconeD20 /></button>
            </div>
            <div className="linha-stat">
              <span>Reflexos</span>
              <input type="text" value={a.testes?.reflexos ?? ''} onChange={(e) => set({ testes: { ...a.testes, reflexos: e.target.value } })} />
              <button className="dado-btn" title="Rolar Reflexos" onClick={() => rolarDeTexto('Reflexos', a.testes?.reflexos)}><IconeD20 /></button>
            </div>
            <div className="linha-stat">
              <span>Vontade</span>
              <input type="text" value={a.testes?.vontade ?? ''} onChange={(e) => set({ testes: { ...a.testes, vontade: e.target.value } })} />
              <button className="dado-btn" title="Rolar Vontade" onClick={() => rolarDeTexto('Vontade', a.testes?.vontade)}><IconeD20 /></button>
            </div>
          </div>

          <div className="ameaca-bloco">
            <h4>Pontos de vida</h4>
            <div className="ameaca-pv">
              <input type="number" value={a.pvAtual ?? a.pv ?? ''} onChange={(e) => set({ pvAtual: Number(e.target.value) })} />
              <span>/</span>
              <input type="number" value={a.pv ?? ''} style={{ width: 70 }} onChange={(e) => set({ pv: Number(e.target.value) })} />
            </div>
            <div className="linha-stat"><span>Machucado</span>
              <input type="number" value={a.pvMachucado ?? ''} onChange={(e) => set({ pvMachucado: Number(e.target.value) })} />
            </div>
            {a.dt != null && !temPresenca && (
              <div className="linha-stat"><span>DT</span><input type="number" value={a.dt ?? ''} onChange={(e) => set({ dt: Number(e.target.value) })} /></div>
            )}
          </div>
        </div>

        <div className="ameaca-bloco largo" style={{ marginTop: 14 }}>
          <h4>Atributos</h4>
          <div className="ameaca-grelha">
            {['agi', 'for', 'int', 'pre', 'vig'].map((k) => (
              <div className="linha-stat" key={k}>
                <span>{k.toUpperCase()}</span>
                <input type="text" style={{ width: 56, textAlign: 'center' }} value={atributos[k] ?? ''} onChange={(e) => definirAtributo(k, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <ListaLinhas rotulo="Imunidades" valores={a.imunidades} onChange={(v) => set({ imunidades: v })} placeholder="ex: Condições de paralisia" />
        <ListaLinhas rotulo="Resistências" valores={a.resistencias} onChange={(v) => set({ resistencias: v })} placeholder="ex: Balístico, corte e perfuração 10" />
        <ListaLinhas rotulo="Vulnerabilidades" valores={a.vulnerabilidades} onChange={(v) => set({ vulnerabilidades: v })} placeholder="ex: Conhecimento" />

        <div className="ameaca-bloco largo">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Perícias</h4>
            <button type="button" className="btn ghost sm" onClick={adicionarPericia}>+ Perícia</button>
          </div>
          <div className="ameaca-pericias">
            {pericias.map((p, i) => (
              <div key={i} className="ameaca-linha-editavel ameaca-pericia-linha">
                <button type="button" className="dado-btn" title={`Rolar ${p.nome}`} onClick={() => rolar(p.nome, p.dados, p.bonus)}><IconeD20 /></button>
                <input type="text" value={p.nome} onChange={(e) => atualizarPericia(i, { nome: e.target.value })} />
                <input type="number" value={p.dados} style={{ width: 44, flex: '0 0 auto' }} onChange={(e) => atualizarPericia(i, { dados: Number(e.target.value) })} />
                <span style={{ flex: '0 0 auto' }}>d20+</span>
                <input type="number" value={p.bonus} style={{ width: 52, flex: '0 0 auto' }} onChange={(e) => atualizarPericia(i, { bonus: Number(e.target.value) })} />
                <button type="button" className="btn-remover-linha" onClick={() => removerPericia(i)}>×</button>
              </div>
            ))}
            {pericias.length === 0 && <span className="dica">Sem perícias treinadas.</span>}
          </div>
        </div>

        {habilidades.length > 0 || true ? (
          <div className="ameaca-bloco largo">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4>Habilidades</h4>
              <button type="button" className="btn ghost sm" onClick={adicionarHabilidade}>+ Habilidade</button>
            </div>
            {habilidades.map((h, i) => (
              <div key={i} className="bloco" style={{ marginTop: 10 }}>
                <div className="topo">
                  <input type="text" value={h.nome || ''} style={{ fontFamily: 'var(--display)', fontSize: 16 }} onChange={(e) => atualizarHabilidade(i, { nome: e.target.value })} />
                  <button type="button" className="btn-remover-linha" onClick={() => removerHabilidade(i)}>×</button>
                </div>
                <textarea
                  value={h.descricao || ''}
                  rows={2}
                  style={{ width: '100%', marginTop: 8 }}
                  onChange={(e) => atualizarHabilidade(i, { descricao: e.target.value })}
                />
              </div>
            ))}
            {habilidades.length === 0 && <p className="dica">Sem habilidades passivas.</p>}
          </div>
        ) : null}

        {/* Separado das Habilidades — poderes paranormais (sobretudo de
            ocultistas e cultistas), para não ficarem todos amontoados numa
            lista só. */}
        <div className="ameaca-bloco largo">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Poderes</h4>
            <button type="button" className="btn ghost sm" onClick={adicionarPoder}>+ Poder</button>
          </div>
          {poderes.map((p, i) => (
            <div key={i} className="bloco" style={{ marginTop: 10 }}>
              <div className="topo">
                <input type="text" value={p.nome || ''} style={{ fontFamily: 'var(--display)', fontSize: 16 }} onChange={(e) => atualizarPoder(i, { nome: e.target.value })} />
                <button type="button" className="btn-remover-linha" onClick={() => removerPoder(i)}>×</button>
              </div>
              <textarea
                value={p.descricao || ''}
                rows={2}
                style={{ width: '100%', marginTop: 8 }}
                onChange={(e) => atualizarPoder(i, { descricao: e.target.value })}
              />
            </div>
          ))}
          {poderes.length === 0 && <p className="dica">Sem poderes paranormais.</p>}
        </div>

        <div className="ameaca-bloco largo">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Ações</h4>
            <button type="button" className="btn ghost sm" onClick={adicionarAcao}>+ Ação</button>
          </div>
          {acoesAtuais.map((acao, i) => (
            <div key={i} className="bloco arma" style={{ marginTop: 10 }}>
              <div className="topo">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <select value={acao.tipo || 'Padrão'} onChange={(e) => atualizarAcao(i, { tipo: e.target.value })}>
                      {TIPOS_ACAO.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input
                      type="text"
                      value={acao.nome || ''}
                      style={{ fontFamily: 'var(--display)', fontSize: 16, flex: 1, minWidth: 140 }}
                      onChange={(e) => atualizarAcao(i, { nome: e.target.value })}
                    />
                  </div>
                  <input
                    type="text"
                    value={acao.detalhe || ''}
                    placeholder="ex: Corpo a corpo x2 / Distância, médio"
                    style={{ marginTop: 6, fontSize: 13, opacity: 0.85 }}
                    onChange={(e) => atualizarAcao(i, { detalhe: e.target.value })}
                  />
                  <div className="arma-stats" style={{ marginTop: 6 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      Teste <input type="text" style={{ width: 90 }} value={acao.teste || ''} onChange={(e) => atualizarAcao(i, { teste: e.target.value })} />
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      Dano <input type="text" style={{ width: 120 }} value={acao.dano || ''} onChange={(e) => atualizarAcao(i, { dano: e.target.value })} />
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      Crítico <input type="text" style={{ width: 60 }} value={acao.critico || ''} onChange={(e) => atualizarAcao(i, { critico: e.target.value })} />
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                  {acao.teste && <button className="btn sm" onClick={() => rolarDeTexto(acao.nome, acao.teste)}>Atacar</button>}
                  {acao.dano && <button className="btn ghost sm" onClick={() => rolarDanoDeTexto(`${acao.nome} — dano`, acao.dano)}>Dano</button>}
                  <button type="button" className="btn-remover-linha" onClick={() => removerAcao(i)}>× remover</button>
                </div>
              </div>
              <textarea
                value={acao.descricao || ''}
                placeholder="Regra completa da ação, se houver texto além do teste/dano..."
                rows={acao.descricao ? 3 : 1}
                style={{ width: '100%', marginTop: 8 }}
                onChange={(e) => atualizarAcao(i, { descricao: e.target.value })}
              />
            </div>
          ))}
          {acoesAtuais.length === 0 && <p className="dica">Sem ações definidas.</p>}
        </div>

        {(a.enigmaDoMedo != null || false) && (
          <div className="ameaca-bloco largo ameaca-enigma">
            <h4>Enigma de Medo</h4>
            <textarea
              value={a.enigmaDoMedo || ''}
              rows={6}
              onChange={(e) => set({ enigmaDoMedo: e.target.value })}
            />
          </div>
        )}
        {a.enigmaDoMedo == null && (
          <div style={{ marginTop: 12 }}>
            <button type="button" className="btn ghost sm" onClick={() => set({ enigmaDoMedo: '' })}>+ Adicionar Enigma de Medo</button>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <EditorTags
            tags={a.tags || []}
            onChange={(novasTags) => set({ tags: novasTags })}
          />
        </div>

        <div className="campo" style={{ marginTop: 16 }}>
          <label>Notas</label>
          <textarea value={a.notas || ''} onChange={(e) => set({ notas: e.target.value })} />
        </div>

        {aoConcluir && (
          <div className="ameaca-rodape">
            <button type="button" className="btn ameaca-btn-concluir" onClick={aoConcluir}>Concluir</button>
          </div>
        )}
      </div>
    </div>
  );
}
