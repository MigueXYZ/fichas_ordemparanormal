import React from 'react';

export const CORES_ELEMENTOS = {
  sangue: '#f04653',
  morte: '#969ba1',
  energia: '#a15cd8',
  conhecimento: '#d8b53c',
  medo: '#e2e8f0',
};

/**
 * Retorna informações de cor, nome normalizado e abreviação para cada tipo de dano.
 */
export function obterInfoTipoDano(tipo) {
  if (!tipo) return { nome: '', abrev: '', cor: null, elemento: null };
  const s = String(tipo).trim();
  const lower = s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (lower.includes('sangue')) return { nome: 'Sangue', abrev: 'Sangue', cor: '#f04653', elemento: 'sangue' };
  if (lower.includes('morte')) return { nome: 'Morte', abrev: 'Morte', cor: '#969ba1', elemento: 'morte' };
  if (lower.includes('energia')) return { nome: 'Energia', abrev: 'Energia', cor: '#a15cd8', elemento: 'energia' };
  if (lower.includes('conhecimento')) return { nome: 'Conhecimento', abrev: 'Conhecimento', cor: '#d8b53c', elemento: 'conhecimento' };
  if (lower.includes('medo')) return { nome: 'Medo', abrev: 'Medo', cor: '#e2e8f0', elemento: 'medo' };

  if (lower.includes('bal')) return { nome: 'Balístico', abrev: 'Bal', cor: null, elemento: null };
  if (lower.includes('corte')) return { nome: 'Corte', abrev: 'Corte', cor: null, elemento: null };
  if (lower.includes('impacto')) return { nome: 'Impacto', abrev: 'Imp', cor: null, elemento: null };
  if (lower.includes('perfur')) return { nome: 'Perfuração', abrev: 'Perf', cor: null, elemento: null };
  if (lower.includes('fogo')) return { nome: 'Fogo', abrev: 'Fogo', cor: '#f97316', elemento: null };
  if (lower.includes('eletri')) return { nome: 'Eletricidade', abrev: 'Ele', cor: '#38bdf8', elemento: null };
  if (lower.includes('quimic')) return { nome: 'Químico', abrev: 'Quím', cor: '#84cc16', elemento: null };
  if (lower.includes('ment')) return { nome: 'Mental', abrev: 'Mental', cor: '#c084fc', elemento: null };

  return { nome: s, abrev: s, cor: null, elemento: null };
}

/**
 * Renderiza o dano separado por parcelas e tipos, com a respetiva cor dos elementos.
 * Exemplo: 8 Bal + 8 Sangue = 16
 */
export function ExibirDanoSeparado({ dano, className = '' }) {
  if (!dano) return null;

  if (dano.partes && dano.partes.length > 0) {
    const temTipo = dano.partes.some((p) => Boolean(p.tipoDano || p.tipo));
    if (dano.partes.length > 1 || temTipo) {
      return (
        <span className={'dano-separado ' + className}>
          {dano.partes.map((p, idx) => {
            const info = obterInfoTipoDano(p.tipoDano || p.tipo);
            const rotulo = info.abrev || info.nome;
            const valor = p.total ?? p.valor ?? p.soma;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="dano-sep" style={{ opacity: 0.7 }}> + </span>}
                <span
                  className="dano-parcela"
                  title={p.rolagens && p.rolagens.length > 0 ? `${p.expressao || p.expr} [${p.rolagens.join(', ')}] ${info.nome || ''}` : undefined}
                >
                  <b style={info.cor ? { color: info.cor } : undefined}>{valor}</b>
                  {rotulo ? (
                    <span
                      className="dano-tipo-tag"
                      style={info.cor ? { color: info.cor, opacity: 0.9, marginLeft: 2 } : { opacity: 0.8, marginLeft: 2 }}
                    >
                      {rotulo}
                    </span>
                  ) : null}
                </span>
              </React.Fragment>
            );
          })}
          {dano.partes.length > 1 && (
            <>
              <span className="dano-sep" style={{ opacity: 0.7 }}> = </span>
              <b className="dano-total-destaque">{dano.total}</b>
            </>
          )}
        </span>
      );
    }
  }

  return <span className={'dano-total-simples ' + className}><b>{dano.total}</b></span>;
}

export default ExibirDanoSeparado;
