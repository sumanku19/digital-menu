"use client";

import React, { useState, type ChangeEvent } from "react";
import { Button } from "~/components/ui/button";
import { COUNTRIES } from "../../lib/countries"
import { Input } from "~/components/ui/input";

export default function VerifyPage({ searchParams }: { searchParams: any }) {
  const [code, setCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");

  // Unwrap searchParams proxy for client components
  const params = React.use ? React.use(searchParams) : searchParams;
  const email = params.email;

  async function verify() {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, code, fullName, country }),
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = "/dashboard";
    } else {
      alert(data.error);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-5">Verify OTP</h1>

      <Input
        placeholder="Enter OTP"
        value={code}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
      />

      <Input
        placeholder="Full Name"
        className="mt-3"
        value={fullName}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
      />

      <select
        className="border p-2 rounded mt-3 w-full"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      >
        <option value="">Select Country</option>
        {COUNTRIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <Button onClick={verify} className="mt-4 w-full">
        Verify & Login
      </Button>
    </div>
  );
}
