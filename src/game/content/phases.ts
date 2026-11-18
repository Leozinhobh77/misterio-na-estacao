import type { Phase } from '../state/types';
import { platformPhase } from './phases/f01-plataforma';
import { lobbyPhase } from './phases/f02-saguao';
import { controlPhase } from './phases/f03-controle';
import { baggagePhase } from './phases/f04-deposito';
import { chiefCabinPhase } from './phases/f05-cabine';

export const phases: Phase[] = [platformPhase, lobbyPhase, controlPhase, baggagePhase, chiefCabinPhase];
