"use client";

import { useState, type ChangeEvent } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function NewRestaurant() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  async function handleSubmit() {
    await fetch("/api/restaurant/create", {
      method: "POST",
      body: JSON.stringify({ name, location }),
    });

    window.location.href = "/dashboard";
  }

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">New Restaurant</h1>

      <Input
        placeholder="Restaurant Name"
        value={name}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
      />

      <Input
        placeholder="Location"
        className="mt-3"
        value={location}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
      />

      <Button className="mt-4 w-full" onClick={handleSubmit}>
        Create
      </Button>
    </div>
  );
}
