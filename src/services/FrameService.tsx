import APIService from "./APIService";
import Frame from "../interfaces/Frame";
import { NetworkError } from "../helpers/AppError";

class FrameService {
  /**
   * Get all frames
   * @return {Promise<Frame[] | void>}
   */
  public static async getFrames(): Promise<Frame[]> {
    return APIService.get<Frame[]>("frames")
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
