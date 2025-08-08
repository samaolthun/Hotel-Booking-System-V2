import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isRoomAvailable(
  hotelId: string,
  roomNumber: string,
  checkIn: Date,
  checkOut: Date
) {
  // Get existing bookings
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

  // Check if room exists in any booking for the given dates
  const hasOverlappingBooking = bookings.some((booking: any) => {
    if (booking.hotelId !== hotelId || booking.roomNumber !== roomNumber) {
      return false;
    }

    const bookingStart = new Date(booking.checkIn);
    const bookingEnd = new Date(booking.checkOut);
    const requestedStart = new Date(checkIn);
    const requestedEnd = new Date(checkOut);

    return (
      (requestedStart >= bookingStart && requestedStart < bookingEnd) ||
      (requestedEnd > bookingStart && requestedEnd <= bookingEnd) ||
      (requestedStart <= bookingStart && requestedEnd >= bookingEnd)
    );
  });

  return !hasOverlappingBooking;
}
