// Rituais — Arquivos Secretos 4 ("Regras Caóticas", p. 68).
// Texto verbatim do PDF "ArquivosSecretos04Verdadeiro.pdf". Nada foi resumido,
// traduzido ou inventado.

export const RITUAIS_AS04 = [
  {
    id: 'backup',
    nome: 'Backup',
    elemento: 'energia',
    circulo: 2,
    execucao: 'Padrão',
    alcance: 'Curto',
    alvo: 'veja texto',
    area: '',
    efeito: '',
    duracao: '24 horas',
    resistencia: '',
    descricao: 'Ao conjurar esse ritual, você cria um chamariz com a sua aparência em um espaço vazio dentro do alcance. A cópia de Energia realiza movimentos simples em repetição e pode pronunciar uma única frase à escolha. Essa cópia tem uma conexão estabelecida com você com um raio de 50km. Enquanto se mantiver dentro da área de conexão do ritual, a qualquer momento, você pode gastar uma reação para trocar de lugar com o chamariz, perdendo 2d4 SAN ao fazer isso. O ritual se dissipa se qualquer dano for causado à cópia ou se você deixar a área de conexão do ritual.',
    discente: { custo: '+2 PE', texto: 'muda a duração para permanente. Gastando uma ação padrão, você pode cobrir seus olhos e ouvidos para alternar seus sentidos entre o seu corpo original e a cópia. Você passa a ver e ouvir através dos olhos e ouvidos da cópia até descobrir seus olhos ou ouvidos. Enquanto faz isso, você fica cego, surdo e pasmo.', requer: '2º círculo' },
    verdadeiro: { custo: '+5 PE', texto: 'Como na versão discente, mas quando cobre olhos e ouvidos, você também pode falar através da cópia e escolher a aparência dela com base em alguém que já tenha visto e saiba descrever. Além disso, quando você optar por trocar de lugar com a cópia, pode escolher dissipar o ritual, causando 6d6 pontos de dano de Energia (Reflexos reduz o dano à metade) em todos os seres em alcance curto de onde seu corpo saiu e de onde ele aparece.', requer: '3º círculo' },
    livro: 'Arquivos Secretos 4',
  },
];

export default RITUAIS_AS04;
