import assert from 'node:assert/strict';
import { personagemVazio, ajustarRecursos } from '../src/engine/character.js';
import { calcMaximos, calcPericias, calcDeslocamento, calcDefesa, calcDefesas, nexEfetivo } from '../src/engine/calc.js';
import { estatisticasArma } from '../src/engine/armas.js';
import { rolarDano } from '../src/engine/dados.js';
import {
  classeMonstruosa, patamarAtual, efetivamenteAtivo, tudoPermanente, atributosEfetivos,
  efeitosDiarios, ativarHoje, desativarHoje, escolherElemento, limiteDrenagem,
  ataquesNaturaisAtivos, rituaisAtivos, escolhasNecessarias,
  escolherRitual, escolherPericiasConhecimento, resistenciaTextoAtual, consequenciasAtivas,
  resumoPorPatamar, temComponentesDoElemento, periciasTreinadasAtivas,
  tatuagemAlargada, temTatuagemRitualistica, reducaoTatuagemRitualistica,
  bonusConcentracaoTatuagem, podeReagirTatuagem, poderesAtivos,
  podeSerMarcadoNaPele, podeServirSangue, servirSangueArmado, servirSangue, armarServirSangue,
  estadoReacaoTatuagem, condicaoReacaoTatuagem,
} from '../src/engine/monstruoso.js';
import { detalheDtRitual } from '../src/engine/calc.js';
import { podeFicarAtivo, dtConcentracao } from '../src/engine/rituais.js';
import {
  pvTempImediatoMorteAtual, deslocamentoEnergiaExtraAtual,
  quantidadePericiasLivresConhecimento, TEXTOS_POR_PATAMAR,
} from '../src/data/monstruoso.js';

let passou = 0;
function teste(nome, fn) {
  try { fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.stack); process.exitCode = 1; }
}

function combatenteMonstruoso(nex, elemento) {
  const p = personagemVazio();
  p.classeId = 'combatente';
  p.trilhaId = 'monstruoso';
  p.nex = nex;
  if (elemento) Object.assign(p, escolherElemento(elemento).patch);
  return p;
}

function especialistaMonstruoso(nex, elemento) {
  const p = personagemVazio();
  p.classeId = 'especialista';
  p.trilhaId = 'monstruoso-especialista';
  p.nex = nex;
  if (elemento) Object.assign(p, escolherElemento(elemento).patch);
  return p;
}

function ocultistaMonstruoso(nex, elemento) {
  const p = personagemVazio();
  p.classeId = 'ocultista';
  p.trilhaId = 'monstruoso-ocultista';
  p.nex = nex;
  if (elemento) Object.assign(p, escolherElemento(elemento).patch);
  return p;
}

/**
 * Ativa a etapa de hoje sem exigir rolagens (dá ao Especialista/Ocultista o
 * componente do elemento CERTO — não há componente genérico que sirva para
 * qualquer elemento, ver `temComponentesDoElemento`).
 */
function ativar(p) {
  if (p.classeId !== 'combatente') p.inventario = [{ nome: `Componentes Ritualísticos de ${p.monstruosoElemento}`, quantidade: 99 }];
  const r = ativarHoje(p, nexEfetivo(p), {});
  assert.ok(!r.erro, r.erro);
  Object.assign(p, r.patch);
  return p;
}

// ------------------------------------------------------------------
// Regra-mãe: tudo desaparece sem a etapa ativa, exceto Presença e o
// "tudo permanente" do Combatente aos 99%.
// ------------------------------------------------------------------

teste('classeMonstruosa/patamarAtual continuam a funcionar como antes', () => {
  const p = combatenteMonstruoso(42, 'Sangue');
  assert.equal(classeMonstruosa(p), 'combatente');
  assert.equal(patamarAtual(42), 40);
  assert.equal(patamarAtual(9), 0);
  assert.equal(patamarAtual(99), 99);
});

teste('sem ativar a etapa, nada está em efeito (Combatente, abaixo de 99%)', () => {
  const p = combatenteMonstruoso(65, 'Sangue');
  assert.equal(efetivamenteAtivo(p, 65), false);
  const ef = efeitosDiarios(p, 65);
  assert.deepEqual(ef.dadosPericia, {});
  assert.equal(ataquesNaturaisAtivos(p, 65).length, 0);
  const a = atributosEfetivos(p, 65);
  assert.equal(a.for, 1); // atributo base da personagemVazio()
});

teste('ao ativar, os efeitos aparecem; ao desativar, desaparecem', () => {
  let p = combatenteMonstruoso(10, 'Sangue');
  ativar(p);
  assert.equal(efetivamenteAtivo(p, 10), true);
  let ef = efeitosDiarios(p, 10);
  assert.deepEqual(ef.dadosPericia, { ciencias: -1, intuicao: -1 });

  Object.assign(p, desativarHoje().patch);
  assert.equal(efetivamenteAtivo(p, 10), false);
  ef = efeitosDiarios(p, 10);
  assert.deepEqual(ef.dadosPericia, {});
});

teste('Combatente Sangue: penalidade -1O aos 10%, -2O a partir dos 40% (não sobe mais)', () => {
  let p = combatenteMonstruoso(40, 'Sangue');
  ativar(p);
  assert.deepEqual(efeitosDiarios(p, 40).dadosPericia, { ciencias: -2, intuicao: -2 });
  p.nex = 99;
  assert.deepEqual(efeitosDiarios(p, 99).dadosPericia, { ciencias: -2, intuicao: -2 }); // não sobe mais
});

teste('Combatente Morte: PE por Vigor desde os 40%, +Ø em Intimidação e +1 turno de "morrendo"', () => {
  let p = combatenteMonstruoso(10, 'Morte');
  ativar(p);
  let ef = efeitosDiarios(p, 10);
  assert.equal(ef.peAtributo, null); // ainda não chegou aos 40%
  assert.deepEqual(ef.dadosPericia, { diplomacia: -1, enganacao: -1 }); // só a penalidade de 10%, sem Intimidação ainda

  p.nex = 40;
  ativar(p);
  ef = efeitosDiarios(p, 40);
  assert.equal(ef.peAtributo, 'vig');
  assert.equal(ef.dadosPericia.intimidacao, 1); // +Ø em Intimidação
  assert.equal(ef.turnosMorrendoExtra, 1);
});

teste('Combatente Energia NUNCA troca Presença por Agilidade nos PE (não está no livro)', () => {
  let p = combatenteMonstruoso(99, 'Energia');
  ativar(p);
  assert.equal(efeitosDiarios(p, 99).peAtributo, null);
});

teste('Combatente Conhecimento: soma Intelecto à Defesa desde os 10%; Enganação passa a usar Intelecto desde os 40%', () => {
  let p = combatenteMonstruoso(10, 'Conhecimento');
  p.atributos.int = 4;
  const antes = calcDefesa(p);
  ativar(p);
  assert.equal(calcDefesa(p), antes + 4);

  let per = calcPericias(p).find((x) => x.id === 'enganacao');
  assert.equal(per.attr, 'pre'); // ainda não chegou aos 40%

  p.nex = 40;
  ativar(p);
  per = calcPericias(p).find((x) => x.id === 'enganacao');
  assert.equal(per.attr, 'int');
  assert.equal(per.attrTrocado, true);
});

teste('Combatente Energia: +6m de deslocamento é só do Especialista, não do Combatente', () => {
  let p = combatenteMonstruoso(10, 'Energia');
  ativar(p);
  assert.equal(calcDeslocamento(p), 9);
});

teste('Combatente não consome Componentes Ritualísticos, e não recupera PV/PE ao ativar (isso é só Especialista/Ocultista)', () => {
  const p = combatenteMonstruoso(10, 'Sangue');
  const r = ativarHoje(p, 10, {});
  assert.ok(!r.erro);
  assert.equal(r.patch.inventario, undefined);
  assert.equal(r.patch.pvAtual, undefined);
  assert.equal(r.patch.peAtual, undefined);
});

// ------------------------------------------------------------------
// Perda permanente de Presença — a ÚNICA coisa que não é diária. Não é
// simétrica: o Combatente só perde -1 aos 65% em 3 dos 4 elementos; Morte é
// a exceção, com uma segunda perda aos 99% (as outras classes perdem -1
// aos 65% E -1 aos 99%, sempre, nos 4 elementos).
// ------------------------------------------------------------------

