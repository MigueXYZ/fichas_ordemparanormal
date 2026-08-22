// MALDIÇÕES DE ITENS E ARMAS — Livro de Regras de Ordem Paranormal

export const ELEMENTOS_MALDICAO = {
  conhecimento: { id: 'conhecimento', nome: 'Conhecimento', cor: '#f5a636' },
  energia: { id: 'energia', nome: 'Energia', cor: '#9933ff' },
  morte: { id: 'morte', nome: 'Morte', cor: '#82738c' },
  sangue: { id: 'sangue', nome: 'Sangue', cor: '#f04653' },
  medo: { id: 'medo', nome: 'Medo', cor: '#e2e8f0' },
};

export const MALDICOES_ARMAS = [
  // CONHECIMENTO
  {
    id: 'antielemento',
    elemento: 'conhecimento',
    nome: 'Antielemento',
    tipos: ['corpo-a-corpo', 'disparo', 'fogo'],
    texto: 'A arma é letal contra criaturas de um elemento. Quando ataca uma criatura desse elemento, podes gastar 2 PE para causar +4d8 pontos de dano.',
    efeitos: {},
  },
  {
    id: 'ritualistica',
    elemento: 'conhecimento',
    nome: 'Ritualística',
    tipos: ['corpo-a-corpo', 'disparo', 'fogo'],
    texto: 'Podes armazenar na arma um ritual que tenha como alvo um ser ou área, gastando os PE normais. Ao acertar um ataque com a arma, podes descarregar o ritual como ação livre.',
    efeitos: {},
  },
  {
    id: 'senciente',
    elemento: 'conhecimento',
    nome: 'Senciente',
    tipos: ['corpo-a-corpo', 'disparo', 'fogo'],
    texto: 'Podes gastar uma ação de movimento e 2 PE para a arma flutuar ao teu lado e, uma vez por rodada, atacar um ser em alcance curto. Podes gastar 1 PE no início de cada turno para manter.',
    efeitos: {},
  },

  // ENERGIA
  {
    id: 'empuxo',
    elemento: 'energia',
    nome: 'Empuxo',
    tipos: ['corpo-a-corpo'],
    texto: 'A arma ganha a capacidade de ser arremessada em alcance curto (ou aumenta o alcance em 1 categoria) e causa mais um dado de dano do mesmo tipo. Volta voando para a mão no mesmo turno.',
    efeitos: { dadosDano: 1 },
  },
  {
    id: 'energetica',
    elemento: 'energia',
    nome: 'Energética',
    tipos: ['corpo-a-corpo', 'disparo', 'fogo'],
    texto: 'Podes gastar 2 PE por ataque para receber +5 em testes de ataque, ignorar resistência a dano e converter todo o dano para Energia pura.',
    efeitos: {},
  },
  {
    id: 'vibrante',
    elemento: 'energia',
    nome: 'Vibrante',
    tipos: ['corpo-a-corpo', 'disparo', 'fogo'],
    texto: 'Recebes a habilidade Ataque Extra da trilha Operações Especiais do combatente. Se já a possuíres, o custo diminui em –1 PE.',
    efeitos: {},
  },

  // MORTE
  {
    id: 'consumidora',
    elemento: 'morte',
    nome: 'Consumidora',
    tipos: ['corpo-a-corpo', 'disparo', 'fogo'],
    texto: 'Alvos atingidos ficam lentos até ao final da cena. Ao atacar, podes gastar 2 PE para deixar o alvo imóvel por uma rodada.',
    efeitos: {},
  },
  {
    id: 'erosiva',
    elemento: 'morte',
    nome: 'Erosiva',
    tipos: ['corpo-a-corpo', 'disparo', 'fogo'],
    texto: 'Causa +1d8 de dano de Morte. Ao atacar, podes gastar 2 PE para fazer a vítima sofrer 2d4 de dano de Morte no início dos seus turnos pelas próximas 2 rodadas.',
    efeitos: { danoExtra: { valor: '1d8', tipo: 'Morte' } },
  },
  {
    id: 'repulsora',
    elemento: 'morte',
    nome: 'Repulsora',
    tipos: ['corpo-a-corpo', 'disparo', 'fogo'],
    texto: 'Fornece +2 de Defesa enquanto empunhada. Quando fazes um bloqueio, podes gastar 2 PE para receber +5 de bónus adicional na Defesa.',
    efeitos: { defesa: 2 },
  },

  // SANGUE
  {
    id: 'lancinante',
    elemento: 'sangue',
    nome: 'Lancinante',
    tipos: ['corpo-a-corpo', 'disparo', 'fogo'],
    texto: 'A arma inflige ferimentos terríveis, causando +1d8 de dano de Sangue. Este dado é multiplicado em acertos críticos (ex: crítico x3 vira +3d8).',
    efeitos: { danoCriticoMultiplicavel: { valor: '1d8', tipo: 'Sangue' } },
  },
  {
    id: 'predadora',
    elemento: 'sangue',
    nome: 'Predadora',
    tipos: ['corpo-a-corpo', 'disparo', 'fogo'],
    texto: 'Anula penalidades por camuflagem e cobertura (exceto total). Duplica a margem de ameaça da arma (ex: margem 19 vira 17, 20 vira 19). Se for arma de disparo ou fogo, aumenta o alcance em 1 categoria.',
    efeitos: { duplicaMargem: true, alcanceCategoria: 1 },
  },
  {
    id: 'sanguinaria',
    elemento: 'sangue',
    nome: 'Sanguinária',
    tipos: ['corpo-a-corpo', 'disparo', 'fogo'],
    texto: 'Um ser atingido fica sangrando (cumulativo, 2d6 dano de sangramento por rodada). Em acerto crítico, deixa o alvo fraco e concede 2d10 pontos de vida temporários.',
    efeitos: {},
  },
];

