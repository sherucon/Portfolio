'use client';

import { useEffect, useRef } from 'react';

export default function Cursor() {
    const outerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const isTouch = useRef(false);

    useEffect(() => {
        // Detect if device supports touch to disable custom cursor on mobile
        if (window.matchMedia('(pointer: coarse)').matches) {
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (outerRef.current) {
                // Instantly track mouse without delay
                outerRef.current.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
            }

            const target = e.target as HTMLElement | null;
            // Check if hovering an interactive widget
            const newIsTouch = !!(target && target.closest && target.closest('.cursor-touch'));

            if (newIsTouch !== isTouch.current) {
                isTouch.current = newIsTouch;
                if (innerRef.current) {
                    if (newIsTouch) {
                        innerRef.current.style.opacity = '1';
                        innerRef.current.style.transform = 'scale(1)';
                    } else {
                        innerRef.current.style.opacity = '0';
                        innerRef.current.style.transform = 'scale(0.5)';
                    }
                }
            }
        };

        const handleMouseLeave = () => {
            // Hide cursor when leaving window or entering cross-origin iframe
            isTouch.current = false;
            if (innerRef.current) {
                innerRef.current.style.opacity = '0';
                innerRef.current.style.transform = 'scale(0.5)';
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div
            ref={outerRef}
            className="fixed top-0 left-0 pointer-events-none z-[9999]"
            style={{ width: 20, height: 20 }}
        >
            <div
                ref={innerRef}
                className="w-full h-full rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                style={{
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    border: '1px solid rgba(0,0,0,0.15)',
                    opacity: 0,
                    transform: 'scale(0.5)',
                }}
            />
        </div>
    );
}
