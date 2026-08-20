import assert from 'node:assert/strict';
import { personagemVazio } from '../src/engine/character.js';
import { calcMaximos, calcDefesa, calcDefesas, calcPericias, calcDeslocamento, pontosRestantes, calcPePorRodada, grauMaximoPorNex, degrauNex, nexEfetivo } from '../src/engine/calc.js';

let passou = 0;
function teste(nome, fn) {
  try { fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.message); process.exitCode = 1; }
}

console.log('Cálculos da ficha\n');

teste('atributos: 4 pontos por distribuir no início', () => {
  const p = personagemVazio();
  assert.equal(pontosRestantes(p.atributos), 4);
});

teste('atributos: baixar um a 0 devolve 1 ponto', () => {
  const p = personagemVazio();
  p.atributos.for = 0;
  assert.equal(pontosRestantes(p.atributos), 5);
});

teste('Combatente NEX 5% com atributos a 1 -> 21 PV / 12 SAN / 3 PE (print oficial)', () => {
  const p = personagemVazio();
  p.classeId = 'combatente';
  const m = calcMaximos(p);
  assert.deepEqual({ pv: m.pv, san: m.san, pe: m.pe }, { pv: 21, san: 12, pe: 3 });
});

teste('Combatente NEX 10% soma um passo de progressão', () => {
  const p = personagemVazio();
  p.classeId = 'combatente';
  p.nex = 10;
  const m = calcMaximos(p);
  assert.deepEqual({ pv: m.pv, san: m.san, pe: m.pe }, { pv: 21 + 5, san: 12 + 3, pe: 3 + 3 });
});

teste('Ocultista NEX 5% com VIG 2 / PRE 3', () => {
  const p = personagemVazio();
  p.classeId = 'ocultista';
  p.atributos.vig = 2;
  p.atributos.pre = 3;
  const m = calcMaximos(p);
  assert.deepEqual({ pv: m.pv, san: m.san, pe: m.pe }, { pv: 14, san: 20, pe: 7 });
});

teste('defesa = 10 + AGI (print: 11 com AGI 1)', () => {
  const p = personagemVazio();
  assert.equal(calcDefesa(p), 11);
});

teste('defesa soma equipamento e outros', () => {
  const p = personagemVazio();
  p.atributos.agi = 3;
  p.defesaEquipamento = 5;
  p.defesaOutros = 2;
  assert.equal(calcDefesa(p), 20);
});

teste('perícia treinada dá +5 e marca as somente-treinadas', () => {
  const p = personagemVazio();
  p.atributos.int = 2;
  p.pericias.ciencias.grau = 'treinado';
  const linhas = calcPericias(p);
  const ciencias = linhas.find((l) => l.id === 'ciencias');
  const ocultismo = linhas.find((l) => l.id === 'ocultismo');
  assert.equal(ciencias.dados, 2);
  assert.equal(ciencias.bonus, 5);
  assert.equal(ciencias.bloqueada, false);
  assert.equal(ocultismo.bloqueada, true);
});

teste('penalidade de carga só afeta perícias marcadas com +', () => {
  const p = personagemVazio();
  p.penalidadeCarga = 5;
  const linhas = calcPericias(p);
  assert.equal(linhas.find((l) => l.id === 'furtividade').bonus, -5);
  assert.equal(linhas.find((l) => l.id === 'atletismo').bonus, 0);
});

teste('PE por rodada = NEX / 5, mínimo 1', () => {
  assert.equal(calcPePorRodada(5), 1);
  assert.equal(calcPePorRodada(45), 9);
  assert.equal(calcPePorRodada(99), 19);
});

teste('grau máximo de treino limitado pelo NEX', () => {
  assert.equal(grauMaximoPorNex(5).id, 'treinado');
  assert.equal(grauMaximoPorNex(40).id, 'veterano');
  assert.equal(grauMaximoPorNex(75).id, 'expert');
});

// ---- defesas (bloqueio e esquiva) ----
console.log('\nBloqueio e esquiva\n');

