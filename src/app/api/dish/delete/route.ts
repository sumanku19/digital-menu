import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { getSessionUser } from "~/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();

    const dish = await db.dish.findFirst({
      where: { id },
      include: { restaurant: true },
    });

    if (!dish || dish.restaurant.ownerId !== user.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await db.dish.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
