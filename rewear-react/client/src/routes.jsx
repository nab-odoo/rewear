import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SignupForm from "./SignupForm";
import LoginForm  from "./LoginForm";
import AddItemForm from "./AddItemForm";
import ItemFeed   from "./ItemFeed";

export default function AppRoutes() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* session check once */
  useEffect(() => {
    fetch("http://localhost:4000/api/me", { credentials: "include" })
      .then(r => r.json())
      .then(d => !d.error && setUser(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="h-screen flex items-center justify-center">Loading…</p>;

  return (
    <Routes>
      {/* Public route */}
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

      {/* Protected routes */}
      <Route
        path="/add"
        element={
          user ? <AddItemForm /> : <Navigate to="/login" replace />
        }
      />

      {/* Catch‑all -> home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
