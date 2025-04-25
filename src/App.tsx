import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import WelcomePage from "./pages/WelcomePage";
import PhaseOnePage from "./pages/PhaseOnePage";
import ProtectedRoute from "./components/navigation/ProtectedRoute";
import { PhaseProvider, usePhase } from "./contexts/PhaseContext";
import { DataProvider } from "./contexts/DataContext.tsx";
import SettingPage from "./pages/SettingPage";
import PhaseTwoPage from "./pages/PhaseTwoPage";
import { PopupProvider } from "./contexts/PopupContext";
import { Popup } from "./components/Popup";
import BoothManager, { BoothStatus } from "./services/BoothManager";
import LoggerService from "./services/LoggerService";
import PhaseThreePage from "./pages/PhaseThreePage";
import PhaseFourPage from "./pages/PhaseFourPage";
import PhaseFivePage from "./pages/PhaseFivePage";
import PhaseSixPage from "./pages/PhaseSixPage.tsx";
import PhaseSevenPage from "./pages/PhaseSevenPage.tsx";
import PhaseEightPage from "./pages/PhaseEightPage.tsx";
import ThemeManager from "./services/ThemeManager.tsx";
import { AppInitiator } from "./helpers/AppInitiators.tsx";

enum State {
  LOADING = 0,
  RUNNING = 1,
  ERROR = 2,
}

function App() {
  const [state, setState] = useState<State>(State.LOADING);
  const [error, setError] = useState<Error>();
  const phase = usePhase();

  useEffect(() => {
    if (state === State.LOADING) {
    }
  }, [state]);

  if (state === State.ERROR) throw new Error(error?.message);

  return (
    <>
      <DataProvider>
        <PopupProvider>
          <Popup />
          <BrowserRouter>
            <PhaseProvider>
              <AppInitiator>
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
                  <Route
                    path="/phase2"
                    element={
                      <ProtectedRoute phaseNumber={2}>
                        <PhaseTwoPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/phase3" element={<PhaseThreePage />} />
                  <Route path="/phase4" element={<PhaseFourPage />} />
                  <Route path="/phase5" element={<PhaseFivePage />} />
                  <Route path="/phase6" element={<PhaseSixPage />} />
                  <Route path="/phase7" element={<PhaseSevenPage />} />
                  <Route path="/phase8" element={<PhaseEightPage />} />
                </Routes>
              </AppInitiator>
            </PhaseProvider>
          </BrowserRouter>
        </PopupProvider>
      </DataProvider>
    </>
  );
}

export default App;
