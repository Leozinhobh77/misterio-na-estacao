# Mistério na Estação — Plano de implementação

Versão 2.0 · 18/11/2026 · Arquiteto de Software

> **Status em 18/11, 02:20 — marcos 0 a 7 executados.** A estrutura modular, o save v2, a acessibilidade, os cinco enigmas, o Electron seguro, o responsivo e a verificação ponta a ponta estão no repositório; as caixas abaixo registram o plano original, não o estado atual. Falta o Marco 8 (publicação), que depende do fechamento da entrega e da conferência dos links. Veja o README para comandos e verificação.

Plano incremental sobre o protótipo que já existe. A regra é não reescrever o que funciona: cada marco mantém o jogo jogável, e a estrutura melhora por baixo. A arquitetura de referência é `docs/arquitetura.md`; o escopo narrativo está em `ESCOPO.md` e `docs/design-e-arquitetura.md`.

## Estado atual (18/11, 00:20)

- `src/main.ts` tem um protótipo jogável com cinco fases, cena Phaser, pistas, diário, opções, áudio sintetizado, save local e tela de vitória.
- `src/style.css` concentra todo o visual.
- `electron.cjs` abre `dist/index.html` por `file://`, sem protocolo próprio, CSP ou bloqueio de navegação.
- O `package.json` tem Phaser, Vite, Electron e electron-builder; os scripts `dev`, `build`, `preview`, `desktop` e `desktop:build` existem.
- Não há testes, README, `.gitignore` nem ícone de app.
- O save usa uma chave única (`misterio-estacao-save-v1`) e mistura campanha com preferências.
- Todos os enigmas são escolha múltipla; o escopo pede rotação, sequência e código.
- A lista de pontos em DOM já existe e é a base da acessibilidade; o canvas ainda não está marcado como decorativo.

## Princípios

- Uma mudança de cada vez; rodar o jogo depois de cada uma.
- Não trocar Phaser por React nem reescrever a interface. O problema é organização, não a pilha.
- Nenhum serviço pago, backend, login ou telemetria.
- Nenhuma publicação antes do Marco 7.
- Se uma tarefa crescer além de um dia, dividir antes de continuar.

## Marco 0 — Linha de base e guardas

**Objetivo:** saber exatamente o que funciona antes de mexer.

Tarefas:

- [ ] Rodar `npm install` e `npm run build`; registrar erros e avisos.
- [ ] Rodar `npm run dev` e jogar a campanha inteira uma vez; anotar o que quebra.
- [ ] Adicionar `vitest`, `jsdom` e script `test`.
- [ ] Adicionar `.gitignore` com `node_modules/`, `dist/`, `release/`, `tests/e2e/artefatos/`.
- [ ] Criar `README.md` com como rodar, controles, requisitos e aviso de save local.
- [ ] Adicionar `data-testid` estáveis em: menu, novo jogo, continuar, jogo, fase, lista de pontos, diário, pausa, opções, modal, confirmação, vitória.
- [ ] Rodar `npm audit` e registrar vulnerabilities; não atualizar tudo às cegas.
- [ ] Criar um teste de fumaça que monta o HTML sem Phaser e verifica que o menu aparece.

**Pronto quando:** `npm run build` passa, o jogo atual é jogável do menu à vitória, e existe um teste de fumaça verde. Nenhum comportamento foi alterado.

## Marco 1 — Modularizar sem mudar comportamento

**Objetivo:** sair do `main.ts` monolítico para a estrutura por assunto.

### 1a. Conteúdo

- [ ] Criar `src/game/content/types.ts` com `Clue`, `Phase` e `Puzzle` (primeiro no formato atual, `choices`).
- [ ] Mover as cinco fases para `src/game/content/phases/f01...f05.ts` e registrar em `content/phases.ts`.
- [ ] Mover manual e créditos para arquivos próprios.
- [ ] Criar teste de integridade: ids únicos, pistas existentes, coordenadas 0–1, todas as fases alcançáveis.

### 1b. Cena

