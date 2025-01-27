const express = require("express");
const pool = require("../db"); // Use the combined db.js
const PDFDocument = require("pdfkit");

const router = express.Router();


// Generate PDF route
router.get("/generate-pdf", async (req, res) => {
  const { email, checkIn } = req.query;

  if (!email || !checkIn) {
    return res.status(400).send("Email and check-in date are required.");
  }

  try {
    // Fetch booking details from the database
    const result = await pool.query(
      "SELECT * FROM hotel_bookings WHERE email = $1 AND check_in = $2",
      [email, checkIn]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("No booking found for the given details.");
    }

    const booking = result.rows[0];

    // Create a new PDF document
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=booking_${booking.id}.pdf`
    );

    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(18).text("Booking Confirmation", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Booking ID: ${booking.id}`);
    doc.text(`Name: ${booking.name}`);
    doc.text(`Email: ${booking.email}`);
    doc.text(`Room Type: ${booking.room_type}`);
    doc.text(`Room Number: ${booking.room_number}`);
    doc.text(`Check-In Date: ${booking.check_in}`);
    doc.text(`Check-Out Date: ${booking.check_out}`);
    doc.text(`Created At: ${booking.created_at}`);

    // Finalize the PDF and send it
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
