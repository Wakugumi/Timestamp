import { useNavigate } from "react-router";
import Icon from "../components/Icon";
import WelcomeBanner from "../components/WelcomeBanner";
import { usePhase } from "../contexts/PhaseContext";

export default function WelcomePage() {
  const phase = usePhase();
  const navigate = useNavigate();

  const handleLaunch = () => {
    localStorage.setItem("hasUserInteracted", "true");
    phase.setCurrentPhase(1);
    navigate("phase1");
  };

  return (
    <>
      <div
        className="flex flex-col justify-center items-center gap-4 p-[12rem]
        min-w-full max-h-svh text-on-surface"
        onClick={handleLaunch}
      >
        <Icon type="camera" size="8rem"></Icon>

        <h1 className="font-bold text-on-surface text-8xl">TIMESTAMP</h1>
        <span className="text-4xl">Press the screen to continue</span>
      </div>
    </>
  );
}
