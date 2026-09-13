/**
 * Compêndio Oficial de Ameaças — todo o conteúdo de "ameaças" (criaturas, PNJs
 * mundanos, perigos) extraído dos livros oficiais de Ordem Paranormal, pronto
 * a consultar no Modo Mestre e a clonar para o Bestiário do utilizador.
 *
 * Cada entrada aqui é só LEITURA (dados do livro, com citação de página em
 * `fonte`). `clonarAmeacaOficial` copia uma entrada para um objeto novo,
 * independente, do formato `tipo: 'ameaca'` usado pelo resto da app — depois
 * de clonada, é uma ameaça normal do utilizador: pode ser editada, apagada,
 * usada em combate, etc., sem tocar nos dados de origem.
 *
 * Fonte atual:
 * - Livro Base, capítulo 7 (as 4 famílias de criaturas paranormais — Sangue,
 *   Morte, Conhecimento, Energia — mais as ameaças "da Realidade": criminosos,
 *   cultistas, policiais e animais).
 * - Sobrevivendo ao Horror, capítulo 3 (12 novas criaturas paranormais mais
 *   as "Novas Ameaças da Realidade": pessoas comuns, três variantes de serial
 *   killer e animais).
 * - Arquivos Secretos 01, seção "Os Transtornados" (o culto e seus NPCs, com
 *   rituais de Sangue/Conhecimento como ações) mais o conteúdo bônus de
 *   Hexatombe (Cleo Brisa e Cristino).
 * - Arquivos Secretos 02 (Hexatombe): as "Ameaças do Hexatombe" (2 animais
 *   mundanos e as suas 4 evoluções corrompidas pelo Sangue) mais "Os
 *   Mascarados" — 6 identidades civis com o respetivo alter-ego desperto
 *   (Jonas Aguiar/Mutilador Noturno, Dalmo Magno/Colosso, Jae-Yoon/X,
 *   Kemi/Fantasma, Labirinto/Labirinto (Forma Suprema), Juan/Juan Diabólico)
 *   e 5 agentes de identidade única (Jasper, Lena Viegas, Maria Helena
 *   Rodrigues, Remi, Tuco Belez).
 * - Arquivos Secretos 03 (Hexatombe): o PSIKOLERA — 5 integrantes mascarados
 *   da banda (Alê, Caio, Eloy, Franco, Cindy); Escarlata e 5 devotos dela
 *   (Ana, Argano, Chispa, Torvo, Miasma); Os Pássaros/B.I.R.D.S. — equipe
 *   mercenária de 5 membros com codinomes de ave (Harpia, Coruja, Corvo,
 *   Papagaio, Pomba); e 2 ameaças avulsas sem ligação às outras tramas
 *   (Caíto Rocha, Suellen).
 * - Arquivos Secretos 04: a Produção do Anfitrião — 3 fichas de "PESSOA"
 *   genéricas por escalão (Assistente de Produção, Produtor, Diretor) mais
 *   a criatura paranormal Simulacro.EXE (Energia + Conhecimento).
 * - Arquivos Secretos 05: Os Alheios — Hospedeiro Parasitado (a "PESSOA"
 *   infectada, com as 4 variações de ocupação num único bloco de
 *   habilidade) e 9 criaturas paranormais do descritor oficial
 *   "Transmissão" (Hospedeiro Aflorado, Interflorado, Fummu, Doppelganger
 *   Civil/Combatente/Cultista, Bilu, Rastropoda, Memoflígico).
 * - Arquivos Secretos 06: pacote "Indústrias Panacea" — 3 fichas de
 *   "PESSOA" (Cientista, Manda-Chuva, Segurança da Panacea) mais 4
 *   criaturas paranormais Energia+Sangue/Morte+Sangue criadas por ela
 *   (Hikikomori, Marca-Passo, Estímulo, Experimento Ssabáka).
 */
import { novoId } from '../../engine/armazenamento.js';
import { AMEACAS_LB_SANGUE } from './livroBase/sangue.js';
import { AMEACAS_LB_MORTE } from './livroBase/morte.js';
import { AMEACAS_LB_CONHECIMENTO } from './livroBase/conhecimento.js';
import { AMEACAS_LB_ENERGIA } from './livroBase/energia.js';
import { AMEACAS_LB_MUNDANAS } from './livroBase/mundanas.js';
import { AMEACAS_SAH_PARANORMAIS } from './sobrevivendoAoHorror/paranormais.js';
import { AMEACAS_SAH_MUNDANAS } from './sobrevivendoAoHorror/mundanas.js';
import { AMEACAS_AS01_TRANSTORNADOS } from './arquivosSecretos01/transtornados.js';
import { AMEACAS_AS02_ANIMAIS } from './arquivosSecretos02/animais.js';
import { AMEACAS_AS02_MASCARADOS_1 } from './arquivosSecretos02/mascarados-parte1.js';
import { AMEACAS_AS02_MASCARADOS_2 } from './arquivosSecretos02/mascarados-parte2.js';
import { AMEACAS_AS03_PSIKOLERA } from './arquivosSecretos03/psikolera.js';
import { AMEACAS_AS03_ESCARLATA } from './arquivosSecretos03/escarlata-e-devotos.js';
import { AMEACAS_AS03_PASSAROS } from './arquivosSecretos03/os-passaros.js';
import { AMEACAS_AS03_AVULSAS } from './arquivosSecretos03/avulsas.js';
import { AMEACAS_AS04_PRODUCAO } from './arquivosSecretos04/producao-do-anfitriao.js';
import { AMEACAS_AS05_ALHEIOS } from './arquivosSecretos05/os-alheios.js';
import { AMEACAS_AS06_PANACEA } from './arquivosSecretos06/panacea.js';

