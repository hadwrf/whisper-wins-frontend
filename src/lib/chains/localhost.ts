import { Chain } from '@rainbow-me/rainbowkit';

export const localhost = {
  id: 16813125,
  name: 'Localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Toliman ETH',
    symbol: 'tETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
} as const satisfies Chain;
