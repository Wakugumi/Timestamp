import { useEffect, useRef, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import CameraService from "../services/CameraService";

/**
 * Phase one of the app is initiating peripherals (camera, printers, etc.)
 * This page acts as event trigger to initiate the devices while displaying usage guide to user while loading
 * @returns JSX Element
 */
export default function PhaseOnePage() {
    const [errorState, setErrorState] = useState<string>("");
    const [cameraLoading, setCameraLoading] = useState<boolean>(true);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);


    useEffect( () => {
        (async() => { 
            
        await CameraService.setup()
            .then(() => {
                setCameraLoading(false);
                console.log("Camera setup call succeed")
            })
            .catch((error) => {
                throw new Error(error as string);
            })
        
    })()
    .then( () => {
        const renderer = async() => {
            try {
                if(canvasRef.current) {
                    await CameraService.getPreview(canvasRef.current);
                }
                animationFrameRef.current = requestAnimationFrame(renderer)


            } catch (error) {
                if( animationFrameRef.current ) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
                throw new Error(error as string);
            }
        }
        renderer();

    }).catch(error => {
        console.error('Failed to capture preview', error);
        setErrorState(error as string);
        if(animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        return
    });


    return () => {
        CameraService.getInstance().disconnect()
    }
    }, [])

    if (cameraLoading || (errorState != "")) {
        return (
            <>
                <div className="grid grid-cols-1 grid-rows-3 gap-4">
                    <div className="flex flex-col gap-4 row-span-2 justify-center items-center">
                        { cameraLoading && ( <>
                                <LoadingAnimation className="text-primary"/>
                                <span className="text-xl text-on-surface">
                                    Booting up our camera
                                </span>
                            </>
                        )}

                        { errorState && (
                            <>
                                <div className="m-8 p-8 rounded-lg bg-error text-on-error">
                                    { errorState.toString() }
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 grid-rows-1 gap-4">
                <div className="p-4">

                    <div className="rounded-lg shadow outline outline-outline-variant w-fit">
                        <video ref={videoRef} style={{ display: "none" }} />
                        <canvas className="mx-auto" ref={canvasRef} width={"1024"} height={"720"} />
                    </div>

                </div>
            </div>
        </>
    )
}