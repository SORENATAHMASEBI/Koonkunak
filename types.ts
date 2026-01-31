
export interface GameState {
  balance: number;
  totalTaps: number;
  energy: number;
  maxEnergy: number;
  tapValue: number;
  lastUpdate: number;
  level: number;
  autoClickerPower: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  priceMultiplier: number;
  type: 'tap' | 'energy' | 'auto';
  value: number;
}
