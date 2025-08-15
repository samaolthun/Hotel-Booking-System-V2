"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { datesOverlap, isRoomAvailable } from "@/lib/availability";
import Link from "next/link";
import { HotelCard } from "./hotel-card";
import { HotelCardSkeleton } from "./hotel-card-skeleton"; // Import the new skeleton component
import { getAllHotels } from "@/lib/data/hotels";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Grid3x3, LayoutList } from "lucide-react";
import type { Hotel } from "@/lib/types";

export function HotelListing() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [hotelsData, setHotelsData] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const checkin = searchParams?.get("checkin") ?? "";
  const checkout = searchParams?.get("checkout") ?? "";

  // normalize search params once
  const destinationQuery = (searchParams?.get("destination") ?? "")
    .trim()
    .toLowerCase();
  const generalQuery = (searchParams?.get("q") ?? "").trim().toLowerCase();
  const roomType = (searchParams?.get("roomType") ?? "").trim();
  const minPrice = Number(searchParams?.get("minPrice") ?? 0);
  const maxPrice = Number(searchParams?.get("maxPrice") ?? 10_000);
  const amenitiesFilter = (searchParams?.get("amenities") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const loadHotels = useCallback(() => {
    try {
      // If you have a built-in/base list, keep it; otherwise start with empty
      const baseHotels: Hotel[] = (window as any).__BASE_HOTELS__ || [];

      const storedHotels = JSON.parse(
        localStorage.getItem("hotels") || "[]"
      ) as Hotel[];
      const storedRooms = JSON.parse(
        localStorage.getItem("userRooms") || "[]"
      ) as any[];

      // Convert userRooms -> hotel shaped entries if needed
      const roomsAsHotels = (storedRooms || []).map((r: any) => ({
        id: r.id,
        name: r.hotelName || `Room ${r.number}`,
        location: r.location || "",
        price: Number(r.price || 0),
        description: r.description || "",
        image: r.photo || (r.images && r.images[0]) || "/placeholder.jpg",
        images: r.images || [r.photo || "/placeholder.jpg"],
        amenities: Array.isArray(r.amenities) ? r.amenities : [],
        rating: r.rating ?? 0,
        reviews: r.reviews ?? [],
        status: r.status ?? "available",
        rooms: r.rooms ?? undefined,
      })) as Hotel[];

      // Merge with priority: storedHotels (admin created) + roomsAsHotels + baseHotels (avoid duplicates by id)
      const mergedMap = new Map<number | string, Hotel>();
      (baseHotels || []).forEach((h) => mergedMap.set(h.id, h));
      (roomsAsHotels || []).forEach((h) => mergedMap.set(h.id, h));
      (storedHotels || []).forEach((h) => mergedMap.set(h.id, h));
      const merged = Array.from(mergedMap.values());

      setHotelsData(merged);
    } catch (e) {
      console.error("loadHotels error", e);
      setHotelsData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHotels();

    // update when other tabs change localStorage
    const onStorage = (ev: StorageEvent) => {
      if (
        ev.key === "hotels" ||
        ev.key === "userRooms" ||
        ev.key === "hotels_last_updated"
      ) {
        loadHotels();
      }
    };
    // update when same-window custom event fired by admin actions
    const onCustom = () => loadHotels();

    window.addEventListener("storage", onStorage);
    window.addEventListener("hotels-updated", onCustom as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("hotels-updated", onCustom as EventListener);
    };
  }, [loadHotels]);

  // Filter hotels according to availability: require at least one available room
  const visibleHotels = hotelsData.filter((hotel: any) => {
    // adapt to hotel.rooms shape: try array then object
    const roomList: any[] = Array.isArray(hotel.rooms)
      ? hotel.rooms
      : hotel.rooms && typeof hotel.rooms === "object"
      ? Object.values(hotel.rooms)
      : hotel.roomList ?? [];

    if (roomList.length === 0) {
      // fallback: consider hotel-level status
      return (hotel.status ?? "available") === "available";
    }

    return roomList.some((r: any) => {
      const status = r.status ?? hotel.status ?? "available";
      // isRoomAvailable checks bookings in localStorage if none passed
      return (
        status === "available" &&
        isRoomAvailable(
          r.id ?? undefined,
          r.number ?? undefined,
          hotel.id ?? undefined,
          checkin || undefined,
          checkout || undefined
        )
      );
    });
  });

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <HotelCardSkeleton key={i} listView={viewMode === "list"} />
        ))}
      </div>
    );
  }

  const filteredHotels = visibleHotels
    .filter((hotel) => {
      // destination strict match if provided
      if (destinationQuery) {
        return String(hotel.location ?? "")
          .toLowerCase()
          .includes(destinationQuery);
      }

      // general search across name/location/description
      if (generalQuery) {
        const name = String(hotel.name ?? "").toLowerCase();
        const loc = String(hotel.location ?? "").toLowerCase();
        const desc = String(hotel.description ?? "").toLowerCase();
        return (
          name.includes(generalQuery) ||
          loc.includes(generalQuery) ||
          desc.includes(generalQuery)
        );
      }

      return true;
    })
    .filter((hotel) => {
      if (!roomType) return true;
      // guard hotel.rooms access
      const rooms = hotel.rooms ?? {};
      return !!(rooms as any)[roomType];
    })
    .filter((hotel) => {
      const price = Number(hotel.price ?? 0);
      return price >= minPrice && price <= maxPrice;
    })
    .filter((hotel) => {
      if (amenitiesFilter.length === 0) return true;
      const hotelAmenities = Array.isArray(hotel.amenities)
        ? hotel.amenities
        : [];
      return amenitiesFilter.every((a) => hotelAmenities.includes(a));
    });

  // In HotelCard rendering, override the View Details button for owner-added rooms
  const renderHotelCard = (hotel: any) => {
    if (hotel._ownerRoom) {
      return (
        <div key={hotel.id} className="relative">
          <HotelCard hotel={hotel} listView={viewMode === "list"} />
          <div className="absolute bottom-6 right-6">
            <Link href={`/hotels/${hotel.id}`}>
              <Button className="bg-primary hover:bg-primary/90">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      );
    } else {
      return (
        <HotelCard
          key={hotel.id}
          hotel={hotel}
          listView={viewMode === "list"}
        />
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">
            {filteredHotels.length}{" "}
            {filteredHotels.length === 1 ? "hotel" : "hotels"} found
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">View:</span>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className="h-8 w-8"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            className="h-8 w-8"
          >
            <LayoutList className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Hotels</TabsTrigger>
          <TabsTrigger value="luxury">Luxury</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="family">Family Friendly</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {viewMode === "grid" ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredHotels.map(renderHotelCard)}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHotels.map(renderHotelCard)}
            </div>
          )}
        </TabsContent>
        <TabsContent value="luxury">
          {viewMode === "grid" ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredHotels
                .filter((hotel) => hotel.price > 300)
                .map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} listView={false} />
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHotels
                .filter((hotel) => hotel.price > 300)
                .map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} listView={true} />
                ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="budget">
          {viewMode === "grid" ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredHotels
                .filter((hotel) => hotel.price <= 200)
                .map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} listView={false} />
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHotels
                .filter((hotel) => hotel.price <= 200)
                .map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} listView={true} />
                ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="family">
          {viewMode === "grid" ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredHotels
                .filter(
                  (hotel) =>
                    Array.isArray(hotel.amenities) &&
                    hotel.amenities.some((a) =>
                      ["Pool", "Restaurant", "WiFi"].includes(a)
                    )
                )
                .map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} listView={false} />
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHotels
                .filter(
                  (hotel) =>
                    Array.isArray(hotel.amenities) &&
                    hotel.amenities.some((a) =>
                      ["Pool", "Restaurant", "WiFi"].includes(a)
                    )
                )
                .map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} listView={true} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      {/* Remove the Owner Room Details Modal - no longer needed */}
    </div>
  );
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
//   // Intervals overlap when they intersect (treat checkout as exclusive)
//   return !(e1 <= s2 || s1 >= e2);
// };

// export const isRoomAvailable = (
//   // match by roomId, roomNumber or hotelId depending on your booking shape
//   roomId: number | string | undefined,
//   roomNumber: string | undefined,
//   hotelId: number | string | undefined,
//   checkin: string | undefined,
//   checkout: string | undefined,
//   bookingsSource?: any[]
// ) => {
//   if (!checkin || !checkout) return true; // no date filter -> treat as available
//   const bookings =
//     bookingsSource ?? JSON.parse(localStorage.getItem("bookings") || "[]");
//   return !bookings.some((b: any) => {
//     // adapt these keys to your booking objects if different
//     const same =
//       (roomId && String(b.roomId) === String(roomId)) ||
//       (roomNumber && b.roomNumber === roomNumber) ||
//       (hotelId && String(b.hotelId) === String(hotelId));
//     if (!same) return false;
//     const bStart = b.checkinDate ?? b.startDate ?? b.start;
//     const bEnd = b.checkoutDate ?? b.endDate ?? b.end;
//     if (!bStart || !bEnd) return false;
//     return datesOverlap(checkin, checkout, bStart, bEnd);
//   });
// };
