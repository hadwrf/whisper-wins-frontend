'use client';
import { Hex } from '@flashbots/suave-viem';
import React from 'react';
import { QRCode } from 'react-qrcode-logo';

interface QRCodeProps {
  recipient: Hex;
  amount: number;
}

const BiddingQRCode: React.FC<QRCodeProps> = ({ recipient, amount }) => {
  const ethToWei = (eth: number): string => {
    return BigInt(eth * 10 ** 18).toString();
  };

  const link = `https://metamask.app.link/send/${recipient}@11155111?value=${ethToWei(amount)}`;

  return (
    <div className='inline-block overflow-hidden rounded-3xl border-4 border-[#1e1b4b] bg-[#f8fafc] p-5'>
      <QRCode
        value={link}
        size={400}
        bgColor='#f8fafc'
        fgColor='#1e1b4b'
        quietZone={0}
        qrStyle='fluid'
        eyeRadius={40}
      />
    </div>
  );
};

export default BiddingQRCode;
