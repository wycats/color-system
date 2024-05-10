<script lang="ts">
  import { Color, RATIOS, ThemeBlueprint, type Lc } from "../lib/colors.js";
  import Body from "./Body.svelte";
  import type { FormEventHandler } from "svelte/elements";
  import FontBody from "../fonts/FontBody.svelte";

  const background = new Color("background", ["#FBFBFD", "#F7F8FB"]);

  const colors = {
    purple: new Color("purple", ["#79589F", "#A997BF", "#F7F3FB"]),
    heroku: new Color("heroku", ["#211746", "#7673C0", "#430098"]),
    blue: new Color("blue", ["#408FEC", "#8EBDF1", "#F6FAFF"]),
    green: new Color("green", ["#74C080", "#ABD7B4", "#F8FCF9"]),
    orange: new Color("orange", ["#FA9F47", "#FBC595", "#FFFAF6"]),
    red: new Color("red", ["#D64141", "#E58F8F", "#FDF6F6"]),
    omg: new Color("omg", ["teal"]),
    pink: new Color("pink", ["pink"]),
    yellow: new Color("yellow", ["yellow"]),
    cyan: new Color("cyan", ["cyan"]),
    gray: new Color("gray", ["gray"]),
    lime: new Color("lime", ["lime"]),
    indigo: new Color("indigo", ["indigo"]),
    rebeccapurple: new Color("rebeccapurple", [
      "indigo",
      "purple",
      "blueviolet",
    ]),
  };

  const blueprint = new ThemeBlueprint(background, Object.values(colors));
  const theme = blueprint.withLightness(97);
  const themeDark = blueprint.withLightness(3);

  type FormEventArg =
    | SubmitEvent
    | Parameters<FormEventHandler<HTMLFormElement>>[0];

  let currentRatio: Lc | "all" = 75;

  function update(event: FormEventArg) {
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const ratioData = data.get("ratio");

    if (ratioData === "all") {
      currentRatio = "all";
    } else {
      currentRatio = Number(ratioData) as Lc;
    }
  }
</script>

<div class="card">
  <form on:submit={update} on:input={update}>
    <div class="buttons">
      <span class="tag is-primary is-light">Contrast Score</span>
      <label class="form-control">
        <input
          type="radio"
          name="ratio"
          value="all"
          checked={currentRatio === "all"}
        />
        all
      </label>

      {#each RATIOS as ratio}
        <label class="form-control">
          <input
            type="radio"
            name="ratio"
            value={ratio}
            checked={ratio === currentRatio}
          />
          {ratio}
        </label>
      {/each}
    </div>
  </form>
</div>

<div class="card">
  <table class="table is-fullwidth" class:all={currentRatio === "all"}>
    <thead>
      <tr>
        {#if currentRatio === "all"}
          <th class="has-text-centered">target</th>
          <th class="has-text-centered"
            ><abbr title="when font-weight is 400">legibility</abbr></th
          >
        {/if}
        <th class="has-text-centered">on bg</th>
        {#each RATIOS as ratio}
          <th class="has-text-centered">on {ratio}</th>
        {/each}
      </tr>
    </thead>
    {#each Object.entries(theme.fg) as [name, color]}
      <Body contrast={currentRatio} {name} {color} {theme} />
    {/each}
    {#each Object.entries(themeDark.fg) as [name, color]}
      <Body contrast={currentRatio} {name} {color} theme={themeDark} />
    {/each}
  </table>

  {#if currentRatio !== "all"}
    <FontBody contrast={currentRatio} {theme} />
  {/if}
</div>

{#if currentRatio === "all"}
  <div class="card">
    <h2 class="title">Minimum Font Size</h2>
    <FontBody contrast={currentRatio} {theme} />
  </div>
{/if}

<style>
  :root {
    --color-primary: oklch(50% 50% 0);
    --color-accent: oklch(90% 50% 0);
    --color-on-primary: oklch(100% 0% 0);
  }

  .form-control {
    font-family: system-ui, sans-serif;
    font-size: 2rem;
    font-weight: bold;
    line-height: 1.1;
    padding-inline: 0.5em;
    color: var(--color-primary);
    background-color: var(--color-on-primary);
    transition:
      color 0.3s,
      background-color 0.3s,
      border-color 0.3s;
    position: relative;

    &:has(input[type="radio"]) {
      border: 0.15em solid currentColor;
      border-radius: 0.25em;
    }

    &:has(input[type="radio"]:checked) {
      background-color: var(--color-primary);
      color: var(--color-on-primary);
      border: 0.15em solid var(--color-accent);
    }

    &:has(input[type="radio"]:hover) {
      border-color: var(--color-accent);
    }

    &:has(input[type="radio"]:focus-within) {
      border-color: var(--color-accent);
    }
  }

  input[type="radio"] {
    position: absolute;
    opacity: 0;
    appearance: none;
    /* For iOS < 15 to remove gradient background */
    background-color: initial;
    /* Not removed via appearance */
    margin: 0;
  }
</style>
