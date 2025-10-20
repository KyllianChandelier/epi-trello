import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-50 text-gray-900">
      {/* HEADER */}
      <header className="bg-blue-600 shadow-md">
        <div className="mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-semibold text-white hover:text-gray-200">
            EpiTrello
          </Link>

          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/boards"
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  Boards
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-600 font-medium px-3 py-1 rounded hover:bg-blue-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4">{children}</main>

      {/* FOOTER (optional later) */}
    </div>
  );
}
