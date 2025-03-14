import { FabricImage, filters } from "fabric";
import { FilterPreset } from "../interfaces/ImageFilter";
import APIService from "./APIService";

export default class ImageFilterService {
  static async getFilters() {
    return await APIService.get<FilterPreset[]>("filters")
      .then((Response) => {
        return Response;
      })
      .catch((error) => {
        throw error;
      });
  }

  static applyFilter(preset: FilterPreset, image: FabricImage) {
    const filter = new filters.Composed({
      subFilters: [],
    });

    // Color matrix preset
    preset.preset.sepia ? filter.subFilters.push(new filters.Sepia()) : null;
    preset.preset.brownie
      ? filter.subFilters.push(new filters.Brownie())
      : null;
    preset.preset.blackwhite
      ? filter.subFilters.push(new filters.BlackWhite())
      : null;
    preset.preset.vintage
      ? filter.subFilters.push(new filters.Vintage())
      : null;
    preset.preset.polaroid
      ? filter.subFilters.push(new filters.Polaroid())
      : null;
    preset.preset.kodachrome
      ? filter.subFilters.push(new filters.Kodachrome())
      : null;
    preset.preset.technicolor
      ? filter.subFilters.push(new filters.Technicolor())
      : null;

    preset.preset.pixelate
      ? filter.subFilters.push(
          new filters.Pixelate({ blocksize: preset.preset.pixelate! }),
        )
      : null;
    preset.preset.noise
      ? filter.subFilters.push(
          new filters.Noise({ noise: preset.preset.noise! }),
        )
      : null;
    preset.preset.saturation
      ? filter.subFilters.push(
          new filters.Saturation({ saturation: preset.preset.saturation! }),
        )
      : null;

    preset.preset.vibrance
      ? filter.subFilters.push(
          new filters.Vibrance({ vibrance: preset.preset.vibrance! }),
        )
      : null;

    preset.preset.hueRotation
      ? filter.subFilters.push(
          new filters.HueRotation({
            rotation: preset.preset.hueRotation.rotation,
            matrix: preset.preset.hueRotation.matrix,
          }),
        )
      : null;

    preset.preset.gamma
      ? filter.subFilters.push(
          new filters.Gamma({ gamma: preset.preset.gamma?.gamma! }),
        )
      : null;

    preset.preset.grayscale
      ? filter.subFilters.push(new filters.Grayscale())
      : null;

    preset.preset.colorMatrix
      ? filter.subFilters.push(
          new filters.ColorMatrix({ matrix: preset.preset.colorMatrix! }),
        )
      : null;
    preset.preset.blur
      ? filter.subFilters.push(
          new filters.Blur({
            blur: preset.preset.blur.blur!,
            aspectRatio: preset.preset.blur.aspectRatio!,
            horizontal: preset.preset.blur.horizontal!,
          }),
        )
      : null;

    preset.preset.contrast
      ? filter.subFilters.push(
          new filters.Contrast({
            contrast: preset.preset.contrast,
          }),
        )
      : null;

    preset.preset.blend
      ? preset.preset.blend.forEach((x, index) => {
          filter.subFilters.push(
            new filters.BlendColor({
              alpha: x.alpha,
              mode: x.mode,
              color: x.color,
            }),
          );
        })
      : null;

    console.log(filter);

    image.filters = [filter];
    image.applyFilters();
  }
}
