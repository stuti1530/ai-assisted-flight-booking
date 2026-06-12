import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/bookings/my");
      setBookings(res.data.bookings);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">✈️</div>
          <p className="text-gray-500">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">🎫</div>
            <p className="text-gray-500 mb-4">No bookings yet</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Search Flights
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">PNR Number</p>
                    <p className="text-xl font-bold tracking-widest text-blue-600">
                      {booking.PNR}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        booking.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.paymentStatus === "paid" ? "✓ Paid" : "Unpaid"}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Flight Details */}
                <div className="flex justify-between items-center py-4 border-t border-b mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                      {booking.flightDetails.departureTime}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.flightDetails.from}
                    </p>
                  </div>
                  <div className="text-center text-gray-400">
                    <p className="text-xs">{booking.flightDetails.duration}</p>
                    <p className="text-lg">→</p>
                    <p className="text-xs">Non-stop</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                      {booking.flightDetails.arrivalTime}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.flightDetails.to}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Airline</p>
                    <p className="font-medium text-gray-800">
                      {booking.flightDetails.airline}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Flight</p>
                    <p className="font-medium text-gray-800">
                      {booking.flightDetails.flightNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Travel Date</p>
                    <p className="font-medium text-gray-800">
                      {new Date(booking.travelDate).toDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Passengers</p>
                    <p className="font-medium text-gray-800">
                      {booking.passengers.length}
                    </p>
                  </div>
                </div>

                {/* Passengers */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-400 mb-2">Passengers</p>
                  <div className="flex flex-wrap gap-2">
                    {booking.passengers.map((p, i) => (
                      <span
                        key={i}
                        className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                      >
                        {p.firstName} {p.lastName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <p className="text-sm text-gray-500">Total Paid</p>
                  <p className="text-xl font-bold text-green-600">
                    ₹{booking.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
