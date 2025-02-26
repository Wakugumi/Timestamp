import { NetworkError } from "../helpers/AppError";
import Frame from "../interfaces/Frame";
import Theme from "../interfaces/Theme";
import { colorGenerator, applyColors } from "../utilities/colorGenerator";
import APIService from "./APIService";
import BoothManager from "./BoothManager";

export default class ThemeManager {
  public static url: string;

  /**
   * Updates global CSS variables based on the static Theme instance in BoothManager
   * Extract colors from image given from URL provided by BoothManager in Theme instance
   * @returns {Promise<void>}
   */
  public static async update(theme: Theme) {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = theme.url;
    const scheme = await colorGenerator(image);
    console.log(scheme);
    applyColors(scheme);
  }

  public static getUrl() {
    return BoothManager.Theme.url;
  }

  /**
   * @todo Better check the performance using this to filter values
   *
   * Gets theme's names from a set for Frame.
   * @returns {Promise<Theme[]>} List of unique theme from given Frames
   */
  public static async getThemeNames() {
    return await APIService.get<Theme[]>("frames/theme", {
      headers: {
        Token: BoothManager.boothId,
      },
    })
      .then((response) => {
        console.log("[ThemeManager]", response);
        return response;
      })
      .catch((error) => {
        throw new NetworkError(error);
      });
  }
}
