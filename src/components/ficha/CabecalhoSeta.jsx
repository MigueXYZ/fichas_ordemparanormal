import React from 'react';

/**
 * Cabeçalho/gatilho clicável com setinha (▶ que roda ao abrir) — o MESMO
 * widget em toda a ficha para "isto dobra/expande": as secções da Trilha do
 * Monstruoso, e o "mostrar tudo" das descrições compridas de Habilidades e
 * Rituais. Um só sítio para o estilo, para nunca voltar a haver duas
 * versões visualmente diferentes do mesmo botão.
 *
 * Aberto = cor própria (do elemento, ou a passada em `corSeta`) + maiúsculas
 * + um pouco mais espaçado. Fechado = cinza discreto + minúsculas normais.
 */
export default function CabecalhoSeta({ estaAberto, corSeta = 'var(--sangue-claro)', onClick, children }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
        fontSize: estaAberto ? 12.5 : 12, textTransform: estaAberto ? 'uppercase' : 'none',
        letterSpacing: estaAberto ? 0.5 : 0, color: estaAberto ? corSeta : 'var(--txt-fraco)',
      }}
    >
      <span style={{ color: corSeta, fontSize: 9, transform: estaAberto ? 'rotate(90deg)' : 'none', transition: 'transform .1s' }}>▶</span>
      {children}
    </div>
  );
}
