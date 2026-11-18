# Assets e licenças

O protótipo usa conteúdo original gerado localmente:

- Cenários e pontos visuais: formas vetoriais desenhadas por Phaser em `src/game/scene/StationScene.ts`.
- Interface, texturas e movimentos: HTML/CSS em `src/ui/bootstrap.ts` e `src/style.css`; a textura de grão é gerada com CSS.
- Áudio: tons musicais, ambiente e efeitos sintetizados em `src/game/audio/AudioEngine.ts` pela Web Audio API. Não há gravações ou loops de terceiros.
- Texto, pistas e narrativa: conteúdo tipado em `src/game/content/phases/`.
- Fontes: pilhas do sistema; nenhum arquivo de fonte é baixado.

Phaser 3, TypeScript, Vite, Electron, electron-builder, concurrently, wait-on e Vitest são dependências de terceiros. As versões instaladas e licenças declaradas estão no `package-lock.json` e nos pacotes correspondentes. Este repositório aplica a licença MIT ao código e à documentação próprios; a licença de cada dependência continua valendo para aquele pacote.
