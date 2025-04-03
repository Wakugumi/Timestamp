import { useEffect, useRef, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { useNavigate } from "react-router";
import { usePhase } from "../contexts/PhaseContext";
import BackendService from "../services/BackendService";
import { AppError } from "../helpers/AppError";
import useIdleTimer from "../hooks/useIdleTimer";
import Button from "../components/Button";
import CameraPreview from "../components/CameraPreview";

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
  const [errorState, setErrorState] = useState<AppError | null>(null);
  const [loadingState, setLoadingState] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [state, setState] = useState<PageState>(PageState.LOADING);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const phaseContext = usePhase();
  const [idle, setIdle] = useState<boolean>(false);
  const idleMessage = useIdleTimer(10 * 1000, idle);

  /** Setup related to internal component */
  const _cameraSetup = async () => {
    console.log("[PhaseOnePage] Camera setup");
    await BackendService.setup();
    //console.log("[PhaseOnePage] Camera checkup");
    //await BackendService.checkup();
    return;
  };

  /** Setup related to external resource */
  const _boothSetup = async () => {};

  /** Centralized setups **/
  const _setup = async () => {
    try {
      setState(PageState.LOADING);
      setLoadingState("We're checking our camera");
      await _cameraSetup();

      setLoadingState("We're preparing our booth for use");
      await _boothSetup();
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (state === PageState.RUNNING) {
    }

    if (state === PageState.ERROR) {
      setIdle(true);
    }
  }, [state]);

  /** Main effect, once */
  useEffect(() => {
    _setup()
      .then(() => {
        setState(PageState.RUNNING);
      })
      .catch((error: AppError) => {
        setState(PageState.ERROR);
        setErrorState(error);
      });
    return () => {};
  }, []);

  const handleProceed = () => {
    phaseContext.next();
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
                {idleMessage && (
                  <div className="absolute top-[2rem] left-[2rem] bg-tertiary text-on-tertiary p-4 rounded shadow">
                    {idleMessage}
                  </div>
                )}
                <div
                  className="m-8 p-8 rounded-lg bg-error w-[40vw] h-[60vh] flex
                  items-end justify-end text-wrap text-on-error text-[4rem] font-bold"
                >
                  {errorState?.userMessage}
                </div>
                <span
                  className="px-8 w-[40vw] flex
                  items-start justify-start text-wrap text-error font-bold"
                >
                  Code: {errorState?.code}
                </span>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-dvh max-h-dvh bg-surface-container flex flex-col justify-center items-center gap-12 p-8">
        <div className="rounded-xl shadow-xl outline outline-primary outline-8 w-fit">
          <CameraPreview />
        </div>
        <div className="flex gap-4 items-center text-on-surface text-xl">
          <span>Can you see yourself?</span>
          <Button onClick={() => handleProceed()}>Yes, I can see myself</Button>
        </div>
      </div>
    </>
  );
}
