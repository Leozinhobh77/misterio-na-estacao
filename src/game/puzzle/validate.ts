export type PuzzleAttempt = {
  time?: string;
  platform?: string;
  rotations?: number[];
  route?: number;
  sequence?: string[];
  code?: string;
  answer?: number;
};

export function validateAttempt(phase: number, attempt: PuzzleAttempt): boolean {
  switch (phase) {
    case 0: return attempt.time === '23:17' && attempt.platform === '2';
    case 1: return attempt.rotations?.join(',') === '90,180,270' && attempt.route === 0;
    case 2: return attempt.sequence?.join(',') === 'north,lateral,central';
    case 3: return attempt.code === '217';
    case 4: return attempt.sequence?.join(',') === 'time,route,record,letter' && attempt.answer === 0;
    default: return false;
  }
}

export function attemptFeedback(phase: number, attempt: PuzzleAttempt): string {
  if (phase === 0) return 'O relógio, o bilhete e o painel marcam 23h17 na plataforma 2.';
  if (phase === 1 && attempt.rotations?.join(',') !== '90,180,270') return 'Alguns trechos ainda não apontam para a passagem de serviço. Gire cada parte e confira o mapa.';
  if (phase === 1) return 'A rota deve passar pelo lado norte e pela porta de serviço.';
  if (phase === 2) return 'O livro pede norte, lateral e central, nessa ordem.';
  if (phase === 3) return 'A etiqueta e o bilhete mostram o número 217.';
  if (phase === 4 && attempt.sequence?.join(',') !== 'time,route,record,letter') return 'Ordene os elos do horário até a carta final.';
  return 'A explicação precisa ligar a viagem, a saída e o arquivo.';
}
