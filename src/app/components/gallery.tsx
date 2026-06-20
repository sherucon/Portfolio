'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import GalleryNavBar, { Category } from './gallery-navbar';
import { redirect } from 'next/dist/server/api-utils';

const IMAGES: Record<Category, string[]> = {
    nature: [
        'IMG_20220811_155655__600x600.jpg',
        'IMG_20230305_075615__600x600.jpg',
        'IMG_20230402_062658__600x600.jpg',
        'IMG_20250620_080255__600x600.jpg',
        'IMG_20250623_150805__600x600.jpg',
    ],
    mountain: [
        'IMG_20250316_110714__600x600.jpg',
        'IMG_20250316_150400__600x600.jpg',
        'IMG_20250317_081837_1___600x600.jpg',
        'IMG_20250317_182056__600x600.jpg',
        'IMG_20250622_154149__600x600.jpg',
    ],
    animal: [
        'IMG_20241222_135941__600x600.jpg',
        'IMG_20250302_130928__600x600.jpg',
        'IMG_20250317_111610__600x600.jpg',
        'IMG_20250620_100417__600x600.jpg',
        'IMG_20260113_213940__600x600.jpg',
        'IMG_20260130_120456__600x600.jpg',
    ],
};

const FOLDER: Record<Category, string> = {
    nature: 'nature-comp',
    mountain: 'mountain-comp',
    animal: 'animals-comp',
};

const BASE_URL = 'https://r2.sherucon.tech';
const AUTOPLAY_MS = 4000;
const FADE_MS = 600;

function imgUrl(cat: Category, idx: number) {
    return `${BASE_URL}/${FOLDER[cat]}/${IMAGES[cat][idx]}`;
}

interface Slot { src: string; active: boolean }

