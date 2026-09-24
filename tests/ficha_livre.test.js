import assert from 'node:assert/strict';
import {
  FORMATO_FICHA_LIVRE, fichaLivreVazia, ehFichaLivre, paraFichaOrdo, lerFichasDeTexto,
  fichaParaExportar, roleplayDe, vitaisLivre,
} from '../src/engine/fichaLivre.js';
import { prepararAtaques } from '../src/engine/combateAtaques.js';

console.log('Ficha livre (NPCs e ameaças importados)\n');

let passou = 0;
function teste(nome, fn) {
  try { fn(); passou++; console.log('  ok  ' + nome); }
  catch (e) { console.error('  FALHOU  ' + nome + '\n    ' + e.message); process.exitCode = 1; }
}

const josh = {
  formato: FORMATO_FICHA_LIVRE, versao: 1, tipo: 'npc',
  nome: 'Josh', breveDescricao: 'Braço direito de Genebro', vd: '40',
  pv: '65', defesa: '20', san: '40', pe: '',
  atributos: { agi: 3, for: 2, int: 3, pre: 3, vig: 2 },
  pericias: [{ nome: 'Pontaria', dados: '3', bonus: '10' }],
  acoes: [{ tipo: 'Padrão', nome: 'Revólver .44', teste: '3d20+10', dano: '2d8+3 balístico', critico: '19/x3' }],
  roleplay: { personalidade: 'Cínico', motivacao: 'Servir Genebro' },
};

teste('uma ficha exportada da ficha editável entra como NPC livre', () => {
  const f = paraFichaOrdo(josh);
  assert.equal(f.tipo, 'npc');
  assert.equal(f.fichaLivre, true);
  assert.equal(f.pv, 65);
  assert.equal(f.defesa, 20);
  assert.equal(f.san, 40);
  assert.equal(f.pvMachucado, 32, 'sem Machucado escrito, fica metade dos PV');
  assert.deepEqual(f.pericias[0], { nome: 'Pontaria', dados: 3, bonus: 10 });
  assert.equal(f.roleplay.motivacao, 'Servir Genebro');
  assert.equal(f.roleplay.aparencia, '', 'campos de roleplay em falta ficam vazios');
  assert.equal(f.formato, undefined, 'o marcador de formato não fica gravado na ficha do Ordo');
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
  assert.equal(lerFichasDeTexto(JSON.stringify([josh, { tipo: 'ameaca', nome: 'X' }, { lixo: 1 }])).length, 2);
  assert.equal(lerFichasDeTexto(JSON.stringify({ fichas: [josh] })).length, 1);
  assert.throws(() => lerFichasDeTexto('não é json'));
});

teste('exportar e voltar a importar dá a mesma ficha', () => {
  const f = { ...paraFichaOrdo(josh), id: 'ag-1', atualizadoEm: 123, pvAtual: 10 };
  const exp = fichaParaExportar(f);
  assert.equal(exp.formato, FORMATO_FICHA_LIVRE);
  assert.equal(exp.id, undefined);
  assert.equal(exp.pvAtual, undefined, 'o estado do combate não viaja no ficheiro');
  const volta = paraFichaOrdo(JSON.parse(JSON.stringify(exp)));
  assert.equal(volta.nome, 'Josh');
  assert.deepEqual(volta.acoes, f.acoes);
});

teste('ehFichaLivre: ameaças sempre, NPCs só com a marca', () => {
  assert.equal(ehFichaLivre({ tipo: 'ameaca' }), true);
  assert.equal(ehFichaLivre({ tipo: 'npc', fichaLivre: true }), true);
  assert.equal(ehFichaLivre({ tipo: 'npc' }), false);
  assert.equal(ehFichaLivre(fichaLivreVazia('npc')), true);
});

teste('roleplayDe mostra também o guia das ameaças geradas (aparencia/comportamento/dicaRp)', () => {
  const rp = roleplayDe({ tipo: 'ameaca', aparencia: 'Pele cinzenta', comportamento: 'Caça de noite', dicaRp: 'Descreve o cheiro' });
  assert.equal(rp.aparencia, 'Pele cinzenta');
  assert.equal(rp.personalidade, 'Caça de noite');
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
  const ataques = prepararAtaques({ nome: 'Josh', tipo: 'agente', subtipo: 'npc', ficha });
  assert.equal(ataques.length, 1);
  assert.equal(ataques[0].nome, 'Revólver .44');
  const { acerto, dano } = ataques[0].rolar();
  assert.ok(acerto && dano, 'rola teste e dano');
});

console.log(`\n${passou} testes passaram!`);
