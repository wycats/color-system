import * as leo from "@adobe/leonardo-contrast-colors";
import chroma from "chroma-js";

/**
 * https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell#use-case--size-ranges
 */

export const LC_5 = 5;
export type LC_5 = 5;
export const LC_15 = 15;
export type LC_15 = 15;
export const LC_30 = 30;
export type LC_30 = 30;
export const LC_45 = 45;
export type LC_45 = 45;
export const LC_60 = 60;
export type LC_60 = 60;
export const LC_75 = 75;
export type LC_75 = 75;
export const LC_90 = 90;
export type LC_90 = 90;

export const RATIOS = [LC_5, LC_15, LC_30, LC_45, LC_60, LC_75, LC_90] as const;
export type RATIOS = typeof RATIOS;

const OFFSETS = {
  [LC_5]: 0,
  [LC_15]: 1,
  [LC_30]: 2,
  [LC_45]: 3,
  [LC_60]: 4,
  [LC_75]: 5,
  [LC_90]: 6,
} as const;

export function lcMap<T>(values: T[]): Record<Lc, T> {
  return Object.fromEntries(
    RATIOS.map((r) => [r, values[OFFSETS[r]]])
  ) as Record<Lc, T>;
}

export type Lc = LC_5 | LC_15 | LC_30 | LC_45 | LC_60 | LC_75 | LC_90;

export type ColorValue = leo.ContrastColorValue & { contrast: Lc };

export class Color<Name extends string> {
  readonly #name: Name;
  readonly #colorKeys: leo.CssColor[];

  constructor(name: Name, colorKeys: leo.CssColor[]) {
    this.#name = name;
    this.#colorKeys = colorKeys;
  }

  get name(): Name {
    return this.#name;
  }

  toLeo(): leo.ColorBase {
    return {
      name: this.#name,
      colorKeys: this.#colorKeys,
      ratios: RATIOS as unknown as number[],
      colorspace: "OKLCH",
      output: "CAM02",
    };
  }
}

export class ThemeBlueprint<Name extends string> {
  readonly #background: Color<string>;
  readonly #colors: Color<Name>[];

  constructor(background: Color<string>, colors: Color<Name>[]) {
    this.#background = background;
    this.#colors = colors;
  }

  withLightness(lightness: number): Theme<Name> {
    return new Theme(this.#background, this.#colors, lightness);
  }
}

export interface ThemeColors<Name extends string> {
  bg: leo.ContrastColorBackground;
  fg: FgColors<Name>;
}

type FgColors<Name extends string> = Record<Name, Record<Lc, ColorValue>>;

export class Theme<Name extends string> {
  readonly #colors: Color<Name>[];
  readonly #leo: leo.Theme;

  constructor(
    background: Color<string>,
    colors: Color<Name>[],
    lightness: number
  ) {
    this.#colors = colors;

    this.#leo = new leo.Theme({
      backgroundColor: new leo.BackgroundColor(background.toLeo()),
      colors: colors.map((color) => new leo.Color(color.toLeo())),
      lightness,
      formula: "wcag3",
      output: "HEX",
    });
  }

  get background(): leo.CssColor {
    return this.colors().bg.background;
  }

  get fg(): FgColors<Name> {
    return this.colors().fg;
  }

  colors(): ThemeColors<Name> {
    const [bg, ...fg] = this.#leo.contrastColors;

    const colors = Object.fromEntries(
      this.#colors.map((color, i) => [color.name, lcMap(fg[i].values)])
    ) as Record<Name, Record<Lc, ColorValue>>;

    return { bg, fg: colors };
  }

  /**
   * @param name
   * @param lc the tone of the background
   * @returns
   */
  onBG(name: Name, lc: Lc): { bg: leo.CssColor; fg: Record<Lc, ColorValue> } {
    const color = unwrap(this.#colors.find((c) => c.name === name));

    const lightness = chroma(
      unwrap(this.#leoNamed(name).values.find((c) => c.contrast === lc)).value
    ).oklch()[0];

    const { bg, fg } = new ThemeBlueprint(color, [color])
      .withLightness(Math.round(lightness * 100))
      .colors();

    const newFg = unwrap(fg[name]);

    console.log({ fg, map: newFg });

    return { bg: bg.background, fg: newFg };
  }

  #leoNamed(name: Name): leo.ContrastColor {
    const [, ...rest] = this.#leo.contrastColors;
    return unwrap(rest.find((c) => c.name === name));
  }
}

export function unwrap<T>(value: T | undefined): T {
  if (value === undefined) {
    throw new Error("unexpected undefined");
  }

  return value;
}
