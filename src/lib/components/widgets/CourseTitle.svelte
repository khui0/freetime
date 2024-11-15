<script lang="ts">
  let { title, number, type }: { title: string; number: string; type: string } = $props();
</script>

<div class="flex gap-2 items-center">
  <h2 class="text-2xl font-bold tracking-tight">{title} {number}</h2>
  <p class="border border-base-content px-1.5 rounded-lg text-sm">{type.toUpperCase()}</p>
</div>
