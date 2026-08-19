import React from 'react';
import { createRoot } from 'react-dom/client';
import Overlay from './Overlay.jsx';
import '../styles.css';
import './overlay.css';

// A configuração vem do próprio URL, para o OBS não precisar de nada guardado.
const p = new URLSearchParams(location.search);
const config = {
  modo: p.get('modo') === 'remoto' ? 'remoto' : 'local',
  url: p.get('url') || 'http://localhost:7777',
  codigo: p.get('codigo') || 'mesa',
};

createRoot(document.getElementById('overlay')).render(
  <Overlay config={config} semDiagnostico={p.get('limpo') === '1'} />
);
