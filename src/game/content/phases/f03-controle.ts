import type { Phase } from '../../state/types';

export const controlPhase: Phase = { name: 'Sala de Controle', place: 'SALA DE CONTROLE · REGISTRO 23H17', objective: 'Interprete o registro e descubra por que a linha foi liberada.', ambience: 'zumbido discreto de relés', intro: 'O painel antigo ainda guarda o livro de ocorrências. Uma linha foi liberada às 23h17, mas será que foi uma falha?', visual: 2,
    clues: [
      { id: 'logbook', title: 'Livro de registros', text: 'Às 23h17, a linha lateral foi liberada manualmente. A anotação tem as iniciais H.D., de Helena Duarte.', x: .27, y: .72, icon: '▤' },
      { id: 'relay', title: 'Relé de sinal', text: 'O relé está intacto e sem marcas de curto. O registro de manutenção não aponta falha elétrica.', x: .73, y: .37, icon: '⌘' },
      { id: 'switches', title: 'Chaves do painel', text: 'A sequência anotada para liberar a linha é: norte, lateral, central. Ela aparece no mesmo horário do bilhete.', x: .53, y: .6, icon: '▥' },
      { id: 'master-key', title: 'Chave mestra', text: 'A chave está no gancho de manutenção. O livro diz que foi devolvida após abrir o depósito de bagagens.', x: .11, y: .3, icon: '⚿' },
    ], puzzle: 'O que explica a liberação da linha lateral?', hint: ['Leia o livro de registros e examine o relé.', 'A linha foi liberada manualmente; o relé não falhou.', 'As iniciais H.D. e o horário coincidem com o bilhete: foi uma ação deliberada.'], choices: [
      { text: 'Helena liberou a linha lateral às 23h17.', correct: true, why: 'O livro registra H.D. e o relé intacto descarta uma falha técnica.' },
      { text: 'Uma pane elétrica desligou a linha por acidente.', correct: false, why: 'O relé não tem sinais de falha e o registro descreve uma ação manual.' },
      { text: 'A linha foi liberada antes da chegada de Helena.', correct: false, why: 'O horário é 23h17, o mesmo do bilhete e do painel de partidas.' },
    ] };
