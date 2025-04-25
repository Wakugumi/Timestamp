import { useState, useEffect, useRef } from "react";
import Icon from "../components/Icon";
import "./PhaseFivePage.css";
import BackendService from "../services/BackendService";
import { usePhase } from "../contexts/PhaseContext";
import ErrorPage from "../components/ErrorPage";
import Page from "../components/Page";
import { globalData } from "../contexts/DataContext";
import Liveview from "../components/Liveview";

enum State {
  RUNNING,
  PROCESSING,
  FINISHING,
  ERROR,
}

export default function PhaseFivePage() {
  const { frame } = globalData();
  const INTERVAL = 5;
  const DURATION = INTERVAL * (frame?.count ? frame.count : 1);
  const STAGES = [];
  for (let i = 1; i <= DURATION / INTERVAL; i++) STAGES.push(i);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const phase = usePhase();
  const [errorState, setErrorState] = useState<string | null>(null);
  const [state, setState] = useState<State | null>(State.RUNNING);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const [timer, setTimer] = useState<number>(INTERVAL);
  const [stage, setStage] = useState<number>(1);
  const [pause, setPause] = useState<boolean>(false);
  const data = globalData();
  const [width, setWidth] = useState<number>(1280);

  /**
   * Capture handling
   */
  const _capture = async (): Promise<void> => {
    setPause(true);
    await setTimeout(() => {}, 1000); // This is VERY IMPORTANT to let camera stop stream
    try {
      canvasRef.current?.classList.add("capturing");
      await BackendService.capture();
    } catch (error) {
      setState(State.ERROR);
      setErrorState(error as string);
      throw error;
    } finally {
      canvasRef.current?.classList.remove("capturing");
      setStage(stage + 1);
      setPause(false);
    }
  };

  const handleFinish = () => {
    phase.next();
  };

  useEffect(() => {
    const ratio = (data.frame?.layouts[0].Width as number) / width;
    setWidth(width * ratio);

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
      try {
        if (elapsed >= DURATION) {
          clearInterval(interval);
          handleFinish();
          return;
        }
        if (elapsed < DURATION) {
          setTimer((prev) => prev - 1);
        }

        setElapsed(elapsed + 1);

        if ((elapsed + 1) % INTERVAL === 0) {
          setState(State.PROCESSING);
          await _capture();
          setTimer(INTERVAL);
          setState(State.RUNNING);
        }
      } catch (error) {
        setState(State.ERROR);
        setErrorState(error as string);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [state, elapsed, timer]);

  if (state === State.ERROR)
    return (
      <>
        <Page>
          <ErrorPage message={errorState as string} />
        </Page>
      </>
    );

  if (state === State.RUNNING || state === State.PROCESSING)
    return (
      <>
        <div
          className="min-h-lvh max-h-lvh min-w-full overflow-hidden bg-inverse-surface text-inverse-on-surface
            flex flex-col justify-evenly items-center p-4 gap-2"
        >
          <div
            className="flex items-center justify-items-center gap-4 p-4 
                rounded text-inverse-on-surface text-4xl font-bold"
          >
            <span className="">{timer}</span>
            <Icon type="camera"></Icon>
          </div>

          {(state === State.RUNNING || state === State.PROCESSING) && (
            <div className="flex flex-col items-center justify-center gap-4">
              <Liveview pause={pause} />
              <div className="flex items-center justify-evenly">
                {STAGES.map((index) => (
                  <div
                    className={`rounded-full px-8 py-4 text-white ${index === stage ? `border shadow-inset` : ""}`}
                    key={index}
                  >
                    {index}
                  </div>
                ))}
              </div>
            </div>
          )}

          <audio ref={audioRef} src="/assets/beep.mp3" />
        </div>
      </>
    );
}
