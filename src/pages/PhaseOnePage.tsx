import { useEffect, useRef, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import CameraService from "../services/CameraService";
import { useNavigate } from "react-router";
import { usePhase } from "../contexts/PhaseContext";
import LoggerService from "../services/LoggerService";
import BackendService from "../services/BackendService";
import { AppError } from "../helpers/AppError";

enum PageState {
  RUNNING,
  LOADING,
  ERROR,
}

/**
 * Phase one of the app is initiating peripherals (camera, printers, etc.)
 * This page acts as event trigger to initiate the devices while displaying usage guide to user while loading
 * @returns JSX Element
 */
export default function PhaseOnePage() {
  const [errorState, setErrorState] = useState<string>("");
  const [state, setState] = useState<PageState>(PageState.LOADING);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const phaseContext = usePhase();
  const navigate = useNavigate();

  useEffect(() => {
    setState(PageState.LOADING);

    (async () => {
      await BackendService.setup();
      console.log("await for setup");
      await BackendService.checkup();
      console.log("await for checkup");
      await BackendService.startStream();
      setState(PageState.RUNNING);
    })().then(async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log(devices);
        const video = devices.find((dev) =>
          dev.label.includes("Dummy video device"),
        );

        if (video) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: video.deviceId },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (error) {
        setState(PageState.ERROR);
        setErrorState(error as string);
      }
    });
  }, []);

  const handleProceed = () => {
    phaseContext.setCurrentPhase(2);
    navigate("/phase2");
  };

  if (state !== PageState.RUNNING) {
    return (
      <>
        <div className="grid grid-cols-1 grid-rows-3 gap-4 min-h-lvh max-h-lvh">
          <div className="flex flex-col gap-4 row-span-3 justify-center items-center">
            {state === PageState.LOADING && (
              <>
                <LoadingAnimation className="text-primary" />
                <span className="text-xl text-on-surface">
                  Booting up our camera
                </span>
              </>
            )}

            {state === PageState.ERROR && (
              <>
                <div className="m-8 p-8 rounded-lg bg-error text-on-error">
                  {errorState.toString()}
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-dvh max-h-dvh bg-surface-container flex flex-col justify-center items-center gap-8 p-8">
        <div className="rounded-xl shadow-xl outline outline-primary outline-8 w-fit">
          <video ref={videoRef} width={"1280"} height={"720"} />
        </div>

        <div className="flex gap-4 items-center text-on-surface text-xl">
          <span>Are we good?</span>
          <button className="btn" onClick={handleProceed}>
            Proceed to preparation
          </button>
        </div>
      </div>
    </>
  );
}
