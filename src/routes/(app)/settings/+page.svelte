<script lang="ts">
  import { title } from "$lib/store";
  $title = "Settings";

  import { settings } from "$lib/settings";

  import Confirm from "$lib/components/dialog/Confirm.svelte";
  import Logo from "$lib/components/Logo.svelte";
  import SettingsField from "./SettingsField.svelte";
  import SettingsFieldLarge from "./SettingsFieldLarge.svelte";

  import PhCalendarDots from "~icons/ph/calendar-dots";
  import PhPalette from "~icons/ph/palette";
  import PhSignOut from "~icons/ph/sign-out";
  import PhSignIn from "~icons/ph/sign-in";
  import PhUser from "~icons/ph/user";

  import { currentUser, ready, signOut } from "$lib/pocketbase";
  import GoogleAuth from "$lib/components/GoogleAuth.svelte";

  const version = import.meta.env.PACKAGE_VERSION;

  let confirm: Confirm | undefined = $state();

  interface Option {
    name: string;
    value: string;
  }

  const themes: Option[] = [
    { value: "auto", name: "Auto" },
    { value: "dark", name: "Dark" },
    { value: "light", name: "Light" },
    { value: "solar-dark", name: "SOLAR Dark" },
    { value: "solar-light", name: "SOLAR Light" },
    { value: "latte", name: "Catppuccin Latte" },
    { value: "frappe", name: "Catppuccin Frappe" },
    { value: "macchiato", name: "Catppuccin Macchiato" },
    { value: "mocha", name: "Catppuccin Mocha" },
  ];
</script>

<div class="flex flex-col p-4 w-[min(100%,800px)] mx-auto">
  <div class="self-center my-5 sm:hidden"><Logo></Logo></div>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
    <SettingsFieldLarge type="link" title="Account" text="Open account settings" href="/account">
      {#snippet icon()}
        <span><PhUser></PhUser></span>
      {/snippet}
      Manage your account
    </SettingsFieldLarge>
    {#if $currentUser && $ready}
      <SettingsFieldLarge type="button" title="Sign out" text="Sign out" onclick={signOut}>
        {#snippet icon()}
          <span><PhSignOut></PhSignOut></span>
        {/snippet}
        Sign out of your account
      </SettingsFieldLarge>
    {:else}
      <SettingsFieldLarge type="empty" title="Sign in">
        {#snippet icon()}
          <span><PhSignIn></PhSignIn></span>
        {/snippet}
        You appear to be signed out
        {#snippet content()}
          <GoogleAuth></GoogleAuth>
        {/snippet}
      </SettingsFieldLarge>
    {/if}
    <SettingsFieldLarge type="link" title="Schedule" text="Edit schedule" href="/edit">
      {#snippet icon()}
        <span><PhCalendarDots></PhCalendarDots></span>
      {/snippet}
      Add, remove, or edit classes
    </SettingsFieldLarge>
    <SettingsFieldLarge type="select" title="Theme" options={themes} bind:value={$settings.theme}>
      {#snippet icon()}
        <span><PhPalette></PhPalette></span>
      {/snippet}
      Customize the look of Freetime
    </SettingsFieldLarge>
  </div>
  <h2 class="font-bold text-2xl mt-4">Other</h2>
  <SettingsField type="toggle" title="Highlight today" bind:value={$settings.highlightToday}>
    Highlight the column for today
  </SettingsField>
  <SettingsField type="toggle" title="Dim other days" bind:value={$settings.dimOtherDays}>
    Reduce the opacity of classes on other days
  </SettingsField>
  <SettingsField type="toggle" title="Show weekend" bind:value={$settings.showWeekend}>
    Show Saturday and Sunday columns
  </SettingsField>
  <SettingsField type="toggle" title="Extra bottom padding" bind:value={$settings.tallNavigation}>
    Useful on some mobile devices
  </SettingsField>
  <SettingsField type="toggle" title="Hide usernames" bind:value={$settings.obfuscateUsernames}>
    Obfuscate usenames
  </SettingsField>
  <div class="text-xs leading-relaxed text-base-content/50 pt-2">
    <p>Freetime {version}</p>
    <a href="/privacy-policy" class="link">Privacy Policy</a>
    <p>Freetime is not affiliated with Stony Brook University.</p>
    <p>
      Found a bug, incorrect data, or have a feature request? Send an email to <a
        class="link"
        href="mailto:feedback@kennyhui.dev"
      >
        feedback@kennyhui.dev
      </a>
    </p>
    <p>Made with <span class="text-base-content">❤️</span> in Stony Brook, NY</p>
    <p>Copyright &copy; 2025 Kenny Hui. All rights reserved.</p>
  </div>
</div>

<Confirm bind:this={confirm}></Confirm>
