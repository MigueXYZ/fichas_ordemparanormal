import React, { useCallback, useEffect, useRef, useState } from 'react';
import Inicio from './components/Inicio.jsx';
import Wizard from './components/wizard/Wizard.jsx';
import Ficha from './components/ficha/Ficha.jsx';
import PainelRolagem from './components/PainelRolagem.jsx';
import Fundo from './components/Fundo.jsx';
import EspacoToken from './components/EspacoToken.jsx';
import HistoricoRolagens from './components/HistoricoRolagens.jsx';
import PainelOverlay from './components/PainelOverlay.jsx';
import EditorOverlay from './components/EditorOverlay.jsx';
import FichaAmeaca from './components/ficha/FichaAmeaca.jsx';
import ModalDefinicoes from './components/ModalDefinicoes.jsx';
import { IconeOBS, IconeHistorico, IconeEngrenagem } from './components/Icones.jsx';
import { personagemVazio, personagemEhRascunhoVazio } from './engine/character.js';
import { descarregarPdf } from './export/pdf.js';
import { guardarAgente, obterAgente, exportarJson, novoId } from './engine/armazenamento.js';
import { tocarRolagem, alternarSom, somLigado, alternarCoracao, coracaoLigado } from './engine/som.js';
import { calcMaximos } from './engine/calc.js';
import { lerConfig, guardarConfig, publicar } from './overlay/transporte.js';
import { lerLayout, guardarLayout } from './overlay/layoutConfig.js';

