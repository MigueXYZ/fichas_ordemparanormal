import React, { useState } from 'react';
import tokenPlaceholder from '../../assets/token-placeholder.png';
import AvatarAjustavel from '../AvatarAjustavel.jsx';
import ModalEditarAvatar from '../ModalEditarAvatar.jsx';
import EditorTags from '../EditorTags.jsx';
import IconeD20 from '../IconeD20.jsx';
import { rolarTeste, rolarDano, quantidadeDados } from '../../engine/dados.js';
import { acoesDeAmeaca, parseTesteTexto, parseDanoTexto } from '../../engine/combateAtaques.js';
import { CAMPOS_ROLEPLAY, roleplayDe } from '../../engine/fichaLivre.js';
import { BlocoStat, TabelaLinha, CampoRoleplay } from './FichaCardBlocos.jsx';

const TIPOS_ACAO = ['Padrão', 'Movimento', 'Livre', 'Reação', 'Completa'];
const DESCRITORES_CONHECIDOS = ['Sangue', 'Morte', 'Conhecimento', 'Energia', 'Medo', 'Humano', 'Humanoide', 'Animal', 'Criatura', 'Ocultista'];
const ATRIBUTOS = ['agi', 'for', 'int', 'pre', 'vig'];
const TESTES = [
  ['sentidos', 'percepcao', 'Percepção'],
  ['sentidos', 'iniciativa', 'Iniciativa'],
  ['testes', 'fortitude', 'Fortitude'],
  ['testes', 'reflexos', 'Reflexos'],
  ['testes', 'vontade', 'Vontade'],
];

/** "20" → 20, "" → "", "20 (grupo)" fica texto. */
const numOuTexto = (v) => (v === '' ? '' : /^-?\d+$/.test(v.trim()) ? Number(v) : v);
const temValor = (v) => v !== '' && v !== null && v !== undefined;

/**
 * Ficha livre de NPC ou Ameaça (ver engine/fichaLivre.js) — o mesmo formato
 * da ficha editável fora da app, com a moldura da "ficha 4" (coluna de jogo à
 * esquerda, ROLEPLAY + token à direita). Em modo de ler, perícias, testes e
 * ações rolam com um clique; em modo de editar, tudo se escreve à mão.
 *
 * `onAtualizar(patch)` recebe um objeto com os campos alterados — o token
 * muda imagem, posição e zoom de uma só vez, por isso não pode ser campo a
 * campo (cada chamada partiria da ficha antiga e só a última ficaria).
 */
