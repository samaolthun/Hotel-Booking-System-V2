"use client";

import React, { useEffect, useState } from "react";
import {
  getReviewsForRoom,
  saveReviewForRoom,
  findEligibleBookingForUser,
  StoredReview,
} from "../../lib/reviewHelpers";

interface ReviewSectionProps { 
  hotelId: number | string;
  roomType: string;
}

export function ReviewSection({ hotelId, roomType }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<StoredReview[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [eligibleBooking, setEligibleBooking] = useState<any | null>(null);

  // get current user from localStorage (adjust if you have auth)
  const getCurrentUser = () => {
    try {
      const raw =
        localStorage.getItem("user") || localStorage.getItem("currentUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    setReviews(getReviewsForRoom(hotelId, roomType));
    const user = getCurrentUser();
    const booking = findEligibleBookingForUser(
      hotelId,
      roomType,
      user?.id ?? user?.userId ?? null
    );
    setEligibleBooking(booking);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelId, roomType]);

  const submitReview = () => {
    const user = getCurrentUser();
    if (!eligibleBooking) {
      alert("You are not eligible to submit a review for this booking.");
      return;
    }
    const review: StoredReview = {
      id: Date.now(),
      bookingId: eligibleBooking.id,
      hotelId,
      roomType,
      userId: user?.id ?? user?.userId ?? "anonymous",
      userName: user?.name ?? user?.username ?? "Guest",
      rating,
      comment,
      date: new Date().toISOString(),
    };
    saveReviewForRoom(hotelId, roomType, review);
    setReviews((prev) => [review, ...prev]);
    setEligibleBooking(null);
    setComment("");
    setRating(5);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Guest feedback for {roomType}</h3>

      {eligibleBooking ? (
        <div className="p-4 border rounded space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm">Your rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="ml-2"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your feedback..."
            className="w-full p-2 border rounded"
          />

          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-primary text-white rounded"
              onClick={submitReview}
            >
              Submit review
            </button>
            <button
              className="px-3 py-1 border rounded"
              onClick={() => {
                setComment("");
                setRating(5);
              }}
            >
              Clear
            </button>
          </div>

          <div className="text-sm text-muted-foreground">
            You can leave one review per booking. Reviews can be submitted at or
            after check-in.
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          Only guests who have a booking and are on/after check-in can leave
          feedback.
        </div>
      )}

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="text-muted-foreground">
            No reviews yet for this room.
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="p-3 border rounded">
              <div className="flex justify-between items-center">
                <div className="font-medium">{r.userName}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(r.date).toLocaleDateString()}
                </div>
              </div>
              <div className="text-yellow-400">
                {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
              </div>
              {r.comment && <div className="mt-2 text-sm">{r.comment}</div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

{
  /* export interface StoredReview {
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
} */
}
