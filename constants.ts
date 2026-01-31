
export const SAVE_KEY = 'koonkoonak_ultra_final_v1';
export const INITIAL_ENERGY = 1000;
export const ENERGY_REGEN = 4;

export const LEVELS = [
  { threshold: 0, name: 'سطح ۱: سرباز صفر سوزش', color: 'from-zinc-500 to-zinc-800', scale: 1 },
  { threshold: 2500, name: 'سطح ۲: لرزاننده ستون دشمن', color: 'from-red-500 to-orange-700', scale: 1.05 },
  { threshold: 12000, name: 'سطح ۳: افسر عملیات ویژه', color: 'from-orange-600 to-red-900', scale: 1.12 },
  { threshold: 60000, name: 'سطح ۴: فرمانده کل قوا (تپ)', color: 'from-purple-700 to-red-600', scale: 1.2 },
  { threshold: 200000, name: 'سطح ۵: نابودگر بدخواهان (ULTRA)', color: 'from-yellow-500 via-red-600 to-black', scale: 1.3 }
];

export const UPGRADES = [
  { id: 'tap', name: 'انگشت اتمی', desc: 'تخریب مستقیم بافت دشمن', basePrice: 60, mult: 1.9, icon: 'Flame' },
  { id: 'energy', name: 'سرم ضد-خستگی', desc: 'دوام بیشتر در خط مقدم', basePrice: 250, mult: 1.7, icon: 'Zap' },
  { id: 'auto', name: 'بات انتقام‌جو', desc: 'سوزش مستمر و شبانه‌روزی', basePrice: 1200, mult: 2.3, icon: 'Bot' },
  { id: 'mega', name: 'موشک زمین به کون', desc: 'انهدام کامل بدخواهان مهدی', basePrice: 6000, mult: 3.0, icon: 'ShieldAlert' }
];
