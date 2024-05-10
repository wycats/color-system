<script lang="ts">
  import Header from "./FontHeader.svelte";
  import { FONT_COLS } from "../helpers/fonts.js";
  import { RATIOS, type Lc, type Theme } from "../lib/colors.js";
  import { fontLookupAPCA } from "apca-w3";

  export let contrast: Lc | "all";
  export let theme: Theme<string>;

  $: isCurrent = (ratio: Lc) => contrast === "all" || contrast === ratio;
</script>

<div class="table">
  <table class="font-table table is-striped">
    {#if contrast === "all"}
      <Header />
    {:else}
      <thead>
        <tr>
          <th class="has-text-centered">Font Weight</th>
          <th class="has-text-centered">Minimum Size</th>
        </tr>
      </thead>
    {/if}
    {#each RATIOS as r}
      {@const [, ...values] = fontLookupAPCA(r)}
      {@const fg = theme.fg["heroku"]}

      {#if contrast === "all"}
        <tr hidden={!isCurrent(r)}>
          <td>{r}</td>
          {#each values as v, i}
            {#if v > 120}
              <td class="has-text-warning">Never</td>
            {:else}
              <td style="font-weight: {FONT_COLS[i]}">
                <span
                  class="tag is-large"
                  style="color: {fg[90]
                    .value}; background-color: {theme.background};"
                >
                  &gt; {v}px
                </span>
              </td>
            {/if}
          {/each}
        </tr>
      {:else}
        {@const fg = theme.onBG("green", 5)}
        {#each values as v, i}
          <tr hidden={!isCurrent(r)}>
            <td>{FONT_COLS[i]}</td>
            {#if v > 120}
              <td class="has-text-warning">Never</td>
            {:else}
              <td style="font-weight: {FONT_COLS[i]}">
                <span
                  class="tag"
                  style="font-size: {v}px; color: {fg.fg[contrast]
                    .value}; background-color: {fg.bg};"
                >
                  &gt; {v}px
                </span>
              </td>
            {/if}
          </tr>
        {/each}
      {/if}
    {/each}
  </table>
</div>

<style>
  div.table {
    display: grid;
    justify-content: center;
  }
</style>
