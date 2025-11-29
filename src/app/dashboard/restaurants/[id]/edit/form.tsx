"use client";

import { useState, type ChangeEvent } from "react";
import { Button } from "~/components/ui/button";

const Input = (props: any) => (
  <input
    {...props}
    className={`border rounded px-3 py-2 w-full ${props.className ?? ""}`}
  />
);

export default function EditRestaurantForm({ restaurant }: any) {
  const [name, setName] = useState(restaurant.name);
  const [location, setLocation] = useState(restaurant.location);

  async function handleSubmit() {
    await fetch("/api/restaurant/update", {
      method: "POST",
      body: JSON.stringify({
        id: restaurant.id,
        name,
        location,
      }),
    });

    window.location.href = "/dashboard";
  }

  async function handleDelete() {
    if (!confirm("Delete this restaurant?")) return;

    await fetch("/api/restaurant/delete", {
      method: "POST",
      body: JSON.stringify({ id: restaurant.id }),
    });

    window.location.href = "/dashboard";
  }

  return (
    <div className="max-w-lg mx-auto mt-10 border p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Restaurant</h1>

      <Input value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />

      <Input
        className="mt-3"
        value={location}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
      />

      <Button className="mt-4 w-full" onClick={handleSubmit}>
        Save Changes
      </Button>

      <Button
        // variant="destructive"
        className="mt-3 w-full"
        onClick={handleDelete}
      >
        Delete Restaurant
      </Button>
    </div>
  );
}
