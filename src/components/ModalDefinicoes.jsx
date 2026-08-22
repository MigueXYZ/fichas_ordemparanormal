import React from 'react';
import { IconePDF, IconeJSON, IconeCriacao, IconeSom, IconeEngrenagem } from './Icones.jsx';
import EditorTags from './EditorTags.jsx';
import { resetarLayoutFicha } from '../engine/sheetLayout.js';

export default function ModalDefinicoes({
  personagem,
  aoMudarPersonagem,
  som,
  aoAlternarSom,
  coracao,
  aoAlternarCoracao,
  aoExportarPdf,
  aExportar,
  aoExportarJson,
  aoAbrirCriacao,
  aoFechar,
}) {
  return (
    <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal modal-definicoes" style={{ maxWidth: 480 }}>
        <div className="modal-topo">
          <h3 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 20 }}>
            Opções do Agente
            {personagem?.nome && <span style={{ color: 'var(--sangue-claro)', fontSize: 16, marginLeft: 8 }}>· {personagem.nome}</span>}
          </h3>
          <button className="fechar" onClick={aoFechar} aria-label="Fechar">✕</button>
        </div>

        <div className="modal-corpo" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Secção Tags do Agente */}
          {personagem && aoMudarPersonagem && (
            <div className="seccao-def">
              <label className="rotulo-def">Tags & Organização</label>
              <div style={{ marginTop: 8 }}>
                <EditorTags
                  tags={personagem.tags || []}
                  onChange={(novasTags) => aoMudarPersonagem((p) => ({ ...p, tags: novasTags }))}
                />
              </div>
            </div>
          )}

          {/* Secção 1: Ficheiros & Exportação */}
          <div className="seccao-def">
            <label className="rotulo-def">Ficheiros & Exportação</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              <div className="card-opcao-def">
                <div>
                  <b style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
                    <IconePDF size={16} style={{ color: 'var(--sangue-claro)' }} />
                    Ficha em PDF
                  </b>
                  <span className="dica" style={{ display: 'block', marginTop: 2 }}>
                    Gera a ficha oficial preenchida pronta a imprimir.
                  </span>
                </div>
                <button
                  className="btn sm"
                  onClick={aoExportarPdf}
                  disabled={aExportar}
                  style={{ minWidth: 120 }}
                >
                  {aExportar ? 'A gerar…' : 'Exportar PDF'}
                </button>
              </div>

              <div className="card-opcao-def">
                <div>
                  <b style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
                    <IconeJSON size={16} style={{ color: 'var(--txt-dim)' }} />
                    Backup JSON
                  </b>
                  <span className="dica" style={{ display: 'block', marginTop: 2 }}>
                    Descarrega os dados do agente em formato JSON.
                  </span>
                </div>
                <button
                  className="btn ghost sm"
                  onClick={() => aoExportarJson(personagem)}
                  style={{ minWidth: 120 }}
                >
                  Exportar JSON
                </button>
              </div>
            </div>
          </div>

          {/* Secção 2: Criação do Agente */}
          {personagem && personagem.tipo !== 'ameaca' && aoAbrirCriacao && (
            <div className="seccao-def">
              <label className="rotulo-def">Assistente de Personagem</label>
              <div className="card-opcao-def" style={{ marginTop: 8 }}>
                <div>
                  <b style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
                    <IconeCriacao size={16} style={{ color: '#d8b53c' }} />
                    Modo Criação
                  </b>
                  <span className="dica" style={{ display: 'block', marginTop: 2 }}>
                    Abre o assistente guiado de classe, origem e perícias.
                  </span>
                </div>
                <button
                  className="btn ghost sm"
                  onClick={() => {
                    aoFechar();
                    aoAbrirCriacao();
                  }}
                  style={{ minWidth: 120 }}
                >
                  Abrir Criação
                </button>
              </div>
            </div>
          )}

          {/* Secção 3: Áudio & Efeitos */}
          <div className="seccao-def">
            <label className="rotulo-def">Áudio & Efeitos</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              <div className="card-opcao-def">
                <div>
                  <b style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
                    <IconeSom mudo={!som} size={16} style={{ color: som ? 'var(--sangue-claro)' : 'var(--txt-dim)' }} />
                    Som dos Dados
                  </b>
                  <span className="dica" style={{ display: 'block', marginTop: 2 }}>
                    Efeito sonoro ao rolar dados e dados críticos.
                  </span>
                </div>
                <div className="interruptor" style={{ width: 'fit-content' }}>
                  <button type="button" className={!som ? 'ativo' : ''} onClick={aoAlternarSom}>Mudo</button>
                  <button type="button" className={som ? 'ativo' : ''} onClick={aoAlternarSom}>Ligado</button>
                </div>
              </div>

              <div className="card-opcao-def">
                <div>
                  <b style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
                    <span style={{ color: coracao ? '#f04653' : 'var(--txt-dim)' }}>{coracao ? '♥' : '♡'}</span>
                    Batimento Cardíaco
                  </b>
                  <span className="dica" style={{ display: 'block', marginTop: 2 }}>
                    Pulsação sonora tensa quando em vida baixa.
                  </span>
                </div>
                <div className="interruptor" style={{ width: 'fit-content' }}>
                  <button type="button" className={!coracao ? 'ativo' : ''} onClick={aoAlternarCoracao}>Desligado</button>
                  <button type="button" className={coracao ? 'ativo' : ''} onClick={aoAlternarCoracao}>Ligado</button>
                </div>
              </div>
            </div>
          </div>

          {/* Secção 4: Layout da Ficha */}
          <div className="seccao-def">
            <label className="rotulo-def">Layout da Ficha</label>
            <div className="card-opcao-def" style={{ marginTop: 8 }}>
              <div>
                <b style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
                  <IconeEngrenagem size={16} style={{ color: 'var(--sangue-claro)' }} />
                  Restaurar Layout Padrão
                </b>
                <span className="dica" style={{ display: 'block', marginTop: 2 }}>
                  Repõe as 3 colunas e posições padrão dos widgets na ficha.
                </span>
              </div>
              <button
                type="button"
                className="btn ghost sm"
                onClick={() => {
                  resetarLayoutFicha();
                  alert('Layout da ficha restaurado para o padrão oficial!');
                }}
                style={{ minWidth: 120 }}
              >
                Restaurar
              </button>
            </div>
          </div>
        </div>

        <div className="modal-acoes" style={{ marginTop: 24 }}>
          <button className="btn" onClick={aoFechar} style={{ width: '100%' }}>Concluído</button>
        </div>
      </div>
    </div>
  );
}
