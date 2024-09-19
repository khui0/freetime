import PocketBase, { type AuthModel } from "pocketbase";

import { writable } from "svelte/store";

export const pb = new PocketBase("https://db.kennyhui.dev/");

export const currentUser = writable(pb.authStore.model);

let user: AuthModel;

pb.authStore.onChange(() => {
  currentUser.set(pb.authStore.model);
});

currentUser.subscribe((res) => {
  user = res;
});

export async function signOut() {
  try {
    window.location.replace("/");
  } finally {
    pb.authStore.clear();
  }
}

export async function ensureScheduleExists() {
  await pb
    .collection("schedules")
    .getFirstListItem(`user="${user?.id}"`)
    .catch(() => {
      pb.collection("schedules").create({ user: user?.id, schedule: [] });
    });
}

export async function ensureFriendsExist() {
  await pb
    .collection("friends")
    .getFirstListItem(`user="${user?.id}"`)
    .catch(() => {
      pb.collection("friends").create({ user: user?.id, friends: [] });
    });
}
