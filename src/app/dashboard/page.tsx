import { db } from "../../server/db";
import { getSessionUser } from "../../lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getSessionUser();
  const restaurants = await db.restaurant.findMany({
    where: { ownerId: user?.id },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Restaurants</h1>
        <Link
          href="/dashboard/restaurants/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          New Restaurant
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {restaurants.map((r) => (
          <Link
            key={r.id}
            href={`/dashboard/restaurants/${r.id}`}
            className="border p-4 rounded shadow hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">{r.name}</h2>
            <p className="text-gray-500">{r.location}</p>
            <p className="text-sm text-gray-600 mt-2">Slug: {r.slug}</p>
          </Link>
        ))}

        {restaurants.length === 0 && (
          <p className="text-gray-500 text-center col-span-full">
            No restaurants yet.
          </p>
        )}
      </div>
    </div>
  );
}
