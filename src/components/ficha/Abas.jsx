import React, { useState } from 'react';
import { PERICIAS } from '../../data/pericias.js';
import { RITUAIS, ELEMENTOS, CIRCULOS, circuloMaximoPorNex } from '../../data/rituais.js';
import { ITENS, TIPOS_ITEM } from '../../data/itens.js';
import { PODERES } from '../../data/poderes.js';
import { CLASSES_POR_ID, TRILHAS_POR_ID } from '../../data/classes.js';
import { ORIGENS_POR_ID } from '../../data/origens.js';
import { calcCarga, calcItensPorCategoria, nexEfetivo, calcMaximos } from '../../engine/calc.js';
import { PATENTES, PATENTES_POR_ID, CATEGORIAS, categoriaRomana } from '../../data/patentes.js';
import { novoAtaque, novoItem, novaHabilidade, novoRitual } from '../../engine/character.js';
import { rolarAtaqueCompleto, rolarDano, rolarTeste } from '../../engine/dados.js';
import { estatisticasArma, interpretarCritico, armaDoItem, ehArma, formulaTeste } from '../../engine/armas.js';
import { precoDoRitual } from '../../engine/rituais.js';
import { ataquesNaturaisAtivos, rituaisAtivos, temComponentesDoElemento, classeMonstruosa, elementoAtual, patamarAtual } from '../../engine/monstruoso.js';
import { ELEMENTOS_MONSTRUOSO, COR_ELEMENTO } from '../../data/monstruoso.js';
import EditorArma from './EditorArma.jsx';
import { calcPericias } from '../../engine/calc.js';
import IconeD20 from '../IconeD20.jsx';
import CabecalhoSeta from './CabecalhoSeta.jsx';

const NOME_ATRIBUTO = { for: 'Força', agi: 'Agilidade', int: 'Intelecto', pre: 'Presença', vig: 'Vigor' };
import Seletor from './Seletor.jsx';
import EditorTags from '../EditorTags.jsx';

