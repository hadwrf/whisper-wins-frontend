import Image from 'next/image';
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { PowerIcon } from '@heroicons/react/24/outline';

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
                <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                    <PowerIcon className="w-6" />
                    <div className="">Sign Out</div>
                </button>
            </form>
        </div>
    );
}
