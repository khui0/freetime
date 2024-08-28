<script lang="ts">
  import { title } from "$lib/store";

  import { currentUser } from "$lib/pocketbase";

  import CarbonHome from "~icons/carbon/home";
  import CarbonUserMultiple from "~icons/carbon/user-multiple";
  import CarbonSettings from "~icons/carbon/settings";
</script>

<svelte:head>
  <title>{$title}{$title ? " - " : ""}Free Time</title>
</svelte:head>

<div class="flex flex-col h-full">
  <header class="flex gap-2 items-center p-2 border-b">
    <div class="flex-1">
      <h1 class="mx-1">Free Time</h1>
    </div>
    <div class="flex gap-2 items-center">
      {#if $currentUser}
        <p>{$currentUser.username}</p>
      {:else}
        <a class="btn btn-sm" href="/sign-in">Sign in</a>
        <a class="btn btn-sm" href="/register">Register</a>
      {/if}
    </div>
  </header>
  <main class="flex-1"><slot></slot></main>
  <nav class="flex justify-evenly border-t">
    <a href="/" class="p-3"><CarbonHome></CarbonHome></a>
    <a href="/" class="p-3"><CarbonUserMultiple></CarbonUserMultiple></a>
    <a href="/account" class="p-3"><CarbonSettings></CarbonSettings></a>
  </nav>
</div>
