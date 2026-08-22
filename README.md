# 👁️ Claudio — Fichas de Ordem Paranormal RPG

**Claudio** é uma aplicação web moderna e completa para criar, gerir e jogar com agentes e ameaças de **Ordem Paranormal RPG**. Inclui todo o conteúdo dos livros oficiais e suplementos, cálculo automático de regras, rolador de dados integrado, exportação para PDF oficial e transmissão em tempo real para OBS/Mestre.

---

## 📚 Conteúdo Suportado

- 📖 **Livro de Regras Oficial** (Classes, Trilhas, Origens, Perícias, Itens e Rituais)
- 🕯️ **Sobrevivendo ao Horror** (Novas regras, origens, trilhas e equipamentos)
- 📂 **Arquivos Secretos (1 ao 7)** (Expansões e conteúdos adicionais organizados modularmente)
- ⚙️ **Regras Opcionais** (Suporte a regras customizadas, como separação de Nível e NEX)

---

## ✨ Funcionalidades Principais

### 🧙‍♂️ Criação de Personagem & Wizard
- **Passo a Passo Guiado:** Criação intuitiva distribuindo atributos, escolhendo origem, classe, trilha, perícias e toques finais.
- **Validação de Regras:** Limites automáticos de atributos, cálculo de pontos de perícia e inventário com base no NEX e patente.

### 📜 Ficha Interativa & Completa
- **Recursos em Tempo Real:** Barras dinâmicas de PV (Vida), PS (Sanidade) e PE (Esforço) com cálculo automático dos valores máximos.
- **Roda de Atributos Estilizada:** Visual temático e interativo para consultar e rolar atributos diretamente.
- **Tabela de Perícias:** Cálculo de bônus automático (grau de treinamento + atributo) e rolagem com 1 clique.
- **Editor de Armas & Ataques:** Gestão de armas com suporte a modificações, maldições, cálculo de dano, margem de ameaça e crítico.
- **Inventário & Carga:** Controle de peso/espaços, itens gerais, equipamentos de proteção e itens amaldiçoados.
- **Grimório de Rituais:** Organizado por elementos (*Conhecimento, Energia, Morte, Sangue e Medo*) e círculos, com controle de custo de PE e DT de rituais.
- **Painel de Condições:** Aplicação rápida de condições debilitantes com exibição dos efeitos mecânicos.
- **Ficha de Ameaça:** Suporte dedicado para mestres criarem e gerenciarem criaturas e monstros com facilidade.

### 🎲 Rolador de Dados & Áudio Imersivo
- Rolador integrado para testes de perícia, ataques, danos e dados genéricos (`d4`, `d6`, `d8`, `d10`, `d12`, `d20`, `d100`).
- Histórico completo das últimas rolagens.
- Efeitos sonoros imersivos (rolagens de dados e batimentos cardíacos para estados críticos).

### 📺 Overlay para OBS & Transmissão para o Mestre
- Transmissão em tempo real das barras de PV, PS, PE, avatar do agente e rolagens recentes diretamente para a live ou tela do Mestre.
- **100% P2P / WebRTC:** Conexão direta e descentralizada via PeerJS, sem necessidade de servidores intermediários. Funciona diretamente no navegador e em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages).

### 📄 Exportação para PDF Oficial & Backup
- **Exportação para PDF:** Preenchimento automático do modelo oficial da *Ficha Automática de Ordem Paranormal* usando `pdf-lib`.
- **Persistência Local:** Salvamento automático no navegador (`localStorage`).
- **Importar / Exportar JSON:** Salve cópias de segurança das suas fichas ou transfira-as entre diferentes computadores.

### 🎲 Utilitários & Geradores
- Geradores automáticos para auxiliar mestres e jogadores (nomes, NPCs, pistas e encontros).

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- `npm`

### Instalação e Inicialização

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento com Vite. |
| `npm run build` | Compila o projeto para produção na pasta `dist/` (inclui a app e a página de overlay). |
| `npm run preview` | Executa um servidor local para testar a versão compilada em `dist/`. |
| `npm test` | Executa os testes automatizados das regras e cálculos (`tests/calc.test.js`). |
| `npm run verificar-roda` | Validação visual automatizada da roda de atributos (requer o `preview` em execução). |

---

## 🎥 Configuração do Overlay no OBS

1. Na ficha do personagem, clique no botão **Overlay** no topo da tela.
2. Certifique-se de que a transmissão está **Ligada**.
3. Clique em **Copiar Link** (ou gere um novo código de sala).
4. No OBS Studio:
   - Adicione uma nova fonte: **+ → Navegador (Browser)**.
   - Cole o link copiado no campo **URL**.
   - Defina a resolução como **1920×1080**.
   - Marque a opção *Desativar fonte quando invisível* se desejar.

---

## 🏗️ Estrutura do Projeto

```
fichas_ordemparanormal/
├── public/                # Recursos estáticos públicos
├── src/
│   ├── components/        # Componentes de UI em React
│   │   ├── ficha/         # Abas, recursos, perícias, inventário, armas, condições
│   │   └── wizard/        # Passos do criador guiado de agentes
│   ├── data/              # Dados das regras (origens, classes, perícias, itens, rituais)
│   │   └── extra/         # Conteúdos dos Arquivos Secretos (AS01 a AS07)
│   ├── engine/            # Mecânicas de regras, cálculos, dados, áudio e storage
│   ├── export/            # Exportador da ficha oficial para PDF (pdf-lib)
│   ├── overlay/           # Lógica do overlay e comunicação WebRTC P2P (PeerJS)
│   ├── App.jsx            # Componente raiz da aplicação
│   └── main.jsx           # Ponto de entrada do React
├── tests/                 # Testes unitários e visuais
├── index.html             # HTML principal da aplicação
├── overlay.html           # HTML dedicado para a captura do overlay
└── package.json           # Dependências e scripts
```

---

## 🛠️ Tecnologias Utilizadas

- **[React 19](https://react.dev/)** — Interface reativa e componentizada
- **[Vite](https://vitejs.dev/)** — Bundler ultrarrápido para desenvolvimento e build
- **[PeerJS](https://peerjs.com/)** — Conexões WebRTC P2P em tempo real
- **[pdf-lib](https://pdf-lib.js.org/)** — Manipulação e preenchimento de campos de formulário PDF
- **CSS puro & Canvas** — Tematização estilizada baseada no universo de Ordem Paranormal


