import { db} from "~/server/db";
import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(_req: Request, { params }: any) {
  const restaurant = await db.restaurant.findUnique({
    where: { slug: params.slug },
  });

  if (!restaurant)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const menuUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/menu/${restaurant.slug}`;

  const qrData = await QRCode.toDataURL(menuUrl, {
    width: 300,
    margin: 2,
  });

  const image = qrData.split(",")[1];
  if (!image) {
    return NextResponse.json({ error: "Failed to generate QR image" }, { status: 500 });
  }
  const buffer = Buffer.from(image, "base64");

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "public, max-age=86400",
    },
  });
}
