import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  (await cookies()).set("sessionUser", "", { maxAge: 0 });

  return NextResponse.redirect("/login");
}
