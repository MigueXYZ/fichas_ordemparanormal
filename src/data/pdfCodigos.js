// Códigos das listas do PDF oficial "Ficha Automática v2.3.3".
// Servem só para a exportação: o PDF guarda um número, não o nome.
// (Extraídos do próprio PDF.)

export const ORIGENS_PDF = [
  ['1', 'Acadêmico'], ['2', 'Agente de Saúde'], ['27', 'Amigo dos Animais'], ['3', 'Amnésico'],
  ['4', 'Artista'], ['28', 'Astronauta'], ['5', 'Atleta'], ['29', 'Chef do Outro Lado'],
  ['6', 'Chef'], ['30', 'Colegial'], ['31', 'Cosplayer'], ['7', 'Criminoso'],
  ['8', 'Cultista Arrependido'], ['9', 'Desgarrado'], ['32', 'Diplomata'], ['10', 'Engenheiro'],
  ['11', 'Executivo'], ['33', 'Experimento'], ['34', 'Explorador'], ['35', 'Fanático por Criaturas'],
  ['36', 'Fotógrafo'], ['37', 'Inventor Paranormal'], ['12', 'Investigador'], ['38', 'Jovem Místico'],
  ['39', 'Legista do Turno da Noite'], ['13', 'Lutador'], ['14', 'Magnata'], ['40', 'Mateiro'],
  ['15', 'Mercenário'], ['41', 'Mergulhador'], ['16', 'Militar'], ['42', 'Motorista'],
  ['17', 'Operário'], ['18', 'Policial'], ['43', 'Profetizado'], ['44', 'Psicólogo'],
  ['19', 'Religioso'], ['27', 'Repórter Investigativo'], ['20', 'Servidor Público'], ['22', 'T.I.'],
  ['21', 'Teórico da Conspiração'], ['23', 'Trabalhador Rural'], ['24', 'Trambiqueiro'],
  ['25', 'Universitário'], ['26', 'Vítima'],
];

// O PDF chama "Sobrevivente" à classe alternativa (Mundano).
export const CLASSES_PDF = {
  combatente: 'Combatente',
  especialista: 'Especialista',
  ocultista: 'Ocultista',
  sobrevivente: 'Sobrevivente',
};

// trilha1 = Combatente, trilha2 = Especialista, trilha3 = Ocultista, trilha4 = Sobrevivente
export const TRILHAS_PDF = {
  combatente: { campo: 'trilha1', opcoes: [['8','Agente Secreto'],['1','Aniquilador'],['6','Caçador'],['2','Comandante de Campo'],['3','Guerreiro'],['7','Monstruoso'],['4','Operações Especiais'],['5','Tropa de Choque']] },
  especialista: { campo: 'trilha2', opcoes: [['1','Atirador de Elite'],['6','Bibliotecário'],['2','Infiltrador'],['3','Médico de Campo'],['7','Muambeiro'],['4','Negociador'],['8','Perseverante'],['5','Técnico']] },
  ocultista: { campo: 'trilha3', opcoes: [['1','Conduíte'],['6','Exorcista'],['2','Flagelador'],['3','Graduado'],['4','Intuitivo'],['5','Lâmina Paranormal'],['7','Parapsicólogo'],['8','Possuído']] },
  sobrevivente: { campo: 'trilha4', opcoes: [['1','Durão'],['2','Esotérico'],['3','Esperto']] },
};

export const NOMES_ORIGENS_OFICIAIS = [...new Set(ORIGENS_PDF.map(([, nome]) => nome))].sort((a, b) => a.localeCompare(b, 'pt'));

// As listas do PDF são preenchidas pelo texto visível (é assim que os leitores
// de PDF mostram o valor). Estas funções validam o nome contra a lista oficial.
export function codigoOrigem(nome) {
  if (!nome) return null;
  const alvo = nome.trim().toLowerCase();
  const achado = ORIGENS_PDF.find(([, n]) => n.toLowerCase() === alvo);
  return achado ? achado[1] : null;
}

export function codigoTrilha(classeId, nome) {
  const t = TRILHAS_PDF[classeId];
  if (!t || !nome) return null;
  const alvo = String(nome).trim().toLowerCase();
  const achado = t.opcoes.find(([, n]) => n.toLowerCase() === alvo);
  return achado ? { campo: t.campo, codigo: achado[1] } : null;
}
