<script>
  import { FONT_COLS } from "../helpers/fonts";
</script>

<thead>
  <tr>
    <th colspan={FONT_COLS.length + 1} style="text-align: center">
      Font Weight
    </th>
  </tr>
  <tr>
    <th style="text-align: center">Score</th>
    {#each FONT_COLS as c}
      <th class="has-text-centered" style="font-weight: {c}">{c}</th>
    {/each}
  </tr>
</thead>
