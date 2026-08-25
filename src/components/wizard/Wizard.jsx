import React, { useState } from 'react';
import CrtEcra from './CrtEcra.jsx';
import StepAtributos from './StepAtributos.jsx';
import StepOrigem from './StepOrigem.jsx';
import StepClasse from './StepClasse.jsx';
import StepToquesFinais from './StepToquesFinais.jsx';
import { normalizarRecursos, ajustarRecursos, personagemEhRascunhoVazio } from '../../engine/character.js';
import { guardarAgente, obterAgente, apagarAgente } from '../../engine/armazenamento.js';
import { NEX_TRACK, calcMaximos, degrauNex, nexEfetivo, pontosGastos, pontosRestantes } from '../../engine/calc.js';
import { REGRAS_ATRIBUTOS } from '../../data/atributos.js';

const PASSOS = ['Atributos', 'Origem', 'Classe', 'Toques Finais'];
const TITULOS_CRT = ['Módulo de Atributos', 'Módulo de Origem', 'Módulo de Classe', 'Módulo de Toques Finais'];

export default function Wizard({ personagem, setPersonagem, onFinalizar, onRolar, onSair }) {
  const [passo, setPasso] = useState(0);

  // sair a qualquer momento pela cruz da TV: null (fechado) | 'perguntar'
  // (guardar ou não) | 'nome' (falta um nome para guardar)
  const [sair, setSair] = useState(null);
  const [nomeSaida, setNomeSaida] = useState('');

  const atualizar = (patch) => setPersonagem({ ...personagem, ...patch });
  const podeFinalizar = Boolean(personagem.classeId);
  const max = calcMaximos(personagem);

  // o NEX manda em Vida/Sanidade/Esforço, na trilha e nos poderes: dá para o
  // definir em qualquer passo, não só depois de a ficha estar criada
  const mudarNex = (n) =>
    setPersonagem(ajustarRecursos(personagem, { ...personagem, nex: n === '' ? 0 : Number(n) }));
  const nexUtil = nexEfetivo(personagem);

  // dentro da TV: os quatro passos (ver CrtEcra.jsx). O layout clássico
  // abaixo fica como reserva, caso algum passo futuro precise de sair da TV.
  const dentroDaTv = passo >= 0 && passo < PASSOS.length;
  const gastosAtributos = pontosGastos(personagem.atributos);
  const restantesAtributos = pontosRestantes(personagem.atributos, REGRAS_ATRIBUTOS.pontosParaDistribuir);
  const ehUltimoPasso = passo === PASSOS.length - 1;
  const finalizarAgora = () => {
    setPersonagem(normalizarRecursos(personagem));
    onFinalizar();
  };

  // ---- sair da criação pela cruz da TV ----
  function pedirSaida() {
    // ainda não existe e continua tal como personagemVazio() o deixou: não
    // há nada para perder, sai logo sem incomodar com a pergunta
    if (!obterAgente(personagem.id) && personagemEhRascunhoVazio(personagem)) {
      onSair();
      return;
    }
    setNomeSaida(personagem.nome || '');
    setSair('perguntar');
  }
  function sairSemGuardar() {
    apagarAgente(personagem.id);
    setSair(null);
    onSair();
  }
  function pedirGuardarESair() {
    if (personagem.nome?.trim()) {
      guardarAgente(personagem);
      setSair(null);
      onSair();
    } else {
      setSair('nome');
    }
  }
  function confirmarNomeEGuardar() {
    const nome = nomeSaida.trim();
    if (!nome) return;
    const atualizado = { ...personagem, nome };
    guardarAgente(atualizado);
    setPersonagem(atualizado);
    setSair(null);
    onSair();
  }

  return (
    <div className="container container-wizard">
      {/* Dentro da TV (Atributos/Origem/Classe), o NEX e os botões dos passos
          já vivem no próprio ecrã "registo" — mostrar aqui também seria
          repetir a mesma coisa duas vezes. A exceção é a regra opcional de
          Nível (nivelSeparado): esse campo só existe aqui, por isso a barra
          continua a aparecer se essa regra estiver ligada, mesmo dentro da TV. */}
      {(!dentroDaTv || personagem.regras?.nivelSeparado) && (
        <div className="barra-nex">
          {personagem.regras?.nivelSeparado && (
            <>
              <label htmlFor="nivel-wizard">Nível</label>
              <input
                id="nivel-wizard" type="number" min="1" max={NEX_TRACK.length}
                value={personagem.nivel ?? 1}
                onChange={(e) => setPersonagem(ajustarRecursos(personagem, {
                  ...personagem,
                  nivel: Math.max(1, Math.min(NEX_TRACK.length, Number(e.target.value) || 1)),
                }))}
              />
            </>
          )}
          {!dentroDaTv && (
            <>
              <label htmlFor="nex-wizard">NEX</label>
              <input
                id="nex-wizard" type="number" min="0" max="99" step="1"
                value={personagem.nex}
                onChange={(e) => mudarNex(e.target.value)}
                title="Escreve a percentagem que quiseres — as contas usam o degrau abaixo"
              />
              <span className="por-cento">%</span>
              {!personagem.regras?.nivelSeparado && degrauNex(personagem.nex) !== Number(personagem.nex) && (
                <span className="degrau">conta como {degrauNex(personagem.nex)}%</span>
              )}
              <span className="dica">
                {personagem.classeId
                  ? (max.semSanidade
                    ? `${max.pv} PV · ${max.pd} Determinação`
                    : `${max.pv} PV · ${max.san} Sanidade · ${max.pe} PE`)
                  : 'escolhe a classe para veres Vida, Sanidade e Esforço'}
                {nexUtil >= 10 ? ' · já dá para escolher trilha' : ' · trilha a partir de 10%'}
              </span>
            </>
          )}
        </div>
      )}

      {!dentroDaTv && (
        <div className="stepper">
          {PASSOS.map((nome, i) => (
            <React.Fragment key={nome}>
              {i > 0 && <div className="traco" />}
              <button className={'passo' + (i === passo ? ' ativo' : '')} onClick={() => setPasso(i)}>
                {nome}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      {dentroDaTv ? (
        <CrtEcra
          personagem={personagem}
          mudarNex={mudarNex}
          passos={PASSOS}
          passoAtual={passo}
          irParaPasso={setPasso}
          titulo={TITULOS_CRT[passo]}
          leituraExtra={passo === 0 && (
            <div className={'crt-leitura-item' + (restantesAtributos === 0 ? ' completo' : '')}>
              <span>Pontos</span>
              <strong>{gastosAtributos}/{REGRAS_ATRIBUTOS.pontosParaDistribuir}</strong>
            </div>
          )}
          onVoltar={() => setPasso(passo - 1)}
          onContinuar={ehUltimoPasso ? finalizarAgora : () => setPasso(passo + 1)}
          podeVoltar={passo > 0}
          podeContinuar={ehUltimoPasso ? podeFinalizar : true}
          rotuloContinuar={ehUltimoPasso ? 'Finalizar' : 'Continuar'}
          onFechar={pedirSaida}
        >
          {passo === 0 && <StepAtributos personagem={personagem} atualizar={atualizar} onRolar={onRolar} />}
          {passo === 1 && <StepOrigem personagem={personagem} setPersonagem={setPersonagem} />}
          {passo === 2 && <StepClasse personagem={personagem} setPersonagem={setPersonagem} />}
          {passo === 3 && (
            <StepToquesFinais
              personagem={personagem}
              atualizar={atualizar}
              podeFinalizar={podeFinalizar}
              onFinalizar={finalizarAgora}
            />
          )}
        </CrtEcra>
      ) : null}

      {/* Dentro da TV (Atributos/Origem/Classe), Voltar/Continuar já vivem no
          rodapé do próprio ecrã (o par `.fita-botao`, ver CrtEcra.jsx) —
          mostrar aqui também seria repetir a mesma coisa duas vezes. */}
      {!dentroDaTv && (
        <div className="navegacao">
          <button className="btn ghost" disabled={passo === 0} onClick={() => setPasso(passo - 1)}>Voltar</button>
          {passo < PASSOS.length - 1 ? (
            <button className="btn" onClick={() => setPasso(passo + 1)}>Continuar</button>
          ) : (
            <button className="btn" disabled={!podeFinalizar} onClick={() => { setPersonagem(normalizarRecursos(personagem)); onFinalizar(); }}>
              Finalizar
            </button>
          )}
        </div>
      )}

      {sair && (
        <div className="modal-fundo" onClick={(e) => e.target === e.currentTarget && setSair(null)}>
          <div className="modal" style={{ maxWidth: 440 }}>
            <div className="modal-topo">
              <h3 style={{ margin: 0, color: 'var(--sangue-claro)' }}>Sair da criação</h3>
              <button className="fechar" onClick={() => setSair(null)}>×</button>
            </div>
            <div className="modal-corpo">
              {sair === 'perguntar' ? (
                <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.5' }}>
                  Queres guardar o que já fizeste antes de sair, ou sair sem guardar?
                </p>
              ) : (
                <>
                  <p style={{ margin: '0 0 12px', fontSize: '15px', lineHeight: '1.5' }}>
                    Para guardar, o personagem precisa de pelo menos um nome.
                  </p>
                  <div className="campo">
                    <label>Personagem</label>
                    <input
                      type="text"
                      autoFocus
                      value={nomeSaida}
                      onChange={(e) => setNomeSaida(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && confirmarNomeEGuardar()}
                      placeholder="Nome do personagem"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="modal-acoes">
              {sair === 'perguntar' ? (
                <>
                  <button type="button" className="btn ghost" onClick={sairSemGuardar}>Sair sem guardar</button>
                  <button type="button" className="btn" onClick={pedirGuardarESair}>Guardar e sair</button>
                </>
              ) : (
                <>
                  <button type="button" className="btn ghost" onClick={() => setSair('perguntar')}>Voltar</button>
                  <button type="button" className="btn" disabled={!nomeSaida.trim()} onClick={confirmarNomeEGuardar}>Guardar e sair</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
