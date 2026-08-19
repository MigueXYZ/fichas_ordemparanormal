import React, { useEffect } from 'react';
import IconeD20 from './IconeD20.jsx';

function Dados({ r }) {
  if (r.tipo === 'dano') {
    return (
      <span className="conta">
        {r.expressao} [{r.rolagens.join(', ')}]
        {r.extras?.map((e) => ` + ${e.expr} [${e.rolagens.join(', ')}]`).join('')}
        {r.bonus ? ` ${r.bonus > 0 ? '+' : '−'} ${Math.abs(r.bonus)}` : ''}
        {r.critico ? ` · dados ×${r.multiplicador}` : ''}
      </span>
    );
  }
  if (r.tipo === 'expressao') {
    return (
      <span className="conta">
        [{r.rolagens.join(', ')}]{r.bonus ? ` ${r.bonus > 0 ? '+' : '−'} ${Math.abs(r.bonus)}` : ''}
      </span>
    );
  }
  // teste de perícia / atributo / ataque
  return (
    <span className="conta">
      {r.dados}d20 [
      {r.rolagens.map((v, i) => (
        <React.Fragment key={i}>
          {i > 0 && ', '}
          <span className={v === r.escolhido ? 'melhor' : ''}>{v}</span>
        </React.Fragment>
      ))}
      ] → {r.piorDeDois ? 'pior' : 'maior'} <span className="melhor">{r.escolhido}</span>
      {r.bonus ? ` ${r.bonus > 0 ? '+' : '−'} ${Math.abs(r.bonus)}` : ''}
    </span>
  );
}

/** Cartões de resultado, canto inferior direito. */
export default function PainelRolagem({ rolagens, aoFechar, aoLimpar }) {
  useEffect(() => {
    if (!rolagens.length) return undefined;
    const t = setTimeout(() => aoFechar(rolagens[rolagens.length - 1].id), 25000);
    return () => clearTimeout(t);
  }, [rolagens, aoFechar]);

  if (!rolagens.length) return null;

  return (
    <div className="rolagens">
      {rolagens.slice(-3).map((r) => (
        <div key={r.id} className={'rolagem-cartao' + (r.critico ? ' critico' : '') + (r.falhaCritica ? ' falha-critica' : '')}>
          <IconeD20 className="icone" />
          <div>
            <div className="nome">
              {r.nome}
              {r.critico && r.tipo !== 'dano' ? ' · crítico' : ''}
              {r.falhaCritica ? ' · falha crítica' : ''}
            </div>
            <Dados r={r} />
          </div>
          <span className="igual">=</span>
          <span className="total">{r.total}</span>
          <button className="fechar" onClick={() => aoFechar(r.id)} aria-label="Fechar">✕</button>
        </div>
      ))}
      {rolagens.length > 1 && (
        <button className="btn ghost sm" style={{ alignSelf: 'flex-end' }} onClick={aoLimpar}>Limpar rolagens</button>
      )}
    </div>
  );
}