teste('bloqueio só existe com treino em Fortitude', () => {
  const p = personagemVazio();
  assert.equal(calcDefesas(p).bloqueio.disponivel, false);
  p.pericias.fortitude.grau = 'treinado';
  const d = calcDefesas(p);
  assert.equal(d.bloqueio.disponivel, true);
  assert.equal(d.bloqueio.valor, 5);           // RD = bónus de Fortitude
});

teste('esquiva = Defesa + bónus de Reflexos, só com treino', () => {
  const p = personagemVazio();
  assert.equal(calcDefesas(p).esquiva.disponivel, false);
  p.pericias.reflexos.grau = 'treinado';
  p.atributos.agi = 3;
  const d = calcDefesas(p);
  assert.equal(d.defesa, 13);
  assert.equal(d.esquiva.valor, 18);           // 13 + 5
});

teste('valor escrito à mão manda sobre o cálculo de bloqueio e esquiva', () => {
  const p = personagemVazio();
  // sem treino nenhum: normalmente não havia bloqueio nem esquiva
  p.bloqueioManual = 4;
  p.esquivaManual = 17;
  const d = calcDefesas(p);
  assert.equal(d.bloqueio.disponivel, true);
  assert.equal(d.bloqueio.manual, true);
  assert.equal(d.bloqueio.valor, 4);
  assert.equal(d.esquiva.valor, 17);
  // apagar o campo devolve o automático
  p.bloqueioManual = null;
  p.esquivaManual = null;
  const d2 = calcDefesas(p);
  assert.equal(d2.bloqueio.manual, false);
  assert.equal(d2.bloqueio.disponivel, false);
});

teste('o valor automático continua acessível para o botão "auto"', () => {
  const p = personagemVazio();
  p.pericias.fortitude.grau = 'treinado';
  p.bloqueioManual = 99;
  const d = calcDefesas(p);
  assert.equal(d.bloqueio.valor, 99);
  assert.equal(d.bloqueio.auto, 5);
});

teste('extras manuais somam a bloqueio e esquiva', () => {
  const p = personagemVazio();
  p.pericias.fortitude.grau = 'treinado';
  p.pericias.reflexos.grau = 'treinado';
  p.bloqueioExtra = 2;
  p.esquivaExtra = 3;
  const d = calcDefesas(p);
  assert.equal(d.bloqueio.valor, 7);
  assert.equal(d.esquiva.valor, 11 + 5 + 3);
});


// ---- carga e patente ----
import { calcCarga, calcCargaMaxima, calcItensPorCategoria } from '../src/engine/calc.js';
import { interpretarCritico, somarDados, estatisticasArma } from '../src/engine/armas.js';
import { rolarDano, rolarAtaqueCompleto } from '../src/engine/dados.js';

console.log('\nCarga, patente e armas\n');

teste('carga = 5 espaços por ponto de Força (0 -> 2)', () => {
  const p = personagemVazio();
  p.atributos.for = 0;
  assert.equal(calcCarga(p).max, 2);
  p.atributos.for = 3;
  assert.equal(calcCarga(p).max, 15);
});

teste('passar do limite deixa sobrecarregado e penaliza perícias de carga', () => {
  const p = personagemVazio();
  p.atributos.for = 1;               // limite 5
  p.inventario = [{ espacos: 6 }];
  const c = calcCarga(p);
  assert.equal(c.sobrecarregado, true);
  assert.equal(c.penalidade, 5);
  const pericias = calcPericias(p);
  assert.equal(pericias.find((x) => x.id === 'furtividade').bonus, -5);  // tem penalidade de carga
  assert.equal(pericias.find((x) => x.id === 'atletismo').bonus, 0);     // não tem
});

teste('recruta só pode dois itens de categoria I', () => {
  const p = personagemVazio();
  p.inventario = [{ categoria: 'I' }, { categoria: 'I' }, { categoria: 'II' }];
  const r = calcItensPorCategoria(p);
  assert.equal(r.patente.id, 'recruta');
  assert.equal(r.linhas.find((l) => l.categoria === 'I').limite, 2);
  assert.equal(r.excedeu, true);      // o item de categoria II não é permitido
});

