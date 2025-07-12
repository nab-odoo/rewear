import { useEffect, useState } from "react";

export default function ItemFeed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Browse Items</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.length === 0 && (
          <p className="text-gray-600 text-center col-span-full">No items listed yet.</p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow rounded-lg p-4 border"
          >
            <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
            <p className="text-gray-600 text-sm mb-1">
              Size: {item.size} | Condition: {item.condition}
            </p>
            <p className="text-gray-500 text-sm italic mb-2">
              {item.category} — added by {item.owner?.name || item.owner.email}
            </p>
            <p className="text-sm line-clamp-3 text-gray-700">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
