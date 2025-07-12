import { useState } from "react";

function SignupForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("...");

    try {
      const res = await fetch("http://localhost:4000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important for session cookies
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Signed up successfully! User ID: " + data.userId);
      } else {
        setMessage("❌ Error: " + data.error);
      }
    } catch (err) {
      setMessage("❌ Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10"
    >
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        className="block w-full border px-3 py-2 mb-3"
      />
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
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Sign Up
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </form>
  );
}

export default SignupForm;
