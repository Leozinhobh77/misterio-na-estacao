import type { Prefs } from '../state/types';
export class AudioEngine {
  private ctx: AudioContext | null = null; private musicGain?: GainNode; private fxGain?: GainNode; private ambienceGain?: GainNode; private ambient?: OscillatorNode; private motif?: OscillatorNode;
  private prefs: Prefs;
  constructor(prefs: Prefs) { this.prefs = prefs; }
  private start() {
    if (this.ctx) { void this.ctx.resume(); return; }
    const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx(); this.musicGain=this.ctx.createGain(); this.fxGain=this.ctx.createGain(); this.ambienceGain=this.ctx.createGain();
    this.musicGain.connect(this.ctx.destination); this.fxGain.connect(this.ctx.destination); this.ambienceGain.connect(this.ctx.destination);
    this.ambient=this.ctx.createOscillator(); this.ambient.type='sine'; this.ambient.frequency.value=55; this.ambient.connect(this.ambienceGain); this.ambient.start();
    this.motif=this.ctx.createOscillator(); this.motif.type='triangle'; this.motif.frequency.value=110; this.motif.connect(this.musicGain); this.motif.start();
    this.apply();
  }
  apply() { if(!this.ctx)return; const now=this.ctx.currentTime; this.musicGain!.gain.setTargetAtTime(this.prefs.muted?0:this.prefs.music/100*.025,now,.2); this.ambienceGain!.gain.setTargetAtTime(this.prefs.muted?0:this.prefs.ambience/100*.055,now,.2); this.fxGain!.gain.setTargetAtTime(this.prefs.muted?0:this.prefs.effects/100*.075,now,.2); }
  setPrefs(prefs: Prefs) { this.prefs=prefs; this.apply(); }
  pause() { if(this.ctx?.state==='running')void this.ctx.suspend(); }
  resume() { if(this.ctx?.state==='suspended')void this.ctx.resume(); }
  play(kind: 'clue'|'good'|'bad'|'win'|'hint') {
    this.start(); if(!this.ctx||this.prefs.muted)return;
    const freqs=kind==='good'||kind==='win'?[440,554,659]:kind==='clue'?[660]:kind==='hint'?[494]:[220];
    freqs.forEach((freq,index)=>{const osc=this.ctx!.createOscillator(),gain=this.ctx!.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(0,this.ctx!.currentTime);gain.gain.linearRampToValueAtTime(.25,this.ctx!.currentTime+.025);gain.gain.exponentialRampToValueAtTime(.001,this.ctx!.currentTime+.24+index*.03);osc.connect(gain);gain.connect(this.fxGain!);osc.start();osc.stop(this.ctx!.currentTime+.28+index*.03);});
  }
  setPhase(index:number) { if(!this.ctx||!this.ambient||!this.motif)return;const roots=[55,65.4,73.4,82.4,98];this.ambient.frequency.setTargetAtTime(roots[index]??55,this.ctx.currentTime,.8);this.motif.frequency.setTargetAtTime((roots[index]??55)*2,this.ctx.currentTime,1.2); }
}

