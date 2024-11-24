'use client';

import { useEffect } from 'react';
import { useConnectModal, useAccountModal, useChainModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/AuthContext';

export const ConnectBtn = () => {
  const { isConnected, chain, address } = useAccount();
  const { account, setAccount, logout } = useAuthContext();

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();

  useEffect(() => {
    let disconnectTimeout: NodeJS.Timeout | null = null;
    if (isConnected && address) {
      setAccount(address);
    }
    if (!isConnected && account) {
      disconnectTimeout = setTimeout(() => {
        logout();
      }, 500);
    }

    return () => {
      if (disconnectTimeout) {
        clearTimeout(disconnectTimeout);
      }
    };
  }, [isConnected, address, account, setAccount, logout]);

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

  if (account) {
    return renderButton('success', openAccountModal, 'Wallet');
  }

  if (!isConnected && !address) {
    return renderButton('neutral', openConnectModal, 'Connect Wallet');
  }

  if (isConnected && !chain) {
    return renderButton('error', openChainModal, 'Wrong network');
  }

  return renderButton('success', openAccountModal, 'Wallet');
};
