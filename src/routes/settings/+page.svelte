<script lang="ts">
  import { settings } from "$lib/settings";

  // import toast from "svelte-french-toast";

  import SettingsField from "./SettingsField.svelte";
  import Confirm from "$lib/components/Confirm.svelte";

  import BiGithub from "~icons/bi/github";

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

  const version: string = import.meta.env.PACKAGE_VERSION;
</script>

<div class="flex flex-col gap-2 p-4">
  <SettingsField type="select" title="Theme" options={themes} bind:value={$settings.theme}>
    Select a theme
  </SettingsField>
  <SettingsField type="checkbox" title="Dark Background" options={themes}>
    Use a dark background behind the "difference" panel regardless of theme
  </SettingsField>
  <SettingsField type="text" title="Testing" options={themes}>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae consectetur perferendis
    laboriosam odio mollitia exercitationem!
  </SettingsField>
  <SettingsField type="button" title="Testing" text="Enable" options={themes}>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae consectetur perferendis
    laboriosam odio mollitia exercitationem!
  </SettingsField>
</div>

<Confirm bind:this={confirm}></Confirm>
