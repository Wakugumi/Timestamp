import { useEffect, useRef } from "react";
import Page from "../components/Page";
import CameraPreview from "../components/CameraPreview";
import { usePhase } from "../contexts/PhaseContext";
import { useNavigate } from "react-router";
import Button from "../components/Button";

export default function PhaseFourPage() {
  const phase = usePhase();
  const navigate = useNavigate();

  const handleConfirm = () => {
    phase.setCurrentPhase(5);
    navigate("/phase5");
  };

  return (
    <>
      <Page className="flex flex-col justify-center items-center">
        <div className="flex-none">
          <span className="text-xl">Are we good to go?</span>
        </div>
        <div className="flex-1">
          <CameraPreview width="1280" height="720" />
        </div>
        <div className="flex-none">
          <Button onClick={handleConfirm}>Start</Button>
        </div>
      </Page>
    </>
  );
}
