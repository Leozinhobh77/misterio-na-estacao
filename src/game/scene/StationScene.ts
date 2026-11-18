import Phaser from 'phaser';
import { phases } from '../content/phases';
import type { Clue } from '../state/types';
export class StationScene extends Phaser.Scene {
  private points: { clue: Clue; object: Phaser.GameObjects.Container }[] = [];
  private phaseIndex = 0;
  constructor() { super('Station'); }
  create() { this.scale.on('resize', () => this.paint()); this.paint(); }
  setPhase(index: number, found: string[]) { this.phaseIndex = index; this.paint(found); }
  paint(found: string[] = []) {
    const { width, height } = this.scale;
    this.children.removeAll();
    this.points = [];
    const g = this.add.graphics();
    const bg = [0x111f2c, 0x172c32, 0x15212b, 0x202629, 0x191f2b][this.phaseIndex] ?? 0x111f2c;
    const floor = [0x293e46, 0x34454a, 0x303b40, 0x383a37, 0x30303a][this.phaseIndex] ?? 0x293e46;
    g.fillGradientStyle(bg, bg, 0x243644, 0x182933, 1); g.fillRect(0, 0, width, height);
    g.fillStyle(0xf0c478, .12); g.fillCircle(width * .79, height * .23, Math.min(width, height) * .22);
    g.fillStyle(floor, 1); g.fillRect(0, height * .69, width, height * .31);
    g.lineStyle(2, 0xc9ad7c, .23);
    for (let i = 0; i < 9; i++) g.lineBetween(width * .08, height * .69 + i * 4, width * .92, height * .69 + i * 4);
    // Original geometric room art: station architecture is drawn at runtime, no third-party assets.
    g.fillStyle(0x0a121b, .62); g.fillRoundedRect(width * .05, height * .11, width * .9, height * .54, 10);
    g.lineStyle(3, 0x75868a, .4); g.strokeRoundedRect(width * .05, height * .11, width * .9, height * .54, 10);
    const n = this.phaseIndex;
    if (n === 0) {
      g.fillStyle(0x394950, 1); g.fillRoundedRect(width * .36, height * .18, width * .4, height * .28, 6);
      for (let i=0;i<4;i++){g.fillStyle(i===1?0xe2b86e:0x1b2d35, .95);g.fillRect(width*(.39+i*.085),height*.22,width*.068,height*.19);}
      g.fillStyle(0x382f2a, 1); g.fillRoundedRect(width*.07,height*.4,width*.84,height*.17,8);
      g.fillStyle(0x1d272a,1);g.fillCircle(width*.19,height*.34,Math.min(width,height)*.058);g.lineStyle(4,0xe5bf7c,.9);g.strokeCircle(width*.19,height*.34,Math.min(width,height)*.052);
      g.fillStyle(0xd9cba8,1);g.fillRoundedRect(width*.75,height*.52,width*.13,height*.08,3);
    } else if (n === 1) {
      g.fillStyle(0xcbbd9e,.95);g.fillRoundedRect(width*.17,height*.18,width*.43,height*.4,6);g.lineStyle(4,0x755f49,.85);g.strokeRoundedRect(width*.17,height*.18,width*.43,height*.4,6);
      g.lineStyle(3,0x4d7770,.95);g.lineBetween(width*.22,height*.3,width*.5,height*.27);g.lineBetween(width*.28,height*.45,width*.51,height*.33);g.lineBetween(width*.33,height*.51,width*.52,height*.38);
      g.fillStyle(0x4e5b58,1);g.fillRoundedRect(width*.66,height*.23,width*.22,height*.31,6);g.lineStyle(2,0xe1c483,.75);g.strokeRect(width*.7,height*.28,width*.14,height*.2);
      for(let i=0;i<5;i++){g.fillStyle(0x9a8065,.5);g.fillCircle(width*(.18+i*.15),height*(.68+(i%2)*.04),5);}
    } else if (n === 2) {
      g.fillStyle(0x283539,1);g.fillRoundedRect(width*.19,height*.18,width*.62,height*.43,8);g.lineStyle(2,0x718985,.7);g.strokeRoundedRect(width*.19,height*.18,width*.62,height*.43,8);
      for(let row=0;row<2;row++)for(let col=0;col<4;col++){g.fillStyle((row+col)%3===0?0xc08b4b:0x425b58,1);g.fillRoundedRect(width*(.23+col*.14),height*(.23+row*.17),width*.105,height*.12,4);}
      g.fillStyle(0xd9cba8,1);g.fillRoundedRect(width*.3,height*.64,width*.38,height*.09,4);g.lineStyle(3,0x7d8a7d,1);g.strokeRect(width*.35,height*.67,width*.28,height*.03);
    } else if (n === 3) {
      for(let i=0;i<4;i++){g.fillStyle(i===2?0x665441:0x49483f,1);g.fillRoundedRect(width*(.09+i*.21),height*.27,width*.17,height*.35,7);g.lineStyle(2,0x9d8564,.65);g.strokeRoundedRect(width*(.09+i*.21),height*.27,width*.17,height*.35,7);g.fillStyle(0x192328,1);g.fillRoundedRect(width*(.12+i*.21),height*.35,width*.11,height*.13,4);g.fillStyle(0xc7a66f,.9);g.fillCircle(width*(.23+i*.21),height*.5,4);}
      g.fillStyle(0xbcb39e,1);g.fillRoundedRect(width*.39,height*.53,width*.19,height*.12,4);g.lineStyle(3,0x735e46,.9);g.strokeRect(width*.43,height*.56,width*.11,height*.06);
    } else {
      g.fillStyle(0x4a423d,1);g.fillRoundedRect(width*.15,height*.4,width*.7,height*.25,8);g.fillStyle(0xd3c6a8,1);g.fillRoundedRect(width*.24,height*.2,width*.31,height*.25,4);
      for(let i=0;i<4;i++){g.fillStyle(0xb7a583,.9);g.fillRect(width*(.27+i*.065),height*.24,width*.052,height*.17);}
      g.fillStyle(0x242e33,1);g.fillRoundedRect(width*.63,height*.19,width*.2,height*.39,5);g.lineStyle(2,0xc9ad7c,.8);g.strokeRoundedRect(width*.63,height*.19,width*.2,height*.39,5);
    }
    const clues = phases[this.phaseIndex]?.clues ?? [];
    clues.forEach((clue, i) => {
      const x = width * clue.x, y = height * clue.y;
      const color = found.includes(clue.id) ? 0x88b29b : 0xe7bd76;
      const ring = this.add.graphics(); ring.lineStyle(2, color, .85); ring.strokeCircle(x,y,20); ring.fillStyle(color,.13); ring.fillCircle(x,y,19);
      const label = this.add.text(x, y, String(i+1), {fontFamily:'Arial',fontSize:'14px',fontStyle:'bold',color:'#f7efd9'}).setOrigin(.5);
      const hit = this.add.zone(x,y,48,48).setInteractive({useHandCursor:true});
      hit.on('pointerdown', () => this.game.events.emit('inspect-clue', clue.id));
      const container=this.add.container(0,0,[ring,label,hit]); this.points.push({clue,object:container});
    });
  }
}

