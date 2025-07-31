import Booking from "@/src/models/Booking";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { bookingId, rating, feedback, customerId } = req.body;
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  if (booking.customerId.toString() !== customerId) {
    return res
      .status(403)
      .json({ error: "You can only rate your own booking." });
  }
  if (booking.status !== "checked_out") {
    return res
      .status(400)
      .json({ error: "You can rate only after check-out." });
  }
  if (booking.rating || booking.feedback) {
    return res
      .status(400)
      .json({
        error: "You have already rated or given feedback for this booking.",
      });
  }

  booking.rating = rating;
  booking.feedback = feedback;
  await booking.save();

  return res
    .status(200)
    .json({ message: "Rating and feedback submitted successfully." });
}
