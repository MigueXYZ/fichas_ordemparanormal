import React, { useEffect } from 'react';
import IconeD20 from './IconeD20.jsx';

function Conta({ r }) {
  if (r.tipo === 'expressao') {
    return (
      <span className="conta">
        [{r.rolagens.join(', ')}]{r.bonus ? ` ${r.bonus > 0 ? '+' : '−'} ${Math.abs(r.bonus)}` : ''}
      </span>
    );
  }
  return (
    <span className="conta">
      {r.dados}d20 [
      {r.rolagens.map((v, i) => (
        <React.Fragment key={i}>
          {i > 0 && ', '}
          <span className={v === r.escolhido ? 'melhor' : ''}>{v}</span>
        </React.Fragment>
      ))}
      ]{r.piorDeDois ? ' pior' : ''}
      {r.bonus ? ` ${r.bonus > 0 ? '+' : '−'} ${Math.abs(r.bonus)}` : ''}
    </span>
  );
}

/** Cartões de resultado, canto inferior direito. */
export default function PainelRolagem({ rolagens, aoFechar, aoLimpar }) {
  // cada rolagem desaparece sozinha ao fim de 20 segundos
  useEffect(() => {
    if (!rolagens.length) return undefined;
    const t = setTimeout(() => aoFechar(rolagens[rolagens.length - 1].id), 20000);
    return () => clearTimeout(t);
  }, [rolagens, aoFechar]);

  if (!rolagens.length) return null;

  return (
    <div className="rolagens">
      {rolagens.slice(-4).map((r) => (
        <div key={r.id} className={'rolagem-cartao' + (r.critico ? ' critico' : '') + (r.falhaCritica ? ' falha-critica' : '')}>
          <IconeD20 className="icone" />
          <div>
            <div className="nome">{r.nome}{r.critico ? ' · crítico' : ''}</div>
            <Conta r={r} />
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
