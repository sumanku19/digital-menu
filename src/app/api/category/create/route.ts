import { db } from "../../../../server/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { randomOtp } from "../../../../lib/utils";
import { loginSchema, categoryCreateSchema } from "../../../../lib/validator";
import { getSessionUser } from "~/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, restaurantId } = categoryCreateSchema.parse(body);

    const validRestaurant = await db.restaurant.findFirst({
      where: { id: restaurantId, ownerId: user.id },
    });

    if (!validRestaurant)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const category = await db.category.create({
      data: {
        name,
        restaurantId,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
