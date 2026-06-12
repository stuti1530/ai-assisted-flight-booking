import { useLocation, useNavigate } from "react-router-dom";

const Confirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking;
  console.log("State:", state);
  console.log("Booking:", booking);
  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No booking found.</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-500">
            Your booking has been confirmed. Have a great trip!
          </p>
        </div>

        {/* PNR Card */}
        <div className="bg-blue-600 text-white rounded-xl p-6 text-center mb-6">
          <p className="text-blue-100 text-sm mb-1">PNR Number</p>
          <p className="text-4xl font-bold tracking-widest">{booking.PNR}</p>
          <p className="text-blue-100 text-xs mt-2">
            Save this number for future reference
          </p>
        </div>

        {/* Flight Details */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Flight Details
          </h2>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800">
                {booking.flightDetails.departureTime}
              </p>
              <p className="text-gray-500">{booking.flightDetails.from}</p>
            </div>
            <div className="text-center text-gray-400">
              <p className="text-sm">{booking.flightDetails.duration}</p>
              <p>→</p>
              <p className="text-xs">Non-stop</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800">
                {booking.flightDetails.arrivalTime}
              </p>
              <p className="text-gray-500">{booking.flightDetails.to}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm">
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
              <p className="text-gray-400">Date</p>
              <p className="font-medium text-gray-800">
                {new Date(booking.travelDate).toDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Class</p>
              <p className="font-medium text-gray-800">
                {booking.flightDetails.class}
              </p>
            </div>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Passengers</h2>
          <div className="space-y-3">
            {booking.passengers.map((p, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {p.firstName} {p.lastName}
                  </p>
                  <p className="text-sm text-gray-400">
                    {p.gender} · Age {p.age}
                  </p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  Passenger {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Payment Summary
          </h2>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Paid</span>
            <span className="text-2xl font-bold text-green-600">
              ₹{booking.totalAmount.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              ✓ Payment Successful
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex-1 border border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
          >
            Book Another Flight
          </button>
          <button
            onClick={() => navigate("/my-bookings")}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
