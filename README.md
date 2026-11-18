# Mistério na Estação

Aventura narrativa de investigação em português, pensada para público 13+. Investigue cinco áreas da Estação Aurora e descubra por que Helena Duarte partiu na noite do último trem. A história trata uma partida voluntária e segura, sem violência gráfica.

## Executar na web

Requisitos: Node.js 20.19+ ou 22.12+ e npm.

```sh
npm install
npm run dev
```

Abra o endereço local exibido pelo Vite. Para conferir a versão compilada:

```sh
npm run build
npm run preview
```

## Executar no desktop

No Windows, inicie o Vite e o Electron juntos:

```sh
npm run desktop
```

Para gerar instalador NSIS e versão portátil sem assinatura digital:

```sh
npm run desktop:build
```

Os artefatos aparecem em `release/`. A janela salva o progresso localmente. O Windows pode exibir o aviso SmartScreen em pacotes sem assinatura.

Pacotes gerados em 18/11/2026 (sem assinatura digital):

| Arquivo | Tamanho | SHA-256 |
|---|---|---|
| `Mistério na Estação Setup 0.1.0.exe` | 118.370.871 bytes | `b5c5e4ddf66e8ffe3db221598478e31a24510782ba70d9249cb6a1216348eba0` |
| `Mistério na Estação 0.1.0.exe` | 101.268.097 bytes | `2123ae3d521be0be0cbb278f419751cc343da0fed87140bae07ae53e4a57f3b7` |


## Manual do jogador

1. No menu, escolha **Começar investigação** para iniciar ou **Continuar** para retomar o último progresso. Se já existe uma campanha, iniciar outra pede confirmação.
2. Leia o objetivo da sala. No computador, use mouse ou **Tab** para percorrer os controles e **Enter** ou **Espaço** para ativar. Em tela de toque, toque nos mesmos botões visíveis; não é preciso arrastar nem usar hover.
3. Examine os pontos numerados na ilustração ou escolha seus botões em **Pontos de interesse**. Cada descoberta aparece no painel e é guardada no **Diário**.
4. Use **Diário** para reler as evidências ou **Dica** para receber ajuda sem penalidade. O jogo não tem cronômetro.
5. Quando **Resolver enigma** ficar ativo, responda ao desafio da sala e toque/clique em **Conferir**. A Plataforma pede horário e plataforma; o Saguão pede que gire trechos do mapa e escolha a rota; a Sala de Controle pede a ordem dos sinais; o Depósito pede o código numérico; a Cabine pede a ordem das evidências e uma conclusão. Um erro explica o que falta e mantém sua resposta disponível para tentar de novo.
6. Na lista de ordenação, use **Mover para cima** e **Mover para baixo**. No mapa, cada botão **Girar 90°** alterna a orientação. Essas ações têm alternativa por teclado e não exigem arrastar.
7. **Pausa** abre **Continuar investigação**, **Opções**, **Reiniciar fase**, **Reiniciar campanha** e **Voltar ao menu**. Reiniciar pede confirmação; **Cancelar** preserva o progresso. Reiniciar a fase mantém salas anteriores e opções; reiniciar a campanha remove o progresso das salas, mas mantém opções.
8. O jogo salva pistas, tentativas e salas concluídas neste dispositivo. **Continuar** retoma após fechar e abrir o jogo. Se o navegador bloquear armazenamento, o jogo avisa que o progresso vale apenas naquela sessão. Limpar os dados locais pode apagar o save.
9. Em **Opções**, ajuste música, ambiente, efeitos, silenciar tudo, vibração, movimento, flashes e tamanho do texto. O som começa após uma interação. Vibração é opcional, fica desligada por padrão e não é usada quando indisponível ou quando o movimento está reduzido.
10. Ao concluir a Cabine do Chefe, leia a conclusão. **Créditos**, **Menu inicial** e **Jogar novamente** levam aos destinos indicados; jogar novamente confirma antes de iniciar uma campanha limpa.

## Fases

1. **Plataforma** — relógio, partidas, bilhete e etiqueta confirmam a hora e a plataforma.
2. **Saguão** — reconstitua o mapa e a passagem de serviço.
3. **Sala de Controle** — descubra a sequência de sinais e a liberação da linha.
4. **Depósito de Bagagens** — use a etiqueta para encontrar a mala e o código 217.
5. **Cabine do Chefe** — ordene as provas e deduza a partida segura de Helena.

## Controles e acessibilidade

- **Computador:** mouse para pontos e botões; Tab/Shift+Tab para navegar, Enter/Espaço para ativar e Esc para fechar um diálogo ou abrir a pausa.
- **Celular/tablet:** toque nos botões e pontos; o layout reflowa em retrato e paisagem.
- Os controles e enigmas principais são HTML/DOM. O canvas Phaser é uma ilustração complementar e fica fora da árvore de acessibilidade.
- O jogo oferece foco visível, mensagens anunciadas, texto ajustável, `prefers-reduced-motion`, opção para reduzir movimento e opção para evitar flashes. Nenhuma pista necessária depende de cor, som, vibração ou animação.
- Não há contas, anúncios, compras, chat, telemetria ou envio de progresso.

## Arquitetura e licenças

Phaser 3 desenha as salas; TypeScript mantém conteúdo, estado, enigmas e save; Vite monta a versão web estática; Electron abre os mesmos arquivos locais com isolamento e protocolo `app://`. Música ambiente e efeitos são sintetizados localmente com Web Audio. Campanha e opções ficam em chaves `localStorage` separadas, com migração da versão anterior e preservação de cópia corrompida. Não há backend nem serviço pago.

Veja [ESCOPO.md](ESCOPO.md), [docs/design-e-arquitetura.md](docs/design-e-arquitetura.md), [docs/arquitetura.md](docs/arquitetura.md), [docs/plano-de-implementacao.md](docs/plano-de-implementacao.md), [docs/verificacao.md](docs/verificacao.md), [docs/adr-001-prototipo.md](docs/adr-001-prototipo.md) e [ASSETS-LICENCAS.md](ASSETS-LICENCAS.md). O código do projeto está sob MIT em [LICENSE](LICENSE); dependências mantêm suas licenças próprias.

## Verificação executada

- `npm test` — passou; cinco testes unitários de conteúdo, enigmas e estado.
- `npm run build` — passou; bundle web compilado. Phaser é separado em chunk (aprox. 1,2 MB sem gzip; 332 KB gzip).
- Chromium desktop, 1280×800 — campanha inteira nas cinco fases, com tentativa errada, dica após três erros, tela de vitória, créditos com retorno, pausa por Esc, reinício de fase com cancelar/confirmar e recarga com **Continuar**; sem erros de console no percurso.
- Chromium móvel, 390×844 — campanha inteira por toque, sem rolagem horizontal e com alvos de 48 px.
- Save — continuar após recarga, preferências persistentes (texto 130% e áudio silenciado), migração v1 para v2 e save corrompido com cópia preservada em `misterio-estacao:campaign:corrupt` verificados no navegador.
- Electron — instalador NSIS e versão portátil gerados em `release/`; janela desktop abre, inicia a fase 1 e grava o save local. Capturas em `tests/e2e/artefatos/`; `tests/e2e/desktop-check.mjs` repete a conferência por CDP.
- Não verificados: aparelho móvel físico, leitor de tela e assinatura digital do instalador (o Windows pode exibir SmartScreen).

