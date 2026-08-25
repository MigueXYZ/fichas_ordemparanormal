import { PDFDocument, PDFName, PDFBool } from 'pdf-lib';
import { PERICIAS } from '../data/pericias.js';
import { ORIGENS } from '../data/origens.js';
import { TRILHAS_POR_ID } from '../data/classes.js';
import { calcMaximos, calcDefesas, calcPericias, calcPePorRodada, calcCargaMaxima, calcDtRitual } from '../engine/calc.js';
import { codigoOrigem, codigoTrilha, CLASSES_PDF } from '../data/pdfCodigos.js';
import { PROTECOES } from '../data/itens.js';
import { TIPOS_DANO_POR_ID } from '../engine/danoRecetor.js';

const URL_TEMPLATE = `${import.meta.env?.BASE_URL ?? '/'}ficha-template.pdf`;

function setTexto(form, nome, valor) {
  try {
    const campo = form.getTextField(nome);
    campo.setText(valor === null || valor === undefined ? '' : String(valor));
  } catch { /* campo inexistente nesta versão do PDF */ }
}

function setEscolha(form, nome, valor) {
  if (valor === null || valor === undefined) return;
  try {
    form.getDropdown(nome).select(String(valor));
  } catch {
    try { form.getOptionList(nome).select(String(valor)); } catch { /* ignora */ }
  }
}

