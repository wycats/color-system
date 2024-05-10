<script lang="ts">
  import {
    RATIOS,
    type ColorValue,
    type Lc,
    type Theme,
  } from "../lib/colors.js";

  export let name: string;
  export let value: ColorValue;
  export let theme: Theme<string>;
  export let contrast: Lc | "all";

  const RATIO_MAP = {
    5: "invisible",
    15: "discernable",
    30: "disabled",
    45: "legible >42px",
    60: "legible >24px",
    75: "legible >18px",
    90: "legible >16px",
  } satisfies RatioMap;

  type RatioMap = {
    [P in Lc]: string;
  };

  const explanation = RATIO_MAP[value.contrast as keyof RatioMap];
</script>

{#if contrast === "all"}
  <td class="has-text-right">
    <abbr title={explanation}>{value.contrast}</abbr>
  </td>
  <td>{explanation}</td>
{/if}
<td style="background: {theme.background}; color: {value.value};">
  {name}-{value.contrast}
</td>
{#each RATIOS as contrast}
  {@const a = theme.onBG(name, contrast)}
  {@const fg = a.fg[value.contrast]}
  <td style="background: {a.bg}; color: {fg.value};">
    on {contrast}
  </td>
{/each}
