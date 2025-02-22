import APIService from "./APIService";
import Frame from "../interfaces/Frame";
import { NetworkError } from "../helpers/AppError";
import BoothManager from "./BoothManager";

class FrameService {
  /**
   * Get all frames
   * @param {number | null} count? Filter the response to only returns frames with number of pictures equal to count
   * @param {string | null} themeId? Filter the response to only returns frames associated with the theme
   * @param {boolean | null} split?: Filter the frames whether they are splitable or not
   * @return {Promise<Frame[] | void>}
   */
  public static async getFrames(
    count?: number | null,
    themeId?: string | null,
    split?: boolean | null,
  ): Promise<Frame[] | void> {
    let url: string = `frames?boothId=${BoothManager.boothId}`;

    if (count) url += `&count=${count}`;
    if (themeId) url += `&themeId=${themeId}`;
    if (split) url += `&split=${split}`;

    return await APIService.get<Frame[]>(url)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw new NetworkError(
          error,
          "We're very sorry but it seems that we cannot fetch our frames at the moment.",
        );
      });
  }
}

export default FrameService;
