import type { Phase } from '../../state/types';

export const platformPhase: Phase = { name: 'Plataforma', place: 'PLATAFORMA 02 · 23H17', objective: 'Descubra o último horário e a plataforma usada por Helena.', ambience: 'vento e trilhos distantes', intro: 'A estação parece suspensa no tempo. O relógio parou, mas três registros podem contar quando Helena passou por aqui.', visual: 0,
    clues: [
      { id: 'clock', title: 'Relógio parado', text: 'Os ponteiros pararam às 23h17. A poeira ao redor indica que ele está assim desde aquela noite.', x: .19, y: .47, icon: '◷' },
      { id: 'board', title: 'Painel de partidas', text: 'A última linha foi anotada à mão: trem regional, plataforma 2, 23h17. O registro não foi apagado pelo tempo.', x: .52, y: .26, icon: '▤' },
      { id: 'ticket', title: 'Bilhete de Helena', text: 'O bilhete está validado para a cidade vizinha. No verso, Helena escreveu “último trem — 23h17”.', x: .77, y: .63, icon: '▧' },
      { id: 'luggage-tag', title: 'Etiqueta de bagagem', text: 'A etiqueta confirma uma mala despachada por Helena na mesma viagem. Ela tinha uma passagem válida naquela noite.', x: .36, y: .72, icon: '◇' },
    ], puzzle: 'Qual registro confirma a partida de Helena?', hint: ['Compare o relógio ao painel.', 'O bilhete também registra o último trem.', 'Relógio e bilhete apontam para 23h17; o painel marca a plataforma 2.'], choices: [
      { text: 'Helena partiu às 23h17, pela plataforma 2.', correct: true, why: 'O horário coincide no relógio e no bilhete; o painel confirma a plataforma.' },
      { text: 'Helena chegou às 23h47, pela plataforma 1.', correct: false, why: 'O relógio parado marca 23h17, e o bilhete menciona a plataforma 2.' },
      { text: 'O painel foi desligado antes da última viagem.', correct: false, why: 'O painel ainda preserva o registro manuscrito do último trem.' },
    ] };
