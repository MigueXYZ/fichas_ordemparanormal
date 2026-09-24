import React from 'react';
import tokenPlaceholder from '../../assets/token-placeholder.png';
import EditorTags from '../EditorTags.jsx';
import { rolarTeste, rolarDano, quantidadeDados } from '../../engine/dados.js';
import { acoesDeAmeaca, parseTesteTexto, parseDanoTexto } from '../../engine/combateAtaques.js';
import { roleplayDe, camposRoleplay, ELEMENTOS, TAMANHOS, CLASSES_NPC, PERICIAS_BASE_NPC } from '../../engine/fichaLivre.js';
import { BlocoStat, TabelaLinha, CampoRoleplay } from './FichaCardBlocos.jsx';
import TokenFicha from './TokenFicha.jsx';

const TIPOS_ACAO = ['Padrão', 'Movimento', 'Livre', 'Reação', 'Completa'];
const ATRIBUTOS = ['agi', 'for', 'int', 'pre', 'vig'];

/** "20" → 20, "" → "", "20 (grupo)" fica texto. */
const numOuTexto = (v) => (v === '' ? '' : /^-?\d+$/.test(v.trim()) ? Number(v) : v);
const temValor = (v) => v !== '' && v !== null && v !== undefined;
/** "30/65" durante o combate, "65" fora dele. */
const atualDe = (atual, max) => (temValor(atual) && atual !== max ? `${atual}/${max}` : max);

/**
 * Ficha livre (ver engine/fichaLivre.js) com a moldura da "ficha 4": coluna
 * de jogo à esquerda, roleplay/narração + token à direita. Há dois modelos:
 * CartaoAmeaca segue a Ficha de Ameaça oficial; CartaoNpc é uma pessoa
 * (classe, NEX, PV/PE/SAN, perícias, ataques, rituais, equipamento).
 * Em modo de ler, perícias, testes e ações rolam com um clique.
 *
 * `onAtualizar(patch)` recebe os campos alterados de uma vez.
 */
export default function FichaLivreCard(props) {
  return props.f.tipo === 'ameaca' ? <CartaoAmeaca {...props} /> : <CartaoNpc {...props} />;
}

// ------------------------------------------------------------ peças comuns

function usarFicha(f, onAtualizar, onRolar) {
  const set = (campo, valor) => onAtualizar({ [campo]: valor });
  const rolarPool = (nome, dados, bonus) => {
    if (!onRolar || dados == null || Number.isNaN(Number(dados))) return;
    onRolar(rolarTeste({ nome: `${f.nome} — ${nome}`, dados: Number(dados), bonus: Number(bonus) || 0 }));
  };
  const rolarTexto = (nome, txt) => { const p = parseTesteTexto(txt); if (p) rolarPool(nome, p.dados, p.bonus); };
  const rolarDanoTexto = (nome, txt) => {
    const p = parseDanoTexto(txt);
    if (p && onRolar) onRolar(rolarDano({ nome: `${f.nome} — ${nome}`, dano: p.dano, tipoDano: p.tipoDano }));
  };
  const editarItem = (campo, lista, i, patch) => {
    const novas = [...lista];
    novas[i] = typeof patch === 'object' ? { ...novas[i], ...patch } : patch;
    set(campo, novas);
  };
  const removerItem = (campo, lista, i) => set(campo, lista.filter((_, j) => j !== i));
  return { set, rolarPool, rolarTexto, rolarDanoTexto, editarItem, removerItem };
}

