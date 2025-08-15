"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface ReviewSectionProps {
  hotelId: string | number;
  roomType?: string | null;
  canReview?: boolean;
  onSubmitReview?: (payload: { rating: number; comment?: string }) => void;
}

export function ReviewSection({
  hotelId,
  roomType,
  canReview = false,
  onSubmitReview,
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`reviews_${hotelId}`);
      const parsed = raw ? JSON.parse(raw) : [];
      const filtered = Array.isArray(parsed)
        ? parsed.filter((r: any) =>
            roomType ? String(r.roomType) === String(roomType) : true
          )
        : [];
      setReviews(filtered);
    } catch {
      setReviews([]);
    }
  }, [hotelId, roomType]);

  const submit = () => {
    // build review object with current user if available
    const user = (() => {
      try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();

    const newReview = {
      id: Date.now(),
      bookingId: null,
      roomType,
      rating,
      comment,
      userId: user?.id ?? null,
      createdAt: new Date().toISOString(),
    };

    // persist to localStorage so reviews are visible to others later
    try {
      const key = `reviews_${hotelId}`;
      const raw = localStorage.getItem(key);
      const arr = raw && Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
      arr.unshift(newReview);
      localStorage.setItem(key, JSON.stringify(arr));
    } catch {
      // ignore storage errors
    }

    // call optional external handler (HotelDetails may mark booking reviewed)
    if (onSubmitReview) {
      onSubmitReview({ rating, comment });
    }

    // optimistic UI update
    setReviews((r) => [newReview, ...r]);
    setRating(5);
    setComment("");
  };

  return (
    <section>
      <h3 className="text-xl font-semibold mb-3">Reviews</h3>

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground mb-4">No reviews yet.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {reviews.map((r: any) => (
            <div
              key={r.id ?? `${r.userId}-${r.createdAt}`}
              className="p-4 border rounded"
            >
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < Math.round(r.rating ?? 0)
                        ? "text-yellow-400"
                        : "text-muted-foreground"
                    }
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString()
                    : ""}
                </span>
              </div>
              {r.comment && <p className="text-sm">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}

      {canReview ? (
        <div className="p-4 border rounded">
          <h4 className="font-medium mb-2">Leave a review</h4>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm mr-2">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} ★
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your feedback (optional)"
            className="w-full border rounded p-2 mb-2"
          />
          <div className="flex justify-end">
            <Button onClick={submit}>Submit Review</Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          You can leave a review once you've booked and reached the check-in
          date for this room.
        </p>
      )}
    </section>
  );
}
