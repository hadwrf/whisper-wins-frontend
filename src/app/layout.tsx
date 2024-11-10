import { inter } from '@/app/ui/fonts';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/lib/wagmi-providers';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Whisper Wins',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let cookie: string | null = null;
  Promise.resolve(headers()).then((header) => {
    cookie = header.get('cookie');
  });

  return (
    <html lang='en'>
      <body className={`${inter.className} antialiased`}>
        <Providers cookie={cookie}>{children}</Providers>
        <SpeedInsights />
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
