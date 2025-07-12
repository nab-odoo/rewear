import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow px-4 py-3 mb-6">
      <div className="max-w-6xl mx-auto flex gap-4">
        <Link to="/"      className="text-blue-600">Home</Link>
        <Link to="/add"   className="text-blue-600">List Item</Link>
        <Link to="/login" className="text-blue-600 ml-auto">Login</Link>
        <Link to="/signup" className="text-blue-600">Sign Up</Link>
      </div>
    </nav>
  );
}