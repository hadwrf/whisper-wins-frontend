import type { Metadata } from 'next';
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { inter } from '@/app/ui/fonts';
import Providers from '@/lib/wagmi-providers';
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
      </body>
    </html>
  );
}
