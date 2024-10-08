import PocketBase, { type RecordModel } from "pocketbase";

import { writable, type Writable } from "svelte/store";

export const pb = new PocketBase("https://db.kennyhui.dev/");
export const currentUser = writable(pb.authStore.model);
export const ready = writable(false);

export const schedules: Writable<RecordModel[]> = writable([]);
export const friends: Writable<{
  self: RecordModel | undefined;
  friends: RecordModel[];
  outgoing: RecordModel[];
  requests: RecordModel[];
}> = writable();

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
  updateFriends();
  pb.collection("friends").subscribe("*", async (e) => {
    if (e.action === "update") updateFriends();
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

async function updateFriends() {
  const list = await pb.collection("friends").getFullList({
    expand: "friends,user",
  });
  // Get own friends list record
  const self = list.find((r) => r.user === pb.authStore.model?.id);
  // List of people who have you added as array of user records
  const others = list.filter((r) => r.user !== pb.authStore.model?.id).map((r) => r?.expand?.user);

  if (!self || !others) return;
  friends.set({
    self,
    friends: calculateFriends(self, others),
    outgoing: calculateOutgoing(self, others),
    requests: calculateRequests(self, others),
  });
}

function calculateFriends(self: RecordModel, others: RecordModel[]): RecordModel[] {
  return (
    self?.expand?.friends?.filter((record: RecordModel) =>
      others.map((item) => item.id).includes(record.id),
    ) || []
  );
}

function calculateOutgoing(self: RecordModel, others: RecordModel[]): RecordModel[] {
  return (
    self?.expand?.friends?.filter(
      (record: RecordModel) => !others.map((item) => item.id).includes(record.id),
    ) || []
  );
}

function calculateRequests(self: RecordModel, others: RecordModel[]): RecordModel[] {
  return others.filter((item) => !self?.friends?.includes(item.id));
}
