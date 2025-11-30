import { db } from "~/server/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { randomOtp } from "~/lib/utils";
import { loginSchema } from "~/lib/validator";

export async function POST(req: Request) {
    console.log("Request received for sending OTP", req);
  try {
    const body = await req.json();
    const { email } = loginSchema.parse(body);

    const otp = randomOtp();

    // Ensure a User exists for this email (User.email is unique)
    let user = await db.user.findUnique({ where: { email } });
    if (!user) {
      user = await db.user.create({
        data: {
          email,
          fullName: "",
          country: "",
        },
      });
    }

    // Save OTP and connect it to the user
    await db.oTP.create({
      data: {
        email,
        code: otp,
        expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 min
        user: { connect: { id: user.id } },
      },
    });

    // Send email via Gmail or SMTP only in production when credentials are provided.
    const hasMailCreds = Boolean(process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD);
    const inProd = process.env.NODE_ENV === "production";

    if (hasMailCreds && inProd) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });

      await transporter.sendMail({
        to: email,
        subject: "Your Login Verification Code",
        html: `<h2>Your verification code</h2>
               <p style="font-size: 20px;"><b>${otp}</b></p>`,
      });

      return NextResponse.json({ success: true });
    }

    // In development or when mail credentials are missing, do NOT attempt to send mail.
    // Return the OTP in the response for local testing only.
    return NextResponse.json({ success: true, otp });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