- [ ] Mover `StationScene` para `src/game/scene/StationScene.ts`.
- [ ] Mover o desenho de cada sala para `scene/draw/f01.ts` … `f05.ts`.
- [ ] A cena recebe `{ phaseIndex, found }` e emite `inspect-clue`; não acessa `save` global.
- [ ] Adicionar tratamento de falha de inicialização do Phaser.

### 1c. Áudio e save

- [ ] Mover `AudioEngine` para `src/game/audio/AudioEngine.ts`.
- [ ] Mover `safeLoad`/`persist` para `src/game/save/`.
- [ ] Criar `src/game/state/store.ts` com `GameStore` e as ações da arquitetura.
- [ ] Substituir mutações diretas de `save` por chamadas ao store, uma tela por vez.
- [ ] Manter o formato antigo do save neste marco; a migração vem no Marco 2.

### 1d. Interface

- [ ] Mover o HTML estático de `main.ts` para `src/ui/screens/home.ts` e `game.ts`.
- [ ] Mover diário, opções, pausa, manual, créditos e dedução para `src/ui/panels/`.
- [ ] Criar `src/ui/modal.ts` com abrir/fechar, foco guardado e retorno.
- [ ] `src/main.ts` passa a só chamar `bootstrap()`.
- [ ] Nenhuma string de conteúdo fica duplicada entre `main.ts` e `content/`.

**Pronto quando:** o jogo se comporta exatamente como antes, mas `main.ts` tem menos de 50 linhas, cada fase está no seu arquivo e os testes de conteúdo e do store passam.

## Marco 2 — Save v2, opções e migração

**Objetivo:** progresso confiável e preferências independentes.

Tarefas:

- [ ] Criar `CampaignState` v2 e `Options` v2 conforme a arquitetura.
- [ ] Separar as chaves `misterio-estacao:campaign:v2` e `misterio-estacao:options:v2`.
- [ ] Implementar migração da chave antiga `misterio-estacao-save-v1`, sem apagar o original.
- [ ] Validar todos os campos; em save inválido, copiar o cru para `campaign:corrupt` e mostrar explicação no menu.
- [ ] Implementar fallback em memória quando `localStorage` falhar; mostrar faixa de aviso.
- [ ] Garantir que reiniciar campanha preserve as opções e que reiniciar fase preserve as fases anteriores.
- [ ] Gravar em `visibilitychange`/`pagehide` se houver alteração pendente.
- [ ] Testes: ida e volta, JSON inválido, versão errada, ids inexistentes, fase fora da faixa, cota cheia, migração v1, opções inválidas.
- [ ] Teste manual: jogar, recarregar, continuar; limpar só a chave da campanha e confirmar que as opções ficam.

**Pronto quando:** um save antigo do protótipo migra sem perder pistas; um save corrompido não apaga nada e oferece **Novo jogo**; preferências sobrevivem a reiniciar campanha.

## Marco 3 — Acessibilidade e foco

**Objetivo:** jogar inteiro sem mouse e sem depender do canvas.

Tarefas:

- [ ] Marcar `#phaser-host` como `aria-hidden="true"`; a lista de pontos é a interface canônica.
- [ ] Adicionar descrição textual da sala (`sr-only` ou visível).
- [ ] Corrigir `aria-pressed` inicial dos botões de pista e o estado "Nova"/"Registrada".
- [ ] Implementar foco preso, `aria-labelledby`, Esc e retorno de foco em `modal.ts`.
- [ ] Focar `#phase-title` ao trocar de fase; anunciar a sala.
- [ ] `aria-live="polite"` para pista, erro, acerto e save.
- [ ] Revisar a ordem de Tab: menu, pontos, diário, dica, pausa, enigma.
- [ ] Garantir que todos os botões tenham nome acessível e foco visível.
- [ ] Testar a fase 1 inteira só com Tab/Enter/Espaço/Esc.
- [ ] Testar com NVDA, se disponível; registrar o que não foi testado.
- [ ] Verificar contraste dos pares reais; corrigir o que estiver abaixo de 4,5:1.
- [ ] Adicionar `prefers-reduced-motion` e `--text-scale` no CSS, com 100/115/130%.

**Pronto quando:** uma pessoa completa a fase 1 sem tocar no mouse; o modal devolve o foco; o leitor de tela lê a pista e o resultado; nenhum controle essencial está só no canvas.

