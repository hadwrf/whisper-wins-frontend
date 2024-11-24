'use client';

import { http, createStorage, cookieStorage } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { localhost } from '@/lib/chains/localhost';
import { toliman } from '@/lib/chains/toliman';

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;
if (!projectId) {
  throw new Error('Project ID is not defined');
}

const supportedChains = [localhost, sepolia, toliman] as const;

export const config = getDefaultConfig({
  appName: 'WalletConnection',
  projectId,
  chains: supportedChains,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: supportedChains.reduce((obj, chain) => ({ ...obj, [chain.id]: http() }), {}),
});
