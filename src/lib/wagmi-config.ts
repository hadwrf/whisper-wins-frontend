'use client';

import { http, createStorage, cookieStorage } from 'wagmi';
import { localhost } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;
if (!projectId) {
  throw new Error('Project ID is not defined');
}

const supportedChains = [localhost] as const;

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
