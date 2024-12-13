'use client';

import { http, createStorage, cookieStorage } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { toliman } from '@/lib/chains/toliman';
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;
if (!projectId) {
  throw new Error('Project ID is not defined');
}

const supportedChains = [sepolia, toliman] as const;

export const config = getDefaultConfig({
  appName: 'WalletConnection',
  projectId,
  chains: supportedChains,
  wallets: [
    {
      groupName: 'Required',
      wallets: [metaMaskWallet],
    },
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: supportedChains.reduce((obj, chain) => ({ ...obj, [chain.id]: http() }), {}),
});
