
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Target, Zap, Bot, Trophy, Bomb, Globe, Hand, ShieldAlert, Cpu, RefreshCw, Users, Star, Gift, Clock, User, Fingerprint, ZapOff, Flame, ChevronLeft, Info, Code, TrendingUp, Sparkles, Sword, Volume2, VolumeX, Zap as Lightning, Crown, CheckCircle } from 'lucide-react';
import { SAVE_KEY, INITIAL_ENERGY, ENERGY_REGEN_PER_SEC, LEVELS, UPGRADES } from './constants.ts';

const CLOUD_API_URL = 'https://kvdb.io/T8i7Uu7WzU8Z5B3pE4X9R2/koonkoonak_final_v26_world_cup';

const t = {
  fa: {
    ops: "نبرد اصلی", rank: "جدول افتخار", crash: "انفجار هلو", gear: "بازارچه",
    power: "سود ساعتی", bullets: "نفس (انرژی)", taps: "امتیاز نفوذ",
    globalList: "استادان شلاق‌زنی جهان", soldiers: "آنلاین",
    fetching: "در حال مالیدن دیتا...", startAttack: "شروع نفوذ!",
    cashout: "بکش بیرون!", blown: "کونش پاره شد! 💥", saved: "سالم در رفتی! ✅",
    operationalLevel: "رتبه جهانی", manifesto: "مرامنامه نفوذ",
    arsenal: "زرادخانه", you: "شما", level: "لول", available: "بیا جایزه‌تو بگیر!",
    nextBonus: "جایزه بعدی:", creator: "طراح و مالک: سورنا",
    upgradeDesc: "قدرت شلاق‌زنی شما را بالا می‌برد.",
    maxed: "فول",
    aboutProject: "این بازی جنبه فان و شوخی دارد. هدف شلاق زدن به بدخواهان و حسودان مهدی است. محکم بزن!",
    comboText: "ناله پی در پی:", prizePool: "جوایز نقدی هفتگی برای نفرات برتر!"
  },
  en: {
    ops: "SPANK OPS", rank: "LEADERS", crash: "BUTT CRASH", gear: "MARKET",
    power: "PROFIT/H", bullets: "STAMINA", taps: "SCORE",
    globalList: "WORLD TOP SPANKERS", soldiers: "ONLINE",
    fetching: "FETCHING DATA...", startAttack: "START OPS!",
    cashout: "PULL OUT!", blown: "EXPLODED! 💥", saved: "SAFE ✅",
    operationalLevel: "RANK", manifesto: "ABOUT",
    arsenal: "ARSENAL", you: "YOU", level: "LVL", available: "CLAIM NOW!",
    nextBonus: "NEXT GIFT:", creator: "Owner: Sorena",
    upgradeDesc: "Boost your efficiency.",
    maxed: "MAXED",
    aboutProject: "Purely for fun!",
    comboText: "MOAN STREAK:", prizePool: "Weekly Prizes!"
  }
};

