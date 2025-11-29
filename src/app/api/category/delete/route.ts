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

    const { id } = await req.json();

    const category = await db.category.findFirst({
      where: { id },
      include: { restaurant: true },
    });

    if (!category || category.restaurant.ownerId !== user.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await db.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
