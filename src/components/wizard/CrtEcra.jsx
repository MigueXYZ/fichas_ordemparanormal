import React, { useEffect, useRef, useState } from 'react';
import { degrauNex } from '../../engine/calc.js';

/**
 * Moldura do "monitor CRT/VHS" partilhada pelos passos do assistente — os
 * quatro (Atributos, Origem, Classe, Toques Finais, ver Wizard.jsx). Trata
 * de três coisas:
 *
 *  1. Arranque (preto → flash → logótipo → estática) — ver as keyframes em
 *     styles.css junto de `.crt-boot-*`. Acontece uma única vez, na primeira
 *     vez que este componente é montado (ao entrar no assistente). Como fica
 *     montado o tempo todo enquanto o jogador percorre os passos — só o
 *     conteúdo por dentro (`children`) é que troca — nunca volta a
 *     repetir-se ao alternar entre eles.
 *  2. "Troca de canal": uma rajada curta de estática P&B sempre que
 *     `passoAtual` muda — como uma televisão antiga a saltar de canal. É só
 *     um `key` a mudar numa camada CSS (`.crt-canal-flash`): o React
 *     desmonta/remonta essa camada e a animação volta a correr sozinha, sem
 *     precisar de nenhum temporizador. Fica de fora da primeira renderização
 *     (isso já é o arranque, não uma troca).
 *  3. Cabeçalho fixo: "Registo" com cronómetro decorativo, título do passo,
 *     NEX editável (as contas de Vida/Sanidade/Esforço usam sempre o degrau
 *     abaixo do valor escrito) e os botões dos passos — tudo o que é comum
 *     aos passos que vivem aqui dentro.
 *
 * A "TV" em si tem sempre o mesmo tamanho — não estica com o conteúdo (a
 * lista de Origem tem 50+ entradas, os Atributos só 5). Só a área do meio
 * (`.crt-tela`) é que rola, com uma barra de scroll ao estilo de cassete
 * (ver `.crt-tela::-webkit-scrollbar*` no CSS); o cabeçalho e os botões de
 * Voltar/Continuar — desenhados como os controlos de um leitor de cassetes —
 * ficam sempre fixos por cima e por baixo dessa área.
 *
 * A cruz no canto superior direito (`.crt-fechar`, via `onFechar`) deixa
 * sair da criação a qualquer momento — a decisão de guardar ou não (e o
 * pedido de nome, se for preciso) fica a cargo de quem usa este componente
 * (ver Wizard.jsx).
 */
export default function CrtEcra({
  personagem, mudarNex, passos, passoAtual, irParaPasso, titulo, leituraExtra,
  onVoltar, onContinuar, podeVoltar, podeContinuar = true, rotuloContinuar = 'Continuar',
  onFechar,
  children,
}) {
  // Cronómetro do "registo": só de enfeite (tema VHS), conta a partir de 0 ao
  // entrar no assistente — não é guardado nem afeta nada da ficha.
  const [segundos, setSegundos] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const timecode = `${String(Math.floor(segundos / 60)).padStart(2, '0')}:${String(segundos % 60).padStart(2, '0')}`;

  // Troca de canal: dispara a partir da 2.ª vez que `passoAtual` muda — nunca
  // na primeira renderização, para não se sobrepor ao arranque.
  const [trocaId, setTrocaId] = useState(0);
  const montadoRef = useRef(false);
  useEffect(() => {
    if (montadoRef.current) setTrocaId((n) => n + 1);
    else montadoRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passoAtual]);

  return (
    <div className="crt-atributos">
      {/* arranque: ecrã preto → flash → logo da Ordo Realitas → estática forte — só na 1.ª vez */}
      <div className="crt-boot-preto" aria-hidden="true" />
      <div className="crt-boot-linha" aria-hidden="true" />
      <div className="crt-logo" aria-hidden="true">
        <img
          src="/img/logo-ordo-realitas.png"
          alt=""
          className="crt-logo-img"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>
      <div className="crt-boot-estatica" aria-hidden="true" />

      {/* sair a qualquer momento — fica por cima de tudo, incluindo a estática */}
      {onFechar && (
        <button type="button" className="crt-fechar" onClick={onFechar} title="Sair da criação" aria-label="Sair da criação">
          ×
        </button>
      )}

      {/* troca de canal: rajada de estática P&B, remontada a cada mudança de passo */}
      {trocaId > 0 && <div className="crt-canal-flash" key={trocaId} aria-hidden="true" />}

      {/* ambiente VHS permanente — só entra depois do arranque acabar */}
      <div className="crt-ambiente" aria-hidden="true">
        <div className="crt-scanlines" />
        <div className="crt-ruido" />
        <div className="crt-scan-movel" />
        <div className="crt-tracking crt-tracking-a" />
        <div className="crt-tracking crt-tracking-b" />
        <div className="crt-vinheta" />
      </div>

      <div className="crt-conteudo">
        {passos && (
          <div className="crt-passos">
            {passos.map((nome, i) => (
              <button
                key={nome}
                type="button"
                className={'btn' + (i === passoAtual ? '' : ' ghost') + ' sm'}
                onClick={() => irParaPasso(i)}
              >
                {nome}
              </button>
            ))}
          </div>
        )}

        <div className="crt-cabecalho">
          <div className="crt-titulo-bloco">
            <span className="crt-rec">
              <span className="crt-rec-ponto" />Registo <span className="crt-timecode">{timecode}</span>
            </span>
            <h2 className="crt-titulo">{titulo}</h2>
          </div>
          <div className="crt-leitura">
            <div className="crt-leitura-item">
              <span>NEX</span>
              {mudarNex ? (
                <div className="crt-nex-editor">
                  <input
                    type="number" min="0" max="99" step="1"
                    value={personagem.nex}
                    onChange={(e) => mudarNex(e.target.value)}
                    title="Escreve a percentagem que quiseres — as contas usam o degrau abaixo"
                  />
                  <span>%</span>
                </div>
              ) : (
                <strong>{personagem.nex}%</strong>
              )}
              {degrauNex(personagem.nex) !== Number(personagem.nex) && (
                <span className="crt-degrau">conta como {degrauNex(personagem.nex)}%</span>
              )}
            </div>
            {leituraExtra}
          </div>
        </div>

        {/* área que rola — o resto da TV (cabeçalho, transporte) fica fixo */}
        <div className="crt-tela">
          {/* conteúdo do passo em si: troca com um "pop" rápido a cada mudança,
              sincronizado com a estática acima — mas isto é só o conteúdo, não
              volta a repetir o arranque lento (esse fica preso ao `.crt-conteudo`
              de fora, que só monta uma vez). */}
          <div key={`canal-${passoAtual}`} className="crt-canal-conteudo">
            {children}
          </div>
        </div>

        {(onVoltar || onContinuar) && (
          <div className="crt-transporte">
            <button type="button" className="fita-botao fita-voltar" onClick={onVoltar} disabled={!podeVoltar}>
              <span className="fita-icone" aria-hidden="true">◀◀</span>
              <span className="fita-rotulo">Voltar</span>
            </button>
            <button type="button" className="fita-botao fita-continuar" onClick={onContinuar} disabled={!podeContinuar}>
              <span className="fita-rotulo">{rotuloContinuar}</span>
              <span className="fita-icone" aria-hidden="true">▶▶</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
