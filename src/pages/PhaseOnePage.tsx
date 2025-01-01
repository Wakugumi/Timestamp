import { useEffect, useRef, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import CameraService from "../services/CameraService";

/**
 * Phase one of the app is initiating peripherals (camera, printers, etc.)
 * This page acts as event trigger to initiate the devices while displaying usage guide to user while loading
 * @returns JSX Element
 */
export default function PhaseOnePage() {
    const [refresh, setRefresh] = useState<boolean>(true);
    const [errorState, setErrorState] = useState<string>("");
    const [cameraLoading, setCameraLoading] = useState<boolean>(true);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);


    const handleSelectDevice = async () => {
        await CameraService.selectCamera();
        setRefresh(!refresh)
    }

    useEffect( () => {
        (async() => { 
            
        CameraService.setup()
            .then(() => {
                setCameraLoading(false);
                console.log("Camera setup call succeed")
            })
            .catch((error) => {
                setErrorState(error as string);
                throw new Error(error as string);
            })

            

        
    })()
    .then( () => {
        const camera = CameraService.getInstance()
                camera.capturePreviewAsBlob()
                .then( (blob) => {
                    const url = URL.createObjectURL(blob);

                    const img = new Image();
                    img.src = url;
                    img.onload = () => {
                        const canvas = canvasRef.current as HTMLCanvasElement;
                        const context = canvas?.getContext('2d');
                        context?.drawImage(img, 0, 0, canvas?.width, canvas?.height)
                        URL.revokeObjectURL(url)
                    }
                })
                .catch(error => {
                
                    console.error('Failed to capture preview', error);
                });
    }).catch(error => {
        setErrorState(error as string);
        return
    });
    }, [refresh])


    if(errorState != "") {
        return (
            <>
                <div className="m-8 p-8 rounded-lg bg-error text-on-error">
                    { errorState }
                </div>
            </>
        )
    }


    return (
        <>
        
            <div className="grid grid-cols-1 grid-rows-3 gap-4">
                <div className="flex flex-col gap-4 justify-center items-center">
                    { cameraLoading && ( <>
                            <LoadingAnimation className="text-primary"/>
                            <span className="text-xl text-on-surface">
                                Booting up our camera
                            </span>
                        </>
                    )}

                    {errorState && (
                        <>
                            <div className="m-8 p-8 rounded-lg bg-error text-on-error">
                                { errorState }
                            </div>
                        </>
                    )}

                </div>
                <div className="row-span-2">

                    <div className="rounded-lg shadow outline outline-outline-variant">
                        <video ref={videoRef} style={{ display: "none" }} />
                        <canvas ref={canvasRef} width="640" height="480" />
                    </div>
                    <button onClick={handleSelectDevice}>Select Camera</button>
                </div>
            </div>

        </>
    )
}