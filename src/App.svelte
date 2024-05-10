<script lang="ts">
  import Colors from "./colors/Colors.svelte";
</script>

<main>
  <Colors />
</main>

<style>
  main :global(table.all) {
    & tr :first-child:not(.no-border) {
      border-inline-end: 1px solid #e0e0e0;
    }

    & tbody + tbody {
      & > tr:first-child:not(.no-border) {
        border-top: 3px solid oklch(50% 0% 0);
      }
    }
  }
</style>
