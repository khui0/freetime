<script lang="ts">
  import { title } from "$lib/store";
  $title = "Settings";

  import { settings } from "$lib/settings";

  import Logo from "$lib/components/Logo.svelte";
  import SettingsField from "./SettingsField.svelte";
  import SettingsFieldLarge from "./SettingsFieldLarge.svelte";
  import Confirm from "$lib/components/Confirm.svelte";
  import Modal from "$lib/components/Modal.svelte";

  import PhUser from "~icons/ph/user";
  import PhSignOut from "~icons/ph/sign-out";
  import PhCalendarDots from "~icons/ph/calendar-dots";
  import PhPalette from "~icons/ph/palette";

  import { signOut } from "$lib/pocketbase";

  const version = import.meta.env.PACKAGE_VERSION;

  let confirm: Confirm;
  let aboutModal: Modal;

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
  <div class="self-center my-5"><Logo></Logo></div>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
    <SettingsFieldLarge type="link" title="Account" text="Open account settings" href="/account">
      <span slot="icon"><PhUser></PhUser></span>
      Manage your account
    </SettingsFieldLarge>
    <SettingsFieldLarge type="button" title="Sign out" text="Sign out" on:click={signOut}>
      <span slot="icon"><PhSignOut></PhSignOut></span>
      Sign out of your account
    </SettingsFieldLarge>
    <SettingsFieldLarge type="link" title="Schedule" text="Edit schedule" href="/edit">
      <span slot="icon"><PhCalendarDots></PhCalendarDots></span>
      Add, remove, or change classes
    </SettingsFieldLarge>
    <SettingsFieldLarge type="select" title="Theme" options={themes} bind:value={$settings.theme}>
      <span slot="icon"><PhPalette></PhPalette></span>
      Customize the look of Freetime
    </SettingsFieldLarge>
  </div>
  <h2 class="font-bold text-2xl mt-4">Other</h2>
  <SettingsField type="toggle" title="Highlight today" bind:value={$settings.highlightToday}>
    Highlight today's column
  </SettingsField>
  <SettingsField type="toggle" title="Dim other days" bind:value={$settings.dimOtherDays}>
    Make today's classes stand out
  </SettingsField>
  <SettingsField type="toggle" title="Show weekend" bind:value={$settings.showWeekend}>
    Show Saturday and Sunday columns
  </SettingsField>
  <SettingsField type="toggle" title="Extra bottom padding" bind:value={$settings.tallNavigation}>
    Add extra bottom padding to the navigation bar
  </SettingsField>
  <div class="flex gap-2 items-center justify-between py-4">
    <p>Freetime {version}</p>
    <div class="flex gap-2 flex-wrap justify-end">
      <a href="/privacy-policy" class="btn btn-sm">Privacy Policy</a>
      <button class="btn btn-sm" on:click={aboutModal.show}>About</button>
    </div>
  </div>
</div>

<Confirm bind:this={confirm}></Confirm>

<Modal title="About" bind:this={aboutModal}>
  <div class="text-xs leading-relaxed text-base-content/50">
    <p>Freetime {version}</p>
    <p>Not affiliated with Stony Brook University.</p>
    <p>
      Found a bug, incorrect data, or have a feature request? Contact <a
        class="link"
        href="mailto:feedback@kennyhui.dev">feedback@kennyhui.dev</a
      >
    </p>
    <p>Made with <span class="text-base-content">❤️</span> in Stony Brook, NY</p>
    <p>Copyright &copy; 2024 Kenny Hui. All rights reserved.</p>
  </div>
</Modal>
