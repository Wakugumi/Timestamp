import { useEffect, useRef } from 'react';
import CameraService from '../services/CameraService';

const CameraPreview = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect( () => {
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
    }, [])

    return (
        <>
            <div className="rounded-lg shadow outline outline-outline-variant">
                <video ref={videoRef} style={{ display: "none" }} />
                <canvas ref={canvasRef} width="640" height="480" />
            </div>
        </>
        )
}

export default CameraPreview;