teste('Presença perde -1 na 1ª ativação aos 65%, e mais -1 na 1ª ativação aos 99% (não antes) — Especialista/Ocultista', () => {
  let p = especialistaMonstruoso(40, 'Sangue');
  ativar(p);
  assert.equal(p.atributos.pre, 1); // ainda não chegou a 65%

  p.nex = 65;
  ativar(p);
  assert.equal(p.atributos.pre, 0);
  assert.deepEqual(p.monstruosoPresencaPerdida, [65]);

  // Ativar de novo aos 65% não perde outra vez.
  Object.assign(p, desativarHoje().patch);
  ativar(p);
  assert.equal(p.atributos.pre, 0);

  p.nex = 99;
  ativar(p);
  assert.equal(p.atributos.pre, -1);
  assert.deepEqual(p.monstruosoPresencaPerdida, [65, 99]);
});

teste('Combatente: só Morte perde Presença 2 vezes (65% e 99%) — os outros 3 elementos só perdem aos 65%', () => {
  for (const el of ['Sangue', 'Conhecimento', 'Energia']) {
    const p = combatenteMonstruoso(99, el);
    ativar(p);
    assert.equal(p.atributos.pre, 0, el); // só -1, nunca -2
    assert.deepEqual(p.monstruosoPresencaPerdida, [65], el);
  }
  const morte = combatenteMonstruoso(99, 'Morte');
  ativar(morte);
  assert.equal(morte.atributos.pre, -1); // -2 no total (Morte tem a segunda perda)
  assert.deepEqual(morte.monstruosoPresencaPerdida, [65, 99]);
});

teste('perda de Presença não reverte ao desativar', () => {
  let p = especialistaMonstruoso(65, 'Sangue');
  ativar(p);
  assert.equal(p.atributos.pre, 0);
  Object.assign(p, desativarHoje().patch);
  assert.equal(p.atributos.pre, 0); // continua perdida
  assert.equal(efetivamenteAtivo(p, 65), false); // mas o resto desligou
});

teste('perda de Presença dos 65% é a mesma para as 3 classes e os 4 elementos', () => {
  for (const el of ['Sangue', 'Morte', 'Conhecimento', 'Energia']) {
    for (const fabrica of [combatenteMonstruoso, especialistaMonstruoso, ocultistaMonstruoso]) {
      const p = fabrica(65, el);
      ativar(p);
      assert.equal(p.atributos.pre, 0, `${fabrica.name} ${el}`);
    }
  }
});

// ------------------------------------------------------------------
// Combatente 99%: tudo fica permanente.
// ------------------------------------------------------------------

teste('Combatente aos 99%: tudo fica sempre ligado, mesmo sem ativar a etapa hoje', () => {
  const p = combatenteMonstruoso(99, 'Sangue');
  // Nunca chamou ativarHoje — mas já está no patamar 99%.
  assert.equal(tudoPermanente(p, 99), true);
  assert.equal(efetivamenteAtivo(p, 99), true);
  const ef = efeitosDiarios(p, 99);
  assert.deepEqual(ef.dadosPericia, { ciencias: -2, intuicao: -2 });
  assert.equal(ataquesNaturaisAtivos(p, 99).length, 1); // Mordida continua lá
});

teste('Especialista/Ocultista NÃO têm "tudo permanente" aos 99% — continua diário', () => {
  assert.equal(tudoPermanente(especialistaMonstruoso(99, 'Sangue'), 99), false);
  assert.equal(tudoPermanente(ocultistaMonstruoso(99, 'Sangue'), 99), false);
  const p = especialistaMonstruoso(99, 'Sangue');
  assert.equal(efetivamenteAtivo(p, 99), false);
  assert.deepEqual(efeitosDiarios(p, 99).dadosPericia, {});
});

// ------------------------------------------------------------------
// Atributos efetivos (bónus/penalidades da trilha, ao vivo).
// ------------------------------------------------------------------

teste('atributosEfetivos soma os deltas ativos e ignora Presença (essa já é permanente)', () => {
  let p = especialistaMonstruoso(99, 'Sangue'); // 65%: +1 For, 99%: +1 For => +2 no total quando ativo
  assert.equal(atributosEfetivos(p, 99).for, 1); // inativo: sem bónus
  ativar(p);
  assert.equal(atributosEfetivos(p, 99).for, 3); // 1 base + 2 da trilha
});

teste('a drenagem de "Ser Testado" reduz o atributo drenado só enquanto ativo, e reverte ao desativar', () => {
  let p = especialistaMonstruoso(65, 'Sangue');
  p.atributos.int = 4;
  ativar(p);
  p.monstruosoDrenagem = 2;
  assert.equal(atributosEfetivos(p, 65).int, 2); // 4 - 2 drenados
  Object.assign(p, desativarHoje().patch);
  assert.equal(p.monstruosoDrenagem, 0); // a escolha também volta a 0
  assert.equal(atributosEfetivos(p, 65).int, 4);
});

teste('estatisticasArma usa o atributo efetivo (For/Agi já com bónus da trilha) no dano', () => {
  let p = especialistaMonstruoso(99, 'Sangue');
  p.atributos.for = 2;
  ativar(p);
  const arma = { nome: 'Faca', pericia: 'luta', dano: '1d6', critico: 'x2', atributoDano: 'for', danoExtra: [], modificacoes: [] };
  const e = estatisticasArma(p, arma);
  assert.equal(e.bonusDano, 2 + 2); // 2 base + 2 da trilha (65%+99%)
});

// ------------------------------------------------------------------
// Drenagem de "Ser Testado" (Especialista, 40%+): base + escala por ponto,
// FÓRMULA PRÓPRIA de cada elemento — verbatim do livro (p.82-83).
// ------------------------------------------------------------------

teste('drenagem Sangue: base 1d6/RD2, cada ponto soma +1d6 dano e +2 RD; passa a d8 aos 65%+', () => {
  let p = especialistaMonstruoso(40, 'Sangue');
  ativar(p);
  let ef = efeitosDiarios(p, 40);
  assert.deepEqual(ef.danoExtra, ['1d6']); // 0 pontos: só a base
  assert.equal(ef.resistenciaDano, 2);

  p.monstruosoDrenagem = 3;
  ef = efeitosDiarios(p, 40);
  assert.deepEqual(ef.danoExtra, ['4d6']); // base(1) + 3
  assert.equal(ef.resistenciaDano, 8); // 2 + 3*2

  p.nex = 65;
  ef = efeitosDiarios(p, 65);
  assert.deepEqual(ef.danoExtra, ['4d8']); // mesmo total de dados, mas em d8
});

teste('estatisticasArma marca o dano extra da trilha como "elemental" (para a interface colorir à parte); o dano da arma/mods fica normal', () => {
  let p = especialistaMonstruoso(40, 'Sangue');
  ativar(p);
  const arma = { nome: 'Katana', pericia: 'luta', dano: '1d10', critico: '19/x2', atributoDano: 'for', danoExtra: ['1d4'], modificacoes: [] };
  const e = estatisticasArma(p, arma);
  assert.equal(e.extras.length, 2);
  assert.deepEqual(e.extras[0], '1d4'); // dano próprio da arma, string simples, não elemental
  assert.deepEqual(e.extras[1], { expr: '1d6', elemental: true }); // dano da drenagem (base, 0 pontos)
});

teste('rolarDano soma o extra elemental ao total normalmente, mas devolve `elemental: true` nessa entrada para colorir na interface', () => {
  const r = rolarDano({ nome: 'Katana — dano', dano: '1d10', extras: ['1d4', { expr: '1d6', elemental: true }] });
  assert.equal(r.extras.length, 2);
  assert.equal(r.extras[0].elemental, false);
  assert.equal(r.extras[1].elemental, true);
  assert.equal(r.extras[1].expr, '1d6');
  assert.ok(Number.isInteger(r.extras[1].soma));
  // total = dado da arma + os dois extras (todos contam para o mesmo número final)
  const somaEsperada = r.rolagens[0] + r.extras[0].soma + r.extras[1].soma;
  assert.equal(r.total, somaEsperada);
});

