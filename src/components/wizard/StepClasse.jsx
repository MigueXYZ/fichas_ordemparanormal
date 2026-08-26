import React, { useState } from 'react';
import { CLASSES } from '../../data/classes.js';
import { PERICIAS, PERICIAS_POR_ID } from '../../data/pericias.js';
import { calcMaximos, orcamentoPericias, nexEfetivo } from '../../engine/calc.js';
import { aplicarConcessoes } from '../../engine/concessoes.js';

/**
 * Emblema "de perk" por classe — arte original nossa (nunca a arte real do
 * livro, que é comercial), um símbolo simples por classe dentro de um selo
 * circular: mira para o Combatente, lupa para o Especialista, olho num
 * triângulo para o Ocultista, bússola para o Sobrevivente.
 */
function IconeClasse({ id }) {
  return (
    <svg className="classe-icone-svg" viewBox="0 0 100 100" aria-hidden="true">
      {/* Círculo base limpo */}
      <circle cx="50" cy="50" r="44" fill="#120c0e" stroke="var(--linha-forte)" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="39" fill="none" stroke="var(--sangue)" strokeWidth="1" opacity="0.4" />

      {/* COMBATENTE: Espadas cruzadas simples e diretas */}
      {id === 'combatente' && (
        <g stroke="var(--sangue-claro)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1="28" y1="28" x2="72" y2="72" />
          <line x1="32" y1="24" x2="24" y2="32" strokeWidth="2.5" />
          <line x1="72" y1="28" x2="28" y2="72" />
          <line x1="68" y1="24" x2="76" y2="32" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="3.5" fill="var(--sangue-claro)" stroke="none" />
        </g>
      )}

      {/* ESPECIALISTA: Lupa minimalista e nítida */}
      {id === 'especialista' && (
        <g stroke="var(--sangue-claro)" strokeWidth="3.5" strokeLinecap="round" fill="none">
          <circle cx="43" cy="43" r="18" />
          <line x1="56" y1="56" x2="74" y2="74" strokeWidth="4.5" />
          <circle cx="43" cy="43" r="3" fill="var(--sangue-claro)" stroke="none" />
        </g>
      )}

      {/* OCULTISTA: Triângulo com olho místico central direto */}
      {id === 'ocultista' && (
        <g stroke="var(--sangue-claro)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <polygon points="50,25 76,70 24,70" />
          <path d="M37 53 Q50 43 63 53 Q50 63 37 53 Z" strokeWidth="2" fill="none" />
          <circle cx="50" cy="53" r="3.5" fill="var(--sangue-claro)" stroke="none" />
        </g>
      )}

      {/* SOBREVIVENTE: Escudo com batimento cardíaco resiliente */}
      {id === 'sobrevivente' && (
        <g stroke="var(--sangue-claro)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M50 25 C66 25 72 32 72 48 C72 64 50 74 50 74 C50 74 28 64 28 48 C28 32 34 25 50 25 Z" />
          <path d="M38 50 L44 50 L48 42 L52 58 L56 50 L62 50" strokeWidth="2.5" />
        </g>
      )}
    </svg>
  );
}

/**
 * Passo de Classe — como Atributos e Origem, vive dentro do ecrã "registo"
 * (ver CrtEcra.jsx em Wizard.jsx). Como só há 3-4 classes, em vez de lista
 * ficam lado a lado como colunas verticais — nome, resumo do livro (com
 * scroll próprio, porque a Sobrevivente é bem mais longa que as outras),
 * estatísticas iniciais e o emblema acima.
 */
