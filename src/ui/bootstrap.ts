import Phaser from 'phaser';
import { phases } from '../game/content/phases';
import { AudioEngine } from '../game/audio/AudioEngine';
import { StationScene } from '../game/scene/StationScene';
import { loadGameData, persistGameData } from '../game/save/storage';
import { GameStore } from '../game/state/store';
import { attemptFeedback, validateAttempt } from '../game/puzzle/validate';
import type { Clue, Prefs, Save } from '../game/state/types';
import '../style.css';

export function bootstrap() {
const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <div class="grain" aria-hidden="true"></div>
  <header class="topbar"><a class="brand" href="#inicio" aria-label="Mistério na Estação — início"><span class="brand-mark">✳</span><span>MISTÉRIO <i>NA ESTAÇÃO</i></span></a><div class="top-actions"><span class="age-tag">AVENTURA · 13+</span><button class="icon-button" id="sound-toggle" aria-label="Silenciar áudio" title="Silenciar áudio">♫</button><button class="icon-button" id="settings-open" aria-label="Abrir opções">⚙</button></div></header>
  <main>
    <section id="home" class="home-screen screen" aria-labelledby="home-title"><div class="home-copy"><p class="eyebrow"><span class="live-dot"></span> ÚLTIMA CHAMADA · 23:17</p><h1 id="home-title">O último trem<br><em>deixou uma pista.</em></h1><p class="intro">Helena Duarte desapareceu na noite do último trem. Siga os registros pela Estação Aurora e descubra por que ela partiu.</p><div class="home-buttons"><button class="button primary" id="new-game">Começar investigação <span>↗</span></button><button class="button secondary" id="continue-game" hidden>Continuar <span>→</span></button></div><div class="home-links"><button class="text-button" data-modal="manual">Como jogar ↗</button><button class="text-button" data-modal="credits">Créditos ↗</button></div><p class="privacy-note">PROGRESSO SALVO NESTE DISPOSITIVO</p></div><div class="home-illustration" aria-hidden="true"><div class="moon"></div><div class="home-clock">23:17</div><div class="home-sign">AURORA <small>ESTAÇÃO CENTRAL</small></div><div class="home-arches"><i></i><i></i><i></i></div><div class="home-platform"></div><div class="home-train"><i></i><i></i><i></i></div><span class="home-caption">LINHA 01 <b>·</b> ÚLTIMO TREM</span></div></section>
  <section id="game" class="game-screen" hidden aria-labelledby="phase-title"><aside class="progress-rail"><span class="rail-caption">SUA INVESTIGAÇÃO</span><ol id="phase-nav"></ol><div class="rail-save"><i></i><span id="save-label">SALVO NESTE DISPOSITIVO</span></div></aside><div class="game-content"><header class="game-heading"><div><p id="phase-kicker" class="eyebrow"></p><h1 id="phase-title" tabindex="-1"></h1><p id="phase-objective" class="objective"></p></div><div class="game-controls"><button class="button secondary small" id="journal-open">▤ <span>Diário</span></button><button class="button secondary small" id="hint-open">✧ <span>Dica</span></button><button class="button secondary small" id="pause-open">Ⅱ <span>Pausa</span></button></div></header><div class="play-layout"><section class="scene-wrap" aria-label="Ilustração da sala"><div id="phaser-host" aria-hidden="true"></div><p class="sr-only" id="scene-description">O cenário também pode ser explorado pelos botões Ponto de interesse abaixo.</p><div class="scene-label"><span id="scene-place"></span><span>TOQUE OU SELECIONE UM PONTO</span></div></section><section class="inspect-panel"><div class="panel-head"><span>PONTOS DE INTERESSE</span><span id="clue-progress">0 / 3</span></div><p id="phase-intro" class="phase-intro"></p><div id="clue-buttons" class="clue-buttons"></div><div id="selected-clue" class="selected-clue" aria-live="polite"><span class="selected-icon">✳</span><p>Escolha um ponto da sala para examinar. As informações importantes também ficam escritas no diário.</p></div><button class="button primary deduction-button" id="deduction-open" disabled>Resolver enigma <span>↗</span></button></section></div><section class="journal-strip"><div><span class="eyebrow">DIÁRIO DE INVESTIGAÇÃO</span><span id="journal-count">0 evidências encontradas</span></div><div id="journal-preview" class="journal-preview"><span>Nenhuma pista ainda. Examine os pontos da sala.</span></div><button class="text-button" id="journal-strip-open">Abrir diário ↗</button></section></div></section>
  </main>
  <footer class="global-footer"><span>ESTAÇÃO AURORA <b>·</b> 1987</span><span>UMA HISTÓRIA DE PARTIDA E MEMÓRIA</span></footer>
  <dialog id="modal" class="modal"><div class="modal-card"><button id="modal-close" class="icon-button modal-close" aria-label="Fechar janela">×</button><div id="modal-body"></div></div></dialog>
  <div id="toast" class="toast" role="status" aria-live="polite"></div>`;

for (const [selector,id] of [['#new-game','new-game'],['#continue-game','continue-game'],['#game','game-screen'],['#home','home-screen'],['#modal','modal'],['#phase-title','phase-title'],['#clue-buttons','clue-list'],['#journal-open','journal-open'],['#pause-open','pause-open'],['#settings-open','settings-open'],['#deduction-open','deduction-open'],['#toast','toast']] as const) app.querySelector(selector)?.setAttribute('data-testid',id);

const loaded = loadGameData();
const store = new GameStore(loaded.save, phases.map(p=>p.clues.map(c=>c.id)));
const save: Save = store.state;
let startupWarning = loaded.warning;
const modal = document.querySelector<HTMLDialogElement>('#modal')!;
const modalBody = document.querySelector<HTMLDivElement>('#modal-body')!;
const audio = new AudioEngine(save.prefs);
let game: Phaser.Game | null = null;
try {
  game = new Phaser.Game({ type: Phaser.CANVAS, parent: 'phaser-host', backgroundColor: '#111f2c', scale: { mode: Phaser.Scale.RESIZE, width: 960, height: 540, autoCenter: Phaser.Scale.CENTER_BOTH }, render: { antialias: true, pixelArt: false }, scene: [StationScene], input: { activePointers: 3 } });
} catch {
  const room=document.querySelector('.scene-wrap');room?.classList.add('scene-unavailable');
  const notice=document.createElement('p');notice.className='scene-error';notice.textContent='A ilustração não pôde ser carregada; use a lista de pontos ao lado.';room?.prepend(notice);
}
let toastTimer = 0;
let hintLevel = 0;
let modalReturnFocus: HTMLElement | null = null;
let audioPaused = false;

function persist() {
  const okay=persistGameData(save);
  document.querySelector('#save-label')!.textContent=okay?'SALVO NESTE DISPOSITIVO':'SOMENTE NESTA SESSÃO';
  if(!okay&&!startupWarning){startupWarning='O armazenamento está indisponível. O jogo continuará salvando apenas nesta sessão.';toast(startupWarning);}
  updateHome();
}
function toast(message:string) { const el=document.querySelector<HTMLDivElement>('#toast')!;el.textContent=message;el.classList.add('show');window.clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>el.classList.remove('show'),2600); }
function updateSoundToggle() { const btn=document.querySelector<HTMLButtonElement>('#sound-toggle')!;btn.textContent=save.prefs.muted?'♪':'♫';const label=save.prefs.muted?'Ativar áudio':'Silenciar áudio';btn.setAttribute('aria-label',label);btn.title=label; }
function motionReduced() { return save.prefs.reduceMotion==='on'||(save.prefs.reduceMotion==='system'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
function applyAccessibilitySettings() { document.documentElement.dataset.motion=motionReduced()?'reduce':'full';document.documentElement.style.setProperty('--text-scale',`${save.prefs.textScale}%`); }
function vibrate() { if(!save.prefs.vibration||motionReduced())return;try{navigator.vibrate?.(12);}catch{/* Unsupported devices keep visual feedback. */} }
function updateHome() { const btn=document.querySelector<HTMLButtonElement>('#continue-game')!;btn.hidden=save.clues.length===0&&!save.won; }
function showHome() { modal.close();document.querySelector<HTMLElement>('#home')!.hidden=false;document.querySelector<HTMLElement>('#game')!.hidden=true;updateHome(); }
function showGame() {
  document.querySelector<HTMLElement>('#home')!.hidden=true;document.querySelector<HTMLElement>('#game')!.hidden=false;
  game?.scale.refresh();
  if(save.won){showVictory();return;}
  paintPhase();
}
function paintPhase() {
  const p=phases[save.phase]; if(!p){showVictory();return;}
  document.querySelector('#phase-kicker')!.textContent=`FASE 0${save.phase+1} · ${p.place}`;
  document.querySelector('#phase-title')!.textContent=p.name;
  document.querySelector('#phase-objective')!.textContent=p.objective;
  document.querySelector('#phase-intro')!.textContent=p.intro;
  document.querySelector('#scene-place')!.textContent=p.place;
  const nav=document.querySelector<HTMLOListElement>('#phase-nav')!;
  nav.innerHTML=phases.map((phase,i)=>`<li class="${i===save.phase?'current':''} ${save.completed.includes(i)?'done':''}"><span>${String(i+1).padStart(2,'0')}</span><div><b>${phase.name}</b><small>${save.completed.includes(i)?'Concluída':i===save.phase?'Em investigação':'Bloqueada'}</small></div>${save.completed.includes(i)?'<i>✓</i>':''}</li>`).join('');
  const found=save.clues.filter(id=>p.clues.some(c=>c.id===id));
  document.querySelector('#clue-progress')!.textContent=`${found.length} / ${p.clues.length}`;
  const buttons=document.querySelector<HTMLDivElement>('#clue-buttons')!;
  buttons.innerHTML=p.clues.map((c,i)=>`<button class="clue-button ${found.includes(c.id)?'found':''}" data-clue="${c.id}" aria-pressed="false"><span class="clue-index">${String(i+1).padStart(2,'0')}</span><span class="clue-icon">${c.icon}</span><span>${c.title}</span><span class="clue-state">${found.includes(c.id)?'✓':'＋'}</span></button>`).join('');
  buttons.querySelectorAll('[data-clue]').forEach((button,index)=>{button.setAttribute('data-testid','clue-button');button.setAttribute('aria-label',`Ponto ${index+1}: ${p.clues[index].title}${found.includes(p.clues[index].id)?', já investigado':', nova pista'}`);});
  buttons.querySelectorAll<HTMLButtonElement>('[data-clue]').forEach(btn=>btn.addEventListener('click',()=>inspect(btn.dataset.clue!)));
  document.querySelector<HTMLButtonElement>('#deduction-open')!.disabled=found.length<3;
  const last=found.slice(-2).map(id=>p.clues.find(c=>c.id===id)!.title);
  document.querySelector('#journal-count')!.textContent=`${save.clues.length} ${save.clues.length===1?'evidência encontrada':'evidências encontradas'}`;
  document.querySelector('#journal-preview')!.innerHTML=last.length?last.map(t=>`<span class="journal-chip">✳ ${t}</span>`).join(''):`<span>Nenhuma pista ainda. Examine os pontos da sala.</span>`;
  document.querySelector('#selected-clue')!.innerHTML='<span class="selected-icon">✳</span><p>Escolha um ponto da sala para examinar. As informações importantes também ficam escritas no diário.</p>';
  (game?.scene.getScene('Station') as StationScene | undefined)?.setPhase(save.phase, found);
  audio.setPhase(save.phase);
  requestAnimationFrame(()=>document.querySelector<HTMLElement>('#phase-title')?.focus());
  document.querySelector('#scene-place')!.setAttribute('aria-label', `${p.name}: ${found.length} de ${p.clues.length} pistas encontradas`);
}
function inspect(id:string) {
  const p=phases[save.phase], c=p.clues.find(x=>x.id===id);if(!c)return;
  const already=save.clues.includes(id);
  document.querySelector('#selected-clue')!.innerHTML=`<span class="selected-icon">${c.icon}</span><div><b>${c.title}${already?' · NO DIÁRIO':''}</b><p>${c.text}</p></div>`;
  audio.play(already?'hint':'clue'); if(!already){store.collectClue(id);persist();vibrate();paintPhase();document.querySelector('#selected-clue')!.innerHTML=`<span class="selected-icon">${c.icon}</span><div><b>${c.title} · PISTA REGISTRADA</b><p>${c.text}</p></div>`;toast(`Nova pista no diário: ${c.title}`);} else toast(c.title);
  document.querySelector<HTMLButtonElement>(`[data-clue="${id}"]`)?.setAttribute('aria-pressed','true');
}
function openModal(title:string, body:string, cls='') { modalBody.innerHTML=`<p class="modal-kicker">ESTAÇÃO AURORA · INVESTIGAÇÃO</p><h2 id="modal-title" tabindex="-1">${title}</h2>${body}`;modal.className=`modal ${cls}`;modal.dataset.modalKind=cls||'dialog';modalBody.dataset.testid=cls==='victory'?'victory':cls==='confirm'?'confirmation':'modal-content';modal.setAttribute('aria-labelledby','modal-title');if(!modal.open){modalReturnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;modal.showModal();}modalBody.querySelector<HTMLElement>('#modal-title')?.focus(); }
function closeModal(){if(modal.open)modal.close();}
function showManual() {
  openModal('Como jogar',`<p>Descubra por que Helena Duarte partiu na noite do último trem. A investigação tem cinco salas e não há cronômetro.</p><ol class="manual-list"><li>Escolha <b>Novo jogo</b> ou <b>Continuar</b> no menu.</li><li>Toque ou clique nos pontos marcados. No computador, use <b>Tab</b> para chegar aos controles e <b>Enter</b> ou <b>Espaço</b> para ativá-los.</li><li>Leia cada descoberta; pistas novas entram automaticamente no <b>Diário</b>. Examine pelo menos três objetos por sala.</li><li>Quando o botão <b>Resolver enigma</b> ficar ativo, relacione as pistas e escolha uma resposta. Uma tentativa errada explica o que ainda falta; você pode tentar de novo ou pedir <b>Dica</b>.</li><li>O jogo salva ao encontrar pistas e concluir salas. Use <b>Pausa</b> para continuar, ajustar opções ou reiniciar.</li><li>No final, escolha a explicação que reúne as evidências. Depois, veja os créditos, volte ao menu ou jogue novamente.</li></ol><p class="modal-note">O progresso fica neste dispositivo. Limpar os dados do navegador pode apagar o save.</p><button class="button primary modal-action" data-action="close">Voltar ao jogo</button>`,'wide');bindActions();}
function showCredits() { openModal('Créditos e licenças',`<p>Uma história original criada para este protótipo. Cenários, interface, texto e sinais sonoros são desenhados ou sintetizados pelo próprio jogo.</p><div class="credit-card"><b>Arte</b><span>Cenários geométricos vetoriais desenhados em Phaser, sem imagens externas.</span><b>Áudio</b><span>Tons e ambiente sintetizados localmente com Web Audio API; sem arquivos de áudio de terceiros.</span><b>Engine</b><span>Phaser 3 · TypeScript · Vite · Electron</span></div><p class="modal-note">Não há anúncios, contas, telemetria nem serviço remoto de progresso.</p><button class="button primary modal-action" data-action="credits-back">Voltar</button>`);bindActions();}
function showJournal() { const evidence=save.clues.map(id=>phases.flatMap(p=>p.clues).find(c=>c.id===id)).filter((c):c is Clue=>!!c);const grouped=phases.map((p,i)=>({p,i,items:evidence.filter(c=>p.clues.some(pc=>pc.id===c.id))})).filter(x=>x.items.length);openModal('Diário de investigação',`${grouped.length?grouped.map(({p,i,items})=>`<section class="journal-group"><h3>0${i+1} · ${p.name}</h3>${items.map(c=>`<article class="evidence-entry"><span>${c.icon}</span><div><b>${c.title}</b><p>${c.text}</p></div></article>`).join('')}</section>`).join(''):'<p>As pistas descobertas aparecem aqui. Examine os pontos marcados na sala.</p>'}<p class="modal-note">${save.clues.length} evidências registradas · progresso salvo neste dispositivo.</p><button class="button primary modal-action" data-action="close">Voltar à investigação</button>`,'wide');bindActions();}
function showHint() { hintLevel=Math.min(2,hintLevel+1);const hint=phases[save.phase].hint[hintLevel];audio.play('hint');openModal('Uma pista, no seu ritmo',`<div class="hint-card"><span>✧</span><p>${hint}</p></div><p class="modal-note">Dicas não tiram pontos nem bloqueiam o final.</p><div class="modal-actions"><button class="button secondary" data-action="close">Voltar</button>${hintLevel<2?'<button class="button primary" data-action="hint">Outra dica</button>':''}</div>`);bindActions();}
function showSettings() {
  const p = save.prefs;
  const vibrationSupported = typeof navigator.vibrate === 'function';
  openModal('Opções', `<div class="settings-list">
    <label class="range-row"><span>Música</span><input data-pref="music" aria-label="Volume da música" type="range" min="0" max="100" value="${p.music}"><output>${p.music}%</output></label>
    <label class="range-row"><span>Ambiente</span><input data-pref="ambience" aria-label="Volume do ambiente" type="range" min="0" max="100" value="${p.ambience}"><output>${p.ambience}%</output></label>
    <label class="range-row"><span>Efeitos</span><input data-pref="effects" aria-label="Volume dos efeitos" type="range" min="0" max="100" value="${p.effects}"><output>${p.effects}%</output></label>
    <label class="range-row"><span>Tamanho do texto</span><input data-pref="textScale" aria-label="Tamanho do texto" type="range" min="100" max="130" step="15" value="${p.textScale}"><output>${p.textScale}%</output></label>
    <label class="toggle-row"><span>Silenciar tudo</span><input data-pref="muted" type="checkbox" ${p.muted?'checked':''}><i></i></label>
    <label class="toggle-row"><span>Reduzir movimento</span><input data-pref="reduceMotion" type="checkbox" ${p.reduceMotion==='on'?'checked':''}><i></i></label>
    <label class="toggle-row"><span>Evitar flashes</span><input data-pref="avoidFlashes" type="checkbox" ${p.avoidFlashes?'checked':''}><i></i></label>
    <label class="toggle-row"><span>Vibração tátil</span><input data-pref="vibration" type="checkbox" ${p.vibration?'checked':''} ${vibrationSupported?'':'disabled'}><i></i></label>
  </div><p class="modal-note">${vibrationSupported?'A vibração é breve e opcional.':'Vibração indisponível neste dispositivo; os sinais visuais continuam ativos.'} Reduzir movimento desliga vibração. O áudio começa depois de uma interação sua.</p><button class="button primary modal-action" data-action="close">Aplicar e voltar</button>`);bindSettings();
}
function bindSettings() {
  modalBody.querySelectorAll<HTMLInputElement>('[data-pref]').forEach(input=>input.addEventListener('input',()=>{
    const key=input.dataset.pref as keyof Prefs;
    if(input.type==='range') {
      store.updatePreference(key,Number(input.value) as never);
      input.nextElementSibling!.textContent=`${input.value}%`;
    } else if(key==='reduceMotion') {
      store.updatePreference('reduceMotion',input.checked?'on':'off');
    } else if(key==='muted'||key==='vibration'||key==='avoidFlashes') {
      store.updatePreference(key,input.checked as never);
    }
    applyAccessibilitySettings();
    audio.setPrefs(save.prefs);
    updateSoundToggle();
    persist();
  }));
  bindActions();
}
function showDeduction() {
  const phaseIndex=save.phase;
  const p=phases[phaseIndex];
  const sequenceNames:Record<string,string>={
    central:'Sinal central',north:'Sinal norte',lateral:'Sinal lateral',
    letter:'Carta de Helena',route:'Rota de serviço',time:'Horário do último trem',record:'Registro da linha liberada'
  };
  let time='', platform='', answer=-1, code='';
  let rotations=[0,0,0];
  let sequence=phaseIndex===2?['central','north','lateral']:['letter','route','time','record'];
  const choices=(items:{text:string}[])=>`<div class="choice-list">${items.map((c,i)=>`<button class="choice-button" data-answer="${i}"><span class="choice-index">0${i+1}</span><span>${c.text}</span></button>`).join('')}</div>`;
  const sequenceMarkup=()=>`<div class="sequence-list">${sequence.map((id,index)=>`<div class="sequence-row"><span class="sequence-position">0${index+1}</span><span>${sequenceNames[id]}</span><button class="move-button" data-move="up" data-index="${index}" aria-label="Mover ${sequenceNames[id]} para cima" ${index===0?'disabled':''}>↑</button><button class="move-button" data-move="down" data-index="${index}" aria-label="Mover ${sequenceNames[id]} para baixo" ${index===sequence.length-1?'disabled':''}>↓</button></div>`).join('')}</div>`;
  let puzzle='';
  if(phaseIndex===0) puzzle=`<p>Compare os registros e complete os dois campos.</p><div class="answer-fields"><label>Horário<select id="answer-time"><option value="">Escolha o horário</option><option value="23:17">23h17</option><option value="23:47">23h47</option></select></label><label>Plataforma<select id="answer-platform"><option value="">Escolha a plataforma</option><option value="2">Plataforma 2</option><option value="1">Plataforma 1</option></select></label></div>`;
  else if(phaseIndex===1) puzzle=`<p>Gire cada trecho para que o caminho siga até a sala de controle. Depois, escolha a rota.</p><div class="rotation-list">${['Entrada norte','Passagem de serviço','Sala de controle'].map((label,i)=>`<button class="rotate-piece" data-rotate="${i}"><span class="rotation-arrow">↗</span><span>${label}</span><b data-angle="${i}">0°</b><small>Girar 90°</small></button>`).join('')}</div><h3 class="step-heading">Rota encontrada</h3>${choices(p.choices)}`;
  else if(phaseIndex===2) puzzle=`<p>Coloque os sinais na ordem anotada no livro. Use as setas para mover os itens.</p><div id="sequence-list">${sequenceMarkup()}</div>`;
  else if(phaseIndex===3) puzzle=`<p>A etiqueta e o bilhete dão o código de três números para a mala.</p><label class="code-field">Código da mala<input id="case-code" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="3" autocomplete="off" placeholder="•••" aria-label="Código da mala, três números"></label>`;
  else puzzle=`<p>Ordene os quatro elos pela sequência da investigação e escolha a explicação que eles sustentam.</p><div id="sequence-list">${sequenceMarkup()}</div>${choices(p.choices)}`;
  openModal(p.puzzle,`${puzzle}<p id="deduction-feedback" class="deduction-feedback" role="status" aria-live="polite">${phaseIndex===0?'Escolha o horário e a plataforma.':'Confira sua resposta quando estiver pronto.'}</p><div class="modal-actions"><button class="button secondary" data-action="close">Voltar</button><button class="button primary" id="confirm-deduction">Conferir ↗</button></div>`,'wide');

  const updateSequence=()=>{const host=modalBody.querySelector('#sequence-list');if(host)host.innerHTML=sequenceMarkup();bindSequence();};
  const bindSequence=()=>modalBody.querySelectorAll<HTMLButtonElement>('[data-move]').forEach(btn=>btn.addEventListener('click',()=>{const i=Number(btn.dataset.index),j=btn.dataset.move==='up'?i-1:i+1;if(j<0||j>=sequence.length)return;[sequence[i],sequence[j]]=[sequence[j],sequence[i]];updateSequence();}));
  bindSequence();
  modalBody.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>{answer=Number(btn.dataset.answer);modalBody.querySelectorAll('[data-answer]').forEach(b=>b.classList.toggle('selected',b===btn));}));
  modalBody.querySelectorAll<HTMLButtonElement>('[data-rotate]').forEach(btn=>btn.addEventListener('click',()=>{const i=Number(btn.dataset.rotate);rotations[i]=(rotations[i]+90)%360;btn.querySelector('[data-angle]')!.textContent=`${rotations[i]}°`;btn.querySelector('.rotation-arrow')!.setAttribute('style',`transform:rotate(${rotations[i]}deg)`);}));
  modalBody.querySelector('#answer-time')?.addEventListener('change',e=>time=(e.currentTarget as HTMLSelectElement).value);
  modalBody.querySelector('#answer-platform')?.addEventListener('change',e=>platform=(e.currentTarget as HTMLSelectElement).value);
  modalBody.querySelector('#case-code')?.addEventListener('input',e=>code=(e.currentTarget as HTMLInputElement).value.replace(/\D/g,'').slice(0,3));
  modalBody.querySelector('#confirm-deduction')!.addEventListener('click',()=>{
    const attempt={time,platform,rotations,route:answer,sequence,code,answer};
    const correct=validateAttempt(phaseIndex,attempt);
    const explanation=attemptFeedback(phaseIndex,attempt);
    if(!correct){store.recordMistake();persist();audio.play('bad');const count=save.mistakes[phaseIndex]??0;modalBody.querySelector('#deduction-feedback')!.innerHTML=`${explanation}${count>=3?' <button class="inline-hint" data-action="hint">Pedir uma dica ↗</button>':''}`;bindActions();return;}
    audio.play(phaseIndex===4?'win':'good');vibrate();const previous=save.phase;const campaignWon=store.completePhase();persist();if(campaignWon){showVictory();return;}closeModal();hintLevel=0;paintPhase();openModal(`Fase concluída · ${phases[previous].name}`,`<div class="phase-clear"><span>✦</span><p>${phaseIndex===0?'Horário e plataforma confirmados.':phaseIndex===1?'Mapa reconstruído: a rota passa pela porta de serviço.':phaseIndex===2?'Sequência correta: norte, lateral, central.':explanation}</p></div><p>As pistas foram registradas. A próxima sala está aberta.</p><div class="modal-actions"><button class="button secondary" data-action="journal">Revisar diário</button><button class="button primary" data-action="next">Continuar ↗</button></div>`);bindActions();
  });
  bindActions();
}
function showVictory(){document.querySelector<HTMLElement>('#home')!.hidden=true;document.querySelector<HTMLElement>('#game')!.hidden=true;audio.play('win');openModal('A história encontrou seu caminho',`<div class="victory-mark">✳</div><p>Helena partiu em segurança no último trem e deixou o arquivo histórico para a comunidade. O plantão não conhecia seu plano, mas a carta, o registro e a passagem contam a mesma história.</p><p>A manhã chegou à Estação Aurora. O arquivo será aberto para todos.</p><div class="modal-actions"><button class="button secondary" data-action="credits">Créditos</button><button class="button secondary" data-action="home">Menu inicial</button><button class="button primary" data-action="replay">Jogar novamente ↗</button></div>`,'victory');bindActions();}
function showPause(){audio.pause();audioPaused=true;openModal('Investigação pausada',`<p>Seu progresso está salvo neste dispositivo.</p><div class="pause-actions"><button class="button primary" data-action="resume">Continuar investigação ↗</button><button class="button secondary" data-action="settings">Opções</button><button class="button secondary" data-action="restart-phase">Reiniciar fase</button><button class="button secondary" data-action="restart-campaign">Reiniciar campanha</button><button class="button quiet" data-action="home-confirm">Voltar ao menu</button></div>`);bindActions();}
function confirm(title:string, message:string, yes:()=>void, cancel:()=>void=closeModal){openModal(title,`<p>${message}</p><div class="modal-actions"><button class="button secondary" id="confirm-cancel" data-testid="confirm-cancel">Cancelar</button><button class="button danger" id="confirm-yes" data-testid="confirm-yes">Confirmar</button></div>`,'confirm');const cancelButton=modalBody.querySelector<HTMLButtonElement>('#confirm-cancel')!;modalBody.querySelector('#confirm-yes')!.addEventListener('click',yes);cancelButton.addEventListener('click',cancel);requestAnimationFrame(()=>cancelButton.focus());}
function bindActions() {
  modalBody.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(btn=>btn.addEventListener('click',()=>{
    const action=btn.dataset.action;
    switch(action) {
      case 'close': closeModal(); break;
      case 'resume': audio.resume();audioPaused=false;closeModal(); break;
      case 'settings': showSettings(); break;
      case 'journal': showJournal(); break;
      case 'hint': showHint(); break;
      case 'next': closeModal(); break;
      case 'home': closeModal(); showHome(); break;
      case 'credits': showCredits(); break;
      case 'credits-back': if(document.querySelector<HTMLElement>('#home')!.hidden && document.querySelector<HTMLElement>('#game')!.hidden) showVictory(); else closeModal(); break;
      case 'replay': confirm('Começar outra investigação?','Uma nova campanha apaga as pistas da campanha concluída. Suas opções de acessibilidade permanecem.',()=>{store.restartCampaign();persist();closeModal();showGame();},showVictory); break;
      case 'restart-phase': confirm('Reiniciar esta fase?','As pistas desta fase e das seguintes serão removidas. As fases anteriores e suas opções continuam salvas.',()=>{store.restartPhase();persist();closeModal();paintPhase();}); break;
      case 'restart-campaign': confirm('Reiniciar a campanha?','Todas as pistas e fases concluídas serão apagadas. Suas opções de áudio e acessibilidade permanecem.',()=>{store.restartCampaign();persist();closeModal();showGame();}); break;
      case 'home-confirm': confirm('Voltar ao menu?','Seu progresso atual está salvo e poderá ser retomado pelo botão Continuar.',()=>{closeModal();showHome();}); break;
      default: break;
    }
  }));
}
document.querySelector('#new-game')!.addEventListener('click',()=>{if(save.clues.length||save.won){confirm('Começar uma nova investigação?','A campanha atual será substituída. As opções de áudio e acessibilidade permanecem.',()=>{store.restartCampaign();persist();audio.setPrefs(save.prefs);closeModal();showGame();});}else{persist();showGame();}});
document.querySelector('#continue-game')!.addEventListener('click',()=>showGame());
document.querySelector('#journal-open')!.addEventListener('click',showJournal);document.querySelector('#journal-strip-open')!.addEventListener('click',showJournal);
document.querySelector('#hint-open')!.addEventListener('click',showHint);document.querySelector('#pause-open')!.addEventListener('click',showPause);document.querySelector('#deduction-open')!.addEventListener('click',showDeduction);document.querySelector('#settings-open')!.addEventListener('click',showSettings);
document.querySelector('#sound-toggle')!.addEventListener('click',()=>{save.prefs.muted=!save.prefs.muted;audio.setPrefs(save.prefs);persist();updateSoundToggle();toast(save.prefs.muted?'Áudio silenciado':'Áudio ativado');});
document.querySelectorAll('[data-modal="manual"]').forEach(e=>e.addEventListener('click',showManual));document.querySelectorAll('[data-modal="credits"]').forEach(e=>e.addEventListener('click',showCredits));
document.querySelector('#modal-close')!.addEventListener('click',closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});modal.addEventListener('close',()=>{if(audioPaused&&!modal.open){audio.resume();audioPaused=false;}const target=modalReturnFocus;modalReturnFocus=null;if(target?.isConnected)requestAnimationFrame(()=>target.focus());if(document.querySelector<HTMLElement>('#home')!.hidden&&document.querySelector<HTMLElement>('#game')!.hidden)showHome();});
document.querySelector('.brand')!.addEventListener('click',e=>{e.preventDefault();showHome();});
game?.events.on('inspect-clue',(id:string)=>inspect(id));
window.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();if(modal.open)closeModal();else if(!document.querySelector<HTMLElement>('#game')!.hidden)showPause();}});
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',()=>{if(save.prefs.reduceMotion==='system')applyAccessibilitySettings();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){audio.pause();audioPaused=true;}else if(!modal.open){audio.resume();audioPaused=false;}});
window.addEventListener('pagehide',()=>persist());
applyAccessibilitySettings();
updateSoundToggle();
updateHome();
if(startupWarning)toast(startupWarning);

}
