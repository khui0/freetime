import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  // const username: string = params.slug;
  // const post = (await posts).find((post) => post.id === params.slug);
  // if (post) {
  //   return post;
  // }

  error(404, "Not found");
}
