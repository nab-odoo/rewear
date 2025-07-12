import { useState } from "react";

function AddItemForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    size: "",
    condition: "",
    tags: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Submitting...");

    try {
      const res = await fetch("http://localhost:4000/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Item listed successfully!");
        setForm({
          title: "",
          description: "",
          category: "",
          size: "",
          condition: "",
          tags: "",
        });
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
      className="max-w-lg mx-auto bg-white p-6 rounded shadow mt-10"
    >
      <h2 className="text-2xl font-bold mb-4">List a New Item</h2>

      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="block w-full border px-3 py-2 mb-3"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="block w-full border px-3 py-2 mb-3"
        required
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="block w-full border px-3 py-2 mb-3"
        required
      >
        <option value="">Select category</option>
        <option value="Tops">Tops</option>
        <option value="Bottoms">Bottoms</option>
        <option value="Outerwear">Outerwear</option>
        <option value="Accessories">Accessories</option>
      </select>

      <select
        name="size"
        value={form.size}
        onChange={handleChange}
        className="block w-full border px-3 py-2 mb-3"
        required
      >
        <option value="">Select size</option>
        <option value="XS">XS</option>
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
      </select>

      <select
        name="condition"
        value={form.condition}
        onChange={handleChange}
        className="block w-full border px-3 py-2 mb-3"
        required
      >
        <option value="">Select condition</option>
        <option value="New with tags">New with tags</option>
        <option value="Like New">Like New</option>
        <option value="Good">Good</option>
        <option value="Used">Used</option>
      </select>

      <input
        name="tags"
        placeholder="Tags (comma separated)"
        value={form.tags}
        onChange={handleChange}
        className="block w-full border px-3 py-2 mb-3"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Item
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </form>
  );
}

export default AddItemForm;
