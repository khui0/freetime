import { pb } from "$lib/pocketbase.js";
import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  const username: string = params.slug;

  const res = await pb.collection("schedules").getFullList({ expand: "user" });
  const record = res.find((record) => record?.expand?.user?.username === username);
  const schedule = record?.schedule;

  if (res) {
    return {
      schedule,
      username,
      updated: record?.updated,
    };
  } else {
    error(404, "Not found");
  }
}
