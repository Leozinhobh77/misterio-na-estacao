# Mistério na Estação — Design e Arquitetura

Versão 1 · 18/11/2026 · Documento de passagem para protótipo

## 1. Conceito

**Gênero:** aventura narrativa de investigação e enigmas, para uma pessoa. **Público confirmado:** 13+. **Alvo:** navegador em computador e celular; interface de desktop com mouse/teclado e interface tátil no navegador móvel. O mesmo site pode ser instalado como PWA no computador ou celular compatível. Sem conta, compras, anúncios, chat, telemetria ou coleta de dados.

**Fantasia:** ajudar a reabrir uma antiga estação, seguindo pistas para descobrir quem acende o painel de partidas às 23h17 e por quê.

**Proposta narrativa:** numa estação isolada, a antiga chefe Helena Duarte desapareceu na noite do último trem. O jogador reúne registros para reconstruir por onde ela saiu e o que aconteceu. A solução é segura e não violenta: Helena partiu voluntariamente para outra cidade depois de deixar um arquivo histórico para a comunidade; a estação registrou o caso como desaparecimento porque ela não contou o plano ao plantão. Tom de suspense moderado, curiosidade e encerramento acolhedor. Essa proposta detalha o enredo sem mudar o objetivo do protótipo já em andamento.

## 2. Ciclo principal

Explorar a sala → inspecionar pontos de interesse → recolher evidências → resolver um enigma sem limite de tempo → registrar a conclusão no diário → avançar para a próxima área → combinar evidências na tela de dedução final.

O jogador não perde progresso por tentar uma resposta errada. Uma teoria incorreta explica qual evidência ainda falta e oferece voltar ao diário ou pedir uma pista graduada. Não há combate, cronômetro, reflexos obrigatórios ou becos sem saída.

## 3. Regras, pistas e progressão

- Cada fase tem de 3 a 5 pontos inspecionáveis; ao menos três fornecem evidência útil ou contexto.
- Interagir mostra texto curto, opção de ouvir narração/efeito se houver e a mesma informação escrita no diário. Nenhuma informação essencial existe só no áudio, cor ou animação.
- Pistas opcionais vêm em três níveis: área provável → relação entre duas evidências → próximo passo explícito. Usar dica não reduz pontuação nem bloqueia o final.
- Uma pista descoberta fica marcada no diário e salva imediatamente. Reinspecionar não duplica entradas.
- Enigmas são lógicos e sem limite de tentativas. O estado errado mostra uma explicação curta e permite tentar de novo.
- A dificuldade aumenta ao combinar conhecimentos: observar; comparar; interpretar mecanismo; ordenar evidências; sustentar uma teoria.

## 4. Campanha: cinco fases

| Fase | Local e objetivo | Desafio / evidências | Conclusão e passagem |
|---|---|---|---|
| 1. Plataforma | Examinar relógio, painel e bilhete; concluir o horário e a plataforma da partida | Comparar relógio parado, painel e bilhete. Uma anotação de bagagem confirma que Helena tinha uma passagem válida naquela noite. | Diário marca o horário e abre o saguão. Ensina inspeção, diário e dicas. |
| 2. Saguão | Cruzar mapa rasgado, quadro de horários e marcas de passagem para achar a rota até a sala de controle | Reconstituir o mapa com botões de girar/encaixar (arrastar é opcional). A rota mostra a porta de serviço usada durante o fechamento. | Diário associa passagem e saída de serviço; sala de controle liberada. |
| 3. Sala de controle | Restaurar a sequência de sinais e descobrir qual linha foi desligada | Consultar livro de registros e alinhar três sinais com o horário da fase 1. O livro mostra que a linha lateral foi liberada às 23h17, sem falha elétrica. | Registra que a saída foi deliberada e encaminha ao depósito; nenhuma ação depende de tempo de reação. |
| 4. Depósito de bagagens | Abrir a mala correspondente ao número e etiqueta encontrados | Usar a chave da fase anterior e combinar a etiqueta com o livro. A mala contém uma carta de Helena, a passagem para a cidade vizinha e um mapa com a porta final. | A carta indica que Helena saiu em segurança e deixou o arquivo para a comunidade; cabine do chefe liberada. |
| 5. Cabine do chefe da estação | Ordenar as provas e escolher uma explicação para o desaparecimento | Quadro de dedução reúne horário, rota, registro e carta. Resposta sustentada: Helena partiu voluntariamente no último trem e deixou o arquivo histórico; a equipe não sabia do plano. | A resposta correta abre o arquivo e encerra a campanha; respostas erradas preservam as pistas e explicam o elo que falta. |

