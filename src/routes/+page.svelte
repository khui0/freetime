<script lang="ts">
  import { title } from "$lib/store";
  $title = "";

  import GoogleAuth from "$lib/components/GoogleAuth.svelte";
  import Logo from "$lib/components/Logo.svelte";

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
    document.documentElement?.setAttribute("data-theme", "light");
  });

  import EventDetails from "$lib/components/calendar/EventDetails.svelte";
  const sampleEvent: CalendarEvent = {
    days: [false, true, false, true, false, false, false],
    from: "15:30",
    location: "eb",
    number: "210",
    room: "121",
    title: "AMS",
    to: "16:50",
    type: "lecture",
  };

  import DemoFriend from "./DemoFriend.svelte";
</script>

<main class="text-center p-10 w-[min(100%,1000px)] mx-auto">
  <div class="mx-auto w-fit"><Logo></Logo></div>
  <p class="mt-5 text-center text-balance prose mx-auto">
    Social schedule viewer for Stony Brook University<sup>1</sup>
  </p>
  <div class="mt-5 flex gap-2 flex-wrap justify-center text-sm">
    <p
      class="border rounded-lg w-fit px-2 py-1 bg-base-100 hover:shadow-md hover:scale-110 hover:z-10 transition-all"
    >
      Visualize your new schedule
    </p>
    <p
      class="border rounded-lg w-fit px-2 py-1 bg-base-100 hover:shadow-md hover:scale-110 hover:z-10 transition-all"
    >
      Navigate to your classes
    </p>
    <p
      class="border rounded-lg w-fit px-2 py-1 bg-base-100 hover:shadow-md hover:scale-110 hover:z-10 transition-all"
    >
      Share your schedule with your friends
    </p>
  </div>
  <div class="mt-10">
    <GoogleAuth></GoogleAuth>
  </div>
  <h2 class="mt-10 text-5xl font-bold tracking-tight">At a glance</h2>
  <div
    class="mt-5 rounded-box border p-4 flex flex-col gap-2 w-full bg-base-100 hover:shadow-md hover:scale-105 hover:z-10 transition-all"
  >
    <EventDetails event={sampleEvent}></EventDetails>
  </div>
  <div class="flex flex-wrap justify-center mt-10">
    <div class="w-[400px]">
      <enhanced:img
        src="$lib/assets/promo/theme-split.png"
        alt="Freetime with light and dark theme"
        class="w-56 mx-auto"
      />
      <div class="prose text-center">
        <p>View your schedule on a fluid calendar that's optimized for mobile</p>
        <p>With themes! Including Dark, Light, SOLAR, and Catppuccin</p>
      </div>
    </div>
    <div class="w-[400px]">
      <enhanced:img
        src="$lib/assets/promo/compare.png"
        alt="Freetime side by side view of two schedules"
        class="w-56 mx-auto"
      />
      <div class="prose text-center">
        <p>Share your schedule with your friends</p>
        <p>Compare schedules side by side</p>
      </div>
    </div>
  </div>
  <div class="mt-10">
    <h2 class="text-4xl font-bold">Who's free?</h2>
    <div class="mt-4">
      <DemoFriend name="Wolfie">
        <p>SBU 101 starts in 0:30</p>
        <p>1 class left</p>
      </DemoFriend>
    </div>
    <div class="mt-4 opacity-50">
      <DemoFriend name="Kenny" busy>
        <p>WRT 102 ends in 1:45</p>
        <p>2 classes left</p>
      </DemoFriend>
    </div>
    <div class="mt-4 opacity-25">
      <DemoFriend name="John">
        <p>PHY 133 starts in 3:00</p>
        <p>0 classes left</p>
      </DemoFriend>
    </div>
  </div>
  <div class="mt-5">
    <h2 class="text-2xl font-bold">Other features</h2>
    <ul class="mt-4 space-y-3">
      <li>Import your schedule from SOLAR</li>
      <li>Navigate to your classes with Google Maps™</li>
      <li>Export to iCalendar</li>
    </ul>
  </div>
  <h2 id="get-started" class="mt-10 text-4xl font-bold">Get started</h2>
  <div class="mt-5">
    <GoogleAuth></GoogleAuth>
  </div>
  <p class="mt-5 text-sm max-w-md mx-auto text-balance">
    Your Google™ account is only used to sign you in with your email. No other data is collected.
  </p>
  <div class="mt-20 text-xs text-base-content/50 text-center">
    <p>Google Maps™ is a trademark of Google LLC.</p>
    <p><sup>1</sup>Not affiliated with Stony Brook University.</p>
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
</main>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
