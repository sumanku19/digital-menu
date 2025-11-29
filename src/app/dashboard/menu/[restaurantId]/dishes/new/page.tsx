"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { use } from "react";

import { Button } from "~/components/ui/button";

const Input = (props: any) => (
  <input
    {...props}
    className={`border rounded px-3 py-2 w-full ${props.className ?? ""}`}
  />
);

// const uploadDir = path.join(process.cwd(), "public/uploads/dishes");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

const ImageUpload = ({ imageUrl, onImageChange, isUploading }: { imageUrl: string; onImageChange: (url: string) => void; isUploading: boolean }) => {
  const [preview, setPreview] = useState<string>("");
  const [uploadError, setUploadError] = useState("");
console.log("imageUrl prop:", imageUrl);
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; 
    console.log("selected file:", file);
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploadError("");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("upload response:", data);

      if (!res.ok || data.error) {
        setUploadError(data.error || "Upload failed");
        setPreview("");
        return;
      }

      onImageChange(data.imageUrl);
    } catch (err: any) {
      setUploadError(err.message);
      setPreview("");
    }
  };

  return (
    <div className="mt-3">
      <label className="block text-sm font-medium mb-2">Dish Image</label>
      <div className="flex gap-3">
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="flex-1 p-2 border rounded"
        />
      </div>
      {uploadError && <p className="text-red-600 text-sm mt-1">{uploadError}</p>}
      {preview && (
        <div className="mt-3">
          <img src={preview} alt="Preview" className="w-32 h-24 object-cover rounded" />
        </div>
      )}
      {imageUrl && !preview && (
        <div className="mt-3">
          <img src={imageUrl} alt="Dish" className="w-32 h-24 object-cover rounded" />
        </div>
      )}
    </div>
  );
};

interface DishParams {
  restaurantId: string;
}

export default function CreateDish({ params }: { params: Promise<DishParams> }) {
  const { restaurantId } = use(params);

  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [spiceLevel, setSpiceLevel] = useState(0);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/restaurant/${restaurantId}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setCategories(data.categories || []);
        }
      })
      .catch((err) => setError(err.message));
  }, [restaurantId]);

  async function createDish() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/dish/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: desc,
          imageUrl,
          spiceLevel: Number(spiceLevel),
          restaurantId,
          categoryIds: selectedCats,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Failed to create dish");
        setLoading(false);
        return;
      }

      window.location.href = `/dashboard/menu/${restaurantId}`;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 border p-6 rounded">
      <h1 className="text-2xl font-bold mb-4">New Dish</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Input placeholder="Dish name" value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />

      <ImageUpload imageUrl={imageUrl} onImageChange={setImageUrl} isUploading={loading} />

      <Input placeholder="Description" value={desc} className="mt-3" onChange={(e: ChangeEvent<HTMLInputElement>) => setDesc(e.target.value)} />

      <Input placeholder="Spice Level (0-5)" type="number" value={spiceLevel} className="mt-3" onChange={(e: ChangeEvent<HTMLInputElement>) => setSpiceLevel(Number(e.target.value))} />

      <div className="mt-4">
        <p className="font-semibold mb-2">Assign to Categories:</p>
        {categories.length === 0 ? (
          <p className="text-gray-500 text-sm">No categories available</p>
        ) : (
          categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={cat.id}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.checked) {
                    setSelectedCats([...selectedCats, cat.id]);
                  } else {
                    setSelectedCats(selectedCats.filter((id) => id !== cat.id));
                  }
                }}
              />
              {cat.name}
            </label>
          ))
        )}
      </div>

      <Button className="mt-6 w-full" onClick={createDish} disabled={loading}>
        {loading ? "Creating..." : "Create Dish"}
      </Button>
    </div>
  );
}
