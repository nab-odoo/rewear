import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import ItemFeed from "./ItemFeed";
import AddItemForm from "./AddItemForm";
import ItemDetail from "./ItemDetail"; // ✅ Make sure this file exists
import Dashboard from "./Dashboard";


export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => !data.error && setUser(data))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:4000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {user && (
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">
            👋 Welcome, {user.name || user.email}!
          </h1>
          <div className="mt-4 flex gap-4 justify-center">
            <Link
              to="/"
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Browse Items
            </Link>
            <Link
              to="/add"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Item
            </Link>
            <Link
  to="/dashboard"
  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
>
  Dashboard
</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <Routes>
        {/* Home feed */}
        <Route path="/" element={<ItemFeed />} />

        {/* Auth routes */}
        <Route
          path="/login"
          element={<LoginForm onAuth={(u) => setUser(u)} />}
        />
        <Route
          path="/signup"
          element={<SignupForm onAuth={(u) => setUser(u)} />}
        />

        {/* Item detail */}
        <Route
          path="/item/:id"
          element={
            user ? <ItemDetail /> : <Navigate to="/login" replace />
          }
        />

        {/* Add item */}
        <Route
          path="/add"
          element={
            user ? <AddItemForm /> : <Navigate to="/login" replace />
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />

<Route
  path="/dashboard"
  element={user ? <Dashboard /> : <Navigate to="/login" replace />}
/>

      </Routes>
    </div>
  );
}
