<script lang="ts">
  import { title } from "$lib/store";
  $title = "Settings";

  import { settings } from "$lib/settings";

  import SettingsField from "./SettingsField.svelte";
  import Confirm from "$lib/components/Confirm.svelte";

  import { signOut } from "$lib/pocketbase";

  let confirm: Confirm;

  interface Option {
    name: string;
    value: string;
  }

  const themes: Option[] = [
    { value: "auto", name: "Auto" },
    { value: "dark", name: "Dark" },
    { value: "light", name: "Light" },
  ];

  const version = import.meta.env.PACKAGE_VERSION;
</script>

<div class="flex flex-col gap-2 p-4 w-[min(100%,800px)] mx-auto mb-11">
  <div class="flex flex-col gap-4 items-center p-4">
    <enhanced:img src="$lib/assets/freetime.svg" class="w-24" alt="Freetime logo" />
    <div class="text-center">
      <h1 class="text-2xl font-bold">SB Freetime</h1>
      <p class="text-xs">{version}</p>
    </div>
  </div>
  <SettingsField type="link" title="Schedule" text="Edit schedule" href="/edit">
    Add or change your classes
  </SettingsField>
  <SettingsField type="link" title="Account" text="Open account settings" href="/account">
    Manage your account
  </SettingsField>
  <SettingsField type="button" title="Sign out" text="Sign out" on:click={signOut}>
    Sign out of your account
  </SettingsField>
  <SettingsField type="select" title="Theme" options={themes} bind:value={$settings.theme}>
    Select a theme
  </SettingsField>
  <SettingsField type="toggle" title="Highlight today" bind:value={$settings.highlightToday}>
    Highlight the column of the current day
  </SettingsField>
  <SettingsField type="toggle" title="Show weekend" bind:value={$settings.showWeekend}>
    Show columns for Saturday and Sunday in the calendar view
  </SettingsField>
  <SettingsField type="toggle" title="Extra bottom padding" bind:value={$settings.tallNavigation}>
    Add extra padding to the bottom of the navigation bar. May help if using as PWA.
  </SettingsField>
  <div class="text-xs leading-normal text-base-content/50 px-4">
    <p>Not affiliated with Stony Brook University.</p>
    <p>
      Found a bug, incorrect data, or have a feature request? Email <a
        class="font-bold"
        href="mailto:feedback@kennyhui.dev">feedback@kennyhui.dev</a
      >
    </p>
    <p>Copyright &copy; 2024 Kenny Hui. All rights reserved.</p>
  </div>
</div>

<Confirm bind:this={confirm}></Confirm>
