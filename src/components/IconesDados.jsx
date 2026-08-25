import React from 'react';
import IconeD20 from './IconeD20.jsx';

/**
 * Ícones dos restantes tipos de dado, no mesmo estilo do IconeD20: forma
 * exterior + face frontal + arestas, tudo a herdar a cor do texto
 * (`currentColor`) para o crítico continuar a ficar verde automaticamente.
 */

/**
 * Moeda de duas faces (d2): duas SVG empilhadas em 3D (`rotateY`, cada uma
 * com `backface-visibility: hidden`) — a animação `moeda-vira` (styles.css /
 * overlay.css) faz o miolo girar no eixo Y e ir trocando de face, tal como
 * uma moeda a ser lançada, e fica na face oposta à que começou.
 */
export function IconeD2({ titulo = 'Rolar d2', className, style, ...props }) {
  return (
    <span className={'icone-d2' + (className ? ' ' + className : '')} style={style} role="img" aria-label={titulo} {...props}>
      <span className="moeda-interior">
        <svg viewBox="0 0 64 64" className="moeda-face moeda-face-a">
          {/* cara: marca em "I" */}
          <circle cx="32" cy="32" r="27" fill="currentColor" fillOpacity="0.10" stroke="currentColor" strokeWidth="3.2" />
          <circle cx="32" cy="32" r="17" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="3" />
          <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.95">
            <path d="M32,5 32,15" />
            <path d="M32,49 32,59" />
            <path d="M14,14 20,20" />
            <path d="M50,14 44,20" />
            <path d="M14,50 20,44" />
            <path d="M50,50 44,44" />
          </g>
          <path d="M32,23 32,41" stroke="currentColor" strokeWidth="4.4" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 64 64" className="moeda-face moeda-face-b">
          {/* coroa: marca em "X" */}
          <circle cx="32" cy="32" r="27" fill="currentColor" fillOpacity="0.10" stroke="currentColor" strokeWidth="3.2" />
          <circle cx="32" cy="32" r="17" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="3" />
          <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.95">
            <path d="M32,5 32,15" />
            <path d="M32,49 32,59" />
            <path d="M14,14 20,20" />
            <path d="M50,14 44,20" />
            <path d="M14,50 20,44" />
            <path d="M50,50 44,44" />
          </g>
          <path d="M24,24 40,40 M40,24 24,40" stroke="currentColor" strokeWidth="4.4" strokeLinecap="round" />
        </svg>
      </span>
    </span>
  );
}

export function IconeD4({ titulo = 'Rolar d4', ...props }) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={titulo} {...props}>
      <polygon
        points="32,4 58,54 6,54"
        fill="currentColor" fillOpacity="0.10"
        stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round"
      />
      <polygon
        points="32,30 44,54 20,54"
        fill="currentColor" fillOpacity="0.22"
        stroke="currentColor" strokeWidth="3" strokeLinejoin="round"
      />
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.95">
        <path d="M32,4 32,30" />
        <path d="M6,54 20,54" />
        <path d="M58,54 44,54" />
      </g>
    </svg>
  );
}

export function IconeD6({ titulo = 'Rolar d6', ...props }) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={titulo} {...props}>
      <polygon
        points="32,6 54,18 32,30 10,18"
        fill="currentColor" fillOpacity="0.22"
        stroke="currentColor" strokeWidth="3" strokeLinejoin="round"
      />
      <polygon
        points="10,18 32,30 32,58 10,46"
        fill="currentColor" fillOpacity="0.14"
        stroke="currentColor" strokeWidth="3" strokeLinejoin="round"
      />
      <polygon
        points="54,18 32,30 32,58 54,46"
        fill="currentColor" fillOpacity="0.08"
        stroke="currentColor" strokeWidth="3" strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconeD8({ titulo = 'Rolar d8', ...props }) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={titulo} {...props}>
      <polygon
        points="32,4 58,32 32,60 6,32"
        fill="currentColor" fillOpacity="0.10"
        stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round"
      />
      <polygon
        points="32,22 46,32 32,42 18,32"
        fill="currentColor" fillOpacity="0.22"
        stroke="currentColor" strokeWidth="3" strokeLinejoin="round"
      />
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.95">
        <path d="M32,4 32,22" />
        <path d="M6,32 18,32" />
        <path d="M58,32 46,32" />
        <path d="M32,60 32,42" />
      </g>
    </svg>
  );
}

/**
 * d10 em "gema facetada": bipirâmide vista em ligeiro ângulo, com TODAS as
 * arestas desenhadas (mesmo as de trás) — é esse traçado em raio-x, com as
 * linhas a cruzarem-se no meio, que dá o ar de cristal facetado.
 * Fica dentro de um `span` próprio (não um `<svg>` solto) para poder ter a
 * sua própria animação 3D (ver .icone-d10 / @keyframes dado-d10-gira).
 */
export function IconeD10({ titulo = 'Rolar d10', className, style, ...props }) {
  return (
    <span className={'icone-d10' + (className ? ' ' + className : '')} style={style} role="img" aria-label={titulo} {...props}>
      <svg viewBox="0 0 64 64" className="d10-svg">
        {/* silhueta exterior */}
        <polygon
          points="32,4 56,35 32,60 8,29"
          fill="currentColor" fillOpacity="0.08"
          stroke="currentColor" strokeWidth="2.8" strokeLinejoin="round"
        />
        {/* arestas de dentro, "transparentes" — o efeito de gema vem daqui */}
        <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.85">
          <path d="M32,4 23,42" />
          <path d="M32,4 41,23" />
          <path d="M32,60 23,42" />
          <path d="M32,60 41,23" />
          <path d="M56,35 23,42" />
          <path d="M23,42 8,29" />
          <path d="M8,29 41,23" />
          <path d="M41,23 56,35" />
        </g>
      </svg>
    </span>
  );
}

export function IconeD12({ titulo = 'Rolar d12', ...props }) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={titulo} {...props}>
      <polygon
        points="32,3 60,23 49,56 15,56 4,23"
        fill="currentColor" fillOpacity="0.10"
        stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round"
      />
      <polygon
        points="32,19 44,28 40,43 24,43 20,28"
        fill="currentColor" fillOpacity="0.22"
        stroke="currentColor" strokeWidth="3" strokeLinejoin="round"
      />
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.95">
        <path d="M32,3 32,19" />
        <path d="M60,23 44,28" />
        <path d="M49,56 40,43" />
        <path d="M15,56 24,43" />
        <path d="M4,23 20,28" />
      </g>
    </svg>
  );
}

const MAPA_FACES = {
  2: IconeD2,
  4: IconeD4,
  6: IconeD6,
  8: IconeD8,
  10: IconeD10,
  12: IconeD12,
  20: IconeD20,
};

/** Escolhe o ícone certo consoante o nº de faces do dado da rolagem (usa d20 por omissão). */
export default function IconeDado({ faces, ...props }) {
  const Componente = MAPA_FACES[Number(faces)] || IconeD20;
  return <Componente {...props} />;
}
