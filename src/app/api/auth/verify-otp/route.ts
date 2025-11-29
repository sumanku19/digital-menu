import { db } from "../../../../server/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { randomOtp } from "../../../../lib/utils";
import { loginSchema, otpVerifySchema } from "../../../../lib/validator";
import { cookies } from "next/headers";


export async function POST(req: Request) {
  try {
    const data = await req.json();
   
    const { email, code, fullName, country } = otpVerifySchema.parse(data);

    const otp = await db.oTP.findFirst({
      where: { email, code },
      orderBy: { expiresAt: "desc" },
    });

     console.log("myotp:", otp);

    if (!otp || otp.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Delete OTP after usage
    await db.oTP.deleteMany({ where: { email } });

    // Check if user exists
    let user = await db.user.findUnique({ where: { email } });

    if (!user) {
      user = await db.user.create({
        data: { email, fullName, country },
      });
    }

    // Set session cookie
    (await
      // Set session cookie
      cookies()).set("sessionUser", user.id, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "strict",
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
