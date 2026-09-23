import React from 'react';

// Pedaços visuais partilhados pelos cartões no estilo "ficha 4" (a moldura
// com coluna de estatísticas à esquerda + painel lateral à direita) — usados
// por FichaNpcCard.jsx e FichaAmeacaCard.jsx, para as duas fichas geradas
// terem sempre o mesmo aspeto.

export const ROTULO_GRAU = { treinado: 'T', veterano: 'V', expert: 'E' };

/** Um bloco com borda no estilo "ameaca-bloco" — usado para cada secção da
 * coluna de estatísticas (Atributos, Saúde, Perícias, etc.). */
export function BlocoStat({ titulo, extra, children }) {
  return (
    <div className="ameaca-bloco largo ficha-npc-stat-bloco">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h4 style={{ margin: 0 }}>{titulo}</h4>
        {extra && <span style={{ fontSize: 11, color: 'var(--txt-fraco)' }}>{extra}</span>}
      </div>
      <div style={{ marginTop: 8 }}>{children}</div>
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
