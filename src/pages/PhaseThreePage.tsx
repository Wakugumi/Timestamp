import { useState, useEffect, useRef } from "react"
import Icon from "../components/Icon";
import './PhaseThreePage.css'
import LoggerService from "../services/LoggerService";
import CaptureService from "../services/CaptureService";
import CameraService from "../services/CameraService";


export default function PhaseThreePage({}) {
    const sessionDuration = 10; // the total duration of the photo session
    const captureInterval = 5; // timer interval the camera captures


    const [stage, setStage] = useState<number>(1);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isRunning, setIsRunning] = useState(false); 
    const [timer, setTimer] = useState<number>(0);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [errorState, setErrorState] = useState<string | null>(null);

    /**
     * Object reference for interval timer
     */
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    
    /**
     * Object reference for duration timer
     */
    const durationRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const triggerCapture = async () => {
        try {
            await CaptureService.takeCapture();
        }
        catch (error) {
            LoggerService.error("Failed to capture image: ", error as string);
        }

    }

    const renderer = async() => {
        // if (!canvasRef.current) return;
        // CameraService.getPreview(canvasRef.current as HTMLCanvasElement)
        // .then(() => {
        //     animationFrameRef.current = requestAnimationFrame(renderer);    
        // })
        // .catch((error) => {
        //     if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        //     LoggerService.error(error as string);
        //     setErrorState(error as string);
        // })
    }

    useEffect( () => {
        renderer();

        if (localStorage.getItem('hasUserInteracted') === 'true') {
            if (audioRef.current) {
              audioRef.current.play();
            }
          }
    }, [])

    useEffect( () => {
        
        timerRef.current = setTimeout(() => {
            setTimeElapsed((prev) => prev + 1);
        }, 1000);

        if(timeElapsed >= sessionDuration) {
            console.log("Session ended");
            return;
        }
        setTimer((prev) => prev - 1);
    }, [timeElapsed])

    const cursorPosition = (timeElapsed / sessionDuration) * 100;
    const checkpoints = [];
    for (let i = 0; i <= sessionDuration; i += captureInterval) {
    checkpoints.push(i);
    }

    return (
        <>
            <div className="min-h-lvh max-h-lvh min-w-full bg-inverse-surface text-inverse-on-surface
            flex flex-col justify-between items-center p-4 gap-2">

                <div className="flex items-center justify-items-center gap-4 p-4 
                rounded text-inverse-on-surface text-4xl font-bold">
                    <span className="">{ timer }</span>
                    <Icon type="camera"></Icon>
                </div>

                <div className="rounded-xl shadow-xl outline outline-primary outline-8 w-fit">
                    <canvas className="mx-auto" ref={canvasRef} width={"1280"} height={"720"} />
                    { errorState && (
                        <div className="m-8 p-8 rounded-lg bg-error text-on-error">
                            { errorState.toString() }
                            </div>
                    )}p
                </div>
                
                <audio ref={audioRef} src="/assets/beep.mp3" />


                <div className="flex items-center p-4 w-full">

                    <div className="timer-container">
                        <div className="timer-line">
                            {/* Render checkpoints */}
                            {checkpoints.map((checkpoint) => (
                            <div
                                key={checkpoint}
                                className="checkpoint"
                                style={{ left: `${(checkpoint / sessionDuration) * 100}%` }}
                            ></div>
                            ))}

                            {/* Cursor */}
                            <div
                            className="cursor"
                            style={{
                                left: `${cursorPosition}%`,
                            }}
                            ></div>
                        </div>

                        </div>

                </div>
            </div>
        </>
    )
}