export default function Gallery() {
    // FIX 2: initial visual, category state, and refs are all consistent
    const initialSrc = imgUrl('nature', 0);

    // Two permanently-rendered image slots — crossfade between them
    const [slotA, setSlotA] = useState<Slot>({ src: initialSrc, active: true });
    const [slotB, setSlotB] = useState<Slot>({ src: initialSrc, active: false });
    const topSlot = useRef<'A' | 'B'>('A'); // which slot is currently showing

    const [category, setCategory] = useState<Category>('nature');
    const [index, setIndex] = useState(0);
    const [timerKey, setTimerKey] = useState(0);

    const resetTimer = useCallback(() => setTimerKey(k => k + 1), []);

    // Refs so callbacks always see fresh values without re-creating
    const categoryRef = useRef<Category>('nature');
    const indexRef = useRef(0);

    // FIX 3: preload the next image in the sequence so crossfades are instant
    useEffect(() => {
        const imgs = IMAGES[category];
        const nextIdx = (index + 1) % imgs.length;
        const img = new Image();
        img.src = imgUrl(category, nextIdx);
    }, [category, index]);

    const crossfadeTo = useCallback((newSrc: string) => {
        // FIX 1: only swap active slots AFTER the incoming image has loaded
        // so the crossfade never starts on a blank frame
        const swap = () => {
            if (topSlot.current === 'A') {
                setSlotB({ src: newSrc, active: true });
                setSlotA(prev => ({ ...prev, active: false }));
                topSlot.current = 'B';
            } else {
                setSlotA({ src: newSrc, active: true });
                setSlotB(prev => ({ ...prev, active: false }));
                topSlot.current = 'A';
            }
        };

        const img = new Image();
        img.src = newSrc;
        if (img.complete) {
            // Already in browser cache — swap immediately
            swap();
        } else {
            img.onload = swap;
            img.onerror = swap; // don't block forever on a broken image
        }
    }, []);

    const next = useCallback(() => {
        const cat = categoryRef.current;
        const imgs = IMAGES[cat];
        const newIdx = (indexRef.current + 1) % imgs.length;
        indexRef.current = newIdx;
        setIndex(newIdx);
        crossfadeTo(imgUrl(cat, newIdx));
    }, [crossfadeTo]);

    const handleCategory = useCallback((cat: Category) => {
        if (cat === categoryRef.current) return;
        categoryRef.current = cat;
        indexRef.current = 0;
        setCategory(cat);
        setIndex(0);
        crossfadeTo(imgUrl(cat, 0));
        resetTimer();
    }, [crossfadeTo, resetTimer]);

    // Auto-play — restarts from zero whenever timerKey changes (manual click or category switch)
    // useEffect(() => {
    //     const id = setInterval(next, AUTOPLAY_MS);
    //     return () => clearInterval(id);
    // }, [next, timerKey]);

    const images = IMAGES[category];

    return (
        <div
            className="group relative w-full h-full cursor-touch overflow-hidden"
            onClick={() => { next(); resetTimer(); }}
        >


            {/* Slot A */}
            <img
                src={slotA.src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                    opacity: slotA.active ? 1 : 0,
                    transition: `opacity ${FADE_MS}ms ease-in-out`,
                    zIndex: slotA.active ? 1 : 0,
                }}
                draggable={false}
            />

            {/* Slot B */}
            <img
                src={slotB.src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                    opacity: slotB.active ? 1 : 0,
                    transition: `opacity ${FADE_MS}ms ease-in-out`,
                    zIndex: slotB.active ? 1 : 0,
                }}
                draggable={false}
            />

            {/* UI layer — always on top */}
            <div className="absolute inset-0" style={{ zIndex: 2, pointerEvents: 'none' }}>

                {/* Apple Photos badge — top-right */}
                <div
                    className="absolute top-3 right-3 cursor-touch"
                    style={{ width: 64, height: 64, pointerEvents: 'auto' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open('https://www.icloud.com/sharedalbum/#B2UJtdOXm1kR8YV', '_blank');
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 100 100">
                        <path d="M63.6 5c9 0 13.6 0 18.4 1.5 5.3 1.9 9.5 6.1 11.4 11.4C95 22.8 95 27.3 95 36.4v27.2c0 9 0 13.6-1.5 18.4-1.9 5.3-6.1 9.5-11.4 11.4C77.2 95 72.7 95 63.6 95H36.4c-9 0-13.6 0-18.4-1.5-5.3-2-9.5-6.2-11.5-11.5C5 77.2 5 72.7 5 63.6V36.4c0-9 0-13.6 1.5-18.4 2-5.3 6.2-9.5 11.5-11.5C22.8 5 27.3 5 36.4 5h27.2z" fill="#FFF" />
                        <path d="M35.8 38c.9 0 1.7.1 2.5.3-.2-.8-.3-1.7-.3-2.5V23c0-.6.1-1.1.1-1.6-4.7-3.5-11.4-3.1-15.6 1.1s-4.6 10.9-1.1 15.6c.5-.1 1.1-.1 1.6-.1h12.8z" fill="#FF7E7B" />
                        <path d="M49.2 47.7c-.6 0-1.1-.1-1.7-.2.1.5.2 1.1.2 1.7.3-.2.5-.4.8-.7.2-.3.4-.5.7-.8z" fill="#FF6F3F" />
                        <path d="M48.5 31.5c.6.6 1.2 1.3 1.6 2 .5-.7 1-1.4 1.6-2l9-9c.4-.4.7-.7 1.1-1C61.2 15.6 56.1 11 50 11c-6.1 0-11.1 4.5-11.9 10.4.5.3.9.7 1.3 1.1l9.1 9z" fill="#FFAC00" />
                        <path d="M51 47.7c-.3-.4-.7-.8-.9-1.3-.3.4-.6.9-.9 1.3h.8c.3.1.7 0 1 0z" fill="#FFC300" />
                        <path d="M38 35.8c0 .9.1 1.7.3 2.5 4.6 1 8.2 4.6 9.2 9.2.5.1 1.1.2 1.7.2.3-.4.7-.8.9-1.3-2.5-3.9-2.5-9 0-12.9-.5-.7-1-1.4-1.6-2l-9-9c-.4-.4-.9-.8-1.3-1.1-.1.5-.2 1-.2 1.6v12.8z" fill="#FF3400" />
                        <path d="M62 35.8c0 .9-.1 1.7-.3 2.5.8-.2 1.7-.3 2.5-.3H77c.6 0 1.2.1 1.8.2 3.5-4.7 3.2-11.4-1.1-15.7-4.3-4.3-11.1-4.6-15.8-1 .1.5.1 1 .1 1.5v12.8z" fill="#F0EA0D" />
                        <path d="M52.3 49c0-.5.1-1 .2-1.5-.5.1-1 .2-1.5.2.2.3.5.5.7.8.2.2.4.3.6.5z" fill="#DAE411" />
                        <path d="M51.7 31.5c-.6.6-1.2 1.3-1.6 2 2.5 3.9 2.5 9 0 12.9.3.4.6.9.9 1.3.5 0 1-.1 1.5-.2 1-4.6 4.6-8.2 9.2-9.2.2-.8.3-1.7.3-2.5V23c0-.5 0-1-.1-1.5-.4.3-.8.6-1.1 1l-9.1 9z" fill="#EAA200" />
                        <path d="M50.1 33.5c-2.5 3.9-2.5 9 0 12.9 2.5-3.9 2.5-8.9 0-12.9z" fill="#E63300" />
                        <path d="M52.2 50c0 .4 0 .8.1 1.2.5-.4 1-.8 1.5-1.1-.5-.3-1-.7-1.5-1.1 0 .3-.1.7-.1 1z" fill="#83D567" />
                        <path d="M89 50c0-6-4.4-11-10.2-11.8-.3.5-.7.9-1.1 1.3l-9 9c-.6.6-1.3 1.2-2 1.6.7.5 1.4 1 2 1.6l9 9c.4.4.7.7 1 1.1C84.5 61 89 56.1 89 50z" fill="#A2DD50" />
                        <path d="M64.2 38c-.9 0-1.7.1-2.5.3-1 4.6-4.6 8.2-9.2 9.2-.1.5-.2 1-.2 1.5.5.4 1 .8 1.5 1.1 3.9-2.5 9-2.5 12.9 0 .7-.5 1.4-1 2-1.6l9-9c.4-.4.8-.9 1.1-1.3-.6-.1-1.2-.2-1.8-.2H64.2z" fill="#8BC100" />
                        <path d="M61.7 38.3c-4.6 1-8.2 4.6-9.2 9.2 4.6-1 8.2-4.6 9.2-9.2z" fill="#8D8800" />
                        <path d="M64.2 62c-.9 0-1.7-.1-2.5-.3.2.8.3 1.7.3 2.5V77c0 .6-.1 1.1-.1 1.7 4.7 3.7 11.5 3.4 15.9-1 4.3-4.3 4.7-11.1 1-15.9-.7.1-1.2.2-1.8.2H64.2z" fill="#44C899" />
                        <path d="M51.2 52.3c.4 0 .9.1 1.3.2-.1-.4-.2-.9-.2-1.3-.2.2-.4.3-.6.5s-.3.4-.5.6z" fill="#4EBFBD" />
                        <path d="M68.7 51.7c-.6-.6-1.3-1.2-2-1.6-3.9 2.5-9 2.5-12.9 0-.5.3-1 .7-1.5 1.1 0 .4.1.9.2 1.3 4.6 1 8.2 4.6 9.2 9.2.8.2 1.7.3 2.5.3H77c.6 0 1.1-.1 1.7-.1-.3-.4-.6-.8-1-1.1l-9-9.1z" fill="#00A33F" />
                        <path d="M53.8 50.1c3.9 2.5 9 2.5 12.9 0-4-2.5-9-2.5-12.9 0z" fill="#008D08" />
                        <path d="M49 52.3c.4.5.8 1 1.1 1.5.3-.5.7-1 1.1-1.5-.4 0-.8-.1-1.2-.1-.3 0-.7.1-1 .1z" fill="#859ED5" />
                        <path d="M51.7 68.7c-.6-.6-1.2-1.3-1.6-2-.5.7-1 1.4-1.6 2l-9 9c-.4.4-.9.8-1.3 1.1C39 84.6 44 89 50 89c6.1 0 11-4.5 11.9-10.3-.4-.3-.8-.6-1.1-1l-9.1-9z" fill="#6EACDF" />
                        <path d="M62 64.2c0-.9-.1-1.7-.3-2.5-4.6-1-8.2-4.6-9.2-9.2-.4-.1-.9-.2-1.3-.2-.4.5-.8 1-1.1 1.5 2.5 3.9 2.5 9 0 12.9.5.7 1 1.4 1.6 2l9 9c.4.4.7.7 1.1 1 .1-.6.1-1.1.1-1.7V64.2z" fill="#1D7B97" />
                        <path d="M61.7 61.7c-1-4.6-4.6-8.2-9.2-9.2 1 4.6 4.6 8.2 9.2 9.2z" fill="#00683A" />
                        <path d="M47.7 51c0 .5-.1 1-.2 1.5.5-.1 1-.2 1.5-.2-.2-.2-.3-.4-.5-.6-.3-.2-.5-.4-.8-.7z" fill="#BE85C1" />
                        <path d="M38 64.2c0-.9.1-1.7.3-2.5-.8.2-1.7.3-2.5.3H23c-.5 0-1 0-1.5-.1-3.7 4.7-3.3 11.5 1 15.8 4.3 4.3 11 4.6 15.7 1.1-.1-.6-.2-1.2-.2-1.8V64.2z" fill="#AB86C4" />
                        <path d="M48.5 68.7c.6-.6 1.2-1.3 1.6-2-2.5-3.9-2.5-9 0-12.9-.3-.5-.7-1-1.1-1.5-.5 0-1 .1-1.5.2-1 4.6-4.6 8.2-9.2 9.2-.2.8-.3 1.7-.3 2.5V77c0 .6.1 1.2.2 1.8.5-.3.9-.7 1.3-1.1l9-9z" fill="#5D53A6" />
                        <path d="M50.1 66.7c2.5-3.9 2.5-9 0-12.9-2.5 3.9-2.5 8.9 0 12.9z" fill="#243F76" />
                        <path d="M47.7 49.2c-.4.3-.8.7-1.3.9.4.3.9.6 1.3.9 0-.3.1-.7.1-1 0-.3-.1-.6-.1-.8z" fill="#F1648A" />
                        <path d="M31.5 51.7c.6-.6 1.3-1.2 2-1.6-.7-.5-1.4-1-2-1.6l-9-9c-.4-.4-.8-.9-1.1-1.3C15.5 38.9 11 43.9 11 50c0 6.1 4.6 11.2 10.5 11.9.3-.4.6-.8 1-1.1l9-9.1z" fill="#E275A8" />
                        <path d="M31.5 48.5c.6.6 1.3 1.2 2 1.6 3.9-2.5 9-2.5 12.9 0 .4-.3.9-.6 1.3-.9 0-.6-.1-1.1-.2-1.7-4.6-1-8.2-4.6-9.2-9.2-.8-.2-1.7-.3-2.5-.3H23c-.6 0-1.1.1-1.6.1.3.5.7.9 1.1 1.3l9 9.1z" fill="#E40017" />
                        <path d="M38.3 38.3c1 4.6 4.6 8.2 9.2 9.2-1-4.6-4.6-8.2-9.2-9.2z" fill="#E60000" />
                        <path d="M35.8 62c.9 0 1.7-.1 2.5-.3 1-4.6 4.6-8.2 9.2-9.2.1-.5.2-1 .2-1.5-.4-.3-.8-.7-1.3-.9-3.9 2.5-9 2.5-12.9 0-.7.5-1.4 1-2 1.6l-9 9c-.4.4-.7.7-1 1.1.5.2 1 .2 1.5.2h12.8z" fill="#9F3174" />
                        <path d="M33.5 50.1c3.9 2.5 9 2.5 12.9 0-3.9-2.5-8.9-2.5-12.9 0z" fill="#9F0017" />
                        <path d="M38.3 61.7c4.6-1 8.2-4.6 9.2-9.2-4.6 1-8.2 4.6-9.2 9.2z" fill="#561E5D" />
                    </svg>
                </div>

                {/* Bottom gradient + navbar */}
                <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-2 pb-4 pt-12 bg-gradient-to-t from-black/00 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <div style={{ pointerEvents: 'auto' }}>
                        <GalleryNavBar active={category} onSelect={handleCategory} />
                    </div>
                </div>
            </div>
        </div>
    );
}