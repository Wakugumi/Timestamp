import { useState, useEffect, useRef } from "react";
import Icon from "../components/Icon";
import "./PhaseThreePage.css";
import LoadingAnimation from "../components/LoadingAnimation";

enum State {
  RUNNING,
  PROCESSING,
  FINISHING,
}

export default function PhaseFivePage({}) {
  const DURATION = 20;
  const INTERVAL = 5;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [state, setState] = useState<State | null>(State.RUNNING);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const [timer, setTimer] = useState<number>(INTERVAL);

  /**
   * Temporary function to simulate backend calls
   */
  const simulateBackend = async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  };

  /**
   * Forward call for every step of interval
   */
  const forward = () => {
    setTimer((prev) => prev - 1);
    setElapsed((prev) => prev + 1);
  };

  const cursorPosition = (elapsed / DURATION) * 100;

  // Generate checkpoints at specified intervals
  const checkpoints = [];
  for (let i = 0; i <= DURATION; i += INTERVAL) {
    checkpoints.push(i);
  }

  useEffect(() => {
    if (localStorage.getItem("hasUserInteracted") === "true") {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
  }, []);

  useEffect(() => {
    if (state !== State.RUNNING) return;
    if (timer <= 3) {
      if (audioRef.current) audioRef.current.play();
    }

    const interval = setInterval(async () => {
      if (elapsed >= DURATION) {
        clearInterval(interval);
        return;
      }
      if (elapsed < DURATION) {
        setTimer((prev) => prev - 1);
      }
      setElapsed((prev) => prev + 1);

      if ((elapsed + 1) % INTERVAL === 0) {
        setState(State.PROCESSING);
        await simulateBackend();
        setState(State.RUNNING);
        setTimer(INTERVAL);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state, elapsed, timer]);

  return (
    <>
      <div
        className="min-h-lvh max-h-lvh min-w-full bg-inverse-surface text-inverse-on-surface
            flex flex-col justify-between items-center p-4 gap-2"
      >
        <div
          className="flex items-center justify-items-center gap-4 p-4 
                rounded text-inverse-on-surface text-4xl font-bold"
        >
          <span className="">{timer}</span>
          <Icon type="camera"></Icon>
        </div>

        <div
          className="rounded-xl shadow-xl outline outline-primary outline-8 w-fit"
          style={{ width: "1280px", height: "720px" }}
        >
          {state === State.RUNNING && (
            <canvas
              className="mx-auto"
              ref={canvasRef}
              width={"1280"}
              height={"720"}
            />
          )}
          {state === State.PROCESSING && (
            <div className="flex justify-center justify-items-center items-center">
              <LoadingAnimation />
            </div>
          )}
          {errorState && (
            <div className="m-8 p-8 rounded-lg bg-error text-on-error">
              {errorState.toString()}
            </div>
          )}
        </div>

        <audio ref={audioRef} src="/assets/beep.mp3" />

        <div className="flex items-center p-4 w-full">
          <div className="timer-container">
            <div className="timer-line">
              {checkpoints.map((checkpoint) => (
                <div
                  key={checkpoint}
                  className="checkpoint"
                  style={{ left: `${(checkpoint / DURATION) * 100}%` }}
                ></div>
              ))}

              {/* Cursor */}
              <div
                className="cursor"
                style={{
                  left: `${cursorPosition}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
