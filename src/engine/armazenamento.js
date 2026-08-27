/**
 * Guarda os agentes no browser (localStorage). Sem servidor: os dados ficam
 * na máquina de quem usa a app. Para levar para outro computador, usa o
 * exportar/importar JSON.
 */
import { VERSAO_FICHA } from './character.js';

const CHAVE = 'op-ficha:agentes:v1';

function ler() {
  try {
    const cru = localStorage.getItem(CHAVE);
    const dados = cru ? JSON.parse(cru) : [];
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function escrever(lista) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
    return true;
  } catch {
    return false;
  }
}

export function novoId() {
  return 'ag-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

export function listarAgentes() {
  return ler().sort((a, b) => (b.atualizadoEm || 0) - (a.atualizadoEm || 0));
}

export function obterAgente(id) {
  return ler().find((a) => a.id === id) || null;
}

export function guardarAgente(personagem) {
  const lista = ler();
  const id = personagem.id || novoId();
  const registo = { ...personagem, id, versao: VERSAO_FICHA, atualizadoEm: Date.now() };
  const i = lista.findIndex((a) => a.id === id);
  if (i >= 0) lista[i] = registo;
  else lista.push(registo);
  escrever(lista);
  return registo;
}

export function apagarAgente(id) {
  escrever(ler().filter((a) => a.id !== id));
}

export function apagarVariosAgentes(ids) {
  const set = new Set(ids);
  escrever(ler().filter((a) => !set.has(a.id)));
}

export function duplicarAgente(id) {
  const original = obterAgente(id);
  if (!original) return null;
  return guardarAgente({ ...original, id: novoId(), nome: `${original.nome || 'Agente'} (cópia)` });
}

// ---------- exportar / importar ----------

export function exportarJson(personagem) {
  const blob = new Blob([JSON.stringify(personagem, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(personagem.nome || 'agente').replace(/[^\w\-À-ÿ ]+/g, '') || 'agente'}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function importarJson(ficheiro) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => {
      try {
        const dados = JSON.parse(leitor.result);
        if (!dados || typeof dados !== 'object' || !dados.atributos) throw new Error('Ficheiro não parece uma ficha.');
        resolve(guardarAgente({ ...dados, id: novoId() }));
      } catch (e) {
        reject(e);
      }
    };
    leitor.onerror = () => reject(new Error('Não foi possível ler o ficheiro.'));
    leitor.readAsText(ficheiro);
  });
}

// ------------------------------------------------ cópia de segurança total

/**
 * CÓPIA DE SEGURANÇA
 *
 * Os agentes vivem só no localStorage deste browser. Limpar dados do site,
 * trocar de máquina ou abrir numa janela privada faz desaparecer tudo, sem
 * aviso — e não há servidor nenhum a segurar a queda.
 *
 * Estas funções exportam e reimportam a coleção INTEIRA num só ficheiro.
 * O formato leva um cabeçalho para se saber de onde veio e quando:
 *
 *   { tipo: 'ordo:copia', versao, guardadoEm, total, agentes: [...] }
 */
export const TIPO_COPIA = 'ordo:copia';

function descarregar(nome, texto) {
  const blob = new Blob([texto], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Data no nome do ficheiro, para as cópias ficarem ordenadas sozinhas. */
function carimbo() {
  const d = new Date();
  const dois = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}-${dois(d.getHours())}${dois(d.getMinutes())}`;
}

/** Exporta TODOS os agentes num único ficheiro. Devolve quantos foram. */
export function exportarTudo() {
  const agentes = ler();
  const pacote = {
    tipo: TIPO_COPIA,
    versao: VERSAO_FICHA,
    guardadoEm: new Date().toISOString(),
    total: agentes.length,
    agentes,
  };
  descarregar(`ordo-copia-${carimbo()}.json`, JSON.stringify(pacote, null, 2));
  return agentes.length;
}

/**
 * Importa um ficheiro — aceita tanto uma cópia completa como uma ficha
 * solta, para o mesmo botão servir para os dois casos.
 *
 * `modo`:
 *   'juntar'     — acrescenta aos que já existem (por omissão). Nunca
 *                  sobrepõe: cada agente entra com id novo.
 *   'substituir' — apaga o que está e fica só com o do ficheiro.
 *
 * Devolve `{ importados, modo, total }`.
 */
export function importarCopia(ficheiro, modo = 'juntar') {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => {
      try {
        const dados = JSON.parse(leitor.result);
        let agentes;
        if (dados && dados.tipo === TIPO_COPIA && Array.isArray(dados.agentes)) {
          agentes = dados.agentes;
        } else if (Array.isArray(dados)) {
          agentes = dados;                       // lista solta
        } else if (dados && typeof dados === 'object' && dados.atributos) {
          agentes = [dados];                     // uma ficha só
        } else {
          throw new Error('Este ficheiro não é uma cópia do Ordo nem uma ficha.');
        }

        const validos = agentes.filter((a) => a && typeof a === 'object' && a.atributos);
        if (validos.length === 0) throw new Error('O ficheiro não tem nenhuma ficha reconhecível.');

        const base = modo === 'substituir' ? [] : ler();
        // id novo em todos: evita colisões com quem já cá está e torna a
        // importação sempre segura de repetir.
        const novos = validos.map((a) => ({ ...a, id: novoId() }));
        escrever([...base, ...novos]);
        resolve({ importados: novos.length, modo, total: base.length + novos.length });
      } catch (e) {
        reject(e);
      }
    };
    leitor.onerror = () => reject(new Error('Não foi possível ler o ficheiro.'));
    leitor.readAsText(ficheiro);
  });
}

// -------------------------------------------- lembrete de cópia de segurança

const CHAVE_COPIA = 'ordo:ultima-copia';

/** Quando foi a última cópia (ISO), ou null se nunca houve. */
export function ultimaCopia() {
  try { return localStorage.getItem(CHAVE_COPIA); } catch { return null; }
}

export function marcarCopiaFeita() {
  try { localStorage.setItem(CHAVE_COPIA, new Date().toISOString()); } catch { /* ignora */ }
}

/**
 * Deve mostrar-se o lembrete? Só com agentes guardados, e se nunca houve
 * cópia ou a última já leva mais de 14 dias. Sem agentes não há nada a
 * perder, e o aviso só seria ruído.
 */
export function precisaDeCopia(dias = 14) {
  if (ler().length === 0) return false;
  const ultima = ultimaCopia();
  if (!ultima) return true;
  const passou = Date.now() - new Date(ultima).getTime();
  return !Number.isFinite(passou) || passou > dias * 24 * 60 * 60 * 1000;
}

/** Tamanho máximo para guardar um GIF/animação tal como está (o localStorage é pequeno). */
export const LIMITE_ANIMACAO = 1.6 * 1024 * 1024;

/**
 * Lê uma imagem escolhida pelo utilizador e devolve um data URL.
 * GIFs (e outras animações) são guardados tal como estão, para não perderem o
 * movimento; o resto é redimensionado para não encher o armazenamento.
 */
export function lerImagem(ficheiro, lado = 320) {
  const animado = /gif|webp|apng/i.test(ficheiro.type);
  if (animado) {
    if (ficheiro.size > LIMITE_ANIMACAO) {
      return Promise.reject(new Error(
        `A animação tem ${(ficheiro.size / 1024 / 1024).toFixed(1)} MB. O máximo é ${(LIMITE_ANIMACAO / 1024 / 1024).toFixed(1)} MB — corta ou reduz o GIF.`
      ));
    }
    return new Promise((resolve, reject) => {
      const leitor = new FileReader();
      leitor.onload = () => resolve(leitor.result);
      leitor.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
      leitor.readAsDataURL(ficheiro);
    });
  }
  return redimensionar(ficheiro, lado);
}

function redimensionar(ficheiro, lado = 320) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => {
      const img = new Image();
      img.onload = () => {
        const escala = Math.min(lado / img.width, lado / img.height, 1);
        const l = Math.round(img.width * escala);
        const a = Math.round(img.height * escala);
        const canvas = document.createElement('canvas');
        canvas.width = l;
        canvas.height = a;
        canvas.getContext('2d').drawImage(img, 0, 0, l, a);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error('Imagem inválida.'));
      img.src = leitor.result;
    };
    leitor.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    leitor.readAsDataURL(ficheiro);
  });
}

/**
 * Token do agente: a imagem fica em pé sobre o pedestal, por isso vale a pena
 * (1) cortar as margens lisas — as barras pretas de screenshots de telemóvel, o
 * branco à volta de um desenho a traço — e (2) tirar o fundo chapado, para a
 * figura não ficar num retângulo colado à pedra.
 * GIFs ficam intactos, para não perderem a animação.
 */
export function lerToken(ficheiro, lado = 900) {
  const animado = /gif|apng/i.test(ficheiro.type);
  if (animado) return lerImagem(ficheiro, lado);

  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => {
      const img = new Image();
      img.onload = () => {
        try {
          const c = document.createElement('canvas');
          c.width = img.width;
          c.height = img.height;
          const ctx = c.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(img, 0, 0);
          const caixa = caixaUtil(ctx.getImageData(0, 0, img.width, img.height).data, img.width, img.height);

          const escala = Math.min(lado / caixa.largura, lado / caixa.altura, 1);
          const l = Math.max(1, Math.round(caixa.largura * escala));
          const a = Math.max(1, Math.round(caixa.altura * escala));
          const saida = document.createElement('canvas');
          saida.width = l;
          saida.height = a;
          const sctx = saida.getContext('2d', { willReadFrequently: true });
          sctx.drawImage(img, caixa.x, caixa.y, caixa.largura, caixa.altura, 0, 0, l, a);
          recortarFundo(sctx, l, a);
          resolve(saida.toDataURL('image/png'));
        } catch {
          // canvas "sujo" ou imagem estranha: fica como está
          resolve(leitor.result);
        }
      };
      img.onerror = () => reject(new Error('Imagem inválida.'));
      img.src = leitor.result;
    };
    leitor.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    leitor.readAsDataURL(ficheiro);
  });
}

/** Cor mais repetida de uma lista de pixéis (índices no array de dados). */
function corDominante(d, indices) {
  const baldes = new Map();
  for (const i of indices) {
    if (d[i + 3] < 24) continue;
    const chave = (d[i] >> 4) * 256 + (d[i + 1] >> 4) * 16 + (d[i + 2] >> 4);
    const b = baldes.get(chave);
    if (b) { b.n++; b.r += d[i]; b.g += d[i + 1]; b.b += d[i + 2]; }
    else baldes.set(chave, { n: 1, r: d[i], g: d[i + 1], b: d[i + 2] });
  }
  let melhor = null;
  for (const b of baldes.values()) if (!melhor || b.n > melhor.n) melhor = b;
  if (!melhor) return null;
  return { r: melhor.r / melhor.n, g: melhor.g / melhor.n, b: melhor.b / melhor.n, fracao: melhor.n };
}

/**
 * Corta margens de cor lisa, lado a lado e em camadas: primeiro as barras
 * pretas de um screenshot, depois o branco do papel à volta do desenho.
 * Cada lado usa a cor da sua própria borda, por isso não se atrapalham.
 */
function caixaUtil(d, largura, altura) {
  const caixa = { x0: 0, y0: 0, x1: largura - 1, y1: altura - 1 };
  const idx = (x, y) => (y * largura + x) * 4;

  const pixeisDaLinha = (y) => {
    const out = [];
    for (let x = caixa.x0; x <= caixa.x1; x += 2) out.push(idx(x, y));
    return out;
  };
  const pixeisDaColuna = (x) => {
    const out = [];
    for (let y = caixa.y0; y <= caixa.y1; y += 2) out.push(idx(x, y));
    return out;
  };
  // uma linha/coluna é "lisa" se quase toda ela for da sua cor dominante
  const lisa = (indices) => {
    if (!indices.length) return false;
    const cor = corDominante(d, indices);
    if (!cor) return true;                      // toda transparente
    let dentro = 0;
    for (const i of indices) {
      if (d[i + 3] < 24) { dentro++; continue; }
      if (Math.abs(d[i] - cor.r) < 30 && Math.abs(d[i + 1] - cor.g) < 30 && Math.abs(d[i + 2] - cor.b) < 30) dentro++;
    }
    return dentro / indices.length >= 0.985;
  };

  const limiteV = Math.floor(altura * 0.45);
  const limiteH = Math.floor(largura * 0.45);
  while (caixa.y0 < limiteV && caixa.y0 < caixa.y1 && lisa(pixeisDaLinha(caixa.y0))) caixa.y0++;
  while (altura - 1 - caixa.y1 < limiteV && caixa.y1 > caixa.y0 && lisa(pixeisDaLinha(caixa.y1))) caixa.y1--;
  while (caixa.x0 < limiteH && caixa.x0 < caixa.x1 && lisa(pixeisDaColuna(caixa.x0))) caixa.x0++;
  while (largura - 1 - caixa.x1 < limiteH && caixa.x1 > caixa.x0 && lisa(pixeisDaColuna(caixa.x1))) caixa.x1--;

  const l = caixa.x1 - caixa.x0 + 1;
  const a = caixa.y1 - caixa.y0 + 1;
  if (l < largura * 0.1 || a < altura * 0.1) return { x: 0, y: 0, largura, altura };

  // uma pequena folga, para não roçar no traço
  const folga = Math.max(1, Math.round(Math.min(l, a) * 0.01));
  const x = Math.max(0, caixa.x0 - folga);
  const y = Math.max(0, caixa.y0 - folga);
  return {
    x, y,
    largura: Math.min(largura - x, l + folga * 2),
    altura: Math.min(altura - y, a + folga * 2),
  };
}

/**
 * Tira o fundo chapado (o branco de um desenho a traço, o preto de um render).
 * Só o faz quando a moldura é mesmo de uma cor só e essa cor é quase branca ou
 * quase preta — assim fotografias e artes com cenário ficam intactas.
 */
function recortarFundo(ctx, largura, altura) {
  const imagem = ctx.getImageData(0, 0, largura, altura);
  const d = imagem.data;
  const moldura = [];
  for (let x = 0; x < largura; x += 2) { moldura.push((0 * largura + x) * 4, ((altura - 1) * largura + x) * 4); }
  for (let y = 0; y < altura; y += 2) { moldura.push((y * largura) * 4, (y * largura + largura - 1) * 4); }
  const cor = corDominante(d, moldura);
  if (!cor) return;

  const perto = (i, tol) =>
    Math.abs(d[i] - cor.r) < tol && Math.abs(d[i + 1] - cor.g) < tol && Math.abs(d[i + 2] - cor.b) < tol;

  // a moldura tem de ser quase toda da mesma cor
  let total = 0, iguais = 0;
  const conta = (x, y) => { const i = (y * largura + x) * 4; total++; if (d[i + 3] < 24 || perto(i, 26)) iguais++; };
  for (let x = 0; x < largura; x += 2) { conta(x, 0); conta(x, altura - 1); }
  for (let y = 0; y < altura; y += 2) { conta(0, y); conta(largura - 1, y); }
  if (!total || iguais / total < 0.85) return;

  // e tem de ser branco ou preto chapado
  const luz = (cor.r + cor.g + cor.b) / 3;
  if (luz > 34 && luz < 224) return;

  // apagar a partir das bordas, para não abrir buracos no meio do desenho
  const visto = new Uint8Array(largura * altura);
  const pilha = [];
  for (let x = 0; x < largura; x++) { pilha.push(x, 0, x, altura - 1); }
  for (let y = 0; y < altura; y++) { pilha.push(0, y, largura - 1, y); }
  while (pilha.length) {
    const y = pilha.pop();
    const x = pilha.pop();
    if (x < 0 || y < 0 || x >= largura || y >= altura) continue;
    const p = y * largura + x;
    if (visto[p]) continue;
    const i = p * 4;
    if (d[i + 3] >= 24 && !perto(i, 36)) continue;
    visto[p] = 1;
    d[i + 3] = 0;
    pilha.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
  }

  // suavizar a orla
  for (let y = 1; y < altura - 1; y++) {
    for (let x = 1; x < largura - 1; x++) {
      const p = y * largura + x;
      if (visto[p]) continue;
      const i = p * 4;
      if (!perto(i, 52)) continue;
      const vizinhos = visto[p - 1] + visto[p + 1] + visto[p - largura] + visto[p + largura];
      if (vizinhos) d[i + 3] = Math.round(d[i + 3] * (1 - vizinhos / 4) * 0.8);
    }
  }
  ctx.putImageData(imagem, 0, 0);
}
