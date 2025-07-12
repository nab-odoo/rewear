import { useState } from "react";

export default function LoginForm({ onAuth }) {
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in…");

    try {
      const res  = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Logged in!");
        onAuth && onAuth(data.user);         // <—— notify App.jsx
      } else {
        setMessage("❌ " + data.error);
      }
    } catch {
      setMessage("❌ Network error");
    }
  };

  return (
    <form onSubmit={handleSubmit}
          className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Log In</h2>

      <input name="email"
             type="email"
             placeholder="Email"
             value={form.email}
             onChange={handleChange}
             className="block w-full border px-3 py-2 mb-3" required />
      <input name="password"
             type="password"
             placeholder="Password"
             value={form.password}
             onChange={handleChange}
             className="block w-full border px-3 py-2 mb-3" required />

      <button type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded">
        Log In
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </form>
  );
}
