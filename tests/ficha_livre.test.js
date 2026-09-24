import assert from 'node:assert/strict';
import {
  FORMATO_FICHA_LIVRE, fichaLivreVazia, ehFichaLivre, paraFichaOrdo, lerFichasDeTexto,
  fichaParaExportar, roleplayDe, vitaisLivre, PERICIAS_BASE_NPC,
} from '../src/engine/fichaLivre.js';
import { prepararAtaques } from '../src/engine/combateAtaques.js';

console.log('Ficha livre (NPCs e ameaças importados)\n');

let passou = 0;
function teste(nome, fn) {
  try { fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.message); process.exitCode = 1; }
}

const josh = {
  formato: FORMATO_FICHA_LIVRE, versao: 2, tipo: 'npc',
  nome: 'Josh', breveDescricao: 'Braço direito de Genebro', classe: 'Ocultista', nex: '35', vd: '40',
  pv: '65', defesa: '20', san: '40', pe: '',
  atributos: { agi: 3, for: 2, int: 3, pre: 3, vig: 2 },
  pericias: [{ nome: 'Pontaria', dados: '3', bonus: '10' }],
  acoes: [{ tipo: 'Padrão', nome: 'Revólver .44', teste: '3d20+10', dano: '2d8+3 balístico', critico: '19/x3' }],
  rituais: [{ nome: 'Cicatrização', circulo: 1, elemento: 'Sangue', custo: '1 PE', dt: 15 }],
  equipamento: ['Revólver .44', 'Anel do Elo Mental'],
  roleplay: { personalidade: 'Cínico', motivacao: 'Servir Genebro' },
};

const zumbi = {
  formato: FORMATO_FICHA_LIVRE, versao: 2, tipo: 'ameaca', nome: 'Zumbi', vd: 100, pv: 200,
  descritores: ['Sangue'], presencaPerturbadora: { dt: 25, dano: '4d6 mental', nex: 40 },
  sentidos: { percepcao: '2d20+10', iniciativa: '3d20+5', extra: 'Percepção às cegas' },
  acoes: [{ tipo: 'Padrão', nome: 'Mordida', teste: '3d20+15', dano: '2d10+5 perfuração' }],
  enigmaDoMedo: 'Chamar o nome do dono.',
  roleplay: { comportamento: 'Só ataca sob ordens' },
};

teste('um NPC da ficha editável entra como NPC livre, com os campos de pessoa', () => {
  const f = paraFichaOrdo(josh);
  assert.equal(f.tipo, 'npc');
  assert.equal(f.fichaLivre, true);
  assert.equal(f.pv, 65);
  assert.equal(f.nex, 35);
  assert.equal(f.classe, 'Ocultista');
  assert.deepEqual(f.pericias[0], { nome: 'Pontaria', dados: 3, bonus: 10 });
  assert.equal(f.rituais[0].nome, 'Cicatrização');
  assert.equal(f.rituais[0].circulo, '1', 'rituais guardam-se como texto');
  assert.deepEqual(f.equipamento, ['Revólver .44', 'Anel do Elo Mental']);
  assert.equal(f.roleplay.motivacao, 'Servir Genebro');
  for (const k of ['sentidos', 'testes', 'presencaPerturbadora', 'enigmaDoMedo', 'pvMachucado']) {
    assert.equal(k in f, false, `um NPC não tem ${k}`);
  }
  assert.equal(f.formato, undefined, 'o marcador de formato não fica gravado na ficha do Ordo');
});

teste('uma ameaça entra com o bloco oficial completo', () => {
  const f = paraFichaOrdo(zumbi);
  assert.equal(f.tipo, 'ameaca');
  assert.equal(f.pvMachucado, 100, 'sem Machucado escrito, fica metade dos PV');
  assert.equal(f.presencaPerturbadora.dt, 25);
  assert.equal(f.sentidos.extra, 'Percepção às cegas');
  assert.equal(f.testes.fortitude, '', 'testes em falta ficam vazios, não inventados');
  assert.equal(f.enigmaDoMedo, 'Chamar o nome do dono.');
  assert.equal(roleplayDe(f).comportamento, 'Só ataca sob ordens');
});

teste('fichas da versão 1: sentidos/testes de um NPC passam a perícias, poderes juntam-se às habilidades', () => {
  const f = paraFichaOrdo({
    formato: FORMATO_FICHA_LIVRE, versao: 1, tipo: 'npc', nome: 'Velho',
    sentidos: { percepcao: '2d20+5', iniciativa: '1d20+0' }, testes: { vontade: '3d20+10' },
    pericias: [{ nome: 'Luta', dados: 2, bonus: 5 }],
    poderes: [{ nome: 'Eco Doloroso', custo: '1.º círculo', descricao: '' }],
  });
  const nomes = f.pericias.map((p) => `${p.nome} ${p.dados}/${p.bonus}`);
  assert.deepEqual(nomes, ['Luta 2/5', 'Percepção 2/5', 'Vontade 3/10'], 'valores base (1d20+0) não viram perícias');
  assert.equal(f.habilidades[0].nome, 'Eco Doloroso');
  assert.equal('poderes' in f, false);
});

