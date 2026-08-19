import React, { useEffect, useMemo, useRef, useState } from 'react';
import { iniciarCoracao } from '../engine/som.js';

/**
 * Camada de fundo: o pulsar do coração (cada pulso é disparado pelo mesmo
 * relógio que toca o som, por isso imagem e som andam juntos) e brasas a subir.
 */
export default function Fundo({ brasas = 34 }) {
  const [batida, setBatida] = useState(null);   // 'forte' | 'fraca' | null
  const limpar = useRef(null);

  const particulas = useMemo(
    () =>
      Array.from({ length: brasas }, (_, i) => ({
        i,
        esquerda: Math.random() * 100,
        atraso: -Math.random() * 26,
        duracao: 16 + Math.random() * 18,
        tamanho: 1.5 + Math.random() * 2.6,
        desvio: (Math.random() * 2 - 1) * 60,
        brilho: 0.35 + Math.random() * 0.5,
      })),
    [brasas]
  );

  useEffect(() => {
    function aoBater(e) {
      const forte = Boolean(e.detail?.forte);
      setBatida(null);
      // força o reinício da animação antes de a voltar a aplicar
      requestAnimationFrame(() => setBatida(forte ? 'forte' : 'fraca'));
      // a mesma batida chega ao resto da app (barras de recurso, etc.)
      document.body.classList.remove('bate-forte', 'bate-fraca');
      requestAnimationFrame(() => document.body.classList.add(forte ? 'bate-forte' : 'bate-fraca'));
      clearTimeout(limpar.current);
      limpar.current = setTimeout(() => {
        setBatida(null);
        document.body.classList.remove('bate-forte', 'bate-fraca');
      }, 620);
    }
    window.addEventListener('op-batida', aoBater);
    const parar = iniciarCoracao();
    return () => {
      window.removeEventListener('op-batida', aoBater);
      clearTimeout(limpar.current);
      document.body.classList.remove('bate-forte', 'bate-fraca');
      parar();
    };
  }, []);

  return (
    <>
      <div className={'pulso' + (batida ? ` bate-${batida}` : '')} aria-hidden="true" />
      <img className="criatura" src="/img/diabo.webp" alt="" aria-hidden="true" />
      <div className="brasas" aria-hidden="true">
        {particulas.map((p) => (
          <span
            key={p.i}
            style={{
              left: `${p.esquerda}%`,
              width: `${p.tamanho}px`,
              height: `${p.tamanho}px`,
              opacity: p.brilho,
              animationDelay: `${p.atraso}s`,
              animationDuration: `${p.duracao}s`,
              '--desvio': `${p.desvio}px`,
            }}
          />
        ))}
      </div>
    </>
  );
}
