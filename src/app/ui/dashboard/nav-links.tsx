import {
    HomeIcon,
    MegaphoneIcon,
    SparklesIcon,
    ShoppingBagIcon
} from '@heroicons/react/24/outline';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon },
    {
        name: 'Explore',
        href: '/dashboard/explore',
        icon: SparklesIcon,
    },
    { name: 'My Bids', href: '/dashboard/my-bids', icon: ShoppingBagIcon },
    { name: 'Create Auction', href: '/dashboard/create-auction', icon: MegaphoneIcon },
];

export default function NavLinks() {
    return (
        <div className="flex gap-3">
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <a
                        key={link.name}
                        href={link.href}
                        className="flex h-[48px] flex-none grow items-center justify-start gap-2 rounded-md bg-gray-50 p-2 px-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600"
                    >
                        <LinkIcon className="w-6" />
                        <p>{link.name}</p>
                    </a>
                );
            })}
        </div>
    );
}