teste('drenagem Morte: base +1 turno / 2d8 PV temp, cada ponto soma +1 turno e +2d8', () => {
  let p = especialistaMonstruoso(40, 'Morte');
  ativar(p);
  let ef = efeitosDiarios(p, 40);
  assert.equal(ef.turnosMorrendoExtra, 1);
  assert.deepEqual(ef.pvTempCena, { dados: 2, faces: 8 });

  p.monstruosoDrenagem = 2;
  ef = efeitosDiarios(p, 40);
  assert.equal(ef.turnosMorrendoExtra, 3); // 1 + 2
  assert.deepEqual(ef.pvTempCena, { dados: 6, faces: 8 }); // 2*(1+2)
});

teste('drenagem Conhecimento: bónus genérico em testes de Intelecto (base 1d6 + 1d6/ponto)', () => {
  let p = especialistaMonstruoso(40, 'Conhecimento');
  ativar(p);
  let ef = efeitosDiarios(p, 40);
  assert.deepEqual(ef.testeBonusDadoGenerico, { faces: 6, quantidade: 1, descricao: 'em testes baseados em Intelecto' });
  p.monstruosoDrenagem = 4;
  ef = efeitosDiarios(p, 40);
  assert.equal(ef.testeBonusDadoGenerico.quantidade, 5);
});

teste('drenagem Energia: base +1d6 ataque/+2 Defesa, cada ponto soma +1d6/+2', () => {
  let p = especialistaMonstruoso(40, 'Energia');
  ativar(p);
  let ef = efeitosDiarios(p, 40);
  assert.equal(ef.defesaExtra, 2);
  assert.deepEqual(ef.ataqueBonusDados, [{ faces: 6, quantidade: 1, corpoACorpoApenas: false }]);
  p.monstruosoDrenagem = 3;
  ef = efeitosDiarios(p, 40);
  assert.equal(ef.defesaExtra, 8); // 2 + 3*2
  assert.deepEqual(ef.ataqueBonusDados, [{ faces: 6, quantidade: 4, corpoACorpoApenas: false }]);
});

// ------------------------------------------------------------------
// "+1d8 em testes de ataque" (Especialista Sangue 65%+) — dado FIXO somado
// ao total do teste de ataque, não à pool de d20. Tem de chegar mesmo à
// rolagem, via estatisticasArma -> rolarAtaqueCompleto.
// ------------------------------------------------------------------

teste('Especialista Sangue 65%+: +1d8 em testes de ataques corpo a corpo (não em Pontaria)', () => {
  let p = especialistaMonstruoso(65, 'Sangue');
  ativar(p);
  const faca = { nome: 'Faca', pericia: 'luta', dano: '1d6', critico: 'x2', atributoDano: 'for', danoExtra: [], modificacoes: [] };
  const pistola = { nome: 'Pistola', pericia: 'pontaria', dano: '2d6', critico: 'x2', atributoDano: '', danoExtra: [], modificacoes: [] };
  assert.deepEqual(estatisticasArma(p, faca).dadosExtraAtaque, ['1d8']);
  assert.deepEqual(estatisticasArma(p, pistola).dadosExtraAtaque, []);
});

teste('Especialista Sangue 65%+: o +1d8 aparece mesmo antes dos 40%+ de drenagem (é sempre ativo, não depende de pontos drenados)', () => {
  let p = especialistaMonstruoso(65, 'Sangue');
  ativar(p);
  p.monstruosoDrenagem = 0;
  const faca = { nome: 'Faca', pericia: 'luta', dano: '1d6', critico: 'x2', atributoDano: 'for', danoExtra: [], modificacoes: [] };
  assert.deepEqual(estatisticasArma(p, faca).dadosExtraAtaque, ['1d8']);
});

// ------------------------------------------------------------------
// Grande/Enorme (Especialista Sangue): penalidade real de Furtividade.
// ------------------------------------------------------------------

teste('Especialista Sangue 10%: Grande dá -2 em Furtividade; passa a -5 (Enorme) aos 99%', () => {
  let p = especialistaMonstruoso(10, 'Sangue');
  ativar(p);
  assert.equal(efeitosDiarios(p, 10).flatPericia.furtividade, -2);
  p.nex = 99;
  ativar(p);
  assert.equal(efeitosDiarios(p, 99).flatPericia.furtividade, -5);
});

// ------------------------------------------------------------------
// Armas naturais e rituais concedidos: aparecem/desaparecem com a etapa.
// ------------------------------------------------------------------

teste('arma natural (Mordida) só aparece com a etapa ativa e some ao desativar', () => {
  let p = combatenteMonstruoso(65, 'Sangue');
  assert.equal(ataquesNaturaisAtivos(p, 65).length, 0);
  ativar(p);
  const naturais = ataquesNaturaisAtivos(p, 65);
  assert.equal(naturais.length, 1);
  assert.equal(naturais[0].nome, 'Mordida (Monstruoso)');
  assert.equal(naturais[0]._monstruoso, true);
  Object.assign(p, desativarHoje().patch);
  assert.equal(ataquesNaturaisAtivos(p, 65).length, 0);
});

teste('ritual fixo (Especialista Sangue 99%: Vínculo de Sangue) só aparece com a etapa ativa', () => {
  // Uso o Especialista aqui (não o Combatente) porque o Combatente aos 99%
  // já tem "tudo permanente" — ver o teste próprio para esse caso.
  let p = especialistaMonstruoso(99, 'Sangue');
  assert.equal(rituaisAtivos(p, 99).length, 0);
  ativar(p);
  const rituais = rituaisAtivos(p, 99);
  assert.ok(rituais.some((r) => r.nome === 'Vínculo de Sangue'));
});

teste('Combatente Sangue 99%: como tudo é permanente aqui, o ritual já aparece sem chamar ativarHoje', () => {
  const p = combatenteMonstruoso(99, 'Sangue');
  const rituais = rituaisAtivos(p, 99);
  assert.ok(rituais.some((r) => r.nome === 'Forma Monstruosa'));
});

teste('ritual não catalogado (ex.: Fim Inevitável) não inventa círculo/elemento', () => {
  let p = combatenteMonstruoso(99, 'Morte');
  ativar(p);
  const r = rituaisAtivos(p, 99).find((x) => x.nome === 'Fim Inevitável');
  assert.ok(r);
  assert.equal(r.circulo, '');
});

teste('ritual à escolha só aparece depois de a escolha ser guardada', () => {
  let p = ocultistaMonstruoso(99, 'Sangue');
  const escolhas = escolhasNecessarias(p, 99).filter((g) => g.tipo === 'ritual-escolha');
  assert.equal(escolhas.length, 2); // um de Sangue, um de Medo
  ativar(p);
  assert.equal(rituaisAtivos(p, 99).length, 0); // ainda não escolheu nenhum

  const ganhoSangue = escolhas.find((g) => g.elemento === 'sangue');
  Object.assign(p, escolherRitual(p, ganhoSangue.id, 'vinculo-de-sangue').patch);
  // Se o id não existir no catálogo local, cai no mesmo mecanismo de "não inventa";
  // testamos apenas que a escolha guardada passa a aparecer.
  const ativos = rituaisAtivos(p, 99);
  assert.equal(ativos.length, 1);
});

teste('escolhas permanentes não desaparecem ao desativar (só o efeito é diário)', () => {
  let p = ocultistaMonstruoso(99, 'Sangue');
  const ganhoSangue = escolhasNecessarias(p, 99).find((g) => g.tipo === 'ritual-escolha' && g.elemento === 'sangue');
  Object.assign(p, escolherRitual(p, ganhoSangue.id, 'vinculo-de-sangue').patch);
  assert.equal(p.monstruosoEscolhas.rituais[ganhoSangue.id], 'vinculo-de-sangue');
  Object.assign(p, desativarHoje().patch);
  assert.equal(p.monstruosoEscolhas.rituais[ganhoSangue.id], 'vinculo-de-sangue'); // a escolha em si mantém-se
});

// ------------------------------------------------------------------
// Perícias treinadas pela trilha (Ocultismo, perícias livres).
// ------------------------------------------------------------------

