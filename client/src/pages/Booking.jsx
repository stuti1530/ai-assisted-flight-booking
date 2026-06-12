import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

const Booking = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const flight = state?.flight;
  const date = state?.date;
  const passengers = state?.passengers || 1;

  const [passengerDetails, setPassengerDetails] = useState(
    Array.from({ length: passengers }, () => ({
      firstName: "",
      lastName: "",
      age: "",
      gender: "male",
    })),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No flight selected.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengerDetails];
    updated[index][field] = value;
    setPassengerDetails(updated);
  };

  const generatePNR = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handlePayment = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const isValid = passengerDetails.every(
      (p) => p.firstName && p.lastName && p.age && p.gender,
    );
    if (!isValid) {
      setError("Please fill in all passenger details");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const totalWithTax = Math.round(flight.price * passengers * 1.18);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: totalWithTax * 100,
        currency: "INR",
        name: "FlightAI",
        description: `${flight.from} → ${flight.to} · ${flight.flightNumber}`,
        handler: async function () {
          try {
            const bookingData = {
              flightDetails: {
                flightNumber: flight.flightNumber,
                airline: flight.airline,
                from: flight.from,
                to: flight.to,
                departureTime: flight.departureTime,
                arrivalTime: flight.arrivalTime,
                duration: flight.duration,
                class: flight.class,
                price: flight.price,
              },
              passengers: passengerDetails,
              PNR: generatePNR(),
              totalAmount: totalWithTax,
              travelDate: date,
              paymentStatus: "paid",
            };
            const res = await axios.post("/bookings", bookingData);
            navigate("/confirmation", { state: { booking: res.data.booking } });
          } catch (err) {
            setError("Booking failed after payment. Contact support.");
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#2563EB" },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };
      console.log("Razorpay key:", import.meta.env.VITE_RAZORPAY_KEY_ID);
      console.log("window.Razorpay:", window.Razorpay);
      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    } catch (err) {
      setError("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Flight Summary
          </h2>
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <p className="text-sm text-gray-500">
                {flight.airline} · {flight.flightNumber}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">
                    {flight.departureTime}
                  </p>
                  <p className="text-sm text-gray-400">{flight.from}</p>
                </div>
                <div className="text-center text-gray-400">
                  <p className="text-xs">{flight.duration}</p>
                  <p>→</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">
                    {flight.arrivalTime}
                  </p>
                  <p className="text-sm text-gray-400">{flight.to}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-1">{date}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">
                ₹{(flight.price * passengers).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">
                ₹{flight.price.toLocaleString()} × {passengers}{" "}
                {passengers === 1 ? "passenger" : "passengers"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Passenger Details
          </h2>
          <div className="space-y-6">
            {passengerDetails.map((p, index) => (
              <div key={index}>
                {passengers > 1 && (
                  <p className="text-sm font-medium text-blue-600 mb-3">
                    Passenger {index + 1}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={p.firstName}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "firstName",
                          e.target.value,
                        )
                      }
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Stuti"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={p.lastName}
                      onChange={(e) =>
                        handlePassengerChange(index, "lastName", e.target.value)
                      }
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Shende"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      value={p.age}
                      onChange={(e) =>
                        handlePassengerChange(index, "age", e.target.value)
                      }
                      required
                      min="1"
                      max="120"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="21"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={p.gender}
                      onChange={(e) =>
                        handlePassengerChange(index, "gender", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Payment</h2>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Base fare ({passengers}{" "}
                {passengers === 1 ? "passenger" : "passengers"})
              </span>
              <span>₹{(flight.price * passengers).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Taxes & fees</span>
              <span>
                ₹{Math.round(flight.price * passengers * 0.18).toLocaleString()}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span>
                ₹{Math.round(flight.price * passengers * 1.18).toLocaleString()}
              </span>
            </div>
          </div>
          {error && (
            <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          {!user && (
            <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded mb-4 text-sm">
              Please login to complete your booking
            </div>
          )}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : `Pay ₹${Math.round(flight.price * passengers * 1.18).toLocaleString()}`}
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">
            🔒 Secured by Razorpay · Demo mode
          </p>
        </div>
      </div>
    </div>
  );
};

export default Booking;
