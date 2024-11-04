'use client';

import { useEffect, useRef } from 'react';
import { useConnectModal, useAccountModal, useChainModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ConnectBtn = () => {
  const { isConnecting, isConnected, chain } = useAccount();

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
  }, []);

  const renderButton = (
    variant: 'neutral' | 'error' | 'success',
    onClick: (() => void) | undefined,
    children: React.ReactNode,
  ) => (
    <Button
      variant={variant}
      size='xl'
      onClick={onClick}
    >
      <Wallet />
      {children}
    </Button>
  );

  if (!isConnected) {
    const status = isConnecting ? 'Connecting...' : 'Connect Wallet';
    return renderButton('neutral', openConnectModal, status);
  }

  if (isConnected && !chain) {
    return renderButton('error', openChainModal, 'Wrong network');
  }

  return renderButton('success', openAccountModal, 'Wallet');
};
