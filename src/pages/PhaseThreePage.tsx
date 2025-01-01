import { useState, useEffect, useRef } from "react"
import Icon from "../components/Icon";
import './PhaseThreePage.css'


export default function PhaseThreePage({}) {
    const sessionDuration = 10; // the total duration of the photo session
    const captureInterval = 2; // timer interval the camera captures


    const [stage, setStage] = useState<number>(1);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isRunning, setIsRunning] = useState(false); 
    const [timer, setTimer] = useState<number>(10);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);


    useEffect( () => {

        if (localStorage.getItem('hasUserInteracted') === 'true') {
            if (audioRef.current) {
              audioRef.current.play();
            }
          }

        let interval: NodeJS.Timeout;

        if (isRunning) {
            interval = setInterval(() => {
              setTimeElapsed((prevTime) => {
                if (prevTime < sessionDuration) return prevTime + 1;
                clearInterval(interval); 
                return prevTime;
              });
            }, 1000);
          } else {
          }

        timerRef.current = setInterval( () => {
            setTimer( (prevTimer) => {
                if(prevTimer <= 4 && prevTimer > 1) {
                    audioRef.current?.play()
                }
                if(prevTimer > 1) {
                    return prevTimer - 1;
                } else {
                    clearInterval(timerRef.current!);
                    return 0;
                }
            })

        }, 1000)


        const life = setInterval( () => {

        }, 60000);


        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
              }
            clearInterval(life);
            clearInterval(interval)
        }
    }, [])

    const handleStartStop = () => {
        setIsRunning((prev) => !prev);
      };

      const cursorPosition = (timeElapsed / sessionDuration) * 100;
      const checkpoints = [];
      for (let i = 0; i <= sessionDuration; i += captureInterval) {
        checkpoints.push(i);
      }

    return (
        <>
            <div className="min-h-lvh max-h-lvh bg-inverse-surface text-inverse-on-surface
            flex flex-col justify-items-center items-center p-4 gap-2">

                <div className="flex items-center justify-items-center gap-4 p-4 
                rounded text-inverse-on-surface text-4xl font-bold">
                    <span className="">{ timer }</span>
                    <Icon type="camera"></Icon>
                </div>

                <canvas className="rounded-lg">

                </canvas>
                
                <audio ref={audioRef} src="/assets/beep.mp3" />


                <div className="flex items-center p-4">

                    <div className="timer-container">
                        <div className="timer-line">
                            {/* Render checkpoints */}
                            {checkpoints.map((checkpoint) => (
                            <div
                                key={checkpoint}
                                className="checkpoint"
                                style={{ left: `${(checkpoint / sessionDuration) * 100}%` }}
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

                        <div className="controls">
                            <button onClick={handleStartStop}>{isRunning ? 'Pause' : 'Start'}</button>
                        </div>
                        </div>

                </div>
            </div>
        </>
    )
}