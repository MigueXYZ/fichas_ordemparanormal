import React, { useState, useMemo, useRef } from 'react';
import { CLASSES, TRILHAS } from '../../data/classes.js';
import { ORIGENS } from '../../data/origens.js';
import { PERICIAS_TEXTO } from '../../data/periciasTexto.js';
import { NEX_TRACK, calcMaximos, calcDefesas, calcPericias } from '../../engine/calc.js';
import { quantidadeDados } from '../../engine/dados.js';
import {
  CONCEITOS, ARQUETIPOS_AMEACA, VD_SUGERIDOS, TAMANHOS,
  ELEMENTOS_CULTISTAS, PATENTES_CULTISTAS,
  gerarFicha, gerarNpcAgente, gerarAmeaca, gerarOcultista, vdParaGrupo,
} from '../../engine/geradores.js';
import ModalDetalheGenerico from './ModalDetalheGenerico.jsx';

const SEPARADORES = [
  { id: 'ficha', nome: 'Ficha aleatória' },
  { id: 'npc', nome: 'NPC agente' },
  { id: 'ocultista', nome: 'Ocultista' },
  { id: 'ameaca', nome: 'Criatura / Ameaça' },
];

const ROTULO_GRAU = { treinado: 'T', veterano: 'V', expert: 'E' };