const App = () => {
  const [lang, setLang] = useState<'fa' | 'en'>(() => (localStorage.getItem('lang') as any) || 'fa');
  const [activeTab, setActiveTab] = useState('ops');
  const [jiggle, setJiggle] = useState(false);
  const [slapping, setSlapping] = useState(false);
  const [shake, setShake] = useState(false);
  const [combo, setCombo] = useState(0);
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('isMuted') === 'true');
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const [pops, setPops] = useState<{id: number, x: number, y: number, val: number, isCrit: boolean}[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);

  // ULTRA SEXY MOAN SYNTHESIS (Realistic Vocal Formants + Detune)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playSound = (type: 'slap' | 'moan') => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current!;
    if (ctx.state === 'suspended') ctx.resume();

    if (type === 'slap') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else {
      // FM + Subtractive Sexy Moan
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      
      const baseFreq = 140 + Math.random() * 40;
      osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc2.frequency.setValueAtTime(baseFreq + 1.5, ctx.currentTime); // Slight detune for thickness
      
      osc1.frequency.exponentialRampToValueAtTime(baseFreq - 50, ctx.currentTime + 0.8);
      osc2.frequency.exponentialRampToValueAtTime(baseFreq - 48.5, ctx.currentTime + 0.8);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.8);
      filter.Q.value = 5; // Resonant vocal feel
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.8);
      osc2.stop(ctx.currentTime + 0.8);
    }
  };

  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    const defaults = {
      id: Math.random().toString(36).substr(2, 8),
      balance: 0,
      energy: INITIAL_ENERGY,
      maxEnergy: INITIAL_ENERGY,
      tapValue: 1,
      autoPower: 0,
      critLevel: 0,
      regenLevel: 0,
      lastUpdate: Date.now(),
      lastBonusClaim: 0,
      username: 'Spanker_' + Math.floor(Math.random()*9999),
    };

    if (saved) {
      try {
        const p = JSON.parse(saved);
        const now = Date.now();
        const diff = Math.max(0, (now - (p.lastUpdate || now)) / 1000);
        const regenRate = ENERGY_REGEN_PER_SEC + (p.regenLevel || 0) * 3;
        return { ...defaults, ...p, 
          energy: Math.min(p.maxEnergy || INITIAL_ENERGY, (p.energy || 0) + (diff * regenRate)),
          balance: (p.balance || 0) + ((p.autoPower || 0) * diff),
          lastUpdate: now 
        };
      } catch (e) { return defaults; }
    }
    return defaults;
  });

  const currentLevel = useMemo(() => {
    const idx = LEVELS.reduce((acc, l, i) => (state.balance >= l.threshold ? i : acc), 0);
    return { ...LEVELS[idx], index: idx + 1 };
  }, [state.balance]);

  const levelProgress = useMemo(() => {
    const next = LEVELS[currentLevel.index];
    if (!next) return 100;
    const start = LEVELS[currentLevel.index - 1]?.threshold || 0;
    return Math.min(100, Math.max(0, ((state.balance - start) / (next.threshold - start)) * 100));
  }, [state.balance, currentLevel]);

  const syncGlobal = async (force = false) => {
    if (isSyncing && !force) return;
    setIsSyncing(true);
    try {
      const getRes = await fetch(`${CLOUD_API_URL}?r=${Math.random()}`);
      let data = getRes.ok ? await getRes.json() : [];
      if (!Array.isArray(data)) data = [];
      const me = { id: state.id, username: state.username, score: Math.floor(state.balance), level: currentLevel.index };
      const idx = data.findIndex((u: any) => u.id === state.id);
      if (idx > -1) { if (me.score >= data[idx].score) data[idx] = me; } else { data.push(me); }
      data.sort((a: any, b: any) => b.score - a.score);
      const topData = data.slice(0, 100);
      await fetch(CLOUD_API_URL, { method: 'POST', body: JSON.stringify(topData) });
      setLeaderboard(topData);
      setOnlineCount(Math.floor(Math.random() * 40) + 60);
    } catch (e) { console.error('Cloud Error'); } finally { setIsSyncing(false); }
  };

  useEffect(() => {
    const loop = setInterval(() => {
      const regenRate = ENERGY_REGEN_PER_SEC + (state.regenLevel || 0) * 3;
      setState(s => ({
        ...s,
        energy: Math.min(s.maxEnergy, s.energy + (regenRate / 10)),
        balance: s.balance + (s.autoPower / 10),
        lastUpdate: Date.now()
      }));
    }, 100);
    return () => clearInterval(loop);
  }, [state.regenLevel, state.autoPower]);

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    localStorage.setItem('isMuted', isMuted.toString());
  }, [state, isMuted]);

  useEffect(() => { if (activeTab === 'rank') syncGlobal(true); }, [activeTab]);

  const handleTap = (e: React.PointerEvent) => {
    if (state.energy < state.tapValue) {
      if (navigator.vibrate) navigator.vibrate([40, 40]);
      setCombo(0);
      return;
    }

    setSlapping(true);
    setJiggle(true);
    
    playSound('slap');
    if (Math.random() > 0.72 || combo > 10) playSound('moan');

    setCombo(prev => prev + 1);
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => setCombo(0), 1000);

    setTimeout(() => { setSlapping(false); setJiggle(false); }, 100);

    const isCrit = Math.random() < (state.critLevel * 0.05);
    const val = Math.floor(state.tapValue * (isCrit ? 5 : 1) * (1 + (combo / 15)));
    
    const id = Date.now();
    setPops(p => [...p, { id, x: e.clientX, y: e.clientY, val, isCrit }]);
    setTimeout(() => setPops(p => p.filter(x => x.id !== id)), 600);

    setState(s => ({ ...s, balance: s.balance + val, energy: s.energy - state.tapValue }));
    if (navigator.vibrate) navigator.vibrate(isCrit ? [60, 150, 60] : 15);
  };

  // Crash Logic
  const [crashBet, setCrashBet] = useState(0);
  const [crashStatus, setCrashStatus] = useState<'idle' | 'running' | 'crashed' | 'cashed'>('idle');
  const [crashMult, setCrashMult] = useState(1.0);
  const crashRef = useRef<any>(null);

  const startCrash = () => {
    if (crashBet <= 0 || state.balance < crashBet) return;
    setState(s => ({ ...s, balance: s.balance - crashBet }));
    setCrashStatus('running');
    setCrashMult(1.0);
    const limit = 1.05 + Math.random() * (Math.random() > 0.85 ? 18 : 6);
    crashRef.current = setInterval(() => {
      setCrashMult(prev => {
        const next = prev + (prev < 4 ? 0.08 : 0.25);
        if (next >= limit) { clearInterval(crashRef.current); setCrashStatus('crashed'); return next; }
        return next;
      });
    }, 100);
  };

  const cashOut = () => {
    if (crashStatus !== 'running') return;
    clearInterval(crashRef.current);
    setState(s => ({ ...s, balance: s.balance + Math.floor(crashBet * crashMult) }));
    setCrashStatus('cashed');
  };

  const currentT = t[lang];

  return (
    <div className={`flex flex-col h-full w-full bg-black text-white relative overflow-hidden ${shake ? 'screenshake' : ''}`}>
      
      {/* HEADER: COMPACT & FIXED */}
      <header className="px-5 pt-10 pb-1 flex justify-between items-center z-30 shrink-0 header-main">
        <div className="flex items-center gap-3">
           <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-3xl shadow-2xl">{currentLevel.avatar}</div>
           <div className="flex flex-col">
              <h1 className="text-xs font-black italic tracking-tighter uppercase leading-none text-red-600">کون کونک <span className="text-white">ULTRA</span></h1>
              <span className="text-[7px] text-zinc-600 font-bold uppercase mt-1 opacity-70">SORENA OPS V26</span>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => setIsMuted(!isMuted)} className={`p-2.5 glass rounded-xl transition-all ${isMuted ? 'text-zinc-600' : 'text-red-500 shadow-[0_0_15px_rgba(255,0,0,0.4)]'}`}>
             {isMuted ? <VolumeX size={20}/> : <Volume2 size={20}/>}
           </button>
           <div className="glass px-2.5 py-1.5 rounded-xl border-white/10 flex items-center gap-2">
             <div className="flex flex-col items-end leading-none">
                <span className="text-[6px] text-zinc-500 font-black uppercase">{currentT.power}</span>
                <span className="text-[10px] tabular-nums font-black text-red-500">+{Math.floor(state.autoPower * 3600).toLocaleString()}</span>
             </div>
             <Cpu size={14} className="text-red-600 animate-spin-slow" />
           </div>
        </div>
      </header>

      {/* PROGRESS BAR */}
      <div className="px-8 z-30 shrink-0 mb-3">
        <div className="flex justify-between items-center text-[8px] font-black text-zinc-500 mb-1.5 uppercase tracking-widest">
          <span>{currentLevel.name}</span>
          <span className="text-red-600 font-black">{Math.floor(levelProgress)}%</span>
        </div>
        <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden p-[1px] border border-white/10">
          <div className="h-full bg-gradient-to-l from-red-600 to-red-900 transition-all rounded-full shadow-[0_0_12px_#f00]" style={{ width: `${levelProgress}%` }} />
        </div>
      </div>

      <main className="flex-1 overflow-hidden relative z-10 flex flex-col">
        {activeTab === 'ops' && (
          <div className="h-full flex flex-col items-center justify-between pb-32 px-5 view-enter">
            <div className="text-center pt-2">
              <div className="text-[clamp(42px,18vw,80px)] font-black italic tracking-tighter leading-none tabular-nums drop-shadow-[0_15px_35px_rgba(255,0,0,0.7)] score-display">
                {Math.floor(state.balance).toLocaleString()}
              </div>
              {combo > 5 && (
                <div className="mt-4 flex items-center gap-2 px-4 py-1 bg-red-600/10 rounded-full border border-red-600/20 animate-bounce shadow-xl">
                  <Flame size={12} className="text-red-500" />
                  <span className="text-[11px] font-black italic text-red-500 uppercase tracking-tighter">{currentT.comboText} X{combo}</span>
                </div>
              )}
            </div>

            <div className={`butt-container ${jiggle ? 'smack' : ''} ${slapping ? 'slap-active' : ''}`} onPointerDown={handleTap}>
               <div className="butt-cheek cheek-left" />
               <div className="butt-crease" />
               <div className="butt-cheek cheek-right" />
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[10rem] opacity-[0.04] select-none">{currentLevel.asset}</div>
            </div>

            <div className="w-full glass p-5 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] border-white/5 stamina-card shrink-0">
               <div className="flex justify-between items-center">
                  <div className="flex flex-col leading-none">
                     <span className="text-[9px] text-zinc-600 font-black mb-1.5 uppercase">{currentT.bullets}</span>
                     <div className="flex items-baseline gap-2 font-black italic">
                       <span className="text-3xl tabular-nums tracking-tighter">{Math.floor(state.energy)}</span>
                       <span className="text-[10px] text-zinc-800 uppercase">/ {state.maxEnergy}</span>
                     </div>
                  </div>
                  <Lightning className="text-yellow-600 opacity-60" size={24} />
               </div>
               <div className="h-2 bg-zinc-950 rounded-full overflow-hidden mt-5 p-[1px] border border-white/5">
                  <div className="h-full bg-yellow-600 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: `${(state.energy/state.maxEnergy)*100}%` }} />
               </div>
            </div>
          </div>
        )}

        {activeTab === 'rank' && (
          <div className="h-full flex flex-col p-6 overflow-hidden view-enter pb-36">
             <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-4">
                       <Trophy className="text-red-600 shadow-sm" size={24} />
                       <h2 className="text-xl font-black italic tracking-tighter uppercase">{currentT.globalList}</h2>
                    </div>
                    <button onClick={() => syncGlobal(true)} className="p-2.5 glass rounded-full shadow-lg"><RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''}/></button>
                </div>
                <div className="bg-gradient-to-r from-yellow-600/15 to-transparent p-4 rounded-3xl border border-yellow-600/20 flex items-center gap-4 shadow-xl">
                   <Crown size={20} className="text-yellow-500" />
                   <div className="flex flex-col">
                      <span className="text-[11px] font-black text-yellow-500 uppercase tracking-widest">{currentT.prizePool}</span>
                      <span className="text-[8px] text-zinc-500 font-bold uppercase opacity-60">REAL-TIME RANKING SYSTEM</span>
                   </div>
                </div>
             </div>
             
             <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pb-10">
                {leaderboard.length === 0 ? <div className="h-64 flex flex-col items-center justify-center opacity-30 gap-6">
                  <RefreshCw size={40} className="animate-spin text-zinc-800"/>
                  <span className="font-black uppercase text-[12px] tracking-[0.4em]">{currentT.fetching}</span>
                </div> : leaderboard.map((u, i) => (
                  <div key={u.id} className={`glass p-5 rounded-[2rem] flex justify-between items-center border transition-all ${u.id === state.id ? 'border-red-600/70 bg-red-600/10 scale-[1.03] shadow-2xl z-20' : 'border-white/5'}`}>
                     <div className="flex items-center gap-5">
                        <div className={`text-2xl font-black italic w-10 text-center ${i < 3 ? (i === 0 ? 'text-yellow-400' : i === 1 ? 'text-zinc-300' : 'text-orange-400') : 'text-zinc-800'}`}>{i < 3 ? '🥇🥈🥉'[i*2] + '🥇🥈🥉'[i*2+1] : `#${i+1}`}</div>
                        <div className="flex flex-col leading-tight">
                           <div className="font-black text-base flex items-center gap-3 text-white">
                             <span>{u.username}</span>
                             {u.id === state.id && <div className="px-2.5 py-1 bg-red-600 rounded-full text-[8px] font-black animate-pulse shadow-lg uppercase">{currentT.you}</div>}
                             {i < 3 && <CheckCircle size={14} className="text-blue-500" />}
                           </div>
                           <span className="text-[10px] text-zinc-600 font-bold uppercase mt-1 tracking-widest">{currentT.operationalLevel} {u.level}</span>
                        </div>
                     </div>
                     <div className="text-white font-black italic text-lg tabular-nums tracking-tighter drop-shadow-lg">{Math.floor(u.score).toLocaleString()}</div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'crash' && (
          <div className="h-full flex flex-col items-center justify-center p-6 view-enter pb-36">
            <div className="glass w-full p-10 rounded-[4.5rem] text-center border-red-600/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] relative flex flex-col items-center max-w-[340px] crash-panel max-h-[85%] overflow-y-auto">
               <span className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.5em] mb-4">OSCILLATOR X-26</span>
               <div className={`text-[clamp(50px,15vw,85px)] font-black italic my-1 tabular-nums leading-none tracking-tighter drop-shadow-2xl transition-all ${crashStatus === 'crashed' ? 'text-red-950 blur-lg grayscale' : 'text-white'}`}>{crashMult.toFixed(2)}<span className="text-2xl ml-2 opacity-20 italic">x</span></div>
               
               <div className="relative w-full aspect-square max-h-[140px] flex items-center justify-center mb-8 shrink-0">
                  <div className="text-[120px] transition-transform duration-100 filter drop-shadow-[0_20px_40px_rgba(0,0,0,1)]" style={{ transform: `scale(${crashStatus === 'running' ? 1 + (crashMult - 1) * 0.05 : 1}) rotate(${crashStatus === 'running' ? crashMult * 12 : 0}deg)`, opacity: crashStatus === 'crashed' ? 0.05 : 1 }}>🍑</div>
                  {crashStatus === 'crashed' && <div className="absolute inset-0 flex items-center justify-center bg-red-950/95 rounded-full text-xl font-black border border-red-600/50 text-red-600 z-20 animate-pulse px-6 text-center shadow-[0_0_60px_#f00]">{currentT.blown}</div>}
                  {crashStatus === 'cashed' && <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/95 rounded-full text-xl font-black border border-emerald-600/50 text-emerald-600 z-20 px-6 text-center shadow-[0_0_60px_#10b981]">{currentT.saved}</div>}
               </div>

               <div className="w-full space-y-4 shrink-0">
                  <div className="flex gap-2">
                    <input type="number" placeholder="مبلغ..." className="flex-1 min-w-0 bg-black/60 border border-white/10 p-4 rounded-3xl text-center font-black text-2xl outline-none focus:border-red-600 text-white shadow-inner" value={crashBet || ''} onChange={e => setCrashBet(Number(e.target.value))} disabled={crashStatus === 'running'} />
                    <button onClick={() => setCrashBet(Math.floor(state.balance))} className="glass px-4 rounded-2xl text-[10px] font-black text-zinc-600 hover:text-red-500 uppercase">MAX</button>
                  </div>
                  {crashStatus !== 'running' ? <button onClick={startCrash} className="w-full bg-red-800 hover:bg-red-700 p-5 rounded-[2.2rem] font-black text-2xl active:scale-95 shadow-2xl transition-all uppercase tracking-tighter border-t border-white/10">{currentT.startAttack}</button> : <button onClick={cashOut} className="w-full bg-emerald-800 hover:bg-emerald-700 p-5 rounded-[2.2rem] font-black text-2xl animate-pulse shadow-2xl transition-all uppercase tracking-tighter border-t border-white/10">{currentT.cashout}</button>}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'gear' && (
          <div className="h-full overflow-y-auto custom-scrollbar p-6 pb-48 space-y-10 view-enter">
             <div className="glass p-8 rounded-[3.5rem] space-y-8 border-white/10 market-card shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[50px] -mr-10 -mt-10" />
                <div className="space-y-4">
                   <label className="text-[11px] font-black text-zinc-600 uppercase block text-right tracking-widest">آی‌دی شلاق‌زن عملیاتی</label>
                   <div className="flex items-center gap-4 glass p-2 rounded-2xl border-white/5 bg-black/50 shadow-inner">
                      <div className="p-3 bg-zinc-900 rounded-xl shadow-xl"><User size={22} className="text-zinc-600" /></div>
                      <input type="text" className="flex-1 bg-transparent border-none p-2 font-black text-white focus:outline-none text-lg text-right tracking-tight placeholder:text-zinc-900" value={state.username} onChange={e => setState(s => ({...s, username: e.target.value}))} onBlur={() => syncGlobal()} placeholder="ALIAS_ID" />
                   </div>
                </div>
                <button onClick={() => { if (Date.now() - state.lastBonusClaim < 86400000) return; setState(s => ({ ...s, balance: s.balance + 60000, lastBonusClaim: Date.now() })); if(navigator.vibrate) navigator.vibrate(50); }} 
                  disabled={Date.now() - state.lastBonusClaim < 86400000} className={`w-full p-6 rounded-[2.5rem] flex items-center justify-center gap-5 font-black transition-all shadow-2xl active:scale-95 group ${Date.now() - state.lastBonusClaim >= 86400000 ? 'bg-gradient-to-br from-yellow-500 to-orange-700 text-black shadow-yellow-950/40' : 'bg-zinc-950 text-zinc-800 opacity-60 grayscale'}`}>
                    <Gift size={28} className="group-active:rotate-12 transition-transform" />
                    <div className="flex flex-col items-center leading-none">
                      <span className="text-xl uppercase tracking-tighter">{Date.now() - state.lastBonusClaim >= 86400000 ? currentT.available : currentT.nextBonus}</span>
                      {Date.now() - state.lastBonusClaim < 86400000 && <span className="text-[12px] font-black opacity-60 mt-1.5">{new Date(86400000 - (Date.now() - state.lastBonusClaim)).toISOString().substr(11, 8)}</span>}
                    </div>
                </button>
             </div>

             <div className="grid gap-5">
                {UPGRADES.map(u => {
                   const level = u.id === 'tap' ? state.tapValue - 1 : u.id === 'energy' ? (state.maxEnergy - INITIAL_ENERGY) / 500 : u.id === 'crit' ? state.critLevel : u.id === 'regen' ? state.regenLevel : Math.floor(state.autoPower / 5);
                   const price = Math.floor(u.basePrice * Math.pow(u.mult, level));
                   const canAfford = state.balance >= price && (u.max ? level < u.max : true);
                   const isMax = u.max && level >= u.max;
                   return (
                      <button key={u.id} disabled={isMax} onClick={() => { if (canAfford) {
                              setState(s => ({ ...s, balance: s.balance - price, tapValue: u.id === 'tap' ? s.tapValue + 1 : s.tapValue, maxEnergy: u.id === 'energy' ? s.maxEnergy + 500 : s.maxEnergy, critLevel: u.id === 'crit' ? s.critLevel + 1 : s.critLevel, regenLevel: u.id === 'regen' ? s.regenLevel + 1 : s.regenLevel, autoPower: u.id === 'auto' ? s.autoPower + 5 : s.autoPower }));
                              if(navigator.vibrate) navigator.vibrate(30);
                           } }} className={`w-full glass p-5 rounded-[2.5rem] flex items-center gap-5 border-white/5 text-right transition-all active:scale-[0.97] shadow-xl ${!canAfford && !isMax && 'opacity-25 grayscale'} ${isMax && 'bg-yellow-600/10 border-yellow-600/20'}`}>
                         <div className="w-14 h-14 bg-zinc-950 rounded-2xl flex items-center justify-center text-red-600 border border-white/10 shadow-inner shrink-0">
                               {u.id === 'tap' && <Sword size={28} />}{u.id === 'energy' && <Lightning size={28} />}{u.id === 'auto' && <Bot size={28} />}{u.id === 'crit' && <Target size={28} />}{u.id === 'regen' && <RefreshCw size={28} />}
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                               <span className="font-black text-base uppercase tracking-tight text-white line-clamp-1">{u.name}</span>
                               <span className="text-[10px] text-zinc-600 font-black uppercase bg-white/10 px-3 py-1 rounded-full border border-white/5 shrink-0">L{level}</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 font-bold leading-tight mt-2 opacity-80 line-clamp-2">{u.desc}</p>
                            <div className="flex items-center justify-between mt-3">
                               <span className={`font-black italic text-xl tabular-nums ${isMax ? 'text-yellow-600' : 'text-red-600'}`}>{isMax ? currentT.maxed : price.toLocaleString()}</span>
                               <ChevronLeft size={18} className="text-zinc-800" />
                            </div>
                         </div>
                      </button>
                   );
                })}
             </div>

             {/* ABOUT / MANIFESTO / CREATOR SECTION */}
             <div className="glass p-12 rounded-[5rem] border-red-950/40 bg-gradient-to-b from-red-950/20 to-transparent relative overflow-hidden shadow-2xl text-center mt-12 mb-20">
                <div className="flex items-center justify-center gap-6 mb-8 text-red-600 relative z-10">
                   <div className="p-4 bg-red-600/15 rounded-3xl shadow-xl shadow-red-950/30"><Info size={36} className="animate-pulse" /></div>
                   <h4 className="font-black italic text-2xl uppercase tracking-tighter drop-shadow-xl">{currentT.manifesto}</h4>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed font-black text-center mb-10 px-8 opacity-90 relative z-10">
                   {currentT.aboutProject}
                </p>
                <div className="pt-10 border-t border-white/10 flex flex-col items-center gap-6 relative z-10">
                   <div className="flex items-center gap-3 text-zinc-700 font-black uppercase tracking-[0.4em] text-[11px] opacity-60">
                      <Code size={18} />
                      <span>{currentT.creator}</span>
                   </div>
                   <div className="bg-red-600/20 px-14 py-6 rounded-full border border-red-600/30 text-red-500 font-black italic text-3xl flex items-center gap-5 shadow-2xl active:scale-95 hover:bg-red-600/30 transition-all group">
                      <Fingerprint size={36} className="group-hover:rotate-12 transition-transform shadow-xl" />
                      <span className="uppercase tracking-tighter drop-shadow-[0_10px_30px_rgba(255,0,0,0.5)]">Sorena</span>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* FOOTER: FIXED & ISLAND STYLE */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-5 pb-10 pt-4 bg-gradient-to-t from-black via-black/98 to-transparent pointer-events-none footer-nav-container">
        <div className="bg-[#0e0e0e]/95 p-2 rounded-[5rem] flex justify-between border border-white/15 backdrop-blur-2xl pointer-events-auto shadow-[0_50px_100px_rgba(0,0,0,1)]">
           <NavBtn id="ops" active={activeTab === 'ops'} label={currentT.ops} icon={Sword} onClick={setActiveTab} />
           <NavBtn id="crash" active={activeTab === 'crash'} label={currentT.crash} icon={Bomb} onClick={setActiveTab} />
           <NavBtn id="rank" active={activeTab === 'rank'} label={currentT.rank} icon={Trophy} onClick={setActiveTab} />
           <NavBtn id="gear" active={activeTab === 'gear'} label={currentT.gear} icon={Cpu} onClick={setActiveTab} />
        </div>
      </nav>

      {pops.map(p => (
        <div key={p.id} className={`tap-pop ${p.isCrit ? 'text-yellow-400 scale-125 z-50' : ''}`} style={{ left: p.x, top: p.y }}>
          {p.isCrit ? '💦' : '🍑'} +{p.val}
        </div>
      ))}
    </div>
  );
};

const NavBtn = ({ id, active, label, icon: Icon, onClick }: any) => (
  <button onClick={() => onClick(id)} className={`flex-1 flex flex-col items-center py-4 rounded-[4.5rem] transition-all duration-400 ${active ? 'nav-active' : 'nav-inactive hover:opacity-100'}`}>
    <div className={`p-2.5 rounded-full transition-all nav-btn-inner ${active ? 'bg-white/15 rotate-6 shadow-2xl scale-110' : ''}`}>
      <Icon size={22} strokeWidth={active ? 3 : 2} fill={active && (id === 'ops' || id === 'gear') ? 'currentColor' : 'none'} />
    </div>
    <span className={`text-[10px] font-black mt-2 uppercase tracking-[0.1em] transition-all nav-text ${active ? 'opacity-100 translate-y-0' : 'opacity-100 text-zinc-500'}`}>{label}</span>
  </button>
);

export default App;
