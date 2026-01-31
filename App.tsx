
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Hand, Zap, Bot, Flame, ShieldAlert, Circle, TrendingUp, Target } from 'lucide-react';
import { SAVE_KEY, INITIAL_ENERGY, ENERGY_REGEN, LEVELS, UPGRADES } from './constants.ts';

const IconMap: Record<string, any> = {
  Hand, Zap, Bot, Flame, ShieldAlert, Circle, Target
};

const App = () => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) { console.warn("Load error", e); }
    return { balance: 0, energy: INITIAL_ENERGY, maxEnergy: INITIAL_ENERGY, tapValue: 1, autoPower: 0, megaPower: 0 };
  });

  const [activeTab, setActiveTab] = useState('tap');
  const [pops, setPops] = useState<{id: number, x: number, y: number, val: number}[]>([]);
  const [isBurning, setIsBurning] = useState(false);
  const popId = useRef(0);

  // منطق سود خودکار و بازیابی انرژی
  useEffect(() => {
    const timer = setInterval(() => {
      setState(prev => ({
        ...prev,
        energy: Math.min(prev.maxEnergy, prev.energy + (ENERGY_REGEN / 10)),
        balance: prev.balance + (prev.autoPower / 10) + (prev.megaPower / 10)
      }));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state]);

  const currentLevel = useMemo(() => {
    const idx = LEVELS.reduce((acc, l, i) => (state.balance >= l.threshold ? i : acc), 0);
    return { ...LEVELS[idx], index: idx + 1 };
  }, [state.balance]);

  const handleTap = (e: React.PointerEvent) => {
    if (state.energy < state.tapValue) {
       if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
       return;
    }

    setIsBurning(true);
    setTimeout(() => setIsBurning(false), 50);

    const id = ++popId.current;
    const finalVal = state.tapValue;
    
    setPops(prev => [...prev, { id, x: e.clientX, y: e.clientY, val: finalVal }]);
    setTimeout(() => setPops(prev => prev.filter(p => p.id !== id)), 700);

    setState(prev => ({
      ...prev,
      balance: prev.balance + finalVal,
      energy: Math.max(0, prev.energy - state.tapValue)
    }));

    if (navigator.vibrate) navigator.vibrate(10);
  };

  const getPrice = (up: any) => {
    let lvl = 0;
    if (up.id === 'tap') lvl = state.tapValue - 1;
    else if (up.id === 'energy') lvl = (state.maxEnergy - INITIAL_ENERGY) / 500;
    else if (up.id === 'auto') lvl = state.autoPower / 5;
    else if (up.id === 'mega') lvl = state.megaPower / 25;
    return Math.floor(up.basePrice * Math.pow(up.mult, lvl));
  };

  const buy = (up: any) => {
    const price = getPrice(up);
    if (state.balance >= price) {
      setState(prev => ({
        ...prev,
        balance: prev.balance - price,
        tapValue: up.id === 'tap' ? prev.tapValue + 1 : prev.tapValue,
        maxEnergy: up.id === 'energy' ? prev.maxEnergy + 500 : prev.maxEnergy,
        autoPower: up.id === 'auto' ? prev.autoPower + 5 : prev.autoPower,
        megaPower: up.id === 'mega' ? prev.megaPower + 25 : prev.megaPower
      }));
      if (navigator.vibrate) navigator.vibrate([50, 100]);
    }
  };

  return (
    <div className={`flex flex-col h-screen max-w-md mx-auto relative bg-[#050505] text-white overflow-hidden font-['Vazirmatn'] ${isBurning ? 'burn-shake' : ''}`}>
      {/* هاله‌های نوری تهاجمی */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_40%,rgba(220,38,38,0.2),transparent_60%)] pointer-events-none" />
      
      {/* Header Area */}
      <div className="px-6 pt-10 pb-4 z-50">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center border border-red-500/20 shadow-[0_0_20px_rgba(220,38,38,0.1)]">
               <span className="text-3xl">🍑</span>
             </div>
             <div>
               <h1 className="text-lg font-black italic tracking-tighter leading-none">کونکونک <span className="text-red-600">ULTRA</span></h1>
               <div className="flex items-center gap-1.5 mt-1.5">
                 <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_#ef4444]" />
                 <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">آماده‌باش برای سوزش نهایی</span>
               </div>
             </div>
          </div>
          <div className="glass-panel px-4 py-2 rounded-2xl border-red-500/30 text-right">
             <span className="text-[7px] text-zinc-500 font-black uppercase tracking-tighter block mb-0.5">تلفات ساعتی دشمن</span>
             <div className="flex items-center gap-1 justify-end">
                <span className="text-base font-black text-red-500">+{Math.floor((state.autoPower + state.megaPower) * 360).toLocaleString()}</span>
                <TrendingUp size={12} className="text-red-600" />
             </div>
          </div>
        </div>

        {/* Level Bar */}
        <div className="space-y-2">
           <div className="flex justify-between items-end px-1">
              <span className={`text-[12px] font-black bg-clip-text text-transparent bg-gradient-to-r ${currentLevel.color}`}>
                {currentLevel.name}
              </span>
              <span className="text-[9px] font-black text-zinc-700">LVL {currentLevel.index}</span>
           </div>
           <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
              <div 
                className={`h-full bg-gradient-to-r ${currentLevel.color} transition-all duration-700 rounded-full shadow-[0_0_12px_rgba(220,38,38,0.3)]`}
                style={{ width: `${Math.min(100, (state.balance / (LEVELS[currentLevel.index]?.threshold || state.balance * 2)) * 100)}%` }}
              />
           </div>
        </div>
      </div>

      {/* Main View Container */}
      <div className="flex-1 overflow-y-auto px-6 z-10 custom-scrollbar pb-32">
        {activeTab === 'tap' && (
          <div className="h-full flex flex-col items-center justify-around py-2">
            <div className="text-center relative">
              <div className="flex items-center justify-center gap-4">
                 <span className="text-6xl font-black tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(255,50,50,0.3)]">
                   {Math.floor(state.balance).toLocaleString()}
                 </span>
              </div>
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em] mt-3">مجموع سوزش‌های وارد شده</p>
            </div>

            {/* Target Interaction */}
            <div 
              className="relative cursor-pointer touch-none select-none active:scale-90 transition-transform duration-75"
              onPointerDown={handleTap}
            >
              <div 
                className="flex gap-4 fire-glow"
                style={{ transform: `scale(${currentLevel.scale})` }}
              >
                <div className="w-40 h-56 bg-gradient-to-br from-pink-400 via-red-600 to-zinc-900 rounded-[65%_35%_35%_65%] shadow-[inset_-15px_-15px_50px_rgba(0,0,0,0.8)] border-r-2 border-white/10 relative">
                   <div className="absolute top-1/4 right-6 w-10 h-28 bg-white/15 blur-2xl rounded-full rotate-15" />
                </div>
                <div className="w-40 h-56 bg-gradient-to-bl from-pink-400 via-red-600 to-zinc-900 rounded-[35%_65%_65%_35%] shadow-[inset_15px_-15px_50px_rgba(0,0,0,0.8)] border-l-2 border-white/10 relative">
                   <div className="absolute top-1/4 left-6 w-10 h-28 bg-white/15 blur-2xl rounded-full -rotate-15" />
                </div>
              </div>

              {pops.map(p => (
                <div key={p.id} className="tap-pop text-6xl font-black italic" style={{ left: p.x - 40, top: p.y - 100 }}>
                  +{p.val}
                </div>
              ))}
            </div>

            {/* Energy UI */}
            <div className="w-full glass-panel p-6 rounded-[2.5rem] border-red-500/10 shadow-2xl">
               <div className="flex justify-between items-center mb-4 px-2">
                  <div className="flex items-center gap-3">
                     <Zap size={20} className="text-yellow-500 fill-yellow-500" />
                     <div className="flex flex-col">
                        <span className="text-2xl font-black leading-none">{Math.floor(state.energy)}</span>
                        <span className="text-zinc-600 font-black text-[8px] uppercase tracking-widest mt-1">ذخیره مهمات سوزشی</span>
                     </div>
                  </div>
               </div>
               <div className="h-3.5 bg-black/80 rounded-full overflow-hidden p-1 border border-white/5 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 via-red-600 to-black rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    style={{ width: `${(state.energy / state.maxEnergy) * 100}%` }}
                  />
               </div>
            </div>
          </div>
        )}

        {activeTab === 'boost' && (
          <div className="space-y-4 pt-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-gradient-to-br from-red-700 via-red-900 to-black p-8 rounded-[2.5rem] mb-6 shadow-2xl border border-red-500/20">
               <h3 className="text-2xl font-black italic mb-2 uppercase tracking-tighter">زرادخانه عملیاتی</h3>
               <p className="text-white/60 text-[10px] font-bold leading-relaxed">تجهیزات خود را برای سوزاندن کون تک‌تک بدخواهان مهدی ارتقا دهید. هیچ دشمنی نباید سالم بماند.</p>
            </div>

            {UPGRADES.map(up => {
              const price = getPrice(up);
              const can = state.balance >= price;
              const IconComp = IconMap[up.icon] || Zap;
              return (
                <button 
                  key={up.id}
                  onClick={() => buy(up)}
                  className={`w-full glass-panel flex items-center justify-between p-4 rounded-3xl transition-all ${
                    can ? 'active:scale-95 border-red-500/30' : 'opacity-20 grayscale pointer-events-none'
                  }`}
                >
                  <div className="flex items-center gap-4 text-right">
                    <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center text-red-500 border border-red-500/10">
                      <IconComp size={24} />
                    </div>
                    <div>
                      <div className="font-black text-sm text-white">{up.name}</div>
                      <div className="text-[7px] text-zinc-500 font-black uppercase tracking-widest">{up.desc}</div>
                    </div>
                  </div>
                  <div className="bg-black/50 px-4 py-2 rounded-xl border border-white/5 text-center min-w-[80px]">
                    <div className="text-red-500 font-black text-sm leading-none">{price.toLocaleString()}</div>
                    <div className="text-[7px] text-zinc-600 uppercase mt-1 font-black">امتیاز</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="pt-10 text-center px-2 animate-in slide-in-from-bottom-8">
             <div className="w-20 h-20 bg-red-600/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-red-600/20 shadow-2xl">
                <ShieldAlert size={40} className="text-red-600 animate-pulse" />
             </div>
             <h3 className="text-3xl font-black italic mb-6 tracking-tighter uppercase text-white">مانیفست سوزش</h3>
             <div className="glass-panel p-8 rounded-[2.5rem] text-zinc-400 text-[11px] leading-relaxed text-justify border-red-600/10 shadow-2xl">
                <p className="mb-4">این سامانه صرفاً با هدف سازماندهی نیروهای تپ‌زن برای وارد آوردن حداکثر فشار و سوزش به دشمنان و بدخواهان مهدی طراحی شده است.</p>
                <div className="bg-red-600/10 p-5 rounded-2xl border-r-4 border-red-600 mb-6">
                  <p className="text-red-500 font-black italic text-sm leading-relaxed text-right">
                    "هر تپ شما در این اپلیکیشن، سندی است بر سوزشِ بی‌پایانِ کسانی که مقابل ارتش متحد ایستاده‌اند."
                  </p>
                </div>
                <div className="flex justify-center gap-4 text-zinc-600 font-black uppercase tracking-widest">
                   <span>V5.1.0</span>
                   <span>•</span>
                   <span>ANTI-DASHBOARD</span>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-10 left-8 right-8 z-[100]">
        <div className="bg-zinc-950/80 backdrop-blur-2xl border border-white/10 p-1.5 rounded-[2.5rem] flex justify-between shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          <button 
            onClick={() => setActiveTab('tap')}
            className={`flex-1 flex flex-col items-center gap-1.5 py-4 rounded-[2rem] transition-all duration-300 ${activeTab === 'tap' ? 'bg-gradient-to-b from-red-600 to-red-900 text-white' : 'text-zinc-600'}`}
          >
            <Hand size={20} fill={activeTab === 'tap' ? 'white' : 'none'} />
            <span className="text-[8px] font-black uppercase tracking-widest">عملیات</span>
          </button>
          <button 
            onClick={() => setActiveTab('boost')}
            className={`flex-1 flex flex-col items-center gap-1.5 py-4 rounded-[2rem] transition-all duration-300 ${activeTab === 'boost' ? 'bg-gradient-to-b from-red-600 to-red-900 text-white' : 'text-zinc-600'}`}
          >
            <Flame size={20} fill={activeTab === 'boost' ? 'white' : 'none'} />
            <span className="text-[8px] font-black uppercase tracking-widest">تدارکات</span>
          </button>
          <button 
            onClick={() => setActiveTab('info')}
            className={`flex-1 flex flex-col items-center gap-1.5 py-4 rounded-[2rem] transition-all duration-300 ${activeTab === 'info' ? 'bg-gradient-to-b from-red-600 to-red-900 text-white' : 'text-zinc-600'}`}
          >
            <Target size={20} fill={activeTab === 'info' ? 'white' : 'none'} />
            <span className="text-[8px] font-black uppercase tracking-widest">اهداف</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
