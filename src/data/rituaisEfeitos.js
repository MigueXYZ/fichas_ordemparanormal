export const EFEITOS_RITUAIS = {
  // ==========================================================
  // 1. ENQUANTO ATIVO (BUFFS PESSOAIS - alvo: 'voce')
  // ==========================================================
  'armadura-de-sangue': {
    alvo: 'voce',
    ativo: [{ tipo: 'defesa', valor: 5 }],
    nota: '+5 na Defesa enquanto a carapaça durar.',
  },
  embaralhar: {
    alvo: 'voce',
    ativo: [{ tipo: 'defesa', valor: 6 }],
    nota: '+6 na Defesa.',
  },
  'distorcer-aparencia': {
    alvo: 'voce',
    ativo: [{ tipo: 'pericia', pericia: 'enganacao', valor: 10 }],
    nota: '+10 em Enganação — só para disfarce; a ficha soma sempre, tem juízo ao usar.',
  },
  'esconder-dos-olhos': {
    alvo: 'voce',
    ativo: [{ tipo: 'pericia', pericia: 'furtividade', valor: 15 }],
    nota: '+15 em Furtividade (e camuflagem total, que a ficha não modela).',
  },
  mutar: {
    alvo: 'voce',
    ativo: [{ tipo: 'pericia', pericia: 'furtividade', valor: 10 }],
    nota: '+10 em Furtividade.',
  },
  'fortalecimento-sensorial': {
    alvo: 'voce',
    ativo: [
      { tipo: 'dadosPericia', pericia: 'investigacao', dados: 1 },
      { tipo: 'dadosPericia', pericia: 'luta', dados: 1 },
      { tipo: 'dadosPericia', pericia: 'percepcao', dados: 1 },
      { tipo: 'dadosPericia', pericia: 'pontaria', dados: 1 },
    ],
    nota: '+1d20 em Investigação, Luta, Percepção e Pontaria.',
  },
  'velocidade-mortal': {
    alvo: 'voce',
    ativo: [{ tipo: 'deslocamento', valor: 6 }],
    nota: '+6m de deslocamento e 1 ação de movimento ou padrão adicional por rodada.',
  },
  'odio-incontrolavel': {
    alvo: 'voce',
    ativo: [
      { tipo: 'ataqueCorpoACorpo', ataque: 2, dano: 2 },
      { tipo: 'defesa', valor: -5 },
    ],
    nota: '+2 em ataque e dano corpo a corpo, -5 na Defesa. Não podes executar ações que exijam calma/concentração.',
  },
  'forma-monstruosa': {
    alvo: 'voce',
    ativo: [
      { tipo: 'defesa', valor: 5 },
      { tipo: 'deslocamento', valor: 3 },
      { tipo: 'dadosPericia', pericia: 'atletismo', dados: 2 },
      { tipo: 'dadosPericia', pericia: 'luta', dados: 2 },
      { tipo: 'dadosPericia', pericia: 'fortitude', dados: 2 },
    ],
    pvTempAoConjurar: 30,
    nota: '+5 Defesa, +3m deslocamento, +2d20 em testes de Força/Luta/Atletismo/Fortitude e 30 PV temporários. Ataques desarmados causam 1d10 letal.',
  },
  'tela-de-ruido': {
    alvo: 'voce',
    pvTempAoConjurar: 30,
    nota: 'Recebes 30 PV temporários que absorvem dano físico (corte, impacto, perfuração, balístico).',
  },
  'consumir-manancial': {
    alvo: 'voce',
    pvTempFormula: '3d6',
    nota: 'Recebes 3d6 PV temporários até ao final da cena.',
  },
  'martirio-de-sangue': {
    alvo: 'voce',
    ativo: [
      { tipo: 'defesa', valor: 10 },
      { tipo: 'ataqueCorpoACorpo', ataque: 10, dano: 10 },
      { tipo: 'dadosPericia', pericia: 'diplomacia', dados: -3 },
      { tipo: 'dadosPericia', pericia: 'enganacao', dados: -3 },
    ],
    pvTempAoConjurar: 30,
    nota: 'Também dá faro, visão no escuro, cura acelerada 10 e 1 dado extra nos ataques desarmados (letais). Não podes conjurar mais rituais. Quando a cena acabar, perdes a personagem para sempre.',
  },
  cineraria: {
    nota: 'Em área. Aumenta a DT de todos os rituais conjurados dentro da névoa em +5.',
  },
  'rejeitar-nevoa': {
    nota: 'Em área. Aumenta o custo de rituais em +2 PE por círculo e o tempo de execução em um passo.',
  },
  'alterar-destino': {
    alvo: 'voce',
    nota: 'Reação: +15 em um teste de resistência ou na Defesa contra um ataque.',
  },
  'contato-paranormal': {
    alvo: 'voce',
    nota: 'Recebes 6d6 para adicionar a testes durante o dia em troca de Sanidade.',
  },
  'odor-da-cacada': {
    alvo: 'voce',
    nota: 'Faro paranormal e bónus em testes para rastrear e atacar alvos feridos.',
  },

  // ==========================================================
  // 2. LIGADOS A UMA ARMA
  // ==========================================================
  'arma-atroz': {
    escolhaArma: true,
    naArma: { ataque: 2, margem: 1 },
    nota: '+2 em testes de ataque e +1 na margem de ameaça, só na arma escolhida.',
  },
  'amaldicoar-arma': {
    escolhaArma: true,
    nota: '+1d6 de dano do elemento escolhido (Conhecimento, Energia, Morte ou Sangue) nos ataques da arma.',
  },
  'amaldicoar-tecnologia': {
    escolhaArma: true,
    nota: 'A arma ou acessório recebe uma modificação adicional à escolha durante a cena.',
  },

  // ==========================================================
  // 3. CURA DIRETA
  // ==========================================================
  cicatrizacao: {
    cura: { formula: '3d8+3' },
    nota: 'O alvo recupera 3d8+3 PV e envelhece 1 ano automaticamente.',
  },

  // ==========================================================
  // 4. DANO DIRETO (COM TIPO DE DANO EM MINÚSCULAS)
  // ==========================================================
  decadencia: { dano: { formula: '2d8+2', tipo: 'morte' } },
  esfolar: { dano: { formula: '3d4+3', tipo: 'corte' }, nota: 'O alvo fica sangrando.' },
  eletrocussao: { dano: { formula: '3d6', tipo: 'eletricidade' } },
  'desfazer-sinapses': { dano: { formula: '2d6+2', tipo: 'conhecimento' }, nota: 'O alvo fica frustrado por 1 rodada.' },
  'polarizacao-caotica': { dano: { formula: '2d6', tipo: 'impacto' }, nota: 'Arremesso de projétil magnético metálico.' },
  'chamas-do-caos': { dano: { formula: '6d6', tipo: 'fogo' }, nota: 'Reflexos reduz à metade.' },
  'dissonancia-acustica': { dano: { formula: '3d6', tipo: 'impacto' }, nota: 'Fortitude reduz à metade e evita condição Ensurdecido.' },
  'sopro-do-caos': { dano: { formula: '4d6', tipo: 'impacto' }, nota: 'Rajada de ar caótica (Reflexos reduz à metade).' },
  descarnar: {
    dano: { formula: '3d8', tipo: 'corte', extras: [{ expr: '3d8', tipoDano: 'sangue', elemental: true }] },
    nota: 'Hemorragia: no início de cada turno dele, Fortitude ou mais 2d8 de Sangue.',
  },
  hemofagia: {
    dano: { formula: '6d6', tipo: 'sangue' },
    curaMetadeDoDano: true,
    nota: 'Recuperas PV iguais a metade do dano que o alvo sofrer de facto.',
  },
  'miasma-entropico': {
    dano: { formula: '4d8', tipo: 'quimico' },
    nota: 'Em área. Quem passar na Fortitude sofre metade e não fica enjoado.',
  },
  paradoxo: {
    dano: { formula: '6d6', tipo: 'morte' },
    nota: 'Em área, em todos os seres. Fortitude reduz à metade.',
  },
  'poeira-da-podridao': {
    dano: { formula: '4d8', tipo: 'morte' },
    nota: 'Em área. Seres e objetos sofrem 4d8 de Morte no início do turno (Fortitude reduz à metade).',
  },
  'vomitar-pestes': {
    dano: { formula: '4d12', tipo: 'sangue' },
    nota: 'Enxame de pestes em área (Fortitude reduz à metade).',
  },
  'tentaculos-de-lodo': {
    dano: { formula: '4d6', tipo: 'impacto' },
    nota: 'Em área. Terreno difícil; tenta agarrar alvos.',
  },
  'conhecendo-o-medo': {
    dano: { formula: '10d6', tipo: 'mental' },
    nota: 'Só quem PASSAR na Vontade é que sofre este dano. Quem falhar fica com a Sanidade a 0 e enlouquecendo.',
  },
  'lamina-do-medo': {
    dano: { formula: '10d8', tipo: 'medo' },
    nota: 'Só quem PASSAR na Fortitude é que sofre este dano (ignora todas as resistências). Quem falhar fica com 0 PV e morrendo.',
  },
  'presenca-do-medo': {
    dano: { formula: '5d8', tipo: 'medo' },
    nota: 'Em área. Fortitude reduz à metade e evita condição Apavorado.',
  },
  inexistir: {
    dano: { formula: '10d12+10', tipo: 'conhecimento' },
    nota: 'Vontade reduz à metade. Se reduzir a 0 PV, o alvo é apagado da existência.',
  },
  'deflagracao-de-energia': {
    dano: { formula: '30d10', tipo: 'energia' },
    nota: 'Em área. Fortitude reduz à metade. Dispositivos tecnológicos deixam de funcionar pela cena.',
  },
};

/** O ritual tem leitura mecânica automatizada? */
export function temEfeitos(ritual) {
  return Boolean(ritual?.id && EFEITOS_RITUAIS[ritual.id]);
}

export function efeitosDe(ritual) {
  return (ritual?.id && EFEITOS_RITUAIS[ritual.id]) || null;
}
