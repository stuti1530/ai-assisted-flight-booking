import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import Booking from "./pages/Booking";
import Confirmation from "./pages/Confirmation";
import TripPlanner from "./pages/TripPlanner";
import MyBookings from "./pages/MyBookings";
import Navbar from "./components/Navbar";
import ChatBot from "./components/ChatBot";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/trip-planner" element={<TripPlanner />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
      <ChatBot />
    </BrowserRouter>
  );
}

export default App;
