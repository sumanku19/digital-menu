import Link from "next/link";

import { LatestPost } from "~/app/_componentsold/post";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex flex-col h-screen items-center justify-center">
      <h1 className="text-5xl font-bold">Digital Menu Platform</h1>
      <p className="text-gray-600 mt-2">
        Manage restaurants, menus, and QR-based digital experiences.
      </p>

      <a
        href="/login"
        className="mt-6 bg-black text-white px-6 py-3 rounded-lg"
      >
        Login
      </a>
    </main>
    </HydrateClient>
  );
}
