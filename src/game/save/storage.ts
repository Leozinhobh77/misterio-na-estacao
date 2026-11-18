import { phases } from '../content/phases';
import type { CampaignState, Prefs, Save } from '../state/types';

const CAMPAIGN_KEY = 'misterio-estacao:campaign:v2';
const OPTIONS_KEY = 'misterio-estacao:options:v2';
const LEGACY_KEY = 'misterio-estacao-save-v1';
const CORRUPT_KEY = 'misterio-estacao:campaign:corrupt';
export const defaultPrefs: Prefs = { version: 2, music: 26, ambience: 30, effects: 48, muted: false, vibration: false, reduceMotion: 'system', avoidFlashes: true, textScale: 100 };
const emptyCampaign = (): CampaignState => ({ version: 2, phase: 0, clues: [], completed: [], mistakes: [0, 0, 0, 0, 0], won: false });
const memory = new Map<string, string>();
let persistent = true;

function read(key: string): string | null {
  if (persistent) try { const value = localStorage.getItem(key); if (value !== null) memory.set(key, value); return value; } catch { persistent = false; }
  return memory.get(key) ?? null;
}
function write(key: string, value: string): void {
  memory.set(key, value);
  if (persistent) try { localStorage.setItem(key, value); } catch { persistent = false; }
}
function copyCorrupt(raw: string) { write(CORRUPT_KEY, raw); }

function validCampaign(value: unknown): CampaignState | null {
  if (!value || typeof value !== 'object') return null;
  const c = value as Partial<CampaignState>;
  const known = new Set(phases.flatMap(p => p.clues.map(clue => clue.id)));
  if (c.version !== 2 || !Number.isInteger(c.phase) || c.phase! < 0 || c.phase! > 4 || !Array.isArray(c.clues) || !Array.isArray(c.completed) || !Array.isArray(c.mistakes)) return null;
  if (c.clues.some(id => typeof id !== 'string' || !known.has(id)) || c.completed.some(i => !Number.isInteger(i) || i < 0 || i > 4) || c.mistakes.length !== 5 || c.mistakes.some(n => !Number.isFinite(n) || n < 0)) return null;
  const completed = [...new Set(c.completed)];
  const won = c.won === true && completed.length === phases.length;
  return { version: 2, phase: c.phase!, clues: [...new Set(c.clues)], completed, mistakes: c.mistakes.map(Number), won };
}
function validPrefs(value: unknown): Prefs | null {
  if (!value || typeof value !== 'object') return null;
  const p = value as Partial<Prefs>;
  if (p.version !== 2 || typeof p.muted !== 'boolean' || typeof p.vibration !== 'boolean' || typeof p.avoidFlashes !== 'boolean' || !['system','on','off'].includes(p.reduceMotion as string) || ![100,115,130].includes(p.textScale as number)) return null;
  for (const n of [p.music, p.ambience, p.effects]) if (!Number.isFinite(n) || n! < 0 || n! > 100) return null;
  return { version: 2, music: p.music!, ambience: p.ambience!, effects: p.effects!, muted: p.muted, vibration: p.vibration, avoidFlashes: p.avoidFlashes, reduceMotion: p.reduceMotion!, textScale: p.textScale as Prefs['textScale'] };
}
function readJson(raw: string): unknown { try { return JSON.parse(raw); } catch { return null; } }
function asRuntime(c: CampaignState, p: Prefs): Save { return { version: 1, phase: c.phase, clues: c.clues, completed: c.completed, mistakes: c.mistakes, won: c.won, prefs: p }; }

export type LoadResult = { save: Save; warning: string; migrated: boolean; persistent: boolean };
export function loadGameData(): LoadResult {
  let warning = '', migrated = false;
  const campaignRaw = read(CAMPAIGN_KEY), optionsRaw = read(OPTIONS_KEY);
  let campaign: CampaignState | null = null, options: Prefs | null = null;
  if (campaignRaw) {
    campaign = validCampaign(readJson(campaignRaw));
    if (!campaign) { copyCorrupt(campaignRaw); warning = 'O progresso salvo não pôde ser lido. A cópia foi preservada; você pode começar uma nova campanha.'; }
  }
  if (optionsRaw) {
    options = validPrefs(readJson(optionsRaw));
    if (!options) { copyCorrupt(optionsRaw); warning ||= 'As opções salvas não puderam ser lidas. As opções padrão foram carregadas.'; }
  }
  if (!campaign && !campaignRaw) {
    const legacyRaw = read(LEGACY_KEY);
    if (legacyRaw) {
      const old = readJson(legacyRaw) as Partial<Save> | null;
      if (old && old.version === 1 && Number.isInteger(old.phase) && Array.isArray(old.clues) && Array.isArray(old.completed)) {
        const known = new Set(phases.flatMap(p => p.clues.map(c => c.id)));
        const clues = old.clues.filter((id): id is string => typeof id === 'string' && known.has(id));
        const completed = [...new Set(old.completed.filter((n): n is number => Number.isInteger(n) && n >= 0 && n < 5))];
        campaign = { version: 2, phase: Math.max(0, Math.min(4, old.phase!)), clues: [...new Set(clues)], completed, mistakes: Array.isArray(old.mistakes) && old.mistakes.length === 5 ? old.mistakes.map(n => Math.max(0, Number(n) || 0)) : [0,0,0,0,0], won: old.won === true && completed.length === phases.length };
        const legacy = old.prefs as Record<string, unknown> | undefined;
        if (!options) options = { ...defaultPrefs, music: clamp(legacy?.music, defaultPrefs.music), effects: clamp(legacy?.effects, defaultPrefs.effects), muted: legacy?.muted === true, vibration: legacy?.vibration === true, reduceMotion: legacy?.reduceMotion === true ? 'on' : 'system', avoidFlashes: legacy?.avoidFlashes !== false, textScale: [100,115,130].includes(Number(legacy?.textScale)) ? Number(legacy?.textScale) as Prefs['textScale'] : 100 };
        write(CAMPAIGN_KEY, JSON.stringify(campaign)); write(OPTIONS_KEY, JSON.stringify(options)); migrated = true;
      } else { copyCorrupt(legacyRaw); warning = 'O progresso anterior não pôde ser lido. A cópia foi preservada; você pode começar uma nova campanha.'; }
    }
  }
  campaign ??= emptyCampaign(); options ??= { ...defaultPrefs };
  return { save: asRuntime(campaign, options), warning: !persistent ? (warning || 'O armazenamento está indisponível. O jogo continuará salvando apenas nesta sessão.') : warning, migrated, persistent };
}
function clamp(value: unknown, fallback: number) { const n = Number(value); return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : fallback; }

export function persistGameData(save: Save): boolean {
  const { prefs, ...campaign } = save;
  write(CAMPAIGN_KEY, JSON.stringify({ ...campaign, version: 2 }));
  write(OPTIONS_KEY, JSON.stringify({ ...prefs, version: 2 }));
  return persistent;
}
export function storageKeys() { return { campaign: CAMPAIGN_KEY, options: OPTIONS_KEY, legacy: LEGACY_KEY, corrupt: CORRUPT_KEY }; }
