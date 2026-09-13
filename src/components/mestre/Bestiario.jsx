import React, { useMemo, useState } from 'react';
import { IconeLixo } from '../Icones.jsx';
import { novoId } from '../../engine/armazenamento.js';
import CompendioOficial from './CompendioOficial.jsx';

function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** Ficha em branco para uma ameaça totalmente custom, no mesmo formato rico das oficiais. */
function ameacaCustomVazia() {
  return {
    id: novoId(),
    tipo: 'ameaca',
    nome: 'Nova Ameaça',
    tags: [],
    vd: 20,
    descritores: [],
    tamanho: 'Médio',
    categoria: '',
    defesa: 15,
    pv: 20,
    pvMachucado: 10,
    deslocamento: '9m | 6',
    sentidos: { percepcao: '1d20+0', iniciativa: '1d20+0' },
    testes: { fortitude: '1d20+0', reflexos: '1d20+0', vontade: '1d20+0' },
    atributos: { agi: 1, for: 1, int: 1, pre: 1, vig: 1 },
    resistencias: [],
    pericias: [],
    habilidades: [],
    acoes: [
      { tipo: 'Padrão', nome: 'Agredir', detalhe: 'Corpo a corpo', teste: '1d20+0', dano: '1d6', critico: '', descricao: '' },
    ],
    notas: '',
  };
}

/**
 * Aba "Bestiário" do Modo Mestre — duas sub-abas:
 * - "As Minhas Ameaças": tudo o que já está guardado (geradas, clonadas do
 *   compêndio, ou criadas à mão), com pesquisa e um botão para criar uma
 *   ameaça 100% custom do zero.
 * - "Compêndio Oficial": as ameaças dos livros oficiais, prontas a clonar.
 */
export default function Bestiario({ lista, aoAbrir, aoApagar, aoGuardar }) {
  const [subAba, setSubAba] = useState('minhas');
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

  function criarCustom() {
    const nova = ameacaCustomVazia();
    const guardada = aoGuardar ? aoGuardar(nova) : nova;
    aoAbrir(guardada);
  }

  return (
    <div>
      <div className="abas" style={{ marginTop: 0 }}>
        <button className={subAba === 'minhas' ? 'ativa' : ''} onClick={() => setSubAba('minhas')}>As Minhas Ameaças</button>
        <button className={subAba === 'compendio' ? 'ativa' : ''} onClick={() => setSubAba('compendio')}>Compêndio Oficial</button>
      </div>

      {subAba === 'compendio' && <CompendioOficial aoGuardar={aoGuardar} aoAbrir={aoAbrir} />}

      {subAba === 'minhas' && (
        <div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="barra-pesquisa-home" style={{ marginTop: 0, flex: 1, minWidth: 220 }}>
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
            <button type="button" className="btn" onClick={criarCustom}>+ Criar Ameaça Custom</button>
          </div>

          {lista.length === 0 ? (
            <p style={{ color: 'var(--txt-fraco)', marginTop: 20, fontSize: 14 }}>
              Ainda não há nenhuma ameaça guardada. Adiciona uma do "Compêndio Oficial", gera uma na aba "Gerar", ou cria uma à mão com "+ Criar Ameaça Custom".
            </p>
          ) : (
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
          )}

          {lista.length > 0 && listaFiltrada.length === 0 && (
            <p style={{ color: 'var(--txt-fraco)', marginTop: 20, fontSize: 14 }}>
              Nenhuma ameaça encontrada para "{busca}".
            </p>
          )}
        </div>
      )}
    </div>
  );
}
