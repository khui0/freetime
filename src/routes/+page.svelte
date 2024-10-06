<script lang="ts">
  import { title } from "$lib/store";
  $title = "";

  import GoogleAuth from "$lib/components/GoogleAuth.svelte";
  import Logo from "$lib/components/Logo.svelte";

  import { pb } from "$lib/pocketbase";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  onMount(() => {
    redirect();
    pb.authStore.onChange(redirect);

    function redirect() {
      if (pb.authStore.isValid) {
        goto("/home");
      }
    }
  });
</script>

<main class="text-center p-10 mb-12">
  <div class="mx-auto w-fit"><Logo></Logo></div>
  <p class="mt-5 text-center max-w-xlmx-auto leading-relaxed text-balance">
    Social schedule viewer for Stony Brook University!
  </p>
  <div class="mt-5 flex gap-2 flex-wrap justify-center">
    <p class="border rounded-lg w-fit px-2 py-1">Navigate to your classes</p>
    <p class="border rounded-lg w-fit px-2 py-1">see when they start (and end)</p>
    <p class="border rounded-lg w-fit px-2 py-1">and share it with your friends!</p>
  </div>
  <div class="mt-5">
    <GoogleAuth></GoogleAuth>
  </div>
  <div class="mt-5">
    <a href="/legacy-sign-in" class="link text-sm">Continue with email</a>
  </div>
</main>
<div class="fixed bottom-0 w-full text-xs text-base-content/50 text-center p-5">
  <p>Not affiliated with Stony Brook University.</p>
  <p>
    Having issues? Contact <a class="link" href="mailto:support@kennyhui.dev">
      support@kennyhui.dev
    </a>
  </p>
  <p>
    Copyright &copy; 2024 Kenny Hui. All rights reserved. <a href="/privacy-policy" class="link"
      >Privacy Policy</a
    >
  </p>
</div>