export const MALDICOES_ARMAS_POR_ID = Object.fromEntries(MALDICOES_ARMAS.map((m) => [m.id, m]));

export const MALDICOES_PROTECOES = [
  { id: 'abascanta', elemento: 'conhecimento', nome: 'Abascanta', texto: '+5 em testes de resistência contra rituais; pode refletir ritual gastando reação e PE.' },
  { id: 'profetica', elemento: 'conhecimento', nome: 'Profética', texto: 'Resistência a Conhecimento 10; pode gastar 2 PE para rerrolar um teste de resistência.' },
  { id: 'sombria', elemento: 'conhecimento', nome: 'Sombria', texto: '+5 em Furtividade e ignora penalidade de carga; 1 PE disfarça como roupa comum.' },
  { id: 'cinetica', elemento: 'energia', nome: 'Cinética', texto: '+2 em Defesa e RD 2 (leve/escudo) ou RD 5 (pesada).' },
  { id: 'lepida', elemento: 'energia', nome: 'Lépida', texto: '+10 Atletismo, +3m deslocamento; 2 PE ignora terreno difícil e imune a dano de queda até 9m.' },
  { id: 'voltaica', elemento: 'energia', nome: 'Voltaica', texto: 'Resistência a Energia 10; 2d6 dano de Energia em todos os seres adjacentes no fim de cada turno.' },
  { id: 'letargica', elemento: 'morte', nome: 'Letárgica', texto: '+2 em Defesa; 25% (leve) ou 50% (pesada) de chance de ignorar dano crítico e furtivo.' },
  { id: 'repulsiva', elemento: 'morte', nome: 'Repulsiva', texto: 'Resistência a Morte 10; 2 PE cobre com lodo e causa 2d8 Morte a quem ataca corpo a corpo.' },
  { id: 'regenerativa', elemento: 'sangue', nome: 'Regenerativa', texto: 'Resistência a Sangue 10; 1 PE cura 1d12 pontos de vida.' },
  { id: 'sadica', elemento: 'sangue', nome: 'Sádica', texto: '+1 em ataque e dano para cada 10 pontos de dano sofrido desde o fim do último turno.' },
];

export const MALDICOES_ACESSORIOS = [
  { id: 'carisma', elemento: 'conhecimento', nome: 'Carisma', texto: '+1 em Presença (não concede PE).' },
  { id: 'conjuracao', elemento: 'conhecimento', nome: 'Conjuração', texto: 'Permite conjurar um ritual de 1º círculo (ou –1 PE se já conhecer).' },
  { id: 'escudo-mental', elemento: 'conhecimento', nome: 'Escudo Mental', texto: 'Resistência Mental 10.' },
  { id: 'reflexao', elemento: 'conhecimento', nome: 'Reflexão', texto: 'Uma vez por rodada, reflete ritual de volta ao conjurador gastando PE.' },
  { id: 'sagacidade', elemento: 'conhecimento', nome: 'Sagacidade', texto: '+1 em Intelecto (não concede perícias).' },
  { id: 'defesa', elemento: 'energia', nome: 'Defesa', texto: '+5 em Defesa.' },
  { id: 'destreza', elemento: 'energia', nome: 'Destreza', texto: '+1 em Agilidade.' },
  { id: 'potencia', elemento: 'energia', nome: 'Potência', texto: '+1 na DT contra habilidades, poderes e rituais.' },
  { id: 'esforco-adicional', elemento: 'morte', nome: 'Esforço Adicional', texto: '+5 PE.' },
  { id: 'disposicao', elemento: 'sangue', nome: 'Disposição', texto: '+1 em Vigor.' },
  { id: 'pujanca', elemento: 'sangue', nome: 'Pujança', texto: '+1 em Força.' },
  { id: 'vitalidade', elemento: 'sangue', nome: 'Vitalidade', texto: '+15 PV.' },
];

/**
 * Calcula bónus e alterações mecânicas das maldições aplicadas a uma arma.
 */
export function aplicarMaldicoesArma(arma, margemBase = 20) {
  const maldicoes = (arma.maldicoes || []).map((id) => MALDICOES_ARMAS_POR_ID[id]).filter(Boolean);

  let margemExtra = 0;
  let dadosDano = 0;
  let alcanceCategoria = 0;
  let defesa = 0;
  const danosExtras = [];
  let danoCriticoMultiplicavel = null;

  for (const m of maldicoes) {
    if (m.efeitos.duplicaMargem) {
      // Duplica a margem de ameaça da arma (ex: margem 19 tem amplitude 2 -> passa a amplitude 4 -> margem 17)
      const amplitudeAtual = Math.max(1, 21 - margemBase);
      margemExtra += amplitudeAtual; // soma a amplitude original para duplicar
    }
    if (m.efeitos.dadosDano && arma.tipo === 'corpo-a-corpo') {
      dadosDano += m.efeitos.dadosDano;
    }
    if (m.efeitos.alcanceCategoria && arma.tipo !== 'corpo-a-corpo') {
      alcanceCategoria += m.efeitos.alcanceCategoria;
    }
    if (m.efeitos.defesa) {
      defesa += m.efeitos.defesa;
    }
    if (m.efeitos.danoExtra) {
      danosExtras.push(m.efeitos.danoExtra);
    }
    if (m.efeitos.danoCriticoMultiplicavel) {
      danoCriticoMultiplicavel = m.efeitos.danoCriticoMultiplicavel;
    }
  }

  return {
    lista: maldicoes,
    categoriaExtra: maldicoes.length * 2, // cada maldição sobe a categoria em II
    margemExtra,
    dadosDano,
    alcanceCategoria,
    defesa,
    danosExtras,
    danoCriticoMultiplicavel,
  };
}