teste('lê o crítico como vem no livro', () => {
  assert.deepEqual(interpretarCritico('19/x2'), { margem: 19, multiplicador: 2 });
  assert.deepEqual(interpretarCritico('x3'), { margem: 20, multiplicador: 3 });
  assert.deepEqual(interpretarCritico('18/x3'), { margem: 18, multiplicador: 3 });
});

teste('modificações mexem nos números da arma', () => {
  const p = personagemVazio();
  p.atributos.for = 2;
  p.pericias.luta.grau = 'treinado';
  const arma = { nome: 'Machado', pericia: 'luta', dano: '1d8', margem: 20, multiplicador: 3, atributoDano: 'for', modificacoes: ['certeira', 'perigosa', 'cruel'] };
  const e = estatisticasArma(p, arma);
  assert.equal(e.dados, 2);          // Força 2 -> 2d20
  assert.equal(e.bonusAtaque, 7);    // +5 treino +2 certeira
  assert.equal(e.bonusDano, 4);      // +2 Força +2 cruel
  assert.equal(e.margem, 18);        // 20 - 2 (perigosa)
});

teste('crítico multiplica só os dados da arma', () => {
  const r = rolarDano({ nome: 'x', dano: '2d6', bonus: 5, critico: true, multiplicador: 3, extras: ['1d8'] });
  assert.equal(r.expressao, '6d6');  // 2d6 x3
  assert.equal(r.bonus, 5);          // o bónus não é multiplicado
  assert.equal(r.extras.length, 1);  // nem os dados extra
});

teste('somarDados acrescenta um dado do mesmo tipo', () => {
  assert.equal(somarDados('1d6', 1), '2d6');
  assert.equal(somarDados('2d10+2', 1), '3d10+2');
});


teste('dá para trocar o atributo de uma perícia', () => {
  const p = personagemVazio();
  p.atributos.int = 3;
  p.atributos.pre = 1;
  const antes = calcPericias(p).find((x) => x.id === 'enganacao');
  assert.equal(antes.attr, 'pre');
  assert.equal(antes.dados, 1);
  p.pericias.enganacao.attr = 'int';          // poder que troca PRE por INT
  const depois = calcPericias(p).find((x) => x.id === 'enganacao');
  assert.equal(depois.dados, 3);
  assert.equal(depois.attrTrocado, true);
  assert.equal(depois.attrPadrao, 'pre');
});

teste('dano com duas hipóteses ("1d4/1d6") usa a primeira em vez de falhar', () => {
  const r = rolarDano({ nome: 'Coronhada', dano: '1d4/1d6', bonus: 2 });
  assert.ok(r, 'devia rolar em vez de devolver null');
  assert.equal(r.expressao, '1d4');
  assert.equal(r.rolagens.length, 1);
  assert.ok(r.total >= 3 && r.total <= 6);
});

teste('o ataque traz o dano colado, num só resultado', () => {
  const r = rolarAtaqueCompleto({
    nome: 'Machado', dados: 2, bonusAtaque: 5, margem: 19,
    dano: '1d12', bonusDano: 3, multiplicador: 3,
  });
  assert.equal(r.tipo, 'ataque');
  assert.equal(r.rolagens.length, 2);
  assert.ok(r.dano, 'o resultado do ataque tem de trazer o dano');
  assert.equal(r.dano.critico, r.critico);
  // num crítico só os dados da arma são multiplicados
  assert.equal(r.dano.expressao, r.critico ? '3d12' : '1d12');
});

// ---- NEX à mão e regras opcionais de Sobrevivendo ao Horror ----
console.log('\nNEX livre e regras opcionais\n');

teste('NEX escrito à mão arredonda para o degrau abaixo', () => {
  assert.equal(degrauNex(5), 5);
  assert.equal(degrauNex(8), 5);
  assert.equal(degrauNex(23), 20);
  assert.equal(degrauNex(49), 45);
  assert.equal(degrauNex(97), 95);
  assert.equal(degrauNex(99), 99);
  assert.equal(degrauNex(0), 5);      // abaixo do primeiro degrau conta como o primeiro
});

