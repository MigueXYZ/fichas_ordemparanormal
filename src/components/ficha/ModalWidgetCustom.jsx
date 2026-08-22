import React, { useState } from 'react';
import { novoIdWidgetCustom } from '../../engine/sheetLayout.js';

export const CORES_WIDGET = [
  { id: 'sangue', nome: 'Sangue', hex: '#f04653' },
  { id: 'morte', nome: 'Morte', hex: '#63586b' },
  { id: 'energia', nome: 'Energia', hex: '#9933ff' },
  { id: 'conhecimento', nome: 'Conhecimento', hex: '#f5a636' },
  { id: 'medo', nome: 'Medo', hex: '#e2e8f0' },
  { id: 'padrao', nome: 'Neutro', hex: '#888888' },
];

export default function ModalWidgetCustom({ widgetParaEditar = null, aoGuardar, aoFechar }) {
  const [tipo, setTipo] = useState(widgetParaEditar?.tipo || 'contador');
  const [titulo, setTitulo] = useState(widgetParaEditar?.titulo || '');
  const [cor, setCor] = useState(widgetParaEditar?.cor || '#f04653');
  
  // Estado para tipo 'contador'
  const [atual, setAtual] = useState(widgetParaEditar?.atual ?? 10);
  const [max, setMax] = useState(widgetParaEditar?.max ?? 10);
  const [passo, setPasso] = useState(widgetParaEditar?.passo ?? 1);
  const [unidade, setUnidade] = useState(widgetParaEditar?.unidade || '');

  // Estado para tipo 'nota'
  const [conteudo, setConteudo] = useState(widgetParaEditar?.conteudo || '');

  // Estado para tipo 'checklist'
  const [itens, setItens] = useState(widgetParaEditar?.itens || [{ texto: '', feito: false }]);

  function adicionarItemChecklist() {
    setItens((prev) => [...prev, { texto: '', feito: false }]);
  }

  function mudarTextoItem(idx, txt) {
    setItens((prev) => prev.map((it, i) => (i === idx ? { ...it, texto: txt } : it)));
  }

  function removerItemChecklist(idx) {
    setItens((prev) => prev.filter((_, i) => i !== idx));
  }

  function submeter(e) {
    e.preventDefault();
    const tit = titulo.trim() || (tipo === 'contador' ? 'Contador' : tipo === 'nota' ? 'Anotações' : 'Lista');
    const id = widgetParaEditar?.id || novoIdWidgetCustom();

    const base = {
      id,
      tipo,
      titulo: tit,
      cor,
      visivel: true,
    };

    if (tipo === 'contador') {
      base.atual = Number(atual) || 0;
      base.max = max !== null && max !== '' ? Number(max) : null;
      base.passo = Number(passo) || 1;
      base.unidade = unidade.trim();
    } else if (tipo === 'nota') {
      base.conteudo = conteudo;
    } else if (tipo === 'checklist') {
      base.itens = itens.filter((it) => it.texto.trim() !== '');
    }

    aoGuardar(base);
    aoFechar();
  }

  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal" style={{ maxWidth: 480 }}>
        <div className="modal-topo">
          <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 19 }}>
            {widgetParaEditar ? 'Editar Widget Customizado' : '+ Criar Widget Customizado'}
          </h3>
          <button className="fechar" onClick={aoFechar}>×</button>
        </div>

        <form onSubmit={submeter} className="modal-corpo" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Escolha do Tipo */}
          <div className="campo">
            <label>Tipo de Widget</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 4 }}>
              <button
                type="button"
                className={'btn ghost sm' + (tipo === 'contador' ? ' ativo' : '')}
                onClick={() => setTipo('contador')}
                style={{ textAlign: 'center' }}
              >
                🔢 Contador
              </button>
              <button
                type="button"
                className={'btn ghost sm' + (tipo === 'nota' ? ' ativo' : '')}
                onClick={() => setTipo('nota')}
                style={{ textAlign: 'center' }}
              >
                📝 Notas
              </button>
              <button
                type="button"
                className={'btn ghost sm' + (tipo === 'checklist' ? ' ativo' : '')}
                onClick={() => setTipo('checklist')}
                style={{ textAlign: 'center' }}
              >
                ☑️ Checklist
              </button>
            </div>
          </div>

          {/* Título do Widget */}
          <div className="campo">
            <label>Título do Widget</label>
            <input
              type="text"
              value={titulo}
              placeholder={tipo === 'contador' ? 'Ex: Munições Curtas, Granadas...' : tipo === 'nota' ? 'Ex: Pistas da Mansão, Códigos...' : 'Ex: Preparativos da Missão...'}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          {/* Cor de Destaque */}
          <div className="campo">
            <label>Cor de Destaque</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4, flexWrap: 'wrap' }}>
              {CORES_WIDGET.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCor(c.hex)}
                  title={c.nome}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: c.hex,
                    border: cor === c.hex ? '2px solid #fff' : '2px solid transparent',
                    cursor: 'pointer',
                    boxShadow: cor === c.hex ? `0 0 10px ${c.hex}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Campos específicos: CONTADOR */}
          {tipo === 'contador' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="campo">
                <label>Valor Atual</label>
                <input
                  type="number"
                  value={atual}
                  onChange={(e) => setAtual(e.target.value)}
                />
              </div>
              <div className="campo">
                <label>Valor Máximo (opcional)</label>
                <input
                  type="number"
                  value={max ?? ''}
                  placeholder="Sem limite"
                  onChange={(e) => setMax(e.target.value === '' ? null : e.target.value)}
                />
              </div>
              <div className="campo">
                <label>Passo / Salto (+/-)</label>
                <input
                  type="number"
                  value={passo}
                  min="1"
                  onChange={(e) => setPasso(e.target.value)}
                />
              </div>
              <div className="campo">
                <label>Unidade / Sufixo (ex: balas, un)</label>
                <input
                  type="text"
                  value={unidade}
                  placeholder="un"
                  onChange={(e) => setUnidade(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Campos específicos: NOTA */}
          {tipo === 'nota' && (
            <div className="campo">
              <label>Conteúdo Inicial da Nota</label>
              <textarea
                value={conteudo}
                rows={4}
                placeholder="Escreve aqui notas, pistas ou regras personalizadas..."
                onChange={(e) => setConteudo(e.target.value)}
              />
            </div>
          )}

          {/* Campos específicos: CHECKLIST */}
          {tipo === 'checklist' && (
            <div className="campo">
              <label>Itens da Lista</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                {itens.map((it, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input
                      type="text"
                      value={it.texto}
                      placeholder={`Item ${i + 1}`}
                      onChange={(e) => mudarTextoItem(i, e.target.value)}
                      style={{ flex: 1 }}
                    />
                    {itens.length > 1 && (
                      <button
                        type="button"
                        className="btn danger sm"
                        style={{ padding: '2px 8px' }}
                        onClick={() => removerItemChecklist(i)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn ghost sm"
                  style={{ marginTop: 4, width: 'fit-content' }}
                  onClick={adicionarItemChecklist}
                >
                  + Adicionar Item
                </button>
              </div>
            </div>
          )}

          <div className="modal-acoes" style={{ marginTop: 12 }}>
            <button type="button" className="btn ghost" onClick={aoFechar}>Cancelar</button>
            <button type="submit" className="btn">
              {widgetParaEditar ? 'Guardar Alterações' : 'Criar Widget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
