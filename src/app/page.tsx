import 'tailwindcss';


export default function Page() {
    return (
        <>
            {/* Container for blending context */}
            <div className="fixed inset-0">
                {/* Video Background */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 h-full object-cover"
                >
                    <source src="/homebg.mp4" type="video/mp4" />
                    Cool background video that your browser blocked 💔
                </video>

                {/* Text content */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-6xl w-full">

                        {/* Left Column - First on mobile, left on desktop */}
                        <div className="text-left lg:order-1 order-1">
                            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight helvetica" style={{ mixBlendMode: 'difference' }}>
                                HELLO<img src="/hellodecor.svg" className="fill-current inline-block mx-1 h-7 sm:h-9 md:h-11 lg:h-13 align-baseline" style={{ mixBlendMode: 'difference', filter: 'brightness(0) invert(1)' }} />&nbsp;&nbsp;&nbsp;<span> I'M</span><br />
                                CREATIVE<br />
                                TECHNOLOGIST
                            </h1>
                        </div>

                        {/* Right Column - Second on mobile, right on desktop */}
                        <div className="text-right lg:text-right lg:order-2 order-2">
                            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight helvetica" style={{ mixBlendMode: 'difference' }}>
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

