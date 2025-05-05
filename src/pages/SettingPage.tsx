import { useState } from "react";
import CameraPreview from "../components/CameraPreview";
import Button from "../components/Button";
import BackendService from "../services/BackendService";
import LoadingAnimation from "../components/LoadingAnimation";

interface Log {
  timestamp: string;
  message: string;
}

enum State {
  PROCESSING,
  RUNNING,
}

export default function SettingPage() {
  const [logState, setLogState] = useState<Log[]>([]);
  const [active, setActive] = useState<boolean>(false);
  const [preview, setPreview] = useState<boolean>(false);
  const Liveview = <CameraPreview pause={!active} width="720" height="480" />;
  const [state, setState] = useState<State>(State.RUNNING);

  const log = (message: string) => {
    const datetime = new Date().toLocaleDateString();
    const newLog: Log = {
      timestamp: datetime,
      message: message,
    };
    setLogState([...logState, newLog]);
  };

  const _boot = () => {
    (async () => {
      setState(State.PROCESSING);
      await BackendService.setup()
        .then(() => {
          setState(State.RUNNING);
          log("Camera boot resolve and is available");
        })
        .catch((error: Error) => {
          log(error.message);
          setState(State.RUNNING);
        });
    })();
  };
  const _checkup = async () => {
    setState(State.PROCESSING);
    await BackendService.checkup()
      .then(() => {
        setState(State.RUNNING);
        log("Camera checkup resolved, returned with ok");
      })
      .catch((error: Error) => {
        setState(State.RUNNING);
        log(error.message);
      });
  };
  const _capture = () => {
    (async () => {
      setActive(false);
      setState(State.PROCESSING);

      await BackendService.capture()
        .then((response) => {
          setState(State.RUNNING);
          setActive(true);
          console.log(response);
          log(response as string);
        })
        .catch((error: Error) => {
          log(error.message);
          setState(State.RUNNING);
        });
    })();
  };

  const _cleanup = async () => {
    setState(State.PROCESSING);
    await BackendService.end()
      .then((response) => {
        log(response as string);
      })
      .catch((error: Error) => {
        log(error.message);
      })
      .finally(() => {
        setState(State.RUNNING);
      });
  };

  const _liveview = (bool: boolean) => {
    setActive(bool);
    setPreview(bool);
  };

  return (
    <>
      <div className="grid grid-rows-2 grid-cols-2 gap-4 min-h-lvh max-h-lvh p-12 gap-12 bg-surface-container">
        {/** Command Panel */}
        <div className="row-span-2 flex flex-wrap items-start justify-start gap-4">
          <Button disabled={state === State.PROCESSING} onClick={() => _boot()}>
            Activate Camera
          </Button>

          <Button
            disabled={state === State.PROCESSING}
            onClick={() => _checkup()}
          >
            Camera Checkup
          </Button>
          <Button
            disabled={state === State.PROCESSING}
            onClick={() => _capture()}
          >
            Capture
          </Button>

          <Button
            disabled={state === State.PROCESSING}
            onClick={() => _cleanup()}
          >
            Clean Up Captures
          </Button>
          <Button
            disabled={state === State.PROCESSING}
            onClick={() => _liveview(!preview)}
          >
            {preview ? "Unmount liveview" : "Mount liveview"}
          </Button>
        </div>

        {/** Camera preview */}
        <div
          className="flex items-stretch justify-center p-8
        rounded-lg outline-outline outline-4"
        >
          {state === State.PROCESSING && <LoadingAnimation />}
          {preview && Liveview}
        </div>

        {/** Terminal logger */}
        <div
          className="col-start-2 flex flex-col items-start justify-start p-8
      rounded-lg bg-inverse-surface text-slate-50 overflow-y-scroll"
        >
          {logState && (
            <>
              {logState.map((value, index) => (
                <span key={index} className="font-mono">
                  [{value.timestamp}] {value.message}
                </span>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
