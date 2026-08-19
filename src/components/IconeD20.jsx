import React from 'react';

/**
 * Ícone de d20 (icosaedro visto de frente): hexágono exterior, triângulo
 * central e as três faces laterais. Herda a cor do texto.
 */
export default function IconeD20({ titulo = 'Rolar d20', ...props }) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={titulo} {...props}>
      {/* corpo */}
      <polygon
        points="32,2 58,17 58,47 32,62 6,47 6,17"
        fill="currentColor" fillOpacity="0.10"
        stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round"
      />
      {/* face frontal */}
      <polygon
        points="32,18 46,42 18,42"
        fill="currentColor" fillOpacity="0.22"
        stroke="currentColor" strokeWidth="3" strokeLinejoin="round"
      />
      {/* arestas para os vértices */}
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.95">
        <path d="M32,2 32,18" />
        <path d="M6,17 32,18 58,17" />
        <path d="M6,47 18,42" />
        <path d="M58,47 46,42" />
        <path d="M32,62 18,42" />
        <path d="M32,62 46,42" />
      </g>
    </svg>
  );
}
