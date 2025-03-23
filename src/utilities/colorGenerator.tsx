import { themeFromImage } from "@material/material-color-utilities";
import { DeviceError } from "../helpers/AppError";

function argbToHex(argb: number): string {
  const r = (argb >> 16) & 0xff;
  const g = (argb >> 8) & 0xff;
  const b = argb & 0xff;
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

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
    console.log(key, value);
    root.style.setProperty(`--color-${key}`, value);
  });
}
