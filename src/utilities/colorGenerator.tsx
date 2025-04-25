import { themeFromImage } from "@material/material-color-utilities";
import { DeviceError } from "../helpers/AppError";

export async function colorGenerator(image: HTMLImageElement) {
  return await themeFromImage(image)
    .then((value) => {
      const obj: Record<string, number> = value.schemes.light.toJSON();
      obj["surfaceContainerLowest"] = value.palettes.neutral.tone(100);
      obj["surfaceContainerLow"] = value.palettes.neutral.tone(96);
      obj["surfaceContainer"] = value.palettes.neutral.tone(92);
      obj["surfaceContainerHigh"] = value.palettes.neutral.tone(87);
      obj["surfaceContainerHighest"] = value.palettes.neutral.tone(81);

      return obj;
    })

    .catch((error) => {
      throw new DeviceError(error);
    });
}

export function applyColors(colors: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
}
