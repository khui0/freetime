<script lang="ts">
  import Logo from "./Logo.svelte";
  import GoogleAuth from "./GoogleAuth.svelte";
</script>

<div class="fixed inset-0 z-50 bg-base-100">
  <div class="flex flex-col gap-4 items-center justify-center p-4 h-full">
    <Logo></Logo>
    <GoogleAuth></GoogleAuth>
    <a href="/sign-in" class="link text-sm">Continue with email</a>
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
