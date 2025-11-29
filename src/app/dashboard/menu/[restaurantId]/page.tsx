import { db } from "~/server/db";
import { getSessionUser } from "~/lib/auth";
import Link from "next/link";
import type { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default async function MenuDashboard({ params }: any) {
  const user = await getSessionUser();

  const restaurant = await db.restaurant.findFirst({
    where: { id: params.restaurantId, ownerId: user?.id },
    include: {
      categories: true,
      dishes: {
        include: {
          categories: { include: { category: true } },
        },
      },
    },
  });

  if (!restaurant) return <p>Not Found</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{restaurant.name} – Menu</h1>

      {/* CATEGORY HEADER */}
      <div className="flex justify-between items-center mt-6">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Link
          href={`/dashboard/menu/${restaurant.id}/categories/new`}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Add Category
        </Link>
      </div>

      {/* CATEGORY LIST */}
      <ul className="mt-4 space-y-2">
        {restaurant.categories.map((c:any) => (
          <li
            key={c.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            {c.name}
            <form action="/api/category/delete" method="POST">
              <input type="hidden" name="id" value={c.id} />
            </form>
          </li>
        ))}
      </ul>

      {/* DISH HEADER */}
      <div className="flex justify-between items-center mt-10">
        <h2 className="text-xl font-semibold">Dishes</h2>
        <Link
          href={`/dashboard/menu/${restaurant.id}/dishes/new`}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Add Dish
        </Link>
      </div>

      {/* DISH LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {restaurant.dishes.map((d: { id: Key | null | undefined; imageUrl: string | Blob | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; categories: { category: { name: any; }; }[]; }) => (
          <Link
            key={d.id}
            href={`/dashboard/menu/${restaurant.id}/dishes/${d.id}`}
            className="border p-4 rounded shadow hover:bg-gray-50"
          >
            <img
              src={d.imageUrl}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="text-lg font-bold mt-2">{d.name}</h3>
            <p className="text-gray-600">{d.description}</p>

            <p className="text-sm text-blue-600 mt-2">
              Categories:{" "}
              {d.categories.map((c: { category: { name: any; }; }) => c.category.name).join(", ") || "None"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
