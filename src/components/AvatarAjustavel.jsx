import React, { useRef, useState } from 'react';

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

/**
 * Superfície de imagem com pan (arrastar) — só para avatares (o retrato do
 * agente, a imagem na ficha de NPC/criatura). Nos tokens (EspacoToken, Campo
 * de Batalha, Cartões de Batalha) isto não se aplica: lá a imagem mostra-se
 * tal como foi carregada, sem recorte ajustável.
 *
 * Enche 100% do espaço do pai — o tamanho/moldura da caixa (`.retrato`,
 * `.ficha-npc-token-caixa`, `.modal-avatar-preview`...) continua a ser
 * definido por quem usa isto. Por baixo é sempre `object-fit: cover`
 * (preenche sem deixar espaços vazios) + `object-position` para o pan +
 * `scale()` para o zoom — como o zoom só amplia a partir de uma base já sem
 * falhas, nunca aparecem bordas vazias.
 *
 * O zoom em si não tem controlo próprio aqui (isso fica para quem usa isto
 * decidir — ver ModalEditarAvatar, que tem um slider por baixo da pré-
 * visualização grande). Nas caixas pequenas da ficha (`editavel=false`) isto
 * é só uma vitrine: o clique abre o ModalEditarAvatar, que é onde o ajuste
 * acontece a sério.
 *
 * `onClick` só dispara num clique a sério (sem arrasto).
 */
export default function AvatarAjustavel({
  imagem,
  posX = 50,
  posY = 50,
  zoom = 1,
  editavel = true,
  onMudarAjuste,
  onClick,
  className = '',
  title,
  children,
  role,
  tabIndex,
  onKeyDown,
  alt = '',
}) {
  const arrastoRef = useRef(null);
  const [arrastando, setArrastando] = useState(false);

  function iniciar(e) {
    if (!editavel || !imagem) return;
    const ponto = e.touches ? e.touches[0] : e;
    arrastoRef.current = {
      inicioX: ponto.clientX,
      inicioY: ponto.clientY,
      posXInicial: posX,
      posYInicial: posY,
      moveu: false,
      rect: e.currentTarget.getBoundingClientRect(),
    };
    window.addEventListener('mousemove', mover);
    window.addEventListener('mouseup', parar);
    window.addEventListener('touchmove', mover, { passive: false });
    window.addEventListener('touchend', parar);
  }

  function mover(e) {
    const st = arrastoRef.current;
    if (!st) return;
    const ponto = e.touches ? e.touches[0] : e;
    const dx = ponto.clientX - st.inicioX;
    const dy = ponto.clientY - st.inicioY;
    if (!st.moveu && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      st.moveu = true;
      setArrastando(true);
    }
    if (!st.moveu) return;
    e.preventDefault?.();
    const z = Math.max(zoom, 0.01);
    const novoX = clamp(st.posXInicial - (dx / st.rect.width) * 100 / z, 0, 100);
    const novoY = clamp(st.posYInicial - (dy / st.rect.height) * 100 / z, 0, 100);
    onMudarAjuste?.({ imagemPosX: novoX, imagemPosY: novoY });
  }

  function parar() {
    window.removeEventListener('mousemove', mover);
    window.removeEventListener('mouseup', parar);
    window.removeEventListener('touchmove', mover);
    window.removeEventListener('touchend', parar);
    setArrastando(false);
    // Não limpamos arrastoRef aqui — o onClick que o browser dispara a
    // seguir ao mouseup precisa de saber se houve arrasto.
    setTimeout(() => { arrastoRef.current = null; }, 0);
  }

  function aoClicar(e) {
    if (arrastoRef.current?.moveu) return;
    onClick?.(e);
  }

  return (
    <div
      className={`avatar-ajustavel${imagem ? ' tem-imagem' : ''}${editavel && imagem ? ' arrastavel' : ''}${arrastando ? ' a-arrastar' : ''}${className ? ' ' + className : ''}`}
      onMouseDown={iniciar}
      onTouchStart={iniciar}
      onClick={aoClicar}
      title={title}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
    >
      {imagem ? (
        <img
          src={imagem}
          alt={alt}
          draggable={false}
          style={{
            objectPosition: `${posX}% ${posY}%`,
            transform: `scale(${zoom})`,
          }}
        />
      ) : children}
    </div>
  );
}