teste('Ocultismo fica treinado (ou +2 se já treinada) só enquanto ativo', () => {
  let p = combatenteMonstruoso(10, 'Sangue');
  let per = calcPericias(p).find((x) => x.id === 'ocultismo');
  assert.equal(per.treino, 0);
  ativar(p);
  per = calcPericias(p).find((x) => x.id === 'ocultismo');
  assert.equal(per.grau, 'treinado');
  Object.assign(p, desativarHoje().patch);
  per = calcPericias(p).find((x) => x.id === 'ocultismo');
  assert.equal(per.grau, 'destreinado');
});

teste('Ocultista: +2 fixo em Ocultismo mesmo já treinado (não troca de grau), sem duplicar o bónus', () => {
  let p = ocultistaMonstruoso(10, 'Sangue');
  p.pericias.ocultismo.grau = 'treinado';
  ativar(p);
  const per = calcPericias(p).find((x) => x.id === 'ocultismo');
  assert.equal(per.grau, 'treinado');
  assert.equal(per.monstruoso, 2); // só o +2, não soma outra vez o treino
  assert.equal(per.bonus, 5 + 2); // treino(5) + monstruoso(2), sem "outros" manuais
});

teste('Ocultista: SEM treino prévio a trilha força o treino (5) e não soma +2 por cima (nunca 9) — igual às outras 2 classes', () => {
  let p = ocultistaMonstruoso(10, 'Sangue');
  assert.equal(p.pericias?.ocultismo?.grau ?? 'destreinado', 'destreinado');
  ativar(p);
  const per = calcPericias(p).find((x) => x.id === 'ocultismo');
  assert.equal(per.grau, 'treinado');
  assert.equal(per.monstruoso, 0); // forçou o treino, não soma o +2 por cima
  assert.equal(per.bonus, 5); // nunca 7, nunca 9 — só o treino
});

teste('Ocultismo: as 3 classes usam a mesma regra condicional (ou força treino=5, ou +2 se já treinado=7, nunca os dois)', () => {
  for (const fabrica of [combatenteMonstruoso, especialistaMonstruoso, ocultistaMonstruoso]) {
    let destreinado = fabrica(10, 'Sangue');
    ativar(destreinado);
    assert.equal(calcPericias(destreinado).find((x) => x.id === 'ocultismo').bonus, 5);

    let treinado = fabrica(10, 'Sangue');
    treinado.pericias.ocultismo.grau = 'treinado';
    ativar(treinado);
    assert.equal(calcPericias(treinado).find((x) => x.id === 'ocultismo').bonus, 7);
  }
});

teste('Especialista Conhecimento 10%: as 2 perícias escolhidas só ficam treinadas com a escolha guardada e ativo', () => {
  let p = especialistaMonstruoso(10, 'Conhecimento');
  const g = escolhasNecessarias(p, 10).find((x) => x.tipo === 'pericias-livres');
  assert.ok(g);
  ativar(p);
  let per = calcPericias(p).find((x) => x.id === 'investigacao');
  assert.equal(per.grau, 'destreinado'); // ainda não escolheu

  Object.assign(p, escolherPericiasConhecimento(p, ['investigacao', 'percepcao']).patch);
  per = calcPericias(p).find((x) => x.id === 'investigacao');
  assert.equal(per.grau, 'treinado');
  assert.equal(calcPericias(p).find((x) => x.id === 'percepcao').grau, 'treinado');
});

// ------------------------------------------------------------------
// "Soma o atributo em testes desse atributo" — SÓ o Especialista. O
// Ocultista NÃO tem esta frase no livro (só troca o atributo de PE/DT e
// ganha +1 ponto de atributo) — é um erro fácil de assumir por analogia
// com o Especialista, por isso fica testado explicitamente.
// ------------------------------------------------------------------

teste('"soma o atributo em testes desse atributo": só o Especialista tem isto, o Ocultista NÃO', () => {
  let esp = especialistaMonstruoso(10, 'Sangue');
  esp.atributos.for = 3;
  ativar(esp); // aos 10% ainda não há +For da trilha (só aos 65%/99%) — For efetiva = 3
  const perEsp = calcPericias(esp).find((x) => x.id === 'atletismo'); // Atletismo usa Força
  assert.equal(perEsp.monstruoso, 3); // soma a Força efetiva (3) a um teste que já é de Força
});

teste('Ocultista Sangue 10%: +1 Força e PE por Força, mas SEM somar Força em testes de Força', () => {
  let p = ocultistaMonstruoso(10, 'Sangue');
  p.atributos.for = 3;
  ativar(p);
  const ef = efeitosDiarios(p, 10);
  assert.equal(ef.peAtributo, 'for');
  // A penalidade de 10% (Diplomacia/Enganação/Intuição) continua lá — só não
  // há nenhuma entrada de Atletismo/Luta (perícias de Força), ao contrário
  // do Especialista.
  assert.deepEqual(Object.keys(ef.flatPericia).sort(), ['diplomacia', 'enganacao', 'intuicao']);
  assert.equal(ef.flatPericia.atletismo, undefined);
  assert.equal(atributosEfetivos(p, 10).for, 4); // 3 base + 1 da trilha
});

// ------------------------------------------------------------------
// Especialista/Ocultista: penalidade sempre diária (nunca "sempre ligada").
// ------------------------------------------------------------------

teste('Especialista/Ocultista: penalidade em Diplomacia/Enganação/Intuição também é só diária', () => {
  for (const fabrica of [especialistaMonstruoso, ocultistaMonstruoso]) {
    const p = fabrica(40, 'Sangue');
    assert.deepEqual(efeitosDiarios(p, 40).flatPericia, {});
    ativar(p);
    const ef = efeitosDiarios(p, 40);
    assert.equal(ef.flatPericia.diplomacia, -5);
    assert.equal(ef.flatPericia.enganacao, -5);
    assert.equal(ef.flatPericia.intuicao, -5);
  }
});

teste('Especialista/Ocultista 65%+: a penalidade passa a ser em dado (-O), não número', () => {
  const p = especialistaMonstruoso(65, 'Sangue');
  ativar(p);
  const ef = efeitosDiarios(p, 65);
  assert.equal(ef.flatPericia.diplomacia, undefined);
  assert.equal(ef.flatPericia.enganacao, undefined);
  assert.equal(ef.flatPericia.intuicao, undefined);
  assert.equal(ef.dadosPericia.diplomacia, -1);
});

// ------------------------------------------------------------------
// Resumo por patamar — a caixa de informação nova (agrupada, 10%/40%/...).
// ------------------------------------------------------------------

teste('resumoPorPatamar: só mostra patamares desbloqueados, cada um com o título certo', () => {
  let p = especialistaMonstruoso(40, 'Sangue');
  ativar(p);
  const blocos = resumoPorPatamar(p, 40);
  assert.deepEqual(blocos.map((b) => b.patamar), [10, 40]);
  assert.equal(blocos[0].titulo, 'Ser Experimentado');
  assert.equal(blocos[1].titulo, 'Ser Testado');
  // 99% nunca aparece com NEX 40.
  assert.ok(!blocos.some((b) => b.patamar === 99));
});

teste('resumoPorPatamar: inclui a penalidade e o "Grande" no bloco de 10%', () => {
  let p = especialistaMonstruoso(10, 'Sangue');
  ativar(p);
  const bloco10 = resumoPorPatamar(p, 10)[0];
  assert.ok(bloco10.linhas.some((l) => l.includes('Grande')));
  assert.ok(bloco10.linhas.some((l) => l.includes('Diplomacia')));
});

// ------------------------------------------------------------------
// Especialista: PE/PV atual sobe (não só o máximo) ao ativar.
// ------------------------------------------------------------------

