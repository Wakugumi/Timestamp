import axios from "axios";
import Booth from "../interfaces/Booth";
import Frame from "../interfaces/Frame";
import Theme from "../interfaces/Theme";
import { Filter } from "../utilities/ImageFilter";
import ThemeManager from "./ThemeManager";

type BoothInitializeResponse = {
  booth: Booth;
  theme: Theme;
  frames: Frame[];
  filters: Filter[];
};

const api = axios.create({
  baseURL: "https://timestamp.fun/api",
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
      });

    await ThemeManager.update(this.theme);
  }

  public static async boot() {}

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
      });
  }
}
