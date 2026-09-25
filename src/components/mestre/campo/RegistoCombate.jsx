import React, { useEffect, useRef, useState } from 'react';
import { rolarExpressao } from '../../../engine/dados.js';

const FILTROS = [
  { id: 'tudo', nome: 'Tudo' },
  { id: 'rolagens', nome: 'Rolagens' },
  { id: 'jogadores', nome: 'Jogadores' },
  { id: 'vida', nome: 'Dano & cura' },
];

function passa(filtro, e) {
  if (filtro === 'rolagens') return e.tipo === 'rolagem';
  if (filtro === 'jogadores') return e.tipo === 'rolagem' && e.origem === 'jogador';
  if (filtro === 'vida') return e.tipo === 'dano' || e.tipo === 'cura';
  return true;
}

const hora = (t) => {
  const d = new Date(t);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

/**
 * Registo do combate, como um chat: as rolagens do Mestre (ataques, testes,
 * iniciativas, rolagens livres) e as dos jogadores ligados pelo Hub, o dano e
 * a cura aplicados (com as Resistências que contaram), e a passagem de turnos.
 * Em baixo, um campo para rolar qualquer expressão ("2d20+5", "3d6 fogo").
 */
export default function RegistoCombate({ registo, onLimpar, onRolar }) {
  const [filtro, setFiltro] = useState('tudo');
  const [expr, setExpr] = useState('');
  const [erro, setErro] = useState(false);
  const fundo = useRef(null);
  const visiveis = registo.filter((e) => passa(filtro, e));

  useEffect(() => {
    const el = fundo.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visiveis.length, filtro]);

  function rolarLivre(e) {
    e.preventDefault();
    const r = rolarExpressao(expr);
    if (!r) { setErro(true); return; }
    setErro(false);
    onRolar({ ...r, nome: expr.trim() });
    setExpr('');
  }

  return (
    <section className="cb-painel-lateral cb-registo">
      <header className="cb-painel-lateral-topo">
        <h4>Registo</h4>
        {registo.length > 0 && <button type="button" className="btn ghost sm" onClick={() => { if (window.confirm('Limpar o registo do combate?')) onLimpar(); }}>Limpar</button>}
      </header>
      <div className="cb-filtros" role="tablist">
        {FILTROS.map((f) => (
          <button key={f.id} type="button" role="tab" aria-selected={filtro === f.id} className={filtro === f.id ? 'ativo' : ''} onClick={() => setFiltro(f.id)}>{f.nome}</button>
        ))}
      </div>
      <div className="cb-registo-lista" ref={fundo}>
        {visiveis.length === 0 ? (
          <p className="dica cb-vazio-texto">
            {filtro === 'jogadores'
              ? 'As rolagens dos jogadores ligados pelo Hub de Equipa aparecem aqui.'
              : 'Rolagens, dano, cura e turnos vão aparecendo aqui.'}
          </p>
        ) : visiveis.map((e) => <Entrada key={e.id} e={e} />)}
      </div>
      <form className="cb-rolar-livre" onSubmit={rolarLivre}>
        <input type="text" value={expr} onChange={(ev) => { setExpr(ev.target.value); setErro(false); }}
          placeholder="Rolar… ex.: 2d20+5 ou 3d6 fogo" aria-label="Expressão a rolar" className={erro ? 'erro' : ''} />
        <button type="submit" className="btn sm" disabled={!expr.trim()}>Rolar</button>
      </form>
    </section>
  );
}

function Entrada({ e }) {
  if (e.tipo === 'turno') {
    return <div className="cb-reg-turno"><span>{e.texto}</span></div>;
  }
  if (e.tipo === 'rolagem') {
    const r = e.resumo || {};
    return (
      <div className={`cb-reg-rolagem${e.origem === 'jogador' ? ' jogador' : ''}`}>
        <div className="cb-reg-cabeca">
          <span className="cb-reg-autor">{e.autor || 'Mestre'}</span>
          <span className="cb-reg-hora">{hora(e.quando)}</span>
        </div>
        <div className="cb-reg-linha">
          <div className="cb-reg-texto">
            <div className="cb-reg-titulo">{r.titulo}</div>
            {r.conta && <div className="cb-reg-conta">{r.conta}</div>}
            {r.danoJunto && <div className="cb-reg-conta">Dano: <b>{r.danoJunto.total}</b> · {r.danoJunto.conta}</div>}
          </div>
          <div className={`cb-reg-total${r.critico ? ' critico' : ''}${r.falha ? ' falha' : ''}`} title={r.critico ? 'Crítico' : r.falha ? 'Falha crítica' : undefined}>
            {r.total}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`cb-reg-evento ${e.tipo || ''}`}>
      <span className="cb-reg-hora">{hora(e.quando)}</span>
      <span>{e.texto}</span>
      {e.notas?.length > 0 && <div className="cb-reg-notas">{e.notas.join(' · ')}</div>}
    </div>
  );
}
