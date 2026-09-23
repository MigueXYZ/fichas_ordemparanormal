import React from 'react';
import { quantidadeDados } from '../../engine/dados.js';
import { acoesDeAmeaca } from '../../engine/combateAtaques.js';
import tokenPlaceholder from '../../assets/token-placeholder.png';
import { BlocoStat, TabelaLinha, CampoRoleplay } from './FichaCardBlocos.jsx';

/**
 * Cartão de Criatura/Ameaça gerada ("ficha 4"), no mesmo formato visual do
 * cartão de NPC (ver FichaNpcCard.jsx): coluna esquerda com o bloco de jogo
 * (vitais, perícias, deslocamento, resistências, ataque, habilidades
 * especiais) em tabelas com borda, coluna direita "ROLEPLAY" com
 * comportamento/aparência/dica para o mestre e, no fundo, o espaço do token.
 *
 * Só de leitura — a edição completa da ameaça continua a ser feita no
 * formulário FichaAmeaca.jsx (botão "Editar Ficha"), tal como o cartão de
 * NPC também só mostra, nunca edita, quando é usado aqui no Gerador.
 */
export default function FichaAmeacaCard({ a, aoVerDetalhe }) {
  const habilidades = a.habilidades || [];
  const pericias = a.pericias || [];
  const resistencias = Array.isArray(a.resistencias) ? a.resistencias : [];
  // Lê `a.acoes` (esquema novo, várias ações) com fallback automático para o
  // `a.ataque` singular antigo — mesma lógica partilhada com o Campo de
  // Batalha e a ficha completa (engine/combateAtaques.js), para não haver
  // três sítios diferentes a decidir isto cada um à sua maneira.
  const acoes = acoesDeAmeaca(a);
  // Um "ameaça" gerado como Ocultista (aba Ocultista) usa este mesmo cartão
  // e traz também poderes paranormais e rituais preparados — uma criatura
  // gerada na aba Criatura/Ameaça nunca tem estes dois campos.
  const poderes = a.poderes || [];
  const rituais = a.rituais || [];

  return (
    <div className="ficha-npc" style={{ marginTop: 16 }}>
      {/* Cabeçalho: nome, breve linha (descritores · tamanho · VD) e descrição/nota, tal como no cartão de NPC */}
      <div className="ficha-npc-cabecalho">
        <div className="ficha-npc-nome">{a.nome}</div>
        <div className="ficha-npc-breve">
          {[a.descritores?.join(' · '), a.tamanho, `VD ${a.vd}${a.grupo ? ` cada (grupo de ${a.grupo.quantidade}, VD ${a.grupo.vdTotal} total)` : ''}`]
            .filter(Boolean)
            .join(' · ')}
        </div>
        {a.notas && <div className="ficha-npc-historia">{a.notas}</div>}
      </div>

      <div className="ficha-npc-corpo">
        {/* ------------------------------------------------------- coluna esquerda: bloco de jogo */}
        <div className="ficha-npc-stats">
          {a.atributos && (
            <BlocoStat titulo="Atributos">
              <TabelaLinha
                colunas={['agi', 'for', 'int', 'pre', 'vig'].map((k) => ({
                  rotulo: k.charAt(0).toUpperCase() + k.slice(1),
                  valor: (() => { const v = Number(a.atributos?.[k] ?? 0); return v > 0 ? `+${v}` : v; })(),
                }))}
              />
            </BlocoStat>
          )}

          <BlocoStat titulo="Vitais">
            <TabelaLinha
              colunas={[
                { rotulo: 'Defesa', valor: a.defesa },
                { rotulo: 'PV', valor: a.pv },
                { rotulo: 'DT', valor: a.dt },
                ...(a.pe != null ? [{ rotulo: 'PE', valor: a.pe }] : []),
              ]}
            />
          </BlocoStat>

          <BlocoStat titulo="Perícias" extra={pericias.length ? `${pericias.length}` : null}>
            {pericias.length === 0 ? (
              <span className="dica">Nenhuma perícia.</span>
            ) : (
              <ul className="previa-pericias">
                {pericias.map((x) => (
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
                    <span className="pn">{x.nome}</span>
                    <span className="pb">{quantidadeDados(x.dados)}d20 +{x.bonus}</span>
                  </li>
                ))}
              </ul>
            )}
          </BlocoStat>

          <BlocoStat titulo="Deslocamento">
            <div className="ficha-npc-attrs">
              <span><b>{a.deslocamento ?? 9}m</b></span>
            </div>
          </BlocoStat>

          <BlocoStat titulo="Resistências">
            {resistencias.length === 0 ? (
              <span className="dica">Sem resistências marcadas.</span>
            ) : (
              <div style={{ fontSize: 12, color: 'var(--txt-dim)' }}>{resistencias.join(' · ')}</div>
            )}
          </BlocoStat>

          <BlocoStat titulo="Ações" extra={acoes.length ? `${acoes.length}` : null}>
            {acoes.length === 0 ? (
              <span className="dica">Sem ações definidas.</span>
            ) : (
              <ul className="previa-pericias" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {acoes.map((acao, i) => (
                  <li
                    key={i}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      aoVerDetalhe({
                        nome: acao.nome,
                        tipo: `Ação (${acao.tipo || 'Padrão'})`,
                        subtitulo: [acao.teste && `Teste: ${acao.teste}`, acao.dano && `Dano: ${acao.dano}${acao.detalhe ? ' ' + acao.detalhe : ''}`].filter(Boolean).join(' · '),
                        tags: [
                          acao.teste && { rotulo: 'Teste de Ataque', valor: acao.teste },
                          acao.dano && { rotulo: 'Dano', valor: acao.dano },
                          acao.detalhe && { rotulo: 'Tipo', valor: acao.detalhe },
                          { rotulo: 'Crítico', valor: acao.critico || 'x2' },
                        ].filter(Boolean),
                        descricao: acao.descricao || `${acao.tipo || 'Padrão'}: rola ${acao.teste || '—'} para acertar e causa ${acao.dano || '—'}${acao.detalhe ? ' de ' + acao.detalhe : ''}.`,
                      })
                    }
                  >
                    <span className="pn">{acao.nome}{acoes.length > 1 ? <span style={{ fontSize: 10, color: 'var(--txt-fraco)', marginLeft: 6 }}>{acao.tipo || 'Padrão'}</span> : null}</span>
                    <span className="pb">{acao.dano}{acao.detalhe ? ' ' + acao.detalhe : ''}</span>
                  </li>
                ))}
              </ul>
            )}
          </BlocoStat>

          <BlocoStat titulo="Habilidades Especiais" extra={habilidades.length ? `${habilidades.length}` : null}>
            {habilidades.length === 0 ? (
              <span className="dica">Sem habilidades especiais.</span>
            ) : (
              <ul className="previa-pericias" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {habilidades.map((h, i) => (
                  <li
                    key={i}
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}
                    onClick={() => aoVerDetalhe({ nome: h.nome, tipo: 'Habilidade Especial', descricao: h.descricao })}
                  >
                    <b className="pn">{h.nome}</b>
                    <span style={{ fontSize: 11, color: 'var(--txt-dim)' }}>{h.descricao}</span>
                  </li>
                ))}
              </ul>
            )}
          </BlocoStat>

          {/* Poderes Paranormais e Rituais — só presentes num ameaça gerado
              como Ocultista (aba Ocultista), nunca numa Criatura/Ameaça comum. */}
          {poderes.length > 0 && (
            <BlocoStat titulo="Poderes Paranormais" extra={`${poderes.length}`}>
              <ul className="previa-pericias" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {poderes.map((p, i) => (
                  <li
                    key={i}
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}
                    onClick={() => aoVerDetalhe({ nome: p.nome, tipo: 'Poder Paranormal', descricao: p.descricao })}
                  >
                    <b className="pn">{p.nome}</b>
                    <span style={{ fontSize: 11, color: 'var(--txt-dim)' }}>{p.descricao}</span>
                  </li>
                ))}
              </ul>
            </BlocoStat>
          )}

          {rituais.length > 0 && (
            <BlocoStat titulo="Rituais Preparados" extra={`${rituais.length}`}>
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
                    <span className="pn">{r.nome}</span>
                    <span className="pb" style={{ textTransform: 'capitalize' }}>DT {r.dt} · {r.circulo}º Círculo</span>
                  </li>
                ))}
              </ul>
            </BlocoStat>
          )}
        </div>

        {/* ------------------------------------------------------- coluna direita: ROLEPLAY (com moldura) + token */}
        <div className="ficha-npc-coluna-direita">
          <div className="ficha-npc-roleplay">
            <div className="ficha-npc-rp-cabecalho">Roleplay</div>
            <CampoRoleplay rotulo="Comportamento" valor={a.comportamento} />
            <CampoRoleplay rotulo="Aparência" valor={a.aparencia} />
            <CampoRoleplay rotulo="Dica para o Mestre" valor={a.dicaRp} />
            {!a.comportamento && !a.aparencia && !a.dicaRp && (
              <p className="dica" style={{ fontSize: 12 }}>Esta ameaça ainda não tem guia de narração — gera outra na aba "Gerar".</p>
            )}
          </div>

          <div className="ficha-npc-token">
            <div className="ficha-npc-token-caixa">
              {a.imagem ? (
                <img src={a.imagem} alt={a.nome} />
              ) : (
                <div className="ficha-npc-token-vazio">
                  <img src={tokenPlaceholder} alt="" className="ficha-npc-token-placeholder" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
