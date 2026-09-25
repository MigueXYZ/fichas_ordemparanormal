import React, { useRef, useState } from 'react';
import { lerFichasDeTexto } from '../../engine/fichaLivre.js';

/**
 * "Importar ficha (.json)" — lê uma ou várias fichas da ficha editável
 * (Ficha_NPC_Ordem_Editavel.html) e guarda cada uma no sítio certo: os NPCs
 * vão para o Elenco e as ameaças para o Bestiário (quem decide é o `tipo` da
 * ficha, não a aba onde o botão foi carregado). Cada ficha entra com id
 * novo, por isso importar duas vezes cria duas cópias, nunca sobrepõe.
 */
export default function BotaoImportarFichas({ aoGuardar }) {
  const input = useRef(null);
  const [aviso, setAviso] = useState(null); // { ok: bool, texto }

  async function importar(ficheiros) {
    const entradas = [];
    const recusados = [];
    for (const ficheiro of ficheiros) {
      try {
        const fichas = lerFichasDeTexto(await ficheiro.text());
        if (fichas.length === 0) recusados.push(ficheiro.name);
        for (const f of fichas) {
          aoGuardar(f);
          entradas.push(`${f.nome} (${f.tipo === 'ameaca' ? 'Bestiário' : 'Elenco'})`);
        }
      } catch {
        recusados.push(ficheiro.name);
      }
    }
    const partes = [];
    if (entradas.length) partes.push(`Importado: ${entradas.join(', ')}.`);
    if (recusados.length) partes.push(`Não reconheci ${recusados.join(', ')} como ficha de NPC/ameaça.`);
    setAviso({ ok: recusados.length === 0, texto: partes.join(' ') });
  }

  return (
    <>
      <button type="button" className="btn ghost" onClick={() => input.current?.click()} title="Fichas .json feitas na ficha editável de NPC/Ameaça">
        Importar ficha (.json)
      </button>
      <input
        ref={input}
        type="file"
        accept=".json,application/json"
        multiple
        hidden
        onChange={(e) => { const fs = [...e.target.files]; e.target.value = ''; if (fs.length) importar(fs); }}
      />
      {aviso && (
        <p className="dica" style={{ width: '100%', margin: '4px 0 0', color: aviso.ok ? undefined : 'var(--sangue-claro)' }}>
          {aviso.texto}
        </p>
      )}
    </>
  );
}
