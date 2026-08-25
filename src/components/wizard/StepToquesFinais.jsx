import React, { useRef, useState } from 'react';
import EditorTags from '../EditorTags.jsx';
import { lerImagem, lerToken } from '../../engine/armazenamento.js';

/** Caixa de upload de imagem (avatar ou token), no mesmo estilo do ".retrato" da ficha. */
function CampoImagem({ label, valor, aoEscolher, aoRemover }) {
  const inputRef = useRef(null);
  const [erro, setErro] = useState(null);

  async function escolher(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErro(null);
    try {
      await aoEscolher(f);
    } catch (err) {
      setErro(err.message);
    }
    e.target.value = '';
  }

  return (
    <div className="campo">
      <label>{label}</label>
      <div
        className="retrato"
        style={valor ? { backgroundImage: `url(${valor})` } : undefined}
        onClick={() => inputRef.current?.click()}
      >
        {!valor && label}
        <input ref={inputRef} type="file" accept="image/*,image/gif" onChange={escolher} />
      </div>
      {valor && (
        <button type="button" className="btn ghost sm" style={{ marginTop: 6 }} onClick={aoRemover}>Remover</button>
      )}
      {erro && <div className="aviso" style={{ maxWidth: 200, fontSize: 11, marginTop: 6 }}>{erro}</div>}
    </div>
  );
}

export default function StepToquesFinais({ personagem, atualizar, onFinalizar, podeFinalizar }) {
  const d = personagem.descricao || {};
  const setDesc = (campo, valor) => atualizar({ descricao: { ...d, [campo]: valor } });

  return (
    <div>
      <p className="texto-regra" style={{ fontSize: 15 }}>
        Até aqui definiste as características mecânicas da ficha — mas um bom personagem é mais do que números.
        Agora vamos à descrição do agente: nome, género, idade. Estes aspetos não têm efeito nas regras, mas
        deixam o jogo mais envolvente.
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <button className="btn" onClick={onFinalizar} disabled={!podeFinalizar}>Finalizar</button>
      </div>

      <div className="linha">
        <div className="campo">
          <label>Personagem</label>
          <input type="text" value={personagem.nome} onChange={(e) => atualizar({ nome: e.target.value })} placeholder="Nome do personagem" />
        </div>
        <div className="campo">
          <label>Jogador</label>
          <input type="text" value={personagem.jogador} onChange={(e) => atualizar({ jogador: e.target.value })} placeholder="Nome do jogador" />
        </div>
      </div>

      <div className="linha" style={{ marginBottom: 16 }}>
        <CampoImagem
          label="Arte do Personagem"
          valor={personagem.imagem}
          aoEscolher={async (f) => atualizar({ imagem: await lerImagem(f) })}
          aoRemover={() => atualizar({ imagem: null })}
        />
        <CampoImagem
          label="Token do Agente"
          valor={personagem.token}
          aoEscolher={async (f) => atualizar({ token: await lerToken(f) })}
          aoRemover={() => atualizar({ token: null })}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <EditorTags
          tags={personagem.tags || []}
          onChange={(novasTags) => atualizar({ tags: novasTags })}
        />
      </div>

      <div className="campo">
        <label>Aparência</label>
        <textarea value={d.aparencia} onChange={(e) => setDesc('aparencia', e.target.value)} placeholder="Nome, género, idade, descrição física..." />
      </div>
      <div className="campo">
        <label>Personalidade</label>
        <textarea value={d.personalidade} onChange={(e) => setDesc('personalidade', e.target.value)} placeholder="Traços marcantes, opiniões, ideais..." />
      </div>
      <div className="campo">
        <label>Histórico</label>
        <textarea value={d.historico} onChange={(e) => setDesc('historico', e.target.value)} placeholder="Infância, relação com a família, contacto com o Paranormal, eventos bons e maus..." />
      </div>
      <div className="campo">
        <label>Objetivo</label>
        <textarea value={d.objetivo} onChange={(e) => setDesc('objetivo', e.target.value)} placeholder="Porque é que faz parte da Ordem? Porque luta contra o Outro Lado?" />
      </div>

      {!podeFinalizar && (
        <div className="aviso">Escolhe uma <strong>classe</strong> antes de finalizar — é ela que define Vida, Sanidade e Esforço.</div>
      )}
    </div>
  );
}
