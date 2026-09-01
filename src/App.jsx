import React, { useCallback, useEffect, useRef, useState } from 'react';
import Inicio from './components/Inicio.jsx';
import Wizard from './components/wizard/Wizard.jsx';
import Ficha from './components/ficha/Ficha.jsx';
import PainelRolagem from './components/PainelRolagem.jsx';
import Fundo from './components/Fundo.jsx';
import { lerTema, guardarTema, aplicarTema, lerFundoEscuro, guardarFundoEscuro, aplicarFundoEscuro } from './engine/tema.js';
import EspacoToken from './components/EspacoToken.jsx';
import HistoricoRolagens from './components/HistoricoRolagens.jsx';
import PainelOverlay from './components/PainelOverlay.jsx';
import EditorOverlay from './components/EditorOverlay.jsx';
import FichaAmeaca from './components/ficha/FichaAmeaca.jsx';
import ModoMestre from './components/mestre/ModoMestre.jsx';
import ModalDefinicoes from './components/ModalDefinicoes.jsx';
import ModalDefinicoesInicio from './components/ModalDefinicoesInicio.jsx';
import BuscaGlobal from './components/ficha/BuscaGlobal.jsx';
import PainelMural from './components/PainelMural.jsx';
import PlayerMusica from './components/PlayerMusica.jsx';
import { IconeOBS, IconeHistorico, IconeEngrenagem, IconeBusca, IconeMural } from './components/Icones.jsx';
import { personagemVazio, personagemEhRascunhoVazio } from './engine/character.js';
import { descarregarPdf } from './export/pdf.js';
import { guardarAgente, obterAgente, exportarJson, novoId } from './engine/armazenamento.js';
import { tocarRolagem, alternarSom, somLigado, alternarCoracao, coracaoLigado } from './engine/som.js';
import { calcMaximos } from './engine/calc.js';
import { lerConfig, guardarConfig, publicar } from './overlay/transporte.js';
import { lerLayout, guardarLayout } from './overlay/layoutConfig.js';
import { muralSync } from './lib/services/muralSync.ts';

