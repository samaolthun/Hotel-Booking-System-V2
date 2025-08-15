export const datesOverlap = (
  aStart: string | Date,
  aEnd: string | Date,
  bStart: string | Date,
  bEnd: string | Date
) => {
  const s1 = new Date(aStart).getTime();
  const e1 = new Date(aEnd).getTime();
  const s2 = new Date(bStart).getTime();
  const e2 = new Date(bEnd).getTime();
  return !(e1 <= s2 || s1 >= e2);
};

export const isRoomAvailable = (
  roomId: number | string | undefined,
  roomNumber: string | undefined,
  hotelId: number | string | undefined,
  checkin: string | undefined,
  checkout: string | undefined,
  bookingsSource?: any[]
) => {
  if (!checkin || !checkout) return true;
  const bookings =
    bookingsSource ?? JSON.parse(localStorage.getItem("bookings") || "[]");
  return !bookings.some((b: any) => {
    const same =
      (roomId && String(b.roomId) === String(roomId)) ||
      (roomNumber && b.roomNumber === roomNumber) ||
      (hotelId && String(b.hotelId) === String(hotelId));
    if (!same) return false;
    const bStart = b.checkinDate ?? b.startDate ?? b.start;
    const bEnd = b.checkoutDate ?? b.endDate ?? b.end;
    if (!bStart || !bEnd) return false;
    return datesOverlap(checkin, checkout, bStart, bEnd);
  });
};
