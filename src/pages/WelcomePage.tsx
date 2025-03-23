import Icon from "../components/Icon";
import { usePhase } from "../contexts/PhaseContext";
import Page from "../components/Page";
import BoothManager from "../services/BoothManager";
import { useEffect } from "react";

export default function WelcomePage() {
  const phase = usePhase();

  useEffect(() => {
    const status = BoothManager.checkStatus();
    if (typeof status === "number") {
      phase.jumpTo(status);
    }
  }, []);

  const handleLaunch = () => {
    localStorage.setItem("hasUserInteracted", "true");
    phase.next();
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
