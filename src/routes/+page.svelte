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
    room: "145",
    title: "AMS",
    to: "16:50",
    type: "lecture",
    online: false,
  };

  import DemoFriend from "./DemoFriend.svelte";
</script>

<div class="hero min-h-screen mesh">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <div class="mx-auto w-fit"><Logo></Logo></div>
      <p class="mt-4">Schedule sharing app for Stony Brook University</p>
      <div class="mt-4">
        <GoogleAuth></GoogleAuth>
      </div>
    </div>
  </div>
</div>
<main class="text-center p-4 max-w-screen-lg mx-auto">
  <h2 class="mt-8 text-5xl font-bold tracking-tight">At a glance</h2>
  <div class="mt-5 rounded-box border p-4 flex flex-col gap-2 w-full bg-base-100">
    <EventDetails event={sampleEvent}></EventDetails>
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
  <div class="flex flex-wrap justify-around mt-10 gap-y-8">
    <div class="w-[400px]">
      <enhanced:img
        src="$lib/assets/promo/theme-split.png"
        alt="Freetime with light and dark theme"
        class="w-56 mx-auto"
      />
      <div class="prose text-center">
        <p>Fluid, responsive, and mobile friendly</p>
        <p>Customizable themes</p>
      </div>
    </div>
    <div class="w-[400px]">
      <enhanced:img
        src="$lib/assets/promo/compare.png"
        alt="Freetime side by side view of two schedules"
        class="w-56 mx-auto"
      />
      <div class="prose text-center">
        <p>Share and compare schedules</p>
      </div>
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
      Copyright &copy; 2025 Kenny Hui. All rights reserved. <a href="/privacy-policy" class="link"
        >Privacy Policy</a
      >
    </p>
  </div>
</main>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }

  @keyframes hero-gradient-animation {
    0% {
      --c-0: hsla(288, 91%, 60%, 1);
      --y-0: 73%;
      --s-start-0: 1%;
      --s-end-0: 65%;
      --x-0: 71%;
      --y-1: 79%;
      --c-1: hsla(288, 69%, 93%, 1);
      --x-1: 81%;
      --s-start-1: 1%;
      --s-end-1: 65%;
      --s-start-2: 1%;
      --s-end-2: 65%;
      --x-2: 74%;
      --y-2: 39%;
      --c-2: hsla(351, 61%, 63%, 1);
      --c-3: hsla(341, 67%, 90%, 1);
      --s-start-3: 1%;
      --s-end-3: 65%;
      --y-3: 49%;
      --x-3: 29%;
      --x-4: 56%;
      --y-4: 10%;
      --s-start-4: 1%;
      --s-end-4: 65%;
      --c-4: hsla(310, 50%, 80%, 1);
    }

    100% {
      --c-0: hsla(314, 75%, 96%, 1);
      --y-0: 21%;
      --s-start-0: 1%;
      --s-end-0: 65%;
      --x-0: 4%;
      --y-1: 9%;
      --c-1: hsla(246, 50%, 58%, 1);
      --x-1: 29%;
      --s-start-1: 1%;
      --s-end-1: 65%;
      --s-start-2: 1%;
      --s-end-2: 65%;
      --x-2: 47%;
      --y-2: 54%;
      --c-2: hsla(199, 72%, 68%, 1);
      --c-3: hsla(10, 93%, 97%, 1);
      --s-start-3: 1%;
      --s-end-3: 65%;
      --y-3: 64%;
      --x-3: 54%;
      --x-4: 37%;
      --y-4: 97%;
      --s-start-4: 1%;
      --s-end-4: 65%;
      --c-4: hsla(248, 65%, 78%, 1);
    }
  }

  @property --c-0 {
    syntax: "<color>";
    inherits: false;
    initial-value: hsla(288, 91%, 60%, 1);
  }

  @property --y-0 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 73%;
  }

  @property --s-start-0 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 1%;
  }

  @property --s-end-0 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 65%;
  }

  @property --x-0 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 71%;
  }

  @property --y-1 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 79%;
  }

  @property --c-1 {
    syntax: "<color>";
    inherits: false;
    initial-value: hsla(288, 69%, 93%, 1);
  }

  @property --x-1 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 81%;
  }

  @property --s-start-1 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 1%;
  }

  @property --s-end-1 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 65%;
  }

  @property --s-start-2 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 1%;
  }

  @property --s-end-2 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 65%;
  }

  @property --x-2 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 74%;
  }

  @property --y-2 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 39%;
  }

  @property --c-2 {
    syntax: "<color>";
    inherits: false;
    initial-value: hsla(351, 61%, 63%, 1);
  }

  @property --c-3 {
    syntax: "<color>";
    inherits: false;
    initial-value: hsla(341, 67%, 90%, 1);
  }

  @property --s-start-3 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 1%;
  }

  @property --s-end-3 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 65%;
  }

  @property --y-3 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 49%;
  }

  @property --x-3 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 29%;
  }

  @property --x-4 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 56%;
  }

  @property --y-4 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 10%;
  }

  @property --s-start-4 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 1%;
  }

  @property --s-end-4 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 65%;
  }

  @property --c-4 {
    syntax: "<color>";
    inherits: false;
    initial-value: hsla(310, 50%, 80%, 1);
  }

  .mesh {
    --c-0: hsla(288, 91%, 60%, 1);
    --y-0: 73%;
    --x-0: 71%;
    --y-1: 79%;
    --c-1: hsla(288, 69%, 93%, 1);
    --x-1: 81%;
    --x-2: 74%;
    --y-2: 39%;
    --c-2: hsla(351, 61%, 63%, 1);
    --c-3: hsla(341, 67%, 90%, 1);
    --y-3: 49%;
    --x-3: 29%;
    --x-4: 56%;
    --y-4: 10%;
    --c-4: hsla(310, 50%, 80%, 1);
    background-color: hsla(229, 67%, 89%, 1);
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 3000 3000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
      radial-gradient(
        circle at var(--x-0) var(--y-0),
        var(--c-0) var(--s-start-0),
        transparent var(--s-end-0)
      ),
      radial-gradient(
        circle at var(--x-1) var(--y-1),
        var(--c-1) var(--s-start-1),
        transparent var(--s-end-1)
      ),
      radial-gradient(
        circle at var(--x-2) var(--y-2),
        var(--c-2) var(--s-start-2),
        transparent var(--s-end-2)
      ),
      radial-gradient(
        circle at var(--x-3) var(--y-3),
        var(--c-3) var(--s-start-3),
        transparent var(--s-end-3)
      ),
      radial-gradient(
        circle at var(--x-4) var(--y-4),
        var(--c-4) var(--s-start-4),
        transparent var(--s-end-4)
      );
    animation: hero-gradient-animation 5s linear infinite alternate;
    background-blend-mode: overlay, normal, normal, normal, normal, normal;
  }
</style>
