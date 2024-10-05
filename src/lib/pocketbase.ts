import PocketBase, { type RecordModel } from "pocketbase";

import { writable, type Writable } from "svelte/store";

export const pb = new PocketBase("https://db.kennyhui.dev/");
export const currentUser = writable(pb.authStore.model);
export const ready = writable(false);

export const schedules: Writable<RecordModel[]> = writable([]);
export const friends: Writable<RecordModel[]> = writable([]);

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

export async function init() {
  // Update "schedules" store
  schedules.set(await pb.collection("schedules").getFullList());
  pb.collection("schedules").subscribe("*", async (e) => {
    if (e.action === "update") {
      schedules.set(await pb.collection("schedules").getFullList());
    }
  });
  // Update "friends" store
  friends.set(
    await pb.collection("friends").getFullList({
      expand: "friends,user",
    }),
  );
  pb.collection("friends").subscribe("*", async (e) => {
    if (e.action === "update") {
      friends.set(
        await pb.collection("schedules").getFullList({
          expand: "friends,user",
        }),
      );
    }
  });
  ready.set(true);
}

pb.authStore.onChange(() => {
  currentUser.set(pb.authStore.model);
  if (pb.authStore.isValid) {
    init();
    createList("schedules", "schedule");
    createList("friends", "friends");
  }
});

async function createList(collection: string, list: string) {
  const value: { [key: string]: unknown } = {
    user: pb.authStore.model?.id,
  };
  value[list] = [];
  await pb
    .collection(collection)
    .getFirstListItem(`user="${pb.authStore.model?.id}"`)
    .catch(() => {
      pb.collection(collection).create(value);
    });
}
