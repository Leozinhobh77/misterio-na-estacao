import type { Phase } from '../../state/types';

export const baggagePhase: Phase = { name: 'Depósito de Bagagens', place: 'ACHADOS E PERDIDOS · ARMÁRIO 217', objective: 'Relacione a etiqueta, a chave e a mala correta.', ambience: 'papel, madeira e fita suave', intro: 'As etiquetas estão fora de ordem. O livro de registros aponta uma mala específica e a chave mestra abre o armário.', visual: 3,
    clues: [
      { id: 'suitcase', title: 'Mala 217', text: 'O número coincide com a etiqueta do bilhete. A chave mestra abre a fechadura sem forçar.', x: .55, y: .62, icon: '▣' },
      { id: 'label', title: 'Etiqueta do armário', text: 'A etiqueta 217 está assinada por H.D. e corresponde à viagem para a cidade vizinha.', x: .79, y: .32, icon: '◇' },
      { id: 'letter', title: 'Carta de Helena', text: '“Vou em segurança. Deixei o arquivo histórico para a comunidade. Não contei ao plantão porque o anúncio precisava ser público.”', x: .34, y: .4, icon: '✉' },
      { id: 'archive-map', title: 'Mapa dobrado', text: 'Um mapa simples marca a cabine do chefe e o armário do arquivo que será aberto pela manhã.', x: .19, y: .73, icon: '▧' },
    ], puzzle: 'Qual mala guarda as evidências da viagem?', hint: ['Compare os números no bilhete e na etiqueta.', 'A mala 217 leva a carta e o mapa.', 'Use a chave mestra na mala 217: a carta confirma uma partida em segurança.'], choices: [
      { text: 'A mala 217, aberta com a chave mestra.', correct: true, why: 'O número está no bilhete, na etiqueta e no registro de bagagem.' },
      { text: 'A mala 127, que não tem etiqueta.', correct: false, why: 'O bilhete e a etiqueta têm o mesmo número: 217.' },
      { text: 'Nenhuma; a bagagem foi abandonada.', correct: false, why: 'A mala estava identificada e a carta explica por que foi deixada.' },
    ] };