const PARANORMAIS_LB = [
  ...AMEACAS_LB_SANGUE,
  ...AMEACAS_LB_MORTE,
  ...AMEACAS_LB_CONHECIMENTO,
  ...AMEACAS_LB_ENERGIA,
].map((a) => ({ ...a, livro: 'Livro Base', categoria: a.categoria || 'Ameaça Paranormal' }));

const MUNDANAS_LB = AMEACAS_LB_MUNDANAS.map((a) => ({ ...a, livro: 'Livro Base' }));

const PARANORMAIS_SAH = AMEACAS_SAH_PARANORMAIS.map((a) => ({
  ...a,
  livro: 'Sobrevivendo ao Horror',
  categoria: a.categoria || 'Ameaça Paranormal',
}));

const MUNDANAS_SAH = AMEACAS_SAH_MUNDANAS.map((a) => ({ ...a, livro: 'Sobrevivendo ao Horror' }));

const TRANSTORNADOS_AS01 = AMEACAS_AS01_TRANSTORNADOS.map((a) => ({ ...a, livro: 'Arquivos Secretos 01' }));

const HEXATOMBE_AS02 = [
  ...AMEACAS_AS02_ANIMAIS,
  ...AMEACAS_AS02_MASCARADOS_1,
  ...AMEACAS_AS02_MASCARADOS_2,
].map((a) => ({ ...a, livro: 'Arquivos Secretos 02' }));

const HEXATOMBE_AS03 = [
  ...AMEACAS_AS03_PSIKOLERA,
  ...AMEACAS_AS03_ESCARLATA,
  ...AMEACAS_AS03_PASSAROS,
  ...AMEACAS_AS03_AVULSAS,
].map((a) => ({ ...a, livro: 'Arquivos Secretos 03' }));

const ANFITRIAO_AS04 = AMEACAS_AS04_PRODUCAO.map((a) => ({ ...a, livro: 'Arquivos Secretos 04' }));

const OS_ALHEIOS_AS05 = AMEACAS_AS05_ALHEIOS.map((a) => ({ ...a, livro: 'Arquivos Secretos 05' }));

const PANACEA_AS06 = AMEACAS_AS06_PANACEA.map((a) => ({ ...a, livro: 'Arquivos Secretos 06' }));

/** Todas as entradas do compêndio oficial, de todos os livros já processados. */
export const COMPENDIO_AMEACAS = [
  ...PARANORMAIS_LB,
  ...MUNDANAS_LB,
  ...PARANORMAIS_SAH,
  ...MUNDANAS_SAH,
  ...TRANSTORNADOS_AS01,
  ...HEXATOMBE_AS02,
  ...HEXATOMBE_AS03,
  ...ANFITRIAO_AS04,
  ...OS_ALHEIOS_AS05,
  ...PANACEA_AS06,
];

/** Livros representados no compêndio, para o filtro por livro. */
export const LIVROS_COMPENDIO = [...new Set(COMPENDIO_AMEACAS.map((a) => a.livro))];

/** Categorias representadas (Ameaça Paranormal, Pessoa, Animal, Animal (Enxame)...). */
export const CATEGORIAS_COMPENDIO = [...new Set(COMPENDIO_AMEACAS.map((a) => a.categoria).filter(Boolean))];

/** Descritores usados (Sangue, Morte, Conhecimento, Energia...), para o filtro por descritor. */
export const DESCRITORES_COMPENDIO = [...new Set(COMPENDIO_AMEACAS.flatMap((a) => a.descritores || []))].sort();

/**
 * Clona uma entrada do compêndio oficial (só leitura) para uma nova ameaça
 * editável e independente, pronta a guardar no Bestiário do utilizador com
 * `guardarAgente`. Fica marcada com `origemCompendio` (id original + fonte),
 * para se saber de onde veio, mas a partir daqui é uma cópia normal — editar,
 * apagar ou usar em combate não mexe na entrada original do compêndio.
 */
export function clonarAmeacaOficial(oficial) {
  const { id, flavorText, fonte, notas, ...resto } = oficial;
  return {
    ...resto,
    id: novoId(),
    tipo: 'ameaca',
    tags: [],
    origemCompendio: { id: oficial.id, fonte },
    // Algumas entradas (ex.: Espectro Inesquecido) têm tanto uma "flavorText"
    // curta quanto "notas" com regras extensas — nenhuma pode ser descartada
    // ao clonar, por isso as duas são concatenadas em vez de a segunda
    // sobrescrever a primeira.
    notas: [flavorText, notas].filter(Boolean).join('\n\n'),
  };
}
