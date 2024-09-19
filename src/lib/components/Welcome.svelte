<script lang="ts">
  const version = import.meta.env.PACKAGE_VERSION;
</script>

<div class="fixed inset-0 z-50 bg-base-100">
  <div class="flex flex-col gap-4 items-center justify-center p-10 h-full">
    <enhanced:img src="$lib/assets/freetime.svg" class="w-24" alt="Freetime logo" />
    <div class="text-center">
      <h1 class="text-2xl font-bold">SB Freetime</h1>
      <p class="text-xs">{version}</p>
    </div>
    <a href="/sign-in" class="btn">Sign in</a>
    <a href="/register" class="btn">Register</a>
  </div>
  <div
    class="absolute left-0 right-0 bottom-0 text-xs leading-normal text-base-content/50 text-center p-10"
  >
    <p>
      Having issues signing in? Email <a class="font-bold" href="mailto:support@kennyhui.dev">
        support@kennyhui.dev
      </a>
    </p>
    <p>Copyright &copy; 2024 Kenny Hui. All rights reserved.</p>
  </div>
</div>
