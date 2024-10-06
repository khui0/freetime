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

<div class="fixed inset-0 z-50 bg-base-100">
  <div class="flex flex-col gap-4 items-center justify-center p-10 h-full">
    <Logo></Logo>
    <p class="text-lg text-center max-w-lg my-5">
      Social college schedule viewer for Stony Brook University. Share your class schedule with your
      friends!
    </p>
    <GoogleAuth></GoogleAuth>
    <a href="/legacy-sign-in" class="link text-sm">Continue with email</a>
  </div>
  <div class="absolute left-0 right-0 bottom-0 text-xs text-base-content/50 text-center p-4">
    <a href="/privacy-policy" class="link">Privacy Policy</a>
    <p>
      Having issues? Contact <a class="font-bold" href="mailto:support@kennyhui.dev">
        support@kennyhui.dev
      </a>
    </p>
  </div>
</div>