export default function StepClasse({ personagem, setPersonagem }) {
  const classe = CLASSES.find((c) => c.id === personagem.classeId);
  const orc = orcamentoPericias(personagem);
  // que colunas mostram o texto todo em vez de só o 1.º parágrafo — a caixa
  // da descrição tem altura fixa e scroll próprio, por isso abrir uma não
  // empurra o emblema/botão das outras, mantendo tudo alinhado
  const [expandidas, setExpandidas] = useState(() => new Set());
  function alternarExpandida(id) {
    setExpandidas((prev) => {
      const novo = new Set(prev);
      if (novo.has(id)) novo.delete(id); else novo.add(id);
      return novo;
    });
  }

  const nexUtil = nexEfetivo(personagem);
  const trilhas = classe?.trilhas || [];
  const escolhasFeitas = personagem.periciasEscolhaClasse || {};
  const livresEscolhidas = personagem.periciasLivresClasse || [];

  function recalcular(base, escolhas, livres) {
    const ids = [...orcamentoPericias(base).obrigatorias, ...Object.values(escolhas).filter(Boolean), ...livres];
    return aplicarConcessoes(
      { ...base, periciasEscolhaClasse: escolhas, periciasLivresClasse: livres },
      'classe',
      [...new Set(ids)]
    );
  }

  function escolherClasse(c) {
    const base = {
      ...personagem,
      classeId: c.id,
      trilhaId: null,
      proficiencias: [...(c.proficiencias || [])],
    };
    setPersonagem(recalcular(base, {}, []));
  }

  function definirEscolha(indice, periciaId) {
    setPersonagem(recalcular(personagem, { ...escolhasFeitas, [indice]: periciaId }, livresEscolhidas));
  }

  function alternarLivre(id) {
    const jaEscolhida = livresEscolhidas.includes(id);
    if (!jaEscolhida && livresEscolhidas.length >= orc.livres) return;
    const novas = jaEscolhida ? livresEscolhidas.filter((x) => x !== id) : [...livresEscolhidas, id];
    setPersonagem(recalcular(personagem, escolhasFeitas, novas));
  }

  const previa = personagem.classeId ? calcMaximos(personagem) : null;
  const bloqueadas = new Set([
    ...orc.obrigatorias,
    ...Object.values(escolhasFeitas).filter(Boolean),
    ...(personagem.concedidas?.origem || []),
  ]);

  return (
    <>
      <p className="texto-regra crt-regra">
        A tua classe indica o treino que recebeste na Ordem para enfrentar os perigos do Outro Lado.
        Em termos de jogo é a característica mais importante: define o que fazes e qual é o teu papel no grupo.
      </p>
      <p className="texto-regra crt-regra" style={{ marginBottom: 16 }}>
        As perícias concedidas são adicionadas automaticamente — as opcionais podem ser ajustadas depois de criado.
      </p>

      <div className="grade-classes">
        {CLASSES.map((c) => {
          const selecionada = personagem.classeId === c.id;
          const expandida = expandidas.has(c.id);
          const paragrafos = c.descricao.split('\n\n');
          return (
            <div key={c.id} className={'coluna-classe' + (selecionada ? ' selecionada' : '')}>
              <div className="coluna-classe-cabecalho">
                <span className="coluna-classe-nome">{c.nome}</span>
                <span className="coluna-classe-livro">{c.livro}</span>
                <span className="pill origem-pill-escolhida coluna-classe-pill" style={{ visibility: selecionada ? 'visible' : 'hidden' }}>
                  Escolhida
                </span>
              </div>

              <div className="coluna-classe-descricao">
                <p>{paragrafos[0]}</p>
                {expandida && paragrafos.slice(1).map((paragrafo, i) => <p key={i}>{paragrafo}</p>)}
              </div>
              <button
                type="button"
                className="coluna-classe-seta"
                onClick={() => alternarExpandida(c.id)}
                aria-expanded={expandida}
                title={expandida ? 'Mostrar só o resumo' : 'Mostrar o texto todo'}
              >
                <span aria-hidden="true">{expandida ? '▴' : '▾'}</span>
              </button>

              <div className="coluna-classe-stats">
                <span className="pill">PV {c.progressao.pv.inicial}+VIG</span>
                <span className="pill">SAN {c.progressao.san.inicial}</span>
                <span className="pill">PE {c.progressao.pe.inicial}+PRE</span>
              </div>
              <div className="coluna-classe-notas">
                <p className="coluna-classe-nota"><b>Perícias.</b> {c.pericias?.nota}</p>
                <p className="coluna-classe-nota"><b>Proficiências.</b> {(c.proficiencias || []).join(', ')}</p>
              </div>

              <div className="coluna-classe-icone"><IconeClasse id={c.id} /></div>

              <button type="button" className="btn sm coluna-classe-escolher" onClick={() => escolherClasse(c)}>
                {selecionada ? 'Escolhida' : 'Escolher'}
              </button>
            </div>
          );
        })}
      </div>

      {classe && trilhas.length > 0 && (
        <div className="card" style={{ marginTop: 22 }}>
          <h3 style={{ fontSize: 18 }}>Trilha de {classe.nome}</h3>
          <div className="barra" />
          <p style={{ color: 'var(--txt-dim)', fontSize: 13, marginTop: 0 }}>
            {nexUtil >= 10
              ? 'A trilha escolhe-se a partir de NEX 10% e traz poderes em 10%, 40%, 65% e 99%.'
              : `Ainda não dá: a trilha abre em ${personagem.regras?.nivelSeparado ? 'nível 2' : 'NEX 10%'}. Podes deixar para depois — mudas na ficha a qualquer momento.`}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button
              type="button"
              className={'btn sm' + (personagem.trilhaId ? ' ghost' : '')}
              onClick={() => setPersonagem({ ...personagem, trilhaId: null })}
            >
              Sem trilha
            </button>
            {trilhas.map((t) => (
              <button
                key={t.id}
                type="button"
                className={'btn sm' + (personagem.trilhaId === t.id ? '' : ' ghost')}
                disabled={nexUtil < 10}
                title={t.descricao || t.nome}
                onClick={() => setPersonagem({ ...personagem, trilhaId: t.id })}
              >
                {t.nome}
              </button>
            ))}
          </div>
          {personagem.trilhaId && (
            <p style={{ color: 'var(--txt-dim)', fontSize: 13 }}>
              {trilhas.find((t) => t.id === personagem.trilhaId)?.descricao || ''}
            </p>
          )}
        </div>
      )}

      {classe && (
        <div className="card" style={{ marginTop: 22 }}>
          <h3 style={{ fontSize: 18 }}>Perícias treinadas de {classe.nome}</h3>
          <div className="barra" />
          <p style={{ color: 'var(--txt-dim)', fontSize: 13, marginTop: 0 }}>{orc.nota}</p>

          {orc.obrigatorias.length > 0 && (
            <p style={{ fontSize: 14 }}>
              <b>Automáticas:</b> {orc.obrigatorias.map((id) => PERICIAS_POR_ID[id]?.nome).join(', ')}
            </p>
          )}

          {orc.escolhas.map((esc, i) => (
            <div className="campo" key={i} style={{ maxWidth: 320 }}>
              <label>Escolhe uma</label>
              <select value={escolhasFeitas[i] || ''} onChange={(e) => definirEscolha(i, e.target.value)}>
                <option value="">—</option>
                {esc.entre.map((id) => <option key={id} value={id}>{PERICIAS_POR_ID[id]?.nome}</option>)}
              </select>
            </div>
          ))}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, marginBottom: 10 }}>
            <strong style={{ color: livresEscolhidas.length === orc.livres ? 'var(--ok)' : 'var(--accent)', fontSize: 20 }}>
              {orc.livres - livresEscolhidas.length}
            </strong>
            <span style={{ fontSize: 14 }}>perícias livres por escolher (total {orc.livres})</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PERICIAS.map((p) => {
              const fixa = bloqueadas.has(p.id);
              const ativa = livresEscolhidas.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  className={'btn sm' + (ativa ? '' : ' ghost')}
                  disabled={fixa}
                  title={fixa ? 'Já treinada por origem ou classe' : ''}
                  onClick={() => alternarLivre(p.id)}
                  style={fixa ? { opacity: 0.35 } : undefined}
                >
                  {p.nome}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {previa && (
        <div className="card" style={{ marginTop: 22 }}>
          <h3 style={{ fontSize: 18 }}>
            {personagem.regras?.nivelSeparado
              ? `Prévia no nível ${personagem.nivel ?? 1}`
              : `Prévia em NEX ${personagem.nex}%`}
          </h3>
          <div className="barra" />
          <div style={{ display: 'flex', gap: 26, fontSize: 15 }}>
            <div><b style={{ color: 'var(--vida)' }}>{previa.pv}</b> Vida</div>
            {previa.semSanidade ? (
              <div><b style={{ color: 'var(--determinacao)' }}>{previa.pd}</b> Determinação</div>
            ) : (
              <>
                <div><b style={{ color: 'var(--sanidade)' }}>{previa.san}</b> Sanidade</div>
                <div><b style={{ color: 'var(--esforco)' }}>{previa.pe}</b> Esforço</div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
