import { Chain } from '@rainbow-me/rainbowkit';

export const toliman = {
  id: 33626250,
  name: 'Toliman',
  iconUrl: 'https://docs.flashbots.net/img/brand-assets/flashbots_icon.png',
  nativeCurrency: {
    name: 'Toliman ETH',
    symbol: 'tETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.toliman.suave.flashbots.net'],
    },
    public: {
      http: ['https://rpc.toliman.suave.flashbots.net'],
    },
  },
  blockExplorers: {
    default: { name: 'Toliman Explorer', url: 'https://explorer.toliman.suave.flashbots.net' },
  },
  testnet: true, // Set to false if it's a mainnet
} as const satisfies Chain;
