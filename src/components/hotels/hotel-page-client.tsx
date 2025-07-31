"use client";

import { useEffect, useState } from "react";
import { HotelDetails } from "@/src/components/hotels/hotel-details";
import type { Hotel } from "@/src/lib/types";
import { notFound } from "next/navigation";

interface HotelPageClientProps {
  hotelId: number;
  existingHotel: Hotel | undefined;
}

export function HotelPageClient({
  hotelId,
  existingHotel,
}: HotelPageClientProps) {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If we have an existing hotel, use it
    if (existingHotel) {
      setHotel(existingHotel);
      setIsLoading(false);
      return;
    }

    // Otherwise, check for owner-added rooms
    try {
      const userRooms = JSON.parse(localStorage.getItem("userRooms") || "[]");
      const room = userRooms.find((r: any) => r.id === hotelId);

      if (room) {
        // Convert owner room to Hotel format
        const ownerHotel: Hotel = {
          id: room.id,
          name: room.hotelName || `Room ${room.number}`,
          location: room.location || "Location not specified",
          mapEmbed: room.mapEmbed || "", // Use the map embed URL from room data
          price: room.price,
          image: room.photo || "/placeholder.jpg",
          images: [room.photo || "/placeholder.jpg"],
          rating: 0,
          description: room.description || "No description provided.",
          amenities: room.services || [],
          rooms: {
            [room.type]: {
              name:
                room.type.charAt(0).toUpperCase() +
                room.type.slice(1) +
                " Room",
              price: room.price,
            },
          },
          reviews: [],
          status: room.status || "available", // Include the room status
        };
        setHotel(ownerHotel);
      } else {
        // Hotel not found
        setHotel(null);
      }
    } catch (error) {
      setHotel(null);
    }

    setIsLoading(false);
  }, [hotelId, existingHotel]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hotel) {
    notFound();
  }

  return <HotelDetails hotel={hotel} />;
}
