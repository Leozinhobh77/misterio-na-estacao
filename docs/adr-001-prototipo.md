# ADR 001 — Evolução do protótipo jogável

- **Estado:** aceito
- **Data:** 18/11/2026
- **Contexto:** adaptar o protótipo existente às cinco fases e aos requisitos de acessibilidade, sem interromper o comportamento já jogável.

## Decisões

1. Manter Phaser 3, TypeScript, Vite e Electron. Phaser desenha a sala e emite eventos de inspeção; DOM/HTML mantém controles, texto, regras, enigmas e acessibilidade.
2. Dividir os dados das fases em cinco módulos e separar estado, armazenamento, validação dos enigmas, som e interface por assunto. `src/main.ts` só inicializa a interface.
3. Guardar campanha e opções em chaves v2 separadas. Migrar o save v1 sem apagá-lo, validar IDs e faixas, preservar uma cópia de dados inválidos e continuar com estado em memória se o armazenamento não puder ser usado.
4. Implementar os enigmas por tipo: escolhas na Plataforma, rotação e rota no Saguão, ordenação na Sala de Controle, código no Depósito e ordenação mais conclusão na Cabine.
5. Servir o build Electron por `app://station`, com CSP, sandbox, contexto isolado, Node desativado na página, navegação externa negada e permissões recusadas.
6. Usar desenho vetorial e áudio sintetizado originais para manter o jogo offline e evitar arquivos de terceiros ou serviços pagos.

## Desvio observado

O Phaser inicialmente tentou usar WebGL no navegador validado e registrou `Framebuffer status: Incomplete Attachment`. O projeto agora força `Phaser.CANVAS`; a ilustração vetorial e os marcadores continuam funcionando e a lista DOM permanece independente da cena. Assim, a experiência não depende de WebGL.

## Validação e limites

`npm test` e `npm run build` passaram. O percurso de cinco fases foi concluído no navegador Chromium; os fluxos de save local, migração v1 e cópia de save inválido foram exercitados no mesmo navegador. A viewport móvel foi emulada; não houve teste em aparelho físico nem verificação com leitor de tela. Empacotamento, instalação e execução Electron devem ser considerados validados somente depois que `npm run desktop:build` e a abertura do app concluírem com sucesso.

## Consequências

O DOM fornece o caminho funcional para teclado e tecnologia assistiva mesmo se a ilustração não carregar. O bundle do Phaser permanece o maior arquivo do build. O áudio é original e configurável, mas sintetizado em vez de gravado. GitHub/publicação fica para depois de validar o alvo desktop e o pacote final.
