<script lang="ts">
  import { z } from "zod";
  interface Props {
    type: "username" | "password" | "email";
    placeholder?: string | undefined;
    result?: Result;
  }

  let { type, placeholder = undefined, result = $bindable({}) }: Props = $props();

  let value: string = $state("");

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
    oninput={validate}
  />
{:else if type === "password"}
  <input
    class="input input-bordered"
    type="password"
    placeholder={placeholder || "Password"}
    bind:value
    oninput={validate}
  />
{:else if type === "email"}
  <input
    class="input input-bordered"
    type="email"
    placeholder={placeholder || "Email address"}
    bind:value
    oninput={validate}
  />
{/if}
