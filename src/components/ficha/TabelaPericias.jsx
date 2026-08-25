import React, { useEffect, useRef, useState } from 'react';
import { GRAUS_TREINO } from '../../data/pericias.js';
import { ATRIBUTOS } from '../../data/atributos.js';
import { calcPericias } from '../../engine/calc.js';
import { rolarTeste, rolarExpressao, quantidadeDados } from '../../engine/dados.js';
import IconeD20 from '../IconeD20.jsx';

function InputNumeroScroll({ value, onChange, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY < 0 ? 1 : -1;
      const atual = Number(el.value) || 0;
      onChange(atual + delta);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [onChange]);

  return (
    <input
      ref={ref}
      type="number"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      {...props}
    />
  );
}

function SelectScroll({ value, onChange, onScrollStep, children, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY < 0 ? 1 : -1;
      if (onScrollStep) {
        onScrollStep(delta);
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [onScrollStep]);

  return (
    <select ref={ref} value={value} onChange={onChange} {...props}>
      {children}
    </select>
  );
}

export default function TabelaPericias({ personagem, setPersonagem, onRolar }) {
  const linhas = calcPericias(personagem);
  const [roladorAberto, setRoladorAberto] = useState(false);
  const [exprLivre, setExprLivre] = useState('');

  function rolarDadoLivre(expr) {
    const texto = expr || exprLivre;
    const r = rolarExpressao(texto);
    if (r) {
      onRolar(r);
      if (!expr) setExprLivre('');
    }
  }

  function setPericia(id, patch) {
    setPersonagem({
      ...personagem,
      pericias: { ...personagem.pericias, [id]: { ...personagem.pericias?.[id], ...patch } },
    });
  }

  function rolarTreino(id, grauAtual, delta) {
    const graus = GRAUS_TREINO.map((g) => g.id);
    const idx = graus.indexOf(grauAtual);
    if (idx === -1) return;
    const novoIdx = Math.max(0, Math.min(graus.length - 1, idx + delta));
    setPericia(id, { grau: graus[novoIdx] });
  }

  function rolarAttr(id, attrAtual, attrPadrao, delta) {
    const ids = ATRIBUTOS.map((a) => a.id);
    const idx = ids.indexOf(attrAtual);
    if (idx === -1) return;
    const novoIdx = (idx + delta + ids.length) % ids.length;
    const novoAttr = ids[novoIdx];
    setPericia(id, { attr: novoAttr === attrPadrao ? null : novoAttr });
  }

  return (
    <div>
      <style>{`
        /* Aniquilação total de texturas de background nos inputs/selects da tabela */
        .tabela-pericias select,
        .tabela-pericias input,
        .tabela-pericias .trocado,
        .tabela-pericias select:hover,
        .tabela-pericias input:hover,
        .tabela-pericias select:focus,
        .tabela-pericias input:focus,
        .tabela-pericias td {
          background-image: none !important;
          background: transparent !important;
          background-color: transparent !important;
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div className="titulo-seccao" style={{ margin: 0 }}>Perícias</div>
        <button
          type="button"
          className={'btn sm' + (roladorAberto ? '' : ' ghost')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '3px 10px', height: 28 }}
          onClick={() => setRoladorAberto((v) => !v)}
          title="Abrir rolador de dados livre"
        >
          <IconeD20 style={{ width: 14, height: 14, color: 'currentColor' }} />
          <span>Rolar Dados</span>
        </button>
      </div>

      {roladorAberto && (
        <div className="rolador-livre-caixa">
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Fórmula (ex.: 2d20+5, 1d100, 3d6)"
              value={exprLivre}
              onChange={(e) => setExprLivre(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && rolarDadoLivre()}
              style={{ flex: 1, minWidth: 120, fontSize: 13, height: 32 }}
              autoFocus
            />
            <button
              type="button"
              className="btn sm"
              onClick={() => rolarDadoLivre()}
              style={{ height: 32, padding: '0 12px' }}
            >
              Rolar
            </button>
          </div>
          <div className="rolador-livre-atalhos">
            {['1d20', '2d20', '1d100', '1d12', '1d10', '1d8', '1d6', '1d4', '1d2'].map((d) => (
              <button
                key={d}
                type="button"
                className="btn ghost sm atalho-dado"
                onClick={() => rolarDadoLivre(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      <table className="tabela-pericias">
        <thead>
          <tr>
            <th>Perícia</th>
            <th>Dados</th>
            <th>Bónus</th>
            <th>Treino</th>
            <th>Outros</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((l) => (
            <tr key={l.id} className={(l.treino > 0 ? 'treinada' : '') + (l.bloqueada ? ' bloqueada' : '')}>
              <td>
                <div className="nome-pericia">
                  <button
                    className="dado-btn"
                    title={(personagem.monstruosoBancoPendente
                      ? `+1 dado do banco da Trilha do Monstruoso pronto a gastar — `
                      : '') + (l.bloqueada ? 'Perícia somente treinada — sem treino não podes usar' : `Rolar ${l.nome}: ${quantidadeDados(personagem.monstruosoBancoPendente ? Number(l.dados) + 1 : l.dados)}d20 ${l.bonus >= 0 ? '+' : '−'}${Math.abs(l.bonus)}${l.dadosExtra?.length ? ` + ${l.dadosExtra.join(' + ')} (${l.dadosExtraDescricao})` : ''}`)}
                    onClick={() => {
                      const comBonus = Boolean(personagem.monstruosoBancoPendente);
                      onRolar(rolarTeste({ nome: l.nome, dados: comBonus ? Number(l.dados) + 1 : l.dados, bonus: l.bonus, dadosExtra: l.dadosExtra }));
                      if (comBonus) setPersonagem((p) => ({ ...p, monstruosoBancoPendente: false }));
                    }}
                  >
                    <IconeD20 />
                  </button>
                  {l.nome}
                  <span className="marca">{(l.treinada ? '*' : '') + (l.carga ? '+' : '')}</span>
                  {/* O bónus de dado extra da Trilha do Monstruoso (+1d6/+2d6, etc.) já
                      entra sozinho na rolagem (o dado dela junta-se ao resultado) e
                      aparece no aviso do botão de rolar (passa o rato por cima) — não
                      fica cá em cima como emblema, para nunca voltar a desalinhar a linha. */}
                </div>
              </td>
              <td className="attr">
                <select
                  className={l.attrTrocado ? 'trocado' : ''}
                  value={l.attr}
                  title={l.attrTrocado
                    ? `Atributo trocado (o normal é ${ATRIBUTOS.find((a) => a.id === l.attrPadrao)?.sigla})`
                    : 'Atributo usado nesta perícia'}
                  onChange={(e) => setPericia(l.id, { attr: e.target.value === l.attrPadrao ? null : e.target.value })}
                >
                  {ATRIBUTOS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.sigla}{a.id === l.attrPadrao ? '' : ' *'}
                    </option>
                  ))}
                </select>
              </td>
              <td
                className="bonus"
                title={[
                  `Treino ${l.treino >= 0 ? '+' : ''}${l.treino}`,
                  l.outros ? `Outros (manual) ${l.outros >= 0 ? '+' : ''}${l.outros}` : null,
                  l.exposicao ? `Alteração por exposição ${l.exposicao >= 0 ? '+' : ''}${l.exposicao}` : null,
                  l.monstruoso ? `Trilha do Monstruoso ${l.monstruoso >= 0 ? '+' : ''}${l.monstruoso}` : null,
                  l.penalidade ? `Penalidade de carga −${l.penalidade}` : null,
                ].filter(Boolean).join(' · ') || 'Sem bónus nem penalidades'}
              >
                {l.bonus >= 0 ? `+${l.bonus}` : l.bonus}
              </td>
              <td>
                <SelectScroll
                  value={l.grau}
                  title={`${GRAUS_TREINO.find((g) => g.id === l.grau)?.nome} · Altera com o scroll`}
                  onChange={(e) => setPericia(l.id, { grau: e.target.value })}
                  onScrollStep={(delta) => rolarTreino(l.id, l.grau, delta)}
                >
                  {GRAUS_TREINO.map((g) => (
                    <option key={g.id} value={g.id} title={g.nome}>{g.bonus === 0 ? '0' : `+${g.bonus}`}</option>
                  ))}
                </SelectScroll>
              </td>
              <td>
                <InputNumeroScroll
                  value={l.outros + l.monstruoso}
                  title={
                    l.monstruoso
                      ? 'Altera digitando ou com o scroll do rato. Já inclui o bónus/penalidade automático da Trilha do Monstruoso de hoje — ao desativar a etapa, volta ao valor que estava aqui antes.'
                      : 'Altera digitando ou com o scroll do rato'
                  }
                  onChange={(novo) => setPericia(l.id, { outros: (novo ?? 0) - l.monstruoso })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="rodape-pericias">+ Penalidade de carga. * Somente treinada.</div>
    </div>
  );
}