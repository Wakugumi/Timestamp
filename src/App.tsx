import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import WelcomePage from "./pages/WelcomePage";
import PhaseOnePage from "./pages/PhaseOnePage";
import ProtectedRoute from "./components/navigation/ProtectedRoute";
import { PhaseProvider } from "./contexts/PhaseContext";
import PhaseThreePage from "./pages/PhaseThreePage";
import SettingPage from "./pages/SettingPage";
import PhaseTwoPage from "./pages/PhaseTwoPage";
import { PopupProvider } from "./contexts/PopupContext";
import { Popup } from "./components/Popup";
import BoothManager from "./services/BoothManager";
import LoggerService from "./services/LoggerService";
import ThemeManager from "./services/ThemeManager";

enum State {
  LOADING = 0,
  RUNNING = 1,
  ERROR = 2,
}

function App() {
  const [state, setState] = useState<State>(State.LOADING);

  useEffect(() => {
    if (state === State.LOADING) {
      const update = async () => {
        try {
          await BoothManager.update();
          setState(State.RUNNING);
        } catch (error) {
          LoggerService.error(error as string);
        }
      };

      update();
    }
  }, [state]);

  if (state === State.RUNNING)
    return (
      <>
        <div
          className="min-h-dvh max-h-dvh bg-surface-container"
          style={{
            backgroundImage: `url("${ThemeManager.getUrl()}")`,
            objectFit: "cover",
          }}
        >
          <PhaseProvider>
            <PopupProvider>
              <Popup />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<WelcomePage />} />
                  <Route path="/setting" element={<SettingPage />} />
                  <Route
                    path="/phase1"
                    element={
                      <ProtectedRoute phaseNumber={1}>
                        <PhaseOnePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/phase2" element={<PhaseTwoPage />} />
                  <Route path="/phase3" element={<PhaseThreePage />} />
                </Routes>
              </BrowserRouter>
            </PopupProvider>
          </PhaseProvider>
        </div>
      </>
    );
}

export default App;
