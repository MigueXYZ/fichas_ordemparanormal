import React, { useMemo, useState } from 'react';
import { COMPENDIO_AMEACAS, clonarAmeacaOficial } from '../../../data/ameacas/index.js';
import tokenPlaceholder from '../../../assets/token-placeholder.png';

const normalizar = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/**
 * Escolher quem entra no combate: fichas de agente, NPCs do Elenco, ameaças
 * do Bestiário, o compêndio oficial e os jogadores ligados pelo Hub. Tudo
 * com pesquisa; as ameaças e os NPCs podem entrar várias vezes de uma vez
 * ("3× Zumbi" → Zumbi 1, 2, 3, cada um com os seus PV).
 */
export default function AdicionarCombatentes({
  equipaId, equipas, fichasAgentes, npcsElenco, ameacas, agentesConectados, jaNoCombate,
  onAdicionar, onAdicionarConectado, onFechar,
}) {
  const [lado, setLado] = useState(equipaId);
  const [aba, setAba] = useState(() => (equipas[0]?.id === equipaId ? 'fichas' : 'bestiario'));
  const [busca, setBusca] = useState('');
  const [qtd, setQtd] = useState({});
  const [feito, setFeito] = useState({});

  const ABAS = [
    { id: 'fichas', nome: 'Agentes', n: fichasAgentes.length },
    { id: 'elenco', nome: 'Elenco', n: npcsElenco.length },
    { id: 'bestiario', nome: 'Bestiário', n: ameacas.length },
    { id: 'compendio', nome: 'Compêndio oficial', n: COMPENDIO_AMEACAS.length },
    { id: 'ligados', nome: 'Jogadores ligados', n: agentesConectados.length },
  ];

  const itens = useMemo(() => {
    const termo = normalizar(busca.trim());
    const filtrar = (lista, texto) => (termo ? lista.filter((x) => normalizar(texto(x)).includes(termo)) : lista);
    switch (aba) {
      case 'fichas': return filtrar(fichasAgentes, (f) => `${f.nome} ${f.classe || ''}`).map((f) => ({ chave: f.id, f, sub: [f.nex != null && `NEX ${f.nex}%`, f.classe].filter(Boolean).join(' · '), multiplo: false }));
      case 'elenco': return filtrar(npcsElenco, (f) => `${f.nome} ${f.breveDescricao || ''}`).map((f) => ({ chave: f.id, f, sub: [f.vd && `VD ${f.vd}`, f.breveDescricao].filter(Boolean).join(' · '), multiplo: true }));
      case 'bestiario': return filtrar(ameacas, (f) => `${f.nome} ${(f.descritores || []).join(' ')} ${f.categoria || ''}`).map((f) => ({ chave: f.id, f, sub: [f.vd != null && `VD ${f.vd}`, f.categoria, ...(f.descritores || [])].filter(Boolean).join(' · '), multiplo: true }));
      case 'compendio': return filtrar(COMPENDIO_AMEACAS, (f) => `${f.nome} ${(f.descritores || []).join(' ')}`).slice(0, 60).map((f) => ({ chave: f.id, f, sub: [f.vd != null && `VD ${f.vd}`, ...(f.descritores || [])].filter(Boolean).join(' · '), multiplo: true, compendio: true }));
      case 'ligados': return filtrar(agentesConectados, (a) => a.nome).map((a) => ({ chave: a.codigo, f: a, sub: a.subtitulo || 'ligado pelo Hub', ligado: true }));
      default: return [];
    }
  }, [aba, busca, fichasAgentes, npcsElenco, ameacas, agentesConectados]);

  function adicionar(item) {
    if (item.ligado) {
      onAdicionarConectado(item.f, lado);
    } else if (item.compendio) {
      onAdicionar(clonarAmeacaOficial(item.f), lado, qtd[item.chave] || 1, { propria: true });
    } else {
      onAdicionar(item.f, lado, item.multiplo ? qtd[item.chave] || 1 : 1);
    }
    setFeito((a) => ({ ...a, [item.chave]: (a[item.chave] || 0) + (item.multiplo ? qtd[item.chave] || 1 : 1) }));
  }

  const jaEsta = (item) => item.ligado
    ? jaNoCombate.some((c) => c.codigo === item.f.codigo)
    : !item.multiplo && jaNoCombate.some((c) => c.fichaId && c.fichaId === item.f.id);

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="modal cb-modal-adicionar" role="dialog" aria-label="Adicionar ao combate">
        <div className="modal-topo">
          <h3 style={{ margin: 0 }}>Adicionar ao combate</h3>
          <button className="fechar" onClick={onFechar} aria-label="Fechar">×</button>
        </div>
        <div className="modal-corpo">
          <div className="cb-adicionar-topo">
            <label className="cb-adicionar-lado">
              <span>Lado</span>
              <select value={lado} onChange={(e) => setLado(e.target.value)}>
                {equipas.map((eq) => <option key={eq.id} value={eq.id}>{eq.nome}</option>)}
              </select>
            </label>
            <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar por nome, elemento, categoria…" autoFocus />
          </div>
          <div className="cb-filtros">
            {ABAS.map((a) => (
              <button key={a.id} type="button" className={aba === a.id ? 'ativo' : ''} onClick={() => setAba(a.id)}>{a.nome} <span className="cb-n">{a.n}</span></button>
            ))}
          </div>
          <div className="cb-adicionar-lista">
            {itens.length === 0 ? (
              <p className="dica cb-vazio-texto">
                {aba === 'ligados' ? 'Nenhum jogador ligado. Liga-os no Hub de Equipa.'
                  : aba === 'fichas' ? 'Sem fichas de agente guardadas.'
                    : aba === 'elenco' ? 'Sem NPCs no Elenco — gera-os em "Gerar" ou importa uma ficha.'
                      : busca ? 'Nada encontrado.' : 'Nada guardado aqui ainda.'}
              </p>
            ) : itens.map((item) => (
              <div key={item.chave} className="cb-adicionar-item">
                <span className="cb-token-mini grande" style={{ backgroundImage: `url(${item.f.imagem || item.f.token || tokenPlaceholder})` }} />
                <span className="cb-adicionar-info">
                  <b>{item.f.nome}</b>
                  {item.sub && <span>{item.sub}</span>}
                </span>
                {item.multiplo && (
                  <label className="cb-qtd" title="Quantos">
                    ×<input type="number" min="1" max="20" value={qtd[item.chave] || 1} onChange={(e) => setQtd((a) => ({ ...a, [item.chave]: Math.max(1, Math.min(20, Number(e.target.value) || 1)) }))} />
                  </label>
                )}
                {jaEsta(item) ? (
                  <span className="cb-ja">já está</span>
                ) : (
                  <button type="button" className="btn sm" onClick={() => adicionar(item)}>
                    {feito[item.chave] ? `+ outra vez (${feito[item.chave]})` : 'Adicionar'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="cb-modal-rodape">
          <span className="dica">As ameaças entram com os PV cheios; o dano no combate não mexe na ficha do Bestiário.</span>
          <button type="button" className="btn" onClick={onFechar}>Pronto</button>
        </div>
      </div>
    </div>
  );
}
