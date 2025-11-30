"use client";

import { useState, type SetStateAction, type ChangeEvent } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  async function sendOtp() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email.trim() === "" || email === null){
        alert("Email address cannot be empty");
        return;
    }else if(regex.test(email) === false){
        alert("Invalid Email address");
        return;
    }

     await fetch("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    }).then((res) => res.json()).then((data) => {
      console.log("OTP sent:", data.otp);
      window.location.href = `/verify?id=${email}`;
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
