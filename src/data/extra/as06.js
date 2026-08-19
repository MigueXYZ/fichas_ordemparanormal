// Arquivos Secretos 6 (Pacote #6 — A Corporação / Indústrias Panacea)
// Fonte: "Arquivos-Secretos-06-v1.1.pdf" (84 páginas, Jambô, Junho/2026, v1.1).
//
// RESULTADO DA VERIFICAÇÃO: este pacote NÃO traz nenhuma trilha nova nem
// nenhuma origem nova para a app. Ambos os arrays ficam vazios de propósito.
//
// O que foi verificado (as 84 páginas foram extraídas — 84 quebras de página
// no dump de texto; páginas críticas reextraídas com `pdftotext -layout`):
//
//  - SUMÁRIO (p. 3): o livro tem quatro secções — "Documentos" (pp. 4-53),
//    "Ameaças Experimentais" (pp. 54-63), "Regras Intoxicantes" (pp. 64-77)
//    e "Mural dos Agentes" (p. 78+). Só a secção de regras pode conter
//    origens/trilhas.
//
//  - A contracapa/abertura da secção de regras (p. 65) anuncia "origens,
//    poderes, ritual, itens, doenças, venenos e uma nova regra opcional!".
//    Repare-se que NÃO menciona trilhas.
//
//  - ORIGENS (p. 66): existem exatamente três, e as três já estão na app:
//      · Cientista Ex-Panacea (Atualidades e Ciências; poder "Existe uma
//        Explicação") → id existente `cientista-ex-panacea`
//      · Segurança Ex-Panacea (Luta e Pontaria; poder "Técnicas de
//        Contenção") → id existente `seguranca-ex-panacea`
//      · Cobaia Sobrevivente (Fortitude e Vontade; poder "Forças para
//        Enfrentar") → id existente `cobaia-sobrevivente`
//    No ficheiro inteiro só há 3 ocorrências de "Perícias treinadas"
//    (linhas 3430, 3445 e 3465 do texto extraído), todas nesta página. As
//    restantes ocorrências de "treinad*" são pré-requisitos de poderes
//    ("treinado em Medicina e Profissão", "treinado em Luta").
//
//  - TRILHAS: não existe nenhum cabeçalho de habilidade de trilha. Não há
//    uma única ocorrência de "NEX 10%", "NEX 40%", "NEX 65%" ou "NEX 99%"
//    como marcador de poder de trilha — as ocorrências de "NEX" no livro
//    são: limiares de imunidade em fichas de ameaça ("NEX 25% é imune",
//    "NEX 40% é imune", "NEX 60% é imune", "NEX 95% é imune"), pré-requisitos
//    de poderes paranormais ("elemento escolhido, NEX 30%/60%") e a regra
//    opcional "Poder de Classe" das pp. 77 e seguintes (que fala em ganhar
//    poderes por NEX, não em trilhas). Também não existe "nova trilha",
//    "trilha de ..." nem "habilidades de trilha"; a única ocorrência de
//    "TRILHA" é o nome de uma habilidade de ameaça ("Trilha Digital", p. 60).
//
//  - As páginas 67-70 trazem apenas poderes soltos (PODERES DE COMBATENTE,
//    DE ESPECIALISTA, DE OCULTISTA e GERAIS), não trilhas. As pp. 71-76 são
//    poderes paranormais, ritual, itens, modificações/maldições para
//    medicamentos, doenças e venenos.

export const TRILHAS_AS06 = [];

export const ORIGENS_AS06 = [];