teste('um NEX de 23% dá o mesmo que 20%', () => {
  const a = personagemVazio(); a.classeId = 'combatente'; a.atributos.vig = 2; a.nex = 20;
  const b = { ...a, nex: 23 };
  assert.deepEqual(calcMaximos(b), calcMaximos(a));
  assert.equal(calcPePorRodada(b), 4);
});

teste('regra "NEX & Experiência": mandam os níveis, não o NEX', () => {
  const p = personagemVazio();
  p.classeId = 'ocultista';
  p.regras.nivelSeparado = true;
  p.nivel = 4;          // nível 4 = NEX 20%
  p.nex = 7;            // exposição baixa, não conta para as contas
  assert.equal(nexEfetivo(p), 20);
  const comNivel = calcMaximos(p);
  const padrao = calcMaximos({ ...p, regras: {}, nex: 20 });
  assert.deepEqual(comNivel, padrao);
});

teste('regra "Jogando sem Sanidade": Sanidade e Esforço viram Determinação', () => {
  const p = personagemVazio();
  p.classeId = 'especialista';
  p.atributos.pre = 3;
  p.nex = 15;                 // 3.º degrau -> 2 passos de progressão
  p.regras.semSanidade = true;
  const m = calcMaximos(p);
  assert.equal(m.semSanidade, true);
  assert.equal(m.san, 0);
  assert.equal(m.pe, 0);
  // especialista: 8 + Pre inicial, +4 + Pre por NEX  ->  (8+3) + (4+3)*2
  assert.equal(m.pd, 11 + 14);
});

teste('alterações por exposição: NEX 25% liberta Ocultismo e cobra −5 noutra perícia', () => {
  const p = personagemVazio();
  p.regras.nivelSeparado = true;
  p.nex = 27;                       // já passou o patamar dos 25%
  p.exposicao = { penalidade25: 'diplomacia' };
  const linhas = calcPericias(p);
  assert.equal(linhas.find((x) => x.id === 'ocultismo').bloqueada, false);
  assert.equal(linhas.find((x) => x.id === 'diplomacia').bonus, -5);
  // treinado em Ocultismo dá +2 por cima do treino
  p.pericias.ocultismo.grau = 'treinado';
  assert.equal(calcPericias(p).find((x) => x.id === 'ocultismo').bonus, 7);
});

teste('alterações por exposição: NEX 35% soma o atributo escolhido ao PE', () => {
  const p = personagemVazio();
  p.classeId = 'combatente';
  p.regras.nivelSeparado = true;
  p.nivel = 1;
  p.atributos.vig = 3;
  const antes = calcMaximos(p).pe;
  p.nex = 35;
  p.exposicao = { atributo35: 'vig' };
  assert.equal(calcMaximos(p).pe, antes + 3);
  // sem escolher o atributo, não há bónus nenhum
  assert.equal(calcMaximos({ ...p, exposicao: {} }).pe, antes);
});

teste('as armas contam para a carga', () => {
  const p = personagemVazio();
  p.atributos.for = 2;                       // limite 10
  p.inventario = [{ espacos: 3 }];
  p.ataques = [{ nome: 'Machado', espacos: 1 }, { nome: 'Espingarda', espacos: 2, equipado: false }];
  const c = calcCarga(p);
  assert.equal(c.dosItens, 3);
  assert.equal(c.dasArmas, 3);               // guardada ou na mão, pesa na mesma
  assert.equal(c.usados, 6);
  assert.equal(c.max, 10);
});

teste('a Mochila Militar aumenta o limite de carga em 2', () => {
  const p = personagemVazio();
  p.atributos.for = 1;                       // limite 5
  assert.equal(calcCargaMaxima(p), 5);
  p.inventario = [{ nome: 'Mochila Militar', espacos: 0, cargaBonus: 2 }];
  assert.equal(calcCargaMaxima(p), 7);
  assert.equal(calcCarga(p).usados, 0);      // e ela própria não ocupa nada
});

