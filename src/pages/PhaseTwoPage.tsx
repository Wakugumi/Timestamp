import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { usePhase } from '../contexts/PhaseContext';
import CameraService from '../services/CameraService';
import LoggerService from '../services/LoggerService';


/**
 * Phase two of the app is for user preparation.
 * This page shows live preview of the camera, and a button to start the next phase.
 * @returns JSX element
 */
export default function PhaseTwoPage() {
    const [message, setMessage] = useState<string | null>("Are you ready?");
    const [errorState, setErrorState] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const phaseContext = usePhase();
    const navigate = useNavigate();

    const renderer = async() => {
        if (!canvasRef.current) return;
        CameraService.getPreview(canvasRef.current as HTMLCanvasElement)
        .then(() => {
            animationFrameRef.current = requestAnimationFrame(renderer);    
        })
        .catch((error) => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            LoggerService.error(error as string);
            setErrorState(error as string);
        })
    }

    useEffect(() => {
        renderer();
    }, [])

    const handleStart = () => {
        if(containerRef.current) {
            containerRef.current.className = "min-h-lvh max-h-lvh bg-inverse-surface transition-all flex flex-col justify-center items-center gap-8 p-24"
        }

        setTimeout(() => {
            setMessage("3");
        }, 1000);
        setTimeout(() => {
            setMessage("2");
        }, 2000);
        setTimeout(() => {
            setMessage("1");
        }, 3000);
        setTimeout(() => {
            setMessage("Starting...");
        }, 4000);
        setTimeout(() => {
            phaseContext.setCurrentPhase(3);
            navigate('/phase3');
        }, 4000);

    }

    return (
        <>

            <div className="min-h-lvh max-h-lvh bg-surface-container transition-all
            flex flex-col justify-center items-center gap-8 p-24" ref={containerRef}>

                {errorState}

                <canvas ref={canvasRef} className="w-full rounded-lg outline outline-8 outline-primary">

                </canvas>
                <span className="text-8xl font-light text-surface absolute bottom-16 left-32">{message}</span>
                <button className="btn absolute bottom-16 right-32 px-24 text-4xl font-light" onClick={handleStart}>Start</button>
            </div>

        </>
    )
}