'use client';

import 'tailwindcss';
import { useEffect, useRef, useState } from 'react';

export default function Page() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoPlaying, setVideoPlaying] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        // React doesn't serialize the `muted` attr to the DOM — set it imperatively
        // so iOS/iPadOS Safari allows autoplay
        video.muted = true;
        video.play().catch(() => {
            // Autoplay was blocked — switch blend mode to normal so text is still readable
            setVideoPlaying(false);
        });
    }, []);

    return (
        <>
            {/* Container for blending context */}
            <div className="fixed inset-0 h-dvh">
                {/* Video Background */}
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    loop
                    className="absolute top-0 left-0 w-full h-full object-cover"
                >
                    <source src="/homebg.mp4" type="video/mp4" />
                    Cool background video that your browser blocked 💔
                </video>

                {/* Text content */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-6xl w-full">

                        {/* Left Column - First on mobile, left on desktop */}
                        <div className="text-left lg:order-1 order-1">
                            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight helvetica" style={{ mixBlendMode: videoPlaying ? 'difference' : 'normal', color: videoPlaying ? undefined : 'black', transform: videoPlaying ? 'translateZ(0)' : undefined }}>
                                HELLO<img src="/hellodecor.svg" alt="helloDecor" className="inline-block w-auto mx-1 h-6.5 sm:h-9 md:h-11 lg:h-13.5 align-baseline" style={{ mixBlendMode: videoPlaying ? 'difference' : 'normal', filter: 'brightness(0) invert(1)', transform: videoPlaying ? 'translateZ(0)' : undefined }} />&nbsp;&nbsp;&nbsp;<span> I&apos;M</span><br />
                                CREATIVE<br />
                                TECHNOLOGIST
                            </h1>
                        </div>

                        {/* Right Column - Second on mobile, right on desktop */}
                        <div className="text-right lg:text-right lg:order-2 order-2">
                            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight helvetica" style={{ mixBlendMode: videoPlaying ? 'difference' : 'normal', color: videoPlaying ? undefined : 'black', transform: videoPlaying ? 'translateZ(0)' : undefined }}>
                                <span className="hidden lg:inline"><br /></span>
                                SHREYANSH<br />
                                SINGH
                            </h1>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
