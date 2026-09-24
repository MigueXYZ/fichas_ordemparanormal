import React, { useState } from 'react';
import { CLASSES } from '../../data/classes.js';
import { ORIGENS } from '../../data/origens.js';
import { PERICIAS, GRAUS_TREINO } from '../../data/pericias.js';
import { calcMaximos, calcDefesas, calcPericias } from '../../engine/calc.js';
import { quantidadeDados } from '../../engine/dados.js';
import tokenPlaceholder from '../../assets/token-placeholder.png';
import CabecalhoSeta from '../ficha/CabecalhoSeta.jsx';
import InputNumeroScroll from '../InputNumeroScroll.jsx';
import TokenFicha from './TokenFicha.jsx';
import { TIPOS_DANO_RESISTIVEIS, estadoResistencia, definirResistencia } from '../../engine/danoRecetor.js';
import { ROTULO_GRAU, BlocoStat, TabelaLinha, CampoRoleplay } from './FichaCardBlocos.jsx';

// Graus atribuíveis a uma perícia do livro (destreinado = "não tem", por
// isso não aparece como escolha — remover é o botão × da linha).
const GRAUS_ATRIBUIVEIS = GRAUS_TREINO.filter((g) => g.id !== 'destreinado');

/**
 * Ficha visual de NPC ("ficha 4") — usada sempre que se gera ou abre um NPC:
 * coluna esquerda com o bloco de jogo (atributos, saúde, perícias,
 * deslocamento, proteção, resistências, ataques, habilidades especiais) em
 * tabelas com borda, coluna direita "ROLEPLAY" com o guia de interpretação
 * (p.comoInterpretar) e, no fundo dessa coluna, o espaço do token — mostra a
 * imagem se houver, senão um template vazio.
 *
 * Um NPC não é uma ficha de personagem: a Defesa/Bloqueio/Esquiva, as
 * perícias, os ataques, as habilidades e as resistências não têm de vir do
 * livro — em modo de editar dão sempre para escrever à mão. Perícias e
 * Proteção continuam a mostrar o valor calculado a partir de Atributos (e,
 * se o NPC tiver classe/origem oficiais atribuídas, também esse cálculo)
 * como referência, mas qualquer coisa fora do livro escreve-se nos campos
 * "extra" / manuais ao lado.
 */