teste('ao ativar, o PV/PE ATUAL sobe pela mesma diferença que o máximo (ajustarRecursos)', () => {
  // Isolado da rolagem de recuperação de PV (que é aleatória e já está
  // testada à parte) — construímos o "antes/depois" à mão, só com a
  // mudança de estado que ativarHoje provoca (Vigor efetivo sobe aos 99%
  // do Especialista/Morte, o que sobe o PV máximo).
  let p = especialistaMonstruoso(99, 'Morte');
  p.atributos.vig = 3;
  p.pvAtual = 20;
  const antes = { ...p };
  const depoisPatch = { ...p, monstruosoAtivoHoje: true };
  const maxAntes = calcMaximos(antes).pv;
  const maxDepois = calcMaximos(depoisPatch).pv;
  assert.ok(maxDepois > maxAntes, 'o Vigor efetivo (+2 aos 99%) tem de subir o PV máximo');
  const depois = ajustarRecursos(antes, depoisPatch);
  assert.equal(depois.pvAtual - antes.pvAtual, maxDepois - maxAntes);
});

teste('ao desativar, o PV/PE atual desce de volta (nunca fica negativo)', () => {
  let p = especialistaMonstruoso(99, 'Morte');
  p.atributos.vig = 3;
  const ativo = { ...p, monstruosoAtivoHoje: true, pvAtual: 1 }; // ferido, bem abaixo do máximo
  const inativo = ajustarRecursos(ativo, { ...ativo, monstruosoAtivoHoje: false });
  assert.ok(inativo.pvAtual >= 0);
  assert.ok(inativo.pvAtual < ativo.pvAtual);
});

// ------------------------------------------------------------------
// Consequências narrativas (NEX, não etapa) e ativação/erros.
// ------------------------------------------------------------------

teste('consequências (Perturbado 75%, Sanidade 1 aos 99%) disparam por NEX, não pela etapa', () => {
  assert.equal(consequenciasAtivas(74).length, 0);
  assert.equal(consequenciasAtivas(75).length, 1);
  assert.equal(consequenciasAtivas(99).length, 2);
});

teste('Especialista precisa de Componentes Ritualísticos para ativar', () => {
  const p = especialistaMonstruoso(10, 'Sangue');
  const r = ativarHoje(p, 10, {});
  assert.ok(r.erro);
});

teste('Especialista consome o componente e recupera PV ao ativar', () => {
  const p = especialistaMonstruoso(10, 'Sangue');
  p.inventario = [{ nome: 'Componentes Ritualísticos de Sangue', quantidade: 1 }];
  const r = ativarHoje(p, 10, {});
  assert.ok(!r.erro);
  assert.equal(r.patch.inventario.length, 0);
  assert.ok(r.patch.pvAtual > 0);
});

teste('Componentes de OUTRO elemento não servem — não há componente "genérico" (por pedido explícito: só o elemento certo transforma)', () => {
  const p = especialistaMonstruoso(10, 'Sangue');
  p.inventario = [{ nome: 'Componentes Ritualísticos de Morte', quantidade: 5 }];
  const r = ativarHoje(p, 10, {});
  assert.ok(r.erro);
  assert.match(r.erro, /Componentes Ritualísticos de Sangue/);
  assert.equal(temComponentesDoElemento(p.inventario, 'Sangue'), false);
  assert.equal(temComponentesDoElemento(p.inventario, 'Morte'), true);
});

