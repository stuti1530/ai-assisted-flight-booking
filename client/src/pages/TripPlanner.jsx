import { useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TripPlanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: "",
    days: 3,
    budget: "",
    interests: "",
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPlan(null);

    try {
      const res = await axios.post("/ai/trip-planner", formData);
      setPlan(res.data.data);
    } catch (err) {
      setError("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            AI Trip Planner
          </h1>
          <p className="text-gray-500">
            Tell us about your trip and AI will plan everything
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Goa, Manali, Bangkok"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Days
                </label>
                <select
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[2, 3, 4, 5, 6, 7, 10, 14].map((d) => (
                    <option key={d} value={d}>
                      {d} days
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Budget (₹)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 20000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interests
                </label>
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  required
                  placeholder="e.g. beaches, food, adventure, culture"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 text-red-600 px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading
                ? "🤖 AI is planning your trip..."
                : "✨ Generate My Trip Plan"}
            </button>
          </form>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4 animate-bounce">🤖</div>
            <p className="text-gray-500 text-lg">
              AI is crafting your perfect trip...
            </p>
            <p className="text-gray-400 text-sm mt-2">
              This takes about 10-15 seconds
            </p>
          </div>
        )}

        {/* Results */}
        {plan && (
          <div className="space-y-6">
            {/* Overview */}
            <div className="bg-blue-600 text-white rounded-xl p-6">
              <h2 className="text-xl font-bold mb-2">
                ✈️ {formData.destination}
              </h2>
              <p className="text-blue-100">{plan.overview}</p>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                📅 Day-by-Day Itinerary
              </h2>
              <div className="space-y-4">
                {plan.itinerary.map((day) => (
                  <div
                    key={day.day}
                    className="border-l-4 border-blue-500 pl-4"
                  >
                    <p className="font-semibold text-gray-800">
                      Day {day.day} — {day.title}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {day.activities.map((activity, i) => (
                        <li
                          key={i}
                          className="text-gray-600 text-sm flex items-start gap-2"
                        >
                          <span className="text-blue-500 mt-0.5">•</span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotels */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                🏨 Hotel Recommendations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plan.hotels.map((hotel, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <p className="font-medium text-gray-800">{hotel.name}</p>
                    <p className="text-sm text-gray-500">{hotel.type}</p>
                    <p className="text-blue-600 font-semibold mt-2">
                      ₹{hotel.pricePerNight.toLocaleString()}/night
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                💰 Budget Breakdown
              </h2>
              <div className="space-y-3">
                {Object.entries(plan.budget)
                  .filter(([key]) => key !== "total")
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-600 capitalize">{key}</span>
                      <span className="font-medium text-gray-800">
                        ₹{value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-bold text-blue-600 text-xl">
                    ₹{plan.budget.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                💡 Travel Tips
              </h2>
              <ul className="space-y-2">
                {plan.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <span className="text-yellow-500 text-lg">💡</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Book Flight Button */}
            <div className="text-center pb-8">
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                ✈️ Book a Flight to {formData.destination}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPlanner;
