import axios, { AxiosError } from "axios";
import Booth from "../interfaces/Booth";
import Frame from "../interfaces/Frame";
import Theme from "../interfaces/Theme";
import { FilterPreset } from "../interfaces/ImageFilter.tsx";
import ThemeManager from "./ThemeManager";
import { DeviceError, NetworkError } from "../helpers/AppError";
import BackendService from "./BackendService.tsx";
import ISessionState from "../interfaces/SessionState.ts";

type BoothInitializeResponse = {
  booth: Booth;
  theme: Theme;
  frames: Frame[];
  filters: FilterPreset[];
};

const api = axios.create({
  baseURL: "https://timestamp.fun/api",
  headers: {
    Token: window.config.BOOTH_TOKEN,
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
  public static boothId: string | undefined = window.config.BOOTH_TOKEN;
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

  /**
   * startup procedure of a fresh session.
   * apply/reapply theme styling, refetch booth data from server.
   */
  public static async boot(): Promise<ISessionState> {
    await api
      .get<BoothInitializeResponse>("/booths/init", {
        headers: {
          Token: this.boothId,
        },
      })
      .then((response) => {
        this.boothInstance = response.data.booth;
        this.theme = response.data.theme;
        ThemeManager.update(JSON.parse(response.data.theme.config));
      })
      .catch((error: AxiosError) => {
        throw new NetworkError(
          error.message,
          "We encounter fatal error, we're sorry for this inconvenience but you cannot use this booth for now :(",
        );
      });

    return await BackendService.start()
      .then((value) => {
        return value;
      })
      .catch((error) => {
        throw new DeviceError("Error booting, calling start backend, " + error);
      });
  }

  /**
   * Ending current session, reset all states to initial value, reload the DOM root tree
   *
   */
  public static async end(): Promise<void> {
    await BackendService.end();
    window.reloadDOMTree();
  }

  /**
   * static function to resolve any crash issue
   */
  public static async crash() {}
}
