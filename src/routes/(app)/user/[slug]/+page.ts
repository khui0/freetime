import { pb } from "$lib/pocketbase.js";
import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  const username: string = params.slug;

  const res = await pb.collection("schedules").getFullList({ expand: "user" });
  const schedule = res.find((record) => record?.expand?.user?.username === username)?.schedule;

  if (res) {
    return {
      schedule,
      username,
    };
  } else {
    error(404, "Not found");
  }
}
