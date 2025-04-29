<script lang="ts">
  import { title } from "$lib/store";
  $title = "";

  import GoogleAuth from "$lib/components/GoogleAuth.svelte";

  import { goto } from "$app/navigation";
  import { pb } from "$lib/pocketbase";
  import { onMount } from "svelte";

  onMount(() => {
    redirect();
    pb.authStore.onChange(redirect);

    function redirect() {
      if (pb.authStore.isValid) {
        goto("/home");
      }
    }
    document.documentElement?.setAttribute("data-theme", "dark");
  });

  import EventDetails from "$lib/components/calendar/EventDetails.svelte";
  const sampleEvent: CalendarEvent = {
    days: [false, true, false, true, false, false, false],
    from: "15:30",
    location: "eb",
    number: "210",
    room: "145",
    title: "AMS",
    to: "16:50",
    type: "lecture",
    online: false,
  };

  import LogoMedium from "$lib/components/LogoMedium.svelte";
  import DemoFriend from "./DemoFriend.svelte";
</script>

<div
  class="pointer-events-none absolute w-full top-0 h-96 opacity-50 bg-gradient-to-b from-[#990000] to-base-100"
></div>
<div class="z-50 max-w-screen-md mx-auto sticky top-0 p-4">
  <header
    class="shadow-sm grid grid-cols-[1fr_auto] justify-between backdrop-blur-lg items-center p-4 rounded-box bg-base-200/50"
  >
    <div class="flex flex-col">
      <LogoMedium />
      <p class="text-xs text-base-content/70 sm:text-sm">
        Schedule sharing app for Stony Brook University
      </p>
    </div>
    <div>
      <GoogleAuth></GoogleAuth>
    </div>
  </header>
</div>
<main
  class="relative z-40 text-center p-4 max-w-screen-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-10"
>
  <div class="flex flex-col gap-2.5">
    <h2 class="text-3xl font-semibold tracking-tight">At a glance</h2>
    <div class="rounded-box border p-4 flex flex-col gap-2 w-full bg-base-100">
      <EventDetails event={sampleEvent}></EventDetails>
    </div>
  </div>
  <div class="flex flex-col gap-2.5">
    <h2 class="text-3xl font-semibold tracking-tight">Who's free?</h2>
    <div>
      <DemoFriend name="Wolfie">
        <p>SBU 101 starts in 0:30</p>
        <p>1 class left</p>
      </DemoFriend>
    </div>
    <div class="opacity-50">
      <DemoFriend name="Kenny" busy>
        <p>WRT 102 ends in 1:45</p>
        <p>2 classes left</p>
      </DemoFriend>
    </div>
    <div class="opacity-25">
      <DemoFriend name="John">
        <p>PHY 133 starts in 3:00</p>
        <p>0 classes left</p>
      </DemoFriend>
    </div>
  </div>
  <div>
    <enhanced:img
      src="$lib/assets/promo/theme-split.png"
      alt="Freetime with light and dark theme"
      class="w-56 mx-auto"
    />
    <div class="leading-loose text-base-content/75 text-center">
      <p>Fluid, responsive, and mobile friendly</p>
      <p>Customizable themes</p>
    </div>
  </div>
  <div>
    <enhanced:img
      src="$lib/assets/promo/compare.png"
      alt="Freetime side by side view of two schedules"
      class="w-56 mx-auto"
    />
    <div class="leading-loose text-base-content/75 text-center">
      <p>Share and compare schedules</p>
    </div>
  </div>
  <div class="sm:col-span-2">
    <h2 class="text-2xl font-bold">Other features</h2>
    <ul class="mt-2 leading-loose text-base-content/75">
      <li>Import your schedule from SOLAR</li>
      <li>Navigate to your classes with Google Maps™</li>
      <li>Export to iCalendar</li>
    </ul>
  </div>
</main>
<div class="flex flex-col items-center text-center">
  <h2 id="get-started" class="mt-10 text-3xl font-semibold tracking-tight">Get started</h2>
  <div class="mt-5">
    <GoogleAuth></GoogleAuth>
  </div>
  <p class="mt-5 text-base-content/50 text-sm max-w-md mx-auto text-balance">
    Your Google™ account is only used to sign you in with your email. No other data is collected.
  </p>
</div>
<div class="p-5 text-xs text-base-content/50 text-center col-span-2 pb-10">
  <p>Google Maps™ is a trademark of Google LLC.</p>
  <p><sup>1</sup>Not affiliated with Stony Brook University.</p>
  <p>
    Need help? Send an email to <a class="link" href="mailto:support@kennyhui.dev">
      support@kennyhui.dev
    </a>
  </p>
  <p>
    Copyright &copy; 2025 Kenny Hui. All rights reserved. <a href="/privacy-policy" class="link">
      Privacy Policy
    </a>
  </p>
</div>
