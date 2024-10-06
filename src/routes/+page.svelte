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
  <p class="text-center max-w-xl my-5 mx-auto leading-relaxed text-balance">
    Social schedule viewer for Stony Brook University! Navigate to your classes, see when they start
    (and end), and share it with your friends!
  </p>
  <GoogleAuth></GoogleAuth>
  <a href="/legacy-sign-in" class="link text-sm block mt-5">Continue with email</a>
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
