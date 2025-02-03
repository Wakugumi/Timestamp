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
      return value.schemes.light.toJSON();
    })
    .catch((error) => {
      throw new DeviceError(error);
    });
}

export function applyColors(colors: Record<string, number>) {
  const root = document.documentElement;
  console.log("Color generated: ", colors);
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, argbToHex(value));
  });
}