export default function App() {
  const [vista, setVista] = useState('inicio'); // inicio | wizard | ficha | mestre
  // Tema (pele por elemento) — global e guardado no browser. Aplicado no
  // <html> por `aplicarTema`, que é onde o CSS declara a paleta.
  const [tema, setTemaEstado] = useState(lerTema);
  useEffect(() => { aplicarTema(tema); }, [tema]);
  const trocarTema = useCallback((id) => {
    setTemaEstado(aplicarTema(id));
    guardarTema(id);
  }, []);

  // Fundo escuro: baixa a decoração (sigilos, entidade, roda, brasas, halos)
  // para quem tenha dificuldade em ler por cima dela. Não troca a paleta.
  const [fundoEscuro, setFundoEscuro] = useState(lerFundoEscuro);
  useEffect(() => { aplicarFundoEscuro(fundoEscuro); }, [fundoEscuro]);
  const alternarFundoEscuro = useCallback(() => {
    setFundoEscuro((v) => { guardarFundoEscuro(!v); return !v; });
  }, []);
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

  // No ecrã inicial o mosaico de sigilos abre um buraco por cima do bloco do
  // título (ver `body.no-inicio` em styles.css) — é a zona mais carregada da
  // app e o padrão por trás tornava-a suja. Fora do início não se aplica.
  useEffect(() => {
    document.body.classList.toggle('no-inicio', vista === 'inicio');
    return () => document.body.classList.remove('no-inicio');
  }, [vista]);

  const [som, setSom] = useState(somLigado);
  const [coracao, setCoracao] = useState(coracaoLigado);
  const [verHistorico, setVerHistorico] = useState(false);
  const [verDefinicoes, setVerDefinicoes] = useState(false);
  // Definições do ecrã inicial (cópias de segurança, importar, som). O
  // contador força o <Inicio> a remontar depois de repor uma cópia, para a
  // lista de agentes voltar a ser lida do armazenamento.
  const [verDefinicoesInicio, setVerDefinicoesInicio] = useState(false);
  const [recargaInicio, setRecargaInicio] = useState(0);
  const [verBusca, setVerBusca] = useState(false);
  const [verMural, setVerMural] = useState(false);
  const [muralConectado, setMuralConectado] = useState(muralSync.isConnected);

  // Ouve alterações no estado da ligação ao Mural P2P
  useEffect(() => {
    return muralSync.onStatusChange(setMuralConectado);
  }, []);

  // Sincroniza dados da ficha com o Mural sempre que o personagem for atualizado
  useEffect(() => {
    if (!personagem || !muralConectado) return;
    const max = calcMaximos(personagem);
    muralSync.sendCharacter({
      ...personagem,
      pvMax: max.pv,
      sanMax: max.san,
      peMax: max.pe,
    });
  }, [personagem, muralConectado]);

  // Busca Rápida Global (Ctrl+K / Cmd+K) — disponível em qualquer lado da
  // criação ou da ficha, para consultar rituais, poderes, perícias, itens e
  // condições sem ter de navegar pelas abas (ver BuscaGlobal.jsx).
  useEffect(() => {
    if (vista === 'inicio') return undefined;
    function aoTeclar(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setVerBusca(true);
      }
    }
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [vista]);

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

    // Envia a rolagem para o feed do Mestre no Mural
    if (muralSync.isConnected) {
      const formula = resultado.expressao || `${resultado.dados || resultado.rolagens?.length || 1}d${resultado.faces || 20}${resultado.bonus ? (resultado.bonus > 0 ? `+${resultado.bonus}` : resultado.bonus) : ''}`;
      muralSync.sendDiceRoll({
        label: resultado.nome || 'Rolagem',
        diceFormula: formula,
        diceResults: resultado.rolagens || [resultado.total],
        total: resultado.total || 0,
        isCritical: Boolean(resultado.critico),
        isFumble: Boolean(resultado.falhaCritica),
      });
    }
  }, []);

  function criar() {
    setPersonagem({ ...personagemVazio(), id: novoId() });
    setVista('wizard');
  }

  function abrir(agente) {
    setPersonagem(agente);
    setVista('ficha');
  }

  function abrirMestre() {
    setVista('mestre');
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

  // o espaço do token só aparece na ficha já criada (e só em ecrãs largos o
  // suficiente para caber na margem — ver .espaco-token em styles.css). Fica
  // escondido durante a criação (vista === 'wizard'): lá quem pede o avatar
  // e o token é o passo "Toques Finais", não este espaço com o boneco.
  const comToken = vista === 'ficha' && Boolean(personagem) && personagem.tipo !== 'ameaca';

  return (
    <div className={'app' + (vista === 'wizard' ? ' app-wizard-fixo' : '')}>
      <Fundo tema={tema} />
      {comToken && (
        <EspacoToken
          token={personagem.token || null}
          aoMudarToken={(t) => setPersonagem((p) => ({ ...p, token: t }))}
        />
      )}
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <h1 onClick={voltarAoInicio} title="Voltar ao início">
            Ordo <span className="marca-sub">· Ordem Paranormal</span>
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

        {vista !== 'inicio' && (
          <button type="button" className="busca-topbar" onClick={() => setVerBusca(true)} title="Busca rápida — rituais, poderes, perícias, itens, condições">
            <IconeBusca size={15} className="busca-topbar-icone" />
            <span className="busca-topbar-texto">Busca rápida…</span>
          </button>
        )}

        <div className="acoes">
          {/* Fundo escuro — acessibilidade. Fica FORA do ternário de vistas
              para estar sempre visível na barra do topo, tanto no ecrã
              inicial como dentro de uma ficha ou do modo mestre. Só ícone,
              porque na ficha a barra já leva Overlay, Histórico e
              Definições. */}
          <button
            className={'btn ghost sm btn-fundo-escuro' + (fundoEscuro ? ' ativo' : '')}
            title={fundoEscuro
              ? 'Fundo escuro ligado — o cenário está esbatido. Clica para o trazer de volta.'
              : 'Esbate o fundo (sigilos, entidade, brasas) para o texto se ler melhor'}
            aria-pressed={fundoEscuro}
            aria-label="Esbater o fundo"
            onClick={alternarFundoEscuro}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8 1.6 A6.4 6.4 0 0 1 8 14.4 Z" fill="currentColor" />
            </svg>
          </button>

          {vista !== 'inicio' ? (
            <>
              {guardadoEm && (
                <span className="pill guardado-pill" title="Guardado automaticamente">
                  <span className="ponto-verde" /> guardado
                </span>
              )}

              {/* Botão Mural P2P */}
              <button
                className={'btn ghost sm btn-mural-topbar' + (muralConectado ? ' a-transmitir' : '')}
                onClick={() => setVerMural(true)}
                title={muralConectado ? `Conectado ao Mural (${muralSync.roomCode})` : 'Conectar ao Mural do Mestre'}
              >
                <IconeMural size={16} />
                <span>Mural</span>
                {muralConectado && <span className="ponto-live" />}
              </button>

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
            /* Roda dentada do ecrã inicial: cópias de segurança, importar
               .json e as opções de som, tudo no mesmo sítio (antes andavam
               soltos por baixo do título e na própria barra). */
            <button
              className="btn ghost sm btn-def-topbar"
              onClick={() => setVerDefinicoesInicio(true)}
              title="Definições — cópias de segurança, importar ficha, som"
              aria-label="Definições"
            >
              <IconeEngrenagem size={17} />
            </button>
          )}
        </div>
      </div>

      {erro && <div className="container" style={{ paddingBottom: 0 }}><div className="aviso"><strong>Erro:</strong> {erro}</div></div>}

      {vista === 'inicio' && <Inicio key={recargaInicio} aoCriar={criar} aoAbrir={abrir} aoAbrirMestre={abrirMestre} tema={tema} aoTrocarTema={trocarTema} />}
      {vista === 'wizard' && personagem && (
        <Wizard personagem={personagem} setPersonagem={setPersonagem} onRolar={rolar} onFinalizar={() => setVista('ficha')} onSair={sairDoWizard} />
      )}
      {vista === 'ficha' && personagem && personagem.tipo === 'ameaca' && (
        <FichaAmeaca ameaca={personagem} setAmeaca={setPersonagem} onRolar={rolar} />
      )}
      {vista === 'ficha' && personagem && personagem.tipo !== 'ameaca' && (
        <Ficha personagem={personagem} setPersonagem={setPersonagem} onRolar={rolar} />
      )}

      {vista === 'mestre' && <ModoMestre aoAbrir={abrir} />}

      {verDefinicoesInicio && (
        <ModalDefinicoesInicio
          som={som}
          aoAlternarSom={() => setSom(alternarSom())}
          coracao={coracao}
          aoAlternarCoracao={() => setCoracao(alternarCoracao())}
          aoRecarregar={() => setRecargaInicio((n) => n + 1)}
          aoAbrirAgente={abrir}
          aoFechar={() => setVerDefinicoesInicio(false)}
        />
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
          aoAbrirMural={() => {
            setVerDefinicoes(false);
            setVerMural(true);
          }}
          aoFechar={() => setVerDefinicoes(false)}
        />
      )}

      {verMural && (
        <PainelMural
          personagem={personagem}
          aoFechar={() => setVerMural(false)}
        />
      )}

      {verHistorico && (
        <HistoricoRolagens
          historico={personagem?.historico || []}
          aoFechar={() => setVerHistorico(false)}
          aoLimpar={() => setPersonagem((p) => ({ ...p, historico: [] }))}
        />
      )}

      {verBusca && <BuscaGlobal aoFechar={() => setVerBusca(false)} />}

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

      <PlayerMusica />

      <PainelRolagem
        rolagens={rolagens}
        aoFechar={(id) => setRolagens((r) => r.filter((x) => x.id !== id))}
        aoLimpar={() => setRolagens([])}
      />
    </div>
  );
}
