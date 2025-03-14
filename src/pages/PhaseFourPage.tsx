import { useEffect, useRef } from "react";
import Page from "../components/Page";
import CameraPreview from "../components/CameraPreview";
import { usePhase } from "../contexts/PhaseContext";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import { resolve } from "path/win32";

export default function PhaseFourPage() {
  const phase = usePhase();
  const navigate = useNavigate();

  const handleConfirm = () => {
    (async () => {
      await Promise.resolve((resolve) => setTimeout(resolve, 3000));
      phase.setCurrentPhase(5);
      navigate("/phase5");
    })();
  };

  return (
    <>
      <Page className="flex flex-col justify-center items-center">
        <div className="flex-none">
          <span className="text-4xl">Are we good to go?</span>
        </div>
        <div className="flex-1 flex items-center">
          <CameraPreview />
        </div>
        <div className="flex-none">
          <Button onClick={handleConfirm}>Start</Button>
        </div>
      </Page>
    </>
  );
}
