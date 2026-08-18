/**
 * Gestão das perícias concedidas automaticamente pela origem e pela classe.
 * Guardamos a lista de ids concedidos por cada fonte para conseguir retirar
 * o treino quando o jogador troca de origem ou de classe.
 */

export function aplicarConcessoes(personagem, fonte, novasPericias) {
  const concedidas = { origem: [], classe: [], ...(personagem.concedidas || {}) };
  const anteriores = concedidas[fonte] || [];
  const pericias = { ...personagem.pericias };

  // retirar o treino das anteriores, se não vierem de outra fonte
  const outrasFontes = Object.entries(concedidas)
    .filter(([k]) => k !== fonte)
    .flatMap(([, v]) => v);

  for (const id of anteriores) {
    if (!novasPericias.includes(id) && !outrasFontes.includes(id) && pericias[id]) {
      pericias[id] = { ...pericias[id], grau: 'destreinado' };
    }
  }

  for (const id of novasPericias) {
    if (pericias[id] && pericias[id].grau === 'destreinado') {
      pericias[id] = { ...pericias[id], grau: 'treinado' };
    }
  }

  return { ...personagem, pericias, concedidas: { ...concedidas, [fonte]: [...novasPericias] } };
}
