import type { Booking } from "@/lib/types";

export function isRoomAvailable(
  hotelId: number,
  roomType: string,
  checkinDate: string,
  checkoutDate: string
): boolean {
  // First check if this is an owner-added room and get its status
  try {
    const userRooms = JSON.parse(localStorage.getItem("userRooms") || "[]");
    const ownerRoom = userRooms.find((room: any) => room.id === hotelId);

    if (ownerRoom) {
      // For owner-added rooms, check the room status first
      if (ownerRoom.status !== "available") {
        return false; // Room is not available due to status
      }
    }
  } catch (error) {
    // If there's an error reading localStorage, continue with booking check
  }

  // Get all bookings from localStorage
  const stored = localStorage.getItem("bookings");
  const bookings: Booking[] = stored ? JSON.parse(stored) : [];

  // Filter bookings for this hotel and room type
  const relevantBookings = bookings.filter(
    (booking) =>
      booking.hotelId === hotelId &&
      booking.roomType.toLowerCase().includes(roomType.toLowerCase()) &&
      booking.status === "confirmed"
  );

  // Check for date conflicts
  const checkin = new Date(checkinDate);
  const checkout = new Date(checkoutDate);

  for (const booking of relevantBookings) {
    const bookingCheckin = new Date(booking.checkinDate);
    const bookingCheckout = new Date(booking.checkoutDate);

    // Check if dates overlap
    if (
      (checkin >= bookingCheckin && checkin < bookingCheckout) ||
      (checkout > bookingCheckin && checkout <= bookingCheckout) ||
      (checkin <= bookingCheckin && checkout >= bookingCheckout)
    ) {
      return false; // Room is not available
    }
  }

  return true; // Room is available
}

export function getUnavailableDates(
  hotelId: number,
  roomType: string
): string[] {
  const stored = localStorage.getItem("bookings");
  const bookings: Booking[] = stored ? JSON.parse(stored) : [];

  const unavailableDates: string[] = [];

  const relevantBookings = bookings.filter(
    (booking) =>
      booking.hotelId === hotelId &&
      booking.roomType.toLowerCase().includes(roomType.toLowerCase()) &&
      booking.status === "confirmed"
  );

  relevantBookings.forEach((booking) => {
    const checkin = new Date(booking.checkinDate);
    const checkout = new Date(booking.checkoutDate);

    // Add all dates between checkin and checkout
    const currentDate = new Date(checkin);
    while (currentDate < checkout) {
      unavailableDates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return unavailableDates;
}
