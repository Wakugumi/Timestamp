import { useEffect, useRef, useState } from "react";
import Page from "../components/Page";
import BackendService from "../services/BackendService";
import QR from "qrcode";
import { globalData } from "../contexts/DataContext";
import { on } from "process";
import LoadingAnimation from "../components/LoadingAnimation";

enum State {
  LOADING,
  PROCESSING,
  RUNNING,
  ERROR,
}

export default function PhaseEightPage() {
  const [state, setState] = useState<State>(State.LOADING);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const data = globalData();

  useEffect(() => {
    (async () => {
      const resp = await BackendService.process(
        data.pictures.length + 1,
        data.pictures,
      );
      if (qrCanvasRef.current)
        QR.toCanvas(qrCanvasRef.current, resp, (error: Error) => {
          console.error(error);
          throw error;
        });
      setState(State.RUNNING);
    })()
      .then(() => {})
      .catch((error) => {
        throw error;
      });
  }, []);

  return (
    <Page className="flex justify-center items-center">
      <div className="bg-surface outline rounded-xl shadow-xl flex flex-row justify-center p-12">
        <canvas width={1280} height={1280} ref={qrCanvasRef}></canvas>

        <div className="flex flex-col justify-center items-start gap-12">
          <h1 className="text-4xl">Scan this QR to download your pictures</h1>
          <span className="text-xl">
            Please wait while your photo is being printed
          </span>
        </div>
      </div>
    </Page>
  );
}