export default function App() {
  const [vista, setVista] = useState('inicio'); // inicio | wizard | ficha
  const [personagem, setPersonagem] = useState(null);
  const [rolagens, setRolagens] = useState([]);
  const [erro, setErro] = useState(null);
  const [aExportar, setAExportar] = useState(false);
  const [guardadoEm, setGuardadoEm] = useState(null);
  const temporizador = useRef(null);

  // guarda sozinho, 800 ms depois da última alteração — mas nunca cria um
  // agente novo só porque o assistente ficou aberto: se ainda não existia
  // guardado e continua tal como personagemVazio() o deixou, não há nada
  // para guardar (ver personagemEhRascunhoVazio em engine/character.js)
  useEffect(() => {
    if (!personagem || vista === 'inicio') return undefined;
    if (!obterAgente(personagem.id) && personagemEhRascunhoVazio(personagem)) return undefined;
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => {
      const guardado = guardarAgente(personagem);
      if (guardado.id !== personagem.id) setPersonagem((p) => ({ ...p, id: guardado.id }));
      setGuardadoEm(Date.now());
    }, 800);
    return () => clearTimeout(temporizador.current);
  }, [personagem, vista]);

  // enquanto o assistente de criação está aberto, a página em si não rola —
  // só o interior da "TV" (.crt-tela, ver CrtEcra.jsx) — para ela ficar
  // sempre centrada no ecrã em vez de se poder perder a rolar por trás dela
  useEffect(() => {
    if (vista !== 'wizard') return undefined;
    document.body.classList.add('sem-scroll');
    return () => document.body.classList.remove('sem-scroll');
  }, [vista]);

  const [som, setSom] = useState(somLigado);
  const [coracao, setCoracao] = useState(coracaoLigado);
  const [verHistorico, setVerHistorico] = useState(false);
  const [verDefinicoes, setVerDefinicoes] = useState(false);

  // ---- overlay para o OBS ----
  const [configOverlay, setConfigOverlay] = useState(lerConfig);
  const [layoutOverlay, setLayoutOverlay] = useState(lerLayout);
  const [verOverlay, setVerOverlay] = useState(false);
  const [verEditorOverlay, setVerEditorOverlay] = useState(false);
  const [estadoEnvio, setEstadoEnvio] = useState(null);
  const ultimoEnvio = useRef('');
  const relogioOverlay = useRef(null);

  useEffect(() => {
    if (!configOverlay.ligado || !personagem) {
      publicar({ ligado: false }, null);
      return undefined;
    }
    const max = calcMaximos(personagem);
    const ultima = rolagens[rolagens.length - 1] || null;
    const estado = {
      nome: personagem.nome || 'Agente',
      subtitulo: [personagem.classe, personagem.patente, personagem.origem, personagem.regrasOpcionais?.nivel
        ? `Nível ${personagem.nivel ?? 1} · NEX ${personagem.nex}%`
        : `NEX ${personagem.nex}%`].filter(Boolean).join(' · '),
      token: personagem.token || null,
      imagem: personagem.imagem || null,
      pv: { atual: personagem.pvAtual ?? max.pv, max: max.pv, temp: personagem.pvTemp || 0 },
      san: max.semSanidade ? null : { atual: personagem.sanAtual ?? max.san, max: max.san, temp: personagem.sanTemp || 0 },
      pe: max.semSanidade ? null : { atual: personagem.peAtual ?? max.pe, max: max.pe, temp: personagem.peTemp || 0 },
      pd: max.semSanidade ? { atual: personagem.pdAtual ?? max.pd, max: max.pd, temp: personagem.pdTemp || 0 } : null,
      condicoes: personagem.condicoes || [],
      rolagem: ultima,
      layout: layoutOverlay,
    };
    const corpo = JSON.stringify(estado);

    clearTimeout(relogioOverlay.current);
    relogioOverlay.current = setTimeout(async () => {
      ultimoEnvio.current = corpo;
      const r = await publicar(configOverlay, estado);
      setEstadoEnvio(r.ok ? { quando: Date.now() } : { erro: r.erro });
    }, 150);
    return () => clearTimeout(relogioOverlay.current);
  }, [personagem, rolagens, configOverlay, layoutOverlay]);

  const mudarOverlay = useCallback((novo) => {
    setConfigOverlay(guardarConfig(novo));
    ultimoEnvio.current = '';       // força um envio novo com a configuração nova
  }, []);

  const rolar = useCallback((resultado) => {
    if (!resultado) return;
    const registo = { ...resultado, quando: Date.now() };
    setRolagens((r) => [...r.slice(-9), registo]);
    // o histórico fica guardado com o agente (últimas 300 rolagens)
    setPersonagem((p) => (p ? { ...p, historico: [...(p.historico || []), registo].slice(-300) } : p));
    tocarRolagem({
      dados: resultado.dados || resultado.rolagens?.length || 1,
      critico: resultado.critico,
      falhaCritica: resultado.falhaCritica,
    });
  }, []);

  function criar() {
    setPersonagem({ ...personagemVazio(), id: novoId() });
    setVista('wizard');
  }

  function abrir(agente) {
    setPersonagem(agente);
    setVista('ficha');
  }

  function voltarAoInicio() {
    if (personagem && !(!obterAgente(personagem.id) && personagemEhRascunhoVazio(personagem))) {
      guardarAgente(personagem);
    }
    setPersonagem(null);
    setVista('inicio');
  }

  // a cruz da TV (ver Wizard.jsx) já decide sozinha se guarda ou apaga o
  // rascunho antes de chamar isto — aqui é só mesmo sair, sem voltar a mexer
  function sairDoWizard() {
    setPersonagem(null);
    setVista('inicio');
  }

  async function exportarPdf() {
    setErro(null);
    setAExportar(true);
    try {
      await descarregarPdf(personagem);
    } catch (e) {
      setErro(e.message || 'Falha ao gerar o PDF.');
    } finally {
      setAExportar(false);
    }
  }

  // o espaço do token só aparece com uma ficha de agente aberta (e só em ecrãs
  // largos o suficiente para caber na margem — ver .espaco-token em styles.css)
  const comToken = vista !== 'inicio' && Boolean(personagem) && personagem.tipo !== 'ameaca';

  return (
    <div className={'app' + (vista === 'wizard' ? ' app-wizard-fixo' : '')}>
      <Fundo />
      {comToken && (
        <EspacoToken
          token={personagem.token || null}
          aoMudarToken={(t) => setPersonagem((p) => ({ ...p, token: t }))}
        />
      )}
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <h1 onClick={voltarAoInicio} title="Voltar ao início">
            Claudio <span className="marca-sub">· Ordem Paranormal</span>
          </h1>
          {vista !== 'inicio' && (
            <button className="btn ghost sm btn-nav-agentes" onClick={voltarAoInicio} title="Voltar à lista de agentes">
              ← Agentes
            </button>
          )}
          {vista === 'wizard' && personagem?.classeId && (
            <button className="btn ghost sm" onClick={() => setVista('ficha')}>
              Ver ficha
            </button>
          )}
        </div>

        <div className="acoes">
          {vista !== 'inicio' ? (
            <>
              {guardadoEm && (
                <span className="pill guardado-pill" title="Guardado automaticamente">
                  <span className="ponto-verde" /> guardado
                </span>
              )}

              {/* Botão Overlay com símbolo OBS */}
              <button
                className={'btn ghost sm btn-overlay-topbar' + (configOverlay.ligado ? ' a-transmitir' : '')}
                onClick={() => setVerOverlay(true)}
                title={configOverlay.ligado ? 'Overlay OBS ativo (a transmitir)' : 'Configurar Overlay para OBS'}
              >
                <IconeOBS size={16} />
                <span>Overlay</span>
                {configOverlay.ligado && <span className="ponto-live" />}
              </button>

              {/* Botão de Histórico */}
              <button
                className="btn ghost sm btn-historico-topbar"
                onClick={() => setVerHistorico(true)}
                title="Histórico de rolagens"
              >
                <IconeHistorico size={16} />
                <span className="texto-btn-historico">Histórico</span>
                {Boolean(personagem?.historico?.length) && (
                  <span className="badge-contagem">{personagem.historico.length}</span>
                )}
              </button>

              {/* Botão Definições / Opções do Personagem */}
              <button
                className="btn ghost sm btn-def-topbar"
                onClick={() => setVerDefinicoes(true)}
                title="Definições e Exportação (PDF, JSON, Criação, Áudio)"
                aria-label="Definições do agente"
              >
                <IconeEngrenagem size={17} />
              </button>
            </>
          ) : (
            <>
              <button
                className="btn ghost sm"
                title={som ? 'Desligar som dos dados' : 'Ligar som dos dados'}
                onClick={() => setSom(alternarSom())}
              >
                {som ? '♪ dados' : '♪ mudo'}
              </button>
              <button
                className={'btn ghost sm' + (coracao ? ' a-bater' : '')}
                title={coracao ? 'Desligar o batimento cardíaco' : 'Ligar o batimento cardíaco'}
                onClick={() => setCoracao(alternarCoracao())}
              >
                {coracao ? '♥' : '♡'}
              </button>
            </>
          )}
        </div>
      </div>

      {erro && <div className="container" style={{ paddingBottom: 0 }}><div className="aviso"><strong>Erro:</strong> {erro}</div></div>}

      {vista === 'inicio' && <Inicio aoCriar={criar} aoAbrir={abrir} />}
      {vista === 'wizard' && personagem && (
        <Wizard personagem={personagem} setPersonagem={setPersonagem} onRolar={rolar} onFinalizar={() => setVista('ficha')} onSair={sairDoWizard} />
      )}
      {vista === 'ficha' && personagem && personagem.tipo === 'ameaca' && (
        <FichaAmeaca ameaca={personagem} setAmeaca={setPersonagem} onRolar={rolar} />
      )}
      {vista === 'ficha' && personagem && personagem.tipo !== 'ameaca' && (
        <Ficha personagem={personagem} setPersonagem={setPersonagem} onRolar={rolar} />
      )}

      {verDefinicoes && (
        <ModalDefinicoes
          personagem={personagem}
          aoMudarPersonagem={setPersonagem}
          som={som}
          aoAlternarSom={() => setSom(alternarSom())}
          coracao={coracao}
          aoAlternarCoracao={() => setCoracao(alternarCoracao())}
          aoExportarPdf={exportarPdf}
          aExportar={aExportar}
          aoExportarJson={exportarJson}
          aoAbrirCriacao={() => {
            setVerDefinicoes(false);
            setVista('wizard');
          }}
          aoFechar={() => setVerDefinicoes(false)}
        />
      )}

      {verHistorico && (
        <HistoricoRolagens
          historico={personagem?.historico || []}
          aoFechar={() => setVerHistorico(false)}
          aoLimpar={() => setPersonagem((p) => ({ ...p, historico: [] }))}
        />
      )}

      {verOverlay && (
        <PainelOverlay
          config={configOverlay}
          aoMudar={mudarOverlay}
          estadoEnvio={estadoEnvio}
          aoFechar={() => setVerOverlay(false)}
          aoAbrirEditor={() => {
            setVerOverlay(false);
            setVerEditorOverlay(true);
          }}
        />
      )}

      {verEditorOverlay && (
        <EditorOverlay
          layoutInicial={layoutOverlay}
          personagem={personagem}
          aoGuardar={(novo) => {
            guardarLayout(novo);
            setLayoutOverlay(novo);
            setVerEditorOverlay(false);
          }}
          aoFechar={() => setVerEditorOverlay(false)}
        />
      )}

      <PainelRolagem
        rolagens={rolagens}
        aoFechar={(id) => setRolagens((r) => r.filter((x) => x.id !== id))}
        aoLimpar={() => setRolagens([])}
      />
    </div>
  );
}
