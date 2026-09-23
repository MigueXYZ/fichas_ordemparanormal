import { useEffect, useRef } from 'react';

/** Input numérico que também aceita rodar a scroll do rato (+1/-1) quando
 * está focado — usado nos valores numéricos pequenos da ficha (Resistência
 * com número, ajustes de RD...). Partilhado entre a ficha de personagem
 * (Ficha.jsx) e a ficha de NPC (FichaNpcCard.jsx), que usam o mesmo picker
 * de Resistências. */
export default function InputNumeroScroll({ value, onChange, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (document.activeElement !== el) return;
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY < 0 ? 1 : -1;
      const atual = Number(el.value) || 0;
      onChange(atual + delta);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [onChange]);

  return (
    <input
      ref={ref}
      type="number"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      {...props}
    />
  );
}