function Resumo({ p, aoVerDetalhe, editando, onAtualizarCampo, aoUploadImagem }) {
  const fileInputRef = useRef(null);
  const classe = CLASSES.find((c) => c.id === p.classeId);
  const trilha = TRILHAS.find((t) => t.id === p.trilhaId);
  const origem = ORIGENS.find((o) => o.id === p.origemId);
  const max = calcMaximos(p);
  const defesas = calcDefesas(p);
  const treinadas = calcPericias(p)
    .filter((x) => x.grau !== 'destreinado')
    .sort((a, b) => b.bonus - a.bonus || a.nome.localeCompare(b.nome, 'pt'));

  const habilidades = p.habilidades || [];
  const poderes = p.poderes || [];
  const rituais = p.rituais || [];

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      aoUploadImagem(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="previa" style={{ marginTop: 16 }}>
      {/* Bloco de Imagem e Identificação */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
        {/* Avatar / Imagem */}
        <div style={{ position: 'relative', width: 90, height: 90, borderRadius: 8, overflow: 'hidden', border: '2px solid var(--borda)', background: '#0e0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {p.imagem ? (
            <img src={p.imagem} alt={p.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 11, color: 'var(--txt-fraco)', textAlign: 'center', padding: 4 }}>Sem Imagem</span>
          )}
          {editando && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0,0,0,0.75)',
                color: '#fff',
                border: 'none',
                fontSize: 10,
                padding: '3px 0',
                cursor: 'pointer',
              }}
            >
              Trocar
            </button>
          )}
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          {editando ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input
                type="text"
                value={p.nome}
                onChange={(e) => onAtualizarCampo('nome', e.target.value)}
                placeholder="Nome do agente"
                style={{ fontSize: 18, fontWeight: 'bold', width: '100%' }}
              />
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="text"
                  placeholder="URL da Imagem"
                  value={p.imagem || ''}
                  onChange={(e) => onAtualizarCampo('imagem', e.target.value)}
                  style={{ fontSize: 12, flex: 1 }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="previa-nome" style={{ margin: 0 }}>{p.nome}</div>
              <div className="previa-linha" style={{ marginTop: 4 }}>
                {[
                  origem?.nome,
                  classe?.nome,
                  trilha ? `Trilha: ${trilha.nome}` : null,
                  `NEX ${p.nex}%`,
                ].filter(Boolean).join(' · ')}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Atributos */}
      {editando ? (
        <div className="grelha-editor" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 10 }}>
          {['for', 'agi', 'int', 'pre', 'vig'].map((k) => (
            <div className="campo" key={k}>
              <label>{k.toUpperCase()}</label>
              <input
                type="number"
                value={p.atributos?.[k] ?? 1}
                onChange={(e) =>
                  onAtualizarCampo('atributos', {
                    ...(p.atributos || {}),
                    [k]: Number(e.target.value),
                  })
                }
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="previa-attrs">
          {Object.entries(p.atributos || {}).map(([k, v]) => (
            <span key={k}><b>{v}</b> {k.toUpperCase()}</span>
          ))}
        </div>
      )}

      {/* Vitais */}
      <div className="previa-attrs">
        <span><b>{max.pv}</b> PV</span>
        <span><b>{max.san}</b> SAN</span>
        <span><b>{max.pe}</b> PE</span>
        <span><b>{defesas.defesa}</b> DEFESA</span>
      </div>

      {/* Comportamento e Roleplay */}
      {editando ? (
        <div className="previa-bloco" style={{ background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 4, marginTop: 10 }}>
          <div className="previa-rotulo">Editar Interpretação & RP</div>
          <div className="campo" style={{ marginBottom: 6 }}>
            <label>Comportamento fora do comum</label>
            <input
              type="text"
              value={p.comportamento || ''}
              onChange={(e) => onAtualizarCampo('comportamento', e.target.value)}
            />
          </div>
          <div className="campo" style={{ marginBottom: 6 }}>
            <label>Aparência marcante</label>
            <input
              type="text"
              value={p.aparencia || ''}
              onChange={(e) => onAtualizarCampo('aparencia', e.target.value)}
            />
          </div>
          <div className="campo">
            <label>Dica de RP</label>
            <input
              type="text"
              value={p.dicaRp || ''}
              onChange={(e) => onAtualizarCampo('dicaRp', e.target.value)}
            />
          </div>
        </div>
      ) : (
        (p.comportamento || p.aparencia || p.dicaRp) && (
          <div className="previa-bloco" style={{ background: 'rgba(255,255,255,0.03)', padding: 8, borderRadius: 4, marginTop: 10 }}>
            <div className="previa-rotulo" style={{ color: 'var(--txt)' }}>Interpretação & RP</div>
            {p.comportamento && (
              <div style={{ fontSize: 12, marginBottom: 4 }}>
                <b style={{ color: 'var(--energia-claro)' }}>Comportamento:</b> {p.comportamento}
              </div>
            )}
            {p.aparencia && (
              <div style={{ fontSize: 12, marginBottom: 4 }}>
                <b style={{ color: 'var(--txt-dim)' }}>Aparência:</b> {p.aparencia}
              </div>
            )}
            {p.dicaRp && (
              <div style={{ fontSize: 12 }}>
                <b style={{ color: 'var(--conhecimento-claro)' }}>Dica de RP:</b> {p.dicaRp}
              </div>
            )}
          </div>
        )
      )}

      {/* Perícias Treinadas (Clicáveis) */}
      <div className="previa-bloco">
        <div className="previa-rotulo" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Perícias treinadas ({treinadas.length})</span>
          <span style={{ fontSize: 11, color: 'var(--txt-fraco)' }}>Clica para ver detalhes</span>
        </div>
        {treinadas.length === 0 ? (
          <div className="previa-linha">nenhuma</div>
        ) : (
          <ul className="previa-pericias">
            {treinadas.map((x) => (
              <li
                key={x.id}
                style={{ cursor: 'pointer', transition: 'background 0.15s' }}
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
                    descricao: PERICIAS_TEXTO[x.id]?.sumario || PERICIAS_TEXTO[x.id]?.descricao || 'Perícia oficial de Ordem Paranormal RPG.',
                  })
                }
              >
                <span className="pn" style={{ textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}>{x.nome}</span>
                <span className="pg" title={x.grau}>{ROTULO_GRAU[x.grau] || ''}</span>
                <span className="pb">{quantidadeDados(x.dados)}d20 {x.bonus >= 0 ? '+' : '−'}{Math.abs(x.bonus)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Habilidades e Poderes (Clicáveis) */}
      {(habilidades.length > 0 || poderes.length > 0) && (
        <div className="previa-bloco">
          <div className="previa-rotulo" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Habilidades & Poderes ({habilidades.length + poderes.length})</span>
            <span style={{ fontSize: 11, color: 'var(--txt-fraco)' }}>Clica para ler o texto</span>
          </div>
          <ul className="previa-pericias">
            {habilidades.map((h, i) => (
              <li
                key={'h-' + i}
                style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                onClick={() =>
                  aoVerDetalhe({
                    nome: h.nome,
                    tipo: 'Habilidade',
                    subtitulo: `Origem: ${h.origem}`,
                    descricao: h.descricao || 'Habilidade oficial de personagem.',
                  })
                }
              >
                <span className="pn" style={{ textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}>
                  {h.nome} <span style={{ color: 'var(--txt-fraco)', fontSize: 11 }}>({h.origem})</span>
                </span>
              </li>
            ))}
            {poderes.map((pod, i) => (
              <li
                key={'p-' + i}
                style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                onClick={() =>
                  aoVerDetalhe({
                    nome: pod.nome,
                    tipo: 'Poder de Classe',
                    subtitulo: `Origem: ${pod.origem}`,
                    descricao: pod.descricao || 'Poder de classe oficial.',
                  })
                }
              >
                <span className="pn" style={{ textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}>
                  {pod.nome} <span style={{ color: 'var(--txt-fraco)', fontSize: 11 }}>({pod.origem})</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Rituais Conhecidos (Clicáveis) */}
      {rituais.length > 0 && (
        <div className="previa-bloco">
          <div className="previa-rotulo" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Rituais Conhecidos ({rituais.length})</span>
            <span style={{ fontSize: 11, color: 'var(--txt-fraco)' }}>Clica para ver efeitos</span>
          </div>
          <ul className="previa-pericias">
            {rituais.map((r, i) => (
              <li
                key={'r-' + i}
                style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                onClick={() =>
                  aoVerDetalhe({
                    nome: r.nome,
                    tipo: `Ritual de ${r.circulo}º Círculo`,
                    subtitulo: `Elemento: ${r.elemento} · Custo: ${r.custo}`,
                    tags: [
                      { rotulo: 'Círculo', valor: `${r.circulo}º Círculo` },
                      { rotulo: 'Elemento', valor: r.elemento },
                      { rotulo: 'Execução', valor: r.execucao || 'Padrão' },
                      { rotulo: 'Alcance', valor: r.alcance || 'Curto' },
                      { rotulo: 'Duração', valor: r.duracao || 'Instantânea' },
                    ],
                    descricao: r.descricao || 'Ritual oficial do Outro Lado.',
                  })
                }
              >
                <span className="pn" style={{ textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}>{r.nome}</span>
                <span className="pb" style={{ textTransform: 'capitalize' }}>{r.circulo}º Círculo · {r.elemento}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ataques (Clicáveis) */}
      {p.ataques?.length > 0 && (
        <div className="previa-bloco">
          <div className="previa-rotulo">Ataques</div>
          <ul className="previa-pericias">
            {p.ataques.map((at, i) => (
              <li
                key={i}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  aoVerDetalhe({
                    nome: at.nome,
                    tipo: 'Ataque / Arma',
                    subtitulo: `Perícia: ${at.pericia?.toUpperCase()} · Dano: ${at.dano} ${at.tipo || ''}`,
                    tags: [
                      { rotulo: 'Dano', valor: at.dano },
                      { rotulo: 'Tipo', valor: at.tipo || 'Impacto' },
                      { rotulo: 'Crítico', valor: `${at.margem || 20}/x${at.multiplicador || 2}` },
                      { rotulo: 'Alcance', valor: at.alcance || 'Curto' },
                    ],
                    descricao: at.notas || 'Arma / ataque equipado no personagem.',
                  })
                }
              >
                <span className="pn" style={{ textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}>{at.nome}</span>
                <span className="pb">{at.dano}{at.tipo ? ' ' + at.tipo : ''}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FichaAmeacaPrevia({ a, aoVerDetalhe, editando, onAtualizarCampo, aoUploadImagem }) {
  const fileInputRef = useRef(null);
  const habilidades = a.habilidades || [];
  const rituais = a.rituais || [];

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      aoUploadImagem(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="previa" style={{ marginTop: 16 }}>
      {/* Bloco de Imagem e Identificação */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
        <div style={{ position: 'relative', width: 90, height: 90, borderRadius: 8, overflow: 'hidden', border: '2px solid var(--borda)', background: '#0e0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {a.imagem ? (
            <img src={a.imagem} alt={a.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 11, color: 'var(--txt-fraco)', textAlign: 'center', padding: 4 }}>Sem Imagem</span>
          )}
          {editando && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0,0,0,0.75)',
                color: '#fff',
                border: 'none',
                fontSize: 10,
                padding: '3px 0',
                cursor: 'pointer',
              }}
            >
              Trocar
            </button>
          )}
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          {editando ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input
                type="text"
                value={a.nome}
                onChange={(e) => onAtualizarCampo('nome', e.target.value)}
                placeholder="Nome da ameaça"
                style={{ fontSize: 18, fontWeight: 'bold', width: '100%' }}
              />
              <input
                type="text"
                placeholder="URL da Imagem"
                value={a.imagem || ''}
                onChange={(e) => onAtualizarCampo('imagem', e.target.value)}
                style={{ fontSize: 12 }}
              />
            </div>
          ) : (
            <>
              <div className="previa-nome" style={{ margin: 0 }}>{a.nome}</div>
              <div className="previa-linha" style={{ marginTop: 4 }}>
                {a.descritores?.join(' · ')} · {a.tamanho} · VD {a.vd}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Vitais */}
      {editando ? (
        <div className="grelha-editor" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 10 }}>
          <div className="campo">
            <label>DEFESA</label>
            <input type="number" value={a.defesa} onChange={(e) => onAtualizarCampo('defesa', Number(e.target.value))} />
          </div>
          <div className="campo">
            <label>PV MÁXIMO</label>
            <input type="number" value={a.pv} onChange={(e) => onAtualizarCampo('pv', Number(e.target.value))} />
          </div>
          <div className="campo">
            <label>DT</label>
            <input type="number" value={a.dt} onChange={(e) => onAtualizarCampo('dt', Number(e.target.value))} />
          </div>
          <div className="campo">
            <label>VD</label>
            <input type="number" value={a.vd} onChange={(e) => onAtualizarCampo('vd', Number(e.target.value))} />
          </div>
        </div>
      ) : (
        <div className="previa-attrs">
          <span><b>{a.defesa}</b> DEFESA</span>
          <span><b>{a.pv}</b> PV</span>
          <span><b>{a.dt}</b> DT</span>
          {a.pe != null && <span><b>{a.pe}</b> PE</span>}
        </div>
      )}

      {/* Comportamento e Dicas de RP */}
      {editando ? (
        <div className="previa-bloco" style={{ background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 4, marginTop: 10 }}>
          <div className="previa-rotulo">Editar Narração & RP</div>
          <div className="campo" style={{ marginBottom: 6 }}>
            <label>Comportamento sinistro</label>
            <input type="text" value={a.comportamento || ''} onChange={(e) => onAtualizarCampo('comportamento', e.target.value)} />
          </div>
          <div className="campo" style={{ marginBottom: 6 }}>
            <label>Aparência</label>
            <input type="text" value={a.aparencia || ''} onChange={(e) => onAtualizarCampo('aparencia', e.target.value)} />
          </div>
          <div className="campo">
            <label>Dica para o Mestre</label>
            <input type="text" value={a.dicaRp || ''} onChange={(e) => onAtualizarCampo('dicaRp', e.target.value)} />
          </div>
        </div>
      ) : (
        (a.comportamento || a.aparencia || a.dicaRp) && (
          <div className="previa-bloco" style={{ background: 'rgba(255,255,255,0.03)', padding: 8, borderRadius: 4, marginTop: 10 }}>
            <div className="previa-rotulo" style={{ color: 'var(--txt)' }}>Comportamento & Narração</div>
            {a.comportamento && (
              <div style={{ fontSize: 12, marginBottom: 4 }}>
                <b style={{ color: 'var(--sangue-claro)' }}>Comportamento:</b> {a.comportamento}
              </div>
            )}
            {a.aparencia && (
              <div style={{ fontSize: 12, marginBottom: 4 }}>
                <b style={{ color: 'var(--txt-dim)' }}>Aparência:</b> {a.aparencia}
              </div>
            )}
            {a.dicaRp && (
              <div style={{ fontSize: 12 }}>
                <b style={{ color: 'var(--conhecimento-claro)' }}>Dica para o Mestre:</b> {a.dicaRp}
              </div>
            )}
          </div>
        )
      )}

      {/* Perícias */}
      {a.pericias?.length > 0 && (
        <div className="previa-bloco">
          <div className="previa-rotulo">Perícias ({a.pericias.length})</div>
          <ul className="previa-pericias">
            {a.pericias.map((x) => (
              <li
                key={x.nome}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  aoVerDetalhe({
                    nome: x.nome,
                    tipo: 'Perícia de Ameaça',
                    tags: [
                      { rotulo: 'Teste', valor: `${quantidadeDados(x.dados)}d20+${x.bonus}` },
                      { rotulo: 'Dados', valor: `${x.dados}d20` },
                      { rotulo: 'Bónus', valor: `+${x.bonus}` },
                    ],
                    descricao: `Teste de perícia para a criatura: ${quantidadeDados(x.dados)}d20+${x.bonus}.`,
                  })
                }
              >
                <span className="pn" style={{ textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}>{x.nome}</span>
                <span className="pb">{quantidadeDados(x.dados)}d20 +{x.bonus}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Habilidades Especiais / Poderes Paranormais */}
      {habilidades.length > 0 && (
        <div className="previa-bloco">
          <div className="previa-rotulo" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Habilidades Especiais ({habilidades.length})</span>
            <span style={{ fontSize: 11, color: 'var(--txt-fraco)' }}>Clica para expandir</span>
          </div>
          <ul className="previa-pericias" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {habilidades.map((h, i) => (
              <li
                key={i}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}
                onClick={() =>
                  aoVerDetalhe({
                    nome: h.nome,
                    tipo: 'Habilidade Especial',
                    descricao: h.descricao,
                  })
                }
              >
                <b style={{ color: 'var(--txt)', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}>{h.nome}</b>
                <span style={{ fontSize: 11, color: 'var(--txt-dim)' }}>{h.descricao}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Rituais (para Ocultistas) */}
      {rituais.length > 0 && (
        <div className="previa-bloco">
          <div className="previa-rotulo" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Rituais Preparados ({rituais.length})</span>
            <span style={{ fontSize: 11, color: 'var(--txt-fraco)' }}>Clica para ver efeitos</span>
          </div>
          <ul className="previa-pericias">
            {rituais.map((r, i) => (
              <li
                key={i}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  aoVerDetalhe({
                    nome: r.nome,
                    tipo: `Ritual de ${r.circulo}º Círculo`,
                    subtitulo: `Elemento: ${r.elemento} · DT ${r.dt} · Custo: ${r.custo}`,
                    tags: [
                      { rotulo: 'DT', valor: r.dt },
                      { rotulo: 'Círculo', valor: `${r.circulo}º Círculo` },
                      { rotulo: 'Elemento', valor: r.elemento },
                      { rotulo: 'Execução', valor: r.execucao || 'Padrão' },
                      { rotulo: 'Alcance', valor: r.alcance || 'Curto' },
                    ],
                    descricao: r.descricao || 'Ritual canalizado pelo cultista.',
                  })
                }
              >
                <span className="pn" style={{ textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}>{r.nome}</span>
                <span className="pb" style={{ textTransform: 'capitalize' }}>DT {r.dt} · {r.circulo}º Círculo</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className="previa-linha"
        style={{ marginTop: 8, cursor: 'pointer' }}
        onClick={() =>
          aoVerDetalhe({
            nome: a.ataque.nome,
            tipo: 'Ataque de Ameaça',
            subtitulo: `Teste: ${a.ataque.teste} · Dano: ${a.ataque.dano} ${a.ataque.tipo}`,
            tags: [
              { rotulo: 'Teste de Ataque', valor: a.ataque.teste },
              { rotulo: 'Dano', valor: a.ataque.dano },
              { rotulo: 'Tipo', valor: a.ataque.tipo },
              { rotulo: 'Crítico', valor: a.ataque.critico || 'x2' },
            ],
            descricao: `Ataque principal da criatura/inimigo: rola ${a.ataque.teste} para acertar e causa ${a.ataque.dano} de dano ${a.ataque.tipo}.`,
          })
        }
      >
        <b>Ataque:</b> <span style={{ textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}>{a.ataque.nome}</span> ({a.ataque.teste}) · dano {a.ataque.dano} {a.ataque.tipo}
      </div>
    </div>
  );
}

export default function Geradores({ aoGuardar, aoAbrir }) {
  const [aba, setAba] = useState('ficha');
  const [nex, setNex] = useState(5);
  const [conceito, setConceito] = useState('surpresa');
  const [classeId, setClasseId] = useState('');
  const [trilhaId, setTrilhaId] = useState('');
  const [origemId, setOrigemId] = useState('');
  const [vd, setVd] = useState(20);
  const [arquetipo, setArquetipo] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [elementoCultista, setElementoCultista] = useState('');
  const [patenteCultista, setPatenteCultista] = useState('');
  const [nexGrupo, setNexGrupo] = useState(20);
  const [resultado, setResultado] = useState(null);
  const [editando, setEditando] = useState(false);
  const [itemDetalhe, setItemDetalhe] = useState(null);

  const trilhasDisponiveis = useMemo(() => {
    if (!classeId) return TRILHAS;
    const cl = CLASSES.find((c) => c.id === classeId);
    return cl?.trilhas || [];
  }, [classeId]);

  function gerar() {
    setEditando(false);
    if (aba === 'ameaca') {
      setResultado(gerarAmeaca({ vd: Number(vd), arquetipo: arquetipo || null, tamanho: tamanho || null }));
      return;
    }
    if (aba === 'ocultista') {
      setResultado(gerarOcultista({
        vd: Number(vd),
        elemento: elementoCultista || null,
        patente: patenteCultista || null,
      }));
      return;
    }
    const opcoes = {
      nex: Number(nex),
      conceito,
      classeId: classeId || null,
      trilhaId: trilhaId || null,
      origemId: origemId || null,
    };
    setResultado(aba === 'npc' ? gerarNpcAgente(opcoes) : gerarFicha(opcoes));
  }

  function handleAtualizarCampo(campo, valor) {
    setResultado((ant) => ({
      ...ant,
      [campo]: valor,
    }));
  }

  function handleUploadImagem(dataUrl) {
    setResultado((ant) => ({
      ...ant,
      imagem: dataUrl,
    }));
  }

  return (
    <div>
      <div className="abas" style={{ marginBottom: 20 }}>
        {SEPARADORES.map((s) => (
          <button
            key={s.id}
            className={aba === s.id ? 'ativa' : ''}
            onClick={() => { setAba(s.id); setResultado(null); setEditando(false); }}
          >
            {s.nome}
          </button>
        ))}
      </div>

      {/* Aba 1 e 2: Ficha e NPC Agente */}
      {(aba === 'ficha' || aba === 'npc') && (
        <>
          <p className="dica" style={{ marginTop: 0 }}>
            {aba === 'npc'
              ? 'NPC com ficha de agente completa — poderes, habilidades de trilha, rituais, comportamento fora do comum e dicas de RP.'
              : 'Uma ficha jogável inteira: atributos, origem, classe, trilha, poderes de NEX, rituais, comportamento e equipamento.'}
          </p>
          <div className="grelha-editor" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
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
              <select
                value={classeId}
                onChange={(e) => {
                  setClasseId(e.target.value);
                  setTrilhaId('');
                }}
              >
                <option value="">Ao acaso</option>
                {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Trilha</label>
              <select value={trilhaId} onChange={(e) => setTrilhaId(e.target.value)}>
                <option value="">Ao acaso</option>
                {trilhasDisponiveis.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome} {!classeId && t.classeNome ? `(${t.classeNome})` : ''}
                  </option>
                ))}
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

      {/* Aba 3: Ocultista */}
      {aba === 'ocultista' && (
        <>
          <p className="dica" style={{ marginTop: 0 }}>
            Ocultistas e cultistas não-agentes: rituais prontos com DT, poderes paranormais do culto, armas amaldiçoadas e dicas de interpretação macabra.
          </p>
          <div className="grelha-editor" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
            <div className="campo">
              <label>Valor de Desafio (VD)</label>
              <select value={vd} onChange={(e) => setVd(Number(e.target.value))}>
                {VD_SUGERIDOS.map((v) => <option key={v} value={v}>VD {v}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Elemento Paranormal</label>
              <select value={elementoCultista} onChange={(e) => setElementoCultista(e.target.value)}>
                <option value="">Ao acaso</option>
                {ELEMENTOS_CULTISTAS.map((el) => <option key={el} value={el}>{el}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Patente do Culto</label>
              <select value={patenteCultista} onChange={(e) => setPatenteCultista(e.target.value)}>
                <option value="">Automático por VD</option>
                {PATENTES_CULTISTAS.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>NEX somado do grupo</label>
              <input type="number" value={nexGrupo} onChange={(e) => setNexGrupo(Number(e.target.value))} />
            </div>
          </div>
          <div className="dica" style={{ marginTop: 6, fontSize: 12 }}>
            Referência de VD para o grupo: fácil {vdParaGrupo(nexGrupo, 'facil')} · equilibrado {vdParaGrupo(nexGrupo)} · difícil {vdParaGrupo(nexGrupo, 'dificil')}
          </div>
        </>
      )}

      {/* Aba 4: Criatura / Ameaça */}
      {aba === 'ameaca' && (
        <>
          <p className="dica" style={{ marginTop: 0 }}>
            Ameaças e criaturas com habilidades especiais, comportamento sinistro, descrição aterrorizante e dicas de narração para o Mestre.
          </p>
          <div className="grelha-editor" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
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
            </div>
          </div>
          <div className="dica" style={{ marginTop: 6, fontSize: 12 }}>
            Referência de VD para o grupo: fácil {vdParaGrupo(nexGrupo, 'facil')} · equilibrado {vdParaGrupo(nexGrupo)} · difícil {vdParaGrupo(nexGrupo, 'dificil')}
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn" onClick={gerar}>Gerar</button>
        {resultado && <button className="btn ghost" onClick={gerar}>Outra vez</button>}
        {resultado && (
          <>
            <button
              type="button"
              className={`btn ${editando ? '' : 'ghost'}`}
              onClick={() => setEditando(!editando)}
            >
              {editando ? 'Concluir Edição' : 'Editar Ficha'}
            </button>
            <button className="btn ghost" onClick={() => aoGuardar(resultado)}>Guardar</button>
            {resultado.tipo !== 'ameaca' && (
              <button className="btn" onClick={() => { const g = aoGuardar(resultado); aoAbrir(g || resultado); }}>
                Guardar e abrir
              </button>
            )}
          </>
        )}
      </div>

      {resultado && (resultado.tipo === 'ameaca'
        ? <FichaAmeacaPrevia
            a={resultado}
            aoVerDetalhe={setItemDetalhe}
            editando={editando}
            onAtualizarCampo={handleAtualizarCampo}
            aoUploadImagem={handleUploadImagem}
          />
        : <Resumo
            p={resultado}
            aoVerDetalhe={setItemDetalhe}
            editando={editando}
            onAtualizarCampo={handleAtualizarCampo}
            aoUploadImagem={handleUploadImagem}
          />)}

      {/* Modal de Detalhe Genérico */}
      {itemDetalhe && (
        <ModalDetalheGenerico item={itemDetalhe} aoFechar={() => setItemDetalhe(null)} />
      )}
    </div>
  );
}
