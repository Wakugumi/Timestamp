import axios, { AxiosError } from "axios";
import Booth from "../interfaces/Booth";
import Frame from "../interfaces/Frame";
import Theme from "../interfaces/Theme";
import { FilterPreset } from "../interfaces/ImageFilter.tsx";
import ThemeManager from "./ThemeManager";
import { DeviceError, NetworkError } from "../helpers/AppError";
import BackendService from "./BackendService.tsx";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { globalData } from "../contexts/DataContext.tsx";
import { usePhase } from "../contexts/PhaseContext.tsx";
import { Session } from "../interfaces/Session.ts";
import { ipcMain } from "electron";

type BoothInitializeResponse = {
  booth: Booth;
  theme: Theme;
  frames: Frame[];
  filters: FilterPreset[];
};

const api = axios.create({
  baseURL: "https://timestamp.fun/api",
  headers: {
    Token: import.meta.env.VITE_BOOTH_TOKEN,
  },
});

export enum BoothStatus {
  RUNNING,
  BOOTING,
  RELOADING,
  CRASH,
}

export default class BoothManager {
  private static boothInstance: Booth;
  public static boothId: string | undefined = import.meta.env.VITE_BOOTH_TOKEN;
  private static theme: Theme;
  private static phase: number = -1;

  /** @type {BoothStatus} booth state indicator */
  public static status: BoothStatus;

  /**
   * Get current Booth instance
   * @returns {Booth} booth instance
   */
  static get Booth(): Booth {
    return this.boothInstance;
  }

  /**
   * Get Theme instance
   * @returns {Theme}
   */
  static get Theme(): Theme {
    return this.theme;
  }

  static get Status(): BoothStatus {
    return this.status;
  }

  public static get Phase(): number {
    return this.phase;
  }

  public static setPhase(phase: number) {
    this.phase = phase;
  }

  static set setStatus(status: BoothStatus) {
    this.status = status;
  }

  public static async boot(): Promise<Session | void> {
    await api
      .get<BoothInitializeResponse>("/booths/init", {
        headers: {
          Token: this.boothId,
        },
      })
      .then((response) => {
        this.boothInstance = response.data.booth;
        this.theme = response.data.theme;
      })
      .catch((error: AxiosError) => {
        throw new NetworkError(
          error.message,
          "We encounter fatal error, we're sorry for this inconvenience but you cannot use this booth for now :(",
        );
      });

    console.log(JSON.parse(this.theme.config));
    await ThemeManager.update(JSON.parse(this.theme.config));
    return await BackendService.start();
  }

  /**
   * Get all related data to the booth
   */
  public static async sync() {
    return await api
      .get<BoothInitializeResponse>("/booth/init", {
        headers: {
          Token: this.boothId,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new NetworkError(error as string);
      });
  }

  public static reload(continueAt: number) {
    this.status = BoothStatus.RELOADING;
    this.setPhase(continueAt);
  }

  public static checkStatus() {
    if (this.status === BoothStatus.RELOADING) {
      return this.phase;
    } else if (this.status === BoothStatus.CRASH) {
      throw new DeviceError("Unexpected Crash");
    } else return;
  }
}

const InitiatorContext = createContext(null);

export const Initiator = ({ children }: { children: ReactNode }) => {
  const [isInit, setIsInit] = useState(false);
  const data = globalData();
  const phase = usePhase();
  useEffect(() => {
    (async () => {
      const state = await BoothManager.boot();

      console.log(state);
      data.loadData(state);

      if (state?.phase! > 1) phase?.jumpTo(state?.phase!);
      setIsInit(true);
    })().catch((error) => {
      throw error;
    });
  }, []);

  if (isInit)
    return (
      <InitiatorContext.Provider value={null}>
        <div
          className="min-h-dvh max-h-dvh bg-background font-work"
          style={{
            backgroundImage: `url("${ThemeManager.getUrl()}")`,
            backgroundSize: "cover",
          }}
        >
          {children}
        </div>
      </InitiatorContext.Provider>
    );
};

export const useInitiatior = () => useContext(InitiatorContext);
