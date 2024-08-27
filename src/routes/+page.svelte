<script lang="ts">
  import { signOut } from "$lib/pocketbase";
</script>

<a class="link" href="/sign-in">Sign in</a>
<a class="link" href="/register">Register</a>
<button class="btn" on:click={signOut}>Sign out</button>
