import React, { useState, useMemo, useCallback } from 'react';
import { CLASSES, TRILHAS } from '../../data/classes.js';
import { ORIGENS } from '../../data/origens.js';
import { NEX_TRACK } from '../../engine/calc.js';
import {
  CONCEITOS, CATEGORIAS_AMEACA, ELEMENTOS_AMEACA, VD_SUGERIDOS, TAMANHOS,
  ELEMENTOS_CULTISTAS, PATENTES_CULTISTAS,
  gerarFicha, gerarNpcAgente, gerarAmeaca, gerarOcultista, vdParaGrupo,
} from '../../engine/geradores.js';
import ModalDetalheGenerico from './ModalDetalheGenerico.jsx';
import Ficha from '../ficha/Ficha.jsx';
import FichaLivreCard from './FichaLivreCard.jsx';
import { ehFichaLivre } from '../../engine/fichaLivre.js';
import PainelRolagem from '../PainelRolagem.jsx';

const SEPARADORES = [
  { id: 'ficha', nome: 'Ficha aleatória' },
  { id: 'npc', nome: 'NPC' },
  { id: 'ocultista', nome: 'Ocultista' },
  { id: 'ameaca', nome: 'Criatura / Ameaça' },
];

export default function Geradores({ aoGuardar, aoAbrir }) {
  const [aba, setAba] = useState('ficha');
  const [nex, setNex] = useState(5);
  const [conceito, setConceito] = useState('surpresa');
  const [classeId, setClasseId] = useState('');
  const [trilhaId, setTrilhaId] = useState('');
  const [origemId, setOrigemId] = useState('');
  const [vd, setVd] = useState(20);
  const [categoriaAmeaca, setCategoriaAmeaca] = useState('');
  const [elementosAmeaca, setElementosAmeaca] = useState([]);
  const [tamanho, setTamanho] = useState('');
  const [conceitoAmeaca, setConceitoAmeaca] = useState('');
  const [ehGrupoAmeaca, setEhGrupoAmeaca] = useState(false);
  const [qtdGrupoAmeaca, setQtdGrupoAmeaca] = useState(2);
  const [elementoCultista, setElementoCultista] = useState('');
  const [patenteCultista, setPatenteCultista] = useState('');
  const [nexGrupo, setNexGrupo] = useState(20);
  const [resultado, setResultado] = useState(null);
  const [editando, setEditando] = useState(false);
  const [itemDetalhe, setItemDetalhe] = useState(null);
  const [rolagens, setRolagens] = useState([]);

  const onRolar = useCallback((r) => {
    if (!r) return;
    setRolagens((antes) => [...antes.slice(-9), r]);
  }, []);
  const fecharRolagem = useCallback((id) => {
    setRolagens((antes) => antes.filter((r) => r.id !== id));
  }, []);
  const limparRolagens = useCallback(() => setRolagens([]), []);

  const trilhasDisponiveis = useMemo(() => {
    if (!classeId) return TRILHAS;
    const cl = CLASSES.find((c) => c.id === classeId);
    return cl?.trilhas || [];
  }, [classeId]);

  function gerar() {
    setEditando(false);
    if (aba === 'ameaca') {
      setResultado(gerarAmeaca({
        vd: Number(vd),
        categoria: categoriaAmeaca || null,
        elementos: elementosAmeaca,
        tamanho: tamanho || null,
        conceito: conceitoAmeaca || '',
        grupo: ehGrupoAmeaca,
        quantidadeGrupo: Number(qtdGrupoAmeaca),
      }));
      return;
    }
    if (aba === 'ocultista') {
      setResultado(gerarOcultista({
        vd: Number(vd),
        elemento: elementoCultista || null,
        patente: patenteCultista || null,
      }));
      return;
    }
    const opcoes = {
      nex: Number(nex),
      conceito,
      classeId: classeId || null,
      trilhaId: trilhaId || null,
      origemId: origemId || null,
    };
    setResultado(aba === 'npc' ? gerarNpcAgente(opcoes) : gerarFicha(opcoes));
  }

  return (
    <div>
      <div className="abas" style={{ marginBottom: 20 }}>
        {SEPARADORES.map((s) => (
          <button
            key={s.id}
            className={aba === s.id ? 'ativa' : ''}
            onClick={() => { setAba(s.id); setResultado(null); setEditando(false); }}
          >
            {s.nome}
          </button>
        ))}
      </div>

      {/* Aba 1 e 2: Ficha e NPC */}
      {(aba === 'ficha' || aba === 'npc') && (
        <>
          <p className="dica" style={{ marginTop: 0 }}>
            {aba === 'npc'
              ? 'Um NPC com ficha de NPC já preenchida — PV/PE/SAN, Defesa, perícias, ataques, poderes, rituais (consoante o NEX), equipamento e guia de interpretação. Não implica que seja um agente da Ordem.'
              : 'Uma ficha jogável inteira: atributos, origem, classe, trilha, poderes de NEX, rituais, comportamento e equipamento.'}
          </p>
          <div className="grelha-editor" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
            <div className="campo">
              <label>NEX</label>
              <select value={nex} onChange={(e) => setNex(Number(e.target.value))}>
                {NEX_TRACK.map((n) => <option key={n} value={n}>{n}%</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Conceito</label>
              <select value={conceito} onChange={(e) => setConceito(e.target.value)}>
                {CONCEITOS.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Classe</label>
              <select
                value={classeId}
                onChange={(e) => {
                  setClasseId(e.target.value);
                  setTrilhaId('');
                }}
              >
                <option value="">Ao acaso</option>
                {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Trilha</label>
              <select value={trilhaId} onChange={(e) => setTrilhaId(e.target.value)}>
                <option value="">Ao acaso</option>
                {trilhasDisponiveis.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome} {!classeId && t.classeNome ? `(${t.classeNome})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label>Origem</label>
              <select value={origemId} onChange={(e) => setOrigemId(e.target.value)}>
                <option value="">Ao acaso</option>
                {ORIGENS.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
              </select>
            </div>
          </div>
        </>
      )}

      {/* Aba 3: Ocultista */}
      {aba === 'ocultista' && (
        <>
          <p className="dica" style={{ marginTop: 0 }}>
            Ocultistas e cultistas não-agentes: saem como NPC (vão para o Elenco) — rituais prontos com DT, poderes paranormais do culto, armas amaldiçoadas, equipamento e guia de interpretação.
          </p>
          <div className="grelha-editor" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
            <div className="campo">
              <label>Valor de Desafio (VD)</label>
              <select value={vd} onChange={(e) => setVd(Number(e.target.value))}>
                {VD_SUGERIDOS.map((v) => <option key={v} value={v}>VD {v}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Elemento Paranormal</label>
              <select value={elementoCultista} onChange={(e) => setElementoCultista(e.target.value)}>
                <option value="">Ao acaso</option>
                {ELEMENTOS_CULTISTAS.map((el) => <option key={el} value={el}>{el}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Patente do Culto</label>
              <select value={patenteCultista} onChange={(e) => setPatenteCultista(e.target.value)}>
                <option value="">Automático por VD</option>
                {PATENTES_CULTISTAS.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>NEX somado do grupo</label>
              <input type="number" value={nexGrupo} onChange={(e) => setNexGrupo(Number(e.target.value))} />
            </div>
          </div>
          <div className="dica" style={{ marginTop: 6, fontSize: 12 }}>
            Referência de VD para o grupo: fácil {vdParaGrupo(nexGrupo, 'facil')} · equilibrado {vdParaGrupo(nexGrupo)} · difícil {vdParaGrupo(nexGrupo, 'dificil')}
          </div>
        </>
      )}

      {/* Aba 4: Criatura / Ameaça */}
      {aba === 'ameaca' && (
        <>
          <p className="dica" style={{ marginTop: 0 }}>
            Ameaças e criaturas com habilidades especiais, comportamento sinistro, descrição aterrorizante e dicas de narração para o Mestre.
          </p>
          <div className="campo" style={{ marginBottom: 14 }}>
            <label>Conceito da criatura (opcional)</label>
            <textarea
              value={conceitoAmeaca}
              onChange={(e) => setConceitoAmeaca(e.target.value)}
              placeholder="Ex.: a aranha da cave do Convento; a boneca de porcelana da Fábrica..."
              rows={2}
              style={{ resize: 'vertical' }}
            />
            <div className="dica" style={{ marginTop: 4, fontSize: 12 }}>
              Só dá nome à ficha (se ficar vazio, o nome sai da Categoria/Elemento(s) abaixo). Quem decide descritores,
              ataque, resistências e habilidades é sempre a Categoria e o(s) Elemento(s) escolhidos abaixo — a Defesa, PV,
              testes e dano vêm sempre do VD, nunca do texto.
            </div>
          </div>
          <div className="grelha-editor" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
            <div className="campo">
              <label>Valor de desafio {ehGrupoAmeaca && '(do grupo todo)'}</label>
              <select value={vd} onChange={(e) => setVd(Number(e.target.value))}>
                {VD_SUGERIDOS.map((v) => <option key={v} value={v}>VD {v}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Categoria</label>
              <select value={categoriaAmeaca} onChange={(e) => setCategoriaAmeaca(e.target.value)}>
                <option value="">Ao acaso</option>
                {CATEGORIAS_AMEACA.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Tamanho</label>
              <select value={tamanho} onChange={(e) => setTamanho(e.target.value)}>
                <option value="">Automático</option>
                {TAMANHOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>&nbsp;</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 'normal', height: 34 }}>
                <input type="checkbox" checked={ehGrupoAmeaca} onChange={(e) => setEhGrupoAmeaca(e.target.checked)} />
                É um grupo de várias criaturas iguais?
              </label>
            </div>
            {ehGrupoAmeaca && (
              <div className="campo">
                <label>Número de criaturas</label>
                <input
                  type="number"
                  min={2}
                  max={50}
                  value={qtdGrupoAmeaca}
                  onChange={(e) => setQtdGrupoAmeaca(Number(e.target.value))}
                />
              </div>
            )}
          </div>
          <div className="campo" style={{ marginTop: 4, marginBottom: 0 }}>
            <label>Elemento(s) — opcional, escolhe quantos quiseres</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 4 }}>
              {ELEMENTOS_AMEACA.map((el) => (
                <label key={el.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 'normal' }}>
                  <input
                    type="checkbox"
                    checked={elementosAmeaca.includes(el.id)}
                    onChange={(e) =>
                      setElementosAmeaca((antes) =>
                        e.target.checked ? [...antes, el.id] : antes.filter((x) => x !== el.id)
                      )
                    }
                  />
                  {el.id}
                </label>
              ))}
            </div>
          </div>
          <div className="dica" style={{ marginTop: 6, fontSize: 12 }}>
            {elementosAmeaca.length > 0
              ? `Cada elemento marcado (${elementosAmeaca.join(', ')}) garante o seu próprio descritor, resistência e pelo menos uma habilidade temática; a Categoria preenche o resto.`
              : 'Sem elemento marcado, as habilidades e resistências vêm só da Categoria (mais genéricas). Marca um ou mais elementos para uma criatura temática — ex.: Conhecimento dá-lhe habilidades de Conhecimento a sério, não genéricas.'}
            {' '}
            {ehGrupoAmeaca
              ? `O VD escolhido acima é o do grupo todo — é dividido por ${qtdGrupoAmeaca || 2} criaturas para chegar à Defesa, PV e dano de cada uma. Duplica a ficha gerada ${qtdGrupoAmeaca || 2}× no Campo de Batalha.`
              : 'Sem marcar "é um grupo?" é sempre gerada 1 criatura só, com o VD escolhido acima.'}
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn" onClick={gerar}>Gerar</button>
        {resultado && <button className="btn ghost" onClick={gerar}>Outra vez</button>}
        {resultado && (
          <>
            {ehFichaLivre(resultado) && (
              <button
                type="button"
                className={`btn ${editando ? '' : 'ghost'}`}
                onClick={() => setEditando(!editando)}
              >
                {editando ? 'Concluir Edição' : 'Editar Ficha'}
              </button>
            )}
            <button className="btn ghost" onClick={() => aoGuardar(resultado)}
              title={ehFichaLivre(resultado) ? (resultado.tipo === 'ameaca' ? 'Guarda no Bestiário' : 'Guarda no Elenco') : 'Guarda nas fichas'}>
              Guardar
            </button>
            <button className="btn" onClick={() => { const g = aoGuardar(resultado); aoAbrir(g || resultado); }}>
              Guardar e abrir
            </button>
          </>
        )}
      </div>

      {/* NPCs, ocultistas e criaturas: ficha livre — ler e editar no próprio cartão */}
      {resultado && ehFichaLivre(resultado) && (
        <FichaLivreCard f={resultado} editando={editando} onAtualizar={(patch) => setResultado((a) => ({ ...a, ...patch }))} onRolar={onRolar} />
      )}

      {/* Ficha aleatória (agente): a ficha a sério, igual à de um agente aberto —
          já é editável, por isso não precisa de modo de edição à parte */}
      {resultado && !ehFichaLivre(resultado) && resultado.tipo !== 'npc' && (
        <div className="gerador-editor-completo" style={{ marginTop: 10 }}>
          <Ficha personagem={resultado} setPersonagem={setResultado} onRolar={onRolar} />
        </div>
      )}

      {/* Modal de Detalhe Genérico */}
      {itemDetalhe && (
        <ModalDetalheGenerico item={itemDetalhe} aoFechar={() => setItemDetalhe(null)} />
      )}

      <PainelRolagem rolagens={rolagens} aoFechar={fecharRolagem} aoLimpar={limparRolagens} />
    </div>
  );
}
