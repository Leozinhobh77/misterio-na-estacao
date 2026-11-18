# Mistério na Estação — escopo para protótipo jogável

## Objetivo e limites

Aventura 2D de investigação, público jovem/adulto 13+, jogável em navegador desktop e móvel, com uma versão desktop empacotada. O jogador investiga uma estação isolada, reúne provas e reconstrói a sequência de um desaparecimento sem violência gráfica. Experiência solo, local, sem anúncios, compras, chat, conta, telemetria ou coleta de dados. Todo conteúdo visual, textual e sonoro deve ser original ou ter licença aberta registrada; não usar marcas ou personagens protegidos.

## Solução técnica proposta

- Phaser 3 com TypeScript e Vite para uma aplicação 2D responsiva. O mesmo build web roda em navegadores modernos e alimenta o invólucro desktop Electron. Não requer servidor de jogo nem serviço pago.
- Web: publicar o bundle estático; GitHub Pages é uma opção para a entrega autorizada, sujeito às regras e limites atuais do serviço. Electron empacota os mesmos arquivos para desktop.
- Persistência local: IndexedDB (ou localStorage para o protótipo se os dados forem pequenos), versão do schema e tratamento de dado inválido; sem sincronização na nuvem. Autosave ao coletar pista, resolver etapa e trocar de fase; botão Continuar abre o checkpoint salvo.
- Som via Web Audio; iniciar áudio somente após interação do jogador. Vibração via `navigator.vibrate` como melhoria opcional; navegador sem suporte, bloqueio do sistema ou desktop resulta em ausência de vibração, sem erro ou perda de feedback.
- Requisitos técnicos: escala que preserve a proporção sem cortar controles; layout adaptativo; estados de foco por teclado; respeitar `prefers-reduced-motion`; volumes independentes de música, ambiente e efeitos; erro de mídia não bloqueia avanço.

## Ciclo de jogo

Explorar o cenário → observar e examinar objetos → coletar pistas → ler no caderno → ligar duas evidências no quadro de dedução → resolver a etapa → salvar → avançar. Não há corrida contra o tempo. Erros de dedução exibem uma explicação curta e permitem tentar novamente; após três erros na mesma etapa, oferecer pista opcional. Falha significa uma etapa ainda não resolvida, sem apagar pistas nem o progresso anterior. Vitória ocorre ao apresentar a explicação final sustentada pelas evidências.

## Fases e objetivos

1. **Plataforma:** examinar relógio, painel e bilhete; concluir horário de chegada e identificar a plataforma usada.
2. **Saguão:** cruzar mapa rasgado, quadro de horários e marcas de passagem; encontrar o caminho até a sala de controle.
3. **Sala de controle:** consultar o livro de registros e restaurar energia com sequência indicada pelas pistas; descobrir qual linha foi desligada.
4. **Depósito de bagagens:** usar número e etiqueta da mala com a chave encontrada; obter a prova que liga o depósito ao evento.
5. **Cabine do chefe da estação:** ordenar as evidências no quadro e escolher uma de três explicações; a opção correta conclui a campanha. Opções erradas voltam ao quadro, preservando o progresso.

Cada fase tem entrada, exploração, painel de pistas, solução e transição. Marco de saída e próximo objetivo aparecem no caderno; objetos de cenário sem função não parecem interativos.

## Telas e caminhos

- **Menu:** Novo jogo → confirmação quando existe campanha; Continuar → checkpoint; Manual; Opções; Créditos/Licenças.
- **Jogo:** cenário com alvos interativos, objetivo atual, caderno/inventário, quadro de dedução e pausa.
- **Pausa:** Continuar; Manual; Opções; Reiniciar fase; Reiniciar campanha; Menu. Reinícios e abandono de progresso exibem confirmação explícita. Reiniciar fase mantém pistas anteriores e reinicia apenas o puzzle corrente; reiniciar campanha apaga o save após confirmação.
- **Falha/tentativa:** mensagem contextual; Tentar novamente, Usar pista (se habilitada), Voltar ao menu. Nenhuma falha apaga autosave.
- **Vitória:** resumo da dedução, campanha concluída e opções Jogar novamente / Menu. Jogar novamente inicia nova campanha após confirmação se houver progresso.
- **Salvar:** indicador breve “Progresso salvo”; Continuar retoma último marco confirmado. Se dado estiver corrompido, oferecer Novo jogo e explicar que o save local não pôde ser lido.

## Controles e responsividade

- Desktop: mouse para apontar/selecionar; clique ou Enter para examinar/interagir; Tab e setas navegam foco; Esc abre/fecha pausa; atalhos listados no Manual e remapeáveis apenas se o escopo permitir.
- Navegador móvel: toque para examinar/interagir; botões grandes e rotulados para caderno, pistas e pausa; arrastar para ligar pistas é opcional, com alternativa “selecionar pista A → selecionar pista B”. Sem hover obrigatório.
- Alvos de toque no mínimo 44×44 CSS px, espaçamento consistente. Desktop permite redimensionar; celular usa área de jogo com rolagem controlada pelo jogo e interface que não tapa pistas. Retrato e paisagem devem funcionar; preferir paisagem para o cenário, com instrução para girar quando a área útil ficar pequena.

