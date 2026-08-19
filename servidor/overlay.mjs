/**
 * Servidor do overlay — 0 dependências, corre com `npm run overlay`.
 *
 * Duas rotas:
 *   POST /o/<codigo>    a ficha manda o estado (JSON)
 *   GET  /sse/<codigo>  o overlay ouve as atualizações (Server-Sent Events)
 *
 * Guarda o último estado de cada sala em memória, por isso quem chega a meio
 * recebe logo o estado atual — importante para o OBS, que só liga a fonte
 * quando entras na cena.
 *
 * No teu PC:            node servidor/overlay.mjs
 * Noutro sítio:         PORT=8080 node servidor/overlay.mjs
 * (qualquer serviço que corra Node serve: Fly, Render, Railway, uma VPS…)
 */
import http from 'node:http';

const PORTA = Number(process.env.PORT || 7777);
const salas = new Map();   // codigo -> { estado, clientes: Set<res> }

function sala(codigo) {
  if (!salas.has(codigo)) salas.set(codigo, { estado: null, clientes: new Set() });
  return salas.get(codigo);
}

function cors(res) {
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', 'content-type');
  res.setHeader('access-control-allow-methods', 'GET,POST,OPTIONS');
}

const servidor = http.createServer((req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') { res.writeHead(204).end(); return; }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const partes = url.pathname.split('/').filter(Boolean);

  // POST /o/<codigo>
  if (req.method === 'POST' && partes[0] === 'o' && partes[1]) {
    const s = sala(decodeURIComponent(partes[1]));
    let corpo = '';
    req.on('data', (p) => {
      corpo += p;
      if (corpo.length > 8e6) req.destroy();      // um GIF grande no token e mais nada
    });
    req.on('end', () => {
      s.estado = corpo;
      for (const cliente of s.clientes) cliente.write(`data: ${corpo}\n\n`);
      res.writeHead(204).end();
    });
    return;
  }

  // GET /sse/<codigo>
  if (req.method === 'GET' && partes[0] === 'sse' && partes[1]) {
    const s = sala(decodeURIComponent(partes[1]));
    res.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
    });
    res.write(': ligado\n\n');
    if (s.estado) res.write(`data: ${s.estado}\n\n`);
    s.clientes.add(res);

    // ping de 25s, senão proxies e o próprio OBS fecham a ligação por inatividade
    const ping = setInterval(() => res.write(': ping\n\n'), 25000);
    req.on('close', () => { clearInterval(ping); s.clientes.delete(res); });
    return;
  }

  if (url.pathname === '/') {
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
    res.end(
      'Servidor do overlay do Claudio.\n\n' +
      `salas ativas: ${salas.size}\n` +
      'POST /o/<codigo>   — a ficha publica o estado\n' +
      'GET  /sse/<codigo> — o overlay ouve\n'
    );
    return;
  }

  res.writeHead(404).end('nada aqui');
});

servidor.listen(PORTA, () => {
  console.log(`Overlay a servir em http://localhost:${PORTA}`);
  console.log('Na app: Overlay → modo "remoto", URL acima, e o código da sala.');
});
