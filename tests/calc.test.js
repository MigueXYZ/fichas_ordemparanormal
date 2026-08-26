import assert from 'node:assert/strict';
import { personagemVazio } from '../src/engine/character.js';
import { gerarAmeaca, gerarFicha } from '../src/engine/geradores.js';
import { calcMaximos, calcDefesa, calcDefesas, calcPericias, calcDeslocamento, calcDeslocamentos, pontosRestantes, calcPePorRodada, grauMaximoPorNex, degrauNex, nexEfetivo } from '../src/engine/calc.js';

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

teste('defesa soma a Proteção marcada (checkbox) e outros', () => {
  const p = personagemVazio();
  p.atributos.agi = 3;
  p.protecao = ['protecao-leve']; // +5 Defesa — ver PROTECOES em data/itens/geral.js
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

teste('valor escrito à mão também manda sobre a Defesa, igual a bloqueio e esquiva', () => {
  const p = personagemVazio();
  p.atributos.agi = 1; // Defesa automática = 11
  p.pericias.reflexos.grau = 'treinado';
  p.defesaManual = 25;
  const d = calcDefesas(p);
  assert.equal(d.defesaManual, true);
  assert.equal(d.defesa, 25);
  assert.equal(d.defesaAuto, 11);
  // a Esquiva ("Defesa + Reflexos") segue a Defesa atual, manual ou não
  assert.equal(d.esquiva.valor, 25 + d.esquiva.base);
  // apagar o campo devolve o automático
  p.defesaManual = null;
  const d2 = calcDefesas(p);
  assert.equal(d2.defesaManual, false);
  assert.equal(d2.defesa, 11);
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

teste('rolagem de dano separa tipos de dano nas partes', () => {
  const r = rolarDano({
    nome: 'Faca',
    dano: '1d4',
    tipoDano: 'Corte',
    bonus: 2,
    extras: [{ expr: '1d6', tipoDano: 'Sangue', elemental: true }],
  });
  assert.equal(r.partes.length, 2);
  assert.equal(r.partes[0].tipoDano, 'Corte');
  assert.equal(r.partes[1].tipoDano, 'Sangue');
  assert.equal(r.total, r.partes[0].total + r.partes[1].total);
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

teste('deslocamentoManual sobrepõe o cálculo e calcDeslocamentos informa o auto', () => {
  const p = personagemVazio();
  p.deslocamento = 9;
  p.condicoes = ['lento']; // auto seria 4.5
  p.deslocamentoManual = 12;
  assert.equal(calcDeslocamento(p), 12);
  const d = calcDeslocamentos(p);
  assert.equal(d.valor, 12);
  assert.equal(d.auto, 4.5);
  assert.equal(d.manual, true);
  assert.equal(d.quadrados, 8);

  // ao limpar volta ao automático
  p.deslocamentoManual = null;
  const dAuto = calcDeslocamentos(p);
  assert.equal(dAuto.valor, 4.5);
  assert.equal(dAuto.manual, false);
});

teste('ataques sofrem penalidades de condições (Ofuscado)', () => {
  const p = personagemVazio();
  p.atributos.for = 3;
  p.condicoes = ['ofuscado'];
  const arma = { pericia: 'luta', dano: '1d8', critico: '20', atributoDano: 'for', modificacoes: [] };
  const stats = estatisticasArma(p, arma);
  assert.equal(stats.dados, 2); // 3 - 1 = 2d20
});

teste('personagem e ameaça suportam tags como array', () => {
  const p = personagemVazio();
  assert.ok(Array.isArray(p.tags));
  assert.equal(p.tags.length, 0);

  const f = gerarFicha();
  assert.ok(Array.isArray(f.tags));

  const a = gerarAmeaca();
  assert.ok(Array.isArray(a.tags));
});

console.log('\nLayout modular da ficha por widgets (US #67)\n');

teste('layout padrão da ficha tem 3 colunas e widgets essenciais', async () => {
  const { lerLayoutFicha, LAYOUT_FICHA_PADRAO } = await import('../src/engine/sheetLayout.js');
  const l = lerLayoutFicha();
  assert.equal(l.numColunas, 3);
  assert.ok(Array.isArray(l.colunas));
  assert.equal(l.colunas.length, 3);
  assert.ok(l.colunas[0].includes('atributos'));
  assert.ok(l.colunas[1].includes('pericias'));
  assert.ok(l.colunas[2].includes('abas'));
});

teste('moverWidget reorganiza widgets na mesma coluna e entre colunas', async () => {
  const { moverWidget, LAYOUT_FICHA_PADRAO } = await import('../src/engine/sheetLayout.js');
  let l = JSON.parse(JSON.stringify(LAYOUT_FICHA_PADRAO));
  
  // Mover 'recursos' para cima (fica antes de 'atributos')
  l = moverWidget(l, 'recursos', 'cima');
  assert.equal(l.colunas[0][0], 'recursos');
  assert.equal(l.colunas[0][1], 'atributos');

  // Mover 'recursos' para a coluna da direita (coluna 1, onde está pericias)
  l = moverWidget(l, 'recursos', 'direita');
  assert.ok(!l.colunas[0].includes('recursos'));
  assert.ok(l.colunas[1].includes('recursos'));
});

teste('ocultar e mostrar widgets atualiza colunas e visibilidade', async () => {
  const { ocultarWidget, mostrarWidget, LAYOUT_FICHA_PADRAO } = await import('../src/engine/sheetLayout.js');
  let l = JSON.parse(JSON.stringify(LAYOUT_FICHA_PADRAO));
  
  l = ocultarWidget(l, 'atributos');
  assert.ok(!l.colunas[0].includes('atributos'));
  assert.equal(l.widgets.atributos.visivel, false);

  l = mostrarWidget(l, 'atributos', 0);
  assert.ok(l.colunas[0].includes('atributos'));
  assert.equal(l.widgets.atributos.visivel, true);
});

teste('alterar número de colunas ajusta distribuição dos widgets', async () => {
  const { alterarNumColunas, LAYOUT_FICHA_PADRAO } = await import('../src/engine/sheetLayout.js');
  let l = JSON.parse(JSON.stringify(LAYOUT_FICHA_PADRAO));

  l = alterarNumColunas(l, 2);
  assert.equal(l.numColunas, 2);
  assert.equal(l.colunas.length, 2);
  assert.ok(l.colunas[1].includes('abas')); // o conteúdo da coluna 3 migrou para a coluna 2

  l = alterarNumColunas(l, 3);
  assert.equal(l.numColunas, 3);
  assert.equal(l.colunas.length, 3);
});

teste('gestão de widgets customizados (criar, editar, remover)', async () => {
  const {
    adicionarWidgetCustomizado,
    atualizarWidgetCustomizado,
    removerWidgetCustomizado,
    LAYOUT_FICHA_PADRAO
  } = await import('../src/engine/sheetLayout.js');

  let l = JSON.parse(JSON.stringify(LAYOUT_FICHA_PADRAO));
  const novo = { id: 'cw-teste-1', tipo: 'contador', titulo: 'Munições', atual: 30, max: 30, cor: '#f04653' };

  l = adicionarWidgetCustomizado(l, novo);
  assert.ok(l.colunas[0].includes('cw-teste-1'));
  assert.equal(l.customWidgets['cw-teste-1'].titulo, 'Munições');

  l = atualizarWidgetCustomizado(l, { ...novo, atual: 25 });
  assert.equal(l.customWidgets['cw-teste-1'].atual, 25);

  l = removerWidgetCustomizado(l, 'cw-teste-1');
  assert.ok(!l.colunas[0].includes('cw-teste-1'));
  assert.equal(l.customWidgets['cw-teste-1'], undefined);
});

teste('soltarWidgetSobre posiciona antes e depois do alvo com precisão vertical', async () => {
  const { soltarWidgetSobre, soltarWidgetNaColuna, LAYOUT_FICHA_PADRAO } = await import('../src/engine/sheetLayout.js');
  let l = JSON.parse(JSON.stringify(LAYOUT_FICHA_PADRAO));
  // Coluna 0 padrão: ['atributos', 'recursos', 'defesas', 'condicoes']

  // 1. Soltar 'condicoes' ANTES de 'atributos' (vai para o topo da coluna 0)
  l = soltarWidgetSobre(l, 'condicoes', 'atributos', 'antes');
  assert.deepEqual(l.colunas[0], ['condicoes', 'atributos', 'recursos', 'defesas']);

  // 2. Soltar 'condicoes' DEPOIS de 'recursos'
  l = soltarWidgetSobre(l, 'condicoes', 'recursos', 'depois');
  assert.deepEqual(l.colunas[0], ['atributos', 'recursos', 'condicoes', 'defesas']);

  // 3. Soltar 'pericias' (coluna 1) DEPOIS de 'defesas' (coluna 0)
  l = soltarWidgetSobre(l, 'pericias', 'defesas', 'depois');
  assert.ok(!l.colunas[1].includes('pericias'));
  assert.equal(l.colunas[0][l.colunas[0].length - 1], 'pericias');

  // 4. Soltar na coluna 1 vazia
  l = soltarWidgetNaColuna(l, 'pericias', 1);
  assert.ok(l.colunas[1].includes('pericias'));
  assert.ok(!l.colunas[0].includes('pericias'));
});

console.log('\nRecetor de ataques e cálculo automático de dano (US #71)');

teste('interpretarResistencias extrai valores de texto e arrays', async () => {
  const { interpretarResistencias } = await import('../src/engine/danoRecetor.js');

  const r1 = interpretarResistencias('Balístico, corte, impacto e perfuração 5, Morte 10, Sangue 5');
  assert.equal(r1.balistico, 5);
  assert.equal(r1.corte, 5);
  assert.equal(r1.impacto, 5);
  assert.equal(r1.perfuracao, 5);
  assert.equal(r1.morte, 10);
  assert.equal(r1.sangue, 5);

  const r2 = interpretarResistencias(['Físico 10', 'Energia 5', 'RD 2']);
  assert.equal(r2.balistico, 10);
  assert.equal(r2.corte, 10);
  assert.equal(r2.energia, 5);
  assert.equal(r2.geral, 2);
});

teste('calcularDanoRecebido abate a Resistência (nº) marcada na ficha no dano combinado', async () => {
  const { calcularDanoRecebido } = await import('../src/engine/danoRecetor.js');

  const personagem = {
    pvAtual: 40,
    pvTemp: 0,
    sanAtual: 30,
    resistencias: 'Perfuração 5, Morte 10',
  };
  const max = { pv: 40, san: 30 };

  // Exemplo da US #71: 30 de dano perfurante e 20 de morte
  const res = calcularDanoRecebido({
    parcelas: [
      { valor: 30, tipoId: 'perfuracao' },
      { valor: 20, tipoId: 'morte' },
    ],
    personagem,
    max,
  });

  // 30 - 5 RD = 25 perfuração; 20 - 10 RD = 10 morte. Total líquido = 35.
  assert.equal(res.totalBruto, 50);
  assert.equal(res.totalReducao, 15);
  assert.equal(res.totalLiquidoPv, 35);
  assert.equal(res.novoPvAtual, 5); // 40 - 35 = 5
});

teste('calcularDanoRecebido aplica Bloqueio e absorve PV Temporário primeiro', async () => {
  const { calcularDanoRecebido } = await import('../src/engine/danoRecetor.js');

  const personagem = {
    pvAtual: 30,
    pvTemp: 10,
    resistencias: 'Corte 5',
  };
  const max = { pv: 30 };

  // 25 de Corte, Bloqueio ativo (+5 RD)
  const res = calcularDanoRecebido({
    parcelas: [{ valor: 25, tipoId: 'corte' }],
    personagem,
    max,
    bloqueioAtivo: true,
    rdBloqueio: 5,
  });

  // 25 - 5 (RD Corte) - 5 (Bloqueio) = 15 dano líquido.
  // 15 dano: 10 absorvido por pvTemp, 5 descontado de pvAtual.
  assert.equal(res.totalBruto, 25);
  assert.equal(res.totalReducao, 10);
  assert.equal(res.totalLiquidoPv, 15);
  assert.equal(res.pvTempAbsorvido, 10);
  assert.equal(res.novoPvTemp, 0);
  assert.equal(res.novoPvAtual, 25); // 30 - 5 = 25
});

teste('calcularDanoRecebido desconta dano mental na Sanidade', async () => {
  const { calcularDanoRecebido } = await import('../src/engine/danoRecetor.js');

  const personagem = {
    pvAtual: 30,
    sanAtual: 24,
    resistencias: 'Mental 5',
  };
  const max = { pv: 30, san: 24, semSanidade: false };

  const res = calcularDanoRecebido({
    parcelas: [
      { valor: 15, tipoId: 'mental' },
      { valor: 10, tipoId: 'impacto' },
    ],
    personagem,
    max,
  });

  // Mental: 15 - 5 RD = 10 dano Sanidade. Impacto: 10 - 0 RD = 10 dano PV.
  assert.equal(res.totalLiquidoSan, 10);
  assert.equal(res.totalLiquidoPv, 10);
  assert.equal(res.novoSanAtual, 14); // 24 - 10 = 14
  assert.equal(res.novoPvAtual, 20); // 30 - 10 = 20
});

teste('calcularDanoRecebido: Resistência marcada SEM número corta o dano do tipo a metade', async () => {
  const { calcularDanoRecebido, tiposComResistencia } = await import('../src/engine/danoRecetor.js');

  const personagem = {
    pvAtual: 40,
    resistencias: ['sangue'], // checkbox marcada, sem número
  };
  const max = { pv: 40 };

  const res = calcularDanoRecebido({
    parcelas: [{ valor: 7, tipoId: 'sangue' }],
    personagem,
    max,
  });

  // 7 de Sangue com Resistência: metade arredondada para baixo = 3.
  assert.equal(res.detalhesParcelas[0].resistente, true);
  assert.equal(res.totalLiquidoPv, 3);
  assert.equal(res.novoPvAtual, 37); // 40 - 3

  assert.equal(tiposComResistencia(['sangue', 'nao-existe']).has('sangue'), true);
  assert.equal(tiposComResistencia(['sangue', 'nao-existe']).has('nao-existe'), false);
});

teste('calcularDanoRecebido: Resistência marcada COM número desconta esse valor, em vez de cortar a metade', async () => {
  const { calcularDanoRecebido } = await import('../src/engine/danoRecetor.js');

  const personagem = {
    pvAtual: 40,
    resistencias: ['Sangue 2'], // checkbox marcada COM número — RD fixa, não os 50%
  };
  const max = { pv: 40 };

  const res = calcularDanoRecebido({
    parcelas: [{ valor: 9, tipoId: 'sangue' }],
    personagem,
    max,
  });

  // 9 de Sangue - 2 (RD fixa marcada) = 7 — NÃO corta a metade, porque tem número.
  assert.equal(res.detalhesParcelas[0].resistente, false);
  assert.equal(res.detalhesParcelas[0].danoLiquido, 7);
  assert.equal(res.novoPvAtual, 33); // 40 - 7
});

teste('calcularDanoRecebido: a Redução de Dano automática da Trilha soma-se mesmo quando a Resistência manual do tipo é só a metade (½)', async () => {
  const { calcularDanoRecebido } = await import('../src/engine/danoRecetor.js');

  const personagem = { pvAtual: 40, resistencias: ['sangue'] }; // ½, sem número
  const max = { pv: 40 };

  const res = calcularDanoRecebido({
    parcelas: [{ valor: 20, tipoId: 'sangue' }],
    personagem,
    max,
    rdTrilha: { sangue: 4 },
  });

  // 20 -> metade (10, Resistência) -> -4 (RD da Trilha) = 6.
  assert.equal(res.detalhesParcelas[0].resistente, true);
  assert.equal(res.detalhesParcelas[0].danoLiquido, 6);
});

teste('reducaoDanoTrilhaAtiva: Combatente-Sangue concede RD automática a balístico e Sangue, só com a etapa ativa', async () => {
  const { reducaoDanoTrilhaAtiva, escolherElemento, ativarHoje, desativarHoje } = await import('../src/engine/monstruoso.js');
  const { personagemVazio } = await import('../src/engine/character.js');

  let p = { ...personagemVazio(), classeId: 'combatente', trilhaId: 'monstruoso' };
  p = { ...p, ...escolherElemento('Sangue').patch };

  // Ainda sem ativar a etapa de hoje: nada.
  assert.deepEqual(reducaoDanoTrilhaAtiva(p, 40), {});

  const r = ativarHoje(p, 40, {});
  p = { ...p, ...r.patch };
  // 40% (Ser Macabro): RD 10 em balístico e Sangue (RESISTENCIA_POR_PATAMAR/RESISTENCIA_TIPOS_COMBATENTE).
  assert.deepEqual(reducaoDanoTrilhaAtiva(p, 40), { balistico: 10, sangue: 10 });
  // Outro tipo de dano não coberto por este elemento não entra.
  assert.equal(reducaoDanoTrilhaAtiva(p, 40).morte, undefined);

  p = { ...p, ...desativarHoje().patch };
  assert.deepEqual(reducaoDanoTrilhaAtiva(p, 40), {});
});

teste('reducaoDanoTrilhaAtiva: Combatente-Energia 65%+ passa a cobrir também dano químico', async () => {
  const { reducaoDanoTrilhaAtiva, escolherElemento, ativarHoje } = await import('../src/engine/monstruoso.js');
  const { personagemVazio } = await import('../src/engine/character.js');

  let p = { ...personagemVazio(), classeId: 'combatente', trilhaId: 'monstruoso' };
  p = { ...p, ...escolherElemento('Energia').patch };
  const r = ativarHoje(p, 65, {});
  p = { ...p, ...r.patch };

  const rd = reducaoDanoTrilhaAtiva(p, 65);
  assert.equal(rd.quimico, 15); // RESISTENCIA_POR_PATAMAR[65]
  assert.equal(rd.corte, 15);
  assert.equal(rd.eletricidade, 15);
  assert.equal(rd.fogo, 15);
  assert.equal(rd.energia, 15);
});

teste('calcularDanoRecebido: a Redução de Dano da Trilha soma-se à marcada à mão no Recetor de Dano', async () => {
  const { calcularDanoRecebido } = await import('../src/engine/danoRecetor.js');
  const { reducaoDanoTrilhaAtiva, escolherElemento, ativarHoje } = await import('../src/engine/monstruoso.js');
  const { personagemVazio } = await import('../src/engine/character.js');

  let p = { ...personagemVazio(), classeId: 'combatente', trilhaId: 'monstruoso', pvAtual: 40 };
  p = { ...p, ...escolherElemento('Sangue').patch };
  const r = ativarHoje(p, 40, {});
  p = { ...p, ...r.patch, resistencias: ['Sangue 5'] }; // + 5 marcados à mão na ficha (Resistência com número)

  const max = { pv: 40 };
  const res = calcularDanoRecebido({
    parcelas: [{ valor: 20, tipoId: 'sangue' }],
    personagem: p,
    max,
    rdTrilha: reducaoDanoTrilhaAtiva(p, 40),
  });

  // RD da trilha (10) + RD à mão (5) = 15 de Redução de Dano em Sangue.
  assert.equal(res.detalhesParcelas[0].danoLiquido, 5); // 20 - 15
  assert.equal(res.novoPvAtual, 35); // 40 - 5

  // Sem rdTrilha (ex.: modal não ligado), só os 5 manuais contariam — confirma que o campo é mesmo necessário.
  const semTrilha = calcularDanoRecebido({
    parcelas: [{ valor: 20, tipoId: 'sangue' }],
    personagem: p,
    max,
  });
  assert.equal(semTrilha.detalhesParcelas[0].danoLiquido, 15); // 20 - 5
});

console.log('\nSistema de Interlúdio e Descanso (US #84)');

teste('calcularInterludio - dormir e relaxar em condição Normal recupera 1x limite de PE', async () => {
  const { calcularInterludio } = await import('../src/engine/interludio.js');

  const personagem = {
    nex: 35, // limite de PE por rodada = 7
    pvAtual: 10,
    peAtual: 5,
    sanAtual: 8,
    pvTemp: 5,
    condicoes: ['abalado', 'fatigado'],
  };
  const max = { pv: 40, pe: 20, san: 30 };

  const res = calcularInterludio({
    personagem,
    max,
    condicaoDescansoId: 'normal',
    acoes: ['dormir', 'relaxar'],
    limparCondicoes: true,
  });

  assert.equal(res.limitePe, 7);
  assert.equal(res.pvRecuperado, 7);
  assert.equal(res.peRecuperado, 7);
  assert.equal(res.sanRecuperado, 7);
  assert.equal(res.novoPv, 17); // 10 + 7
  assert.equal(res.novoPe, 12); // 5 + 7
  assert.equal(res.novoSan, 15); // 8 + 7
  assert.equal(res.patch.pvTemp, 0);
  assert.deepEqual(res.patch.condicoes, []);
});

teste('calcularInterludio - sinergia de Prato Nutritivo e Prato Favorito', async () => {
  const { calcularInterludio } = await import('../src/engine/interludio.js');

  const personagem = {
    nex: 20, // limite de PE = 4
    pvAtual: 10,
    peAtual: 10,
    sanAtual: 10,
  };
  const max = { pv: 30, pe: 20, san: 25 };

  // Condição Confortável (2x) + Prato Nutritivo (aumenta PV em +1x -> 3x)
  const res1 = calcularInterludio({
    personagem,
    max,
    condicaoDescansoId: 'confortavel',
    acoes: ['dormir', 'alimentar'],
    pratoId: 'nutritivo',
  });

  assert.equal(res1.pvRecuperado, 12); // 4 * 3 = 12 PV
  assert.equal(res1.peRecuperado, 8);  // 4 * 2 = 8 PE

  // Relaxar em condição Confortável (2x) + Prato Favorito (+2 SAN) + 2 aliados relaxando (+2 SAN)
  const res2 = calcularInterludio({
    personagem,
    max,
    condicaoDescansoId: 'confortavel',
    acoes: ['relaxar', 'alimentar'],
    pratoId: 'favorito',
    aliadosRelaxando: 2,
  });

  // Base: 4 * 2 = 8 + 2 (Favorito) + 2 (Aliados) = 12 SAN
  assert.equal(res2.sanRecuperado, 12);
  assert.equal(res2.novoSan, 22); // 10 + 12
});

teste('aplicarDescansoPleno restaura 100% e limpa temporários', async () => {
  const { aplicarDescansoPleno } = await import('../src/engine/interludio.js');

  const max = { pv: 45, pe: 25, san: 35 };
  const patch = aplicarDescansoPleno({}, max);

  assert.equal(patch.pvAtual, 45);
  assert.equal(patch.peAtual, 25);
  assert.equal(patch.sanAtual, 35);
  assert.equal(patch.pvTemp, 0);
  assert.deepEqual(patch.condicoes, []);
});

console.log('\nMaldições para Armas (US #81)');

teste('maldições de armas - Lancinante soma 1d8 Sangue e multiplica no crítico', async () => {
  const { estatisticasArma } = await import('../src/engine/armas.js');
  const { rolarDano } = await import('../src/engine/dados.js');

  const personagem = {
    atributos: { AGI: 2, FOR: 2, INT: 1, PRE: 1, VIG: 1 },
    pericias: [{ id: 'luta', grau: 1 }],
  };

  const arma = {
    nome: 'Espada Lancinante',
    tipo: 'corpo-a-corpo',
    pericia: 'luta',
    dano: '1d8',
    margem: 19,
    multiplicador: 3,
    atributoDano: 'for',
    maldicoes: ['lancinante'],
  };

  const est = estatisticasArma(personagem, arma);
  assert.equal(est.maldicoes.categoriaExtra, 2); // 1 maldição = +II categoria
  
  // Dano normal
  const danoNormal = rolarDano({
    dano: est.dano,
    bonus: est.bonusDano,
    extras: est.extras,
    critico: false,
    multiplicador: est.multiplicador,
  });

  // Em acerto normal, Lancinante tem 1d8 de Sangue
  const parteLancinanteNormal = danoNormal.partes.find((p) => p.tipoDano === 'Sangue');
  assert.ok(parteLancinanteNormal);
  assert.equal(parteLancinanteNormal.rolagens.length, 1);

  // Em crítico x3, Lancinante multiplica para 3d8 de Sangue
  const danoCritico = rolarDano({
    dano: est.dano,
    bonus: est.bonusDano,
    extras: est.extras,
    critico: true,
    multiplicador: est.multiplicador,
  });

  const parteLancinanteCrit = danoCritico.partes.find((p) => p.tipoDano === 'Sangue');
  assert.ok(parteLancinanteCrit);
  assert.equal(parteLancinanteCrit.rolagens.length, 3); // 1d8 x 3 = 3d8
});

teste('maldições de armas - Predadora duplica a margem de ameaça', async () => {
  const { estatisticasArma } = await import('../src/engine/armas.js');

  const personagem = { atributos: { AGI: 3, FOR: 1, INT: 1, PRE: 1, VIG: 1 } };
  
  // Fuzil de caça (margem base 19, alcance Médio)
  const fuzil = {
    nome: 'Fuzil de Caça Predador',
    tipo: 'fogo',
    pericia: 'pontaria',
    dano: '2d8',
    margem: 19,
    multiplicador: 3,
    alcance: 'Médio',
    maldicoes: ['predadora'],
  };

  const est = estatisticasArma(personagem, fuzil);
  // Margem 19 duplicada: amplitude 2 vira amplitude 4 -> margem 17
  assert.equal(est.margem, 17);
  // Alcance Médio sobe para Longo
  assert.equal(est.alcance, 'Longo');
});

teste('maldições de armas - Empuxo e Erosiva', async () => {
  const { estatisticasArma } = await import('../src/engine/armas.js');

  const personagem = { atributos: { FOR: 3, AGI: 1, INT: 1, PRE: 1, VIG: 1 } };

  const machado = {
    nome: 'Machado Voraz',
    tipo: 'corpo-a-corpo',
    pericia: 'luta',
    dano: '1d8',
    maldicoes: ['empuxo', 'erosiva'],
  };

  const est = estatisticasArma(personagem, machado);
  // Empuxo: +1 dado de dano em corpo a corpo (1d8 -> 2d8)
  assert.equal(est.dano, '2d8');
  // Erosiva: adiciona extra de 1d8 Morte
  const extraErosiva = est.extras.find((e) => e.tipoDano === 'Morte');
  assert.ok(extraErosiva);
  assert.equal(extraErosiva.expr, '1d8');
  // 2 maldições = +IV categoria
  assert.equal(est.maldicoes.categoriaExtra, 4);
});

console.log(`\n${passou} testes ok`);