**Cadeia verificável da dedução:** (1) relógio, painel e bilhete fixam horário e partida; (2) mapa e marcas mostram o trajeto pela porta de serviço; (3) o registro confirma liberação deliberada da linha; (4) carta e passagem confirmam que Helena partiu em segurança e deixou o arquivo à comunidade. A resposta final deve ligar pessoa, saída voluntária e preservação do arquivo. Se a teoria estiver incompleta, a tela aponta qual elo ainda falta.

## 5. Controles e interação

**Computador:** clique esquerdo inspeciona e escolhe; Tab/Shift+Tab percorrem pontos e botões; Enter ou Espaço ativa; setas percorrem escolhas; Esc fecha diário, opções, dica ou pausa. Botões visíveis duplicam toda ação; atalhos nunca são obrigatórios. Mouse não depende de hover para revelar informação.

**Navegador móvel:** toque em pontos de interesse e controles na tela; deslizar verticalmente percorre diário/opções. Nenhum gesto de pinça, clique direito ou hover é necessário. Áreas de toque mínimas de 44 × 44 CSS px, espaçamento confortável e interface que se ajusta a retrato e paisagem.

O ponto interativo mostra estados consistentes: normal, foco, pressionado, já investigado e indisponível. Não há arrastar obrigatório; quando um enigma usa ordenação, oferecer também botões “Mover para cima/baixo”.

## 6. Mapa de telas e caminhos

`Menu inicial → Novo jogo → introdução → Fase 1 → … → Fase 5 → Dedução → Vitória → Créditos → Menu`.

- **Menu inicial:** Novo jogo; Continuar (se houver gravação); Opções; Como jogar; Créditos. Cada item tem efeito explícito. “Novo jogo” com campanha existente abre confirmação para manter ou substituir o progresso.
- **Cena de fase:** cenário, nome/objetivo, pontos interativos, botões Diário, Dica, Pausa e Opções. Objetivo permanece consultável.
- **Diário:** pistas encontradas, suspeitos/contextos, objetivos e botão Voltar. Fechar devolve foco ao controle que o abriu.
- **Pausa:** Continuar; Opções; Reiniciar fase; Reiniciar campanha; Menu. Reinícios e saída com progresso por salvar pedem confirmação clara.
- **Opções:** volume de música, volume de efeitos, silenciar tudo; reduzir movimento; evitar flashes (ligado por padrão); vibração (desligada por padrão e só habilitada em dispositivo compatível); tamanho de texto. Aplicar e voltar; preferências persistem.
- **Dica:** mostrar próximo nível de pista; Fechar. Não consome item nem penaliza.
- **Fim de fase:** resumo de pistas, Continuar, Revisitar diário.
- **Dedução final:** três escolhas de autoria, método e motivo; Confirmar teoria; Consultar diário; Pedir pista. Teoria incorreta retorna ao quadro com explicação e pode ser tentada de novo.
- **Vitória:** revelação, agradecimento, Jogar créditos, Voltar ao menu, Jogar de novo. A campanha concluída continua salva para consulta/rejogo.
- **Falha/retorno:** sem tela de derrota permanente. Enigma incorreto permite tentar de novo; saída inesperada retoma do último ponto salvo.

## 7. Salvamento, continuar e reinício

Salvamento automático local após pista, enigma, mudança de fase e preferência. Guardar versão do save, fase atual, pistas, objetivos e estado da campanha em `localStorage`; nenhuma conta ou servidor. “Continuar” abre a fase e o ponto seguros mais recentes. Se o save estiver inválido ou for de versão incompatível, preservar o arquivo, explicar e oferecer Novo jogo (não fingir que há progresso). Reiniciar fase apaga apenas o progresso daquela fase e das posteriores, após confirmação; reiniciar campanha apaga pistas/fases da campanha, também com confirmação. Preferências de acessibilidade e áudio sobrevivem ao reinício da campanha. Se armazenamento estiver bloqueado/cheio, avisar que o avanço pode não ficar salvo e permitir seguir jogando nesta sessão.

