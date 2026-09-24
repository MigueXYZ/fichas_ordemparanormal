import React from 'react';

// Pedaços visuais partilhados pelos cartões no estilo "ficha 4" (a moldura
// com coluna de estatísticas à esquerda + painel lateral à direita) — usados
// por FichaNpcCard.jsx e FichaAmeacaCard.jsx, para as duas fichas geradas
// terem sempre o mesmo aspeto.

export const ROTULO_GRAU = { treinado: 'T', veterano: 'V', expert: 'E' };

// Secções recolhidas pelo utilizador, lembradas entre fichas e visitas (só
// uma conveniência deste browser — se o armazenamento falhar, abre tudo).
const CHAVE_RECOLHIDOS = 'ordo:blocos-recolhidos';
function lerRecolhidos() {
  try { return new Set(JSON.parse(localStorage.getItem(CHAVE_RECOLHIDOS) || '[]')); } catch { return new Set(); }
}
function guardarRecolhidos(set) {
  try { localStorage.setItem(CHAVE_RECOLHIDOS, JSON.stringify([...set])); } catch { /* sem armazenamento */ }
}

/** Um bloco com borda no estilo "ameaca-bloco" — usado para cada secção da
 * coluna de estatísticas (Atributos, Saúde, Perícias, etc.). Carregar no
 * título recolhe o bloco e deixa só o título (a seta mostra o estado); a
 * escolha fica lembrada por título. `recolhivel={false}` desliga isso. */
export function BlocoStat({ titulo, extra, children, recolhivel = true }) {
  const [recolhido, setRecolhido] = React.useState(() => recolhivel && lerRecolhidos().has(titulo));
  const alternar = () => {
    if (!recolhivel) return;
    setRecolhido((antes) => {
      const set = lerRecolhidos();
      if (antes) set.delete(titulo); else set.add(titulo);
      guardarRecolhidos(set);
      return !antes;
    });
  };
  return (
    <div className={`ameaca-bloco largo ficha-npc-stat-bloco${recolhido ? ' recolhido' : ''}`}>
      <div
        className={recolhivel ? 'bloco-stat-cabeca recolhivel' : 'bloco-stat-cabeca'}
        onClick={alternar}
        role={recolhivel ? 'button' : undefined}
        tabIndex={recolhivel ? 0 : undefined}
        aria-expanded={recolhivel ? !recolhido : undefined}
        onKeyDown={(e) => { if (recolhivel && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); alternar(); } }}
        title={recolhivel ? (recolhido ? 'Mostrar' : 'Recolher') : undefined}
      >
        <h4 style={{ margin: 0 }}>
          {recolhivel && <span className="bloco-stat-seta" aria-hidden="true">{recolhido ? '▸' : '▾'}</span>}
          {titulo}
        </h4>
        {extra && <span style={{ fontSize: 11, color: 'var(--txt-fraco)' }}>{extra}</span>}
      </div>
      {!recolhido && <div style={{ marginTop: 8 }}>{children}</div>}
    </div>
  );
}

/** Um campo do painel lateral (ROLEPLAY) — rótulo pequeno em maiúsculas + texto. */
export function CampoRoleplay({ rotulo, valor }) {
  if (!valor) return null;
  return (
    <div className="ficha-npc-rp-campo">
      <div className="ficha-npc-rp-rotulo">{rotulo}</div>
      <div className="ficha-npc-rp-texto">{valor}</div>
    </div>
  );
}

/** Tabela com cabeçalho + uma linha de valores — usada para Atributos e
 * Saúde, no mesmo formato do capítulo de NPCs do livro (cabeçalho em cima,
 * valor por baixo, colunas com borda). */
export function TabelaLinha({ colunas }) {
  return (
    <table className="ficha-npc-tabela">
      <thead>
        <tr>{colunas.map((c, i) => <th key={i}>{c.rotulo}</th>)}</tr>
      </thead>
      <tbody>
        <tr>{colunas.map((c, i) => <td key={i}>{c.valor}</td>)}</tr>
      </tbody>
    </table>
  );
}
