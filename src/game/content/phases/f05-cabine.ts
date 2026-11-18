import type { Phase } from '../../state/types';

export const chiefCabinPhase: Phase = { name: 'Cabine do Chefe', place: 'CABINE DO CHEFE · ARQUIVO FINAL', objective: 'Reúna as provas e reconstrua a história de Helena.', ambience: 'motivo musical calmo, notas espaçadas', intro: 'A última sala está aberta. O diário reúne o horário, a rota, o registro e a carta. Agora é possível explicar o que aconteceu.', visual: 4,
    clues: [
      { id: 'chief-desk', title: 'Mesa de Helena', text: 'A mesa está organizada para a manhã seguinte. Não há sinal de luta ou de saída apressada.', x: .27, y: .62, icon: '▤' },
      { id: 'archive-file', title: 'Arquivo histórico', text: 'O arquivo foi catalogado e deixado para a comunidade. A carta pede que seja aberto na reunião da manhã.', x: .7, y: .34, icon: '▣' },
      { id: 'departure-note', title: 'Nota de partida', text: 'O horário da nota coincide com o último trem: 23h17. A passagem é válida para a cidade vizinha.', x: .76, y: .72, icon: '✉' },
      { id: 'community-seal', title: 'Selo da comunidade', text: 'Um selo da associação local aparece no envelope do arquivo. Helena queria que a história fosse compartilhada.', x: .44, y: .34, icon: '✳' },
    ], puzzle: 'Qual explicação reúne melhor todas as evidências?', hint: ['Releia o bilhete, o registro e a carta.', 'O registro mostra uma saída planejada; a carta confirma que ela estava segura.', 'Helena partiu voluntariamente no último trem e deixou o arquivo histórico para a comunidade.'], choices: [
      { text: 'Helena partiu em segurança no último trem e deixou o arquivo para a comunidade.', correct: true, why: 'Horário, rota, registro e carta confirmam uma partida voluntária e segura.' },
      { text: 'Helena sofreu um acidente na sala de controle.', correct: false, why: 'Não há sinal de falha ou acidente; a carta explica a viagem e o arquivo.' },
      { text: 'Alguém levou Helena contra a vontade e escondeu as provas.', correct: false, why: 'As evidências mostram uma viagem planejada por Helena, sem violência.' },
    ] };
