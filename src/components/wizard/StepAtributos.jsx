import React, { useEffect, useRef } from 'react';
import { ATRIBUTOS, REGRAS_ATRIBUTOS } from '../../data/atributos.js';
import { PERICIAS } from '../../data/pericias.js';
import { pontosRestantes } from '../../engine/calc.js';

/**
 * Resumo de cada atributo, mostrado no ecrã "registo" (ver CrtEcra.jsx, que
 * fornece a moldura de TV/VHS à volta deste conteúdo).
 *
 * `conceito` e `afeta` vêm tal como confirmados pelo Carlo a partir do livro
 * base de Ordem Paranormal (não temos o PDF do livro base nesta sessão, só
 * dois suplementos — por isso este texto foi-nos passado diretamente, não
 * inventado). A lista de perícias de cada atributo NÃO está aqui à mão: é
 * derivada de `data/pericias.js` (a mesma fonte que a ficha usa nos
 * cálculos), por isso nunca desalinha com o resto da app. `roleplay` é só
 * uma sugestão de interpretação nossa — não é uma citação do livro.
 */
const DESCRICOES_ATRIBUTOS = {
  for: {
    conceito: 'Potência muscular, porte atlético.',
    afeta: 'Limite de Carga, Dano Corpo a Corpo, Manobras de Combate.',
    roleplay: 'Como o teu agente resolve problemas à força — arrombar uma porta, carregar um ferido, impor-se fisicamente.',
  },
  agi: {
    conceito: 'Reflexos, furtividade, destreza.',
    afeta: 'Defesa, Iniciativa, Esquiva, Ataques à Distância / Ágeis.',
    roleplay: 'Como o teu agente se move e reage — rápido a desviar-se do perigo, discreto a infiltrar-se, preciso a acertar num alvo.',
  },
  int: {
    conceito: 'Lógica, dedução, investigação, ciência.',
    afeta: '+Perícias Treinadas, Ocultismo, Medicina, Investigação de Pistas.',
    roleplay: 'Como o teu agente pensa — junta pistas, lembra-se de teorias obscuras, resolve o que os outros não conseguem ver.',
  },
  pre: {
    conceito: 'Força de vontade, carisma, sentidos.',
    afeta: 'Pontos de Esforço (PE), DT de Rituais, Testes de Sanidade.',
    roleplay: 'Como o teu agente impõe presença — convence, engana, inspira confiança, ou simplesmente não desmorona perante o Inefável.',
  },
  vig: {
    conceito: 'Robustez, saúde, tolerância à dor.',
    afeta: 'Pontos de Vida (PV), Bloqueio (RD), Testes de Morte e Veneno.',
    roleplay: 'Quanto castigo o teu agente aguenta antes de cair — o quão bem resiste a feridas, venenos e ao desgaste da profissão.',
  },
};

function periciasDoAtributo(id) {
  return PERICIAS.filter((p) => p.attr === id).map((p) => p.nome).join(', ');
}

/** Caixa de valor de um atributo: botões +/−, digitar à mão, e scroll do rato (como o resto da ficha). */
function CaixaAtributo({ valor, onChange, podeSubir, podeDescer }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY < 0) onChange(valor + 1);
      else onChange(valor - 1);
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [valor, onChange]);

  return (
    <div className="la-caixa">
      <button type="button" onClick={() => onChange(valor - 1)} disabled={!podeDescer} aria-label="Descer">−</button>
      <input ref={ref} type="number" className="la-input" value={valor} onChange={(e) => onChange(Number(e.target.value))} />
      <button type="button" onClick={() => onChange(valor + 1)} disabled={!podeSubir} aria-label="Subir">+</button>
    </div>
  );
}

export default function StepAtributos({ personagem, atualizar }) {
  const atributos = personagem.atributos;
  const restantes = pontosRestantes(atributos, REGRAS_ATRIBUTOS.pontosParaDistribuir);

  function setAtributo(id, valorBruto) {
    let novo = Math.round(Number(valorBruto));
    if (Number.isNaN(novo)) return;
    novo = Math.max(REGRAS_ATRIBUTOS.minimo, Math.min(REGRAS_ATRIBUTOS.maximoInicial, novo));
    const atual = atributos[id];
    const delta = novo - atual;
    // não deixa digitar/rodar para além do orçamento partilhado dos 4 pontos
    if (delta > 0 && delta > restantes) novo = atual + Math.max(0, restantes);
    if (novo === atual) return;
    atualizar({ atributos: { ...atributos, [id]: novo } });
  }

  const podeSubir = (id) => atributos[id] < REGRAS_ATRIBUTOS.maximoInicial && restantes > 0;
  const podeDescer = (id) => atributos[id] > REGRAS_ATRIBUTOS.minimo;

  return (
    <>
      <p className="texto-regra crt-regra">
        Todos os atributos começam em <span className="destaque">1</span> e tens{' '}
        <span className="destaque">4 pontos</span> para distribuir entre eles como quiseres. Também podes
        reduzir um atributo a <span className="destaque">0</span> para receber 1 ponto adicional. O valor
        máximo inicial em cada atributo é <span className="destaque">3</span>.
      </p>

      <div className="lista-atributos-crt">
        {ATRIBUTOS.map((a) => {
          const d = DESCRICOES_ATRIBUTOS[a.id];
          return (
            <div className="linha-atributo-crt" key={a.id}>
              <div className="la-nome">
                <span className="la-sigla">{a.sigla}</span>
                <span className="la-nome-completo">{a.nome}</span>
              </div>

              <CaixaAtributo
                valor={atributos[a.id]}
                onChange={(v) => setAtributo(a.id, v)}
                podeSubir={podeSubir(a.id)}
                podeDescer={podeDescer(a.id)}
              />

              <div className="la-texto">
                <p className="la-conceito">{d.conceito}</p>
                <p className="la-mecanica"><span className="la-rotulo">Afeta:</span> {d.afeta}</p>
                <p className="la-pericias"><span className="la-rotulo">Perícias:</span> {periciasDoAtributo(a.id)}</p>
                <p className="la-roleplay"><em>No roleplay:</em> {d.roleplay}</p>
              </div>
            </div>
          );
        })}
      </div>

      {restantes > 0 && (
        <div className="aviso crt-aviso">Ainda tens pontos por gastar — podes avançar na mesma e voltar depois.</div>
      )}
    </>
  );
}
