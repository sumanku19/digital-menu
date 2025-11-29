"use client";

import { useState, type SetStateAction, type ChangeEvent } from "react";
import { Button } from "~/components/ui/button";

const Input = (props: any) => (
  <input
    {...props}
    className={`border rounded px-3 py-2 w-full ${props.className ?? ""}`}
  />
);


export default function LoginPage() {
  const [email, setEmail] = useState("");

  async function sendOtp() {
    await fetch("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    }).then((res) => res.json()).then((data) => {
      console.log("OTP sent:", data.otp);
      window.location.href = `/verify?email=${email}`;
    });
    
    
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-5">Login</h1>

      <Input
        placeholder="Enter email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
      />

      <Button onClick={sendOtp} className="mt-4 w-full">
        Send Verification Code
      </Button>
    </div>
  );
}