/** Constrói o mapa completo campo-do-PDF -> valor a partir do personagem. */
export function mapearCampos(personagem) {
  const max = calcMaximos(personagem);
  const pericias = calcPericias(personagem);
  const textos = {};
  const escolhas = {};

  textos['Nome do Personagem'] = personagem.nome;
  textos['Nome'] = personagem.jogador;
  textos['NivelExposicao'] = personagem.nex;
  textos['deslocamento'] = personagem.deslocamento;
  textos['patente'] = personagem.patente;
  textos['pontos_prestigio'] = personagem.pontosPrestigio;
  textos['LIMITE DE'] = personagem.creditoLimite;

  for (const [id, valor] of Object.entries(personagem.atributos)) textos['atr_' + id] = valor;

  textos['PV'] = max.pv;
  textos['pv_atual'] = personagem.pvAtual ?? max.pv;
  textos['pv_extra'] = personagem.pvExtra || 0;
  if (max.semSanidade) {
    // A ficha oficial não tem campo de Determinação: os PD vão para o de Esforço.
    textos['San'] = '';
    textos['san_atual'] = '';
    textos['san_extra'] = '';
    textos['PE'] = max.pd;
    textos['pe_atual'] = personagem.pdAtual ?? max.pd;
    textos['pe_extra'] = personagem.pdExtra || 0;
  } else {
    textos['San'] = max.san;
    textos['san_atual'] = personagem.sanAtual ?? max.san;
    textos['san_extra'] = personagem.sanExtra || 0;
    textos['PE'] = max.pe;
    textos['pe_atual'] = personagem.peAtual ?? max.pe;
    textos['pe_extra'] = personagem.peExtra || 0;
  }
  textos['pe_rodada'] = calcPePorRodada(personagem);

  const defs = calcDefesas(personagem);
  // defs.defesa já respeita o valor escrito à mão (defesaManual), tal como
  // acontece com o bloqueio/esquiva abaixo — o PDF deve refletir o que a
  // ficha mostra, não só o automático.
  textos['defesa'] = defs.defesa;
  textos['def_extra'] = personagem.defesaOutros || 0;

  // Proteção/Resistências/Proficiências passaram a checkboxes na ficha —
  // para um PDF (campo de texto) juntam-se numa frase legível. `setTexto`
  // já ignora em silêncio campos que não existam nesta versão do modelo,
  // por isso é seguro tentar mesmo sem confirmar que o template os tem.
  textos['protecao'] = (personagem.protecao || [])
    .map((id) => PROTECOES.find((p) => p.id === id)?.nome).filter(Boolean).join(', ');
  // Resistências: cada entrada é um id puro de TIPOS_DANO (½ dano, sem
  // número — troca-se pelo nome legível) ou já vem como texto "Nome N" (com
  // número, RD fixa) — ver engine/danoRecetor.js → repartirResistenciasFicha.
  textos['resistencias'] = (personagem.resistencias || [])
    .map((entrada) => TIPOS_DANO_POR_ID[entrada]?.nome || entrada).filter(Boolean).join(', ');
  textos['proficiencias'] = (personagem.proficiencias || []).join(', ');

  textos['esquiva'] = defs.esquiva.disponivel ? defs.esquiva.valor : 0;
  textos['dt_ritual'] = calcDtRitual(personagem);

  for (const p of pericias) {
    escolhas['t_' + p.pdf] = String(p.treino);
    textos['o_' + p.pdf] = p.outros || 0;
    textos['b_' + p.pdf] = p.bonus;
  }

  const nomeOrigem = personagem.origemId === '__custom__'
    ? personagem.origemCustom?.nome
    : ORIGENS.find((o) => o.id === personagem.origemId)?.nome;
  const cod = codigoOrigem(nomeOrigem);
  if (cod) escolhas['origem'] = cod;

  if (personagem.classeId && CLASSES_PDF[personagem.classeId]) {
    escolhas['classe'] = CLASSES_PDF[personagem.classeId];
  }
  const nomeTrilha = personagem.trilhaId ? TRILHAS_POR_ID[personagem.trilhaId]?.nome : null;
  const trilha = codigoTrilha(personagem.classeId, nomeTrilha);
  if (trilha) {
    escolhas[trilha.campo] = trilha.codigo;
    // o campo visível da trilha no PDF é este (os dropdowns só aparecem via JS)
    textos['avisotrilhanex'] = trilha.codigo;
  }

  (personagem.ataques || []).slice(0, 6).forEach((a, i) => {
    textos[`atq_name${i}`] = a.nome;
    textos[`dano_arma${i}`] = a.dano;
    textos[`critico_arma${i}`] = a.critico;
    textos[`alcance_arma${i}`] = a.alcance;
    textos[`espaco_arma${i}`] = a.espacos;
  });

  (personagem.habilidades || []).slice(0, 12).forEach((h, i) => {
    textos[`Habilidade_${i + 1}`] = h.nome;
    textos[`Pagina_Hab_${i + 1}`] = h.pagina || '';
  });

  (personagem.rituais || []).slice(0, 36).forEach((r, i) => {
    const coluna = i % 2;
    const linha = Math.floor(i / 2);
    textos[`HABILIDADES  RITUAIS 1.${linha}.${coluna}`] = r.nome;
    textos[`Custo 1.${linha}.${coluna}`] = r.custo;
    textos[`Página 1.${linha}.${coluna}`] = r.pagina || '';
  });

  (personagem.inventario || []).slice(0, 22).forEach((it, i) => {
    const idx = i < 11 ? `${i + 1}` : `${i - 10}_2`;
    const qtd = Number(it.quantidade) || 1;
    // O modelo do PDF não tem uma coluna própria de quantidade — quando há
    // mais do que 1, junta-se "×N" ao nome para não se perder a informação.
    textos[`ITEM ${idx}`] = qtd > 1 ? `${it.nome} ×${qtd}` : it.nome;
    textos[`Categoria ${idx}`] = it.categoria;
    textos[`Espaços ${idx}`] = it.espacos;
  });

  const cargaAtual = (personagem.inventario || []).reduce((s, i) => s + (Number(i.espacos) || 0) * (Number(i.quantidade) || 1), 0);
  textos['carga_atual'] = cargaAtual;
  textos['carga_max'] = calcCargaMaxima(personagem);

  const d = personagem.descricao || {};
  const blocos = [
    d.aparencia && `APARÊNCIA: ${d.aparencia}`,
    d.personalidade && `PERSONALIDADE: ${d.personalidade}`,
    d.historico && `HISTÓRICO: ${d.historico}`,
    d.objetivo && `OBJETIVO: ${d.objetivo}`,
    personagem.anotacoes && `NOTAS: ${personagem.anotacoes}`,
    // as regras opcionais não têm campo próprio na ficha oficial
    personagem.regras?.nivelSeparado && `REGRA OPCIONAL: NEX & Experiência — nível ${personagem.nivel ?? 1} (NEX ${personagem.nex}% só de exposição).`,
    personagem.regras?.semSanidade && `REGRA OPCIONAL: Jogando sem Sanidade — o campo de Esforço traz os Pontos de Determinação.`,
  ].filter(Boolean);
  textos['anotacoes'] = blocos.join('\n\n');

  return { textos, escolhas };
}

export async function gerarPdf(personagem) {
  const resposta = await fetch(URL_TEMPLATE);
  if (!resposta.ok) throw new Error('Não foi possível carregar o modelo do PDF.');
  const bytes = await resposta.arrayBuffer();

  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const form = pdf.getForm();
  const { textos, escolhas } = mapearCampos(personagem);

  for (const [nome, valor] of Object.entries(textos)) setTexto(form, nome, valor);
  for (const [nome, valor] of Object.entries(escolhas)) setEscolha(form, nome, valor);

  // faz o leitor recalcular a aparência dos campos
  form.acroForm.dict.set(PDFName.of('NeedAppearances'), PDFBool.True);

  return pdf.save({ useObjectStreams: false });
}

export async function descarregarPdf(personagem) {
  const bytes = await gerarPdf(personagem);
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(personagem.nome || 'agente').replace(/[^\w\-À-ÿ ]+/g, '')}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
