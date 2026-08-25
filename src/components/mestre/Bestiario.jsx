import React, { useMemo, useState } from 'react';
import { IconeLixo } from '../Icones.jsx';

function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Aba "Bestiário" do Modo Mestre: todas as ameaças/criaturas já guardadas
 * (geradas na aba "Gerar" ou criadas à mão), num só sítio — sem estarem
 * misturadas com os agentes dos jogadores na lista do Início.
 */
export default function Bestiario({ lista, aoAbrir, aoApagar }) {
  const [busca, setBusca] = useState('');
  const [apagarArmado, setApagarArmado] = useState(null);

  const termoBusca = normalizar(busca.trim());
  const listaFiltrada = useMemo(() => {
    if (!termoBusca) return lista;
    return lista.filter((a) => {
      const nome = normalizar(a.nome);
      const descritores = normalizar((a.descritores || []).join(' '));
      const tags = normalizar((a.tags || []).join(' '));
      return nome.includes(termoBusca) || descritores.includes(termoBusca) || tags.includes(termoBusca);
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

  if (lista.length === 0) {
    return (
      <p style={{ color: 'var(--txt-fraco)', marginTop: 12, fontSize: 14 }}>
        Ainda não há nenhuma ameaça guardada. Gera uma na aba "Gerar", ou cria uma ficha de ameaça à mão.
      </p>
    );
  }

  return (
    <div>
      <div className="barra-pesquisa-home" style={{ marginTop: 0 }}>
        <input
          type="text"
          placeholder="Pesquisar por nome, descritores, tags..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        {busca && (
          <button type="button" className="limpar-pesquisa" onClick={() => setBusca('')} title="Limpar pesquisa">×</button>
        )}
      </div>

      <div className="agentes" style={{ marginTop: 18 }}>
        {listaFiltrada.map((a) => (
          <div key={a.id} className="agente-cartao" onClick={() => aoAbrir(a)}>
            <div className="foto" style={a.imagem ? { backgroundImage: `url(${a.imagem})` } : undefined}>
              {!a.imagem && (a.nome?.[0]?.toUpperCase() || '?')}
            </div>
            <div className="info">
              <div className="nome">{a.nome || 'Sem nome'}</div>
              <div className="det">{[a.descritores?.join(' · '), a.tamanho, `VD ${a.vd}`].filter(Boolean).join(' · ')}</div>
              <div className="cartao-acoes">
                <button
                  type="button"
                  className="btn-cartao-acao btn-cartao-icone danger"
                  title={apagarArmado === a.id ? 'Clica outra vez para confirmar' : 'Eliminar ameaça'}
                  aria-label="Eliminar ameaça"
                  style={apagarArmado === a.id ? { background: 'var(--sangue)', color: '#fff' } : undefined}
                  onClick={(e) => clicarApagar(e, a.id)}
                >
                  <IconeLixo size={15} />
                  {apagarArmado === a.id ? ' Confirmar?' : ''}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {listaFiltrada.length === 0 && (
        <p style={{ color: 'var(--txt-fraco)', marginTop: 20, fontSize: 14 }}>
          Nenhuma ameaça encontrada para "{busca}".
        </p>
      )}
    </div>
  );
}