## Marco 4 — Enigmas variados

**Objetivo:** cumprir as cinco fases do escopo, não cinco vezes a mesma escolha.

Tarefas:

- [ ] Criar `src/game/puzzle/validate.ts` com `choice`, `sequence`, `rotate` e `code`.
- [ ] Criar `src/ui/panels/puzzle.ts` que renderiza os passos em sequência.
- [ ] `choice`: opções com botão único e confirmação.
- [ ] `sequence`: lista com **Mover para cima/baixo**, sem arrastar.
- [ ] `rotate`: cada peça com **Girar 90°**, estado textual e conferência.
- [ ] `code`: `<input inputMode="numeric">`, botão **Conferir**, erro sem perder o valor.
- [ ] Fase 1: duas escolhas (horário, plataforma).
- [ ] Fase 2: rotação de três partes do mapa + escolha da rota.
- [ ] Fase 3: sequência norte → lateral → central.
- [ ] Fase 4: código 217, derivado do bilhete/etiqueta.
- [ ] Fase 5: sequência de quatro evidências + escolha da explicação.
- [ ] Erro mostra explicação curta, incrementa `mistakes`, mantém o passo.
- [ ] Após 3 erros na fase, oferecer a dica uma vez; a dica continua disponível sem penalidade.
- [ ] Testes de unidade para cada tipo e teste de conteúdo para todas as respostas.
- [ ] Testar cada enigma só com teclado e com toque.

**Pronto quando:** as cinco fases usam os mecanismos previstos, cada uma é concluível por teclado e por toque, e o teste de conteúdo garante que nenhuma resposta aponta para id inexistente.

## Marco 5 — Electron seguro e empacotado

**Objetivo:** o app desktop abre, salva e não expõe o sistema.

Tarefas:

- [ ] Reescrever `electron.cjs` com `contextIsolation`, `sandbox`, sem `nodeIntegration`, sem preload.
- [ ] Registrar `app://` como esquema privilegiado e servir `dist/` com `protocol.handle`, bloqueando traversal.
- [ ] Bloquear navegação externa, `window.open` e todas as permissões de sessão.
- [ ] Adicionar CSP, instância única, janela 1280×800, mínimo 760×620, F11 e menu removido em produção.
- [ ] Criar `electron-builder.yml` com `nsis` e `portable`, `build/icon.ico` e `release/` fora do Git.
- [ ] Testar instalar, abrir, jogar uma fase, fechar, reabrir e **Continuar**.
- [ ] Gerar SHA-256 dos artefatos e documentar o aviso do SmartScreen.
- [ ] Verificar que o save do desktop não depende de `file://` e que a migração v1 funciona.

**Pronto quando:** portable e instalador abrem sem erro de console, o save persiste entre sessões e nenhum conteúdo externo é carregado.

## Marco 6 — Responsivo, áudio e acabamento

**Objetivo:** o jogo parece produto em celular, desktop e desktop app.

Tarefas:

- [ ] Revisar layout em 390×844, 844×390, 768×1024, 1280×800 e 1920×1080.
- [ ] Garantir alvos de 44×44, safe areas, ausência de rolagem horizontal e cena sem corte.
- [ ] Testar texto em 130% e zoom de 200%.
- [ ] Separar os barramentos de música, ambiente e efeitos no `AudioEngine`.
- [ ] Adicionar ruído/vento/tique por fase, mantendo o áudio sintetizado e original.
- [ ] Suspender áudio ao ocultar a aba e retomar ao voltar.
- [ ] Vibração desligada por padrão, com detecção de suporte e fallback.
- [ ] Reduzir movimento desliga partículas/transições; sem flashes em nenhuma configuração.
- [ ] Revisar foco, contraste e estados de botão depois do polimento.
- [ ] Testar no iPhone (Safari) e Android (Chrome), se disponíveis.

**Pronto quando:** a matriz de telas passa, o áudio tem três volumes independentes e o jogo continua compreensível sem som, sem vibração e com movimento reduzido.

## Marco 7 — Testes ponta a ponta e QA

**Objetivo:** provar o percurso, não afirmar que funciona.

Tarefas:

