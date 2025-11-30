import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import { getSessionUser } from "~/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;
    console.log("Received file:", file);
    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image too large (max 5MB)" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // Optimize image with sharp
    const optimized = await sharp(uint8Array)
      .resize(800, 600, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 80 })
      .toBuffer();

    // Create uploads directory
    const uploadsDir = join(process.cwd(), "public", "uploads", "dishes");
    await mkdir(uploadsDir, { recursive: true });

    // Generate filename with timestamp
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
    const filepath = join(uploadsDir, filename);

    await writeFile(filepath, optimized);

    const imageUrl = process.env.NEXT_PUBLIC_BASE_URL + `/uploads/dishes/${filename}`;

    return NextResponse.json({ success: true, imageUrl });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
