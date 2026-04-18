'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Work', path: '/work' },
    { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
    const pathname = usePathname();

    const activeIndex =
        tabs.findIndex((tab) => tab.path === pathname) === -1
            ? 0
            : tabs.findIndex((tab) => tab.path === pathname);

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <div className="relative flex w-[340px] h-14 bg-black/80 backdrop-blur-md border border-white/20 rounded-full p-1">

                {/* Sliding pill */}
                <div
                    className="absolute top-1 left-1 h-12 w-1/4 bg-white/20 rounded-full transition-transform duration-300"
                    style={{
                        transform: `translateX(${activeIndex * 100}%)`,
                    }}
                />

                {/* Tabs */}
                {tabs.map((tab, i) => (
                    <Link
                        key={tab.path}
                        href={tab.path}
                        className={`flex-1 flex items-center justify-center text-sm font-medium rounded-full z-10 transition-colors ${pathname === tab.path
                                ? 'text-white'
                                : 'text-white/60 hover:text-white'
                            }`}
                    >
                        {tab.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}