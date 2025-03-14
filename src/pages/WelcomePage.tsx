import { useNavigate } from "react-router";
import Icon from "../components/Icon";
import WelcomeBanner from "../components/WelcomeBanner";
import { usePhase } from "../contexts/PhaseContext";
import Page from "../components/Page";

export default function WelcomePage() {
  const phase = usePhase();
  const navigate = useNavigate();

  const handleLaunch = () => {
    localStorage.setItem("hasUserInteracted", "true");
    phase.setCurrentPhase(2);
    navigate("/phase2");
  };
  return (
    <div onClick={() => handleLaunch()}>
      <Page className="flex flex-col justify-center items-center gap-8">
        <Icon type="camera" size="8rem"></Icon>

        <h1 className="font-bold text-on-surface text-8xl">TIMESTAMP</h1>
        <span className="text-4xl">Press the screen to continue</span>
      </Page>
    </div>
  );
}
