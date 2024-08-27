import { base } from "$app/paths";
import PocketBase from "pocketbase";

import { writable } from "svelte/store";

export const pb = new PocketBase("https://db.kennyhui.dev/");

export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange(() => {
  currentUser.set(pb.authStore.model);
});

export async function signOut() {
  try {
    window.location.replace(`${base}/sign-in`);
  } finally {
    pb.authStore.clear();
  }
}
