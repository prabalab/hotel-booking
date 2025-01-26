const express = require("express");
const pool = require("../db"); // Use the combined db.js
const router = express.Router();

// Check room availability and create a booking
router.post("/", async (req, res) => {
  const { name, email, roomType, checkIn, checkOut } = req.body;

  if (!name || !email || !roomType || !checkIn || !checkOut) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    let assignedRoom = null;

    for (let roomNumber = 1; roomNumber <= 10; roomNumber++) {
      const availabilityQuery = `
        SELECT * FROM hotel_bookings
        WHERE room_number = $1
          AND ($2::DATE < check_out AND $3::DATE > check_in)
      `;
      const result = await pool.query(availabilityQuery, [roomNumber, checkIn, checkOut]);

      if (result.rows.length === 0) {
        assignedRoom = roomNumber;
        break;
      }
    }

    if (!assignedRoom) {
      return res.status(400).json({ message: "No rooms available for the selected dates." });
    }

    const insertQuery = `
      INSERT INTO hotel_bookings (name, email, room_type, room_number, check_in, check_out)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const newBooking = await pool.query(insertQuery, [
      name,
      email,
      roomType,
      assignedRoom,
      checkIn,
      checkOut,
    ]);

    res.status(201).json({
      message: `Booking created successfully! Room ${assignedRoom} has been assigned.`,
      booking: newBooking.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