## 8. Áudio, vibração e efeitos visuais

**Identidade:** mistério acolhedor; timbres suaves de relógio, madeira, relés e trilhos; evitar sustos sonoros e volume súbito. Música e efeitos separados, cada nível ajustável de 0 a 100; “Silenciar tudo” é ação única reversível. Música só começa após a primeira interação, respeitando a política do navegador. Legenda/transcrição e ícone visual acompanham todo evento sonoro informativo.

| Cena/evento | Música/ambiente | Efeito e retorno visual |
|---|---|---|
| Saguão | sopro leve, relógio distante | clique macio ao abrir ponto; brilho estático contorna pista nova; pequena poeira opcional |
| Plataforma | vento e trem distante em volume baixo | placa correta: dois tons; linha de rota destaca-se também por contorno e rótulo |
| Cabine | zumbido discreto de relés | chave muda com clique curto; solução: acorde breve e texto “Sequência correta” |
| Achados e perdidos | papel, madeira e ruído de fita suave | abertura de mala, som curto de fita; transcrição disponível sem áudio |
| Arquivo/final | motivo musical das fases anteriores, resolvido em harmonia | encaixe da evidência, transição curta para revelação; sem tela branca ou clarão |
| Erro, dica, vitória | erro: toque baixo e neutro; dica: nota suave; vitória: motivo resolvido | mensagem escrita com ícone; feedback nunca depende exclusivamente de som ou cor |

**Ativos sem custo pago:** primeira versão pode gerar tons/ambientes simples localmente com Web Audio API, além de usar arte vetorial original (SVG/CSS); isso evita pacote de áudio terceirizado. Se a equipe escolher arquivos de áudio, usar gravações próprias ou fontes com licença aberta compatível, registrar fonte/licença/crédito em `ASSETS.md` e manter cópia local; não presumir que um download tem licença livre.

**Vibração:** botão desligado inicialmente; vibração breve (p.ex. 12 ms) só para pista/solução quando habilitada e suportada. Usar `navigator.vibrate` com detecção de suporte, sem solicitar permissão extra. Em iOS/navegadores sem suporte, desabilitar ou explicar “Indisponível neste dispositivo”; áudio/visual continuam completos. Reduzir movimento desliga vibração por padrão.

**Movimento e flashes:** transições curtas de opacidade; partículas discretas e opcionais, nunca necessárias para achar pistas. “Evitar flashes” vem ligado, nenhum clarão repetido; respeitar `prefers-reduced-motion` e oferecer o ajuste dentro do jogo. Reduzir movimento elimina partículas, zoom e deslocamentos, mantendo mudanças de estado instantâneas e legíveis. Botões têm foco visível, estado pressionado e confirmação textual.

## 9. Acessibilidade e segurança de conteúdo

Interface em pt-BR, leitura clara, texto redimensionável, contraste mínimo WCAG AA como meta de produção, foco de teclado visível, sem informação só por cor, controles operáveis por teclado/toque, mensagens com leitor de tela e sem limite de tempo. Pistas graduadas evitam bloqueio. O suspense é atmosférico, sem violência gráfica, sustos repentinos ou conteúdo sexual; conteúdo final deve ser revisto para a faixa confirmada 13+, sem alegar classificação oficial.

## 10. Arquitetura técnica escolhida

- **Aplicação 2D:** Phaser 3 + TypeScript + Vite; cenas e puzzles em dados separados da interface. É adequado a salas ilustradas com pontos interativos, escalonamento e áudio sem custo de serviço.
- **Entrega web/desktop:** bundle web estático para navegador de computador/celular; empacotar o mesmo build em Electron para aplicativo desktop. Electron não cobra serviço; manter configurações seguras (sem Node integrado à página, contexto isolado) e validar o pacote alvo antes da entrega. GitHub Pages é uma opção de hospedagem estática depois da validação e publicação autorizada.
- **Estado:** cenas/estados explícitos para menu, exploração, enigma, pausa, dedução e vitória; conteúdo de fases e pistas em dados tipados separados da lógica de interação. Persistência via IndexedDB ou `localStorage` no protótipo, com versão do save, tratamento de erro e botão de reset confirmado.
- **Áudio:** Web Audio API para ambiente/eventos locais e controle de canais; sem autoplay antes de gesto. Preferências em `localStorage`; quando usuário silencia, parar e não recriar fontes até reativar.
- **Vibração:** feature detection no navegador, preferências explícitas; nenhum pedido de permissão. Falta de suporte é estado normal.
- **Acessibilidade:** HTML semântico, botões reais, ordem de foco alinhada à tela, `aria-live` para pistas e resultados, CSS para `prefers-reduced-motion`, `forced-colors` e foco; alvos táteis adaptados.
- **Custos/privacidade:** build e hospedagem estática gratuita/local; sem APIs, contas, analytics, pagamentos ou coleta. O progresso fica somente no dispositivo atual; avisar que limpar dados do navegador apaga o save.

