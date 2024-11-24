'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: 'Home', href: '/dashboard' },
  {
    name: 'Explore',
    href: '/dashboard/explore',
  },
  { name: 'My Bids', href: '/dashboard/my-bids' },
  { name: 'My NFTs', href: '/dashboard/my-nfts' },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className='flex gap-3'>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] flex-none grow items-center justify-start gap-2 rounded-md bg-gray-50 p-2 px-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <p>{link.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
