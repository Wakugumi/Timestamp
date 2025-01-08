import { useCallback, useRef, useState } from "react";
import { Camera } from 'web-gphoto2';
import CameraService from "../services/CameraService";
import { useNavigate } from "react-router";
import CaptureService from "../services/CaptureService";
import { DeviceError } from "../helpers/AppError";

interface Log {
  timestamp: string,
  message: string
}

export default function SettingPage() {
  const navigate = useNavigate();
  const cameraRef = useRef<Camera | null>(null);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [logState, setLogState] = useState<Log[]>([]);

  const log = (message: string) => {
    const datetime = new Date().toLocaleDateString();
    const newLog : Log = {
      timestamp: datetime,
      message: message,
    }
    setLogState( [ ...logState, newLog ] )
  }

  const handleCameraSetup = async () => {
    CameraService.setup()
    .then ( () => {
      if(!cameraRef.current) {
        cameraRef.current = CameraService.getInstance();
      }
      log("Camera setup resolved")
    })
    .catch( error => {
      setErrorState(error)
      console.error(error);
    })
  }

  const handleDevicePicker = useCallback( async () => {
    Camera.showPicker().then( () => {
      log("USB Device selected");
    })
  }, []);

  const handleTestCapture = async () => {
    const camera = CameraService.getInstance();
    try {
      const file = await camera.captureImageAsFile();
      // freeze for 2 second
      await new Promise(resolve => setTimeout(resolve, 5000));
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = file.name;
      a.click();
      log("Image captured");
    } catch (error) {
      setLogState( [ ...logState, { timestamp: new Date().toLocaleDateString(), message: "Failed to capture image" } ] )
    } finally {
      setLogState( [ ...logState, { timestamp: new Date().toLocaleDateString(), message: "Image captured" } ] )
    }
  }


  const handleConnectCamera = async () => {
    try {
      await CameraService.getInstance().connect();
      setLogState( [ ...logState, { timestamp: new Date().toLocaleDateString(), message: "Camera connected" } ] )
    }
    catch (error){
      console.error(error);
      setLogState( [ ...logState, { timestamp: new Date().toLocaleDateString(), message: error as string } ] )
    } finally {
    }
  }

  const handleDisconnectCamera = async () => {
    try {
      await CameraService.getInstance().disconnect();
      setLogState( [ ...logState, { timestamp: new Date().toLocaleDateString(), message: "Camera disconnected" } ] )

    }
    catch (error){
      console.error(error);
      setLogState( [ ...logState, { timestamp: new Date().toLocaleDateString(), message: error as string } ] )
    }
    finally {
    }
  }

  const handleReturn = () => {
    navigate('/');
  }

  return (<>
    <div className="grid grid-rows-2 grid-cols-6 min-h-lvh max-h-lvh p-12 gap-12 bg-surface-container">


      <div className="row-span-1 col-span-6 flex flex-col justify-end items-start p-8
      rounded-lg bg-inverse-surface text-slate-50">
        {
          ( logState && 
            <>
                { logState.map((value, index) => (
                <span key={index} className="font-mono">[{value.timestamp.toString()}] {value.message.toString()}</span>
                ))
            }
            </>
          )

          ||

          ( errorState &&
            <div className="p-4 bg-error rounded text-on-error flex-col gap-4 justify-start">
              <span className="text-xl">Internal Error</span>
              <p>{ errorState.toString() }</p>
            </div>
          )

          ||

          ( <span>...</span> )
        }
      </div>

      <div className="row-span-1 col-span-6 flex flex-wrap gap-4">
        <button className="p-8 flex btn items text-xl"
        onClick={handleDevicePicker}>
          USB Device Select
          </button>

                <button className="p-8 flex btn items text-xl" onClick={handleCameraSetup}>
          Setup Camera Service
        </button>

          <button className="p-8 flex btn items text-xl" onClick={handleConnectCamera}>
          Connect Camera
        </button>

        <button className="p-8 flex btn items text-xl" onClick={handleDisconnectCamera}>
          Disconnect Camera
        </button>



        <button className="p-8 flex btn items text-xl" onClick={handleTestCapture}>
          Test Capture Image
        </button>

          <button className="p-8 flex btn items text-xl"
        onClick={handleReturn}>
          Return
          </button>
          
      </div>

    </div>


  </>);
}
