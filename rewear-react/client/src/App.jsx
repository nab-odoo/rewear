import { useState, useEffect } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setUser(data);
      });
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:4000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {user ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-700 mb-4">
            👋 Welcome, {user.name || user.email}!
          </h1>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <>
          {showSignup ? <SignupForm /> : <LoginForm />}
          <p className="mt-4 text-sm">
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

export default App;
