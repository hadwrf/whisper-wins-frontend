import { PowerIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import NavLinks from './NavLinks';

export default function NavBar() {
    return (
        <div className="flex justify-between p-4">
            <Link
                href="/dashboard"
            >
                <Image
                    src="/whisper-logo.svg"
                    alt="Whisper wins logo"
                    width={185}
                    height={50}
                />
            </Link>
            <NavLinks/>
            <form>
                <button className="flex h-[48px] w-full flex-none grow items-center justify-start gap-2 rounded-md bg-gray-50 p-2 px-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600">
                    <PowerIcon className="w-6" />
                    <div className="">Sign Out</div>
                </button>
            </form>
        </div>
    );
}
