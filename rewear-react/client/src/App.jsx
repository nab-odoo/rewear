import { useState, useEffect } from "react";
import SignupForm from "./SignupForm";
import LoginForm   from "./LoginForm";
import AddItemForm from "./AddItemForm";

export default function App() {
  /* session + UI state */
  const [user,       setUser]     = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [loading,    setLoading]  = useState(true);

  /* initial session check */
  useEffect(() => {
    fetch("http://localhost:4000/api/me", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (!d.error) setUser(d); })
      .finally(() => setLoading(false));
  }, []);

  /* logout */
  const handleLogout = async () => {
    await fetch("http://localhost:4000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  /* callback passed to auth forms */
  const handleAuthSuccess = (freshUser) => {
    setUser(freshUser);
  };

  /* loading spinner */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Checking session…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      {user ? (
        /* ---------- LOGGED‑IN VIEW ---------- */
        <>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-green-700">
              👋 Welcome, {user.name || user.email}!
            </h1>
            <button
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          <AddItemForm />
        </>
      ) : (
        /* ---------- VISITOR VIEW ---------- */
        <>
          {showSignup ? (
            <SignupForm onAuth={handleAuthSuccess} />
          ) : (
            <LoginForm  onAuth={handleAuthSuccess} />
          )}

          <p className="mt-4 text-sm text-center">
            {showSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              className="text-blue-600 underline"
              onClick={() => setShowSignup(!showSignup)}
            >
              {showSignup ? "Log In" : "Sign Up"}
            </button>
          </p>
        </>
      )}
    </div>
  );
}