teste('resistenciaTextoAtual: Combatente sempre (tipos específicos, nota "não soma ao Bloqueio"); Especialista só Sangue 40%+ (RD geral, "já somada ao Bloqueio"); Ocultista nunca', () => {
  let c = combatenteMonstruoso(10, 'Sangue');
  assert.equal(resistenciaTextoAtual(c, 10), null);
  ativar(c);
  assert.match(resistenciaTextoAtual(c, 10), /balístico e Sangue 5/);
  assert.match(resistenciaTextoAtual(c, 10), /não soma ao Bloqueio/);

  let e = especialistaMonstruoso(40, 'Sangue');
  ativar(e);
  // Geral: NÃO menciona "de Sangue" (só o dano extra é de Sangue, a RD cobre qualquer tipo).
  assert.match(resistenciaTextoAtual(e, 40), /Resistência a dano 2 \(geral/);
  assert.doesNotMatch(resistenciaTextoAtual(e, 40), /dano de Sangue/);
  assert.match(resistenciaTextoAtual(e, 40), /já somada ao Bloqueio/);

  let eMorte = especialistaMonstruoso(40, 'Morte');
  ativar(eMorte);
  assert.equal(resistenciaTextoAtual(eMorte, 40), null); // só Sangue tem RD no Especialista

  let o = ocultistaMonstruoso(99, 'Sangue');
  ativar(o);
  assert.equal(resistenciaTextoAtual(o, 99), null); // Ocultista nunca tem RD
});

teste('calcDefesas/Bloqueio: RD geral do Especialista-Sangue soma a sério (fica disponível mesmo sem treino em Fortitude); a do Combatente (tipos específicos) NÃO soma, fica só em texto', () => {
  let e = especialistaMonstruoso(40, 'Sangue');
  ativar(e);
  const antes = calcDefesas(e).bloqueio.auto;
  e.monstruosoDrenagem = 1; // base RD2 + 1 ponto drenado = RD4
  const d = calcDefesas(e);
  assert.equal(d.bloqueio.trilha, 4);
  assert.equal(d.bloqueio.auto, antes + 4 - 2); // já tinha a base (RD2) somada antes de drenar
  assert.equal(d.bloqueio.disponivel, true); // disponível mesmo sem Fortitude treinada
  assert.match(d.bloqueio.trilhaTexto, /já somada ao Bloqueio/);

  let c = combatenteMonstruoso(10, 'Sangue');
  ativar(c);
  const dc = calcDefesas(c);
  assert.equal(dc.bloqueio.trilha, 0); // RD do Combatente não soma (só cobre tipos específicos)
  assert.match(dc.bloqueio.trilhaTexto, /não soma ao Bloqueio/);
});

teste('limiteDrenagem usa o atributo drenado (não o do elemento)', () => {
  const p = especialistaMonstruoso(40, 'Sangue');
  p.atributos.int = 3;
  assert.equal(limiteDrenagem(p, 40), 3);
});

// ------------------------------------------------------------------
// Ronda de correções: Especialista Morte (PV temp. imediato aos 10%/99%,
// texto dos 65%), upgrades de "Ser Apavorante" (99%: Morte/Conhecimento/
// Energia), bónus genérico da drenagem de Conhecimento aplicado a testes
// reais de Intelecto, e o bloqueio das perícias livres depois de escolhidas.
// ------------------------------------------------------------------

teste('Especialista Morte 10%: ativar a etapa rola +2d6 PV temporário IMEDIATO (distinto do +2d8/cena da drenagem 40%+)', () => {
  const p = especialistaMonstruoso(10, 'Morte');
  ativar(p);
  assert.ok(p.pvTemp >= 2 && p.pvTemp <= 12, `pvTemp fora do intervalo 2d6: ${p.pvTemp}`);
});

teste('Especialista Morte 99%: o PV temporário imediato sobe de 2d6 para 4d6 ("Ser Apavorante" substitui "Ser Experimentado")', () => {
  assert.deepEqual(pvTempImediatoMorteAtual(10), { dados: 2, faces: 6 });
  assert.deepEqual(pvTempImediatoMorteAtual(40), { dados: 2, faces: 6 }); // não muda aos 40%/65%, só aos 99%
  assert.deepEqual(pvTempImediatoMorteAtual(99), { dados: 4, faces: 6 });

  const p = especialistaMonstruoso(99, 'Morte');
  ativar(p);
  assert.ok(p.pvTemp >= 4, `esperava pelo menos 4 (mínimo de 4d6), veio ${p.pvTemp}`);
});

teste('Especialista Morte 65%: o texto já não fala em "reviver" a pessoa — é uma visão das memórias dela, não uma ressurreição', () => {
  const texto65 = TEXTOS_POR_PATAMAR.especialista.Morte.find((t) => t.patamar === 65).texto;
  assert.match(texto65, /memórias/i);
  assert.doesNotMatch(texto65, /reviver a última pessoa/i);
});

teste('Especialista Energia: deslocamento extra é +6m desde os 10%, sobe para +12m aos 99% (substitui, não soma)', () => {
  assert.equal(deslocamentoEnergiaExtraAtual('especialista', 10), 6);
  assert.equal(deslocamentoEnergiaExtraAtual('especialista', 65), 6);
  assert.equal(deslocamentoEnergiaExtraAtual('especialista', 99), 12);
  assert.equal(deslocamentoEnergiaExtraAtual('combatente', 99), 0); // só o Especialista tem isto

  const p = especialistaMonstruoso(99, 'Energia');
  ativar(p);
  assert.equal(efeitosDiarios(p, 99).deslocamentoExtra, 12);
});

teste('Especialista Conhecimento: 2 perícias livres desde os 10%, sobe para 3 aos 99%', () => {
  assert.equal(quantidadePericiasLivresConhecimento(10), 2);
  assert.equal(quantidadePericiasLivresConhecimento(65), 2);
  assert.equal(quantidadePericiasLivresConhecimento(99), 3);
});

teste('Especialista Conhecimento 99%: as perícias escolhidas aos 10% sobem de Treinado (+5) para Expert (+15)', () => {
  const p = especialistaMonstruoso(99, 'Conhecimento');
  Object.assign(p, escolherPericiasConhecimento(p, ['medicina', 'investigacao']).patch);
  ativar(p);

  const linhas99 = calcPericias(p);
  const medicina99 = linhas99.find((l) => l.id === 'medicina');
  assert.equal(medicina99.grau, 'expert');
  assert.equal(medicina99.treino, 15);

  // Ao patamar 40 (antes dos 99%), a mesma escolha fica só em Treinado (+5).
  const p40 = especialistaMonstruoso(40, 'Conhecimento');
  Object.assign(p40, escolherPericiasConhecimento(p40, ['medicina', 'investigacao']).patch);
  ativar(p40);
  const medicina40 = calcPericias(p40).find((l) => l.id === 'medicina');
  assert.equal(medicina40.grau, 'treinado');
  assert.equal(medicina40.treino, 5);
});

teste('Especialista Conhecimento 99%: não desce quem já é Veterano/Expert por progressão normal de NEX', () => {
  const p = especialistaMonstruoso(99, 'Conhecimento');
  Object.assign(p, escolherPericiasConhecimento(p, ['medicina', 'investigacao']).patch);
  p.pericias = { medicina: { grau: 'veterano', outros: 0 } };
  ativar(p);
  const medicina = calcPericias(p).find((l) => l.id === 'medicina');
  assert.equal(medicina.treino, 15); // veterano (10) < expert (15) -> ainda sobe
});

teste('periciasTreinadasAtivas: expertForcado só inclui as perícias livres do Especialista-Conhecimento, e só aos 99%', () => {
  const p = especialistaMonstruoso(40, 'Conhecimento');
  Object.assign(p, escolherPericiasConhecimento(p, ['medicina', 'investigacao']).patch);
  ativar(p);
  assert.equal(periciasTreinadasAtivas(p, 40).expertForcado.size, 0);

  const p99 = especialistaMonstruoso(99, 'Conhecimento');
  Object.assign(p99, escolherPericiasConhecimento(p99, ['medicina', 'investigacao']).patch);
  ativar(p99);
  const ef = periciasTreinadasAtivas(p99, 99);
  assert.equal(ef.expertForcado.has('medicina'), true);
  assert.equal(ef.expertForcado.has('investigacao'), true);
  assert.equal(ef.expertForcado.has('ocultismo'), false);
});

teste('Especialista Conhecimento 40%+: o +1d6 "em testes baseados em Intelecto" da drenagem soma-se de facto à rolagem de perícias de Intelecto', () => {
  const p = especialistaMonstruoso(40, 'Conhecimento');
  ativar(p);
  p.monstruosoDrenagem = 1; // base 1d6 + 1 ponto inexistido = 2d6

  const linhas = calcPericias(p);
  const medicina = linhas.find((l) => l.id === 'medicina'); // atr: int
  const luta = linhas.find((l) => l.id === 'luta'); // atr: for — não deve levar o bónus

  assert.deepEqual(medicina.dadosExtra, ['2d6']);
  assert.match(medicina.dadosExtraDescricao, /Intelecto/);
  assert.deepEqual(luta.dadosExtra, []);
});

teste('Especialista Conhecimento: sem a etapa ativa (ou sem drenagem), nenhuma perícia leva dadosExtra', () => {
  const p = especialistaMonstruoso(40, 'Conhecimento'); // nunca ativado
  const linhas = calcPericias(p);
  assert.deepEqual(linhas.find((l) => l.id === 'medicina').dadosExtra, []);
});

teste('Especialista Morte: o PV máximo (fórmula soma Vigor) sobe quando o Vigor efetivo sobe aos 65%/99% — desde que o máximo não esteja travado à mão', () => {
  const semTrilha = especialistaMonstruoso(65, 'Morte');
  const pvSemTrilha = calcMaximos(semTrilha).pv; // etapa nunca ativada -> sem bónus de Vigor

  const comTrilha = especialistaMonstruoso(65, 'Morte');
  ativar(comTrilha); // Vigor efetivo sobe +1 (ver EFEITOS_POR_PATAMAR.especialista.Morte, patamar 65)
  const pvComTrilha = calcMaximos(comTrilha).pv;
  assert.ok(pvComTrilha > pvSemTrilha, `esperava o PV máximo subir com o Vigor da trilha: ${pvSemTrilha} -> ${pvComTrilha}`);

  // Um "pvMaxManual" travado (o cadeado da barra de vida) IGNORA o automático
  // de propósito — é o comportamento já testado para bloqueio/esquiva. Isto
  // confirma que, se o máximo parecer "preso", a causa é esse travamento.
  comTrilha.pvMaxManual = 50;
  assert.equal(calcMaximos(comTrilha).pv, 50);
});

teste('Especialista Conhecimento 65%+: Detecção de Ameaças/Mergulho Mental aparecem como rituais da trilha, marcados "_semTeste" (poder de toque — só custa PE, sem teste de Ocultismo nem círculo)', () => {
  const p = especialistaMonstruoso(65, 'Conhecimento');
  ativar(p);
  const rituais = rituaisAtivos(p, 65);
  const nomes = rituais.map((r) => r.nome);
  assert.ok(nomes.includes('Detecção de Ameaças'));
  assert.ok(nomes.includes('Mergulho Mental'));

  const deteccao = rituais.find((r) => r.nome === 'Detecção de Ameaças');
  assert.equal(deteccao._semTeste, true);
  assert.equal(deteccao._custoFixoPe, 3);
  assert.equal(deteccao.custo, '3 PE');
  assert.equal(deteccao.elemento, ''); // sem elemento -> não exige Componentes Ritualísticos

  // Antes dos 65%, ainda não foram concedidos.
  const p40 = especialistaMonstruoso(40, 'Conhecimento');
  ativar(p40);
  assert.equal(rituaisAtivos(p40, 40).some((r) => r.nome === 'Detecção de Ameaças'), false);
});

// --------------------------------------------------- Ocultista Monstruoso
// DT de ritual pelo atributo do elemento (AS7 p.85), Tatuagem Ritualística
// aos 40% nos 4 elementos (AS7 p.86) e teste de concentração (LB p.120).

const RITUAL_SANGUE = { nome: 'Sangue Fervente', elemento: 'sangue', circulo: 1, custo: 1, alcance: '9m', alvo: '1 pessoa', duracao: 'Cena' };
const RITUAL_MORTE = { nome: 'Toque Necrótico', elemento: 'morte', circulo: 1, custo: 1, alcance: 'Toque', alvo: '1 pessoa', duracao: 'Instantânea' };
const RITUAL_PESSOAL = { nome: 'Ritual Pessoal', elemento: 'medo', circulo: 1, custo: 2, alcance: 'Pessoal', alvo: 'você', duracao: 'Cena' };

teste('Ocultista Monstruoso 10%: a DT de ritual passa a usar o atributo do elemento em vez de Presença', () => {
  const p = ocultistaMonstruoso(10, 'Sangue');
  p.atributos = { ...p.atributos, for: 3, pre: 1 };
  const inativo = detalheDtRitual(p);
  assert.equal(inativo.atributoDt, null, 'sem a escarificação do dia, a DT mantém-se em Presença');
  assert.equal(inativo.presenca, 1);

  ativar(p);
  const ativo = detalheDtRitual(p);
  assert.equal(ativo.atributoDt, 'for');
  assert.equal(ativo.presenca, 4, 'Força 3 + 1 ponto que a trilha dá aos 10%');
  assert.equal(ativo.total, inativo.total + 3);
});

teste('Ocultista Monstruoso 10%: cada elemento traz o seu atributo para a DT', () => {
  for (const [elemento, attr] of [['Sangue', 'for'], ['Morte', 'vig'], ['Conhecimento', 'int'], ['Energia', 'agi']]) {
    const p = ocultistaMonstruoso(10, elemento);
    ativar(p);
    assert.equal(detalheDtRitual(p).atributoDt, attr, elemento);
  }
});

teste('Combatente Monstruoso: a troca de atributo é só dos PE — a DT continua em Presença', () => {
  const p = combatenteMonstruoso(40, 'Sangue');
  ativar(p);
  assert.equal(efeitosDiarios(p, 40).peAtributo, 'for');
  // O texto do Combatente (SaH) só fala em PE; a DT não é mencionada, por
  // isso `linhasGeraisNoPatamar` também não o promete.
  const linha = resumoPorPatamar(p, 40).find((b) => b.patamar === 40).linhas.find((l) => l.includes('Pontos de Esforço'));
  assert.ok(linha && !linha.includes('DT'), linha);
});

teste('Ocultista Monstruoso 40%: recebe o poder Tatuagem Ritualística — nos QUATRO elementos, não só no Sangue', () => {
  for (const elemento of ['Sangue', 'Morte', 'Conhecimento', 'Energia']) {
    const p = ocultistaMonstruoso(40, elemento);
    ativar(p);
    assert.deepEqual(poderesAtivos(p, 40).map((x) => x.nome), ['Tatuagem Ritualística'], elemento);
    assert.equal(tatuagemAlargada(p, 40), true, elemento);
  }
  const p10 = ocultistaMonstruoso(10, 'Sangue');
  ativar(p10);
  assert.deepEqual(poderesAtivos(p10, 10), [], 'aos 10% ainda não há poder nenhum');
});

teste('Tatuagem Ritualística: −1 PE só em rituais marcados na pele a que o poder se aplica', () => {
  const p = ocultistaMonstruoso(40, 'Sangue');
  ativar(p);
  assert.equal(reducaoTatuagemRitualistica(p, 40, RITUAL_SANGUE, true), 1, 'ritual do elemento, marcado');
  assert.equal(reducaoTatuagemRitualistica(p, 40, RITUAL_SANGUE, false), 0, 'não marcado não conta');
  assert.equal(reducaoTatuagemRitualistica(p, 40, RITUAL_MORTE, true), 0, 'elemento diferente do da trilha');
  assert.equal(reducaoTatuagemRitualistica(p, 40, RITUAL_PESSOAL, true), 1, 'regra base: alcance Pessoal com você como alvo');

  const p10 = ocultistaMonstruoso(10, 'Sangue');
  ativar(p10);
  assert.equal(temTatuagemRitualistica(p10, 10), false, 'aos 10% ainda não tem o poder');
  assert.equal(reducaoTatuagemRitualistica(p10, 10, RITUAL_PESSOAL, true), 0);
  p10.habilidades = [{ nome: 'Tatuagem Ritualística' }];
  assert.equal(temTatuagemRitualistica(p10, 10), true, 'poder escolhido à mão pela personagem');
  assert.equal(reducaoTatuagemRitualistica(p10, 10, RITUAL_PESSOAL, true), 1);
  assert.equal(reducaoTatuagemRitualistica(p10, 10, RITUAL_SANGUE, true), 0, 'sem os 40% não alarga a rituais não-pessoais');
});

teste('Tatuagem Ritualística: +5 em testes de concentração com rituais do elemento marcados', () => {
  const p = ocultistaMonstruoso(40, 'Sangue');
  ativar(p);
  assert.equal(bonusConcentracaoTatuagem(p, 40, RITUAL_SANGUE, true), 5);
  assert.equal(bonusConcentracaoTatuagem(p, 40, RITUAL_SANGUE, false), 0);
  assert.equal(bonusConcentracaoTatuagem(p, 40, RITUAL_MORTE, true), 0);

  const pMorte = ocultistaMonstruoso(40, 'Morte');
  ativar(pMorte);
  assert.equal(bonusConcentracaoTatuagem(pMorte, 40, RITUAL_MORTE, true), 5, 'o mesmo +5 existe no elemento Morte');

  const p10 = ocultistaMonstruoso(10, 'Sangue');
  ativar(p10);
  assert.equal(bonusConcentracaoTatuagem(p10, 10, RITUAL_SANGUE, true), 0, 'só a partir dos 40%');
  const pInativo = ocultistaMonstruoso(40, 'Sangue');
  assert.equal(bonusConcentracaoTatuagem(pInativo, 40, RITUAL_SANGUE, true), 0, 'sem a escarificação do dia não há bónus');
});

teste('Tatuagem Ritualística: conjurar como reação, 1x/cena, sob as condições próprias de cada elemento', () => {
  const p = ocultistaMonstruoso(40, 'Sangue');
  ativar(p);
  assert.equal(podeReagirTatuagem(p, 40, RITUAL_SANGUE, true), false, 'sem condição nenhuma');
  p.condicoes = ['machucado'];
  assert.equal(podeReagirTatuagem(p, 40, RITUAL_SANGUE, true), true);
  p.condicoes = ['fraco']; // condição de fadiga
  assert.equal(podeReagirTatuagem(p, 40, RITUAL_SANGUE, true), true);
  p.monstruosoReacaoTatuagemUsada = true;
  assert.equal(podeReagirTatuagem(p, 40, RITUAL_SANGUE, true), false, 'já usada nesta cena');

  const pCon = ocultistaMonstruoso(40, 'Conhecimento');
  ativar(pCon);
  pCon.condicoes = ['apavorado']; // condição de medo
  assert.equal(podeReagirTatuagem(pCon, 40, { elemento: 'conhecimento' }, true), true);
  pCon.condicoes = ['machucado'];
  assert.equal(podeReagirTatuagem(pCon, 40, { elemento: 'conhecimento' }, true), false, 'machucado não é condição mental nem de medo');
});

teste('Concentração: DT 15/20 + custo em PE, ou igual ao dano sofrido (LB p.120)', () => {
  assert.equal(dtConcentracao('ruim', { custoPe: 3 }).dt, 18);
  assert.equal(dtConcentracao('terrivel', { custoPe: 3 }).dt, 23);
  assert.equal(dtConcentracao('ferido', { dano: 7 }).dt, 7);
  assert.equal(dtConcentracao('ferido', { custoPe: 99, dano: 4 }).dt, 4, 'o custo em PE não entra no caso "ferido"');
});

teste('Concentração: só rituais de duração não instantânea podem ficar ativos', () => {
  assert.equal(podeFicarAtivo({ duracao: 'Cena' }), true);
  assert.equal(podeFicarAtivo({ duracao: 'Sustentada' }), true);
  assert.equal(podeFicarAtivo({ duracao: '1 dia' }), true);
  assert.equal(podeFicarAtivo({ duracao: 'Permanente até ser descarregada' }), true);
  assert.equal(podeFicarAtivo({ duracao: 'Instantânea' }), false);
  assert.equal(podeFicarAtivo({ duracao: 'Instantânea ou 1 dia' }), true, 'há um ramo do ritual que dura');
  assert.equal(podeFicarAtivo({ duracao: '' }), false);
});

teste('Marcar na pele: só rituais de alcance Pessoal com você como alvo, ou (40%+) do elemento da trilha', () => {
  const pessoalMinusculo = { nome: 'A', elemento: 'medo', alcance: 'Pessoal', alvo: 'você' };
  const pessoalMaiusculo = { nome: 'B', elemento: 'conhecimento', alcance: 'Pessoal', alvo: 'Você' };
  const pessoalOutroAlvo = { nome: 'C', elemento: 'morte', alcance: 'Pessoal', alvo: '1 ser' };
  const sangueLonge = { nome: 'D', elemento: 'sangue', alcance: 'Curto', alvo: '1 ser' };
  const morteLonge = { nome: 'E', elemento: 'morte', alcance: 'Curto', alvo: '1 ser' };

  const p10 = ocultistaMonstruoso(10, 'Sangue');
  assert.equal(podeSerMarcadoNaPele(p10, 10, pessoalMinusculo), true);
  assert.equal(podeSerMarcadoNaPele(p10, 10, pessoalMaiusculo), true, 'o catálogo escreve o alvo "Você" e "você" — as duas contam');
  assert.equal(podeSerMarcadoNaPele(p10, 10, pessoalOutroAlvo), false, 'Pessoal mas com outro alvo não entra na regra base');
  assert.equal(podeSerMarcadoNaPele(p10, 10, sangueLonge), false, 'aos 10% ainda não alarga ao elemento');

  const p40 = ocultistaMonstruoso(40, 'Sangue');
  assert.equal(podeSerMarcadoNaPele(p40, 40, sangueLonge), true, 'aos 40% qualquer ritual de Sangue pode ser marcado');
  assert.equal(podeSerMarcadoNaPele(p40, 40, morteLonge), false, 'só o elemento da trilha, não os outros');
  assert.equal(podeSerMarcadoNaPele(p40, 40, pessoalMaiusculo), true, 'a regra base continua a valer para qualquer elemento');

  // Não depende da escarificação do dia — marcar é uma escolha que fica.
  assert.ok(!p40.monstruosoAtivoHoje);
  assert.equal(podeSerMarcadoNaPele(p40, 40, sangueLonge), true);
});

teste('Tatuagem Ritualística: o alvo "Você" com maiúscula também conta na regra base (era um falhanço silencioso)', () => {
  const p = ocultistaMonstruoso(10, 'Sangue');
  p.habilidades = [{ nome: 'Tatuagem Ritualística' }];
  const ritual = { elemento: 'conhecimento', alcance: 'Pessoal', alvo: 'Você' };
  assert.equal(reducaoTatuagemRitualistica(p, 10, ritual, true), 1);
});

teste('Ser Rasgado (65%, Sangue): servir sangue custa 2d8+2 PV e só destranca depois de conjurar um ritual de Sangue', () => {
  const p = ocultistaMonstruoso(65, 'Sangue');
  ativar(p);
  p.pvAtual = 60;
  p.pvTemp = 0;

  assert.equal(podeServirSangue(p, 65), true);
  assert.equal(servirSangueArmado(p, 65), false, 'ainda não conjurou nada');
  assert.ok(servirSangue(p, 65, { pvMax: 60 }).erro);

  // Só um ritual de Sangue arma o gatilho.
  assert.deepEqual(armarServirSangue(p, 65, { elemento: 'morte' }), {});
  Object.assign(p, armarServirSangue(p, 65, { elemento: 'sangue' }));
  assert.equal(servirSangueArmado(p, 65), true);

  const r = servirSangue(p, 65, { pvMax: 60 });
  assert.ok(!r.erro);
  const custo = r.rolo.total;
  assert.ok(custo >= 4 && custo <= 18, `2d8+2 fora de alcance: ${custo}`);
  assert.equal(r.patch.pvAtual, 60 - custo);
  assert.equal(r.patch.monstruosoRitualSangueConjurado, false, 'desarma depois de servir');

  // Os PV temporários aguentam primeiro.
  p.pvTemp = 50;
  Object.assign(p, armarServirSangue(p, 65, { elemento: 'sangue' }));
  const r2 = servirSangue(p, 65, { pvMax: 60 });
  assert.equal(r2.patch.pvAtual, 60, 'o PV normal não é tocado enquanto houver temporários');
  assert.equal(r2.patch.pvTemp, 50 - r2.rolo.total);
});

teste('Ser Rasgado: nada disto existe aos 40%, noutro elemento, ou sem a escarificação do dia', () => {
  const p40 = ocultistaMonstruoso(40, 'Sangue');
  ativar(p40);
  assert.equal(podeServirSangue(p40, 40), false);

  const pMorte = ocultistaMonstruoso(65, 'Morte');
  ativar(pMorte);
  assert.equal(podeServirSangue(pMorte, 65), false);

  const pInativo = ocultistaMonstruoso(65, 'Sangue');
  assert.equal(podeServirSangue(pInativo, 65), false);
});

teste('Ser Rasgado (65%, Sangue): o texto diz +1d20 e não tem limite de 1x/cena (AS7 p.87)', () => {
  const linha = TEXTOS_POR_PATAMAR.ocultista.Sangue.find((t) => t.patamar === 65).texto;
  assert.ok(linha.includes('+1d20'), linha);
  assert.ok(!linha.includes('1x/cena'), 'o livro não põe limite de usos nesta habilidade');
  assert.ok(linha.includes('2d8+2 PV'), linha);
});

teste('Ser Perfurado (40%): a reação só destranca com a condição do elemento ligada — Morte com sentidos ou morrendo', () => {
  const p = ocultistaMonstruoso(40, 'Morte');
  ativar(p);

  let e = estadoReacaoTatuagem(p, 40);
  assert.equal(e.condicao, null);
  assert.equal(e.disponivel, false, 'sem condição nenhuma fica trancada');

  for (const [id, nome] of [['cego', 'Cego'], ['surdo', 'Surdo'], ['ofuscado', 'Ofuscado'], ['morrendo', 'Morrendo']]) {
    p.condicoes = [id];
    e = estadoReacaoTatuagem(p, 40);
    assert.equal(e.condicao, nome, id);
    assert.equal(e.disponivel, true, id);
  }

  p.condicoes = ['fraco']; // fadiga — é o gatilho do Sangue, não do Morte
  assert.equal(estadoReacaoTatuagem(p, 40).disponivel, false);

  p.condicoes = ['cego'];
  p.monstruosoReacaoTatuagemUsada = true;
  e = estadoReacaoTatuagem(p, 40);
  assert.equal(e.usada, true);
  assert.equal(e.disponivel, false, '1x por cena');
});

teste('Ser Perfurado (40%): o +5 de concentração NÃO depende da condição da reação — são efeitos separados', () => {
  const p = ocultistaMonstruoso(40, 'Morte');
  ativar(p);
  const ritual = { elemento: 'morte', alcance: 'Curto', alvo: '1 ser' };

  assert.equal(condicaoReacaoTatuagem(p), null, 'sem condição nenhuma ligada');
  assert.equal(bonusConcentracaoTatuagem(p, 40, ritual, true), 5, 'o +5 vale à mesma');

  p.condicoes = ['cego'];
  assert.equal(bonusConcentracaoTatuagem(p, 40, ritual, true), 5, 'e continua igual com a condição ligada — não acumula');

  p.monstruosoReacaoTatuagemUsada = true;
  assert.equal(bonusConcentracaoTatuagem(p, 40, ritual, true), 5, 'gastar a reação não mexe no +5');
});

teste('Ser Perfurado (40%): o texto está partido em três linhas, para não parecer que a reação e o +5 estão ligados', () => {
  for (const elemento of ['Sangue', 'Morte', 'Conhecimento', 'Energia']) {
    const linhas = TEXTOS_POR_PATAMAR.ocultista[elemento].filter((t) => t.patamar === 40);
    assert.equal(linhas.length, 3, elemento);
    assert.ok(linhas[0].texto.startsWith('Tatuagem Ritualística:'), elemento);
    assert.ok(linhas[1].texto.startsWith('Reação (1x por cena):'), elemento);
    assert.ok(linhas[2].texto.startsWith('+5 em testes de concentração'), elemento);
    assert.ok(linhas[2].texto.includes('sem depender de condição'), elemento);
  }
});

teste('Ser Perfurado (40%): a reação não existe sem a escarificação do dia nem noutra classe', () => {
  const inativo = ocultistaMonstruoso(40, 'Morte');
  inativo.condicoes = ['cego'];
  assert.equal(estadoReacaoTatuagem(inativo, 40), null);

  const comb = combatenteMonstruoso(40, 'Morte');
  ativar(comb);
  comb.condicoes = ['cego'];
  assert.equal(estadoReacaoTatuagem(comb, 40), null);
});

console.log(`\n${passou} testes ok`);
