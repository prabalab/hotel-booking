const express = require("express");
const path = require("path");
const bookingRoutes = require("./routes/booking");

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Serve API routes
app.use("/api/bookings", bookingRoutes);

// Serve the static HTML page
app.use(express.static(path.join(__dirname, "public")));

// Fallback route to serve the HTML file for any other routes (e.g., / or undefined routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
