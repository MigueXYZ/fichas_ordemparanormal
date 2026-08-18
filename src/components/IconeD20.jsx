import React from 'react';

/** Ícone de d20 (icosaedro) — herda a cor do texto. */
export default function IconeD20({ titulo = 'Rolar d20', ...props }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="5"
      strokeLinejoin="round" strokeLinecap="round" role="img" aria-label={titulo} {...props}>
      <polygon points="50,3 94,28 94,72 50,97 6,72 6,28" />
      <polygon points="50,29 83,71 17,71" fill="currentColor" fillOpacity="0.13" />
      <path d="M50,3 L50,29 M6,28 L50,29 M94,28 L50,29 M6,72 L17,71 M94,72 L83,71 M50,97 L17,71 M50,97 L83,71" />
    </svg>
  );
}
