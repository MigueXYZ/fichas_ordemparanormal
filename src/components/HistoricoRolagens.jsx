import React, { useState } from 'react';
import IconeD20 from './IconeD20.jsx';
import { ExibirDanoSeparado, obterInfoTipoDano } from './ExibirDano.jsx';

const FILTROS = [
  { id: 'todos', nome: 'Tudo' },
  { id: 'teste', nome: 'Testes' },
  { id: 'ataque', nome: 'Ataques' },
  { id: 'dano', nome: 'Dano' },
  { id: 'criticos', nome: 'Críticos' },
];

function hora(t) {
  if (!t) return '';
  const d = new Date(t);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

function detalhe(r) {
  if (r.semTeste) return 'sem teste — poder de toque da Trilha do Monstruoso';
  if (r.tipo === 'dano') {
    if (r.partes && r.partes.length > 0) {
      return r.partes
        .map((p) => {
          const info = obterInfoTipoDano(p.tipoDano);
          const rotulo = info.abrev || info.nome;
          const rText = p.rolagens && p.rolagens.length > 0 ? ` [${p.rolagens.join(', ')}]` : '';
          return `${p.expressao}${rText}${rotulo ? ` ${rotulo}` : ''}`;
        })
        .join(' + ') + (r.critico ? ` · dados ×${r.multiplicador}` : '');
    }
    return `${r.expressao} [${r.rolagens?.join(', ') || ''}]${(r.extras || []).map((e) => ` + ${e.expr} [${e.rolagens.join(', ')}]`).join('')}${r.bonus ? ` ${r.bonus > 0 ? '+' : '−'} ${Math.abs(r.bonus)}` : ''}${r.critico ? ` · dados ×${r.multiplicador}` : ''}`;
  }
  if (r.tipo === 'expressao') {
    if (r.partes && r.partes.length > 0) {
      return r.partes
        .map((p) => {
          const info = obterInfoTipoDano(p.tipoDano);
          const rotulo = info.abrev || info.nome;
          const rText = p.rolagens && p.rolagens.length > 0 ? ` [${p.rolagens.join(', ')}]` : '';
          return `${p.expressao}${rText}${rotulo ? ` ${rotulo}` : ''}`;
        })
        .join(' + ');
    }
    return `[${r.rolagens.join(', ')}]${r.bonus ? ` ${r.bonus > 0 ? '+' : '−'} ${Math.abs(r.bonus)}` : ''}`;
  }
  const acerto = `${r.dados}d20 [${r.rolagens.join(', ')}] → ${r.piorDeDois ? 'pior' : 'maior'} ${r.escolhido}${r.bonus ? ` ${r.bonus > 0 ? '+' : '−'} ${Math.abs(r.bonus)}` : ''}${(r.dadosExtra || []).map((d) => ` + ${d.expr} [${d.rolagens.join(', ')}]`).join('')}`;
  // num ataque o dano vem colado ao acerto
  if (r.dano) return `${acerto}  ·  dano ${detalhe(r.dano)} = ${r.dano.total}`;
  return acerto;
}

export default function HistoricoRolagens({ historico = [], aoFechar, aoLimpar }) {
  const [filtro, setFiltro] = useState('todos');

  const lista = historico.filter((r) => {
    if (filtro === 'todos') return true;
    if (filtro === 'criticos') return r.critico || r.falhaCritica;
    if (filtro === 'dano') return r.tipo === 'dano' || Boolean(r.dano);
    return r.tipo === filtro;
  });

  const testes = historico.filter((r) => r.tipo === 'teste' || r.tipo === 'ataque');
  const media = testes.length
    ? (testes.reduce((s, r) => s + r.total, 0) / testes.length).toFixed(1)
    : '—';
  const criticos = historico.filter((r) => r.critico).length;
  const falhas = historico.filter((r) => r.falhaCritica).length;

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal">
        <div className="modal-topo">
          <h3>Histórico de rolagens</h3>
          <button className="fechar" onClick={aoFechar} aria-label="Fechar"></button>
        </div>

        <div className="modal-corpo">
          <div className="resumo-historico">
            <div><b>{historico.length}</b> rolagens</div>
            <div><b>{media}</b> média dos testes</div>
            <div><b style={{ color: 'var(--ok)' }}>{criticos}</b> críticos</div>
            <div><b style={{ color: 'var(--sangue-claro)' }}>{falhas}</b> falhas críticas</div>
          </div>

          <div className="filtros">
            {FILTROS.map((f) => (
              <button key={f.id} className={'btn sm' + (filtro === f.id ? '' : ' ghost')} onClick={() => setFiltro(f.id)}>
                {f.nome}
              </button>
            ))}
            <span className="contador">{lista.length}</span>
          </div>

          {lista.length === 0 ? (
            <div className="painel-vazio">Ainda não há rolagens</div>
          ) : (
            <table className="tabela-historico">
              <tbody>
                {[...lista].reverse().map((r) => (
                  <tr key={r.id} className={(r.critico ? 'critico' : '') + (r.falhaCritica ? ' falha' : '')}>
                    <td className="h-hora">{hora(r.quando)}</td>
                    <td className="h-icone"><IconeD20 /></td>
                    <td className="h-nome">{r.nome}{r.critico ? ' · crítico' : ''}{r.falhaCritica ? ' · falha crítica' : ''}</td>
                    <td className="h-conta">{detalhe(r)}</td>
                    <td className="h-total">{r.tipo === 'dano' ? <ExibirDanoSeparado dano={r} /> : r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="modal-acoes">
          <button className="btn danger" onClick={aoLimpar} disabled={!historico.length}>Limpar histórico</button>
          <button className="btn" onClick={aoFechar}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
