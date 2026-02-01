
export const SAVE_KEY = 'koonkoonak_v24_legendary_final';
export const INITIAL_ENERGY = 1500; 
export const ENERGY_REGEN_PER_SEC = 8; 

export const LEVELS = [
  { 
    threshold: 0, 
    name: 'نوآموزِ مالش', 
    avatar: '👶', 
    asset: '🍑', 
    style: 'radial-gradient(circle at 35% 25%, #ffbaba 0%, #ff2e2e 35%, #900 80%, #300 100%)',
  },
  { 
    threshold: 200000, 
    name: 'تپ‌زنِ حشری', 
    avatar: '🥵', 
    asset: '🔥', 
    style: 'radial-gradient(circle at 35% 25%, #ffd2a6 0%, #ff7800 35%, #b34d00 80%, #4d2100 100%)',
  },
  { 
    threshold: 2500000, 
    name: 'شلاق‌زنِ پاره‌وقت', 
    avatar: '⚔️', 
    asset: '💢', 
    style: 'radial-gradient(circle at 35% 25%, #e6a6ff 0%, #c800ff 35%, #6a0087 80%, #290033 100%)',
  },
  { 
    threshold: 20000000, 
    name: 'اوستای کون‌کوبی', 
    avatar: '💀', 
    asset: '👑', 
    style: 'radial-gradient(circle at 35% 25%, #fff4a6 0%, #ffd700 35%, #b39700 80%, #4d4100 100%)',
  },
  { 
    threshold: 200000000, 
    name: 'سلطانِ لپ‌های قرمز', 
    avatar: '🪐', 
    asset: '💎', 
    style: 'radial-gradient(circle at 35% 25%, #a6f2ff 0%, #00c8ff 35%, #008eb3 80%, #003d4d 100%)',
  },
  { 
    threshold: 1500000000, 
    name: 'امپراطورِ هلوهای کبود', 
    avatar: '🎭', 
    asset: '🌀', 
    style: 'radial-gradient(circle at 35% 25%, #ffffff 0%, #ff2e2e 40%, #000000 90%)',
  },
  { 
    threshold: 8000000000, 
    name: 'خدایِ شلاق و لذت', 
    avatar: '⚡', 
    asset: '🌌', 
    style: 'radial-gradient(circle at 35% 25%, #ff00ff 0%, #00ffff 50%, #000000 100%)',
  },
  { 
    threshold: 50000000000, 
    name: 'اسطوره کون‌کوبی ابدی', 
    avatar: '🔱', 
    asset: '🧿', 
    style: 'linear-gradient(135deg, #000 0%, #400 50%, #000 100%)',
  }
];

export const UPGRADES = [
  { id: 'tap', name: 'شلاق چرمی', desc: 'با هر ضربه، صدای ناله بدخواهانت در سراسر جهان طنین‌انداز می‌شود!', basePrice: 1200, mult: 2.3 },
  { id: 'energy', name: 'ویتامین ج*نسی', desc: 'نفس عملیاتی شما را برای شلاق‌زنی‌های طولانی‌مدت تضمین می‌کند.', basePrice: 6000, mult: 2.2 },
  { id: 'auto', name: 'بردۀ شلاق‌زن', desc: 'یک هوش مصنوعیِ مطیع که حتی وقتی خواب هستید برایتان نفوذ می‌کند.', basePrice: 80000, mult: 2.7 },
  { id: 'crit', name: 'نفوذ عمیق', desc: 'شانس کبود کردن شدید (۵ برابر امتیاز) با ناله‌های جانسوز!', basePrice: 250000, mult: 3.5, max: 20 },
  { id: 'regen', name: 'اسپرسو دبل', desc: 'سرعت ریکاوری نفسِ شما را تا حد مرگ بالا می‌برد.', basePrice: 150000, mult: 3.4, max: 25 }
];
