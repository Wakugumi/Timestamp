import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import WelcomePage from "./pages/WelcomePage";
import PhaseOnePage from "./pages/PhaseOnePage";
import { PhaseProvider } from "./contexts/PhaseContext";
import { DataProvider } from "./contexts/DataContext.tsx";
import SettingPage from "./pages/SettingPage";
import PhaseTwoPage from "./pages/PhaseTwoPage";
import { PopupProvider } from "./contexts/PopupContext";
import { Popup } from "./components/Popup";
import PhaseThreePage from "./pages/PhaseThreePage";
import PhaseFourPage from "./pages/PhaseFourPage";
import PhaseFivePage from "./pages/PhaseFivePage";
import PhaseSixPage from "./pages/PhaseSixPage.tsx";
import PhaseSevenPage from "./pages/PhaseSevenPage.tsx";
import PhaseEightPage from "./pages/PhaseEightPage.tsx";
import { AppInitiator } from "./helpers/AppInitiators.tsx";
function App() {
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
                  <Route path="/phase1" element={<PhaseOnePage />} />
                  <Route path="/phase2" element={<PhaseTwoPage />} />
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
