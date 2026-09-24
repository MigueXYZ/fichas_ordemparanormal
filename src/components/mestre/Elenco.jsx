import React, { useMemo, useState } from 'react';
import { IconeLixo } from '../Icones.jsx';
import { fichaLivreVazia } from '../../engine/fichaLivre.js';
import BotaoImportarFichas from './BotaoImportarFichas.jsx';

function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/**
 * Aba "Elenco" do Modo Mestre — onde ficam guardados os NPCs, ao lado do
 * Bestiário que guarda as ameaças. Os NPCs criados aqui ou importados da
 * ficha editável são de ficha livre (ver engine/fichaLivre.js e
 * FichaLivreCard.jsx): valores escritos à mão, sem classe nem cálculos. Os
 * gerados na aba "Gerar" continuam na "ficha 4" (FichaNpcCard.jsx).
 */
export default function Elenco({ lista, aoAbrir, aoApagar, aoGuardar }) {
  const [busca, setBusca] = useState('');
  const [apagarArmado, setApagarArmado] = useState(null);

  const termoBusca = normalizar(busca.trim());
  const listaFiltrada = useMemo(() => {
    if (!termoBusca) return lista;
    return lista.filter((n) => {
      const nome = normalizar(n.nome);
      const breve = normalizar(n.breveDescricao);
      const tags = normalizar((n.tags || []).join(' '));
      return nome.includes(termoBusca) || breve.includes(termoBusca) || tags.includes(termoBusca);
    });
  }, [lista, termoBusca]);

  function clicarApagar(e, id) {
    e.stopPropagation();
    if (apagarArmado === id) {
      aoApagar(id);
      setApagarArmado(null);
    } else {
      setApagarArmado(id);
    }
  }

  function criarNpc() {
    // Ficha livre em branco. Só a aba "Gerar" produz um NPC já com
    // atributos, perícias e guia de interpretação sorteados. Abre logo em
    // modo de editar, para escreveres direto sem cliques extra.
    const novo = { ...fichaLivreVazia('npc'), jogador: 'NPC' };
    const guardado = aoGuardar ? aoGuardar(novo) : novo;
    aoAbrir(guardado, { editando: true });
  }

  return (
    <div>
      <p className="dica" style={{ marginTop: 0 }}>
        Os teus NPCs — aliados, rivais, vilões. "Importar ficha" traz as fichas feitas na ficha editável de
        NPC/Ameaça (as ameaças vão direto para o Bestiário); "+ Criar NPC" dá-te uma ficha em branco para
        preencheres aqui. Para um NPC já sorteado, usa a aba "Gerar".
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="barra-pesquisa-home" style={{ marginTop: 0, flex: 1, minWidth: 220 }}>
          <input
            type="text"
            placeholder="Pesquisar por nome, descrição, tags..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {busca && (
            <button type="button" className="limpar-pesquisa" onClick={() => setBusca('')} title="Limpar pesquisa">×</button>
          )}
        </div>
        <BotaoImportarFichas aoGuardar={aoGuardar} />
        <button type="button" className="btn" onClick={criarNpc}>+ Criar NPC</button>
      </div>

      {lista.length === 0 ? (
        <p style={{ color: 'var(--txt-fraco)', marginTop: 20, fontSize: 14 }}>
          Ainda não há nenhum NPC guardado. Gera um na aba "Gerar" (separador "NPC agente"), ou cria um do zero com "+ Criar NPC".
        </p>
      ) : (
        <div className="agentes" style={{ marginTop: 18 }}>
          {listaFiltrada.map((n) => (
            <div key={n.id} className="agente-cartao" onClick={() => aoAbrir(n)}>
              <div className="foto" style={n.imagem ? { backgroundImage: `url(${n.imagem})` } : undefined}>
                {!n.imagem && (n.nome?.[0]?.toUpperCase() || '?')}
              </div>
              <div className="info">
                <div className="nome">{n.nome || 'Sem nome'}</div>
                <div className="det">{n.breveDescricao || (n.fichaLivre ? (n.vd ? `VD ${n.vd}` : 'NPC') : `NEX ${n.nex}%`)}</div>
                <div className="cartao-acoes">
                  <button
                    type="button"
                    className="btn-cartao-acao btn-cartao-icone danger"
                    title={apagarArmado === n.id ? 'Clica outra vez para confirmar' : 'Eliminar NPC'}
                    aria-label="Eliminar NPC"
                    style={apagarArmado === n.id ? { background: 'var(--sangue)', color: '#fff' } : undefined}
                    onClick={(e) => clicarApagar(e, n.id)}
                  >
                    <IconeLixo size={15} />
                    {apagarArmado === n.id ? ' Confirmar?' : ''}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {lista.length > 0 && listaFiltrada.length === 0 && (
        <p style={{ color: 'var(--txt-fraco)', marginTop: 20, fontSize: 14 }}>
          Nenhum NPC encontrado para "{busca}".
        </p>
      )}
    </div>
  );
}
