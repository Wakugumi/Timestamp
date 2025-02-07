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
  private static boothId: string | undefined = import.meta.env.VITE_BOOTH_TOKEN;
  private static theme: Theme;

  /**
   * Get booth id number
   * @returns {string | undefined}
   */
  get boothId(): string | undefined {
    return this.boothId;
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
        this.theme = response.data.theme;
      });

    await ThemeManager.update(this.theme);
  }

  public static async boot() {}
}
