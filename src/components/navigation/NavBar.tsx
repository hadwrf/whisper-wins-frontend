import Image from 'next/image';
import Link from 'next/link';
import NavLinks from './NavLinks';
import { ConnectBtn } from './ConnectButton';
import NotificationBell from '@/components/NotificationBell';

export default function NavBar() {
  return (
    <div className='flex justify-between bg-white p-4'>
      <Link href='/dashboard'>
        <Image
          src='/whisper-logo.svg'
          alt='Whisper wins logo'
          width={185}
          height={50}
        />
      </Link>
      <NavLinks />
      <div className='flex items-center'>
        <NotificationBell />
        <ConnectBtn />
      </div>
    </div>
  );
}
