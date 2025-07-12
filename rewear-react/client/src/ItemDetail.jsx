import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/api/items/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data);
        setLoading(false);
      });
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await fetch(`http://localhost:4000/api/items/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        setItem(data.item); // ✅ Update UI
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("❌ Network error while updating status");
    }
  };

  if (loading) return <p className="p-6">Loading item…</p>;
  if (!item || item.error) return <p className="p-6 text-red-600">Item not found</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 mt-8 rounded shadow">
      {/* Image */}
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
      ) : (
        <div className="w-full h-64 bg-gray-100 rounded mb-4 flex items-center justify-center text-gray-400">
          No image uploaded
        </div>
      )}

      <h1 className="text-2xl font-bold mb-1">{item.title}</h1>
      <p className="text-gray-700 mb-3">{item.description}</p>

      <p className="text-sm text-gray-600 mb-2">
        <strong>Category:</strong> {item.category} | <strong>Size:</strong> {item.size}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        <strong>Condition:</strong> {item.condition}
      </p>

      {/* Status */}
      <p
        className={`text-sm mb-3 font-semibold ${
          item.status === "available"
            ? "text-green-600"
            : item.status === "swapped"
            ? "text-yellow-600"
            : "text-red-600"
        }`}
      >
        Status: {item.status}
      </p>

      {/* Uploader */}
      <p className="text-sm italic mb-3">
        Uploaded by: {item.owner?.name || item.owner?.email}
      </p>

      {/* Tags */}
      {item.tags && (
        <div className="text-sm text-gray-500 mb-4">
          Tags: {item.tags.split(",").map((t) => `#${t.trim()}`).join(" ")}
        </div>
      )}

      {/* 🔁 Action Buttons */}
      {item.status === "available" && (
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleStatusChange("swapped")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Swap Request
          </button>
          <button
            onClick={() => handleStatusChange("redeemed")}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Redeem via Points
          </button>
        </div>
      )}

      <Link to="/" className="text-blue-600 underline">
        ← Back to all items
      </Link>
    </div>
  );
}