function Campo({ rotulo, valor, onChange, placeholder, largura }) {
  return (
    <div className="campo" style={{ marginBottom: 0, ...(largura ? { maxWidth: largura } : null) }}>
      <label>{rotulo}</label>
      <input type="text" value={valor ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Atributos({ f, editando, set }) {
  return (
    <BlocoStat titulo="Atributos">
      {editando ? (
        <div className="grelha-editor" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {ATRIBUTOS.map((k) => (
            <Campo key={k} rotulo={k.toUpperCase()} valor={f.atributos?.[k]} onChange={(v) => set('atributos', { ...(f.atributos || {}), [k]: numOuTexto(v) })} />
          ))}
        </div>
      ) : (
        <TabelaLinha colunas={ATRIBUTOS.map((k) => ({ rotulo: k.toUpperCase(), valor: f.atributos?.[k] ?? '—' }))} />
      )}
    </BlocoStat>
  );
}

/** Linhas "Nome ... teste" que rolam ao clicar (sentidos, testes de resistência). */
function ListaRolavel({ linhas, rolarTexto, onRolar }) {
  const comValor = linhas.filter(([, v]) => v);
  if (comValor.length === 0) return <span className="dica">—</span>;
  return (
    <ul className="previa-pericias">
      {comValor.map(([rotulo, v]) => (
        <li key={rotulo} style={{ cursor: onRolar ? 'pointer' : undefined }} onClick={() => rolarTexto(rotulo, v)} title={onRolar ? `Rolar ${rotulo}` : undefined}>
          <span className="pn">{rotulo}</span><span className="pb">{v}</span>
        </li>
      ))}
    </ul>
  );
}

function Pericias({ f, editando, h, onRolar, comuns }) {
  const pericias = Array.isArray(f.pericias) ? f.pericias : [];
  // atalho: junta as perícias comuns que ainda faltam
  const emFalta = (comuns || []).filter((n) => !pericias.some((p) => p.nome.toLowerCase() === n.toLowerCase()));
  return (
    <BlocoStat titulo="Perícias" extra={pericias.length ? `${pericias.length}` : null}>
      {editando ? (
        <>
          {pericias.map((p, i) => (
            <div key={i} className="ameaca-linha-editavel ameaca-pericia-linha">
              <input type="text" value={p.nome} onChange={(e) => h.editarItem('pericias', pericias, i, { nome: e.target.value })} />
              <input type="number" value={p.dados} style={{ width: 44, flex: '0 0 auto' }} onChange={(e) => h.editarItem('pericias', pericias, i, { dados: Number(e.target.value) })} />
              <span style={{ flex: '0 0 auto' }}>d20+</span>
              <input type="number" value={p.bonus} style={{ width: 52, flex: '0 0 auto' }} onChange={(e) => h.editarItem('pericias', pericias, i, { bonus: Number(e.target.value) })} />
              <button type="button" className="btn-remover-linha" onClick={() => h.removerItem('pericias', pericias, i)}>×</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
            <button type="button" className="btn ghost sm" onClick={() => h.set('pericias', [...pericias, { nome: 'Nova perícia', dados: 1, bonus: 0 }])}>+ Perícia</button>
            {emFalta.length > 0 && (
              <button type="button" className="btn ghost sm" title={emFalta.join(', ')}
                onClick={() => h.set('pericias', [...pericias, ...emFalta.map((nome) => ({ nome, dados: 1, bonus: 0 }))])}>+ Perícias comuns</button>
            )}
          </div>
        </>
      ) : pericias.length === 0 ? (
        <span className="dica">Sem perícias.</span>
      ) : (
        <ul className="previa-pericias">
          {pericias.map((p, i) => (
            <li key={i} style={{ cursor: onRolar ? 'pointer' : undefined }} onClick={() => h.rolarPool(p.nome, p.dados, p.bonus)} title={onRolar ? `Rolar ${p.nome}` : undefined}>
              <span className="pn">{p.nome}</span>
              <span className="pb">{quantidadeDados(p.dados)}d20 {p.bonus >= 0 ? '+' : '−'}{Math.abs(p.bonus)}</span>
            </li>
          ))}
        </ul>
      )}
    </BlocoStat>
  );
}

/** Uma lista de linhas de texto (resistências, imunidades, equipamento…). */
function ListaTexto({ f, campo, rotulo, placeholder, editando, h, sempre }) {
  const lista = Array.isArray(f[campo]) ? f[campo] : [];
  if (!editando && lista.length === 0 && !sempre) return null;
  return (
    <BlocoStat titulo={rotulo} extra={lista.length > 1 ? `${lista.length}` : null}>
      {editando ? (
        <>
          {lista.map((linha, i) => (
            <div key={i} className="ameaca-linha-editavel">
              <input type="text" value={linha} placeholder={placeholder} onChange={(e) => h.editarItem(campo, lista, i, e.target.value)} />
              <button type="button" className="btn-remover-linha" onClick={() => h.removerItem(campo, lista, i)}>×</button>
            </div>
          ))}
          <button type="button" className="btn ghost sm" style={{ marginTop: 4 }} onClick={() => h.set(campo, [...lista, ''])}>+ {rotulo}</button>
        </>
      ) : lista.length === 0 ? (
        <span className="dica">—</span>
      ) : (
        <div style={{ fontSize: 13, color: 'var(--txt-dim)' }}>{lista.join(' · ')}</div>
      )}
    </BlocoStat>
  );
}

function Acoes({ f, editando, h, onRolar, titulo, novo }) {
  const acoes = acoesDeAmeaca(f);
  return (
    <BlocoStat titulo={titulo} extra={acoes.length ? `${acoes.length}` : null}>
      {editando ? (
        <>
          {acoes.map((acao, i) => (
            <div key={i} className="bloco arma" style={{ marginTop: i ? 10 : 0 }}>
              <div className="topo" style={{ gap: 8 }}>
                <select value={acao.tipo || 'Padrão'} style={{ width: 110, flex: '0 0 auto' }} onChange={(e) => h.editarItem('acoes', acoes, i, { tipo: e.target.value })}>
                  {TIPOS_ACAO.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input type="text" value={acao.nome || ''} placeholder="Nome" style={{ fontFamily: 'var(--display)', fontSize: 16 }}
                  onChange={(e) => h.editarItem('acoes', acoes, i, { nome: e.target.value })} />
                <button type="button" className="btn-remover-linha" onClick={() => h.removerItem('acoes', acoes, i)}>×</button>
              </div>
              <input type="text" value={acao.detalhe || ''} placeholder="Corpo a corpo x2 · À distância, curto…" style={{ marginTop: 6, fontSize: 13 }}
                onChange={(e) => h.editarItem('acoes', acoes, i, { detalhe: e.target.value })} />
              <div className="grelha-editor" style={{ gridTemplateColumns: '1fr 1.3fr .8fr', marginTop: 6 }}>
                <Campo rotulo="Teste" valor={acao.teste} placeholder="2d20+5" onChange={(v) => h.editarItem('acoes', acoes, i, { teste: v })} />
                <Campo rotulo="Dano" valor={acao.dano} placeholder="1d8+2 corte" onChange={(v) => h.editarItem('acoes', acoes, i, { dano: v })} />
                <Campo rotulo="Crítico" valor={acao.critico} placeholder="19/x2" onChange={(v) => h.editarItem('acoes', acoes, i, { critico: v })} />
              </div>
              <textarea rows={acao.descricao ? 2 : 1} value={acao.descricao || ''} placeholder="Efeito, condições, regra completa…" style={{ width: '100%', marginTop: 6 }}
                onChange={(e) => h.editarItem('acoes', acoes, i, { descricao: e.target.value })} />
            </div>
          ))}
          <button type="button" className="btn ghost sm" style={{ marginTop: acoes.length ? 10 : 0 }}
            onClick={() => h.set('acoes', [...acoes, { tipo: 'Padrão', nome: novo, detalhe: '', teste: '', dano: '', critico: '', descricao: '' }])}>+ {novo}</button>
        </>
      ) : acoes.length === 0 ? (
        <span className="dica">Nada definido.</span>
      ) : (
        <div className="ficha-livre-acoes">
          {acoes.map((acao, i) => (
            <div key={i} className="ficha-livre-acao">
              <div className="ficha-livre-acao-topo">
                <b>{acao.nome}</b>
                <span className="ficha-livre-tag">{acao.tipo || 'Padrão'}</span>
                {acao.detalhe && <span className="ficha-livre-det">{acao.detalhe}</span>}
              </div>
              {(acao.teste || acao.dano || acao.critico) && (
                <div className="ficha-livre-acao-numeros">
                  {acao.teste && <span>Teste <b>{acao.teste}</b></span>}
                  {acao.dano && <span>Dano <b>{acao.dano}</b></span>}
                  {acao.critico && <span>Crítico <b>{acao.critico}</b></span>}
                  {onRolar && (acao.teste || acao.dano) && (
                    <span className="ficha-livre-acao-botoes">
                      {acao.teste && <button type="button" className="btn sm" onClick={() => h.rolarTexto(acao.nome, acao.teste)}>Atacar</button>}
                      {acao.dano && <button type="button" className="btn ghost sm" onClick={() => h.rolarDanoTexto(`${acao.nome} — dano`, acao.dano)}>Dano</button>}
                    </span>
                  )}
                </div>
              )}
              {acao.descricao && <div className="ficha-livre-det" style={{ marginTop: 4 }}>{acao.descricao}</div>}
            </div>
          ))}
        </div>
      )}
    </BlocoStat>
  );
}

function Habilidades({ f, editando, h, titulo }) {
  const habilidades = Array.isArray(f.habilidades) ? f.habilidades : [];
  // "poderes" das ameaças/ocultistas gerados — só se mostram, junto às habilidades
  const extra = Array.isArray(f.poderes) ? f.poderes : [];
  if (!editando && habilidades.length + extra.length === 0) return null;
  return (
    <BlocoStat titulo={titulo} extra={habilidades.length + extra.length ? `${habilidades.length + extra.length}` : null}>
      {editando ? (
        <>
          {habilidades.map((hab, i) => (
            <div key={i} className="bloco" style={{ marginTop: i ? 10 : 0 }}>
              <div className="topo" style={{ gap: 8 }}>
                <input type="text" value={hab.nome || ''} placeholder="Nome" style={{ fontFamily: 'var(--display)', fontSize: 16 }}
                  onChange={(e) => h.editarItem('habilidades', habilidades, i, { nome: e.target.value })} />
                <input type="text" value={hab.custo || ''} placeholder="Custo / ação" style={{ width: 130, flex: '0 0 auto', fontSize: 13 }}
                  onChange={(e) => h.editarItem('habilidades', habilidades, i, { custo: e.target.value })} />
                <button type="button" className="btn-remover-linha" onClick={() => h.removerItem('habilidades', habilidades, i)}>×</button>
              </div>
              <textarea rows={2} value={hab.descricao || ''} placeholder="O que faz, ativação, efeitos…" style={{ width: '100%', marginTop: 6 }}
                onChange={(e) => h.editarItem('habilidades', habilidades, i, { descricao: e.target.value })} />
            </div>
          ))}
          <button type="button" className="btn ghost sm" style={{ marginTop: habilidades.length ? 10 : 0 }}
            onClick={() => h.set('habilidades', [...habilidades, { nome: 'Nova habilidade', custo: '', descricao: '' }])}>+ Habilidade</button>
        </>
      ) : (
        <div className="ficha-livre-habilidades">
          {[...habilidades, ...extra].map((hab, i) => (
            <div key={i}>
              <b>{hab.nome}</b>{hab.custo && <span className="ficha-livre-tag">{hab.custo}</span>}
              {hab.descricao && <div className="ficha-livre-det">{hab.descricao}</div>}
            </div>
          ))}
        </div>
      )}
    </BlocoStat>
  );
}

function Rituais({ f, editando, h }) {
  const rituais = Array.isArray(f.rituais) ? f.rituais : [];
  if (!editando && rituais.length === 0) return null;
  return (
    <BlocoStat titulo="Rituais" extra={rituais.length ? `${rituais.length}` : null}>
      {editando ? (
        <>
          {rituais.map((r, i) => (
            <div key={i} className="bloco" style={{ marginTop: i ? 10 : 0 }}>
              <div className="topo" style={{ gap: 8 }}>
                <input type="text" value={r.nome || ''} placeholder="Nome do ritual" style={{ fontFamily: 'var(--display)', fontSize: 16 }}
                  onChange={(e) => h.editarItem('rituais', rituais, i, { nome: e.target.value })} />
                <button type="button" className="btn-remover-linha" onClick={() => h.removerItem('rituais', rituais, i)}>×</button>
              </div>
              <div className="grelha-editor" style={{ gridTemplateColumns: '.7fr 1.2fr .8fr .7fr', marginTop: 6 }}>
                <Campo rotulo="Círculo" valor={r.circulo} placeholder="1" onChange={(v) => h.editarItem('rituais', rituais, i, { circulo: v })} />
                <div className="campo" style={{ marginBottom: 0 }}>
                  <label>Elemento</label>
                  <select value={r.elemento || ''} onChange={(e) => h.editarItem('rituais', rituais, i, { elemento: e.target.value })}>
                    <option value="">—</option>
                    {ELEMENTOS.map((el) => <option key={el} value={el}>{el}</option>)}
                  </select>
                </div>
                <Campo rotulo="Custo" valor={r.custo} placeholder="1 PE" onChange={(v) => h.editarItem('rituais', rituais, i, { custo: v })} />
                <Campo rotulo="DT" valor={r.dt} placeholder="15" onChange={(v) => h.editarItem('rituais', rituais, i, { dt: v })} />
              </div>
              <div className="grelha-editor" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 6 }}>
                <Campo rotulo="Execução" valor={r.execucao} placeholder="Padrão" onChange={(v) => h.editarItem('rituais', rituais, i, { execucao: v })} />
                <Campo rotulo="Alcance" valor={r.alcance} placeholder="Curto" onChange={(v) => h.editarItem('rituais', rituais, i, { alcance: v })} />
              </div>
              <textarea rows={2} value={r.descricao || ''} placeholder="Efeito do ritual…" style={{ width: '100%', marginTop: 6 }}
                onChange={(e) => h.editarItem('rituais', rituais, i, { descricao: e.target.value })} />
            </div>
          ))}
          <button type="button" className="btn ghost sm" style={{ marginTop: rituais.length ? 10 : 0 }}
            onClick={() => h.set('rituais', [...rituais, { nome: 'Novo ritual', circulo: '1', elemento: '', dt: '', custo: '', execucao: '', alcance: '', descricao: '' }])}>+ Ritual</button>
        </>
      ) : (
        <div className="ficha-livre-habilidades">
          {rituais.map((r, i) => (
            <div key={i}>
              <b>{r.nome}</b>
              <span className="ficha-livre-tag">{[r.circulo && `${r.circulo}º círculo`, r.elemento, r.custo, temValor(r.dt) && `DT ${r.dt}`].filter(Boolean).join(' · ')}</span>
              {(r.execucao || r.alcance) && <div className="ficha-livre-det">{[r.execucao && `Execução: ${r.execucao}`, r.alcance && `Alcance: ${r.alcance}`].filter(Boolean).join(' · ')}</div>}
              {r.descricao && <div className="ficha-livre-det">{r.descricao}</div>}
            </div>
          ))}
        </div>
      )}
    </BlocoStat>
  );
}

function Notas({ f, editando, set }) {
  if (!f.notas && !editando) return null;
  return (
    <BlocoStat titulo="Notas">
      {editando
        ? <textarea rows={2} value={f.notas || ''} style={{ width: '100%' }} onChange={(e) => set('notas', e.target.value)} />
        : <div className="ficha-npc-historia" style={{ marginTop: 0 }}>{f.notas}</div>}
    </BlocoStat>
  );
}

function ColunaDireita({ f, editando, set, onAtualizar, titulo, vazioToken }) {
  const rp = roleplayDe(f);
  const campos = camposRoleplay(f.tipo);
  return (
    <div className="ficha-npc-coluna-direita">
      <div className="ficha-npc-roleplay">
        <div className="ficha-npc-rp-cabecalho">{titulo}</div>
        {editando ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {campos.map(([k, rotulo]) => (
              <div className="campo" key={k} style={{ marginBottom: 0 }}>
                <label>{rotulo}</label>
                <textarea rows={2} value={rp[k] || ''} onChange={(e) => set('roleplay', { ...rp, [k]: e.target.value })} />
              </div>
            ))}
          </div>
        ) : (
          <>
            {campos.filter(([k]) => k !== 'notasMestre').map(([k, rotulo]) => <CampoRoleplay key={k} rotulo={rotulo} valor={rp[k]} />)}
            {rp.notasMestre && (
              <div className="ficha-livre-segredo">
                <div className="ficha-npc-rp-rotulo">{campos.find(([k]) => k === 'notasMestre')[1]}</div>
                <div className="ficha-npc-rp-texto">{rp.notasMestre}</div>
              </div>
            )}
            {campos.every(([k]) => !rp[k]) && <p className="dica" style={{ fontSize: 12 }}>Vazio — carrega em "Editar" para o escreveres.</p>}
          </>
        )}
      </div>
      <div className="ficha-npc-token">
        <TokenFicha imagem={f.imagem} nome={f.nome} editavel={editando} vazio={vazioToken}
          aoMudar={(imagem) => onAtualizar({ imagem, imagemPosX: undefined, imagemPosY: undefined, imagemZoom: undefined })} />
      </div>
    </div>
  );
}

// -------------------------------------------------------------- ameaça

function CartaoAmeaca({ f, editando, onAtualizar, onRolar }) {
  const h = usarFicha(f, onAtualizar, onRolar);
  const { set } = h;
  const descritores = Array.isArray(f.descritores) ? f.descritores : [];
  const principal = ELEMENTOS.includes(descritores[0]) ? descritores[0] : '';
  const secundarios = principal ? descritores.slice(1) : descritores;
  const pp = f.presencaPerturbadora;
  const linha = [descritores.join(' · '), f.tamanho, f.categoria].filter(Boolean).join(' · ');

  return (
    <div className="ficha-npc ficha-livre" style={{ marginTop: 16 }}>
      <div className="ficha-npc-cabecalho">
        {editando ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="text" value={f.nome || ''} placeholder="Nome da criatura" onChange={(e) => set('nome', e.target.value)} style={{ fontSize: 20, fontWeight: 'bold', flex: 1 }} />
              <label className="ficha-livre-mini">VD<input type="text" value={f.vd ?? ''} onChange={(e) => set('vd', numOuTexto(e.target.value))} /></label>
            </div>
            <div className="grelha-editor" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="campo" style={{ marginBottom: 0 }}>
                <label>Elemento principal</label>
                <select value={principal} onChange={(e) => set('descritores', [e.target.value, ...secundarios].filter(Boolean))}>
                  <option value="">— (Realidade)</option>
                  {ELEMENTOS.map((el) => <option key={el} value={el}>{el}</option>)}
                </select>
              </div>
              <div className="campo" style={{ marginBottom: 0 }}>
                <label>Tamanho</label>
                <select value={f.tamanho || ''} onChange={(e) => set('tamanho', e.target.value)}>
                  {TAMANHOS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <Campo rotulo="Categoria" valor={f.categoria} placeholder="Criatura, Pessoa, Animal…" onChange={(v) => set('categoria', v)} />
            </div>
            <EditorTags tags={secundarios} onChange={(v) => set('descritores', [principal, ...v].filter(Boolean))} rotulo="" dica=""
              placeholder="Elementos secundários / descritores…" sugestoesPersonalizadas={[...ELEMENTOS, 'Criatura', 'Humano', 'Animal']} />
            <textarea rows={3} value={f.historia || ''} placeholder="Descrição — o que é, de onde veio, como se manifesta."
              onChange={(e) => set('historia', e.target.value)} style={{ fontSize: 13 }} />
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <div className="ficha-npc-nome" style={{ flex: 1 }}>{f.nome}</div>
              {temValor(f.vd) && <span className="ficha-livre-vd">VD {f.vd}</span>}
            </div>
            {linha && <div className="ficha-npc-breve">{linha}</div>}
            {f.historia && <div className="ficha-npc-historia">{f.historia}</div>}
          </>
        )}
      </div>

      <div className="ficha-npc-corpo">
        <div className="ficha-npc-stats">
          {(pp || editando) && (
            <BlocoStat titulo="Presença Perturbadora">
              {editando ? (
                pp ? (
                  <div className="grelha-editor" style={{ gridTemplateColumns: '.8fr 1.4fr .8fr auto', alignItems: 'end' }}>
                    <Campo rotulo="DT" valor={pp.dt} onChange={(v) => set('presencaPerturbadora', { ...pp, dt: numOuTexto(v) })} />
                    <Campo rotulo="Dano mental" valor={pp.dano} placeholder="2d6 mental" onChange={(v) => set('presencaPerturbadora', { ...pp, dano: v })} />
                    <Campo rotulo="NEX %" valor={pp.nex} placeholder="30" onChange={(v) => set('presencaPerturbadora', { ...pp, nex: v })} />
                    <button type="button" className="btn-remover-linha" title="Sem presença perturbadora" onClick={() => set('presencaPerturbadora', null)}>×</button>
                  </div>
                ) : (
                  <button type="button" className="btn ghost sm" onClick={() => set('presencaPerturbadora', { dt: '', dano: '', nex: '' })}>+ Presença Perturbadora</button>
                )
              ) : (
                <div className="ficha-livre-acao-numeros" style={{ marginTop: 0 }}>
                  {temValor(pp.dt) && <span>DT <b>{pp.dt}</b></span>}
                  {pp.dano && <span>Dano <b>{pp.dano}</b></span>}
                  {temValor(pp.nex) && <span>Imune a partir de <b>NEX {pp.nex}%</b></span>}
                </div>
              )}
            </BlocoStat>
          )}

          <BlocoStat titulo="Sentidos">
            {editando ? (
              <div className="grelha-editor" style={{ gridTemplateColumns: '1fr 1fr 1.4fr' }}>
                <Campo rotulo="Percepção" valor={f.sentidos?.percepcao} placeholder="ex.: 2d20+5" onChange={(v) => set('sentidos', { ...(f.sentidos || {}), percepcao: v })} />
                <Campo rotulo="Iniciativa" valor={f.sentidos?.iniciativa} placeholder="ex.: 2d20+5" onChange={(v) => set('sentidos', { ...(f.sentidos || {}), iniciativa: v })} />
                <Campo rotulo="Especial" valor={f.sentidos?.extra} placeholder="Percepção às cegas…" onChange={(v) => set('sentidos', { ...(f.sentidos || {}), extra: v })} />
              </div>
            ) : (
              <>
                <ListaRolavel linhas={[['Percepção', f.sentidos?.percepcao], ['Iniciativa', f.sentidos?.iniciativa]]} rolarTexto={h.rolarTexto} onRolar={onRolar} />
                {f.sentidos?.extra && <div className="ficha-livre-det" style={{ marginTop: 6 }}>{f.sentidos.extra}</div>}
              </>
            )}
          </BlocoStat>

          <BlocoStat titulo="Defesa">
            {editando ? (
              <div className="grelha-editor" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <Campo rotulo="Defesa" valor={f.defesa} onChange={(v) => set('defesa', numOuTexto(v))} />
                {[['fortitude', 'Fortitude'], ['reflexos', 'Reflexos'], ['vontade', 'Vontade']].map(([k, r]) => (
                  <Campo key={k} rotulo={r} valor={f.testes?.[k]} placeholder="ex.: 2d20+5" onChange={(v) => set('testes', { ...(f.testes || {}), [k]: v })} />
                ))}
              </div>
            ) : (
              <>
                <TabelaLinha colunas={[{ rotulo: 'Defesa', valor: f.defesa ?? '—' }]} />
                <div style={{ marginTop: 8 }}>
                  <ListaRolavel linhas={[['Fortitude', f.testes?.fortitude], ['Reflexos', f.testes?.reflexos], ['Vontade', f.testes?.vontade]]} rolarTexto={h.rolarTexto} onRolar={onRolar} />
                </div>
              </>
            )}
          </BlocoStat>

          <BlocoStat titulo="Pontos de Vida">
            {editando ? (
              <div className="grelha-editor" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <Campo rotulo="PV" valor={f.pv} onChange={(v) => set('pv', numOuTexto(v))} />
                <Campo rotulo="Machucado" valor={f.pvMachucado} placeholder={temValor(f.pv) ? String(Math.floor(Number(f.pv) / 2) || '') : ''} onChange={(v) => set('pvMachucado', numOuTexto(v))} />
              </div>
            ) : (
              <TabelaLinha colunas={[
                { rotulo: 'PV', valor: temValor(f.pvAtual) && f.pvAtual !== f.pv ? `${f.pvAtual}/${f.pv}` : f.pv },
                { rotulo: 'Machucado', valor: f.pvMachucado ?? '—' },
              ]} />
            )}
          </BlocoStat>
          <ListaTexto f={f} campo="resistencias" rotulo="Resistências" placeholder="Balístico, corte e perfuração 10" editando={editando} h={h} />
          <ListaTexto f={f} campo="vulnerabilidades" rotulo="Vulnerabilidades" placeholder="Morte" editando={editando} h={h} />
          <ListaTexto f={f} campo="imunidades" rotulo="Imunidades" placeholder="Condições de paralisia" editando={editando} h={h} />

          <Atributos f={f} editando={editando} set={set} />
          <Pericias f={f} editando={editando} h={h} onRolar={onRolar} />

          <BlocoStat titulo="Deslocamento">
            {editando
              ? <Campo rotulo="" valor={f.deslocamento} placeholder="9m | 6 (voando)" onChange={(v) => set('deslocamento', v)} largura={220} />
              : <div className="ficha-livre-linha" style={{ marginTop: 0 }}><b>{f.deslocamento || '—'}</b></div>}
          </BlocoStat>

          <Habilidades f={f} editando={editando} h={h} titulo="Habilidades" />
          <Acoes f={f} editando={editando} h={h} onRolar={onRolar} titulo="Ações" novo="Nova ação" />
          <Rituais f={f} editando={editando} h={h} />

          {(f.enigmaDoMedo != null || editando) && (
            <BlocoStat titulo="Enigma do Medo">
              {editando ? (
                f.enigmaDoMedo != null ? (
                  <>
                    <textarea rows={4} value={f.enigmaDoMedo} style={{ width: '100%' }} onChange={(e) => set('enigmaDoMedo', e.target.value)} />
                    <button type="button" className="btn-remover-linha" onClick={() => set('enigmaDoMedo', null)}>× sem enigma</button>
                  </>
                ) : (
                  <button type="button" className="btn ghost sm" onClick={() => set('enigmaDoMedo', '')}>+ Enigma do Medo</button>
                )
              ) : (
                <div className="ficha-npc-historia" style={{ marginTop: 0 }}>{f.enigmaDoMedo}</div>
              )}
            </BlocoStat>
          )}

          <Notas f={f} editando={editando} set={set} />
          {editando && <EditorTags tags={f.tags || []} onChange={(v) => set('tags', v)} />}
        </div>

        <ColunaDireita f={f} editando={editando} set={set} onAtualizar={onAtualizar} titulo="Narração"
          vazioToken={<div className="ficha-livre-interrogacao" aria-hidden="true">?</div>} />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------- NPC

function CartaoNpc({ f, editando, onAtualizar, onRolar }) {
  const h = usarFicha(f, onAtualizar, onRolar);
  const { set } = h;
  const linha = [f.classe, f.origem && `Origem: ${f.origem}`, f.trilha && `Trilha: ${f.trilha}`, temValor(f.nex) && `NEX ${f.nex}%`, f.afiliacao].filter(Boolean).join(' · ');

  return (
    <div className="ficha-npc ficha-livre" style={{ marginTop: 16 }}>
      <div className="ficha-npc-cabecalho">
        {editando ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input type="text" value={f.nome || ''} placeholder="Nome do NPC" onChange={(e) => set('nome', e.target.value)} style={{ fontSize: 20, fontWeight: 'bold' }} />
            <input type="text" value={f.breveDescricao || ''} placeholder="Conceito / ocupação (ex.: Agente veterano da Ordem, dono do bar…)"
              onChange={(e) => set('breveDescricao', e.target.value)} style={{ fontSize: 13 }} />
            <div className="grelha-editor" style={{ gridTemplateColumns: '1.2fr 1fr 1fr 1.2fr .6fr .6fr' }}>
              <div className="campo" style={{ marginBottom: 0 }}>
                <label>Classe</label>
                <input type="text" list="classes-npc" value={f.classe || ''} placeholder="—" onChange={(e) => set('classe', e.target.value)} />
                <datalist id="classes-npc">{CLASSES_NPC.map((c) => <option key={c} value={c} />)}</datalist>
              </div>
              <Campo rotulo="Origem" valor={f.origem} onChange={(v) => set('origem', v)} />
              <Campo rotulo="Trilha" valor={f.trilha} onChange={(v) => set('trilha', v)} />
              <Campo rotulo="Afiliação" valor={f.afiliacao} placeholder="Ordo Realitas…" onChange={(v) => set('afiliacao', v)} />
              <Campo rotulo="NEX %" valor={f.nex} onChange={(v) => set('nex', numOuTexto(v))} />
              <Campo rotulo="VD" valor={f.vd} placeholder="—" onChange={(v) => set('vd', numOuTexto(v))} />
            </div>
            <textarea rows={3} value={f.historia || ''} placeholder="História — quem é, o que faz, o que o liga à cena."
              onChange={(e) => set('historia', e.target.value)} style={{ fontSize: 13 }} />
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <div className="ficha-npc-nome" style={{ flex: 1 }}>{f.nome}</div>
              {temValor(f.vd) && <span className="ficha-livre-vd">VD {f.vd}</span>}
            </div>
            {f.breveDescricao && <div className="ficha-npc-breve">{f.breveDescricao}</div>}
            {linha && <div className="ficha-npc-breve">{linha}</div>}
            {f.historia && <div className="ficha-npc-historia">{f.historia}</div>}
          </>
        )}
      </div>

      <div className="ficha-npc-corpo">
        <div className="ficha-npc-stats">
          <Atributos f={f} editando={editando} set={set} />

          <BlocoStat titulo="Vida & Recursos">
            {editando ? (
              <div className="grelha-editor" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[['pv', 'PV'], ['pe', 'PE'], ['san', 'SAN']].map(([k, r]) => (
                  <Campo key={k} rotulo={r} valor={f[k]} placeholder="—" onChange={(v) => set(k, numOuTexto(v))} />
                ))}
              </div>
            ) : (
              <TabelaLinha colunas={[
                { rotulo: 'PV', valor: atualDe(f.pvAtual, f.pv) },
                { rotulo: 'PE', valor: temValor(f.pe) ? atualDe(f.peAtual, f.pe) : '—' },
                { rotulo: 'SAN', valor: temValor(f.san) ? atualDe(f.sanAtual, f.san) : '—' },
              ]} />
            )}
          </BlocoStat>

          <BlocoStat titulo="Defesa">
            {editando ? (
              <div className="grelha-editor" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[['defesa', 'Defesa'], ['bloqueio', 'Bloqueio'], ['esquiva', 'Esquiva']].map(([k, r]) => (
                  <Campo key={k} rotulo={r} valor={f[k]} placeholder="—" onChange={(v) => set(k, numOuTexto(v))} />
                ))}
              </div>
            ) : (
              <TabelaLinha colunas={[
                { rotulo: 'Defesa', valor: temValor(f.defesa) ? f.defesa : '—' },
                { rotulo: 'Bloqueio', valor: temValor(f.bloqueio) ? f.bloqueio : '—' },
                { rotulo: 'Esquiva', valor: temValor(f.esquiva) ? f.esquiva : '—' },
              ]} />
            )}
          </BlocoStat>

          <BlocoStat titulo="Deslocamento">
            {editando
              ? <Campo rotulo="" valor={f.deslocamento} placeholder="9m" onChange={(v) => set('deslocamento', v)} largura={220} />
              : <div className="ficha-livre-linha" style={{ marginTop: 0 }}><b>{f.deslocamento || '—'}</b></div>}
          </BlocoStat>

          <Pericias f={f} editando={editando} h={h} onRolar={onRolar} comuns={PERICIAS_BASE_NPC} />
          <ListaTexto f={f} campo="resistencias" rotulo="Resistências" placeholder="Mental 5, Balístico 2…" editando={editando} h={h} />
          <Acoes f={f} editando={editando} h={h} onRolar={onRolar} titulo="Ataques" novo="Novo ataque" />
          <Habilidades f={f} editando={editando} h={h} titulo="Habilidades & Poderes" />
          <Rituais f={f} editando={editando} h={h} />
          <ListaTexto f={f} campo="equipamento" rotulo="Equipamento" placeholder="Pistola .38, kit médico, lanterna…" editando={editando} h={h} />
          <Notas f={f} editando={editando} set={set} />
          {editando && <EditorTags tags={f.tags || []} onChange={(v) => set('tags', v)} />}
        </div>

        <ColunaDireita f={f} editando={editando} set={set} onAtualizar={onAtualizar} titulo="Roleplay"
          vazioToken={<img src={tokenPlaceholder} alt="" className="ficha-npc-token-placeholder" />} />
      </div>
    </div>
  );
}
