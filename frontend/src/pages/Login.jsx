import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      navigate("/boards");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex max-w-screen flex-1 flex-col justify-center items-center text-center">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          Login
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
