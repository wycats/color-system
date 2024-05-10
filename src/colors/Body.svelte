<script lang="ts">
  import * as leo from "@adobe/leonardo-contrast-colors";
  import type { Alts } from "../helpers/alts.js";
  import Row from "./Row.svelte";
  import type { ColorValue, Lc, Theme, ThemeColors } from "../lib/colors.js";

  export let theme: Theme<string>;
  export let name: string;
  export let color: Record<Lc, ColorValue>;
  export let contrast: Lc | "all" = "all";

  $: console.log(contrast);

  $: filter =
    contrast === "all"
      ? () => true
      : (value: leo.ContrastColorValue) => value.contrast === contrast;
</script>

<tbody>
  {#each Object.values(color) as value}
    <tr hidden={!filter(value)}>
      <Row {name} {value} {theme} {contrast} />
    </tr>
  {/each}
</tbody>
