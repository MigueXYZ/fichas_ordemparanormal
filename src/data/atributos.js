// Atributos base de Ordem Paranormal.
// Regra de criação (print 1): todos começam em 1, recebes 4 pontos para distribuir,
// podes baixar um atributo para 0 para ganhar 1 ponto extra, máximo inicial 3.

export const ATRIBUTOS = [
  { id: 'for', sigla: 'FOR', nome: 'Força' },
  { id: 'agi', sigla: 'AGI', nome: 'Agilidade' },
  { id: 'int', sigla: 'INT', nome: 'Intelecto' },
  { id: 'pre', sigla: 'PRE', nome: 'Presença' },
  { id: 'vig', sigla: 'VIG', nome: 'Vigor' },
];

export const REGRAS_ATRIBUTOS = {
  valorInicial: 1,
  pontosParaDistribuir: 4,
  minimo: 0,
  maximoInicial: 3,
  // baixar um atributo até 0 devolve 1 ponto
  pontoPorReduzirAZero: 1,
  // limite absoluto na ficha (aumenta com NEX ao longo do jogo)
  maximoAbsoluto: 5,
};
