import { useState } from "react";

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // session cookie!
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Logged in as user ID: " + data.userId);
      } else {
        setMessage("❌ " + data.error);
      }
    } catch (err) {
      setMessage("❌ Network error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10"
    >
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        className="block w-full border px-3 py-2 mb-3"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className="block w-full border px-3 py-2 mb-3"
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Log In
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </form>
  );
}

export default LoginForm;