// ---- conteúdo dos livros ----
import { ORIGENS } from '../src/data/origens.js';
import { CLASSES, TRILHAS_POR_ID } from '../src/data/classes.js';

console.log('\nConteúdo dos livros\n');

teste('as trilhas dos Arquivos Secretos entraram nas classes certas', () => {
  const trilhasDe = (id) => CLASSES.find((c) => c.id === id).trilhas.map((t) => t.id);
  // Monstruoso existe para as três classes: Combatente (SaH) e as duas do AS 7
  assert.ok(trilhasDe('combatente').includes('monstruoso'));
  assert.ok(trilhasDe('especialista').includes('monstruoso-especialista'));
  assert.ok(trilhasDe('ocultista').includes('monstruoso-ocultista'));
  // trilhas próprias de cada pacote
  assert.ok(trilhasDe('ocultista').includes('maledictologo'));          // AS 1
  assert.ok(trilhasDe('ocultista').includes('criptologista-do-oculto')); // AS 5
});

teste('a trilha geral (Performático) aparece nas três classes principais', () => {
  for (const id of ['combatente', 'especialista', 'ocultista']) {
    const trilha = CLASSES.find((c) => c.id === id).trilhas.find((t) => t.geral);
    assert.ok(trilha, `${id} devia ter a trilha geral`);
    assert.ok(/Performático$/.test(trilha.nome), `nome adaptado à classe: ${trilha.nome}`);
  }
  // e não se cola ao Sobrevivente, que o livro não inclui
  assert.equal(CLASSES.find((c) => c.id === 'sobrevivente').trilhas.some((t) => t.geral), false);
});

teste('ids de trilha únicos e todas com poderes', () => {
  const todas = CLASSES.flatMap((c) => c.trilhas);
  const ids = todas.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length, 'há ids repetidos: ' + ids.join(', '));
  for (const t of todas) assert.ok((t.poderes || []).length > 0, `${t.id} sem poderes`);
});

teste('origens sem repetições e todas com duas perícias', () => {
  const ids = ORIGENS.map((o) => o.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const o of ORIGENS) {
    const total = (o.pericias || []).length + (o.periciasLivres || 0);
    assert.equal(total, 2, `${o.id} tem ${total} perícias em vez de 2`);
  }
});

// ---- armas ágeis, leitura do teste e preço dos rituais ----
import { formulaTeste, ehAgil } from '../src/engine/armas.js';
import { precoDoRitual } from '../src/engine/rituais.js';

console.log('\nArmas ágeis e rituais\n');

teste('arma ágil usa Agilidade em vez de Força, no ataque e no dano', () => {
  const p = personagemVazio();
  p.atributos.for = 1;
  p.atributos.agi = 3;
  p.pericias.luta.grau = 'treinado';
  const base = { pericia: 'luta', dano: '1d6', critico: '18', atributoDano: 'for', modificacoes: [] };
  const normal = estatisticasArma(p, { ...base, nome: 'Espada' });
  const agil = estatisticasArma(p, { ...base, nome: 'Florete', agil: true });
  assert.equal(normal.dados, 1);
  assert.equal(normal.bonusDano, 1);
  assert.equal(agil.dados, 3);          // 3d20 em vez de 1d20
  assert.equal(agil.bonusDano, 3);      // +3 de dano em vez de +1
  assert.equal(agil.agilAtiva, true);
});

teste('a troca manual do atributo da perícia manda sobre o "ágil"', () => {
  const p = personagemVazio();
  p.atributos.for = 1;
  p.atributos.agi = 3;
  p.atributos.pre = 4;
  p.pericias.luta.attr = 'pre';         // um poder trocou Luta para Presença
  const e = estatisticasArma(p, { pericia: 'luta', dano: '1d6', critico: '19', atributoDano: 'for', agil: true, modificacoes: [] });
  assert.equal(e.dados, 4);
  assert.equal(e.agilAtiva, false);
});

teste('a tabela marca as armas ágeis', () => {
  assert.equal(ehAgil({ propriedades: ['Ágil', 'Pode ser arremessada'] }), true);
  assert.equal(ehAgil({ descricao: 'É uma arma ágil.' }), true);
  assert.equal(ehAgil({ propriedades: [], descricao: 'Uma marreta pesada.' }), false);
});

