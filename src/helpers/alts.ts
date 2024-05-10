import { RATIOS, unwrap, type Lc, type Theme } from "../lib/colors.js";
import * as leo from "@adobe/leonardo-contrast-colors";

export class Alts {
  readonly #theme: Theme<string>;

  constructor(theme: Theme<string>) {
    this.#theme = theme;
  }

  alts(
    name: string
  ): Record<number, { bg: leo.CssColor; fg: leo.ContrastColorValue }> {
    return Object.fromEntries(
      RATIOS.map((r) => {
        const { bg, fg } = this.#theme.onBG(name, r);
        console.log({ bg, fg, r });
        return [r, { bg, fg: fg[r] }];
      })
    );
  }
}
