'use client';

import { Leaf, Mountain, Cat } from 'lucide-react';

export type Category = 'nature' | 'mountain' | 'animal';

interface Props {
    active: Category;
    onSelect: (cat: Category) => void;
}

const tabs: { icon: React.ReactNode; cat: Category }[] = [
    { icon: <Leaf size={15} />, cat: 'nature' },
    { icon: <Mountain size={15} />, cat: 'mountain' },
    { icon: <Cat size={15} />, cat: 'animal' },
];

export default function GalleryNavBar({ active, onSelect }: Props) {
    const activeIndex = tabs.findIndex((t) => t.cat === active);

    return (
        <div className="relative flex items-center h-[50px] px-1 rounded-full bg-black/30 backdrop-blur-xl ring-1 ring-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.25)] pointer-events-auto w-fit">

            {/* Sliding active pill */}
            <div
                className="absolute top-1 left-1 h-[calc(100%-8px)] rounded-full bg-white/25 ring-1 ring-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_8px_rgba(0,0,0,0.2)] transition-transform duration-[300ms] ease-[cubic-bezier(1,0,0.4,1)]"
                style={{
                    width: 'calc((100% - 8px) / 3)',
                    transform: `translateX(${activeIndex * 100}%)`,
                }}
            />

            {tabs.map((tab) => (
                <button
                    key={tab.cat}
                    onClick={(e) => { e.stopPropagation(); onSelect(tab.cat); }}
                    className={[
                        'relative z-10 flex items-center justify-center',
                        'w-[70px] h-full rounded-full cursor-pointer',
                        'transition-colors duration-200',
                        active === tab.cat
                            ? 'text-white'
                            : 'text-white/50 hover:text-white/80',
                    ].join(' ')}
                >
                    {tab.icon}
                </button>
            ))}
        </div>
    );
}
