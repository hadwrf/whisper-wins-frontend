'use client';

import { http, createStorage, cookieStorage } from 'wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { localhost } from './chains/localhost';
import { toliman } from './chains/toliman';

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;
if (!projectId) {
  throw new Error('Project ID is not defined');
}

const supportedChains = [localhost, toliman] as const;

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
