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


app.use(express.urlencoded({ extended: true }));

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Route to render the confirmation page
app.get("/confirmation", (req, res) => {
  const { email, checkIn } = req.query;

  // Check if the required query parameters are provided
  if (!email || !checkIn) {
    return res.status(400).send("Missing email or check-in date in query parameters.");
  }

  // Render the EJS page with the passed data
  res.render("confirmation", { email, checkIn });
});

// Fallback route to serve the HTML file for any other routes (e.g., / or undefined routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

