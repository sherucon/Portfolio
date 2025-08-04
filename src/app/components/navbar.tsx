'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import 'tailwindcss';

export default function Navbar() {
    const pathname = usePathname()

    return (
        <nav className='flex justify-center p-8 '>
            <ul className='flex justify-center items-center py-2 bg-neutral-0/30 backdrop-blur-[10px] shadow-lg border border-neutral-600/20 rounded-full z-50'>
                <li className='px-1'><Link href='/' className={`text-xs px-4 py-4 text-neutral-600 graphik-medium md:text-base md:px-9 ${pathname === '/' ? 'bg-neutral-200 rounded-full text-neutral-900' : ''}`}>Home</Link></li>
                <li className='px-1'><Link href='/about' className={`text-xs px-4 py-4 text-neutral-600 graphik-medium md:text-base md:px-9  ${pathname === '/about' ? 'bg-neutral-200 rounded-full text-neutral-900' : ''}`}>About</Link></li>
                <li className='px-1'><Link href='/work' className={`text-xs px-4 py-4 text-neutral-600 graphik-medium md:text-base md:px-9  ${pathname === '/work' ? 'bg-neutral-200 rounded-full text-neutral-900' : ''}`}><span style={{ color: '#ff4141', fontSize: 25, verticalAlign: 'middle' }}>• </span>
                    <span style={{ verticalAlign: 'middle' }}>Work</span></Link></li>
                <li className='px-1'><Link href='/contact' className={`text-xs px-4 py-4 text-neutral-600 graphik-medium md:text-base md:px-9  ${pathname === '/contact' ? 'bg-neutral-200 rounded-full text-neutral-900' : ''}`}>Contact</Link></li>
            </ul>
        </nav>
    )
}
