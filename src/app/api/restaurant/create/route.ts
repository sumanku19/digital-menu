import { NextResponse } from "next/server";
import { getSessionUser } from "../../../../lib/auth";
import { db } from "../../../../server/db";
import { restaurantCreateSchema } from "../../../../lib/validator";
import { generateSlug } from "../../../../lib/utils";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, location } = restaurantCreateSchema.parse(body);

    const slug = generateSlug(name);

    const restaurant = await db.restaurant.create({
      data: {
        name,
        location,
        slug,
        ownerId: user.id,
      },
    });

    return NextResponse.json({ success: true, restaurant });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
