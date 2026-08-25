import React, { useCallback, useState } from 'react';
import Geradores from './Geradores.jsx';
import Bestiario from './Bestiario.jsx';
import Encontro from './Encontro.jsx';
import { listarAgentes, guardarAgente, apagarAgente } from '../../engine/armazenamento.js';

const ABAS = [
  { id: 'gerar', nome: 'Gerar' },
  { id: 'bestiario', nome: 'Bestiário' },
  { id: 'encontro', nome: 'Encontro' },
];

function ameacasGuardadas() {
  return listarAgentes().filter((a) => a.tipo === 'ameaca');
}

/**
 * "Modo Mestre" — substitui o antigo botão "Geradores" do Início (ver
 * Inicio.jsx / App.jsx). Junta num só sítio: os geradores de fichas/NPCs/
 * ameaças (aba "Gerar", movida de components/Geradores.jsx), o bestiário de
 * todas as ameaças já guardadas (aba "Bestiário") e a soma automática do VD
 * de um encontro contra o NEX do grupo (aba "Encontro").
 */
export default function ModoMestre({ aoAbrir }) {
  const [aba, setAba] = useState('gerar');
  const [lista, setLista] = useState(ameacasGuardadas);

  const recarregar = useCallback(() => setLista(ameacasGuardadas()), []);

  const guardar = useCallback((p) => {
    const g = guardarAgente(p);
    recarregar();
    return g;
  }, [recarregar]);

  const apagar = useCallback((id) => {
    apagarAgente(id);
    recarregar();
  }, [recarregar]);

  return (
    <div className="container">
      <h2 style={{ fontFamily: 'var(--display)', fontSize: 26, marginBottom: 4 }}>Modo Mestre</h2>
      <p className="dica" style={{ marginTop: 0, marginBottom: 20 }}>
        Geradores de NPCs e ameaças, o bestiário de tudo o que já guardaste, e o cálculo automático do VD de encontros.
      </p>

      <div className="abas">
        {ABAS.map((s) => (
          <button key={s.id} className={aba === s.id ? 'ativa' : ''} onClick={() => setAba(s.id)}>
            {s.nome}
          </button>
        ))}
      </div>

      {aba === 'gerar' && <Geradores aoGuardar={guardar} aoAbrir={aoAbrir} />}
      {aba === 'bestiario' && <Bestiario lista={lista} aoAbrir={aoAbrir} aoApagar={apagar} />}
      {aba === 'encontro' && <Encontro ameacas={lista} />}
    </div>
  );
}