teste('com o atributo a 0 escreve-se "2d20 pior", não "0d20"', () => {
  assert.equal(formulaTeste(2, 5), '2d20 +5');
  assert.equal(formulaTeste(0, 5), '2d20 pior +5');
  assert.equal(formulaTeste(3, 0), '3d20');
  assert.equal(formulaTeste(1, -2), '1d20 −2');
});

teste('preço do ritual: Sanidade abaixo de 20 + círculo, permanente abaixo de 10 + círculo', () => {
  // 1º círculo: limites 21 e 11
  assert.deepEqual(precoDoRitual(25, 1), { limiteSan: 21, limitePermanente: 11, perdeSan: false, perdePermanente: false });
  assert.deepEqual(precoDoRitual(15, 1), { limiteSan: 21, limitePermanente: 11, perdeSan: true, perdePermanente: false });
  // falhar por muito conta as duas
  assert.deepEqual(precoDoRitual(8, 1), { limiteSan: 21, limitePermanente: 11, perdeSan: true, perdePermanente: true });
  // 4º círculo é mais exigente
  assert.equal(precoDoRitual(23, 4).perdeSan, true);
  assert.equal(precoDoRitual(24, 4).perdeSan, false);
});

console.log('\nCondições e penalidades automáticas\n');

teste('condição Desprevenido reduz Defesa em 5 e Reflexos em 1d20', () => {
  const p = personagemVazio();
  p.atributos.agi = 2;
  p.condicoes = ['desprevenido'];
  assert.equal(calcDefesa(p), 10 + 2 - 5); // 7
  const per = calcPericias(p);
  const ref = per.find((x) => x.id === 'reflexos');
  assert.equal(ref.dados, 1); // 2 - 1 = 1
});

teste('condição Abalado reduz 1d20 em todas as perícias', () => {
  const p = personagemVazio();
  p.atributos.for = 3;
  p.atributos.int = 2;
  p.condicoes = ['abalado'];
  const per = calcPericias(p);
  const luta = per.find((x) => x.id === 'luta');
  const inv = per.find((x) => x.id === 'investigacao');
  assert.equal(luta.dados, 2); // 3 - 1 = 2
  assert.equal(inv.dados, 1); // 2 - 1 = 1
});

teste('condições Fraco e Frustrado afetam atributos específicos', () => {
  const p = personagemVazio();
  p.atributos.for = 3;
  p.atributos.int = 3;
  p.condicoes = ['fraco']; // -1 em FOR, AGI, VIG
  let per = calcPericias(p);
  assert.equal(per.find((x) => x.id === 'atletismo').dados, 2);
  assert.equal(per.find((x) => x.id === 'investigacao').dados, 3); // INT não afetado

  p.condicoes = ['frustrado']; // -1 em INT, PRE
  per = calcPericias(p);
  assert.equal(per.find((x) => x.id === 'atletismo').dados, 3);
  assert.equal(per.find((x) => x.id === 'investigacao').dados, 2);
});

teste('deslocamento respeita condições Imóvel, Caído e Lento', () => {
  const p = personagemVazio();
  p.deslocamento = 9;
  p.condicoes = ['lento'];
  assert.equal(calcDeslocamento(p), 4.5);
  p.condicoes = ['caido'];
  assert.equal(calcDeslocamento(p), 1.5);
  p.condicoes = ['imovel'];
  assert.equal(calcDeslocamento(p), 0);
});

teste('ataques sofrem penalidades de condições (Ofuscado)', () => {
  const p = personagemVazio();
  p.atributos.for = 3;
  p.condicoes = ['ofuscado'];
  const arma = { pericia: 'luta', dano: '1d8', critico: '20', atributoDano: 'for', modificacoes: [] };
  const stats = estatisticasArma(p, arma);
  assert.equal(stats.dados, 2); // 3 - 1 = 2d20
});

console.log(`\n${passou} testes ok`);
