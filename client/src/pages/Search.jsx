import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const generateFlights = (from, to, passengers) => {
  const airlines = [
    { name: "IndiGo", code: "6E", color: "bg-indigo-100 text-indigo-700" },
    { name: "Air India", code: "AI", color: "bg-red-100 text-red-700" },
    { name: "SpiceJet", code: "SG", color: "bg-orange-100 text-orange-700" },
    { name: "Vistara", code: "UK", color: "bg-purple-100 text-purple-700" },
    { name: "GoFirst", code: "G8", color: "bg-green-100 text-green-700" },
  ];

  const times = [
    { dep: "05:30", arr: "07:45", dur: "2h 15m" },
    { dep: "08:00", arr: "10:30", dur: "2h 30m" },
    { dep: "11:15", arr: "13:20", dur: "2h 05m" },
    { dep: "14:00", arr: "16:45", dur: "2h 45m" },
    { dep: "18:30", arr: "20:40", dur: "2h 10m" },
  ];

  const basePrice = Math.floor(Math.random() * 3000) + 2500;

  return airlines.map((airline, i) => ({
    id: `${airline.code}-${100 + i}`,
    flightNumber: `${airline.code}-${Math.floor(Math.random() * 900) + 100}`,
    airline: airline.name,
    airlineCode: airline.code,
    color: airline.color,
    from: from.toUpperCase(),
    to: to.toUpperCase(),
    departureTime: times[i].dep,
    arrivalTime: times[i].arr,
    duration: times[i].dur,
    price: basePrice + i * 500,
    totalPrice: (basePrice + i * 500) * passengers,
    seats: Math.floor(Math.random() * 20) + 5,
    class: "Economy",
  }));
};

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("price");

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const passengers = parseInt(searchParams.get("passengers")) || 1;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const generated = generateFlights(from, to, passengers);
      setFlights(generated);
      setLoading(false);
    }, 1000);
  }, [from, to, passengers]);

  const sorted = [...flights].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "duration") return a.duration.localeCompare(b.duration);
    if (sortBy === "departure")
      return a.departureTime.localeCompare(b.departureTime);
    return 0;
  });

  const handleBook = (flight) => {
    navigate(`/booking/${flight.id}`, {
      state: { flight, date, passengers },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Search Summary */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {from.toUpperCase()} → {to.toUpperCase()}
            </h1>
            <p className="text-gray-500 text-sm">
              {date} · {passengers}{" "}
              {passengers === 1 ? "Passenger" : "Passengers"}
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 text-sm hover:underline"
          >
            Modify Search
          </button>
        </div>

        {/* Sort */}
        <div className="flex gap-3 mb-6">
          <span className="text-gray-600 text-sm self-center">Sort by:</span>
          {["price", "duration", "departure"].map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                sortBy === s
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:border-blue-400"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Flight Cards */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">✈️</div>
            <p className="text-gray-500">Searching for flights...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map((flight) => (
              <div
                key={flight.id}
                className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap justify-between items-center gap-4 hover:shadow-md transition"
              >
                {/* Airline */}
                <div className="flex items-center gap-3 w-32">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${flight.color}`}
                  >
                    {flight.airlineCode}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {flight.airline}
                    </p>
                    <p className="text-xs text-gray-400">
                      {flight.flightNumber}
                    </p>
                  </div>
                </div>

                {/* Times */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-800">
                      {flight.departureTime}
                    </p>
                    <p className="text-xs text-gray-400">{flight.from}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">{flight.duration}</p>
                    <div className="flex items-center gap-1">
                      <div className="h-px w-12 bg-gray-300"></div>
                      <span className="text-gray-300">✈</span>
                      <div className="h-px w-12 bg-gray-300"></div>
                    </div>
                    <p className="text-xs text-gray-400">Non-stop</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-800">
                      {flight.arrivalTime}
                    </p>
                    <p className="text-xs text-gray-400">{flight.to}</p>
                  </div>
                </div>

                {/* Seats */}
                <div className="text-center">
                  <p className="text-xs text-orange-500 font-medium">
                    {flight.seats} seats left
                  </p>
                  <p className="text-xs text-gray-400">{flight.class}</p>
                </div>

                {/* Price + Book */}
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{flight.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mb-2">per person</p>
                  <button
                    onClick={() => handleBook(flight)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
