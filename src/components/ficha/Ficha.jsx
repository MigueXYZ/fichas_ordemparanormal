import React, { useEffect, useRef, useState } from 'react';
import RodaAtributos from '../RodaAtributos.jsx';
import BarraRecurso from './BarraRecurso.jsx';
import TabelaPericias from './TabelaPericias.jsx';
import PainelCondicoes from './PainelCondicoes.jsx';
import { AbaCombate, AbaHabilidades, AbaRituais, AbaInventario, AbaDescricao } from './Abas.jsx';
import { CLASSES, trilhasDaClasse } from '../../data/classes.js';
import { ORIGENS } from '../../data/origens.js';
import { REGRAS_ATRIBUTOS } from '../../data/atributos.js';
import { PERICIAS } from '../../data/pericias.js';
import { calcMaximos, calcDefesas, calcPePorRodada, calcDeslocamento, degrauNex, nexEfetivo, NEX_TRACK } from '../../engine/calc.js';
import RegrasOpcionais from './RegrasOpcionais.jsx';
import { ajustarRecursos } from '../../engine/character.js';
import { lerImagem } from '../../engine/armazenamento.js';
import { rolarTeste, rolarDano } from '../../engine/dados.js';

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

const ABAS = [
  { id: 'combate', nome: 'Combate' },
  { id: 'habilidades', nome: 'Habilidades' },
  { id: 'rituais', nome: 'Rituais' },
  { id: 'inventario', nome: 'Inventário' },
  { id: 'descricao', nome: 'Descrição' },
];

