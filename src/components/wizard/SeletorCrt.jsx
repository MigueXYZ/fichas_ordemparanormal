import React, { useEffect, useRef, useState } from 'react';

/**
 * Dropdown que substitui um `<select>` nativo nos filtros de dentro da TV.
 * Um `<select>` normal decide sozinho (o browser, não nós) se abre para cima
 * ou para baixo consoante o espaço que sobra no ecrã — dentro da TV, perto
 * do rodapé, isso fazia-o abrir sempre para cima, tapando o cabeçalho. Este
 * é sempre posicionado por baixo do botão, sem exceção.
 *
 * `opcoes`: [{ value, label }]. Fecha ao escolher uma opção ou ao clicar fora.
 */
export default function SeletorCrt({ valor, opcoes, onChange, placeholder }) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!aberto) return;
    function aoClicarFora(e) {
      if (ref.current && !ref.current.contains(e.target)) setAberto(false);
    }
    document.addEventListener('mousedown', aoClicarFora);
    return () => document.removeEventListener('mousedown', aoClicarFora);
  }, [aberto]);

  const atual = opcoes.find((o) => o.value === valor);

  return (
    <div className="seletor-crt" ref={ref}>
      <button
        type="button"
        className="seletor-crt-gatilho"
        onClick={() => setAberto((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={aberto}
      >
        <span>{atual ? atual.label : placeholder}</span>
        <span className="seletor-crt-seta" aria-hidden="true">▾</span>
      </button>

      {aberto && (
        <ul className="seletor-crt-lista" role="listbox">
          {opcoes.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                role="option"
                aria-selected={o.value === valor}
                className={'seletor-crt-opcao' + (o.value === valor ? ' ativa' : '')}
                onClick={() => { onChange(o.value); setAberto(false); }}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
