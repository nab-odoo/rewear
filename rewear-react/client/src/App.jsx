import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import ItemFeed from "./ItemFeed";
import AddItemForm from "./AddItemForm";

export default function App() {
  /* basic auth + UI state */
  const [user, setUser]         = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showAdd, setShowAdd]   = useState(false);  // toggles AddItemForm
  const [loading, setLoading]   = useState(true);

  /* check session once on load */
  useEffect(() => {
    fetch("http://localhost:4000/api/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => !d.error && setUser(d))
      .finally(() => setLoading(false));
  }, []);

  /* login/signup callback */
  const handleAuthSuccess = (u) => setUser(u);

  /* logout */
  const handleLogout = async () => {
    await fetch("http://localhost:4000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setShowAdd(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  /* ---------- Logged‑in UI ---------- */
  if (user) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">
            👋 Welcome, {user.name || user.email}!
          </h1>
          <div className="mt-4 flex gap-4 justify-center">
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {showAdd ? "← Back to Feed" : "+ Add Item"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </header>

        {showAdd ? <AddItemForm /> : <ItemFeed />}
      </div>
    );
  }

  /* ---------- Visitor (not logged) UI ---------- */
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {showSignup ? (
        <SignupForm onAuth={handleAuthSuccess} />
      ) : (
        <LoginForm onAuth={handleAuthSuccess} />
      )}

      <p className="mt-4 text-sm">
        {showSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          className="text-blue-600 underline"
          onClick={() => setShowSignup(!showSignup)}
        >
          {showSignup ? "Log In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
}
