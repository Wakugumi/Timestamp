import { useEffect, useRef, useState } from "react";
import Page from "../components/Page";
import BackendService from "../services/BackendService";
// @ts-ignore
import QR from "qrcode";
import { globalData } from "../contexts/DataContext";
import LoadingAnimation from "../components/LoadingAnimation";
import useIdleTimer from "../hooks/useIdleTimer";
import Button from "../components/Button";
import BoothManager from "../services/BoothManager";

enum State {
  LOADING,
  PROCESSING,
  RUNNING,
  ERROR,
}

export default function PhaseEightPage() {
  const [state, setState] = useState<State>(State.LOADING);
  const [url, setUrl] = useState<string>("");
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [idle, setIdle] = useState(false);
  const data = globalData();

  const handleFinish = async () => {
    await BoothManager.end();
  };
  useIdleTimer(60000, idle, handleFinish);

  useEffect(() => {
    if (state === State.LOADING)
      (async () => {
        const resp = await BackendService.finalize(
          data.pictures.length + 1,
          data.pictures,
        );
        setUrl(resp as string);
        setState(State.RUNNING);
      })().catch((error) => {
        throw error;
      });

    if (state === State.RUNNING)
      if (qrCanvasRef.current)
        QR.toCanvas(qrCanvasRef.current, url, (error: Error) => {
          if (error) {
            console.error(error);
            throw error;
          }
        });
    setIdle(true);
  }, [state]);

  return (
    <Page className="flex justify-center items-center">
      <div className="flex-1 bg-surface outline rounded-xl shadow-xl flex flex-row justify-center p-12">
        <canvas
          width={1280}
          height={1280}
          ref={qrCanvasRef}
          className="h-[20rem] w-[20rem]"
        ></canvas>
        {state === State.LOADING && (
          <>
            <LoadingAnimation />
            <span>We are compiling your photos</span>
          </>
        )}

        {state === State.RUNNING && (
          <div className="flex-1 flex flex-col justify-center items-start gap-12">
            <h1 className="text-4xl">Scan this QR to download your pictures</h1>
            <span className="text-xl">
              Please wait while your photo is being printed
            </span>

            <span className="text-xl">Thank you for using our service</span>

            <Button onClick={() => handleFinish()}>I'm Done</Button>
          </div>
        )}
      </div>
    </Page>
  );
}
