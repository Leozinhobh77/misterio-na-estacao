import { describe, expect, it } from 'vitest';
import { phases } from '../../src/game/content/phases';
import { validateAttempt } from '../../src/game/puzzle/validate';
import { GameStore } from '../../src/game/state/store';
import type { Save } from '../../src/game/state/types';

const freshSave = (): Save => ({ version: 1, phase: 0, clues: [], completed: [], mistakes: [0,0,0,0,0], won: false, prefs: { version: 2, music: 26, ambience: 30, effects: 48, muted: false, vibration: false, reduceMotion: 'system', avoidFlashes: true, textScale: 100 } });

describe('conteúdo da campanha', () => {
  it('tem cinco fases, de três a cinco pontos e identificadores únicos', () => {
    expect(phases).toHaveLength(5);
    const ids = phases.flatMap(p => p.clues.map(c => c.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const phase of phases) {
      expect(phase.clues.length).toBeGreaterThanOrEqual(3);
      expect(phase.clues.length).toBeLessThanOrEqual(5);
      for (const clue of phase.clues) {
        expect(clue.x).toBeGreaterThanOrEqual(0); expect(clue.x).toBeLessThanOrEqual(1);
        expect(clue.y).toBeGreaterThanOrEqual(0); expect(clue.y).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe('enigmas por fase', () => {
  it('aceita a solução correta e recusa uma errada em cada fase', () => {
    const solved = [
      { time: '23:17', platform: '2' },
      { rotations: [90,180,270], route: 0 },
      { sequence: ['north','lateral','central'] },
      { code: '217' },
      { sequence: ['time','route','record','letter'], answer: 0 },
    ];
    solved.forEach((answer, phase) => expect(validateAttempt(phase, answer)).toBe(true));
    expect(validateAttempt(0, { time: '23:47', platform: '1' })).toBe(false);
    expect(validateAttempt(1, { rotations: [0,0,0], route: 0 })).toBe(false);
    expect(validateAttempt(2, { sequence: ['central','north','lateral'] })).toBe(false);
    expect(validateAttempt(3, { code: '127' })).toBe(false);
    expect(validateAttempt(4, { sequence: ['letter','time','route','record'], answer: 0 })).toBe(false);
  });
});

describe('progresso', () => {
  it('evita duplicar pistas e conclui fases em sequência', () => {
    const store = new GameStore(freshSave(), phases.map(p => p.clues.map(c => c.id)));
    expect(store.collectClue('clock')).toBe(true);
    expect(store.collectClue('clock')).toBe(false);
    expect(store.completePhase()).toBe(false);
    expect(store.state.phase).toBe(1);
    expect(store.state.completed).toEqual([0]);
  });

  it('reinicia só a fase atual e preserva opções; a última conclusão marca vitória', () => {
    const state = freshSave(); state.phase = 1; state.clues = ['clock','map','footprints']; state.completed = [0]; state.prefs.muted = true;
    const store = new GameStore(state, phases.map(p => p.clues.map(c => c.id)));
    store.restartPhase();
    expect(state.clues).toEqual(['clock']);
    expect(state.completed).toEqual([0]);
    expect(state.prefs.muted).toBe(true);
    state.phase = 4;
    expect(store.completePhase()).toBe(true);
    expect(state.won).toBe(true);
  });

  it('reinicia campanha sem apagar opções de áudio e acessibilidade', () => {
    const state = freshSave(); state.clues = ['clock']; state.prefs.textScale = 115; state.prefs.muted = true;
    const store = new GameStore(state, phases.map(p => p.clues.map(c => c.id)));
    store.restartCampaign();
    expect(state.phase).toBe(0); expect(state.clues).toEqual([]); expect(state.prefs.textScale).toBe(115); expect(state.prefs.muted).toBe(true);
  });
});
