"use client";

import { useEffect, useRef } from "react";
import {
    useConnectModal,
    useAccountModal,
    useChainModal,
} from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { Wallet } from "lucide-react";

export const ConnectBtn = () => {
    const { isConnecting, address, isConnected, chain } = useAccount();

    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();
    const { openChainModal } = useChainModal();
    const { disconnect } = useDisconnect();

    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
    }, []);

    if (!isConnected) {
        return (
            <button
                className='h-[48px] flex-none items-center justify-start gap-2 rounded-md bg-gray-50 p-2 px-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600'
                onClick={async () => {
                    if (isConnected) {
                        disconnect();
                    }
                    openConnectModal?.();
                }}
                disabled={isConnecting}
            >
                <div className="flex gap-2 items-center justify-start">
                    <Wallet />
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}</div>
            </button>
        );
    }

    if (isConnected && !chain) {
        return (
            <button
                className='h-[48px] flex-none items-center justify-end gap-2 rounded-md bg-gray-50 p-2 px-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600'
                onClick={openChainModal}>
                Wrong network
            </button>
        );
    }

    return (
        <div
            className="h-[48px] flex justify-center items-center px-3 border gap-2 rounded-md bg-gray-50 cursor-pointer text-sm font-medium hover:bg-sky-100 hover:text-blue-600"
            onClick={async () => {
                openAccountModal?.()
            }}
        >
            <Wallet />
            Wallet
        </div>
    );
};