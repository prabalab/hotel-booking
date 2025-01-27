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

// Route to handle the confirmation page
app.get("/confirmation", (req, res) => {
  const { email, checkIn } = req.query;

  // Check if the required query parameters are provided
  if (!email || !checkIn) {
    return res.status(400).send("Missing email or check-in date in query parameters.");
  }

  // Send a simple confirmation page
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          text-align: center;
        }
        .container {
          max-width: 600px;
          margin: auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        h1 {
          color: #4CAF50;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Booking Confirmed!</h1>
        <p>Thank you for booking with us.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Check-In Date:</strong> ${checkIn}</p>
        <p>We look forward to hosting you!</p>
      </div>
    </body>
    </html>
  `);
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
