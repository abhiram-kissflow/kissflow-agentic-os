export const BRAND = {
  blue: '#1F80FF', magenta: '#CF2C91', orange: '#F58220',
  green: '#4AA147', black: '#000000',
} as const;

export const BRAND_ORDER = ['blue', 'magenta', 'orange', 'green'] as const;
export const WEIGHTS = { blue: 0.4, magenta: 0.3, orange: 0.15, green: 0.15 } as const;

export function hexToVec3(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
}
