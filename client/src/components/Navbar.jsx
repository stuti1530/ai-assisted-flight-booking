import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold tracking-wide">
        ✈ FlightsAI
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/search" className="hover:text-blue-200 transition">
          Search Flights
        </Link>
        <Link to="/trip-planner" className="hover:text-blue-200 transition">
          Trip Planner
        </Link>

        {user ? (
          <>
            <Link to="/my-bookings" className="hover:text-blue-200 transition">
              My Bookings
            </Link>
            <span className="text-blue-200 text-sm">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-1.5 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-200 transition">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-600 px-4 py-1.5 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
