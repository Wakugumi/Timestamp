import { useEffect, useRef, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import CameraService from "../services/CameraService";
import { useNavigate } from "react-router";
import { usePhase } from "../contexts/PhaseContext";


/**
 * Phase one of the app is initiating peripherals (camera, printers, etc.)
 * This page acts as event trigger to initiate the devices while displaying usage guide to user while loading
 * @returns JSX Element
 */
export default function PhaseOnePage() {
    const [errorState, setErrorState] = useState<string>("");
    const [cameraLoading, setCameraLoading] = useState<boolean>(true);
    const [isCameraLoad, setIsCameraLoad] = useState<boolean | null>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const phaseContext = usePhase();
    const navigate = useNavigate();


    useEffect( () => {
        (async() => { 
            if(!isCameraLoad) {
                CameraService.setup()
                .then(() => {
                    setCameraLoading(false);
                    setIsCameraLoad(true);
                    console.log("Camera setup call succeed")
                })
                .catch((error) => {
                    setErrorState(error as string)
                    throw new Error(error as string);
                })
            } else {
                return;
            }
        
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
        setErrorState((error?.userMessage) as string);
        if(animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        return
    });


    return () => {
        CameraService.getInstance().disconnect()
    }
    }, []);

    const handleProceed = () => {
        phaseContext.setCurrentPhase(phaseContext.currentPhase + 1);
        navigate("/phase2");
    }

    if (cameraLoading || (errorState != "")) {
        return (
            <>
                <div className="grid grid-cols-1 grid-rows-3 gap-4 min-h-lvh max-h-lvh">
                    <div className="flex flex-col gap-4 row-span-3 justify-center items-center">
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
            <div className="min-h-lvh max-h-lvh bg-surface-container flex flex-col justify-center items-center gap-8">
                <div className="p-4">

                    <div className="rounded-xl shadow-xl outline outline-primary outline-8 w-fit">
                        <video ref={videoRef} style={{ display: "none" }} />
                        <canvas className="mx-auto" ref={canvasRef} width={"1280"} height={"720"} />
                    </div>

                </div>

                <div className="flex gap-4 items-center text-on-surface text-xl">
                    <span>Are we good?</span>
                    <button className="btn" onClick={ handleProceed }>Proceed to preparation</button>
                </div>
            </div>
        </>
    )
}