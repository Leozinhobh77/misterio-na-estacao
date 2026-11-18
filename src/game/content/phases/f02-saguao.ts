import type { Phase } from '../../state/types';

export const lobbyPhase: Phase = { name: 'Saguão', place: 'SAGUÃO CENTRAL · MAPA DE SERVIÇO', objective: 'Reconstrua a rota que leva à sala de controle.', ambience: 'relógio distante e sopro leve', intro: 'O mapa da estação foi rasgado em três partes. As marcas no piso e o quadro de horários ajudam a recompor o trajeto.', visual: 1,
    clues: [
      { id: 'map', title: 'Mapa rasgado', text: 'As partes se encaixam: a passagem lateral segue atrás do balcão de bagagens e termina na sala de controle.', x: .24, y: .52, icon: '▧' },
      { id: 'schedule', title: 'Quadro de horários', text: 'Uma anotação a lápis mostra uma parada breve às 23h17, no lado norte do saguão.', x: .69, y: .3, icon: '▤' },
      { id: 'footprints', title: 'Marcas no piso', text: 'Marcas de rodas seguem do lado norte até a porta de serviço. Não há sinais de pressa ou luta.', x: .56, y: .76, icon: '⌁' },
      { id: 'service-door', title: 'Porta de serviço', text: 'A porta foi aberta com uma chave comum. Há uma placa indicando o caminho interno para a sala de controle.', x: .86, y: .57, icon: '▯' },
    ], puzzle: 'Por onde Helena seguiu depois da plataforma?', hint: ['Veja onde terminam as marcas de rodas.', 'O mapa liga o balcão de bagagens à sala de controle.', 'A rota passa pela porta de serviço no lado norte.'], choices: [
      { text: 'Pela porta de serviço no lado norte, atrás do balcão.', correct: true, why: 'O mapa e as marcas no piso mostram a mesma passagem até a sala de controle.' },
      { text: 'Pelo portão principal, atravessando o saguão.', correct: false, why: 'O mapa aponta uma passagem interna, e as marcas terminam na porta de serviço.' },
      { text: 'Pela saída para os trilhos.', correct: false, why: 'A rota desenhada segue para dentro da estação, não para os trilhos.' },
    ] };
