"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useAuth } from "@/src/hooks/use-auth";
import { useToast } from "@/src/hooks/use-toast";
import type { Hotel, Review, Booking } from "@/src/lib/types";

interface ReviewSectionProps {
  hotel: Hotel;
}

export function ReviewSection({ hotel }: ReviewSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [roomType, setRoomType] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Load reviews from localStorage
  useEffect(() => {
    const storedReviews = localStorage.getItem(`reviews_${hotel.id}`);
    if (storedReviews) {
      const parsedReviews = JSON.parse(storedReviews);
      setReviews(parsedReviews);
      calculateAverageRating(parsedReviews);
    } else {
      setReviews(hotel.reviews || []);
      calculateAverageRating(hotel.reviews || []);
    }
  }, [hotel.id, hotel.reviews]);

  // Load user's bookings to check if they can review
  useEffect(() => {
    if (user) {
      const storedBookings = localStorage.getItem("bookings");
      const allBookings: Booking[] = storedBookings
        ? JSON.parse(storedBookings)
        : [];
      const userBookingsForThisHotel = allBookings.filter(
        (booking) => booking.userId === user.id && booking.hotelId === hotel.id
      );
      setUserBookings(userBookingsForThisHotel);

      // Check if user has already reviewed this hotel
      const storedReviews = localStorage.getItem(`reviews_${hotel.id}`);
      if (storedReviews) {
        const parsedReviews = JSON.parse(storedReviews);
        const hasUserReviewed = parsedReviews.some(
          (review: Review) => review.userId === user.id
        );
        setHasReviewed(hasUserReviewed);
      }
    }
  }, [user, hotel.id]);

  const calculateAverageRating = (reviewList: Review[]) => {
    if (reviewList.length === 0) {
      setAverageRating(0);
      return;
    }
    const totalRating = reviewList.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const average = totalRating / reviewList.length;
    setAverageRating(Math.round(average * 10) / 10); // Round to 1 decimal place
  };

  const submitReview = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to leave a review.",
        variant: "destructive",
      });
      return;
    }

    if (!rating || !comment.trim()) {
      toast({
        title: "Incomplete",
        description: "Please add rating and comment.",
        variant: "destructive",
      });
      return;
    }

    if (userBookings.length === 0) {
      toast({
        title: "Booking required",
        description: "You must book this hotel before leaving a review.",
        variant: "destructive",
      });
      return;
    }

    if (hasReviewed) {
      toast({
        title: "Already reviewed",
        description: "You have already reviewed this hotel.",
        variant: "destructive",
      });
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      userId: user.id,
      user: user.name,
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split("T")[0],
      roomType: roomType || Object.keys(hotel.rooms)[0],
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    calculateAverageRating(updatedReviews);
    setHasReviewed(true);

    // Store in localStorage
    localStorage.setItem(`reviews_${hotel.id}`, JSON.stringify(updatedReviews));

    // Reset form
    setRating(0);
    setComment("");
    setRoomType("");

    toast({
      title: "Thank you!",
      description: "Your review has been submitted successfully.",
    });
  };

  const canUserReview = user && userBookings.length > 0 && !hasReviewed;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(averageRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : i < averageRating
                    ? "text-yellow-400 fill-yellow-400 opacity-50"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-lg font-semibold">{averageRating}</span>
          <span className="text-gray-500">({reviews.length} reviews)</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No reviews yet. Be the first to review this hotel!</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{rev.user}</p>
                  <span className="text-sm text-gray-500">{rev.date}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {hotel.rooms[rev.roomType as keyof typeof hotel.rooms]
                    ?.name || rev.roomType}
                </span>
              </div>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rev.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {rev.rating}/5
                </span>
              </div>
              <p className="text-gray-700">{rev.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Review Form */}
      <div className="mt-6 space-y-4 border-t pt-6">
        <h3 className="text-lg font-medium">Leave a Review</h3>

        {!user ? (
          <div className="text-center py-4 text-gray-500">
            <p>Please login to leave a review.</p>
          </div>
        ) : userBookings.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p>You must book this hotel before leaving a review.</p>
          </div>
        ) : hasReviewed ? (
          <div className="text-center py-4 text-green-600">
            <p>Thank you! You have already reviewed this hotel.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Rating:</span>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 cursor-pointer transition-colors ${
                    i < rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(i + 1)}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Room Type (Optional)
              </label>
              <Select value={roomType} onValueChange={setRoomType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select room type (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(hotel.rooms).map(([key, room]) => (
                    <SelectItem key={key} value={key}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this hotel..."
              rows={4}
            />

            <Button
              onClick={submitReview}
              disabled={!rating || !comment.trim()}
              className="w-full"
            >
              Submit Review
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
