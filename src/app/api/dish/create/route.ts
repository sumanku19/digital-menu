import { NextResponse } from "next/server";
import { getSessionUser } from "~/lib/auth";
import { db } from "~/server/db";
import { dishCreateSchema } from "~/lib/validator";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    console.log("image url:", body);
    const { name, description, imageUrl, spiceLevel, restaurantId, categoryIds } =
      dishCreateSchema.parse(body);

      
    const restaurant = await db.restaurant.findFirst({
      where: { id: restaurantId, ownerId: user.id },
    });

    if (!restaurant)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dish = await db.dish.create({
      data: {
        name,
        description,
        imageUrl,
        spiceLevel,
        restaurantId,
      },
    });

    await db.dishCategory.createMany({
      data: categoryIds.map((c: any) => ({
        categoryId: c,
        dishId: dish.id,
      })),
    });

    return NextResponse.json({ success: true, dish });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