teste('uma ameaça do próprio Ordo também é aceite, e perde o id antigo', () => {
  const f = paraFichaOrdo({ id: 'ag-velho', tipo: 'ameaca', nome: 'Zumbi', vd: 100, pv: 200, acoes: [] });
  assert.equal(f.tipo, 'ameaca');
  assert.equal(f.id, undefined);
  assert.equal(f.vd, 100);
});

teste('ficheiros que não são fichas livres são recusados', () => {
  assert.equal(paraFichaOrdo({ nome: 'Agente', atributos: {}, classeId: 'combatente' }), null);
  assert.equal(paraFichaOrdo({ tipo: 'npc', nome: 'NPC da ficha 4' }), null, 'NPC antigo (sem fichaLivre) não entra por aqui');
  assert.equal(paraFichaOrdo(null), null);
  assert.equal(paraFichaOrdo([1, 2]), null);
});

teste('lerFichasDeTexto aceita uma ficha, uma lista ou { fichas: [...] }', () => {
  assert.equal(lerFichasDeTexto(JSON.stringify(josh)).length, 1);
  assert.equal(lerFichasDeTexto(JSON.stringify([josh, zumbi, { lixo: 1 }])).length, 2);
  assert.equal(lerFichasDeTexto(JSON.stringify({ fichas: [josh] })).length, 1);
  assert.throws(() => lerFichasDeTexto('não é json'));
});

teste('exportar e voltar a importar dá a mesma ficha', () => {
  for (const orig of [josh, zumbi]) {
    const f = { ...paraFichaOrdo(orig), id: 'ag-1', atualizadoEm: 123, pvAtual: 10, imagemZoom: 2 };
    const exp = fichaParaExportar(f);
    assert.equal(exp.formato, FORMATO_FICHA_LIVRE);
    assert.equal(exp.id, undefined);
    assert.equal(exp.pvAtual, undefined, 'o estado do combate não viaja no ficheiro');
    assert.equal(exp.imagemZoom, undefined);
    const volta = paraFichaOrdo(JSON.parse(JSON.stringify(exp)));
    assert.deepEqual(volta, paraFichaOrdo(orig));
  }
});

teste('fichas vazias: nada inventado — NPC sem perícias, ameaça com sentidos/testes em branco', () => {
  const n = fichaLivreVazia('npc');
  assert.deepEqual(n.pericias, []);
  assert.equal('sentidos' in n, false);
  assert.equal(PERICIAS_BASE_NPC.length, 5, 'o atalho "+ perícias comuns" continua disponível');
  const a = fichaLivreVazia('ameaca');
  assert.ok('enigmaDoMedo' in a && 'presencaPerturbadora' in a);
  assert.deepEqual(a.sentidos, { percepcao: '', iniciativa: '', extra: '' });
  assert.deepEqual(a.testes, { fortitude: '', reflexos: '', vontade: '' });
  for (const k of ['pe', 'san', 'bloqueio', 'esquiva']) assert.equal(k in a, false, `uma ameaça não tem ${k}`);
});

teste('ehFichaLivre: ameaças sempre, NPCs só com a marca', () => {
  assert.equal(ehFichaLivre({ tipo: 'ameaca' }), true);
  assert.equal(ehFichaLivre({ tipo: 'npc', fichaLivre: true }), true);
  assert.equal(ehFichaLivre({ tipo: 'npc' }), false);
  assert.equal(ehFichaLivre(fichaLivreVazia('npc')), true);
});

teste('roleplayDe mostra também a narração das ameaças geradas (aparencia/comportamento/dicaRp)', () => {
  const rp = roleplayDe({ tipo: 'ameaca', aparencia: 'Pele cinzenta', comportamento: 'Caça de noite', dicaRp: 'Descreve o cheiro' });
  assert.equal(rp.aparencia, 'Pele cinzenta');
  assert.equal(rp.comportamento, 'Caça de noite');
  assert.equal(rp.notasMestre, 'Descreve o cheiro');
});

teste('vitaisLivre: PV/SAN/Defesa/AGI para o Campo de Batalha, PE só se existir', () => {
  const v = vitaisLivre({ ...paraFichaOrdo(josh), pvAtual: 30 });
  assert.deepEqual(v.pv, { atual: 30, max: 65, temp: 0 });
  assert.equal(v.san.max, 40);
  assert.equal(v.pe, null);
  assert.equal(v.defesa, 20);
  assert.equal(v.agi, 3);
});

teste('no combate, um NPC livre ataca pelas ações escritas na ficha', () => {
  const ficha = paraFichaOrdo(josh);
  const ataques = prepararAtaques({ nome: 'Josh', tipo: 'npc', subtipo: 'livre', ficha });
  assert.equal(ataques.length, 1);
  assert.equal(ataques[0].nome, 'Revólver .44');
  const { acerto, dano } = ataques[0].rolar();
  assert.ok(acerto && dano, 'rola teste e dano');
});

console.log(`\n${passou} testes passaram!`);
