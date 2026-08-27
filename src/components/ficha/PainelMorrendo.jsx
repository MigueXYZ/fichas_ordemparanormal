import React, { useEffect, useRef, useState } from 'react';
import { CONDICOES_POR_ID } from '../../data/condicoes.js';
import { calcPericias } from '../../engine/calc.js';
import { efeitosDiarios } from '../../engine/monstruoso.js';
import { rolarTeste } from '../../engine/dados.js';
import { temPoder } from '../../engine/character.js';

/**
 * Morrendo (Livro de Regras): 0 PV, indefeso, sem ações. Três turnos morrendo
 * na mesma cena (não precisam ser seguidos) e morre; só sai com um Teste de
 * Medicina (DT 20) ou por efeitos específicos — ver `data/condicoes.js`. Esse
 * Teste de Medicina é feito por QUEM SOCORRE o agente, nunca pelo próprio: a
 * condição dá `semAcoes`, por isso este painel (que vive na ficha do próprio
 * agente morrendo) não tem atalho para ele — só um aviso a lembrar isso.
 * O poder Tenacidade (Sobrevivendo ao Horror) é a única exceção: dá, a quem o
 * tiver, um Teste de Fortitude como ação livre (DT 20 + 10 por teste anterior
 * na mesma cena) — esse sim, feito pelo próprio, por isso continua aqui.
 *
 * Este painel: assim que os PV chegam a 0, abre um pop-up a meio do ecrã a
 * sugerir ligar Morrendo (que junto liga também Inconsciente — 0 PV nocauteia
 * o agente; é a Inconsciente, não a Morrendo, que traz os debuffs −10
 * Defesa/indefeso/sem ações, ver `data/condicoes.js`). As duas saem por
 * caminhos DIFERENTES: a Inconsciente sai sozinha assim que os PV voltarem a
 * subir acima de 0 (debuffs incluídos); a Morrendo em si fica ligada até um
 * Teste de Medicina (DT 20, feito por quem socorre) ou de Tenacidade ter
 * sucesso — mesmo que o PV já tenha subido. Também mostra o contador dos
 * turnos morrendo (com a tolerância extra da Trilha do Monstruoso quando
 * aplicável), o atalho de Tenacidade e, se o contador chegar ao limite (a
 * regra: 3 turnos morrendo na cena, +tolerância da Trilha), um segundo
 * pop-up de "fim de jornada" — a ficha não apaga nem bloqueia nada sozinha,
 * é só um aviso; a decisão de como seguir é do jogador/GM.
 */
