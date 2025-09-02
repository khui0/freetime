<script lang="ts">
  let { title, number, type }: { title: string; number: string; type: string } = $props();
</script>

<span class="inline-flex gap-2 items-center">
  <h2 class="text-2xl font-bold tracking-tight">{title} {number}</h2>
  <p class="bg-base-300 px-2 py-0.5 rounded-lg text-sm">{type.toUpperCase()}</p>
</span>
