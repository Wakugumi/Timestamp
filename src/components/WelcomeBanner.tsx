import { useEffect, useRef } from "react"

export default function WelcomeBanner() {
    const objectRef = useRef<HTMLDivElement>(null);
    const speed = 200;
    const size = 200;

    const images = [
        "/public/assets/banner/image1.png",
        "/public/assets/banner/image2.png",
        "/public/assets/banner/image3.png",
    ]

    useEffect(() => {
        const element : HTMLElement = objectRef.current as HTMLElement

        if (!element) return;

        const keyframes = [
            { transform: 'translateY(0)' },
            { transform: `translateY(-${element.scrollHeight / 2}px`}
        ];

        const animation = element.animate(keyframes, {
            duration: (element.scrollHeight / speed) * 1000,
            iterations: Infinity,
            easing: 'linear'
        });

        return () => animation.cancel();
        
    }, [speed])

    return (
        <>
        <div className="w-full h-full overflow-hidden relative p-4
         bg-secondary text-on-secondary">

            <div className="w-full h-full relative
            flex flex-col scroll-smooth"
            ref={objectRef}>

                <div className="flex flex-col items-center justify-start gap-24">

                    { images.map((value, index) => (
                        <div className="flex items-center justify-center flex-shrink-0" 
                        key={index} style={{ width: size, height: size}}>

                            <img src={value} style={{ width: '100%', height: '100%'}}/>
                            </div>
                    ))}


                { images.map((value, index) => (
                        <div className="flex items-center justify-center flex-shrink-0" 
                        key={images.length + index} style={{ width: size, height: size}}>

                            <img src={value} style={{ width: '100%', height: '100%'}}/>
                            </div>
                    ))}

                    

                </div>

            </div>

        </div>
        </>
    )
}