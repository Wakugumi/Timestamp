import axios, { AxiosError } from "axios";
import Booth from "../interfaces/Booth";
import Frame from "../interfaces/Frame";
import Theme from "../interfaces/Theme";
import { Filter } from "../utilities/ImageFilter";
import ThemeManager from "./ThemeManager";
import { Network } from "inspector";
import { NetworkError } from "../helpers/AppError";

type BoothInitializeResponse = {
  booth: Booth;
  theme: Theme;
  frames: Frame[];
  filters: Filter[];
};

const api = axios.create({
  baseURL: "https://timestamp.fun/api",
  headers: {
    Token: import.meta.env.VITE_BOOTH_TOKEN,
  },
});

export default class BoothManager {
  private static boothInstance: Booth;
  public static boothId: string | undefined = import.meta.env.VITE_BOOTH_TOKEN;
  private static theme: Theme;

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

  /** Update booth content and config with backend
   * @returns {Promise<void>}
   */
  public static async update() {
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
      .catch((error) => {
        throw new NetworkError(
          error as string,
          "We encounter fatal error, we're sorry for this inconvenience but you cannot use this booth for now :(",
        );
      });

    await ThemeManager.update(this.theme);
  }

  public static async boot() {
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

    await ThemeManager.update(this.theme);
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
}