- [ ] Criar `tests/e2e/conftest.py` que sobe `npm run preview -- --port 4173` e espera a porta.
- [ ] Criar `test_journey.py`: menu, cinco fases, vitória, créditos, menu.
- [ ] Criar `test_recovery.py`: recarregar e continuar, pausa, reiniciar fase com cancelar/confirmar, reiniciar campanha, save corrompido, opções persistentes.
- [ ] Criar `test_mobile.py`: 390×844, toque, lista de pontos, diário, enigma.
- [ ] Criar um percurso só de teclado no desktop.
- [ ] Salvar screenshots em `tests/e2e/artefatos/`.
- [ ] Pedir revisão ao QA e corrigir os defeitos reproduzíveis.
- [ ] Registrar no README o que foi testado e em quais ambientes.

**Pronto quando:** todos os testes passam em Chromium desktop e mobile; o percurso de teclado passa; os defeitos conhecidos estão corrigidos ou documentados.

## Marco 8 — Publicação

**Objetivo:** links funcionando, com validação antes da divulgação.

Tarefas:

- [ ] Criar `vercel.json` com CSP, cabeçalhos de segurança e cache.
- [ ] Rodar `npm run build` e publicar na Vercel; testar a URL em desktop e celular.
- [ ] Criar o repositório no GitHub e enviar o código com README, licença e `ASSETS-LICENCAS.md`.
- [ ] Renovar o login do `gh` (o token atual está inválido) antes de criar a release.
- [ ] Publicar a release com portable, instalador e SHA-256.
- [ ] Conferir os links em janela anônima e registrar a data da validação.
- [ ] Só então entregar os links ao Léo.

**Pronto quando:** site e release abrem, o percurso completo funciona na URL publicada e os checksums conferem.

## P2 — Depois da entrega

Não bloqueiam o protótipo nem a publicação:

- PWA instalável com service worker e aviso explícito de atualização.
- Exportar e importar progresso em JSON.
- Fundos ilustrados do Artista, substituindo o desenho geométrico sem mudar a lógica.
- Tema de alto contraste para a interface (a direção noturna permanece).
- Lembrar tamanho e posição da janela no Electron.
- Faixas de áudio gravadas, com M4A/AAC principal e OGG alternativo.
- Partículas e luz adicionais, sempre desligáveis.

## Matriz mínima de verificação

| Fluxo | Desktop | Celular | Teclado | Electron |
|---|---|---|---|---|
| Novo jogo → fase 1 | Sim | Sim | Sim | Sim |
| Continuar após recarregar | Sim | Sim | Sim | Sim |
| Pista no diário | Sim | Sim | Sim | Sim |
| Enigma errado e nova tentativa | Sim | Sim | Sim | Sim |
| Dica após 3 erros | Sim | Sim | Sim | Sim |
| Reiniciar fase (cancelar/confirmar) | Sim | Sim | Sim | Sim |
| Reiniciar campanha | Sim | Sim | Sim | Sim |
| Cinco fases → vitória | Sim | Sim | Sim | Sim |
| Save corrompido | Sim | Sim | — | Sim |
| Sem áudio / sem vibração | Sim | Sim | — | Sim |
| Opções persistem | Sim | Sim | Sim | Sim |

## Regras de execução

- Não reintroduzir backend, login, analytics, anúncios ou serviço pago.
- Não editar os documentos do Designer nem do Artista; registrar divergências e alinhar com o Orquestrador.
- Não publicar nem divulgar links antes do Marco 7 passar.
- Se a arte atrasar, seguir com o desenho geométrico; não bloquear a lógica.
- Registrar decisões novas em `docs/arquitetura.md` ou em um ADR curto, não só no chat.

## Dependências externas

| Dependência | Quem fornece | Quando | Bloqueia? |
|---|---|---|---|
| Fundos ilustrados (opcional) | Artista de Jogos | P2 | Não; desenho geométrico cobre |
| Ícone do app 256×256 | Artista de Jogos | Marco 5 | Não; ícone padrão no protótipo |
| Login do GitHub renovado | Léo | Marco 8 | Só a publicação |
| Aprovação final dos links | Léo | Marco 8 | Sim, para divulgar |
