import { useEffect, useState } from "react";
import { Link } from "react-router-dom";  // required for card link
export default function ItemFeed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/items")
      .then((r) => r.json())
      .then((d) => setItems(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-gray-600">Loading items…</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Browse Items</h2>

      {items.length === 0 ? (
        <p className="text-gray-600 text-center">No items listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link to={`/item/${item.id}`} key={item.id}>
              <div className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-1">
                  Size: {item.size} | Condition: {item.condition}
                </p>
                <p className="text-gray-500 text-sm italic mb-2">
                  {item.category} — added by{" "}
                  {item.owner?.name || item.owner.email}
                </p>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
