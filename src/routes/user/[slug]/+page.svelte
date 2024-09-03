<script>
  /** @type {import('./$types').PageData} */
  export let data;

  import { title } from "$lib/store";
  $title = data.username;

  import Calendar from "$lib/components/Calendar.svelte";
</script>

{#if data?.schedule?.length > 0}
  <h2 class="font-bold text-2xl px-4 pt-2">{data.username}</h2>
  <Calendar bind:data={data.schedule}></Calendar>
{:else}
  <div class="grid h-full">
    <p class="text-base-content/50 text-xl place-self-center text-center">No schedule found</p>
  </div>
{/if}
