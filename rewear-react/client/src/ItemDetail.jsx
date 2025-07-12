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

  if (loading) return <p className="p-6">Loading item...</p>;
  if (!item || item.error) return <p className="p-6 text-red-600">Item not found</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 mt-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-2">{item.title}</h1>

      <p className="text-sm text-gray-600 mb-2">
        Uploaded by: {item.owner?.name || item.owner.email}
      </p>

      <p className="mb-2 text-gray-700">
        <strong>Category:</strong> {item.category} <br />
        <strong>Size:</strong> {item.size} <br />
        <strong>Condition:</strong> {item.condition}
      </p>

      <p className="mb-3 text-gray-800">{item.description}</p>

      {item.tags && (
        <div className="text-sm text-gray-500 mb-4">
          Tags: {item.tags.split(",").map((t) => `#${t.trim()}`).join(" ")}
        </div>
      )}

      <Link to="/" className="text-blue-600 underline">
        ← Back to all items
      </Link>
    </div>
  );
}
