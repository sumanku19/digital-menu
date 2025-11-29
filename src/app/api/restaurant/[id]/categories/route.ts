import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const categories = await db.category.findMany({
      where: { restaurantId: id },
    });

    return NextResponse.json({ categories });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
