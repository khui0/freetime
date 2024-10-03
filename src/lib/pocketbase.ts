import PocketBase from "pocketbase";

import { writable } from "svelte/store";

export const pb = new PocketBase("https://db.kennyhui.dev/");

export const currentUser = writable(pb.authStore.model);

export async function auth() {
  await pb.collection("users").authWithOAuth2({ provider: "google" });
}

export async function signOut() {
  try {
    window.location.replace("/");
  } finally {
    pb.authStore.clear();
  }
}

pb.authStore.onChange(() => {
  currentUser.set(pb.authStore.model);
});

export async function ensureScheduleExists() {
  await pb
    .collection("schedules")
    .getFirstListItem(`user="${pb.authStore.model?.id}"`)
    .catch(() => {
      pb.collection("schedules").create({ user: pb.authStore.model?.id, schedule: [] });
    });
}

export async function ensureFriendsExist() {
  await pb
    .collection("friends")
    .getFirstListItem(`user="${pb.authStore.model?.id}"`)
    .catch(() => {
      pb.collection("friends").create({ user: pb.authStore.model?.id, friends: [] });
    });
}
