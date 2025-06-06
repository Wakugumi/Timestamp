import { useEffect, useRef, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { usePhase } from "../contexts/PhaseContext";
import BackendService from "../services/BackendService";
import { AppError } from "../helpers/AppError";
import useIdleTimer from "../hooks/useIdleTimer";
import ErrorPage from "../components/ErrorPage";

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
    await BackendService.checkup();
    return;
  };

  /** Setup related to external resource */
  const _boothSetup = async () => {};

  /** Centralized setups **/
  const _setup = async () => {
    setState(PageState.LOADING);
    await _cameraSetup();

    await _boothSetup();
  };

  // Handle cleaning socket
  const _cleanSocket = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  /** Video stream handler */
  const _videoStream = () => {
    console.log("Video stream called");
    const newSocket = new WebSocket("ws://localhost:8080");
    setSocket(newSocket);

    newSocket.binaryType = "blob";

    let imageBuffer: ArrayBuffer[] = [];
    window.electron?.onStream((chunk: ArrayBuffer) => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current.getContext("2d", {
        willReadFrequently: true,
      });

      imageBuffer.push(chunk);

      const blob = new Blob(imageBuffer, { type: "image/jpeg" });

      const url = URL.createObjectURL(blob);

      const img = new Image();
      img.onload = function render() {
        canvas?.clearRect(
          0,
          0,
          canvasRef.current?.width as number,
          canvasRef.current?.height as number,
        );
        canvas?.drawImage(
          img,
          0,
          0,
          canvasRef.current?.width as number,
          canvasRef.current?.height as number,
        );
        URL.revokeObjectURL(url);
      };
      img.src = url;
      imageBuffer = [];

      img.onerror = function (err) {
        console.error("Failed to load stream:", err);
      };
    });

    newSocket.onclose = () => console.log("socket disconnected");
  };

  // Handles when the page state is changed
  useEffect(() => {
    if (state === PageState.RUNNING) {
      _videoStream();
      return () => {
        console.log("Returning?");
        if (socket) socket.close();
        setSocket(null);
      };
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
        throw error;
      });
    return () => {
      _cleanSocket();
    };
  }, []);

  const handleNext = () => {
    _cleanSocket();
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

                <ErrorPage
                  code={errorState?.code}
                  message={errorState?.technicalMessage as string}
                />
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  if (state === PageState.RUNNING) handleNext();
}
