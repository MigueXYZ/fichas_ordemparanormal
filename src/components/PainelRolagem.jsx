import React, { useEffect } from 'react';
import IconeD20 from './IconeD20.jsx';

/** A conta que deu origem ao resultado, conforme o tipo de rolagem. */
export function Dados({ r }) {
  if (r.semTeste) {
    return <span className="conta">poder de toque — sem teste de Ocultismo</span>;
  }
  if (r.tipo === 'dano') {
    return (
      <span className="conta">
        {r.expressao} [{r.rolagens.join(', ')}]
        {r.extras?.map((e, i) => (
          <span key={i} style={e.elemental ? { color: 'var(--sangue-claro)' } : undefined} title={e.elemental ? 'Dano da Trilha do Monstruoso' : undefined}>
            {` + ${e.expr} [${e.rolagens.join(', ')}]`}
          </span>
        ))}
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
      {(r.dadosExtra || []).map((d, i) => (
        <span key={i}>{` + ${d.expr} [${d.rolagens.join(', ')}]`}</span>
      ))}
    </span>
  );
}

/** Cartão de um ataque: acerto à esquerda, dano à direita. */
function CartaoAtaque({ r, aoFechar }) {
  return (
    <div className={'rolagem-cartao duplo' + (r.critico ? ' critico' : '') + (r.falhaCritica ? ' falha-critica' : '')}>
      <IconeD20 className="icone" />
      <div className="corpo">
        <div className="nome">
          {r.nome}
          {r.critico ? ' · crítico' : ''}
          {r.falhaCritica ? ' · falha crítica' : ''}
        </div>
        <div className="seccoes">
          <div className="seccao">
            <div className="etiqueta">Acerto</div>
            <Dados r={r} />
            <div className="res">{r.total}</div>
          </div>
          <div className="seccao">
            <div className="etiqueta">Dano</div>
            {r.dano
              ? <><Dados r={r.dano} /><div className="res">{r.dano.total}</div></>
              : <><span className="conta">sem dano válido</span><div className="res">—</div></>}
          </div>
        </div>
      </div>
      <button className="fechar" onClick={() => aoFechar(r.id)} aria-label="Fechar">✕</button>
    </div>
  );
}

/** Cartões de resultado, canto inferior direito. O mais recente fica em baixo. */
export default function PainelRolagem({ rolagens, aoFechar, aoLimpar }) {
  useEffect(() => {
    if (!rolagens.length) return undefined;
    const t = setTimeout(() => aoFechar(rolagens[rolagens.length - 1].id), 25000);
    return () => clearTimeout(t);
  }, [rolagens, aoFechar]);

  if (!rolagens.length) return null;

  return (
    <div className="rolagens">
      {rolagens.length > 1 && (
        <button className="btn ghost sm limpar-rolagens" onClick={aoLimpar}>Limpar rolagens</button>
      )}
      {rolagens.slice(-3).map((r) =>
        r.tipo === 'ataque' ? (
          <CartaoAtaque key={r.id} r={r} aoFechar={aoFechar} />
        ) : (
          <div key={r.id} className={'rolagem-cartao' + (r.critico ? ' critico' : '') + (r.falhaCritica ? ' falha-critica' : '')}>
            <IconeD20 className="icone" />
            <div>
              <div className="nome">
                {r.nome}
                {r.detalhe && r.tipo === 'ritual' ? ` · ${r.detalhe}` : ''}
                {r.critico && r.tipo !== 'dano' ? ' · crítico' : ''}
                {r.falhaCritica ? ' · falha crítica' : ''}
              </div>
              <Dados r={r} />
              {r.notas?.length > 0 && (
                <div className={'notas-rolagem' + (r.sofreu ? ' mau' : '')}>{r.notas.join(' · ')}</div>
              )}
            </div>
            <span className="igual">=</span>
            <span className="total">{r.total}</span>
            <button className="fechar" onClick={() => aoFechar(r.id)} aria-label="Fechar">✕</button>
          </div>
        )
      )}
    </div>
  );
}
