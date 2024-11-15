<script lang="ts">
  export let errors: String[];
</script>

{#if errors.length > 0}
  <ul class="text-sm text-error">
    {#each errors as error}
      <li><p>{error}</p></li>
    {/each}
  </ul>
{/if}
