import { db } from "../../../../../server/db";
import { getSessionUser } from "../../../../../lib/auth";
import EditRestaurantForm from "./form";

export default async function EditPage({ params }: any) {
  const user = await getSessionUser();

  const restaurant = await db.restaurant.findFirst({
    where: { id: params.id, ownerId: user?.id },
  });

  if (!restaurant) return <div>Not Found</div>;

  return (
    <EditRestaurantForm restaurant={restaurant} />
  );
}
