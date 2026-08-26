import React, { useEffect } from 'react';
import IconeDado from './IconesDados.jsx';
import { ExibirDanoSeparado, obterInfoTipoDano } from './ExibirDano.jsx';

/** A conta que deu origem ao resultado, conforme o tipo de rolagem. */
export function Dados({ r }) {
  if (r.semTeste || r.tipo === 'habilidade' || r.tipo === 'efeito') {
    return <span className="conta">{r.detalhe || 'sem teste'}</span>;
  }
  if (r.tipo === 'dano') {
    if (r.partes && r.partes.length > 0) {
      return (
        <span className="conta">
          {r.partes.map((p, idx) => {
            const info = obterInfoTipoDano(p.tipoDano);
            return (
              <React.Fragment key={idx}>
                {idx > 0 && ' + '}
                <span style={info.cor ? { color: info.cor } : undefined}>
                  {p.expressao} {p.rolagens && p.rolagens.length > 0 ? `[${p.rolagens.join(', ')}]` : ''}
                  {info.abrev ? ` ${info.abrev}` : ''}
                </span>
              </React.Fragment>
            );
          })}
          {r.critico ? ` · dados ×${r.multiplicador}` : ''}
        </span>
      );
    }

    return (
      <span className="conta">
        {r.expressao} [{r.rolagens?.join(', ') || ''}]
        {r.extras?.map((e, i) => {
          const info = obterInfoTipoDano(e.tipoDano || (e.elemental ? 'Sangue' : ''));
          return (
            <span key={i} style={info.cor ? { color: info.cor } : undefined} title={e.elemental ? 'Dano Elemental' : undefined}>
              {` + ${e.expr} [${(e.rolagens || []).join(', ')}]${info.abrev ? ` ${info.abrev}` : ''}`}
            </span>
          );
        })}
        {r.bonus ? ` ${r.bonus > 0 ? '+' : '−'} ${Math.abs(r.bonus)}` : ''}
        {r.critico ? ` · dados ×${r.multiplicador}` : ''}
      </span>
    );
  }
  if (r.tipo === 'expressao') {
    if (r.partes && r.partes.length > 0) {
      return (
        <span className="conta">
          {r.partes.map((p, idx) => {
            const info = obterInfoTipoDano(p.tipoDano);
            return (
              <React.Fragment key={idx}>
                {idx > 0 && ' + '}
                <span style={info.cor ? { color: info.cor } : undefined}>
                  {p.expressao} {p.rolagens && p.rolagens.length > 0 ? `[${p.rolagens.join(', ')}]` : ''}
                  {info.abrev ? ` ${info.abrev}` : ''}
                </span>
              </React.Fragment>
            );
          })}
        </span>
      );
    }
    return (
      <span className="conta">
        [{(r.rolagens || []).join(', ')}]{r.bonus ? ` ${r.bonus > 0 ? '+' : '−'} ${Math.abs(r.bonus)}` : ''}
      </span>
    );
  }
  if (!r.rolagens || !Array.isArray(r.rolagens)) {
    return <span className="conta">{r.detalhe || ''}</span>;
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
        <span key={i}>{` + ${d.expr} [${(d.rolagens || []).join(', ')}]`}</span>
      ))}
    </span>
  );
}

/** Cartão de um ataque: acerto à esquerda, dano à direita. */
function CartaoAtaque({ r, aoFechar }) {
  return (
    <div className={'rolagem-cartao duplo' + (r.critico ? ' critico' : '') + (r.falhaCritica ? ' falha-critica' : '')}>
      <IconeDado faces={r.faces} className="icone" />
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
            {r.dano ? (
              <>
                <Dados r={r.dano} />
                <div className="res"><ExibirDanoSeparado dano={r.dano} /></div>
              </>
            ) : (
              <>
                <span className="conta">sem dano válido</span>
                <div className="res">—</div>
              </>
            )}
          </div>
        </div>
      </div>
      <button className="fechar" onClick={() => aoFechar(r.id)} aria-label="Fechar"></button>
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
            <IconeDado faces={r.faces} className="icone" />
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
            <span className="total">
              {r.tipo === 'dano' || r.partes?.length > 0 ? <ExibirDanoSeparado dano={r} /> : r.total}
            </span>
            <button className="fechar" onClick={() => aoFechar(r.id)} aria-label="Fechar"></button>
          </div>
        )
      )}
    </div>
  );
}
