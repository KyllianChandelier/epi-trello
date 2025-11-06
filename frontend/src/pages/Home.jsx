import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  if (user) {
    window.location.href = "/boards";
    return null;
  }

  return (
    <div className="home-page">
      <h1>Welcome to EpiTrello 🎯</h1>
      <p>
        Organize your projects, tasks, and ideas visually with boards, lists, and cards.
      </p>

      <div className="home-actions">
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
}
