"use client";

import { useState, type ChangeEvent } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function CreateCategory({ params }: any) {
  const [name, setName] = useState("");

  async function handleSubmit() {
    await fetch("/api/category/create", {
      method: "POST",
      body: JSON.stringify({
        name,
        restaurantId: params.restaurantId,
      }),
    });

    window.location.href = `/dashboard/menu/${params.restaurantId}`;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 border p-6 rounded">
      <h1 className="text-2xl font-bold mb-4">New Category</h1>

      <Input
        placeholder="Category name"
        value={name}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
      />

      <Button className="mt-4 w-full" onClick={handleSubmit}>
        Create Category
      </Button>
    </div>
  );
}
