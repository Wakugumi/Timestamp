import { ReactNode, createContext, useState, useEffect } from "react";
import { usePhase } from "../contexts/PhaseContext";
import BoothManager from "../services/BoothManager";
import { globalData } from "../contexts/DataContext";
import ThemeManager from "../services/ThemeManager";

interface AppInitiatorProps {
  children: ReactNode;
}

const context = createContext(null);

export function AppInitiator({ children }: AppInitiatorProps) {
  const phase = usePhase();
  const data = globalData();
  enum State {
    LOADING,
    RUNNING,
    ERROR,
  }
  const [state, setState] = useState<State>(State.LOADING);

  useEffect(() => {
    if (state === State.LOADING) {
      (async () => {
        await BoothManager.boot()
          .then((value) => {
            console.log(value);
            data.setFrame(value.frame!);
            data.saveCanvas(JSON.stringify(value.canvas!));
            data.setPayment(value.payment!);
            data.setPictures(value.pictures!);
            if (value.phase! > 1) {
              console.log(
                "returned phase state is more than one, jumping back...",
              );
              phase?.jumpTo(value.phase!);
            }
            setState(State.RUNNING);
          })
          .catch((error) => {
            throw error;
          });
      })();
    }
  });

  if (state === State.RUNNING)
    return (
      <context.Provider value={null}>
        <div
          className="min-h-dvh max-h-dvh bg-background font-work"
          style={{
            backgroundImage: `url("${ThemeManager.getUrl()}")`,
            backgroundSize: "cover",
          }}
        >
          {children}
        </div>
      </context.Provider>
    );
}
