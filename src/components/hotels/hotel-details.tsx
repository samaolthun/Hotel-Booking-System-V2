"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/booking/booking-modal";
import { ReviewSection } from "@/components/reviews/review-section";
import { PromotionBanner } from "@/components/hotels/promotion-banner";
import { HotelImageGallery } from "@/components/hotels/hotel-image-gallery";
import type { Hotel, Review } from "@/lib/types";

interface HotelDetailsProps {
  hotel: Hotel;
}

export function HotelDetails({ hotel }: HotelDetailsProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [realRating, setRealRating] = useState(hotel.rating);
  const [realReviewCount, setRealReviewCount] = useState(hotel.reviews.length);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [canReview, setCanReview] = useState(false);
  const [eligibleBookingId, setEligibleBookingId] = useState<
    number | string | null
  >(null);

  // Use the hotel.images array directly
  const hotelImages =
    hotel.images && hotel.images.length > 0
      ? hotel.images
      : ["/placeholder.svg"];

  // Calculate real rating from localStorage reviews
  useEffect(() => {
    const storedReviews = localStorage.getItem(`reviews_${hotel.id}`);
    if (storedReviews) {
      const reviews: Review[] = JSON.parse(storedReviews);
      if (reviews.length > 0) {
        const totalRating = reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const averageRating = totalRating / reviews.length;
        setRealRating(Math.round(averageRating * 10) / 10);
        setRealReviewCount(reviews.length);
      }
    }
  }, [hotel.id]);

  // choose roomType to show reviews for
  const defaultRoomType = Object.keys(hotel.rooms ?? {})[0] ?? "standard";
  const reviewRoomTypeToShow = selectedRoomType ?? defaultRoomType;

  // Helper to get current user from localStorage (adjust if you use a different auth store)
  const getCurrentUser = () => {
    try {
      const raw =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    // recompute eligibility whenever selectedRoomType or hotel changes
    const user = getCurrentUser();
    if (!user) {
      setCanReview(false);
      setEligibleBookingId(null);
      return;
    }

    try {
      const raw = localStorage.getItem("bookings");
      const bookings = raw ? JSON.parse(raw) : [];
      const today = new Date();

      // find a booking that:
      // - belongs to current user
      // - references this hotel (hotelId or hotel)
      // - matches selectedRoomType (if set)
      // - not already reviewed
      // - and check-in date is on-or-before today (allow during stay and after)
      const match = bookings.find((b: any) => {
        const bUser = String(b.userId ?? b.user ?? "");
        if (String(user.id) !== bUser) return false;

        const bHotel = String(b.hotelId ?? b.hotel ?? "");
        if (String(hotel.id) !== bHotel) return false;

        if (
          selectedRoomType &&
          String(b.roomType ?? b.room ?? "") !== String(selectedRoomType)
        )
          return false;

        if (b.reviewed) return false; // already reviewed for this booking

        const ciRaw = b.checkinDate ?? b.startDate ?? b.from;
        if (!ciRaw) return false;
        const ci = new Date(ciRaw);
        if (isNaN(ci.getTime())) return false;

        // allow rating if today is on or after check-in (during stay or after)
        return today >= ci;
      });

      if (match) {
        setCanReview(true);
        setEligibleBookingId(match.id ?? match.bookingId ?? null);
      } else {
        setCanReview(false);
        setEligibleBookingId(null);
      }
    } catch {
      setCanReview(false);
      setEligibleBookingId(null);
    }
  }, [hotel.id, selectedRoomType]);

  // Handler to persist a review and mark booking as reviewed
  const handleSubmitReview = (payload: {
    rating: number;
    comment?: string;
  }) => {
    const user = getCurrentUser();
    if (!user || !eligibleBookingId) return;

    const reviewsKey = `reviews_${hotel.id}`;
    const stored = localStorage.getItem(reviewsKey);
    const reviews = stored ? JSON.parse(stored) : [];

    // Prevent duplicate review for the booking
    if (
      reviews.some(
        (r: any) => String(r.bookingId) === String(eligibleBookingId)
      )
    ) {
      setCanReview(false);
      return;
    }

    const newReview = {
      id: Date.now(),
      bookingId: eligibleBookingId,
      roomType: selectedRoomType ?? null,
      rating: Number(payload.rating),
      comment: payload.comment ?? "",
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    reviews.push(newReview);
    localStorage.setItem(reviewsKey, JSON.stringify(reviews));

    // mark the booking as reviewed
    try {
      const raw = localStorage.getItem("bookings");
      const bookings = raw ? JSON.parse(raw) : [];
      const idx = bookings.findIndex(
        (b: any) => String(b.id ?? b.bookingId) === String(eligibleBookingId)
      );
      if (idx >= 0) {
        bookings[idx].reviewed = true;
        localStorage.setItem("bookings", JSON.stringify(bookings));
      }
    } catch {}

    // update local rating counts shown on page
    const total = reviews.reduce(
      (s: number, r: any) => s + Number(r.rating || 0),
      0
    );
    const avg = reviews.length
      ? Math.round((total / reviews.length) * 10) / 10
      : hotel.rating ?? 0;
    setRealRating(avg);
    setRealReviewCount(reviews.length);
    setCanReview(false);
  };

  return (
    <>
      <Link
        href="/hotels"
        className="flex items-center gap-2 text-primary hover:text-primary/90 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Hotels
      </Link>

      {/* Special Promotion Banner */}
      <PromotionBanner hotel={hotel} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          {/* Main Image with Gallery Overlay */}
          <div
            className="relative overflow-hidden rounded-lg mb-4 group cursor-pointer"
            onClick={() => setShowGallery(true)}
          >
            <Image
              src={hotelImages[0] || "/placeholder.svg"} // Use the first image from the array
              alt={hotel.name}
              width={600}
              height={400}
              className="w-full h-96 object-cover rounded-lg transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Button variant="secondary">View All Photos</Button>
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-2">
            {hotelImages.slice(1, 5).map((img, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded cursor-pointer"
                onClick={() => setShowGallery(true)}
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`${hotel.name} view ${i + 1}`}
                  width={150}
                  height={100}
                  className="w-full h-24 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold mb-4">{hotel.name}</h1>
            <div className="flex flex-col gap-2">
              <Badge variant="outline" className="text-primary border-primary">
                {realRating} ★ Rated
              </Badge>
              {hotel.status && (
                <Badge
                  variant={
                    hotel.status === "available"
                      ? "default"
                      : hotel.status === "occupied"
                      ? "secondary"
                      : "destructive"
                  }
                  className={
                    hotel.status === "available"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : hotel.status === "occupied"
                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  }
                >
                  {hotel.status?.charAt(0).toUpperCase() +
                    hotel.status?.slice(1) || "Unknown"}
                </Badge>
              )}
            </div>
          </div>

          <p className="text-muted-foreground mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            {hotel.location}
          </p>

          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(realRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-lg font-semibold">{realRating}</span>
            <span className="ml-2 text-muted-foreground">
              ({realReviewCount} reviews)
            </span>
          </div>

          <p className="text-foreground mb-6">{hotel.description}</p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Room Types</h3>
            <div className="space-y-2">
              {Object.entries(hotel.rooms).map(([key, room]) => (
                <div
                  key={key}
                  className="flex justify-between items-center p-3 bg-muted rounded-lg hover:bg-accent transition-colors"
                >
                  <span className="font-medium">{room.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-primary">
                      ${room.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={() => {
              // Show room selection or first available room
              const firstRoomType = Object.keys(hotel.rooms)[0];
              setSelectedRoomType(firstRoomType);
              setShowBookingModal(true);
            }}
            className="w-full bg-primary hover:bg-primary/90 text-lg font-semibold py-3"
          >
            Book Now
          </Button>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Location</h2>
        {hotel.mapEmbed ? (
          <div className="rounded-lg overflow-hidden shadow-md">
            <iframe
              src={hotel.mapEmbed}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No map available for this location
            </p>
            <p className="text-gray-400 text-sm mt-2">
              The hotel owner hasn't provided a location map yet.
            </p>
          </div>
        )}
      </div>

      <ReviewSection
        hotelId={hotel.id}
        roomType={reviewRoomTypeToShow}
        canReview={canReview}
        onSubmitReview={handleSubmitReview}
      />

      {selectedRoomType !== null && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedRoomType(null);
          }}
          hotel={hotel}
          roomType={selectedRoomType}
        />
      )}

      {/* Image Gallery Modal */}
      <HotelImageGallery
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        images={hotelImages} // Pass the new images array
        hotelName={hotel.name}
      />
    </>
  );
}
