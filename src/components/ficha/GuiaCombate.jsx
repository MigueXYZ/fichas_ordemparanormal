import React from 'react';
import {
  COMBINACOES_TURNO, ACOES_PADRAO, MANOBRAS_COMBATE, ACOES_MOVIMENTO, ACOES_COMPLETAS,
  ACOES_LIVRES, ACOES_DEFESA, COBERTURA_FLANQUEAR, SITUACOES_ATACANTE, SITUACOES_ALVO,
} from '../../data/guiaCombate.js';

/**
 * Guia Rápido de Ações de Combate (cheat sheet) — Livro Base, p. 84-89. Só
 * consulta, não mexe na ficha: os textos são resumos do livro, encurtados
 * para caberem num cartão, sem inventar regra nenhuma.
 */
function Cartao({ nome, texto }) {
  return (
    <div className="guia-combate-cartao">
      <b>{nome}</b>
      <p>{texto}</p>
    </div>
  );
}

function Seccao({ titulo, itens }) {
  return (
    <div className="guia-combate-seccao">
      <h4>{titulo}</h4>
      <div className="guia-combate-grelha">
        {itens.map((i) => <Cartao key={i.nome} {...i} />)}
      </div>
    </div>
  );
}

function TabelaSituacoes({ titulo, coluna, linhas }) {
  return (
    <div className="guia-combate-seccao">
      <h4>{titulo}</h4>
      <table className="tabela-guia-combate">
        <thead>
          <tr><th>Situação</th><th>{coluna}</th></tr>
        </thead>
        <tbody>
          {linhas.map((l) => (
            <tr key={l.situacao}><td>{l.situacao}</td><td>{l.efeito}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function GuiaCombate({ aoFechar }) {
  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal">
        <div className="modal-topo">
          <h3>Guia Rápido de Ações de Combate <span className="pagina">p. 84–89</span></h3>
          <button className="fechar" onClick={aoFechar} aria-label="Fechar">✕</button>
        </div>

        <div className="modal-corpo">
          <div className="guia-combate-turno">
            <b>No teu turno:</b>
            <ul>
              {COMBINACOES_TURNO.map((c) => <li key={c}>{c}</li>)}
            </ul>
            <span className="dica">+ quantas Ações Livres e Reações quiseres.</span>
          </div>

          <Seccao titulo="Ações Padrão" itens={ACOES_PADRAO} />
          <Seccao titulo="Manobras de Combate (substituem um ataque corpo a corpo)" itens={MANOBRAS_COMBATE} />
          <Seccao titulo="Ações de Movimento" itens={ACOES_MOVIMENTO} />
          <Seccao titulo="Ações Completas" itens={ACOES_COMPLETAS} />
          <Seccao titulo="Ações Livres" itens={ACOES_LIVRES} />
          <Seccao titulo="Reações — Ações Especiais de Defesa (1 por rodada, antes do ataque inimigo)" itens={ACOES_DEFESA} />
          <Seccao titulo="Cobertura e Flanquear" itens={COBERTURA_FLANQUEAR} />

          <div className="guia-combate-tabelas">
            <TabelaSituacoes titulo="Tabela 4.4 — o atacante está…" coluna="Modificador no ataque" linhas={SITUACOES_ATACANTE} />
            <TabelaSituacoes titulo="Tabela 4.4 — o alvo está…" coluna="Modificador na defesa" linhas={SITUACOES_ALVO} />
          </div>
        </div>

        <div className="modal-acoes">
          <button className="btn" onClick={aoFechar}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
