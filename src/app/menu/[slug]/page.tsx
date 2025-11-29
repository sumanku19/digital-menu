import { db } from "~/server/db";


export default async function PublicMenuPage({ params }: any) {
  const restaurant = await db.restaurant.findUnique({
    where: { slug: params.slug },
    include: {
      categories: {
        include: {
          dishes: {
            include: {
              dish: true,
            },
          },
        },
      },
      dishes: {
        include: {
          categories: true,
        },
      },
    },
  });

  if (!restaurant)
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold">Restaurant Not Found</h1>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">{restaurant.name}</h1>
        <p className="text-gray-500">{restaurant.location}</p>

        <img
          src={`/api/qr/${restaurant.slug}`}
          className="mx-auto mt-6 w-40 h-40"
          alt="QR code"
        />

        <p className="text-sm mt-2">Scan to view menu</p>
      </div>

      {restaurant.categories.map((cat) => (
        <div key={cat.id} className="mb-10">
          <h2 className="text-2xl font-bold border-b pb-2">{cat.name}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            {cat.dishes.map((dc) => (
              <div key={dc.dishId} className="border rounded p-4 shadow">
                <img
                  src={dc.dish.imageUrl}
                  className="w-full h-40 object-cover rounded"
                />

                <h3 className="text-xl font-semibold mt-3">{dc.dish.name}</h3>
                <p className="text-gray-600 mt-2">{dc.dish.description}</p>

                {dc.dish.spiceLevel !== null && (
                  <p className="mt-2 text-red-600">
                    Spice Level: {dc.dish.spiceLevel}/5
                  </p>
                )}
              </div>
            ))}

            {cat.dishes.length === 0 && (
              <p className="text-gray-500 text-sm">No dishes in this category.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
