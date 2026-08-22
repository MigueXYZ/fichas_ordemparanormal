import React, { useState, useRef, useEffect } from 'react';
import { listarAgentes } from '../engine/armazenamento.js';

/**
 * Obtém todas as tags únicas usadas em todos os personagens guardados.
 */
export function obterTodasAsTags() {
  try {
    const agentes = listarAgentes();
    const tagsSet = new Set();
    for (const a of agentes) {
      if (Array.isArray(a.tags)) {
        for (const t of a.tags) {
          const limpo = String(t || '').trim();
          if (limpo) tagsSet.add(limpo);
        }
      }
    }
    return Array.from(tagsSet).sort((a, b) => a.localeCompare(b, 'pt', { sensitivity: 'base' }));
  } catch {
    return [];
  }
}

export default function EditorTags({
  tags = [],
  onChange,
  rotulo = 'Tags / Etiquetas',
  dica = 'Usa tags para organizar por campanha, mesa, grupo ou tema (ex: "Campanha Calamidade", "Mesa 1", "Sessão 4").',
  placeholder = 'Escreve uma tag e prime Enter ou vírgula...',
  sugestoesPersonalizadas = null,
}) {
  const [texto, setTexto] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const listaTags = Array.isArray(tags) ? tags : [];

  // Fechar menu de sugestões ao clicar fora
  useEffect(() => {
    function cliqueFora(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener('mousedown', cliqueFora);
    return () => document.removeEventListener('mousedown', cliqueFora);
  }, []);

  const todasSugestoes = sugestoesPersonalizadas || obterTodasAsTags();

  // Filtrar sugestões que combinam com o texto digitado e que ainda não foram adicionadas
  const sugestoesFiltradas = todasSugestoes.filter((s) => {
    const jaTem = listaTags.some((t) => t.toLowerCase() === s.toLowerCase());
    if (jaTem) return false;
    if (!texto.trim()) return true;
    return s.toLowerCase().includes(texto.trim().toLowerCase());
  });

  function adicionarTag(novaTag) {
    const limpa = String(novaTag || '').trim();
    if (!limpa) return;
    const jaExiste = listaTags.some((t) => t.toLowerCase() === limpa.toLowerCase());
    if (jaExiste) {
      setTexto('');
      return;
    }
    onChange([...listaTags, limpa]);
    setTexto('');
  }

  function removerTag(indiceParaRemover) {
    onChange(listaTags.filter((_, i) => i !== indiceParaRemover));
  }

  function lidarKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      adicionarTag(texto);
    } else if (e.key === 'Backspace' && !texto && listaTags.length > 0) {
      removerTag(listaTags.length - 1);
    }
  }

  return (
    <div className="editor-tags-container" ref={wrapperRef}>
      {rotulo && <label className="rotulo-tags">{rotulo}</label>}
      {dica && <div className="dica" style={{ marginBottom: 6 }}>{dica}</div>}

      <div
        className="editor-tags-caixa"
        onClick={() => inputRef.current?.focus()}
      >
        {listaTags.map((tag, i) => (
          <span key={i} className="chip-tag">
            <span className="chip-tag-texto">{tag}</span>
            <button
              type="button"
              className="chip-tag-remover"
              onClick={(e) => {
                e.stopPropagation();
                removerTag(i);
              }}
              title={`Remover tag "${tag}"`}
              aria-label={`Remover tag ${tag}`}
            >
              ×
            </button>
          </span>
        ))}

        <div className="editor-tags-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="editor-tags-input"
            value={texto}
            placeholder={listaTags.length === 0 ? placeholder : 'Adicionar mais...'}
            onChange={(e) => {
              const val = e.target.value;
              if (val.includes(',')) {
                const partes = val.split(',');
                partes.forEach((p) => adicionarTag(p));
              } else {
                setTexto(val);
                setMenuAberto(true);
              }
            }}
            onFocus={() => setMenuAberto(true)}
            onKeyDown={lidarKeyDown}
          />

          {texto.trim() && (
            <button
              type="button"
              className="btn-adicionar-tag"
              onClick={(e) => {
                e.stopPropagation();
                adicionarTag(texto);
                inputRef.current?.focus();
              }}
            >
              +
            </button>
          )}
        </div>
      </div>

      {menuAberto && sugestoesFiltradas.length > 0 && (
        <div className="sugestoes-tags-menu">
          <div className="sugestoes-tags-titulo">Sugestões de tags:</div>
          <div className="sugestoes-tags-lista">
            {sugestoesFiltradas.slice(0, 8).map((s, idx) => (
              <button
                key={idx}
                type="button"
                className="sugestao-tag-item"
                onMouseDown={(e) => {
                  e.preventDefault();
                  adicionarTag(s);
                }}
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
