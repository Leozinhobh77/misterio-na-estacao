import type { Prefs, Save } from './types';

/** Small explicit state boundary used by the UI; state remains local to this tab. */
export class GameStore {
  readonly state: Save;
  private readonly cluesByPhase: string[][];
  constructor(state: Save, cluesByPhase: string[][]) { this.state = state; this.cluesByPhase = cluesByPhase; }

  collectClue(id: string): boolean {
    if (this.state.clues.includes(id)) return false;
    this.state.clues.push(id);
    return true;
  }

  recordMistake(): void {
    this.state.mistakes[this.state.phase] = (this.state.mistakes[this.state.phase] ?? 0) + 1;
  }

  completePhase(): boolean {
    const current = this.state.phase;
    this.state.completed = [...new Set([...this.state.completed, current])];
    if (current >= this.cluesByPhase.length - 1) {
      this.state.won = true;
      return true;
    }
    this.state.phase = current + 1;
    return false;
  }

  restartPhase(): void {
    const keep = new Set(this.cluesByPhase.slice(0, this.state.phase).flat());
    this.state.clues = this.state.clues.filter(id => keep.has(id));
    this.state.completed = this.state.completed.filter(index => index < this.state.phase);
    this.state.mistakes[this.state.phase] = 0;
    this.state.won = false;
  }

  restartCampaign(): void {
    const prefs: Prefs = { ...this.state.prefs };
    Object.assign(this.state, { version: 1, phase: 0, clues: [], completed: [], mistakes: Array(this.cluesByPhase.length).fill(0), won: false, prefs });
  }

  updatePreference<K extends keyof Prefs>(key: K, value: Prefs[K]): void {
    this.state.prefs[key] = value;
  }
}