function CardMonstruoso({ personagem, setPersonagem }) {
  if (!personagem.monstruosoAtivo) return null;
  
  const el = personagem.monstruosoElemento;
  const nex = nexEfetivo(personagem);

  let titulo = 'Ser Experimentado';
  if (nex >= 40) titulo = 'Ser Testado';
  if (nex >= 65) titulo = 'Ser Expurgado';
  if (nex >= 99) titulo = 'Ser Mutilado / Apavorante';

  let cor = 'var(--sangue)';
  if (el === 'Sangue') cor = '#c01521';
  if (el === 'Morte') cor = '#969ba1';
  if (el === 'Conhecimento') cor = '#d8b53c';
  if (el === 'Energia') cor = '#a15cd8';

  function atualizarPericiaConhecimento(idx, novaPericiaId) {
    let p = personagem.pericias ? JSON.parse(JSON.stringify(personagem.pericias)) : {};
    const escolhasAtuais = personagem.monstruosoConhecimentoPericias || ['', ''];
    const periciaAntiga = escolhasAtuais[idx];

    if (periciaAntiga && p[periciaAntiga]) {
      p[periciaAntiga].grau = 'destreinado';
    }

    if (novaPericiaId) {
      if (!p[novaPericiaId]) p[novaPericiaId] = { grau: 'treinado', outros: 0 };
      else p[novaPericiaId].grau = 'treinado';
    }

    escolhasAtuais[idx] = novaPericiaId;
    setPersonagem({
      ...personagem,
      pericias: p,
      monstruosoConhecimentoPericias: escolhasAtuais
    });
  }

  const escolhas = personagem.monstruosoConhecimentoPericias || ['', ''];

  return (
    <div style={{ border: `1px solid ${cor}`, borderRadius: '6px', padding: '14px', marginBottom: '16px', background: 'rgba(0,0,0,0.4)' }}>
      <h3 style={{ color: cor, marginTop: 0, marginBottom: '10px', textTransform: 'uppercase', fontSize: '16px', letterSpacing: '1px' }}>
        {titulo} ({el})
      </h3>
      <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--txt-dim)', fontSize: '13.5px', lineHeight: '1.6' }}>
        {el === 'Sangue' && (
          <>
            <li><strong>Mecânica:</strong> Usa FOR para PE. Soma FOR em testes de Força.</li>
            <li><strong>Passivo (10%):</strong> Grande (+2 manobras, -2 Furtividade).</li>
            {nex >= 40 && <li><strong>Passivo (40%):</strong> +1d6 dano de Sangue nos ataques. Ganhas RD 2. Pode devorar INT para recuperar PE.</li>}
            {nex >= 65 && <li><strong>Passivo (65%):</strong> Braço substituído.</li>}
            {nex >= 99 && <li><strong>Passivo (99%):</strong> +1 FOR. Rituais de Sangue/Medo de 4º círculo sem componentes.</li>}
          </>
        )}
        {el === 'Morte' && (
          <>
            <li><strong>Mecânica:</strong> Usa VIG para PE. Soma VIG em testes de Vigor.</li>
            <li><strong>Passivo (10%):</strong> +1 ação padrão adicional por cena.</li>
            {nex >= 40 && <li><strong>Passivo (40%):</strong> Imunidade a fadiga. RD Perfurar e Morte 5. Soma Força nos PV.</li>}
            {nex >= 65 && <li><strong>Passivo (65%):</strong> Lodo na pele. A 0 PV recuperas 2 PE.</li>}
            {nex >= 99 && <li><strong>Passivo (99%):</strong> +1 VIG. Imortal. Rituais de Morte/Medo de 4º círculo sem componentes.</li>}
          </>
        )}
        {el === 'Conhecimento' && (
          <>
            <li><strong>Mecânica:</strong> Usa INT para PE. Soma INT em testes de Intelecto.</li>
            <li><strong>Passivo (10%):</strong> Considerado treinado em 2 perícias à escolha:</li>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px', marginBottom: '8px' }}>
              <select 
                value={escolhas[0]} 
                onChange={(e) => atualizarPericiaConhecimento(0, e.target.value)}
                style={{ flex: 1, padding: '4px', fontSize: '12px' }}
              >
                <option value="">-- Escolhe a 1ª perícia --</option>
                {PERICIAS.map(per => <option key={per.id} value={per.id}>{per.nome}</option>)}
              </select>
              <select 
                value={escolhas[1]} 
                onChange={(e) => atualizarPericiaConhecimento(1, e.target.value)}
                style={{ flex: 1, padding: '4px', fontSize: '12px' }}
              >
                <option value="">-- Escolhe a 2ª perícia --</option>
                {PERICIAS.map(per => <option key={per.id} value={per.id}>{per.nome}</option>)}
              </select>
            </div>
            {nex >= 40 && <li><strong>Passivo (40%):</strong> Visão no escuro. RD Balístico e Conhecimento 5. Soma INT na Defesa.</li>}
            {nex >= 65 && <li><strong>Passivo (65%):</strong> +1 INT. Tatuagens de ouro.</li>}
            {nex >= 99 && <li><strong>Passivo (99%):</strong> +1 INT. Rituais de Conhecimento/Medo de 4º círculo sem componentes.</li>}
          </>
        )}
        {el === 'Energia' && (
          <>
            <li><strong>Mecânica:</strong> Usa AGI para PE. Soma AGI em testes de Agilidade.</li>
            <li><strong>Passivo (10%):</strong> +6m deslocamento. Sacar item é ação livre.</li>
            {nex >= 40 && <li><strong>Passivo (40%):</strong> Ignora bloqueios. RD Corte, Fogo, Eletricidade e Energia 5.</li>}
            {nex >= 65 && <li><strong>Passivo (65%):</strong> +1 AGI. Ignora terreno difícil. Imune a dano de queda. Teleporte (1 PE).</li>}
            {nex >= 99 && <li><strong>Passivo (99%):</strong> +1 AGI. Rituais de Energia/Medo de 4º círculo sem componentes.</li>}
          </>
        )}
      </ul>
    </div>
  );
}

