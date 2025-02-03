import { useEffect, useRef, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { useNavigate } from "react-router";
import { usePhase } from "../contexts/PhaseContext";
import BackendService from "../services/BackendService";
import { AppError } from "../helpers/AppError";
import useIdleTimer from "../hooks/useIdleTimer";

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
  const navigate = useNavigate();
  const [idle, setIdle] = useState<boolean>(false);
  const idleMessage = useIdleTimer(10 * 1000, idle);

  const cameraSetup = async () => {
    console.log("await for setup");
    await BackendService.setup();
    // await BackendService.checkup();
    // console.log("await for checkup");
  };

  const cleanSocket = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  // Handles when the page state is changed
  useEffect(() => {
    if (state === PageState.ERROR) {
      setIdle(true);
    }
  }, [state]);

  useEffect(() => {
    const initSocket = () => {
      const newSocket = new WebSocket("ws://localhost:8080");
      setSocket(newSocket);

      newSocket.binaryType = "blob";

      newSocket.onmessage = (event) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current.getContext("2d", {
          willReadFrequently: true,
        });
        const blob = new Blob([event.data], { type: "image/jpeg" });
        const img = new Image();
        img.src = URL.createObjectURL(blob);

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
          URL.revokeObjectURL(img.src);
        };
        img.onerror = function (err) {
          console.error("Failed to load stream:", err);
        };
      };

      newSocket.onclose = () => console.log("socket disconnected");
    };

    if (state === PageState.RUNNING) {
      initSocket();
      return () => {
        console.log("Returning?");
        if (socket) socket.close();
        setSocket(null);
      };
    }
  }, [state]);

  useEffect(() => {
    cameraSetup()
      .then(() => {
        setState(PageState.RUNNING);
        console.log("Page state is now running");
      })
      .catch((error) => {
        setState(PageState.ERROR);
        setErrorState(error);
      });

    return () => {
      cleanSocket();
    };
  }, []);

  const handleProceed = () => {
    cleanSocket();
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
                {idleMessage && (
                  <div className="absolute top-[2rem] left-[2rem] bg-tertiary text-on-tertiary p-4 rounded shadow">
                    {idleMessage}
                  </div>
                )}
                <div
                  className="m-8 p-8 rounded-lg bg-error w-[40vw] h-[60vh] flex
                  items-end justify-end text-wrap text-on-error text-[4rem] font-bold"
                >
                  {errorState?.toString()}
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
      <div className="min-h-dvh max-h-dvh bg-surface-container flex flex-col justify-center items-center gap-8 p-8">
        <div className="rounded-xl shadow-xl outline outline-primary outline-8 w-fit">
          <canvas ref={canvasRef} width={"1280"} height={"720"} />
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
