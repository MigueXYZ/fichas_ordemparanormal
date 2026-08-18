// As 28 perícias. Retirado da ficha automática oficial (mesma lista e marcas do print).
//   * = somente treinada (não podes usar sem treino)
//   + = sofre penalidade de carga
// `pdf` é o sufixo usado nos campos do PDF (t_<pdf>, o_<pdf>, b_<pdf>).

export const PERICIAS = [
  { id: 'acrobacia',    nome: 'Acrobacia',    attr: 'agi', treinada: false, carga: true,  pdf: 'acrobacia' },
  { id: 'adestramento', nome: 'Adestramento', attr: 'pre', treinada: true,  carga: false, pdf: 'adestramento' },
  { id: 'artes',        nome: 'Artes',        attr: 'pre', treinada: true,  carga: false, pdf: 'artes' },
  { id: 'atletismo',    nome: 'Atletismo',    attr: 'for', treinada: false, carga: false, pdf: 'atletismo' },
  { id: 'atualidades',  nome: 'Atualidades',  attr: 'int', treinada: false, carga: false, pdf: 'atualidades' },
  { id: 'ciencias',     nome: 'Ciências',     attr: 'int', treinada: true,  carga: false, pdf: 'ciencias' },
  { id: 'crime',        nome: 'Crime',        attr: 'agi', treinada: true,  carga: true,  pdf: 'crime' },
  { id: 'diplomacia',   nome: 'Diplomacia',   attr: 'pre', treinada: false, carga: false, pdf: 'diplomacia' },
  { id: 'enganacao',    nome: 'Enganação',    attr: 'pre', treinada: false, carga: false, pdf: 'enganacao' },
  { id: 'fortitude',    nome: 'Fortitude',    attr: 'vig', treinada: false, carga: false, pdf: 'fortitude' },
  { id: 'furtividade',  nome: 'Furtividade',  attr: 'agi', treinada: false, carga: true,  pdf: 'furtividade' },
  { id: 'iniciativa',   nome: 'Iniciativa',   attr: 'agi', treinada: false, carga: false, pdf: 'iniciativa' },
  { id: 'intimidacao',  nome: 'Intimidação',  attr: 'pre', treinada: false, carga: false, pdf: 'intimidacao' },
  { id: 'intuicao',     nome: 'Intuição',     attr: 'pre', treinada: false, carga: false, pdf: 'intuicao' },
  { id: 'investigacao', nome: 'Investigação', attr: 'int', treinada: false, carga: false, pdf: 'investigacao' },
  { id: 'luta',         nome: 'Luta',         attr: 'for', treinada: false, carga: false, pdf: 'luta' },
  { id: 'medicina',     nome: 'Medicina',     attr: 'int', treinada: false, carga: false, pdf: 'medicina' },
  { id: 'ocultismo',    nome: 'Ocultismo',    attr: 'int', treinada: true,  carga: false, pdf: 'ocultismo' },
  { id: 'percepcao',    nome: 'Percepção',    attr: 'pre', treinada: false, carga: false, pdf: 'percepcao' },
  { id: 'pilotagem',    nome: 'Pilotagem',    attr: 'agi', treinada: true,  carga: false, pdf: 'pilotagem' },
  { id: 'pontaria',     nome: 'Pontaria',     attr: 'agi', treinada: false, carga: false, pdf: 'pontaria' },
  { id: 'profissao',    nome: 'Profissão',    attr: 'int', treinada: true,  carga: false, pdf: 'profissao' },
  { id: 'reflexos',     nome: 'Reflexos',     attr: 'agi', treinada: false, carga: false, pdf: 'reflexos' },
  { id: 'religiao',     nome: 'Religião',     attr: 'pre', treinada: true,  carga: false, pdf: 'religiao' },
  { id: 'sobrevivencia',nome: 'Sobrevivência',attr: 'int', treinada: false, carga: false, pdf: 'sobrevivencia' },
  { id: 'tatica',       nome: 'Tática',       attr: 'int', treinada: true,  carga: false, pdf: 'tatica' },
  { id: 'tecnologia',   nome: 'Tecnologia',   attr: 'int', treinada: true,  carga: false, pdf: 'tecnologia' },
  { id: 'vontade',      nome: 'Vontade',      attr: 'pre', treinada: false, carga: false, pdf: 'vontade' },
];

// Grau de treino -> bónus. O grau máximo depende do NEX (ver engine/calc.js).
export const GRAUS_TREINO = [
  { id: 'destreinado', nome: 'Destreinado', bonus: 0,  nexMinimo: 0 },
  { id: 'treinado',    nome: 'Treinado',    bonus: 5,  nexMinimo: 5 },
  { id: 'veterano',    nome: 'Veterano',    bonus: 10, nexMinimo: 35 },
  { id: 'expert',      nome: 'Expert',      bonus: 15, nexMinimo: 70 },
];

export const PERICIAS_POR_ID = Object.fromEntries(PERICIAS.map((p) => [p.id, p]));

// O texto completo de cada perícia (Livro Base, cap. 2) vive em periciasTexto.js
export { PERICIAS_TEXTO, PERICIAS_TEXTO_POR_ID } from './periciasTexto.js';
