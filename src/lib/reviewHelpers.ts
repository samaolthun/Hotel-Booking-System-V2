export interface StoredReview {
  id: number;
  bookingId: number | string;
  hotelId: number | string;
  roomType: string;
  userId: number | string;
  userName?: string;
  rating: number;
  comment?: string;
  date: string;
}

export const reviewsKey = (hotelId: number | string, roomType: string) =>
  `reviews_room_${hotelId}_${roomType}`;

export function getReviewsForRoom(
  hotelId: number | string,
  roomType: string
): StoredReview[] {
  try {
    const raw = localStorage.getItem(reviewsKey(hotelId, roomType));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReviewForRoom(
  hotelId: number | string,
  roomType: string,
  review: StoredReview
) {
  const list = getReviewsForRoom(hotelId, roomType);
  list.unshift(review);
  localStorage.setItem(reviewsKey(hotelId, roomType), JSON.stringify(list));
}

export function findEligibleBookingForUser(
  hotelId: number | string,
  roomType: string,
  userId: number | string | null
) {
  if (!userId) return null;
  try {
    const stored = localStorage.getItem("bookings");
    const bookings = stored ? JSON.parse(stored) : [];
    const today = new Date();
    for (const b of bookings) {
      if (String(b.hotelId) !== String(hotelId)) continue;
      if (b.roomType && b.roomType !== roomType && b.roomNumber !== roomType)
        continue;
      const checkin = b.checkinDate
        ? new Date(b.checkinDate)
        : b.startDate
        ? new Date(b.startDate)
        : null;
      const checkout = b.checkoutDate
        ? new Date(b.checkoutDate)
        : b.endDate
        ? new Date(b.endDate)
        : null;
      if (!checkin || !checkout) continue;
      // allow during stay (today >= checkin) or after checkout (today >= checkout)
      if (today >= checkin) {
        const roomReviews = getReviewsForRoom(hotelId, roomType);
        const existing = roomReviews.find(
          (r) =>
            String(r.bookingId) === String(b.id) &&
            String(r.userId) === String(userId)
        );
        if (!existing) return b;
      }
    }
  } catch (e) {
    console.error("findEligibleBookingForUser error", e);
  }
  return null;
}