export default function PainelMorrendo({ personagem, nex, onRolar, aoMudar }) {
  const morrendo = (personagem.condicoes || []).includes('morrendo');
  const inconsciente = (personagem.condicoes || []).includes('inconsciente');
  const pv = personagem.pvAtual;
  const chegouAZero = pv !== null && pv !== undefined && Number(pv) <= 0;

  const extra = efeitosDiarios(personagem, nex).turnosMorrendoExtra || 0;
  const limite = 3 + extra;
  const turnos = Number(personagem.turnosMorrendo) || 0;

  const [popupAberto, setPopupAberto] = useState(false);
  const [popupMorte, setPopupMorte] = useState(false);
  const pvAnterior = useRef(pv);
  const turnosAnterior = useRef(turnos);

  // Só a Inconsciência sai sozinha ao curar — ela (e só ela) traz os debuffs
  // de 0 PV (−10 Defesa, indefeso, sem ações), então assim que os PV voltam a
  // subir acima de 0 deixa de fazer sentido e sai, debuffs incluídos. A
  // Morrendo NÃO é tocada aqui: essa fica ligada até o Teste de Medicina (ou
  // Tenacidade) ter sucesso, seja qual for o PV atual — é o jogador/GM que a
  // desliga, no botão "Estabilizado" abaixo ou pelos atalhos de teste.
  useEffect(() => {
    if (!chegouAZero && inconsciente) {
      aoMudar({ condicoes: (personagem.condicoes || []).filter((c) => c !== 'inconsciente') });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chegouAZero, inconsciente]);

  // Pop-up: só abre sozinho no momento em que os PV CAEM até 0 (não em todos
  // os renders) — se o agente for curado e voltar a cair depois, reabre.
  useEffect(() => {
    const vinhaDeAcima = pvAnterior.current === null || pvAnterior.current === undefined || Number(pvAnterior.current) > 0;
    if (chegouAZero && !morrendo && vinhaDeAcima) setPopupAberto(true);
    pvAnterior.current = pv;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pv]);

  // Pop-up de morte: só abre sozinho no momento em que o contador CHEGA ao
  // limite (não em todos os renders) — se o GM baixar o contador à mão
  // depois, reabre-se se voltar a chegar lá.
  useEffect(() => {
    const vinhaDeBaixo = Number(turnosAnterior.current) < limite;
    if (morrendo && turnos >= limite && vinhaDeBaixo) setPopupMorte(true);
    turnosAnterior.current = turnos;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnos, limite, morrendo]);

  function aplicarMorrendo() {
    aoMudar({
      condicoes: [...new Set([...(personagem.condicoes || []), 'morrendo', 'inconsciente'])],
      turnosMorrendo: 0,
      tenacidadeTestes: 0,
    });
    setPopupAberto(false);
  }

  if (!morrendo) {
    if (!chegouAZero) return null;
    return (
      <>
        <div className="aviso-morrendo">
          <span><strong>PV chegou a 0.</strong> Sugestão: liga a condição Morrendo.</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {!popupAberto && (
              <button type="button" className="btn ghost sm" onClick={() => setPopupAberto(true)}>Rever aviso</button>
            )}
            <button type="button" className="btn sm" onClick={aplicarMorrendo}>Ligar Morrendo</button>
          </div>
        </div>

        {popupAberto && (
          <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && setPopupAberto(false)}>
            <div className="modal modal-popup-morrendo">
              <div className="popup-morrendo-icone"></div>
              <h3>PV chegou a 0!</h3>
              <p>
                O agente cai indefeso e inconsciente. Se entrar em Morrendo e não for socorrido, morre ao
                começar o 3.º turno morrendo nesta cena.
              </p>
              <div className="popup-morrendo-acoes">
                <button type="button" className="btn ghost" onClick={() => setPopupAberto(false)}>Agora não</button>
                <button type="button" className="btn danger" onClick={aplicarMorrendo}>
                  Ligar Morrendo + Inconsciente
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  const cond = CONDICOES_POR_ID.morrendo;
  const testesTenacidade = Number(personagem.tenacidadeTestes) || 0;
  const dtTenacidade = 20 + 10 * testesTenacidade;
  const temTenacidade = temPoder(personagem, 'Tenacidade');

  const pericias = calcPericias(personagem);
  const fortitude = pericias.find((p) => p.id === 'fortitude');

  function estabilizar() {
    aoMudar({
      condicoes: (personagem.condicoes || []).filter((c) => c !== 'morrendo'),
      turnosMorrendo: 0,
      tenacidadeTestes: 0,
    });
  }

  return (
    <div className="painel-morrendo">
      <div className="topo-morrendo">
        <strong>{cond.nome}</strong>
        <span className="dica-morrendo">{cond.descricao}</span>
      </div>

      <div className="contador-morrendo">
        <span>
          Turnos morrendo nesta cena: {turnos} / {limite}
          {extra > 0 ? ` (inclui ${extra} de tolerância da Trilha)` : ''}
        </span>
        <div className="botoes-contador-morrendo">
          <button type="button" onClick={() => aoMudar({ turnosMorrendo: Math.max(0, turnos - 1) })} aria-label="Diminuir turnos">−</button>
          <button type="button" onClick={() => aoMudar({ turnosMorrendo: turnos + 1 })}>+1 turno</button>
        </div>
      </div>

      {turnos >= limite && (
        <div className="aviso-morte">
          <span>Chegou aos {limite} turnos morrendo nesta cena — morre.</span>
          {!popupMorte && (
            <button type="button" className="btn ghost sm" onClick={() => setPopupMorte(true)}>Ver aviso</button>
          )}
        </div>
      )}

      {popupMorte && (
        <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && setPopupMorte(false)}>
          <div className="modal modal-popup-morte">
            <img
              src="/img/logo-ordo-realitas.png"
              alt="Ordo Realitas"
              className="popup-morte-logo"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="popup-morte-icone"></div>
            <h3>{(personagem.nome || 'O agente').trim()} caiu em campo</h3>
            <p>
              Mais um serviço prestado contra o Inefável — pago com a própria vida. Que o que foi descoberto,
              enfrentado e protegido nesta jornada não se perca. A Ordo Realitas agradece e não esquece.
            </p>
            <div className="popup-morte-acoes">
              <button type="button" className="btn" onClick={() => setPopupMorte(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      <div className="dica-medicina-morrendo">
        Esta condição só sai com um Teste de Medicina (DT 20) feito por quem te socorrer — estás sem ações para o
        fazer sozinho — ou pelo teste de Tenacidade abaixo, se o tiveres. Curar PV não a encerra sozinho: só tira a
        Inconsciente e os seus debuffs.
      </div>

      <div className="acoes-morrendo">
        {temTenacidade && fortitude && (
          <button
            type="button"
            className="btn ghost sm"
            title="Poder Tenacidade — ação livre; encerra a condição se passar"
            onClick={() => {
              onRolar(rolarTeste({
                nome: 'Fortitude — Tenacidade', dados: fortitude.dados, bonus: fortitude.bonus,
                dadosExtra: fortitude.dadosExtra, detalhe: `DT ${dtTenacidade}`,
              }));
              aoMudar({ tenacidadeTestes: testesTenacidade + 1 });
            }}
          >
            Fortitude — Tenacidade (DT {dtTenacidade})
          </button>
        )}
        <button type="button" className="btn sm" onClick={estabilizar}>Estabilizado — remover condição</button>
      </div>
    </div>
  );
}