function Campo({ label, valor, onChange, tipo = 'text', opcoes, readOnly = false }) {
  return (
    <div className="campo">
      <label>{label}</label>
      {opcoes && !readOnly ? (
        <select value={valor} onChange={(e) => onChange(e.target.value)}>
          {opcoes.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input type={tipo} value={valor ?? ''} onChange={(e) => onChange(e.target.value)} readOnly={readOnly} />
      )}
    </div>
  );
}

/**
 * Descrição de habilidade/ritual — fica totalmente fechada por omissão
 * (só o nome e as infos necessárias ficam visíveis fora daqui), com uma
 * setinha para abrir e mostrar o texto todo. Nada de pré-visualização: ou
 * está fechada (sem texto nenhum) ou está aberta (texto completo).
 */
function TextoExpandivel({ texto, cor = 'var(--txt-dim)' }) {
  const [aberto, setAberto] = useState(false);
  if (!texto) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <CabecalhoSeta estaAberto={aberto} onClick={() => setAberto((v) => !v)}>
        {aberto ? 'Esconder descrição' : 'Mostrar descrição'}
      </CabecalhoSeta>
      {aberto && (
        <div style={{ color: cor, fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap', marginTop: 6 }}>
          {texto}
        </div>
      )}
    </div>
  );
}

function useLista(personagem, setPersonagem, chave) {
  const lista = personagem[chave] || [];
  const setLista = (nova) => setPersonagem({ ...personagem, [chave]: nova });
  return {
    lista,
    adicionar: (item) => setLista([...lista, item]),
    editar: (i, patch) => setLista(lista.map((x, j) => (j === i ? { ...x, ...patch } : x))),
    remover: (i) => setLista(lista.filter((_, j) => j !== i)),
  };
}

// ---------------------------------------------------------------- COMBATE

export function AbaCombate({ personagem, setPersonagem, onRolar }) {
  const { lista: listaPropria, editar } = useLista(personagem, setPersonagem, 'ataques');
  // Armas naturais concedidas pela Trilha do Monstruoso (ex.: Mordida) só
  // existem enquanto a etapa de hoje está ativa — aparecem/desaparecem
  // sozinhas nesta lista, não são editáveis nem removíveis à mão.
  const nex = nexEfetivo(personagem);
  const naturais = ataquesNaturaisAtivos(personagem, nex);
  const lista = [...listaPropria, ...naturais];
  const [acertos, setAcertos] = useState({});

  // Combatente Sangue 99% ("Ser Aterrorizante"): sempre que causa dano com a
  // mordida, recupera 5 PV (x2 em crítico) — automático, sem botão.
  const recuperaComMordida = classeMonstruosa(personagem) === 'combatente'
    && elementoAtual(personagem) === 'Sangue' && patamarAtual(nex) >= 99;

  function recuperarPvMordida(critico) {
    if (!recuperaComMordida) return;
    const max = calcMaximos(personagem);
    const cura = critico ? 10 : 5;
    setPersonagem((p) => ({ ...p, pvAtual: Math.min(max.pv, Number(p.pvAtual ?? max.pv) + cura) }));
  }

  function atacar(a, i) {
    const e = estatisticasArma(personagem, a);
    const r = rolarAtaqueCompleto({
      nome: a.nome || 'Ataque',
      dados: e.dados, bonusAtaque: e.bonusAtaque, margem: e.margem,
      dano: e.dano, bonusDano: e.bonusDano, extras: e.extras, multiplicador: e.multiplicador,
      dadosExtraAtaque: e.dadosExtraAtaque,
    });
    setAcertos({ ...acertos, [i]: r });
    onRolar(r);
    if (a.nome === 'Mordida (Monstruoso)' && r.dano) recuperarPvMordida(r.dano.critico);
  }

  // Combatente Sangue 65% ("Ser Assustador"): 1x/ronda, ao usar Agredir com
  // outra arma, gasta 1 PE para um ataque corpo a corpo extra com a mordida
  // (o "1x/ronda" não é imposto pela ficha — fica a cargo da mesa, como
  // outros limites por cena/ronda que já não são impostos noutros pontos).
  function atacarComPe(a, i) {
    const max = calcMaximos(personagem);
    const peAtual = Number(personagem.peAtual ?? max.pe);
    if (peAtual < 1) return;
    setPersonagem((p) => ({ ...p, peAtual: Number(p.peAtual ?? max.pe) - 1 }));
    atacar(a, i);
  }

  function danificar(a, i) {
    const e = estatisticasArma(personagem, a);
    const critico = Boolean(acertos[i]?.critico);
    const r = rolarDano({
      nome: `${a.nome || 'Ataque'} — dano`,
      dano: e.dano, bonus: e.bonusDano, extras: e.extras,
      critico, multiplicador: e.multiplicador,
    });
    if (r) {
      onRolar(r);
      if (a.nome === 'Mordida (Monstruoso)') recuperarPvMordida(r.critico);
    }
    else onRolar({ id: String(Math.random()), tipo: 'dano', nome: 'Dano inválido', rolagens: [], bonus: 0, total: 0 });
  }

  return (
    <div>
      {lista.length === 0 ? (
        <div className="painel-vazio">Sem armas. Escolhe-as no separador Inventário.</div>
      ) : (
        <div className="lista-blocos">
          {lista.map((a, i) => {
            const e = estatisticasArma(personagem, a);
            const acerto = acertos[i];
            const equipado = a.equipado !== false;
            return (
              <div className={'bloco arma' + (equipado ? '' : ' guardada')} key={a._monstruosoId || i}>
                <div className="topo">
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    {a.imagem && <div className="miniatura-arma" style={{ backgroundImage: `url(${a.imagem})` }} />}
                    <div>
                    <b style={{ fontSize: '18px', letterSpacing: '0.5px' }}>
                      {a.nome || 'Sem nome'}
                      {a._monstruoso && <span className="pill" style={{ marginLeft: 8, fontSize: 10 }} title={a.notas}>MONSTRUOSO</span>}
                    </b>
                    <div className="arma-stats" style={{ fontSize: '14px' }}>
                      <span title={`Teste de ${e.pericia.nome} com ${NOME_ATRIBUTO[e.atributoTeste] || ''}${e.dados > 0 ? '' : ' — com o atributo a 0 rolas 2 dados e fica o pior'}`}>
                        {e.pericia.nome}{' '}
                        <span style={{ color: e.dados === 0 ? '#ef4444' : '#22c55e' }}>
                          {e.dados === 0 ? 2 : e.dados}d20
                        </span>
                        {e.bonusAtaque ? (e.bonusAtaque > 0 ? ` +${e.bonusAtaque}` : ` ${e.bonusAtaque}`) : ''}
                        {e.dadosExtraAtaque.length > 0 && ` + ${e.dadosExtraAtaque.join(' + ')}`}
                      </span>
                      {e.agilAtiva && <span title="Arma ágil: usa Agilidade em vez de Força no ataque e no dano" style={{ opacity: 0.8 }}>ÁGIL</span>}
                      <span title="Dano">{e.dano}{e.bonusDano ? (e.bonusDano > 0 ? ` + ${e.bonusDano}` : ` − ${Math.abs(e.bonusDano)}`) : ''}</span>
                      <span>{e.margem === 20 ? '20' : `${e.margem}–20`} / ×{e.multiplicador}</span>
                      {a.tipo && <span>{a.tipo}</span>}
                      {e.alcance && <span>{e.alcance}</span>}
                      <span title="Ocupa este espaço na carga, esteja na mão ou guardada">{Number(a.espacos) || 0} esp.</span>
                      {e.extras.map((x, i) => {
                        const expr = typeof x === 'string' ? x : x.expr;
                        const elemental = typeof x === 'object' && x !== null && x.elemental;
                        return (
                          <span key={`${expr}-${i}`} style={elemental ? { color: 'var(--sangue-claro)' } : undefined} title={elemental ? 'Dano da Trilha do Monstruoso' : undefined}>
                            +{expr}
                          </span>
                        );
                      })}
                    </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {!a._monstruoso && (
                      <button
                        type="button"
                        className={'toggle-equipar' + (equipado ? ' equipado' : '')}
                        onClick={() => editar(i, { equipado: !equipado })}
                        title={equipado ? 'Está na mão. Carrega para a guardar.' : 'Está guardada. Carrega para a equipar.'}
                      >
                        <span className="bolinha" />
                        {equipado ? 'Equipada' : 'Guardada'}
                      </button>
                    )}
                    <button className="btn sm" disabled={!equipado} title={equipado ? '' : 'Equipa a arma primeiro'} onClick={() => atacar(a, i)}>Atacar</button>
                    {a.nome === 'Mordida (Monstruoso)' && (
                      <button
                        className="btn sm ghost"
                        disabled={!equipado || Number(personagem.peAtual ?? calcMaximos(personagem).pe) < 1}
                        title="Ser Assustador (65%) — 1x/ronda, ao usar Agredir com outra arma: gasta 1 PE por um ataque corpo a corpo extra com a mordida"
                        onClick={() => atacarComPe(a, i)}
                      >
                        Ataque extra (1 PE)
                      </button>
                    )}
                    <button
                      className={'btn sm' + (acerto?.critico ? '' : ' ghost')}
                      disabled={!acerto || !equipado}
                      title={acerto ? (acerto.critico ? `Crítico: dados ×${e.multiplicador}` : 'Rolar dano normal') : 'Faz primeiro o teste de ataque'}
                      onClick={() => danificar(a, i)}
                    >
                      {acerto?.critico ? `Dano ×${e.multiplicador}` : 'Só dano'}
                    </button>
                  </div>
                </div>

                {acerto && (
                  <div className={'resultado-ataque' + (acerto.critico ? ' critico' : '')}>
                    <span>
                      Acerto: <b>{acerto.total}</b> ({acerto.dados}d20 [{acerto.rolagens.join(', ')}] → maior {acerto.escolhido}
                      {acerto.bonus ? ` ${acerto.bonus > 0 ? '+' : '−'} ${Math.abs(acerto.bonus)}` : ''}
                      {(acerto.dadosExtra || []).map((d) => ` + ${d.expr} [${d.rolagens.join(', ')}]`).join('')})
                      {acerto.critico ? ' · ACERTO CRÍTICO' : ''}
                    </span>
                    {acerto.dano && (
                      <span>
                        Dano: <b>{acerto.dano.total}</b> ({acerto.dano.expressao} [{acerto.dano.rolagens.join(', ')}]
                        {(acerto.dano.extras || []).map((ex, i) => (
                          <span key={i} style={ex.elemental ? { color: 'var(--sangue-claro)' } : undefined} title={ex.elemental ? 'Dano da Trilha do Monstruoso' : undefined}>
                            {` + ${ex.expr} [${ex.rolagens.join(', ')}]`}
                          </span>
                        ))}
                        {acerto.dano.bonus ? ` ${acerto.dano.bonus > 0 ? '+' : '−'} ${Math.abs(acerto.dano.bonus)}` : ''}
                        {acerto.dano.critico ? ` · dados ×${acerto.dano.multiplicador}` : ''})
                      </span>
                    )}
                  </div>
                )}

                {((a.modificacoes || []).length > 0 || (a.maldicoes || []).length > 0) && (
                  <div className="resumo-mods">
                    {(e.mods?.lista || []).map((m) => <span key={m.id} className="pill" title={m.texto}>{m.nome}</span>)}
                    {(e.maldicoes?.lista || []).map((m) => (
                      <span
                        key={m.id}
                        className="pill"
                        title={m.texto}
                        style={{
                          borderColor: m.elemento === 'conhecimento' ? '#f5a636' : m.elemento === 'energia' ? '#9933ff' : m.elemento === 'morte' ? '#82738c' : '#f04653',
                          color: m.elemento === 'conhecimento' ? '#f5a636' : m.elemento === 'energia' ? '#c084fc' : m.elemento === 'morte' ? '#d6d3d1' : '#f87171',
                        }}
                      >
                        {m.nome}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <RituaisEmCombate personagem={personagem} setPersonagem={setPersonagem} onRolar={onRolar} />
    </div>
  );
}

function RituaisEmCombate({ personagem, setPersonagem, onRolar }) {
  // Regra dos Hooks: têm de vir antes de qualquer "return null" condicional
  // — senão, no momento em que a personagem ganha o primeiro ritual (ex.:
  // ao chegar a Combatente-Sangue 99%, "Forma Monstruosa"), este componente
  // passa a chamar mais hooks do que na renderização anterior (0 → 2) e o
  // React crasha ("Rendered more hooks than during the previous render").
  const [modalVontade, setModalVontade] = useState(null); // ritual (r) ou null
  const [danoRascunho, setDanoRascunho] = useState(0);

  // Rituais concedidos pela Trilha do Monstruoso só existem enquanto a
  // etapa de hoje está ativa — somam-se aos rituais próprios da personagem.
  const rituais = [...(personagem.rituais || []), ...rituaisAtivos(personagem, nexEfetivo(personagem))];
  if (!rituais.length) return null;

  const max = calcMaximos(personagem);
  const usaPd = max.semSanidade;
  const atual = usaPd ? (personagem.pdAtual ?? max.pd) : (personagem.peAtual ?? max.pe);
  const dt = Number(personagem.dtRitual) || null;

  // "Componentes ritualísticos são necessários para a conjuração de rituais
  // do elemento em questão" (Livro Base) — precisa dos componentes DESSE
  // elemento, os de outro elemento não servem. Medo não tem componentes
  // (não existem, por regra) e "variável (à escolha)" não tem um elemento
  // fixo para verificar — nenhum dos dois entra nesta exigência.
  function precisaComponente(r) {
    return Boolean(r.elemento) && r.elemento !== 'medo' && r.elemento !== 'variavel';
  }
  function temComponente(r) {
    return !precisaComponente(r) || temComponentesDoElemento(personagem.inventario, r.elemento);
  }

  function conjurar(r) {
    const custo = Number(String(r.custo).replace(/\D/g, '')) || 0;
    // "Enquanto estiver transformado... não pode... conjurar rituais"
    // (Forma Monstruosa) — bloqueia qualquer conjuração, incluindo repetir
    // este ritual, enquanto a transformação estiver ativa.
    if (custo > atual || !temComponente(r) || personagem.formaMonstruosaAtiva) return;

    // Poder de toque da Trilha do Monstruoso (Especialista-Conhecimento
    // 65%+: Detecção de Ameaças/Mergulho Mental) — só desconta o PE fixo,
    // sem teste de Ocultismo nem custo de Sanidade por círculo (não é uma
    // conjuração normal, ver `_semTeste` em engine/monstruoso.js).
    if (r._semTeste) {
      setPersonagem({ ...personagem, [usaPd ? 'pdAtual' : 'peAtual']: atual - custo });
      onRolar({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        tipo: 'ritual', semTeste: true, nome: r.nome || 'Ritual', detalhe: 'poder de toque — sem teste',
        notas: [`${custo} ${usaPd ? 'PD' : 'PE'} gastos`, 'Poder de toque da Trilha do Monstruoso — sem teste de Ocultismo'],
        total: 'concedido', critico: false, falhaCritica: false,
      });
      return;
    }

    const circulo = Number(r.circulo) || 1;
    const oc = calcPericias(personagem).find((x) => x.id === 'ocultismo') || { dados: 0, bonus: 0 };
    const teste = rolarTeste({ nome: `${r.nome || 'Ritual'} — Ocultismo`, dados: oc.dados, bonus: oc.bonus });

    const { perdeSan, perdePermanente, limiteSan, limitePermanente } = precoDoRitual(teste.total, circulo);

    const campoAtual = usaPd ? 'pdAtual' : 'sanAtual';
    const maximoMental = usaPd ? max.pd : max.san;
    const mentalAtual = personagem[campoAtual] ?? maximoMental;

    const patch = { [usaPd ? 'pdAtual' : 'peAtual']: atual - custo };
    if (usaPd) {
      let pd = atual - custo;
      if (perdeSan) pd = Math.max(0, pd - 1);
      patch.pdAtual = pd;
      if (perdePermanente) patch.pdExtra = (Number(personagem.pdExtra) || 0) - 1;
    } else {
      if (perdeSan) patch.sanAtual = Math.max(0, mentalAtual - 1);
      if (perdePermanente) {
        patch.sanExtra = (Number(personagem.sanExtra) || 0) - 1;
        patch.sanAtual = Math.max(0, Math.min(patch.sanAtual ?? mentalAtual, maximoMental - 1));
      }
    }
    // Forma Monstruosa garante mesmo os efeitos do livro ao ser conjurada:
    // 30 PV temporários e a transformação fica ativa (liga o +5 em ataque/
    // dano corpo a corpo em armas.js e bloqueia conjurar outros rituais,
    // até terminares a transformação à mão).
    if (r.nome === 'Forma Monstruosa') {
      patch.pvTemp = Number(personagem.pvTemp || 0) + 30;
      patch.formaMonstruosaAtiva = true;
    }
    setPersonagem({ ...personagem, ...patch });

    const nomeMental = usaPd ? 'Determinação' : 'Sanidade';
    const notas = [
      `${custo} ${usaPd ? 'PD' : 'PE'} gastos`,
      dt ? `DT ${dt} para resistir` : null,
      perdePermanente
        ? `falhou por muito (< ${limitePermanente}): −1 de ${nomeMental} e −1 permanente`
        : perdeSan
          ? `abaixo de ${limiteSan}: −1 de ${nomeMental}`
          : `${limiteSan} ou mais: a mente aguentou`,
    ].filter(Boolean);

    onRolar({ ...teste, tipo: 'ritual', nome: r.nome || 'Ritual', detalhe: `${circulo}º círculo`, notas, sofreu: perdeSan });
  }

  // Combatente Sangue 99% ("Ser Aterrorizante"): sempre que sofre dano, teste
  // de Vontade DT 10+dano — falhar obriga a próxima ação padrão a ser
  // conjurar Forma Monstruosa, por isso ao falhar aqui já se conjura sozinho.
  // (modalVontade/danoRascunho estão declarados no topo da função — Regra dos Hooks.)
  function abrirModalVontade(r) {
    setDanoRascunho(0);
    setModalVontade(r);
  }

  function confirmarTesteVontade() {
    const r = modalVontade;
    setModalVontade(null);
    if (!r) return;
    const dano = Math.max(0, Math.trunc(Number(danoRascunho) || 0));
    const dt = 10 + dano;
    const von = calcPericias(personagem).find((x) => x.id === 'vontade') || { dados: 0, bonus: 0 };
    const teste = rolarTeste({ nome: 'Vontade — resistir à Forma Monstruosa', dados: von.dados, bonus: von.bonus });
    const passou = teste.total >= dt;
    onRolar({
      ...teste, tipo: 'teste',
      notas: [`DT ${dt} (10 + ${dano} de dano)`, passou ? 'Resistiu — continua em si' : 'Falhou — a próxima ação padrão tem de ser conjurar Forma Monstruosa'],
      sofreu: !passou,
    });
    if (!passou) conjurar(r);
  }

  // Termina a transformação à mão (o livro não dá um gatilho automático de
  // fim de cena) — desliga o +5 corpo a corpo e volta a permitir conjurar.
  function terminarTransformacao() {
    setPersonagem((p) => ({ ...p, formaMonstruosaAtiva: false }));
  }

  return (
    <div className="rituais-combate">
      <div className="rotulo-lista">Rituais · {usaPd ? `${atual} PD` : `${atual} PE`} disponíveis{dt ? ` · DT ${dt}` : ''}</div>
      <div className="lista-blocos">
        {rituais.map((r, i) => {
          const custo = Number(String(r.custo).replace(/\D/g, '')) || 0;
          const circulo = Number(r.circulo) || 1;
          const podeGastar = custo <= atual;
          const componenteOk = temComponente(r);
          const transformado = Boolean(personagem.formaMonstruosaAtiva);
          const podeConjurar = podeGastar && componenteOk && !transformado;
          const nomeElemento = ELEMENTOS.find((e) => e.id === r.elemento)?.nome || r.elemento;
          return (
            <div className={'bloco ritual el-' + (r.elemento || 'variavel')} key={r._monstruosoId || i}>
              <div className="topo">
                <div>
                  <b style={{ fontSize: '18px', letterSpacing: '0.5px' }}>
                    {r.nome || 'Sem nome'}
                    {r._monstruoso && <span className="pill" style={{ marginLeft: 8, fontSize: 10 }} title="Concedido pela Trilha do Monstruoso — só enquanto a etapa de hoje está ativa">MONSTRUOSO</span>}
                  </b>
                  <div className="arma-stats" style={{ fontSize: '14px' }}>
                    {!r._semTeste && <span>{circulo}º círculo</span>}
                    {r.elemento && <span>{r.elemento}</span>}
                    <span>{custo} {usaPd ? 'PD' : 'PE'}</span>
                    {!r._semTeste && (
                      <span title="Abaixo disto perdes 1 de Sanidade; abaixo de 10 + círculo, perdes 1 permanente">
                        Ocultismo {20 + circulo} / {10 + circulo}
                      </span>
                    )}
                    {r._semTeste && <span title="Poder de toque da Trilha do Monstruoso — sem teste de Ocultismo">sem teste</span>}
                    {r.execucao && <span>{r.execucao}</span>}
                    {r.alcance && <span>{r.alcance}</span>}
                    {r.resistencia && <span>resistência: {r.resistencia}</span>}
                    {!componenteOk && (
                      <span style={{ color: 'var(--sangue-claro)' }} title={`Precisas de "Componentes Ritualísticos de ${nomeElemento}" no inventário`}>
                        sem componentes de {nomeElemento}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {r.nome === 'Forma Monstruosa' && r._monstruoso && (
                    <button
                      className="btn sm ghost"
                      title="Sempre que sofres dano: teste de Vontade DT 10+dano — se falhares, conjura este ritual automaticamente"
                      onClick={() => abrirModalVontade(r)}
                    >
                      Teste de Vontade
                    </button>
                  )}
                  {r.nome === 'Forma Monstruosa' && transformado ? (
                    <button
                      className="btn sm"
                      style={{ borderColor: 'var(--sangue)', background: 'var(--sangue)' }}
                      title="Termina a transformação — desliga o +5 em ataque/dano corpo a corpo e volta a poder conjurar rituais"
                      onClick={terminarTransformacao}
                    >
                      Terminar transformação
                    </button>
                  ) : (
                    <button
                      className="btn sm"
                      disabled={!podeConjurar}
                      title={
                        transformado ? 'Transformado pela Forma Monstruosa — não podes conjurar rituais'
                        : !podeGastar ? 'Não tens pontos que cheguem'
                        : !componenteOk ? `Precisas de "Componentes Ritualísticos de ${nomeElemento}" no inventário — os de outro elemento não servem`
                        : r._semTeste ? `Gasta ${custo} ${usaPd ? 'PD' : 'PE'} — sem teste de Ocultismo (poder de toque)`
                        : `Gasta ${custo} ${usaPd ? 'PD' : 'PE'} e faz o teste de Ocultismo`
                      }
                      onClick={() => conjurar(r)}
                    >
                      Conjurar
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modalVontade && (
        <div className="modal-fundo" style={{ zIndex: 100 }} onClick={(e) => e.target === e.currentTarget && setModalVontade(null)}>
          <div className="modal" style={{ maxWidth: 380, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>Teste de Vontade — Forma Monstruosa</h3>
              <button className="fechar" onClick={() => setModalVontade(null)}>×</button>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: 14.5, marginBottom: 20 }}>
                Quanto dano sofreste agora? A DT do teste de Vontade é 10 + esse dano — se falhares, o ritual é conjurado automaticamente.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 22 }}>
                <button type="button" className="btn ghost sm" onClick={() => setDanoRascunho((v) => Math.max(0, (Number(v) || 0) - 1))}>−</button>
                <strong style={{ fontSize: 22, minWidth: 48, textAlign: 'center', fontFamily: 'var(--numeros)' }}>{danoRascunho}</strong>
                <button type="button" className="btn ghost sm" onClick={() => setDanoRascunho((v) => (Number(v) || 0) + 1)}>+</button>
              </div>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                <button className="btn ghost" onClick={() => setModalVontade(null)}>Cancelar</button>
                <button className="btn" style={{ borderColor: 'var(--sangue)', background: 'var(--sangue)' }} onClick={confirmarTesteVontade}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------- HABILIDADES

export function AbaHabilidades({ personagem, setPersonagem }) {
  const { lista, adicionar, editar, remover } = useLista(personagem, setPersonagem, 'habilidades');
  const [aEscolher, setAEscolher] = useState(false);

  const classe = CLASSES_POR_ID[personagem.classeId];
  const trilha = personagem.trilhaId ? TRILHAS_POR_ID[personagem.trilhaId] : null;
  const origem = personagem.origemId === '__custom__' ? personagem.origemCustom : ORIGENS_POR_ID[personagem.origemId];
  const nex = nexEfetivo(personagem);

  const automaticas = [
    origem?.poder?.nome && { nome: origem.poder.nome, descricao: origem.poder.descricao, fonte: 'Origem' },
    ...(classe?.habilidades || []).filter((h) => !h.nex || Number(h.nex) <= nex).map((h) => ({ ...h, fonte: classe.nome })),
    ...(trilha?.poderes || []).filter((p) => !p.nex || Number(p.nex) <= nex).map((p) => ({ ...p, fonte: trilha.nome })),
  ].filter(Boolean);

  const catalogo = [
    ...PODERES,
    ...(classe?.poderes || []).map((p) => ({ ...p, tipo: 'classe', classe: classe.nome })),
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 14 }}>
        <button className="btn ghost" onClick={() => setAEscolher((v) => !v)}>Do catálogo</button>
        <button className="btn" onClick={() => adicionar(novaHabilidade())}>Nova Habilidade</button>
      </div>

      {aEscolher && (
        <Seletor
          titulo={`Poderes (${catalogo.length})`}
          itens={catalogo}
          filtros={[{ id: 'tipo', label: 'Todos os tipos', valorDe: (i) => i.tipo, opcoes: [...new Set(catalogo.map((p) => p.tipo))].map((t) => ({ valor: t, label: t })) }]}
          aoProcurar={(i, t) => i.nome.toLowerCase().includes(t) || (i.descricao || '').toLowerCase().includes(t)}
          render={(p) => (
            <>
              <b style={{ fontSize: '18px' }}>{p.nome}</b>
              <span className="meta">{[p.tipo, p.classe, p.elemento, p.prerequisito].filter(Boolean).join(' · ')}</span>
              <span className="corte">{p.descricao}</span>
            </>
          )}
          onEscolher={(p) => { adicionar({ nome: p.nome, descricao: p.descricao, origem: p.tipo }); setAEscolher(false); }}
          onFechar={() => setAEscolher(false)}
        />
      )}

      {automaticas.length > 0 && (
        <div className="lista-blocos" style={{ marginBottom: 14 }}>
          {automaticas.map((h, i) => (
            <div className="bloco" key={'auto' + i}>
              <div className="topo"><b style={{ fontSize: '18px' }}>{h.nome}</b><span className="pill">{h.fonte}{h.nex ? ` · NEX ${h.nex}%` : ''}</span></div>
              <TextoExpandivel texto={h.descricao} />
            </div>
          ))}
        </div>
      )}

      {lista.length === 0 && automaticas.length === 0 ? (
        <div className="painel-vazio">Ainda não possuis habilidades</div>
      ) : (
        <div className="lista-blocos">
          {lista.map((h, i) => (
            <div className="bloco" key={i}>
              <div className="topo">
                <input type="text" placeholder="Nome da habilidade" value={h.nome} onChange={(e) => editar(i, { nome: e.target.value })} style={{ fontSize: '18px', fontWeight: 'bold' }} />
                <button className="btn sm danger" onClick={() => remover(i)}>Remover</button>
              </div>
              <div className="campo" style={{ marginTop: 10, marginBottom: 0 }}>
                <textarea placeholder="Descrição" value={h.descricao} onChange={(e) => editar(i, { descricao: e.target.value })} style={{ fontSize: '14px' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------- RITUAIS

export function AbaRituais({ personagem, setPersonagem }) {
  const { lista: listaPropria, adicionar, editar, remover } = useLista(personagem, setPersonagem, 'rituais');
  // Rituais concedidos pela Trilha do Monstruoso só existem enquanto a
  // etapa de hoje está ativa — mostram-se aqui, mas não são editáveis (a
  // ficha deriva-os sozinha, não há nada para guardar à mão).
  const concedidos = rituaisAtivos(personagem, nexEfetivo(personagem));
  const lista = [...listaPropria, ...concedidos];
  const [aEscolher, setAEscolher] = useState(false);
  const circuloMax = circuloMaximoPorNex(nexEfetivo(personagem));
  // Um ritual trazido do catálogo já vem com tudo certo (é conteúdo oficial)
  // — por isso aparece normal, só de consulta, com um botão "Editar" ao
  // lado para quem quiser mesmo assim ajustar algo. Um ritual em branco
  // ("Novo Ritual") não tem nada para mostrar, por isso esse sim começa
  // logo aberto no formulário. `emEdicao` guarda os índices (em
  // `listaPropria`) que estão neste momento no modo de edição.
  const [emEdicao, setEmEdicao] = useState(() => new Set());
  function alternarEdicao(i) {
    setEmEdicao((prev) => {
      const novo = new Set(prev);
      if (novo.has(i)) novo.delete(i); else novo.add(i);
      return novo;
    });
  }
  function novoRitualEmBranco() {
    const i = listaPropria.length;
    adicionar(novoRitual());
    setEmEdicao((prev) => new Set(prev).add(i));
  }

  // Rituais "Variável (à escolha)" (ex.: Amaldiçoar Arma) pedem para
  // escolher um elemento AO APRENDER — essa escolha fica permanente no
  // ritual. `escolherElementoPara` guarda a lista de elementos possíveis
  // (r.elementos) e o que fazer com a escolha; serve tanto para um ritual
  // novo vindo do catálogo como para trocar o de um já guardado (pelo
  // lápis, que avisa primeiro que isto não é suposto acontecer).
  const [escolherElementoPara, setEscolherElementoPara] = useState(null); // { opcoes, aoEscolher(id) }
  const [avisoTrocarElemento, setAvisoTrocarElemento] = useState(null); // { i, opcoes }

  function pedirElementoParaNovoRitual(r) {
    setAEscolher(false);
    setEscolherElementoPara({
      opcoes: r.elementos,
      aoEscolher: (id) => { adicionar({ ...r, elemento: id, custo: r.circulo }); setEscolherElementoPara(null); },
    });
  }

  function pedirTrocarElemento(i, r) {
    setAvisoTrocarElemento({ i, opcoes: r.elementos });
  }

  function confirmarTrocarElemento() {
    const { i, opcoes } = avisoTrocarElemento;
    setAvisoTrocarElemento(null);
    setEscolherElementoPara({
      opcoes,
      aoEscolher: (id) => { editar(i, { elemento: id }); setEscolherElementoPara(null); },
    });
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
        <div className="campo" style={{ maxWidth: 140, marginBottom: 0 }}>
          <label>DT de ritual</label>
          <input type="number" value={personagem.dtRitual ?? ''} onChange={(e) => setPersonagem({ ...personagem, dtRitual: e.target.value })} />
        </div>
        <span className="pill">Círculo máximo em NEX {nexEfetivo(personagem)}%: {circuloMax}º</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn ghost" onClick={() => setAEscolher((v) => !v)}>Do catálogo</button>
          <button className="btn" onClick={novoRitualEmBranco}>Novo Ritual</button>
        </div>
      </div>

      {aEscolher && (
        <Seletor
          titulo={`Rituais (${RITUAIS.length})`}
          itens={RITUAIS}
          filtros={[
            { id: 'circulo', label: 'Todos os círculos', valorDe: (r) => r.circulo, opcoes: CIRCULOS.map((c) => ({ valor: c, label: `${c}º círculo` })) },
            { id: 'elemento', label: 'Todos os elementos', valorDe: (r) => r.elemento, opcoes: ELEMENTOS.map((e) => ({ valor: e.id, label: e.nome })) },
          ]}
          aoProcurar={(r, t) => r.nome.toLowerCase().includes(t) || (r.descricao || '').toLowerCase().includes(t)}
          render={(r) => (
            <>
              <b style={{ fontSize: '18px' }}>{r.nome}</b>
              <span className="meta">{r.elemento} {r.circulo}º · {r.execucao} · {r.alcance}</span>
              <span className="corte">{r.descricao}</span>
            </>
          )}
          onEscolher={(r) => {
            if (r.elemento === 'variavel') pedirElementoParaNovoRitual(r);
            else { adicionar({ ...r, custo: r.circulo }); setAEscolher(false); }
          }}
          onFechar={() => setAEscolher(false)}
        />
      )}

      {escolherElementoPara && (
        <div className="modal-fundo" style={{ zIndex: 100 }} onClick={(e) => e.target === e.currentTarget && setEscolherElementoPara(null)}>
          <div className="modal" style={{ maxWidth: 440, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>Escolhe o Elemento</h3>
              <button className="fechar" onClick={() => setEscolherElementoPara(null)}>×</button>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: 14.5, marginBottom: 24 }}>
                Escolha permanente — o ritual passa a ser deste elemento.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {escolherElementoPara.opcoes.map((id) => {
                  const el = ELEMENTOS.find((e) => e.id === id);
                  if (!el) return null;
                  return (
                    <button
                      key={id} className="btn ghost"
                      style={{ borderColor: el.cor, color: el.cor, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                      onClick={() => escolherElementoPara.aoEscolher(id)}
                    >
                      <img src={`/img/sigilo-${id}.png`} alt={el.nome} style={{ width: 46, height: 46, objectFit: 'contain', mixBlendMode: 'screen', marginBottom: 8 }} />
                      <strong style={{ fontSize: 15 }}>{el.nome.toUpperCase()}</strong>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {avisoTrocarElemento && (
        <div className="modal-fundo" style={{ zIndex: 100 }} onClick={(e) => e.target === e.currentTarget && setAvisoTrocarElemento(null)}>
          <div className="modal" style={{ maxWidth: 420, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>Trocar de elemento?</h3>
              <button className="fechar" onClick={() => setAvisoTrocarElemento(null)}>×</button>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: 14.5, marginBottom: 22 }}>
                A escolha do elemento deste ritual é <strong>permanente</strong> — não é suposto voltar atrás depois
                de a fazeres. Isto aqui é só para quando isso aconteceu por engano, ou o mestre permitir uma exceção.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                <button className="btn ghost" onClick={() => setAvisoTrocarElemento(null)}>Cancelar</button>
                <button className="btn" style={{ borderColor: 'var(--sangue)', background: 'var(--sangue)' }} onClick={confirmarTrocarElemento}>Sim, escolher outro elemento</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {lista.length === 0 ? (
        <div className="painel-vazio">Ainda não conheces rituais</div>
      ) : (
        <div className="lista-blocos">
          {lista.map((r, i) => {
            if (r._monstruoso) {
              return (
                <div className="bloco" key={r._monstruosoId || i}>
                  <div className="topo">
                    <b style={{ fontSize: '18px', letterSpacing: '0.5px' }}>{r.nome || 'Sem nome'}</b>
                    <span className="pill" title="Concedido pela Trilha do Monstruoso — só enquanto a etapa de hoje está ativa">MONSTRUOSO</span>
                  </div>
                  <div className="arma-stats" style={{ fontSize: '14px' }}>
                    {r.circulo !== '' && <span>{r.circulo}º círculo</span>}
                    {r.elemento && <span>{r.elemento}</span>}
                    {r.execucao && <span>{r.execucao}</span>}
                    {r.alcance && <span>{r.alcance}</span>}
                  </div>
                  <TextoExpandivel texto={r.descricao} />
                </div>
              );
            }

            // Ritual próprio (não concedido pela trilha): vem do catálogo
            // (conteúdo oficial, mostra-se normal, com "Editar" ao lado) ou
            // é um ritual em branco/à mão, que começa logo no formulário.
            if (!emEdicao.has(i)) {
              return (
                <div className="bloco" key={i}>
                  <div className="topo">
                    <b style={{ fontSize: '18px' }}>{r.nome || 'Sem nome'}</b>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn ghost sm" onClick={() => alternarEdicao(i)}>Editar</button>
                      <button className="btn sm danger" onClick={() => remover(i)}>Remover</button>
                    </div>
                  </div>
                  <div className="arma-stats" style={{ fontSize: '14px' }}>
                    {r.circulo !== '' && r.circulo != null && <span>{r.circulo}º círculo</span>}
                    {r.elemento && (
                      <span>
                        {ELEMENTOS.find((e) => e.id === r.elemento)?.nome || r.elemento}
                        {r.elementos?.length > 1 && (
                          <button
                            type="button"
                            onClick={() => pedirTrocarElemento(i, r)}
                            title="Trocar de elemento (não é suposto — só para engano ou exceção do mestre)"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt-fraco)', marginLeft: 4, fontSize: 12, padding: 0 }}
                          >
                            ✎
                          </button>
                        )}
                      </span>
                    )}
                    {r.execucao && <span>{r.execucao}</span>}
                    {r.alcance && <span>{r.alcance}</span>}
                    {r.alvo && <span>{r.alvo}</span>}
                    {r.duracao && <span>{r.duracao}</span>}
                    {r.resistencia && <span>{r.resistencia}</span>}
                    {r.custo !== '' && r.custo != null && <span>{r.custo} PE</span>}
                  </div>
                  <TextoExpandivel texto={r.descricao} />
                  {(r.discente || r.verdadeiro) && (
                    <div style={{ fontSize: 13, color: 'var(--txt-dim)', marginTop: 8 }}>
                      {r.discente && <div><b>Discente ({r.discente.custo}):</b> {r.discente.texto} {r.discente.requer}</div>}
                      {r.verdadeiro && <div><b>Verdadeiro ({r.verdadeiro.custo}):</b> {r.verdadeiro.texto} {r.verdadeiro.requer}</div>}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div className="bloco" key={i}>
                <div className="topo">
                  <input type="text" placeholder="Nome do ritual" value={r.nome} onChange={(e) => editar(i, { nome: e.target.value })} style={{ fontSize: '18px', fontWeight: 'bold' }} />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn ghost sm" onClick={() => alternarEdicao(i)}>Concluir edição</button>
                    <button className="btn sm danger" onClick={() => remover(i)}>Remover</button>
                  </div>
                </div>
                <div className="grelha">
                  <Campo label="Círculo" valor={r.circulo} onChange={(v) => editar(i, { circulo: Number(v) })} opcoes={CIRCULOS.map((c) => ({ value: c, label: `${c}º` }))} />
                  <Campo label="Elemento" valor={r.elemento} onChange={(v) => editar(i, { elemento: v })} opcoes={ELEMENTOS.map((e) => ({ value: e.id, label: e.nome }))} />
                  <Campo label="Execução" valor={r.execucao} onChange={(v) => editar(i, { execucao: v })} />
                  <Campo label="Alcance" valor={r.alcance} onChange={(v) => editar(i, { alcance: v })} />
                  <Campo label="Alvo" valor={r.alvo} onChange={(v) => editar(i, { alvo: v })} />
                  <Campo label="Duração" valor={r.duracao} onChange={(v) => editar(i, { duracao: v })} />
                  <Campo label="Resistência" valor={r.resistencia} onChange={(v) => editar(i, { resistencia: v })} />
                  <Campo label="Custo (PE)" valor={r.custo} onChange={(v) => editar(i, { custo: v })} />
                </div>
                <div className="campo" style={{ marginTop: 10, marginBottom: 0 }}>
                  <textarea placeholder="Descrição" value={r.descricao} onChange={(e) => editar(i, { descricao: e.target.value })} style={{ fontSize: '14px' }} />
                </div>
                {(r.discente || r.verdadeiro) && (
                  <div style={{ fontSize: 13, color: 'var(--txt-dim)', marginTop: 8 }}>
                    {r.discente && <div><b>Discente ({r.discente.custo}):</b> {r.discente.texto} {r.discente.requer}</div>}
                    {r.verdadeiro && <div><b>Verdadeiro ({r.verdadeiro.custo}):</b> {r.verdadeiro.texto} {r.verdadeiro.requer}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------ INVENTÁRIO

export function AbaInventario({ personagem, setPersonagem }) {
  const { lista, adicionar, editar, remover } = useLista(personagem, setPersonagem, 'inventario');
  const armas = useLista(personagem, setPersonagem, 'ataques');
  const [aEscolher, setAEscolher] = useState(false);
  const [aEscolherArma, setAEscolherArma] = useState(false);
  const [aEditarArma, setAEditarArma] = useState(null);   
  const [aEditarItem, setAEditarItem] = useState(null);
  const [aviso, setAviso] = useState(null);
  // "Componentes Ritualísticos de (Elemento)" é o mesmo item para os 4
  // elementos — antes de o meter no inventário, pergunta-se qual (mesmo
  // popup de escolha usado no elemento do Monstruoso).
  const [aEscolherElementoComponente, setAEscolherElementoComponente] = useState(null);
  const catalogoArmas = ITENS.filter(ehArma);
  const catalogoItens = ITENS.filter((i) => !ehArma(i));
  const carga = calcCarga(personagem);
  const cats = calcItensPorCategoria(personagem);
  const set = (patch) => setPersonagem({ ...personagem, ...patch });

  return (
    <div>
      <div className="painel-patente">
        <div className="campo" style={{ maxWidth: 190, marginBottom: 0 }}>
          <label>Patente</label>
          <select
            value={personagem.patenteId || cats.patente.id}
            onChange={(e) => set({ patenteId: e.target.value, patente: PATENTES_POR_ID[e.target.value]?.nome || '' })}
          >
            {PATENTES.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
        <div className="campo" style={{ maxWidth: 120, marginBottom: 0 }}>
          <label>Prestígio</label>
          <input type="number" value={personagem.pontosPrestigio || 0} onChange={(e) => set({ pontosPrestigio: Number(e.target.value) })} />
        </div>
        <div className="campo" style={{ maxWidth: 130, marginBottom: 0 }}>
          <label>Crédito</label>
          <input type="text" readOnly value={cats.patente.credito} />
        </div>
        <div className="campo" style={{ maxWidth: 280, marginBottom: 0 }}>
          <label>Carga</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="text" readOnly
              className={carga.sobrecarregado ? 'mau' : ''}
              value={`${carga.usados} / ${carga.max}`}
              title={`5 espaços por ponto de Força · máximo absoluto ${carga.limiteAbsoluto}`}
              style={{ width: 90, flexShrink: 0 }}
            />
            <span className="dica" style={{ whiteSpace: 'nowrap' }}>
              {carga.dosItens} em itens · {carga.dasArmas} em armas
              {carga.bonus ? ` · +${carga.bonus} de equipamento` : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="slots">
        {cats.linhas.map((l) => (
          <div key={l.categoria} className={'slot' + (l.usados > l.limite ? ' excedido' : '')}>
            <div className="cat">Categoria {l.categoria}</div>
            <div className="valor">{l.usados} / {l.limite === Infinity ? '∞' : l.limite}</div>
          </div>
        ))}
      </div>

      {carga.sobrecarregado && (
        <div className="aviso">
          <strong>Sobrecarregado:</strong> −5 na Defesa e nas perícias com penalidade de carga, deslocamento −3m.
          {carga.excedido && ' Passaste o dobro do limite: não consegues carregar isto.'}
        </div>
      )}
      {cats.excedeu && (
        <div className="aviso"><strong>Acima da patente:</strong> tens mais itens do que a Ordem te libera nesta missão.</div>
      )}

      <div className="grelha-botoes-inventario">
        <button type="button" className="btn ghost" onClick={() => setAEscolherArma((v) => !v)}>Armas do catálogo</button>
        <button type="button" className="btn" onClick={() => setAEditarArma((v) => (v === 'nova' ? null : 'nova'))}>Nova arma</button>
        <button type="button" className="btn ghost" onClick={() => setAEscolher((v) => !v)}>Itens do catálogo</button>
        <button type="button" className="btn" onClick={() => adicionar({ ...novoItem(), manual: true })}>Novo Item</button>
      </div>

      {aEscolherArma && (
        <Seletor
          titulo={`Armas (${catalogoArmas.length})`}
          itens={catalogoArmas}
          filtros={[{ id: 'grupo', label: 'Todos os grupos', valorDe: (i) => i.grupo, opcoes: [...new Set(catalogoArmas.map((a) => a.grupo).filter(Boolean))].map((g) => ({ valor: g, label: g })) }]}
          aoProcurar={(i, t) => i.nome.toLowerCase().includes(t) || (i.descricao || '').toLowerCase().includes(t)}
          render={(a) => (
            <>
              <b style={{ fontSize: '18px' }}>{a.nome}</b>
              <span className="meta">{[a.dano, a.critico, a.tipoDano, a.alcance, a.grupo, a.espacos != null ? `${a.espacos} esp.` : null].filter(Boolean).join(' · ')}</span>
            </>
          )}
          onEscolher={(a) => { armas.adicionar(armaDoItem(a)); setAEscolherArma(false); setAviso(null); }}
          onFechar={() => setAEscolherArma(false)}
        />
      )}

      {aEditarArma !== null && (
        <EditorArma
          arma={aEditarArma === 'nova' ? null : aEditarArma.arma}
          aoFechar={() => setAEditarArma(null)}
          aoGuardar={(nova) => {
            if (aEditarArma === 'nova') armas.adicionar({ equipado: true, ...nova });
            else armas.editar(aEditarArma.indice, nova);
            setAEditarArma(null);
          }}
        />
      )}

      {aEditarItem !== null && (
        <div className="modal-fundo" style={{ zIndex: 100 }}>
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>Editar Item</h3>
              <button className="fechar" onClick={() => setAEditarItem(null)}>×</button>
            </div>
            <div className="modal-corpo">
              <div className="campo">
                <label>Nome</label>
                <input type="text" value={aEditarItem.item.nome} onChange={(e) => setAEditarItem({ ...aEditarItem, item: { ...aEditarItem.item, nome: e.target.value } })} />
              </div>
              <div className="grelha">
                <Campo label="Categoria" valor={aEditarItem.item.categoria} onChange={(v) => setAEditarItem({ ...aEditarItem, item: { ...aEditarItem.item, categoria: v } })}
                  opcoes={[{ value: '', label: '—' }, ...CATEGORIAS.map((c) => ({ value: c, label: c }))]} />
                <Campo label="Espaços" valor={aEditarItem.item.espacos} onChange={(v) => setAEditarItem({ ...aEditarItem, item: { ...aEditarItem.item, espacos: Number(v) } })} tipo="number" />
              </div>
              <div className="campo">
                <label>Descrição</label>
                <textarea value={aEditarItem.item.descricao} onChange={(e) => setAEditarItem({ ...aEditarItem, item: { ...aEditarItem.item, descricao: e.target.value } })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button className="btn ghost" onClick={() => setAEditarItem(null)}>Cancelar</button>
                <button className="btn" onClick={() => { editar(aEditarItem.indice, aEditarItem.item); setAEditarItem(null); }}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {aEscolher && (
        <Seletor
          titulo={`Itens (${catalogoItens.length})`}
          itens={catalogoItens}
          filtros={[
            { id: 'tipo', label: 'Todos os tipos', valorDe: (i) => i.tipo, opcoes: TIPOS_ITEM.filter((t) => t.id !== 'arma').map((t) => ({ valor: t.id, label: t.nome })) },
            { id: 'categoria', label: 'Todas as categorias', valorDe: (i) => categoriaRomana(i.categoria), opcoes: CATEGORIAS.map((c) => ({ valor: c, label: `Categoria ${c}` })) },
          ]}
          aoProcurar={(i, t) => i.nome.toLowerCase().includes(t) || (i.descricao || '').toLowerCase().includes(t)}
          render={(i) => (
            <>
              <b style={{ fontSize: '18px' }}>{i.nome}</b>
              <span className="meta">
                {[
                  TIPOS_ITEM.find((t) => t.id === i.tipo)?.nome,
                  categoriaRomana(i.categoria) ? `Cat. ${categoriaRomana(i.categoria)}` : null,
                  i.espacos != null ? `${i.espacos} esp.` : null,
                  i.defesa ? `Defesa +${i.defesa}` : null, i.elemento,
                ].filter(Boolean).join(' · ')}
              </span>
              <span className="corte">{i.descricao}</span>
            </>
          )}
          onEscolher={(i) => {
            if (i.id === 'componentes-ritualisticos-de-elemento') {
              // Este item serve para os 4 elementos — pergunta qual antes de o
              // meter no inventário, em vez de ficar com "(Elemento)" no nome.
              setAEscolher(false);
              setAEscolherElementoComponente(i);
            } else {
              adicionar({
                nome: i.nome,
                categoria: categoriaRomana(i.categoria) ?? '',
                espacos: i.espacos ?? 1,
                cargaBonus: i.cargaBonus ?? 0,
                descricao: i.descricao || '',
                manual: false
              });
              setAviso(null);
              setAEscolher(false);
            }
          }}
          onFechar={() => setAEscolher(false)}
        />
      )}

      {aEscolherElementoComponente && (
        <div className="modal-fundo" style={{ zIndex: 100 }} onClick={(e) => e.target === e.currentTarget && setAEscolherElementoComponente(null)}>
          <div className="modal" style={{ maxWidth: 440, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>De que elemento são os Componentes?</h3>
              <button className="fechar" onClick={() => setAEscolherElementoComponente(null)}>×</button>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: 14.5, marginBottom: 24 }}>
                Componentes ritualísticos são específicos de um elemento (Sangue, Morte, Conhecimento ou Energia).
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {ELEMENTOS_MONSTRUOSO.map((el) => (
                  <button
                    key={el} className="btn ghost"
                    style={{ borderColor: COR_ELEMENTO[el], color: COR_ELEMENTO[el], padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    onClick={() => {
                      const i = aEscolherElementoComponente;
                      adicionar({
                        nome: `Componentes Ritualísticos de ${el}`,
                        categoria: categoriaRomana(i.categoria) ?? '',
                        espacos: i.espacos ?? 1,
                        cargaBonus: i.cargaBonus ?? 0,
                        descricao: i.descricao || '',
                        manual: false,
                      });
                      setAviso(null);
                      setAEscolherElementoComponente(null);
                    }}
                  >
                    <img src={`/img/sigilo-${el.toLowerCase()}.png`} alt={el} style={{ width: 46, height: 46, objectFit: 'contain', mixBlendMode: 'screen', marginBottom: 8 }} />
                    <strong style={{ fontSize: 15 }}>{el.toUpperCase()}</strong>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {aviso && <div className="aviso"><strong>Arma:</strong> {aviso}</div>}

      {lista.length === 0 ? (
        <div className="painel-vazio">Inventário vazio</div>
      ) : (
        <div className="lista-blocos">
          <div className="armas-carregadas" style={{ marginTop: 10 }}>
            <div className="rotulo-lista">Itens ({carga.dosItens} espaços)</div>
            <ul>
              {lista.map((it, i) => {
                const ehManual = it.manual === true;
                const ehUltimo = i === lista.length - 1;
                return (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '12px 14px', borderBottom: ehUltimo ? 'none' : '1px solid var(--linha)', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 150 }}>
                      <span className="nome" style={{ fontSize: '18px', fontWeight: 'bold' }}>{it.nome || 'Sem nome'}</span>
                      <span className="estado" style={{ color: 'var(--txt-dim)', fontSize: '14px' }}>CAT. {it.categoria || '0'}</span>
                      <span className="esp" style={{ color: 'var(--txt-dim)', fontSize: '14px' }}>{Number(it.espacos) || 0} esp.</span>
                    </div>
                    {it.descricao && (
                      <div style={{ width: '100%' }}>
                        <TextoExpandivel texto={it.descricao} />
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
                      <button className="btn ghost sm" onClick={() => setAEditarItem({ indice: i, item: it })}>Editar</button>
                      <button className="btn danger sm" onClick={() => remover(i)}>Remover</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------- DESCRIÇÃO

export function AbaDescricao({ personagem, setPersonagem }) {
  const d = personagem.descricao || {};
  const set = (campo, valor) => setPersonagem({ ...personagem, descricao: { ...d, [campo]: valor } });
  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <EditorTags
          tags={personagem.tags || []}
          onChange={(novasTags) => setPersonagem({ ...personagem, tags: novasTags })}
        />
      </div>
      <div className="campo"><label>Aparência</label><textarea value={d.aparencia || ''} onChange={(e) => set('aparencia', e.target.value)} /></div>
      <div className="campo"><label>Personalidade</label><textarea value={d.personalidade || ''} onChange={(e) => set('personalidade', e.target.value)} /></div>
      <div className="campo"><label>Histórico</label><textarea value={d.historico || ''} onChange={(e) => set('historico', e.target.value)} /></div>
      <div className="campo"><label>Objetivo</label><textarea value={d.objetivo || ''} onChange={(e) => set('objetivo', e.target.value)} /></div>
      <div className="campo"><label>Anotações</label><textarea value={personagem.anotacoes || ''} onChange={(e) => setPersonagem({ ...personagem, anotacoes: e.target.value })} /></div>
    </div>
  );
}