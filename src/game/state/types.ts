export type Clue = { id: string; title: string; text: string; x: number; y: number; icon: string };
export type Phase = { name: string; place: string; objective: string; ambience: string; intro: string; clues: Clue[]; puzzle: string; hint: [string, string, string]; choices: { text: string; correct: boolean; why: string }[]; visual: number };
export type Prefs = { version: 2; music: number; ambience: number; effects: number; muted: boolean; vibration: boolean; reduceMotion: 'system' | 'on' | 'off'; avoidFlashes: boolean; textScale: 100 | 115 | 130 };
export type CampaignState = { version: 2; phase: number; clues: string[]; completed: number[]; mistakes: number[]; won: boolean };
/** Runtime view combining local campaign and preferences for the UI. */
export type Save = { version: 1; phase: number; clues: string[]; completed: number[]; mistakes: number[]; won: boolean; prefs: Prefs };