## 11. Escopo inicial

**Inclui:** cinco ambientes estáticos responsivos; 15–25 pontos inspecionáveis; cinco enigmas; diário e quadro de dedução final; menu, opções, pausa, salvamento local, continuar, reiniciar fase/campanha, créditos e vitória; respostas para erro e armazenamento indisponível; áudio original gerado ou livre com licença registrada; controles computador/celular e pacote desktop.

**Fora da primeira versão:** multiplayer, login/sincronização em nuvem, dublagem extensa, combate, inventário complexo, finais divergentes, geração procedural, compras/anúncios, telemetria e executável nativo dedicado. Um desfecho principal com variantes de diálogo para pistas/dicas utilizadas.

## 12. Critérios de aceitação jogáveis

1. Novo jogo leva à fase 1; Continuar retoma fase e pistas após fechar/reabrir no mesmo navegador e, no app desktop, após reabrir o pacote.
2. É possível concluir cinco fases e a dedução usando mouse/teclado; a mesma campanha é concluível por toque no navegador móvel, sem hover/clique direito; o pacote desktop oferece os mesmos fluxos.
3. Cada pista importante aparece no diário com texto; dica não bloqueia vitória; resposta final é sustentada pelas quatro etapas da cadeia.
4. Pausa, opções, silenciar, volumes, redução de movimento, prevenção de flashes, vibração disponível/indisponível e controles de texto têm resultado observável e persistem conforme descrito.
5. Reiniciar fase, reiniciar campanha e iniciar nova campanha têm confirmação e escopo de apagamento correto; cancelar preserva o save.
6. Save corrompido, armazenamento indisponível e aparelho sem vibração/áudio não impedem jogar a campanha; a UI informa o fallback.
7. Teclado, foco, leitores de tela, zoom e tamanhos de tela são verificados antes da entrega; não declarar compatibilidade/teste sem evidência do ambiente validado.

## 13. Manual rápido do jogador

1. Toque/clique em **Novo jogo**. Se já houver campanha, escolha se quer manter ou substituir após ler a confirmação.
2. Leia o objetivo da sala. Toque/clique nos pontos marcados ou use **Tab** e **Enter/Espaço** no computador.
3. Examine tudo: evidências novas entram no **Diário**. Se travar, escolha **Dica**; ela mostra uma pista por vez e não tira pontos.
4. Resolva o enigma com calma e escolha **Continuar**. O jogo salva sozinho ao encontrar pistas e passar de fase.
5. Use **Pausa** para continuar, abrir **Opções**, reiniciar a fase/campanha ou voltar ao menu. Confirme reinícios; **Cancelar** mantém o progresso.
6. Para voltar depois, escolha **Continuar** no menu. Ajuste música, efeitos, texto, movimento e vibração em **Opções**; se o dispositivo não oferecer vibração, o jogo continua com feedback visual/sonoro.
7. Na última fase, consulte o Diário, escolha autoria, método e motivo e confirme. Uma teoria incompleta mostra a pista que falta. Após resolver, escolha **Créditos**, **Menu** ou **Jogar de novo**.

## 14. Passagem para desenvolvimento

O protótipo já está sendo iniciado em Phaser + TypeScript + Vite, com Electron para desktop. Implementar primeiro uma sala, hotspots, diário, uma solução e save local; confirmar os controles e a escala no navegador antes de preencher as cinco salas. Em seguida construir o ciclo completo e opções/fallbacks, alimentar as fases, verificar em navegador de computador, navegador móvel e pacote desktop e só então preparar publicação. Não criar custos ou serviços pagos. Publicação autorizada pelo usuário somente depois de concluída e validada.