## Acessibilidade, som e feedback

- Contraste validado em uso; texto ampliável; pistas distinguíveis por silhueta, ícone e rótulo além da cor; foco sempre visível; não exigir audição ou vibração para resolver enigmas.
- Opções independentes: volume da música, ambiente e efeitos; silenciar tudo; vibração ligada/desligada; reduzir movimento. Salvar opções localmente.
- Trilha: instrumentação original de tons sustentados, ruído de vento e notas espaçadas; 1 loop por fase, 60–120 s, sem picos repentinos. Música e ambiente separados e ajustáveis.
- Eventos: foco (brilho/contorno e som leve); coleta (ícone de confirmação e som curto); combinação correta (linha luminosa e acorde curto); combinação errada (mensagem + tom discreto); bloqueio (rótulo do que falta); transição (dissolução lenta); vitória (tema resolutivo). Indicadores/legendas visuais equivalentes para toda informação relevante transmitida por áudio.
- Vibração apenas em dispositivo compatível e quando habilitada; padrão curto (até ~30 ms) em pista coletada/solução, sem repetição contínua. Não solicitar permissão inesperada. Se não suportada, ignorar silenciosamente e manter animação/rótulo.
- Reduzir movimento desliga partículas, tremor, paralaxe e transições animadas; flashes rápidos não são usados em nenhuma configuração. Efeitos sonoros podem ser silenciados sem perder informação.

## Direção visual e assets

Estação ferroviária original com arquitetura modular, metal gasto, azulejos, vidro embaçado e papéis. Formas simples, leitura clara e luz como guia. Paleta inicial: azul-noite `#172633`, verde-pátina `#47766B`, creme-papel `#E8D9B8`, âmbar `#D99A3D`, vermelho `#A7473D`; conferir contraste em pares reais antes de integração. Fonte sem serifa legível na interface; aparência documental reservada a objetos decorativos.

Prioridades:

- **P0 jogável:** 5 fundos de fase, alvos interativos, 15–25 pistas/objetos, UI básica e ícones, telas de menu/pausa/opções/manual/vitória, cursor/toque, sinais de estado. Fundo 16:9 alvo 1920×1080 (PNG/WebP, camadas separadas se necessário); objetos transparentes 256–512 px PNG/WebP; ícones SVG ou PNG 64–128 px; UI vetorial em CSS/SVG.
- **P1 leitura:** versões de foco/selecionado/coletado/bloqueado/erro; caderno, quadro de dedução, indicadores de objetivo, foco de teclado; texto alternativo/rótulos acessíveis.
- **P2 polimento:** partículas pequenas, variação de luz, animações de relógio/painel e transições. Todos desligáveis com reduzir movimento.
- **Áudio:** loops OGG/Opus (produção WAV), separados por fase e categoria; efeitos curtos para examinar, coleta, dedução correta/incorreta, porta/bloqueio, mudança de fase e vitória. Criar/gravar original ou usar licença aberta compatível e documentada. Nenhuma compra de asset.

Nomes: `f01_platform_bg.webp`, `clue_ticket_idle.png`, `ui_clue_found.svg`, `amb_f03_control_room.ogg`, `sfx_deduction_correct.ogg`. Registrar fonte, licença, atribuição e modificações em `ASSETS-LICENCAS.md`.

## Manual do jogador (texto dentro do jogo)

1. No menu, escolha **Novo jogo** ou **Continuar**.
2. Examine objetos destacados com clique ou toque; no computador, use Tab/setas para percorrer e Enter para interagir.
3. Abra **Caderno** para rever pistas e o **Quadro** para relacionar evidências; escolha a alternativa de selecionar duas pistas se arrastar for difícil.
4. O progresso é salvo automaticamente. Abra **Pausa** a qualquer momento para continuar, ver opções ou reiniciar fase/campanha.
5. Em uma tentativa errada, leia a mensagem e tente novamente; use a pista opcional se precisar. Ao final, escolha Jogar novamente ou Menu.

## Critérios de aceite do protótipo e validação

- Completar as cinco fases e chegar à tela de vitória; cada decisão, botão, retorno e confirmação tem destino funcional.
- Novo jogo, Continuar, autosave, pausa, reinício da fase, reinício da campanha, erro/tentativa, vitória e retorno ao menu funcionam em browser desktop, browser móvel e app desktop.
- Controles por teclado/mouse e toque são operáveis; dedução tem alternativa a arrastar; layout não corta ações em celular estreito.
- Sem som, vibração ou animação, objetivos e soluções continuam compreensíveis; preferências persistem após recarga/reabertura.
- Validar contraste, escala de texto, foco, áreas táteis, transições e fallback em dispositivos reais/alvos acordados. Registrar testes executados; não declarar compatibilidade/classificação sem evidência.

## Fontes técnicas consultadas

- Phaser: https://docs.phaser.io/ e https://docs.phaser.io/phaser/getting-started/making-your-first-phaser-game
- Electron: https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app
- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages e https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Vibração no navegador: https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API (suporte limitado; fallback obrigatório)
