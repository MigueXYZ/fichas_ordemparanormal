import React, { useState } from 'react';
import {
  COMBINACOES_TURNO, ACOES_PADRAO, MANOBRAS_COMBATE, ACOES_MOVIMENTO, ACOES_COMPLETAS,
  ACOES_LIVRES, ACOES_DEFESA, COBERTURA_FLANQUEAR, SITUACOES_ATACANTE, SITUACOES_ALVO,
} from '../../data/guiaCombate.js';

/**
 * Guia Rápido de Ações de Combate (cheat sheet) — Livro Base, p. 84-89. Só
 * consulta, não mexe na ficha: os textos são resumos do livro, encurtados
 * para caberem num cartão, sem inventar regra nenhuma.
 *
 * Em vez de um scroll enorme com tudo de seguida, abre num menu de
 * categorias — escolhes uma e só essa aparece.
 */
const CATEGORIAS = [
  { id: 'padrao', nome: 'Ações Padrão', itens: ACOES_PADRAO },
  { id: 'manobras', nome: 'Manobras de Combate', sub: 'substituem um ataque corpo a corpo', itens: MANOBRAS_COMBATE },
  { id: 'movimento', nome: 'Ações de Movimento', itens: ACOES_MOVIMENTO },
  { id: 'completas', nome: 'Ações Completas', itens: ACOES_COMPLETAS },
  { id: 'livres', nome: 'Ações Livres', itens: ACOES_LIVRES },
  { id: 'defesa', nome: 'Reações — Defesa', sub: '1 por rodada, antes do ataque inimigo', itens: ACOES_DEFESA },
  { id: 'cobertura', nome: 'Cobertura e Flanquear', itens: COBERTURA_FLANQUEAR },
  { id: 'situacoes', nome: 'Situações Especiais', sub: 'tabela de modificadores', tabela: true },
];

function Cartao({ nome, texto }) {
  return (
    <div className="guia-combate-cartao">
      <b>{nome}</b>
      <p>{texto}</p>
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
  const [categoriaId, setCategoriaId] = useState(null);
  const categoria = CATEGORIAS.find((c) => c.id === categoriaId) || null;

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal">
        <div className="modal-topo">
          {categoria ? (
            <h3 className="guia-combate-titulo">
              <button type="button" className="guia-combate-voltar" onClick={() => setCategoriaId(null)}>‹ Categorias</button>
              {categoria.nome} <span className="pagina">(p. 84–89)</span>
            </h3>
          ) : (
            <h3>Guia Rápido de Ações de Combate <span className="pagina">(p. 84–89)</span></h3>
          )}
          <button className="fechar" onClick={aoFechar} aria-label="Fechar">✕</button>
        </div>

        <div className="modal-corpo guia-combate-corpo">
          {!categoria && (
            <>
              <div className="guia-combate-turno">
                <b>No teu turno:</b>
                <ul>
                  {COMBINACOES_TURNO.map((c) => <li key={c}>{c}</li>)}
                </ul>
                <span className="dica">+ quantas Ações Livres e Reações quiseres.</span>
              </div>

              <div className="guia-combate-menu">
                {CATEGORIAS.map((c) => (
                  <button type="button" key={c.id} className="guia-combate-menu-item" onClick={() => setCategoriaId(c.id)}>
                    <span className="nome">{c.nome}</span>
                    {c.sub && <span className="sub">{c.sub}</span>}
                  </button>
                ))}
              </div>
            </>
          )}

          {categoria && !categoria.tabela && (
            <div className="guia-combate-grelha">
              {categoria.itens.map((i) => <Cartao key={i.nome} {...i} />)}
            </div>
          )}

          {categoria && categoria.tabela && (
            <div className="guia-combate-tabelas">
              <TabelaSituacoes titulo="O atacante está…" coluna="Modificador no ataque" linhas={SITUACOES_ATACANTE} />
              <TabelaSituacoes titulo="O alvo está…" coluna="Modificador na defesa" linhas={SITUACOES_ALVO} />
            </div>
          )}
        </div>

        <div className="modal-acoes">
          <button className="btn" onClick={aoFechar}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
