<script lang="ts">
  const version = import.meta.env.PACKAGE_VERSION;
</script>

<div class="flex flex-col items-center text-center p-4">
  <enhanced:img src="$lib/assets/freetime.svg" class="w-20" alt="Freetime logo" />
  <h1 class="text-2xl font-bold">SB Freetime</h1>
  <p class="text-xs text-base-content/50">{version}</p>
</div>