export default function FichaNpcCard({ p, aoVerDetalhe, editando, onAtualizarCampo, aoUploadImagem }) {
  const [abertaResistencias, setAbertaResistencias] = useState(false);
  const classe = CLASSES.find((c) => c.id === p.classeId);
  const origem = ORIGENS.find((o) => o.id === p.origemId);
  const max = calcMaximos(p);
  const defesas = calcDefesas(p);
  const resistencias = Array.isArray(p.resistencias) ? p.resistencias : [];
  const treinadas = calcPericias(p)
    .filter((x) => x.grau !== 'destreinado')
    .sort((a, b) => b.bonus - a.bonus || a.nome.localeCompare(b.nome, 'pt'));
  const periciasExtra = Array.isArray(p.periciasExtra) ? p.periciasExtra : [];
  const ataques = Array.isArray(p.ataques) ? p.ataques : [];
  const habilidades = p.habilidades || [];
  const poderes = p.poderes || [];
  const rp = p.comoInterpretar || {};

  // --------------------------------------------------- perícias do livro (oficiais)
  function definirGrauPericiaOficial(id, grau) {
    const atual = p.pericias?.[id] || { grau: 'destreinado', outros: 0, attr: null };
    onAtualizarCampo('pericias', { ...(p.pericias || {}), [id]: { ...atual, grau } });
  }

  // ------------------------------------------------------- perícias extra (homebrew)
  function atualizarPericiaExtra(i, patch) {
    const novas = [...periciasExtra];
    novas[i] = { ...novas[i], ...patch };
    onAtualizarCampo('periciasExtra', novas);
  }
  function removerPericiaExtra(i) {
    onAtualizarCampo('periciasExtra', periciasExtra.filter((_, j) => j !== i));
  }
  function adicionarPericiaExtra() {
    onAtualizarCampo('periciasExtra', [...periciasExtra, { nome: 'Nova perícia', dados: 1, bonus: 0 }]);
  }

  // ------------------------------------------------------------------ ataques
  function atualizarAtaque(i, patch) {
    const novos = [...ataques];
    novos[i] = { ...novos[i], ...patch };
    onAtualizarCampo('ataques', novos);
  }
  function removerAtaque(i) {
    onAtualizarCampo('ataques', ataques.filter((_, j) => j !== i));
  }
  function adicionarAtaque() {
    onAtualizarCampo('ataques', [...ataques, { nome: 'Novo ataque', pericia: '', dano: '', tipo: '', margem: 20, multiplicador: 2, alcance: '', notas: '' }]);
  }

  // -------------------------------------------------------------- habilidades
  function atualizarHabilidade(i, patch) {
    const novas = [...habilidades];
    novas[i] = { ...novas[i], ...patch };
    onAtualizarCampo('habilidades', novas);
  }
  function removerHabilidade(i) {
    onAtualizarCampo('habilidades', habilidades.filter((_, j) => j !== i));
  }
  function adicionarHabilidade() {
    onAtualizarCampo('habilidades', [...habilidades, { nome: 'Nova habilidade', descricao: '', origem: '' }]);
  }

  return (
    <div className="ficha-npc" style={{ marginTop: 16 }}>
      {/* Cabeçalho: nome, breve descrição e história */}
      <div className="ficha-npc-cabecalho">
        {editando ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <input
              type="text"
              value={p.nome}
              onChange={(e) => onAtualizarCampo('nome', e.target.value)}
              placeholder="Nome do NPC"
              style={{ fontSize: 20, fontWeight: 'bold', width: '100%' }}
            />
            <input
              type="text"
              value={p.breveDescricao || ''}
              onChange={(e) => onAtualizarCampo('breveDescricao', e.target.value)}
              placeholder="Breve descrição (origem · classe · ocupação...)"
              style={{ fontSize: 13, width: '100%' }}
            />
            <textarea
              rows={3}
              value={p.historia || ''}
              onChange={(e) => onAtualizarCampo('historia', e.target.value)}
              placeholder="História — quem é, o que faz, o que o liga à cena (parágrafo livre)."
              style={{ fontSize: 13, width: '100%' }}
            />
          </div>
        ) : (
          <>
            <div className="ficha-npc-nome">{p.nome}</div>
            <div className="ficha-npc-breve">
              {p.breveDescricao || [origem?.nome, classe?.nome, `NEX ${p.nex}%`].filter(Boolean).join(' · ')}
            </div>
            {p.historia && <div className="ficha-npc-historia">{p.historia}</div>}
          </>
        )}
      </div>

      <div className="ficha-npc-corpo">
        {/* ------------------------------------------------------- coluna esquerda: bloco de jogo */}
        <div className="ficha-npc-stats">
          <BlocoStat titulo="Atributos">
            {editando ? (
              <div className="grelha-editor" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                {['for', 'agi', 'int', 'pre', 'vig'].map((k) => (
                  <div className="campo" key={k}>
                    <label>{k.toUpperCase()}</label>
                    <input
                      type="number"
                      value={p.atributos?.[k] ?? 1}
                      onChange={(e) => onAtualizarCampo('atributos', { ...(p.atributos || {}), [k]: Number(e.target.value) })}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <TabelaLinha
                colunas={['agi', 'for', 'int', 'pre', 'vig'].map((k) => ({
                  rotulo: k.charAt(0).toUpperCase() + k.slice(1),
                  valor: (() => { const v = Number(p.atributos?.[k] ?? 0); return v > 0 ? `+${v}` : v; })(),
                }))}
              />
            )}
          </BlocoStat>

          <BlocoStat titulo="Saúde">
            <TabelaLinha
              colunas={[
                { rotulo: 'PV', valor: `${p.pvAtual ?? max.pv}/${max.pv}` },
                { rotulo: 'PE', valor: `${p.peAtual ?? max.pe}/${max.pe}` },
                { rotulo: 'SAN', valor: `${p.sanAtual ?? max.san}/${max.san}` },
              ]}
            />
          </BlocoStat>

          <BlocoStat titulo="Perícias" extra={`${treinadas.length + periciasExtra.length}`}>
            {treinadas.length > 0 && (
              <ul className="previa-pericias" style={{ marginBottom: editando && periciasExtra.length + treinadas.length ? 8 : 0 }}>
                {treinadas.map((x) => (
                  editando ? (
                    <li key={x.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="pn" style={{ flex: 1 }}>{x.nome}</span>
                      <select
                        value={x.grau}
                        style={{ width: 104, flex: '0 0 auto' }}
                        onChange={(e) => definirGrauPericiaOficial(x.id, e.target.value)}
                      >
                        {GRAUS_ATRIBUIVEIS.map((g) => <option key={g.id} value={g.id}>{g.nome}</option>)}
                      </select>
                      <button type="button" className="btn-remover-linha" title="Remover" onClick={() => definirGrauPericiaOficial(x.id, 'destreinado')}>×</button>
                    </li>
                  ) : (
                    <li
                      key={x.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        aoVerDetalhe({
                          nome: x.nome,
                          tipo: `Perícia (${ROTULO_GRAU[x.grau] || 'T'})`,
                          subtitulo: `Atributo-base: ${x.attr.toUpperCase()} · Bónus: ${x.bonus >= 0 ? '+' : ''}${x.bonus}`,
                          tags: [
                            { rotulo: 'Dados', valor: `${quantidadeDados(x.dados)}d20` },
                            { rotulo: 'Bónus', valor: `${x.bonus >= 0 ? '+' : ''}${x.bonus}` },
                            { rotulo: 'Grau', valor: x.grau },
                          ],
                          descricao: 'Perícia oficial de Ordem Paranormal RPG.',
                        })
                      }
                    >
                      <span className="pn">{x.nome}</span>
                      <span className="pg" title={x.grau}>{ROTULO_GRAU[x.grau] || ''}</span>
                      <span className="pb">{quantidadeDados(x.dados)}d20 {x.bonus >= 0 ? '+' : '−'}{Math.abs(x.bonus)}</span>
                    </li>
                  )
                ))}
              </ul>
            )}

            {editando ? (
              <>
                <select
                  value=""
                  onChange={(e) => { if (e.target.value) definirGrauPericiaOficial(e.target.value, 'treinado'); }}
                  style={{ marginBottom: 8 }}
                >
                  <option value="">+ Perícia do livro...</option>
                  {PERICIAS.filter((x) => (p.pericias?.[x.id]?.grau || 'destreinado') === 'destreinado').map((x) => (
                    <option key={x.id} value={x.id}>{x.nome}</option>
                  ))}
                </select>

                {periciasExtra.map((x, i) => (
                  <div key={i} className="ameaca-linha-editavel ameaca-pericia-linha">
                    <input type="text" value={x.nome} onChange={(e) => atualizarPericiaExtra(i, { nome: e.target.value })} />
                    <input type="number" value={x.dados} style={{ width: 44, flex: '0 0 auto' }} onChange={(e) => atualizarPericiaExtra(i, { dados: Number(e.target.value) })} />
                    <span style={{ flex: '0 0 auto' }}>d20+</span>
                    <input type="number" value={x.bonus} style={{ width: 52, flex: '0 0 auto' }} onChange={(e) => atualizarPericiaExtra(i, { bonus: Number(e.target.value) })} />
                    <button type="button" className="btn-remover-linha" onClick={() => removerPericiaExtra(i)}>×</button>
                  </div>
                ))}
                <button type="button" className="btn ghost sm" onClick={adicionarPericiaExtra} style={{ marginTop: 4 }}>+ Perícia fora do livro</button>
              </>
            ) : (
              periciasExtra.length > 0 && (
                <ul className="previa-pericias" style={{ marginTop: treinadas.length ? 4 : 0 }}>
                  {periciasExtra.map((x, i) => (
                    <li key={'ex-' + i}>
                      <span className="pn">{x.nome}</span>
                      <span className="pb">{quantidadeDados(x.dados)}d20 {x.bonus >= 0 ? '+' : '−'}{Math.abs(x.bonus)}</span>
                    </li>
                  ))}
                </ul>
              )
            )}

            {treinadas.length === 0 && periciasExtra.length === 0 && !editando && (
              <span className="dica">Nenhuma perícia treinada.</span>
            )}
          </BlocoStat>

          <BlocoStat titulo="Deslocamento">
            {editando ? (
              <div className="campo" style={{ marginBottom: 0, maxWidth: 140 }}>
                <input
                  type="number"
                  value={p.deslocamento ?? 9}
                  onChange={(e) => onAtualizarCampo('deslocamento', Number(e.target.value))}
                />
              </div>
            ) : (
              <div className="ficha-npc-attrs">
                <span><b>{p.deslocamento ?? 9}m</b></span>
              </div>
            )}
          </BlocoStat>

          <BlocoStat titulo="Proteção" extra="manual">
            {editando ? (
              <div className="grelha-editor" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="campo">
                  <label>Defesa</label>
                  <input
                    type="number"
                    value={p.defesaManual ?? ''}
                    placeholder={String(defesas.defesaAuto)}
                    onChange={(e) => onAtualizarCampo('defesaManual', e.target.value === '' ? null : Number(e.target.value))}
                  />
                </div>
                <div className="campo">
                  <label>Bloqueio</label>
                  <input
                    type="number"
                    value={p.bloqueioManual ?? ''}
                    placeholder={String(defesas.bloqueio.auto || 0)}
                    onChange={(e) => onAtualizarCampo('bloqueioManual', e.target.value === '' ? null : Number(e.target.value))}
                  />
                </div>
                <div className="campo">
                  <label>Esquiva</label>
                  <input
                    type="number"
                    value={p.esquivaManual ?? ''}
                    placeholder={String(defesas.esquiva.auto || 0)}
                    onChange={(e) => onAtualizarCampo('esquivaManual', e.target.value === '' ? null : Number(e.target.value))}
                  />
                </div>
              </div>
            ) : (
              <TabelaLinha
                colunas={[
                  { rotulo: 'Defesa', valor: defesas.defesa },
                  { rotulo: 'Bloqueio', valor: defesas.bloqueio?.disponivel ? defesas.bloqueio.valor : '—' },
                  { rotulo: 'Esquiva', valor: defesas.esquiva?.disponivel ? defesas.esquiva.valor : '—' },
                ]}
              />
            )}
            {editando && (
              <p className="dica" style={{ fontSize: 11, marginTop: 6, marginBottom: 0 }}>
                Deixa em branco para usar o valor calculado (mostrado como sugestão); escreve um número para o substituir.
              </p>
            )}
          </BlocoStat>

          <BlocoStat titulo="Resistências">
            {editando ? (
              <div>
                <CabecalhoSeta estaAberto={abertaResistencias} onClick={() => setAbertaResistencias((v) => !v)}>
                  {resistencias.length ? `${resistencias.length} marcada(s)` : 'Escolher resistências...'}
                </CabecalhoSeta>
                {abertaResistencias && (
                  <div style={{ marginTop: 8 }}>
                    {['Físico', 'Elemental', 'Mental', 'Geral'].map((categoria) => {
                      const doGrupo = TIPOS_DANO_RESISTIVEIS.filter((t) => t.categoria === categoria);
                      if (doGrupo.length === 0) return null;
                      return (
                        <div key={categoria} style={{ marginTop: 8 }}>
                          <div className="subtitulo-grupo-checkbox">{categoria}</div>
                          <div className="grupo-checkboxes-ficha" style={{ marginTop: 0 }}>
                            {doGrupo.map((t) => {
                              const estado = estadoResistencia(p.resistencias, t);
                              const marcado = estado !== null;
                              return (
                                <label key={t.id} className={'item-checkbox-ficha' + (marcado ? ' marcado' : '')}>
                                  <input
                                    type="checkbox"
                                    checked={marcado}
                                    onChange={(e) => {
                                      onAtualizarCampo('resistencias', definirResistencia(p.resistencias, t, e.target.checked ? undefined : null));
                                    }}
                                  />
                                  <span style={{ color: marcado ? t.cor : undefined }}>{t.nome}</span>
                                  {marcado && (
                                    <span className="cauda-item-resistencia">
                                      <InputNumeroScroll
                                        className="input-valor-resistencia"
                                        value={estado.valor}
                                        placeholder="½"
                                        onChange={(v) => onAtualizarCampo('resistencias', definirResistencia(p.resistencias, t, v === null ? undefined : v))}
                                        title={`Resistência a ${t.nome} · vazio = metade do dano (arredondado p/ baixo), com número = desconta esse valor · Altera com o scroll`}
                                      />
                                    </span>
                                  )}
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : resistencias.length === 0 ? (
              <span className="dica">Sem resistências marcadas.</span>
            ) : (
              <div style={{ fontSize: 12, color: 'var(--txt-dim)' }}>{resistencias.join(' · ')}</div>
            )}
          </BlocoStat>

          <BlocoStat titulo="Ataques" extra={ataques.length ? `${ataques.length}` : null}>
            {editando ? (
              <>
                {ataques.map((at, i) => (
                  <div key={i} className="bloco" style={{ marginTop: i === 0 ? 0 : 10 }}>
                    <div className="topo">
                      <input
                        type="text"
                        value={at.nome || ''}
                        placeholder="Nome do ataque"
                        style={{ fontFamily: 'var(--display)', fontSize: 16 }}
                        onChange={(e) => atualizarAtaque(i, { nome: e.target.value })}
                      />
                      <button type="button" className="btn-remover-linha" onClick={() => removerAtaque(i)}>×</button>
                    </div>
                    <div className="ameaca-grelha" style={{ marginTop: 8 }}>
                      <div className="linha-stat"><span>Perícia</span><input type="text" value={at.pericia || ''} onChange={(e) => atualizarAtaque(i, { pericia: e.target.value })} /></div>
                      <div className="linha-stat"><span>Dano</span><input type="text" value={at.dano || ''} onChange={(e) => atualizarAtaque(i, { dano: e.target.value })} /></div>
                      <div className="linha-stat"><span>Tipo</span><input type="text" value={at.tipo || ''} onChange={(e) => atualizarAtaque(i, { tipo: e.target.value })} /></div>
                      <div className="linha-stat"><span>Margem</span><input type="number" value={at.margem ?? 20} onChange={(e) => atualizarAtaque(i, { margem: Number(e.target.value) })} /></div>
                      <div className="linha-stat"><span>Multip. ×</span><input type="number" value={at.multiplicador ?? 2} onChange={(e) => atualizarAtaque(i, { multiplicador: Number(e.target.value) })} /></div>
                      <div className="linha-stat"><span>Alcance</span><input type="text" value={at.alcance || ''} onChange={(e) => atualizarAtaque(i, { alcance: e.target.value })} /></div>
                    </div>
                    <textarea
                      rows={at.notas ? 2 : 1}
                      placeholder="Notas (efeitos extra, condições impostas...)"
                      value={at.notas || ''}
                      style={{ width: '100%', marginTop: 8 }}
                      onChange={(e) => atualizarAtaque(i, { notas: e.target.value })}
                    />
                  </div>
                ))}
                <button type="button" className="btn ghost sm" onClick={adicionarAtaque} style={{ marginTop: ataques.length ? 10 : 0 }}>+ Ataque</button>
              </>
            ) : ataques.length === 0 ? (
              <span className="dica">Sem ataques equipados.</span>
            ) : (
              <ul className="previa-pericias">
                {ataques.map((at, i) => (
                  <li
                    key={i}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      aoVerDetalhe({
                        nome: at.nome,
                        tipo: 'Ataque / Arma',
                        subtitulo: `Perícia: ${at.pericia?.toUpperCase() || ''} · Dano: ${at.dano} ${at.tipo || ''}`,
                        tags: [
                          { rotulo: 'Dano', valor: at.dano },
                          { rotulo: 'Tipo', valor: at.tipo || 'Impacto' },
                          { rotulo: 'Crítico', valor: `${at.margem || 20}/x${at.multiplicador || 2}` },
                          { rotulo: 'Alcance', valor: at.alcance || 'Curto' },
                        ],
                        descricao: at.notas || 'Arma / ataque equipado no NPC.',
                      })
                    }
                  >
                    <span className="pn">{at.nome}</span>
                    <span className="pb">{at.dano}{at.tipo ? ' ' + at.tipo : ''}</span>
                  </li>
                ))}
              </ul>
            )}
          </BlocoStat>

          <BlocoStat titulo="Habilidades Especiais" extra={(habilidades.length + poderes.length) ? `${habilidades.length + poderes.length}` : null}>
            {editando ? (
              <>
                {habilidades.map((h, i) => (
                  <div key={i} className="bloco" style={{ marginTop: i === 0 ? 0 : 10 }}>
                    <div className="topo">
                      <input
                        type="text"
                        value={h.nome || ''}
                        placeholder="Nome da habilidade"
                        style={{ fontFamily: 'var(--display)', fontSize: 16 }}
                        onChange={(e) => atualizarHabilidade(i, { nome: e.target.value })}
                      />
                      <button type="button" className="btn-remover-linha" onClick={() => removerHabilidade(i)}>×</button>
                    </div>
                    <input
                      type="text"
                      value={h.origem || ''}
                      placeholder="Origem (poder de classe, ritual, própria da criatura...)"
                      style={{ marginTop: 6, fontSize: 13 }}
                      onChange={(e) => atualizarHabilidade(i, { origem: e.target.value })}
                    />
                    <textarea
                      rows={2}
                      value={h.descricao || ''}
                      placeholder="O que faz"
                      style={{ width: '100%', marginTop: 8 }}
                      onChange={(e) => atualizarHabilidade(i, { descricao: e.target.value })}
                    />
                  </div>
                ))}
                <button type="button" className="btn ghost sm" onClick={adicionarHabilidade} style={{ marginTop: habilidades.length ? 10 : 0 }}>+ Habilidade</button>
                {poderes.length > 0 && (
                  <>
                    <p className="dica" style={{ fontSize: 11, marginTop: 12, marginBottom: 4 }}>
                      Poderes de classe (atribuídos pela classe oficial — só leitura aqui):
                    </p>
                    <ul className="previa-pericias">
                      {poderes.map((pod, i) => (
                        <li key={'p-' + i}>
                          <span className="pn">{pod.nome} <span style={{ color: 'var(--txt-fraco)', fontSize: 11 }}>({pod.origem})</span></span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            ) : habilidades.length === 0 && poderes.length === 0 ? (
              <span className="dica">Sem habilidades especiais.</span>
            ) : (
              <ul className="previa-pericias">
                {habilidades.map((h, i) => (
                  <li
                    key={'h-' + i}
                    style={{ cursor: 'pointer' }}
                    onClick={() => aoVerDetalhe({ nome: h.nome, tipo: 'Habilidade', subtitulo: `Origem: ${h.origem || ''}`, descricao: h.descricao || 'Habilidade oficial de personagem.' })}
                  >
                    <span className="pn">{h.nome} <span style={{ color: 'var(--txt-fraco)', fontSize: 11 }}>({h.origem})</span></span>
                  </li>
                ))}
                {poderes.map((pod, i) => (
                  <li
                    key={'p-' + i}
                    style={{ cursor: 'pointer' }}
                    onClick={() => aoVerDetalhe({ nome: pod.nome, tipo: 'Poder de Classe', subtitulo: `Origem: ${pod.origem || ''}`, descricao: pod.descricao || 'Poder de classe oficial.' })}
                  >
                    <span className="pn">{pod.nome} <span style={{ color: 'var(--txt-fraco)', fontSize: 11 }}>({pod.origem})</span></span>
                  </li>
                ))}
              </ul>
            )}
          </BlocoStat>
        </div>

        {/* ------------------------------------------------------- coluna direita: ROLEPLAY (com moldura) + token (solto, fora da moldura) */}
        <div className="ficha-npc-coluna-direita">
          <div className="ficha-npc-roleplay">
            <div className="ficha-npc-rp-cabecalho">Roleplay</div>

            {editando ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['descricaoFisica', 'Descrição Física'],
                  ['tracoDistintivo', 'Traço Distintivo'],
                  ['personalidadeTom', 'Personalidade e Tom de Voz'],
                  ['maneirismo', 'Maneirismo'],
                  ['motivacaoPrincipal', 'Motivação Principal'],
                  ['informacaoUtil', 'Informação Útil'],
                ].map(([chave, rotulo]) => (
                  <div className="campo" key={chave} style={{ marginBottom: 0 }}>
                    <label>{rotulo}</label>
                    <textarea
                      rows={2}
                      value={rp[chave] || ''}
                      onChange={(e) => onAtualizarCampo('comoInterpretar', { ...rp, [chave]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <CampoRoleplay rotulo="Descrição Física" valor={rp.descricaoFisica} />
                <CampoRoleplay rotulo="Traço Distintivo" valor={rp.tracoDistintivo} />
                <CampoRoleplay rotulo="Personalidade e Tom de Voz" valor={rp.personalidadeTom} />
                <CampoRoleplay rotulo="Maneirismo" valor={rp.maneirismo} />
                <CampoRoleplay rotulo="Motivação Principal" valor={rp.motivacaoPrincipal} />
                <CampoRoleplay rotulo="Informação Útil" valor={rp.informacaoUtil} />
                {!rp.descricaoFisica && !rp.tracoDistintivo && !rp.personalidadeTom && !rp.maneirismo && !rp.motivacaoPrincipal && !rp.informacaoUtil && (
                  <p className="dica" style={{ fontSize: 12 }}>Este NPC ainda não tem guia de interpretação — gera outro na aba "Gerar" ou edita esta ficha para o escreveres à mão.</p>
                )}
              </>
            )}
          </div>

          {/* Espaço do token — fora da moldura do roleplay, sem moldura própria.
              A figura inteira, sem recorte; em modo de editar, clicar nela abre
              o editor de token (com pré-visualização e fundo transparente). */}
          <div className="ficha-npc-token ficha-token-fixo">
            <TokenFicha
              imagem={p.imagem}
              nome={p.nome}
              editavel={editando}
              vazio={<img src={tokenPlaceholder} alt="" className="ficha-npc-token-placeholder" />}
              aoMudar={aoUploadImagem}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
