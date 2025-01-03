import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { usePhase } from '../contexts/PhaseContext';


/**
 * Phase two of the app is for user preparation.
 * This page shows live preview of the camera, and a button to start the next phase.
 * @returns JSX element
 */
export default function PhaseTwoPage() {
    const [errorState, setErrorState] = useState<string>("");
    const [cameraState, setCameraState] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const phaseContext = usePhase();
    const navigate = useNavigate




    return (
        <>

            <div className="min-h-lvh max-h-lvh bg-surface-container
            flex flex-col justify-center items-center gap-8">

                

            </div>

        </>
    )
}