import { db } from "../../../../server/db";
import { getSessionUser } from "../../../../lib/auth";
import Link from "next/link";

export default async function RestaurantDetails({ params }: any) {
  const user = await getSessionUser();

  const restaurant = await db.restaurant.findFirst({
    where: { id: params.id, ownerId: user?.id },
  });

  if (!restaurant) return <div>Not Found</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{restaurant.name}</h1>
      <p className="text-gray-600">{restaurant.location}</p>
      <p className="text-sm text-gray-500 mt-2">Slug: {restaurant.slug}</p>

      <div className="mt-6 flex gap-3">
        <Link
  href={`/menu/${restaurant.slug}`}
  className="bg-green-600 text-white px-4 py-2 rounded"
>
  View Public Menu
</Link>

        <Link
          href={`/dashboard/restaurants/${restaurant.id}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Edit
        </Link>

        <Link
          href={`/dashboard/menu/${restaurant.id}`}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Manage Menu
        </Link>
      </div>
    </div>
  );
}
