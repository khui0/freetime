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

<div class="flex flex-col gap-2 p-4 w-[min(100%,800px)] mx-auto">
  <SettingsField type="link" title="Account" text="Open account settings" href="/account">
    Manage your account
  </SettingsField>
  <SettingsField type="button" title="Sign out" text="Sign out" on:click={signOut}>
    Sign out of your account
  </SettingsField>
  <SettingsField type="select" title="Theme" options={themes} bind:value={$settings.theme}>
    Select a theme
  </SettingsField>
  <SettingsField
    type="toggle"
    title="Show weekend"
    options={themes}
    bind:value={$settings.showWeekend}
  >
    Show columns for Saturday and Sunday in the calendar view
  </SettingsField>
  <SettingsField
    type="toggle"
    title="Highlight today"
    options={themes}
    bind:value={$settings.highlightToday}
  >
    Highlight the column of the current day
  </SettingsField>
  <div class="text-xs leading-normal text-base-content/50 px-4">
    <p class="rounded-badge">Version {version}</p>
    <p>Not affiliated with Stony Brook University.</p>
    <p>
      Found a bug, incorrect data, or have a feature request? Email <a
        href="mailto:feedback@kennyhui.dev">feedback@kennyhui.dev</a
      >
    </p>
    <p>Copyright &copy; 2024 Kenny Hui. All rights reserved.</p>
  </div>
</div>

<Confirm bind:this={confirm}></Confirm>
