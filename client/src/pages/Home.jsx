import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      `/search?from=${formData.from}&to=${formData.to}&date=${formData.date}&passengers=${formData.passengers}`,
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Your AI-Powered Travel Companion
        </h1>
        <p className="text-blue-100 text-lg mb-10">
          Search flights, plan your trip, and let AI handle the rest
        </p>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                required
                placeholder="Mumbai"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                required
                placeholder="Delhi"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passengers
              </label>
              <select
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "Passenger" : "Passengers"}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
              >
                Search Flights
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 bg-gray-50">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
          Why choose FlightAI?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="text-4xl mb-4">✈️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Smart Flight Search
            </h3>
            <p className="text-gray-500 text-sm">
              Find the best flights instantly with real-time search and filters
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              AI Trip Planner
            </h3>
            <p className="text-gray-500 text-sm">
              Get a personalized day-by-day itinerary, hotel suggestions and
              budget breakdown
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              AI Travel Assistant
            </h3>
            <p className="text-gray-500 text-sm">
              Ask anything about your destination — visa, weather, food, and
              more
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
