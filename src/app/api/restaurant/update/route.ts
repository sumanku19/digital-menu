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
    const { id, name, location } = { ...body };

    restaurantCreateSchema.parse({ name, location });

    const slug = generateSlug(name);

    const updated = await db.restaurant.update({
      where: { id },
      data: { name, location, slug },
    });

    return NextResponse.json({ success: true, restaurant: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