export default function FichaLivreCard({ f, editando, onAtualizar, onRolar }) {
  const [modalAvatarAberto, setModalAvatarAberto] = useState(false);
  const set = (campo, valor) => onAtualizar({ [campo]: valor });
  const ameaca = f.tipo === 'ameaca';
  const rp = roleplayDe(f);
  const acoes = acoesDeAmeaca(f);
  const pericias = Array.isArray(f.pericias) ? f.pericias : [];
  const habilidades = Array.isArray(f.habilidades) ? f.habilidades : [];
  const poderes = Array.isArray(f.poderes) ? f.poderes : [];
  const presenca = f.presencaPerturbadora;

  // --------------------------------------------------------------- rolar
  function rolarPool(nome, dados, bonus) {
    if (!onRolar || dados == null || Number.isNaN(Number(dados))) return;
    onRolar(rolarTeste({ nome: `${f.nome} — ${nome}`, dados: Number(dados), bonus: Number(bonus) || 0 }));
  }
  function rolarTexto(nome, txt) {
    const p = parseTesteTexto(txt);
    if (p) rolarPool(nome, p.dados, p.bonus);
  }
  function rolarDanoTexto(nome, txt) {
    const p = parseDanoTexto(txt);
    if (p && onRolar) onRolar(rolarDano({ nome: `${f.nome} — ${nome}`, dano: p.dano, tipoDano: p.tipoDano }));
  }

  // ------------------------------------------------------ listas editáveis
  function editarItem(campo, lista, i, patch) {
    const novas = [...lista];
    novas[i] = typeof patch === 'object' ? { ...novas[i], ...patch } : patch;
    set(campo, novas);
  }
  const removerItem = (campo, lista, i) => set(campo, lista.filter((_, j) => j !== i));

  function aplicarAvatar(patch) {
    onAtualizar({ imagem: patch.imagem, imagemPosX: patch.imagemPosX, imagemPosY: patch.imagemPosY, imagemZoom: patch.imagemZoom });
    setModalAvatarAberto(false);
  }

  const breve = ameaca
    ? [f.descritores?.join(' · '), f.tamanho, f.categoria, temValor(f.vd) && `VD ${f.vd}`].filter(Boolean).join(' · ')
    : [f.breveDescricao, temValor(f.vd) && `VD ${f.vd}`, temValor(f.nex) && `NEX ${f.nex}%`].filter(Boolean).join(' · ');

  const vitais = [
    { rotulo: 'Defesa', valor: f.defesa },
    { rotulo: 'PV', valor: temValor(f.pvAtual) && f.pvAtual !== f.pv ? `${f.pvAtual}/${f.pv}` : f.pv },
    { rotulo: 'Machucado', valor: f.pvMachucado },
    temValor(f.pe) && { rotulo: 'PE', valor: f.pe },
    temValor(f.san) && { rotulo: 'SAN', valor: f.san },
    temValor(f.bloqueio) && { rotulo: 'Bloqueio', valor: f.bloqueio },
    temValor(f.esquiva) && { rotulo: 'Esquiva', valor: f.esquiva },
    temValor(f.dt) && { rotulo: 'DT', valor: f.dt },
  ].filter((c) => c && temValor(c.valor));

  return (
    <div className="ficha-npc ficha-livre" style={{ marginTop: 16 }}>
      {/* ------------------------------------------------------------ cabeçalho */}
      <div className="ficha-npc-cabecalho">
        {editando ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="text" value={f.nome || ''} placeholder={ameaca ? 'Nome da ameaça' : 'Nome do NPC'}
                onChange={(e) => set('nome', e.target.value)} style={{ fontSize: 20, fontWeight: 'bold', flex: 1 }} />
              <label className="ficha-livre-mini">VD<input type="text" value={f.vd ?? ''} onChange={(e) => set('vd', numOuTexto(e.target.value))} /></label>
              {!ameaca && <label className="ficha-livre-mini">NEX<input type="text" value={f.nex ?? ''} onChange={(e) => set('nex', numOuTexto(e.target.value))} /></label>}
            </div>
            {ameaca ? (
              <>
                <EditorTags tags={f.descritores || []} onChange={(v) => set('descritores', v)} rotulo="" dica=""
                  placeholder="Descritores: Sangue, Morte, Criatura, Humano…" sugestoesPersonalizadas={DESCRITORES_CONHECIDOS} />
                <div className="grelha-editor" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="campo" style={{ marginBottom: 0 }}><label>Tamanho</label><input type="text" value={f.tamanho || ''} onChange={(e) => set('tamanho', e.target.value)} /></div>
                  <div className="campo" style={{ marginBottom: 0 }}><label>Categoria</label><input type="text" value={f.categoria || ''} placeholder="Criatura, Pessoa, Animal…" onChange={(e) => set('categoria', e.target.value)} /></div>
                </div>
              </>
            ) : (
              <input type="text" value={f.breveDescricao || ''} placeholder="Breve descrição (humano · ocultista · ocupação…)"
                onChange={(e) => set('breveDescricao', e.target.value)} style={{ fontSize: 13 }} />
            )}
            <textarea rows={3} value={f.historia || ''} placeholder="História / descrição — quem é, de onde vem, o que o liga à cena."
              onChange={(e) => set('historia', e.target.value)} style={{ fontSize: 13 }} />
          </div>
        ) : (
          <>
            <div className="ficha-npc-nome">{f.nome}</div>
            {breve && <div className="ficha-npc-breve">{breve}</div>}
            {f.historia && <div className="ficha-npc-historia">{f.historia}</div>}
          </>
        )}
      </div>

      <div className="ficha-npc-corpo">
        {/* ---------------------------------------------------- coluna de jogo */}
        <div className="ficha-npc-stats">
          <BlocoStat titulo="Atributos">
            {editando ? (
              <div className="grelha-editor" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                {ATRIBUTOS.map((k) => (
                  <div className="campo" key={k} style={{ marginBottom: 0 }}>
                    <label>{k.toUpperCase()}</label>
                    <input type="text" value={f.atributos?.[k] ?? ''} onChange={(e) => set('atributos', { ...(f.atributos || {}), [k]: numOuTexto(e.target.value) })} />
                  </div>
                ))}
              </div>
            ) : (
              <TabelaLinha colunas={ATRIBUTOS.map((k) => ({ rotulo: k.toUpperCase(), valor: f.atributos?.[k] ?? '—' }))} />
            )}
          </BlocoStat>

          <BlocoStat titulo="Vitais">
            {editando ? (
              <div className="grelha-editor" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {[['defesa', 'Defesa'], ['pv', 'PV'], ['pvMachucado', 'Machucado'], ['deslocamento', 'Desloc.'],
                  ['pe', 'PE'], ['san', 'SAN'], ['bloqueio', 'Bloqueio'], ['esquiva', 'Esquiva']].map(([k, r]) => (
                  <div className="campo" key={k} style={{ marginBottom: 0 }}>
                    <label>{r}</label>
                    <input type="text" value={f[k] ?? ''} onChange={(e) => set(k, k === 'deslocamento' ? e.target.value : numOuTexto(e.target.value))} />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <TabelaLinha colunas={vitais} />
                {f.deslocamento && <div className="ficha-livre-linha"><span>Deslocamento</span><b>{f.deslocamento}</b></div>}
              </>
            )}
          </BlocoStat>

          <BlocoStat titulo="Sentidos & Resistências">
            {editando ? (
              <div className="grelha-editor" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                {TESTES.map(([grupo, k, r]) => (
                  <div className="campo" key={k} style={{ marginBottom: 0 }}>
                    <label>{r}</label>
                    <input type="text" value={f[grupo]?.[k] ?? ''} placeholder="1d20+0"
                      onChange={(e) => set(grupo, { ...(f[grupo] || {}), [k]: e.target.value })} />
                  </div>
                ))}
              </div>
            ) : (
              <ul className="previa-pericias">
                {TESTES.filter(([g, k]) => f[g]?.[k]).map(([g, k, r]) => (
                  <li key={k} style={{ cursor: onRolar ? 'pointer' : undefined }} onClick={() => rolarTexto(r, f[g][k])} title={onRolar ? `Rolar ${r}` : undefined}>
                    <span className="pn">{r}</span><span className="pb">{f[g][k]}</span>
                  </li>
                ))}
              </ul>
            )}
          </BlocoStat>

          <BlocoStat titulo="Perícias" extra={pericias.length ? `${pericias.length}` : null}>
            {editando ? (
              <>
                {pericias.map((p, i) => (
                  <div key={i} className="ameaca-linha-editavel ameaca-pericia-linha">
                    <input type="text" value={p.nome} onChange={(e) => editarItem('pericias', pericias, i, { nome: e.target.value })} />
                    <input type="number" value={p.dados} style={{ width: 44, flex: '0 0 auto' }} onChange={(e) => editarItem('pericias', pericias, i, { dados: Number(e.target.value) })} />
                    <span style={{ flex: '0 0 auto' }}>d20+</span>
                    <input type="number" value={p.bonus} style={{ width: 52, flex: '0 0 auto' }} onChange={(e) => editarItem('pericias', pericias, i, { bonus: Number(e.target.value) })} />
                    <button type="button" className="btn-remover-linha" onClick={() => removerItem('pericias', pericias, i)}>×</button>
                  </div>
                ))}
                <button type="button" className="btn ghost sm" style={{ marginTop: 4 }} onClick={() => set('pericias', [...pericias, { nome: 'Nova perícia', dados: 1, bonus: 0 }])}>+ Perícia</button>
              </>
            ) : pericias.length === 0 ? (
              <span className="dica">Sem perícias treinadas.</span>
            ) : (
              <ul className="previa-pericias">
                {pericias.map((p, i) => (
                  <li key={i} style={{ cursor: onRolar ? 'pointer' : undefined }} onClick={() => rolarPool(p.nome, p.dados, p.bonus)} title={onRolar ? `Rolar ${p.nome}` : undefined}>
                    <span className="pn">{p.nome}</span>
                    <span className="pb">{quantidadeDados(p.dados)}d20 {p.bonus >= 0 ? '+' : '−'}{Math.abs(p.bonus)}</span>
                  </li>
                ))}
              </ul>
            )}
          </BlocoStat>

          {[['imunidades', 'Imunidades', 'ex: Condições de paralisia'],
            ['resistencias', 'Resistências', 'ex: Balístico, corte e perfuração 10'],
            ['vulnerabilidades', 'Vulnerabilidades', 'ex: Conhecimento']].map(([campo, rotulo, ph]) => {
            const lista = Array.isArray(f[campo]) ? f[campo] : [];
            if (!editando && lista.length === 0) return null;
            return (
              <BlocoStat key={campo} titulo={rotulo}>
                {editando ? (
                  <>
                    {lista.map((linha, i) => (
                      <div key={i} className="ameaca-linha-editavel">
                        <input type="text" value={linha} onChange={(e) => editarItem(campo, lista, i, e.target.value)} />
                        <button type="button" className="btn-remover-linha" onClick={() => removerItem(campo, lista, i)}>×</button>
                      </div>
                    ))}
                    <button type="button" className="btn ghost sm" style={{ marginTop: 4 }} onClick={() => set(campo, [...lista, ''])}>+ {ph}</button>
                  </>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--txt-dim)' }}>{lista.join(' · ')}</div>
                )}
              </BlocoStat>
            );
          })}

          <BlocoStat titulo="Ações & Ataques" extra={acoes.length ? `${acoes.length}` : null}>
            {editando ? (
              <>
                {acoes.map((acao, i) => (
                  <div key={i} className="bloco arma" style={{ marginTop: i ? 10 : 0 }}>
                    <div className="topo" style={{ gap: 8 }}>
                      <select value={acao.tipo || 'Padrão'} style={{ width: 110, flex: '0 0 auto' }} onChange={(e) => editarItem('acoes', acoes, i, { tipo: e.target.value })}>
                        {TIPOS_ACAO.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <input type="text" value={acao.nome || ''} placeholder="Nome do ataque / ação" style={{ fontFamily: 'var(--display)', fontSize: 16 }}
                        onChange={(e) => editarItem('acoes', acoes, i, { nome: e.target.value })} />
                      <button type="button" className="btn-remover-linha" onClick={() => removerItem('acoes', acoes, i)}>×</button>
                    </div>
                    <input type="text" value={acao.detalhe || ''} placeholder="Corpo a corpo / Distância, médio / x2…" style={{ marginTop: 6, fontSize: 13 }}
                      onChange={(e) => editarItem('acoes', acoes, i, { detalhe: e.target.value })} />
                    <div className="grelha-editor" style={{ gridTemplateColumns: '1fr 1.3fr .8fr', marginTop: 6 }}>
                      <div className="campo" style={{ marginBottom: 0 }}><label>Teste</label><input type="text" value={acao.teste || ''} placeholder="2d20+5" onChange={(e) => editarItem('acoes', acoes, i, { teste: e.target.value })} /></div>
                      <div className="campo" style={{ marginBottom: 0 }}><label>Dano</label><input type="text" value={acao.dano || ''} placeholder="1d8+2 corte" onChange={(e) => editarItem('acoes', acoes, i, { dano: e.target.value })} /></div>
                      <div className="campo" style={{ marginBottom: 0 }}><label>Crítico</label><input type="text" value={acao.critico || ''} placeholder="19/x2" onChange={(e) => editarItem('acoes', acoes, i, { critico: e.target.value })} /></div>
                    </div>
                    <textarea rows={acao.descricao ? 2 : 1} value={acao.descricao || ''} placeholder="Efeito extra, condições, regra completa…" style={{ width: '100%', marginTop: 6 }}
                      onChange={(e) => editarItem('acoes', acoes, i, { descricao: e.target.value })} />
                  </div>
                ))}
                <button type="button" className="btn ghost sm" style={{ marginTop: acoes.length ? 10 : 0 }}
                  onClick={() => set('acoes', [...acoes, { tipo: 'Padrão', nome: 'Novo ataque', detalhe: '', teste: '', dano: '', critico: '', descricao: '' }])}>+ Ação / Ataque</button>
              </>
            ) : acoes.length === 0 ? (
              <span className="dica">Sem ações definidas.</span>
            ) : (
              <div className="ficha-livre-acoes">
                {acoes.map((acao, i) => (
                  <div key={i} className="ficha-livre-acao">
                    <div className="ficha-livre-acao-topo">
                      <b>{acao.nome}</b>
                      <span className="ficha-livre-tag">{acao.tipo || 'Padrão'}</span>
                      {acao.detalhe && <span className="ficha-livre-det">{acao.detalhe}</span>}
                    </div>
                    <div className="ficha-livre-acao-numeros">
                      {acao.teste && <span>Teste <b>{acao.teste}</b></span>}
                      {acao.dano && <span>Dano <b>{acao.dano}</b></span>}
                      {acao.critico && <span>Crítico <b>{acao.critico}</b></span>}
                      {onRolar && (acao.teste || acao.dano) && (
                        <span className="ficha-livre-acao-botoes">
                          {acao.teste && <button type="button" className="btn sm" onClick={() => rolarTexto(acao.nome, acao.teste)}>Atacar</button>}
                          {acao.dano && <button type="button" className="btn ghost sm" onClick={() => rolarDanoTexto(`${acao.nome} — dano`, acao.dano)}>Dano</button>}
                        </span>
                      )}
                    </div>
                    {acao.descricao && <div className="ficha-livre-det" style={{ marginTop: 4 }}>{acao.descricao}</div>}
                  </div>
                ))}
              </div>
            )}
          </BlocoStat>

          {[['habilidades', 'Habilidades', 'Nova habilidade'], ['poderes', 'Poderes & Rituais', 'Novo poder']].map(([campo, rotulo, novo]) => {
            const lista = campo === 'habilidades' ? habilidades : poderes;
            if (!editando && lista.length === 0) return null;
            return (
              <BlocoStat key={campo} titulo={rotulo} extra={lista.length ? `${lista.length}` : null}>
                {editando ? (
                  <>
                    {lista.map((h, i) => (
                      <div key={i} className="bloco" style={{ marginTop: i ? 10 : 0 }}>
                        <div className="topo" style={{ gap: 8 }}>
                          <input type="text" value={h.nome || ''} placeholder="Nome" style={{ fontFamily: 'var(--display)', fontSize: 16 }}
                            onChange={(e) => editarItem(campo, lista, i, { nome: e.target.value })} />
                          <input type="text" value={h.custo || ''} placeholder="Custo / ação" style={{ width: 130, flex: '0 0 auto', fontSize: 13 }}
                            onChange={(e) => editarItem(campo, lista, i, { custo: e.target.value })} />
                          <button type="button" className="btn-remover-linha" onClick={() => removerItem(campo, lista, i)}>×</button>
                        </div>
                        <textarea rows={2} value={h.descricao || ''} placeholder="O que faz, ativação, efeitos…" style={{ width: '100%', marginTop: 6 }}
                          onChange={(e) => editarItem(campo, lista, i, { descricao: e.target.value })} />
                      </div>
                    ))}
                    <button type="button" className="btn ghost sm" style={{ marginTop: lista.length ? 10 : 0 }}
                      onClick={() => set(campo, [...lista, { nome: novo, custo: '', descricao: '' }])}>+ {rotulo.split(' ')[0].replace(/s$/, '')}</button>
                  </>
                ) : (
                  <div className="ficha-livre-habilidades">
                    {lista.map((h, i) => (
                      <div key={i}>
                        <b>{h.nome}</b>{h.custo && <span className="ficha-livre-tag">{h.custo}</span>}
                        {h.descricao && <div className="ficha-livre-det">{h.descricao}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </BlocoStat>
            );
          })}

          {/* Rituais preparados — só vêm nos ocultistas da aba "Gerar"; aqui só se mostram. */}
          {Array.isArray(f.rituais) && f.rituais.length > 0 && (
            <BlocoStat titulo="Rituais Preparados" extra={`${f.rituais.length}`}>
              <div className="ficha-livre-habilidades">
                {f.rituais.map((r, i) => (
                  <div key={i}>
                    <b>{r.nome}</b>
                    <span className="ficha-livre-tag">{[r.circulo && `${r.circulo}º círculo`, r.elemento, temValor(r.dt) && `DT ${r.dt}`, r.custo].filter(Boolean).join(' · ')}</span>
                    {r.descricao && <div className="ficha-livre-det">{r.descricao}</div>}
                  </div>
                ))}
              </div>
            </BlocoStat>
          )}

          {(presenca || (editando && ameaca)) && (
            <BlocoStat titulo="Presença Perturbadora">
              {editando ? (
                presenca ? (
                  <div className="grelha-editor" style={{ gridTemplateColumns: '1fr 1.4fr 1fr auto', alignItems: 'end' }}>
                    <div className="campo" style={{ marginBottom: 0 }}><label>DT</label><input type="text" value={presenca.dt ?? ''} onChange={(e) => set('presencaPerturbadora', { ...presenca, dt: numOuTexto(e.target.value) })} /></div>
                    <div className="campo" style={{ marginBottom: 0 }}><label>Dano</label><input type="text" value={presenca.dano ?? ''} placeholder="2d6 mental" onChange={(e) => set('presencaPerturbadora', { ...presenca, dano: e.target.value })} /></div>
                    <div className="campo" style={{ marginBottom: 0 }}><label>NEX imune</label><input type="text" value={presenca.nex ?? ''} onChange={(e) => set('presencaPerturbadora', { ...presenca, nex: e.target.value })} /></div>
                    <button type="button" className="btn-remover-linha" onClick={() => set('presencaPerturbadora', null)}>×</button>
                  </div>
                ) : (
                  <button type="button" className="btn ghost sm" onClick={() => set('presencaPerturbadora', { dt: '', dano: '', nex: '' })}>+ Presença Perturbadora</button>
                )
              ) : (
                <div className="ficha-livre-acao-numeros">
                  {temValor(presenca.dt) && <span>DT <b>{presenca.dt}</b></span>}
                  {presenca.dano && <span>Dano <b>{presenca.dano}</b></span>}
                  {presenca.nex && <span>Imune a partir de <b>NEX {presenca.nex}</b></span>}
                </div>
              )}
            </BlocoStat>
          )}

          {(f.enigmaDoMedo != null || (editando && ameaca)) && (
            <BlocoStat titulo="Enigma de Medo">
              {editando ? (
                f.enigmaDoMedo != null
                  ? <textarea rows={4} value={f.enigmaDoMedo} style={{ width: '100%' }} onChange={(e) => set('enigmaDoMedo', e.target.value)} />
                  : <button type="button" className="btn ghost sm" onClick={() => set('enigmaDoMedo', '')}>+ Enigma de Medo</button>
              ) : (
                <div className="ficha-npc-historia" style={{ marginTop: 0 }}>{f.enigmaDoMedo}</div>
              )}
            </BlocoStat>
          )}

          {(f.notas || editando) && (
            <BlocoStat titulo="Notas">
              {editando
                ? <textarea rows={2} value={f.notas || ''} style={{ width: '100%' }} onChange={(e) => set('notas', e.target.value)} />
                : <div className="ficha-npc-historia" style={{ marginTop: 0 }}>{f.notas}</div>}
            </BlocoStat>
          )}

          {editando && (
            <EditorTags tags={f.tags || []} onChange={(v) => set('tags', v)} />
          )}
        </div>

        {/* ------------------------------------------------- roleplay + token */}
        <div className="ficha-npc-coluna-direita">
          <div className="ficha-npc-roleplay">
            <div className="ficha-npc-rp-cabecalho">Roleplay</div>
            {editando ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {CAMPOS_ROLEPLAY.map(([k, rotulo]) => (
                  <div className="campo" key={k} style={{ marginBottom: 0 }}>
                    <label>{rotulo}</label>
                    <textarea rows={2} value={rp[k] || ''} onChange={(e) => set('roleplay', { ...rp, [k]: e.target.value })} />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {CAMPOS_ROLEPLAY.filter(([k]) => k !== 'notasMestre').map(([k, rotulo]) => <CampoRoleplay key={k} rotulo={rotulo} valor={rp[k]} />)}
                {rp.notasMestre && (
                  <div className="ficha-livre-segredo">
                    <div className="ficha-npc-rp-rotulo">Dicas de Mesa (Mestre)</div>
                    <div className="ficha-npc-rp-texto">{rp.notasMestre}</div>
                  </div>
                )}
                {CAMPOS_ROLEPLAY.every(([k]) => !rp[k]) && (
                  <p className="dica" style={{ fontSize: 12 }}>Sem guia de interpretação — carrega em "Editar" para o escreveres.</p>
                )}
              </>
            )}
          </div>

          <div className="ficha-npc-token">
            <AvatarAjustavel
              className={'ficha-npc-token-caixa' + (editando ? ' editavel' : '')}
              imagem={f.imagem}
              alt={f.nome}
              posX={f.imagemPosX ?? 50}
              posY={f.imagemPosY ?? 50}
              zoom={f.imagemZoom ?? 1}
              editavel={false}
              onClick={editando ? () => setModalAvatarAberto(true) : undefined}
              title={editando ? (f.imagem ? 'Clica para trocar o token' : 'Clica para adicionares o token') : undefined}
              role={editando ? 'button' : undefined}
              tabIndex={editando ? 0 : undefined}
            >
              <div className="ficha-npc-token-vazio">
                {ameaca
                  ? <div className="ficha-livre-interrogacao" aria-hidden="true">?</div>
                  : <img src={tokenPlaceholder} alt="" className="ficha-npc-token-placeholder" />}
              </div>
            </AvatarAjustavel>
            {modalAvatarAberto && (
              <ModalEditarAvatar
                imagem={f.imagem}
                posX={f.imagemPosX ?? 50}
                posY={f.imagemPosY ?? 50}
                zoom={f.imagemZoom ?? 1}
                aoAplicar={aplicarAvatar}
                aoCancelar={() => setModalAvatarAberto(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
