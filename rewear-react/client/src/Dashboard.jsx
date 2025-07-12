import { useEffect, useState } from "react";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/dashboard", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setPoints(data.points || 0);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Loading dashboard…</p>;

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">👤 My Dashboard</h2>

      <p className="mb-4 text-gray-700">💰 Points: <strong>{points}</strong></p>

      <h3 className="text-lg font-semibold mb-2">Uploaded Items</h3>
      {items.length === 0 ? (
        <p className="text-gray-500">You haven’t listed any items yet.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="border p-4 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    item.status === "available"
                      ? "bg-green-100 text-green-700"
                      : item.status === "swapped"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