export default function Ficha({ personagem, setPersonagem, onRolar }) {
  const [aba, setAba] = useState('combate');
  const [erroFoto, setErroFoto] = useState(null);
  const [verRegras, setVerRegras] = useState(false);
  const [modalMonstruoso, setModalMonstruoso] = useState(false);
  const [modalDesligar, setModalDesligar] = useState(false);
  const [menuAvatarAberto, setMenuAvatarAberto] = useState(false);
  
  const fileInputRef = useRef(null);
  const containerAvatarRef = useRef(null);

  // Fecha o menu do avatar ao clicar fora
  useEffect(() => {	
    function handleClickFora(e) {
      if (containerAvatarRef.current && !containerAvatarRef.current.contains(e.target)) {
        setMenuAvatarAberto(false);
      }
    }
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  const regras = personagem.regras || {};
  const nexUtil = nexEfetivo(personagem);

  const max = calcMaximos(personagem);
  const d = calcDefesas(personagem);
  
  const set = (patch) => setPersonagem(prev => ({ ...prev, ...patch }));
  const setComRecursos = (patch) => setPersonagem(prev => ajustarRecursos(prev, { ...prev, ...patch }));
  const nomeOrigem = personagem.origemId === '__custom__'
    ? personagem.origemCustom?.nome || 'Personalizada'
    : ORIGENS.find((o) => o.id === personagem.origemId)?.nome || '';

  const trilhaStr = String(personagem.trilhaId || '').toLowerCase();
  const ehMonstruoso = trilhaStr.includes('monstruoso');

  const getSimbUrl = (el) => {
    if (el === 'Sangue') return '/img/sigilo-sangue.png';
    if (el === 'Morte') return '/img/sigilo-morte.png';
    if (el === 'Conhecimento') return '/img/sigilo-conhecimento.png';
    if (el === 'Energia') return '/img/sigilo-energia.png';
    return '/img/roda-sigilos.png';
  };
  
  const getCor = (el) => {
    if (el === 'Sangue') return '#c01521';
    if (el === 'Morte') return '#969ba1';
    if (el === 'Conhecimento') return '#d8b53c';
    if (el === 'Energia') return '#a15cd8';
    return 'var(--txt-fraco)';
  };

  async function escolherFoto(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErroFoto(null);
    try {
      set({ imagem: await lerImagem(f) });
    } catch (err) {
      setErroFoto(err.message);
    }
    e.target.value = '';
    setMenuAvatarAberto(false);
  }

  function lidarCliqueRetrato() {
    if (!personagem.imagem) {
      fileInputRef.current?.click();
    } else {
      setMenuAvatarAberto(!menuAvatarAberto);
    }
  }

  function executarMonstruoso(elemento) {
    const inv = [...(personagem.inventario || [])];
    const idxComp = inv.findIndex(item => item.nome && item.nome.toLowerCase().includes('componentes'));

    if (idxComp === -1) {
      alert('Não tens "Componentes Ritualísticos" no inventário!');
      return;
    }

    const itemComp = inv[idxComp];
    const qtdComp = Number(itemComp.quantidade || 1);
    if (qtdComp > 1) {
      inv[idxComp] = { ...itemComp, quantidade: qtdComp - 1 };
    } else {
      inv.splice(idxComp, 1);
    }

    let qtdD8 = 1, bonusD8 = 1;
    let penSocial = -2;
    if (nexUtil >= 40) { qtdD8 = 2; bonusD8 = 2; penSocial = -5; }
    if (nexUtil >= 65) { qtdD8 = 3; bonusD8 = 3; penSocial = -10; }
    if (nexUtil >= 99) { qtdD8 = 4; bonusD8 = 4; penSocial = -20; }
    
    let novasPericias = personagem.pericias ? JSON.parse(JSON.stringify(personagem.pericias)) : {};
    const isArray = Array.isArray(novasPericias);

    let ocultBuff = 2;

    const aplicarPericia = (id, val) => {
        if (isArray) {
            let per = novasPericias.find(x => x.id === id || x.nome?.toLowerCase() === id);
            if (per) per.outros = (Number(per.outros) || 0) + val;
            else novasPericias.push({ id: id, treino: 0, bonus: 0, outros: val });
        } else {
            if (!novasPericias[id]) novasPericias[id] = { treino: 0, bonus: 0, outros: 0 };
            novasPericias[id].outros = (Number(novasPericias[id].outros) || 0) + val;
        }
    };

    let buffsAplicados = {
        diplomacia: penSocial,
        enganacao: penSocial,
        intuicao: penSocial,
        ocultismo: ocultBuff
    };

    if (elemento === 'Sangue') buffsAplicados.furtividade = -2;

    Object.keys(buffsAplicados).forEach(key => aplicarPericia(key, buffsAplicados[key]));

    const roloCura = rolarDano({
      nome: `Experimento (${elemento})`,
      dano: `${qtdD8}d8`,
      bonus: bonusD8
    });
    if (roloCura) onRolar(roloCura);

    let totalCura = roloCura ? roloCura.total : 0;
    let totalTemp = 0;

    if (elemento === 'Morte') {
      const qtdD6 = nexUtil >= 40 ? 4 : 2;
      const roloMorte = rolarDano({
        nome: `Vida Temporária`,
        dano: `${qtdD6}d6`,
        bonus: 0
      });
      if (roloMorte) onRolar(roloMorte);
      totalTemp = roloMorte ? roloMorte.total : 0;
    }

    setComRecursos({
      inventario: inv,
      monstruosoAtivo: true,
      monstruosoElemento: elemento,
      monstruosoBuffs: buffsAplicados,
      pericias: novasPericias,
      pvAtual: Math.min(max.pv, (personagem.pvAtual || max.pv) + totalCura),
      pvTemp: (personagem.pvTemp || 0) + totalTemp
    });
    
    setModalMonstruoso(false);
  }

  function desligarMonstruoso() {
    let novasPericias = personagem.pericias ? JSON.parse(JSON.stringify(personagem.pericias)) : {};
    const buffsAtivos = personagem.monstruosoBuffs || {};
    const isArray = Array.isArray(novasPericias);
    
    const removerPericia = (id, val) => {
        if (isArray) {
            let per = novasPericias.find(x => x.id === id || x.nome?.toLowerCase() === id);
            if (per) per.outros = (Number(per.outros) || 0) - val;
        } else {
            if (novasPericias[id]) novasPericias[id].outros = (Number(novasPericias[id].outros) || 0) - val;
        }
    };
    
    Object.keys(buffsAtivos).forEach(key => removerPericia(key, buffsAtivos[key]));

    const escolhasConhecimento = personagem.monstruosoConhecimentoPericias || [];
    escolhasConhecimento.forEach(perId => {
      if (perId && novasPericias[perId]) novasPericias[perId].grau = 'destreinado';
    });
    
    setComRecursos({ 
      monstruosoAtivo: false, 
      monstruosoElemento: null, 
      monstruosoBuffs: {}, 
      monstruosoConhecimentoPericias: ['', ''],
      pericias: novasPericias,
      pvTemp: 0
    });

    setModalDesligar(false);
  }

  return (
    <div className="container">
      <div className="cabecalho-ficha">
        <div ref={containerAvatarRef} style={{ position: 'relative' }}>
          <div 
            className="retrato" 
            onClick={lidarCliqueRetrato}
            style={{ 
              cursor: 'pointer', 
              backgroundImage: personagem.imagem ? `url(${personagem.imagem})` : undefined 
            }}
          >
            {!personagem.imagem && 'AVATAR'}
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*,image/gif" 
              onChange={escolherFoto} 
              style={{ display: 'none' }} 
            />
          </div>

          {menuAvatarAberto && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              background: '#1a0505',
              border: '1px solid var(--sangue)',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.8)',
              zIndex: 50,
              width: '140px',
              overflow: 'hidden'
            }}>
              <button
                type="button"
                className="btn ghost sm"
                style={{ width: '100%', textAlign: 'left', borderRadius: 0, border: 'none', padding: '10px 12px', fontSize: '12px' }}
                onClick={() => { setMenuAvatarAberto(false); fileInputRef.current?.click(); }}
              >
                Trocar avatar
              </button>
              <button
                type="button"
                className="btn ghost sm"
                style={{ width: '100%', textAlign: 'left', borderRadius: 0, border: 'none', padding: '10px 12px', fontSize: '12px', color: '#ef4444' }}
                onClick={() => { set({ imagem: null }); setMenuAvatarAberto(false); }}
              >
                Remover avatar
              </button>
            </div>
          )}

          {erroFoto && <div className="aviso" style={{ maxWidth: 200, fontSize: 11, marginTop: 4 }}>{erroFoto}</div>}
        </div>

        <div>
          <div className="campo-linha">
            <label>Personagem</label>
            <input type="text" value={personagem.nome} onChange={(e) => set({ nome: e.target.value })} />
          </div>
          <div className="campo-linha">
            <label>Origem</label>
            <input type="text" value={nomeOrigem} readOnly />
          </div>
          <div className="campo-linha">
            <label>Patente</label>
            <input type="text" value={personagem.patente} onChange={(e) => set({ patente: e.target.value })} />
          </div>
        </div>

        <div>
          <div className="campo-linha">
            <label>Jogador</label>
            <input type="text" value={personagem.jogador} onChange={(e) => set({ jogador: e.target.value })} />
          </div>
          <div className="campo-linha">
            <label>Classe</label>
            <select value={personagem.classeId || ''} onChange={(e) => set({ classeId: e.target.value, trilhaId: null })}>
              <option value="">—</option>
              {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          
          <div className="campo-linha">
            <label>Trilha</label>
            <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '14px', borderBottom: 'none' }}>
              <select
                style={{ flex: 1, minWidth: 0, borderBottom: '1px solid var(--linha-forte)' }}
                value={personagem.trilhaId || ''}
                disabled={nexUtil < 10}
                onChange={(e) => set({ trilhaId: e.target.value || null })}
              >
                <option value="">{nexUtil < 10 ? (regras.nivelSeparado ? 'A partir do nível 2' : 'A partir de NEX 10%') : '—'}</option>
                {trilhasDaClasse(personagem.classeId).map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>

              {ehMonstruoso && (
                <button
                  type="button"
                  title={personagem.monstruosoAtivo ? `Desativar Experimento de ${personagem.monstruosoElemento}` : `Ativar Experimento`}
                  onClick={() => {
                    if (personagem.monstruosoAtivo) {
                      setModalDesligar(true);
                    } else {
                      setModalMonstruoso(true);
                    }
                  }}
                  style={{
                    flexShrink: 0,
                    width: '38px', 
                    height: '38px',
                    background: 'transparent',
                    border: 'none', 
                    padding: 0,
                    cursor: 'pointer',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                >
                  <img 
                    src={personagem.monstruosoAtivo ? getSimbUrl(personagem.monstruosoElemento) : getSimbUrl('Roda')} 
                    alt="Monstruoso" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain', 
                      mixBlendMode: 'screen', 
                      opacity: personagem.monstruosoAtivo ? 1 : 0.6,
                      filter: personagem.monstruosoAtivo ? `drop-shadow(0 0 6px ${getCor(personagem.monstruosoElemento)})` : 'drop-shadow(0 0 3px rgba(255,255,255,0.4))'
                    }} 
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {verRegras && (
        <RegrasOpcionais
          regras={regras}
          aoMudar={(novas) => setComRecursos({ regras: novas })}
          nex={personagem.nex}
          exposicao={personagem.exposicao || {}}
          aoMudarExposicao={(nova) => setComRecursos({ exposicao: nova })}
          aoFechar={() => setVerRegras(false)}
        />
      )}

      {/* Grid Principal da Ficha */}
      <div className="ficha">
        {/* Coluna Esquerda */}
        <div>
          <RodaAtributos
            atributos={personagem.atributos}
            mini
            onRolar={(a, valor) => onRolar(rolarTeste({ nome: a.nome, dados: valor, bonus: 0, detalhe: a.sigla }))}
            onChange={(id, v) => {
              if (v < 0 || v > REGRAS_ATRIBUTOS.maximoAbsoluto) return;
              setComRecursos({ atributos: { ...personagem.atributos, [id]: v } });
            }}
            podeSubir={(id) => personagem.atributos[id] < REGRAS_ATRIBUTOS.maximoAbsoluto}
            podeDescer={(id) => personagem.atributos[id] > 0}
          />

          <div className="linha-regras" style={{ width: '100%', textAlign: 'center' }}>
            <button className="btn ghost sm" onClick={() => setVerRegras(true)}>
              Regras opcionais
              {(regras.nivelSeparado || regras.semSanidade) && <span className="ponto-ligado" title="Há regras ligadas" />}
            </button>
          </div>

          <div className="nex-linha" style={{ width: '100%' }}>
            {regras.nivelSeparado && (
              <div className="nex-bloco">
                <span>Nível</span>
                <div className="caixa">
                  <input
                    type="number" min="1" max={NEX_TRACK.length}
                    value={personagem.nivel ?? 1}
                    onChange={(e) => setComRecursos({ nivel: Math.max(1, Math.min(NEX_TRACK.length, Number(e.target.value) || 1)) })}
                    className="campo-nu"
                  />
                </div>
              </div>
            )}
            <div className="nex-bloco">
              <span>NEX</span>
              <div className="caixa">
                <input
                  type="number" min="0" max="99" step="1"
                  value={personagem.nex}
                  onChange={(e) => setComRecursos({ nex: e.target.value === '' ? 0 : Number(e.target.value) })}
                  className="campo-nu"
                  title="Escreve a percentagem que quiseres — as contas usam o degrau abaixo"
                />
                <span className="sufixo">%</span>
              </div>
              {!regras.nivelSeparado && degrauNex(personagem.nex) !== Number(personagem.nex) && (
                <small className="degrau">conta como {degrauNex(personagem.nex)}%</small>
              )}
            </div>
            <div className="nex-bloco">
              <span>{max.semSanidade ? 'PD / turno' : 'PE / turno'}</span>
              <div className="caixa">{calcPePorRodada(personagem)}</div>
            </div>
            <div className="nex-bloco">
              <span>Deslocamento</span>
              <div className="caixa">
                {calcDeslocamento(personagem)} m / {Math.round(calcDeslocamento(personagem) / 1.5)} q
              </div>
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <BarraRecurso
              titulo="VIDA" classe="barra-vida"
              atual={personagem.pvAtual ?? max.pv} max={max.pv} onChange={(v) => set({ pvAtual: v })}
              temp={personagem.pvTemp || 0} onTemp={(v) => set({ pvTemp: v })}
              maxManual={personagem.pvMaxManual} onMaxManualChange={(v) => set({ pvMaxManual: v })}
            />
            {max.semSanidade ? (
              <BarraRecurso
                titulo="DETERMINAÇÃO" classe="barra-determinacao"
                atual={personagem.pdAtual ?? max.pd} max={max.pd} onChange={(v) => set({ pdAtual: v })}
                temp={personagem.pdTemp || 0} onTemp={(v) => set({ pdTemp: v })}
              />
            ) : (
              <>
                <BarraRecurso
                  titulo="SANIDADE" classe="barra-sanidade"
                  atual={personagem.sanAtual ?? max.san} max={max.san} onChange={(v) => set({ sanAtual: v })}
                  temp={personagem.sanTemp || 0} onTemp={(v) => set({ sanTemp: v })}
                  maxManual={personagem.sanMaxManual} onMaxManualChange={(v) => set({ sanMaxManual: v })}
                />
                <BarraRecurso
                  titulo="ESFORÇO" classe="barra-esforco"
                  atual={personagem.peAtual ?? max.pe} max={max.pe} onChange={(v) => set({ peAtual: v })}
                  temp={personagem.peTemp || 0} onTemp={(v) => set({ peTemp: v })}
                  maxManual={personagem.peMaxManual} onMaxManualChange={(v) => set({ peMaxManual: v })}
                />
              </>
            )}
          </div>

          <div className="defesas" style={{ width: '100%' }}>
            <div className="defesa-caixa">
              <div className="rotulo">Defesa</div>
              <span className="num">{d.defesa}</span>
              <div className="conta">
                10 + AGI +
                <InputNumeroScroll
                  value={personagem.defesaEquipamento}
                  onChange={(v) => set({ defesaEquipamento: v ?? 0 })}
                  title="Equipamento · Altera com o scroll"
                />
                +
                <InputNumeroScroll
                  value={personagem.defesaOutros}
                  onChange={(v) => set({ defesaOutros: v ?? 0 })}
                  title="Outros · Altera com o scroll"
                />
              </div>
            </div>

            <div className={'defesa-caixa' + (d.bloqueio.disponivel ? '' : ' inativa')} title={d.bloqueio.formula}>
              <div className="rotulo">Bloqueio</div>
              <InputNumeroScroll
                className="num"
                value={d.bloqueio.manual ? personagem.bloqueioManual : (d.bloqueio.disponivel ? d.bloqueio.valor : '')}
                placeholder=""
                title="Escreve o valor à mão ou roda o scroll; deixa vazio para voltar ao automático"
                onChange={(v) => set({ bloqueioManual: v })}
              />
              <div className="conta">
                RD = Fortitude {d.bloqueio.base >= 0 ? '+' : '−'}{Math.abs(d.bloqueio.base)}
                <br />
                extra <InputNumeroScroll
                  value={personagem.bloqueioExtra || 0}
                  onChange={(v) => set({ bloqueioExtra: v ?? 0 })}
                  title="Extra · Altera com o scroll"
                />
                {d.bloqueio.manual && (
                  <button type="button" className="voltar-auto" onClick={() => set({ bloqueioManual: null })}>auto ({d.bloqueio.auto})</button>
                )}
              </div>
            </div>

            <div className={'defesa-caixa' + (d.esquiva.disponivel ? '' : ' inativa')} title={d.esquiva.formula}>
              <div className="rotulo">Esquiva</div>
              <InputNumeroScroll
                className="num"
                value={d.esquiva.manual ? personagem.esquivaManual : (d.esquiva.disponivel ? d.esquiva.valor : '')}
                placeholder=""
                title="Escreve o valor à mão ou roda o scroll; deixa vazio para voltar ao automático"
                onChange={(v) => set({ esquivaManual: v })}
              />
              <div className="conta">
                Defesa + Reflexos {d.esquiva.base >= 0 ? '+' : '−'}{Math.abs(d.esquiva.base)}
                <br />
                extra <InputNumeroScroll
                  value={personagem.esquivaExtra || 0}
                  onChange={(v) => set({ esquivaExtra: v ?? 0 })}
                  title="Extra · Altera com o scroll"
                />
                {d.esquiva.manual && (
                  <button type="button" className="voltar-auto" onClick={() => set({ esquivaManual: null })}>auto ({d.esquiva.auto})</button>
                )}
              </div>
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <PainelCondicoes
              condicoes={personagem.condicoes || []}
              aoMudar={(novas) => set({ condicoes: novas })}
            />

            <div style={{ marginTop: 16 }}>
              <div className="campo-linha"><label>Proteção</label><input type="text" value={personagem.protecao} onChange={(e) => set({ protecao: e.target.value })} /></div>
              <div className="campo-linha"><label>Resistências</label><input type="text" value={personagem.resistencias} onChange={(e) => set({ resistencias: e.target.value })} /></div>
              <div className="campo-linha"><label>Proficiências</label><input type="text" value={personagem.proficiencias} onChange={(e) => set({ proficiencias: e.target.value })} /></div>
            </div>
          </div>
        </div>

        {/* Coluna do Meio */}
        <div>
          <TabelaPericias personagem={personagem} setPersonagem={setPersonagem} onRolar={onRolar} />
        </div>

        {/* Coluna Direita */}
        <div>
          <div className="abas">
            {ABAS.map((a) => (
              <button key={a.id} className={aba === a.id ? 'ativa' : ''} onClick={() => setAba(a.id)}>{a.nome}</button>
            ))}
          </div>
          {aba === 'combate' && (
            <>
              <CardMonstruoso personagem={personagem} setPersonagem={setPersonagem} />
              <AbaCombate personagem={personagem} setPersonagem={setPersonagem} onRolar={onRolar} />
            </>
          )}
          {aba === 'habilidades' && <AbaHabilidades personagem={personagem} setPersonagem={setPersonagem} />}
          {aba === 'rituais' && <AbaRituais personagem={personagem} setPersonagem={setPersonagem} />}
          {aba === 'inventario' && <AbaInventario personagem={personagem} setPersonagem={setPersonagem} />}
          {aba === 'descricao' && <AbaDescricao personagem={personagem} setPersonagem={setPersonagem} />}
        </div>
      </div>

      {modalMonstruoso && (
        <div className="modal-fundo" style={{ zIndex: 100 }}>
          <div className="modal" style={{ maxWidth: 440, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>Experimento Monstruoso</h3>
              <button className="fechar" onClick={() => setModalMonstruoso(false)}>×</button>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: '14.5px', marginBottom: '24px' }}>
                Seleciona a Entidade para consumir <strong>1 Componente Ritualístico</strong>, aplicar as penalidades mentais e ativar os benefícios correspondentes a <strong>NEX {nexUtil}%</strong>.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <button 
                  className="btn ghost" 
                  style={{ borderColor: getCor('Sangue'), color: getCor('Sangue'), padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }} 
                  onClick={() => executarMonstruoso('Sangue')}
                >
                  <img src="/img/sigilo-sangue.png" alt="Sangue" style={{ width: '46px', height: '46px', objectFit: 'contain', mixBlendMode: 'screen', marginBottom: '8px' }} />
                  <strong style={{ fontSize: '15px' }}>SANGUE</strong>
                </button>

                <button 
                  className="btn ghost" 
                  style={{ borderColor: getCor('Morte'), color: getCor('Morte'), padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }} 
                  onClick={() => executarMonstruoso('Morte')}
                >
                  <img src="/img/sigilo-morte.png" alt="Morte" style={{ width: '46px', height: '46px', objectFit: 'contain', mixBlendMode: 'screen', marginBottom: '8px' }} />
                  <strong style={{ fontSize: '15px' }}>MORTE</strong>
                </button>

                <button 
                  className="btn ghost" 
                  style={{ borderColor: getCor('Conhecimento'), color: getCor('Conhecimento'), padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }} 
                  onClick={() => executarMonstruoso('Conhecimento')}
                >
                  <img src="/img/sigilo-conhecimento.png" alt="Conhecimento" style={{ width: '46px', height: '46px', objectFit: 'contain', mixBlendMode: 'screen', marginBottom: '8px' }} />
                  <strong style={{ fontSize: '15px' }}>CONHECIMENTO</strong>
                </button>

                <button 
                  className="btn ghost" 
                  style={{ borderColor: getCor('Energia'), color: getCor('Energia'), padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }} 
                  onClick={() => executarMonstruoso('Energia')}
                >
                  <img src="/img/sigilo-energia.png" alt="Energia" style={{ width: '46px', height: '46px', objectFit: 'contain', mixBlendMode: 'screen', marginBottom: '8px' }} />
                  <strong style={{ fontSize: '15px' }}>ENERGIA</strong>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalDesligar && (
        <div className="modal-fundo" style={{ zIndex: 100 }}>
          <div className="modal" style={{ maxWidth: 400, textAlign: 'center' }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, fontFamily: 'var(--display)' }}>Desativar Experimento</h3>
              <button className="fechar" onClick={() => setModalDesligar(false)}>×</button>
            </div>
            <div className="modal-corpo">
              <p style={{ color: 'var(--txt-dim)', fontSize: '14.5px', marginBottom: '24px' }}>
                Desejas desativar a afinidade atual com <strong>{personagem.monstruosoElemento}</strong>? As penalidades de perícias serão revertidas e os PV Temporários ganhos serão perdidos.
              </p>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
                <button className="btn ghost" onClick={() => setModalDesligar(false)}>Cancelar</button>
                <button className="btn" style={{ borderColor: 'var(--sangue)', background: 'var(--sangue)' }} onClick={desligarMonstruoso}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}