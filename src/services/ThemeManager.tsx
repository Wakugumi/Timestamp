import Theme from "../interfaces/Theme";
import { colorGenerator, applyColors } from "../utilities/colorGenerator";
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
}
