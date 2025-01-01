import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { Camera } from "web-gphoto2";

/**
 * This is a handler function for first half phase of the app.
 * This includes phase one to three, which require camera peripheral to be active at the moment.
 * Phase one: Device initiation and Usage guidance
 * Phase two: User Preparartion
 * Phase three: Capture session
 * @returns 
 */
export default function CapturePhase() {
    let camera;
    const [phaseOne, setPhaseOne] = useState(false);

    useEffect(() => {
        try {
            camera = new Camera();
            camera.connect();
        }
        catch (error) {
            console.error("Ërror on connecting to camera device: ", error);
        }
    }, [])


    return (
    <>
        <Outlet/>
    </>)
}