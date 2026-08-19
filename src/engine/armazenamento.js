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
