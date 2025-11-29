import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { getSessionUser } from "~/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, name, description, imageUrl, spiceLevel, categoryIds } = body;

    const dish = await db.dish.findFirst({
      where: { id },
      include: { restaurant: true },
    });

    if (!dish || dish.restaurant.ownerId !== user.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const updatedDish = await db.dish.update({
      where: { id },
      data: {
        name,
        description,
        imageUrl,
        spiceLevel,
      },
    });

    await db.dishCategory.deleteMany({ where: { dishId: id } });

    await db.dishCategory.createMany({
      data: categoryIds.map((cid: string) => ({
        dishId: id,
        categoryId: cid,
      })),
    });

    return NextResponse.json({ success: true, dish: updatedDish });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
