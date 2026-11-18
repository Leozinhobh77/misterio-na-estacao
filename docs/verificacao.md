# Verificação — 18/11/2026

Registro do que foi executado nesta rodada, com ambiente e resultado. Não substitui teste em aparelho físico nem revisão de acessibilidade com leitor de tela.

## Comandos

| Comando | Resultado |
|---|---|
| `npm test` | 5 testes aprovados (conteúdo, enigmas, estado) |
| `npm run build` | aprovado; bundle web em `dist/` |
| `npx electron-builder --win` | instalador NSIS e portátil em `release/` |
| `node tests/e2e/desktop-check.mjs` | janela Electron via CDP: menu, fase 1, pista e save |

## Navegador — desktop 1280×800

- Campanha inteira nas cinco fases, com os cinco enigmas resolvidos (horário/plataforma, rotação e rota, sequência de sinais, código 217, ordenação e conclusão).
- Tentativa errada mantém a resposta e explica o que falta; após três erros aparece o atalho para a dica.
- Vitória, créditos e retorno à vitória, menu inicial, jogar novamente com confirmação.
- Pausa por `Esc` abre e permanece aberta; segundo `Esc` fecha; foco retorna ao controle anterior.
- Reiniciar fase: cancelar mantém a pista; confirmar limpa só a fase atual.
- Recarregar a página e usar **Continuar** retoma o ponto salvo; vitória permanece após recarga.
- Preferências: texto em 130% e áudio silenciado sobrevivem à recarga; o botão de som inicia com o rótulo correto.
- Save corrompido: aviso no menu, cópia em `misterio-estacao:campaign:corrupt`, opções preservadas e novo jogo funcional.

## Navegador — móvel 390×844

- Campanha inteira por toque, sem rolagem horizontal em nenhuma das cinco fases.
- Botões de ponto e de enigma com 48 px de altura; modal de enigma cabe na largura (325 px).
- Vitória, créditos e fechamento retornam ao menu.

## Limites

- Não testado em aparelho móvel físico (iOS/Android), com leitor de tela (NVDA/VoiceOver) nem com zoom de 200%.
- O instalador não tem assinatura digital; o Windows pode mostrar SmartScreen.
- Áudio e vibração foram conferidos por código e pelas opções; vibração não existe no navegador de teste.
- A publicação (site e GitHub) não faz parte desta rodada.
