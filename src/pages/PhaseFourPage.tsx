import Page from "../components/Page";
import { usePhase } from "../contexts/PhaseContext";
import { useNavigate } from "react-router";
import Button from "../components/Button";

export default function PhaseFourPage() {
  const phase = usePhase();
  const navigate = useNavigate();

  const handleConfirm = async () => {
    phase.next();
  };

  return (
    <>
      <Page className="flex flex-col justify-center items-center gap-12">
        <div className="flex-none">
          <span className="text-4xl">Are you ready?</span>
        </div>
        <div className="flex-none">
          <Button onClick={() => handleConfirm()}>Start</Button>
        </div>
      </Page>
    </>
  );
}
