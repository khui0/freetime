<script lang="ts">
  interface Result {
    error?: string;
    success?: string;
  }

  export let type: "username" | "password" | "email";
  export let placeholder: string | undefined = undefined;

  export let result: Result = {};

  import { z } from "zod";

  let value: string;

  const schema = {
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must contain at least 8 characters"),
  };

  function validate() {
    const res = schema[type].safeParse(value);
    if (res.success) {
      result = {};
      result.success = res.data;
    } else {
      result = {};
      result.error = res.error.errors[0].message;
    }
  }
</script>

{#if type === "username"}
  <input
    class="input input-bordered"
    type="text"
    placeholder={placeholder || "Username"}
    bind:value
    on:input={validate}
  />
{:else if type === "password"}
  <input
    class="input input-bordered"
    type="password"
    placeholder={placeholder || "Password"}
    bind:value
    on:input={validate}
  />
{:else if type === "email"}
  <input
    class="input input-bordered"
    type="email"
    placeholder={placeholder || "Email address"}
    bind:value
    on:input={validate}
  />
{/if}
