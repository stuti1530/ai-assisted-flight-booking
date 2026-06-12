const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Trip Planner
router.post("/trip-planner", protect, async (req, res) => {
  const { destination, days, budget, interests } = req.body;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `You are a travel expert. Create a detailed trip plan for the following:
    
Destination: ${destination}
Duration: ${days} days
Budget: ₹${budget}
Interests: ${interests}

Provide a response in this exact JSON format:
{
  "overview": "2-3 sentence overview of the destination",
  "itinerary": [
    {
      "day": 1,
      "title": "Day title",
      "activities": ["activity 1", "activity 2", "activity 3"]
    }
  ],
  "hotels": [
    {
      "name": "Hotel name",
      "type": "Budget/Mid-range/Luxury",
      "pricePerNight": 2000
    }
  ],
  "budget": {
    "flights": 5000,
    "hotel": 8000,
    "food": 3000,
    "activities": 2000,
    "total": 18000
  },
  "tips": ["tip 1", "tip 2", "tip 3"]
}

Return ONLY the JSON, no extra text, no markdown backticks.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const text = completion.choices[0].message.content;
    const clean = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);

    res.status(200).json({ data });
  } catch (err) {
    console.log("AI error:", err.message);
    res.status(500).json({ message: "AI request failed", error: err.message });
  }
});

// Chatbot
router.post("/chat", protect, async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a helpful travel assistant for FlightAI, an AI-powered flight booking platform. 
Answer travel-related questions helpfully and concisely. If asked about non-travel topics, politely redirect to travel topics. Keep responses under 150 words and be friendly.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (err) {
    console.log("Chat error:", err.message);
    res.status(500).json({ message: "Chat failed", error: err.message });
  }
});

module.exports = router;
