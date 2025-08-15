"use client";

import { useEffect, useState } from "react";
import { HotelDetails } from "@/components/hotels/hotel-details";
import type { Hotel } from "@/lib/types";
import { notFound } from "next/navigation";
import { isRoomAvailable } from "../../lib/availability";
import { useSearchParams } from "next/navigation";

interface HotelPageClientProps {
  hotelId: number;
  existingHotel: Hotel | undefined;
}

export function HotelPageClient({
  hotelId,
  existingHotel,
}: HotelPageClientProps) {
  const searchParams = useSearchParams();
  const checkin = searchParams?.get("checkin") ?? "";
  const checkout = searchParams?.get("checkout") ?? "";

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (existingHotel) {
      setHotel(existingHotel);
      setIsLoading(false);
      return;
    }

    try {
      const userRooms = JSON.parse(localStorage.getItem("userRooms") || "[]");
      const room = userRooms.find((r: any) => r.id === hotelId);

      if (room) {
        const ownerHotel: Hotel = {
          id: room.id,
          name: room.hotelName || `Room ${room.number}`,
          location: room.location || "Phnom Penh",
          mapEmbed: room.mapEmbed || "",
          price: room.price,
          image: room.photo || "/placeholder.jpg",
          images: [room.photo || "/placeholder.jpg"],
          rating: 0,
          description: room.description || "No description provided.",
          amenities: room.services || [],
          rooms: {
            [room.type || "standard"]: {
              name: room.type
                ? `${room.type.charAt(0).toUpperCase()}${room.type.slice(
                    1
                  )} Room`
                : "Standard Room",
              price: room.price || 0,
            },
          },
          reviews: [],
          status: room.status || "available",
          photo: room.photo || "",
        };
        setHotel(ownerHotel);
      } else {
        setHotel(null);
      }
    } catch (error) {
      setHotel(null);
    }

    setIsLoading(false);
  }, [hotelId, existingHotel]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );

  if (!hotel) notFound();

  // Normalize rooms safe: handle array, map/object or empty
  const allRoomsRaw: any =
    (hotel as any)?.roomsList ?? (hotel as any)?.rooms ?? [];
  const roomItems: any[] = Array.isArray(allRoomsRaw)
    ? allRoomsRaw
    : allRoomsRaw && typeof allRoomsRaw === "object"
    ? Object.entries(allRoomsRaw).map(([k, v]) => ({ ...(v as any), key: k }))
    : [];

  const availableRooms = roomItems.filter((r: any) => {
    const status = r?.status ?? "available";
    return (
      status === "available" &&
      isRoomAvailable(
        r?.id ?? undefined,
        r?.number ?? r?.key ?? undefined,
        hotelId,
        checkin || undefined,
        checkout || undefined
      )
    );
  });

  // (optional) if HotelDetails needs availableRooms, pass it; otherwise keep as-is
  return <HotelDetails hotel={hotel} />;
}

// export const datesOverlap = (
//   aStart: string | Date,
//   aEnd: string | Date,
//   bStart: string | Date,
//   bEnd: string | Date
// ) => {
//   const s1 = new Date(aStart).getTime();
//   const e1 = new Date(aEnd).getTime();
//   const s2 = new Date(bStart).getTime();
//   const e2 = new Date(bEnd).getTime();
//   // intervals overlap when they intersect (treat checkout as exclusive)
//   return !(e1 <= s2 || s1 >= e2);
// };

// export const isRoomAvailable = (
//   roomId: number | string | undefined,
//   roomNumber: string | undefined,
//   hotelId: number | string | undefined,
//   checkin: string | undefined,
//   checkout: string | undefined,
//   bookingsSource?: any[]
// ) => {
//   if (!checkin || !checkout) return true;
//   const bookings =
//     bookingsSource ?? JSON.parse(localStorage.getItem("bookings") || "[]");
//   return !bookings.some((b: any) => {
//     const sameRoom =
//       (roomId && String(b.roomId) === String(roomId)) ||
//       (roomNumber && b.roomNumber === roomNumber) ||
//       (hotelId && String(b.hotelId) === String(hotelId));
//     if (!sameRoom) return false;
//     const bStart = b.checkinDate ?? b.startDate ?? b.start;
//     const bEnd = b.checkoutDate ?? b.endDate ?? b.end;
//     if (!bStart || !bEnd) return false;
//     return datesOverlap(checkin, checkout, bStart, bEnd);
//   });
// };
