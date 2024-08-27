<script lang="ts">
  import { base } from "$app/paths";
  import { pb } from "$lib/pocketbase";
  import { z } from "zod";

  import { title } from "$lib/store";
  $title = "Register";

  let username: string;
  let email: string;
  let password: string;
  let passwordConfirm: string;

  let errors: String[] = [];

  let loading: boolean = false;

  const schema = z
    .object({
      username: z.string().min(3, "Username must be at least 3 characters"),
      email: z.string().email("Enter a valid email address"),
      password: z.string().min(8, "Password must contain at least 8 characters"),
      passwordConfirm: z.string().min(8, ""),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "Passwords don't match",
      path: ["passwordConfirm"],
    });

  async function register() {
    loading = true;
    try {
      const data = validate();
      if (!data) return;
      await pb.collection("users").create(data);
      sendVerificationEmail();
      window.location.href = `${window.location.origin}${base}/verify?email=${encodeURIComponent(email)}`;
    } catch (err) {
      setTimeout(() => {
        errors = ["Unable to create account"];
        loading = false;
      }, 3000);
    }
  }

  function validate() {
    const result = schema.safeParse({
      username,
      email,
      password,
      passwordConfirm,
    });
    if (result.success) {
      errors = [];
      return result.data;
    } else {
      errors = result.error?.errors
        .map((error) => error.message)
        .filter((message) => message !== "Required");
    }
    loading = false;
  }

  function sendVerificationEmail() {
    pb.collection("users").requestVerification(email);
  }
</script>

<form on:submit|preventDefault={register} class="flex flex-col gap-3">
  <input class="input input-bordered" type="text" placeholder="Username" bind:value={username} />
  <input type="email" class="input input-bordered" placeholder="Email address" bind:value={email} />
  <input
    class="input input-bordered"
    type="password"
    placeholder="Password"
    bind:value={password}
  />
  <input
    class="input input-bordered"
    type="password"
    placeholder="Confirm password"
    bind:value={passwordConfirm}
  />
  {#if errors.length > 0}
    <ul class="text-sm text-error">
      {#each errors as error}
        <li><p>{error}</p></li>
      {/each}
    </ul>
  {/if}
  <button class="btn btn-accent" on:click={register}>
    {#if !loading}
      Register
    {:else}
      <span class="loading loading-spinner loading-sm"></span>
    {/if}
  </button>
  <div class="flex justify-evenly text-sm">
    <a class="link" href="/sign-in">Sign in</a>
  </div>
</form>
