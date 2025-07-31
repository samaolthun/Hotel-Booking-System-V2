"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { HotelCard } from "./hotel-card";
import { HotelCardSkeleton } from "./hotel-card-skeleton"; // Import the new skeleton component
import { getAllHotels } from "@/src/lib/data/hotels";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Button } from "@/src/components/ui/button";
import { Grid3x3, LayoutList } from "lucide-react";
import type { Hotel } from "@/src/lib/types";

export function HotelListing() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const [hotelsData, setHotelsData] = useState<Hotel[]>([]); // State to hold fetched hotels
  const searchParams = useSearchParams();

  // Simulate data fetching
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      // Get hotels from data and userRooms from localStorage
      const hotels = getAllHotels();
      const userRooms = JSON.parse(localStorage.getItem("userRooms") || "[]");
      // Convert userRooms to Hotel-like objects for display
      const userRoomHotels = userRooms.map((room: any) => {
        // Calculate real rating from localStorage reviews
        let realRating = 0;
        let realReviewCount = 0;
        try {
          const storedReviews = localStorage.getItem(`reviews_${room.id}`);
          if (storedReviews) {
            const reviews = JSON.parse(storedReviews);
            if (reviews.length > 0) {
              const totalRating = reviews.reduce(
                (sum: number, review: any) => sum + review.rating,
                0
              );
              realRating = Math.round((totalRating / reviews.length) * 10) / 10;
              realReviewCount = reviews.length;
            }
          }
        } catch (error) {
          // If there's an error, use default values
        }

        return {
          id: room.id,
          name: room.hotelName || `Room ${room.number}`,
          location: room.location || "Location not specified",
          mapEmbed: room.mapEmbed || "",
          price: room.price,
          image: room.photo || "/placeholder.jpg",
          images: [room.photo || "/placeholder.jpg"],
          rating: realRating,
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
          reviews: Array(realReviewCount).fill({}), // Create array with correct length for display
          _ownerRoom: true,
          _ownerRoomRaw: room,
        };
      });
      setHotelsData([...hotels, ...userRoomHotels]);
      setIsLoading(false);
    }, 1000); // Simulate 1 second loading time
    return () => clearTimeout(timer);
  }, []);

  // Re-compute filtered list when the query-string changes or hotelsData updates
  const filteredHotels = useMemo(() => {
    if (isLoading) return []; // Don't filter if still loading initial data

    // Collect filter values
    const generalQuery = searchParams.get("q")?.toLowerCase();
    const specificDestination = searchParams.get("destination")?.toLowerCase();
    const roomType = searchParams.get("roomType");
    const minPrice = Number(searchParams.get("minPrice") ?? 0);
    const maxPrice = Number(searchParams.get("maxPrice") ?? 10_000);
    const amenities = (searchParams.get("amenities") ?? "")
      .split(",")
      .filter(Boolean);

    return hotelsData
      .filter((hotel) => {
        // If a specific destination is provided (from HeroSection), filter strictly by that location.
        if (specificDestination) {
          return hotel.location.toLowerCase().includes(specificDestination);
        }
        // Otherwise, if a general query is provided (from SearchBar), filter by name, location, or description.
        if (generalQuery) {
          return (
            hotel.name.toLowerCase().includes(generalQuery) ||
            hotel.location.toLowerCase().includes(generalQuery) ||
            hotel.description.toLowerCase().includes(generalQuery)
          );
        }
        return true; // No relevant search query or destination
      })
      .filter(
        (hotel) =>
          !roomType || hotel.rooms[roomType as keyof typeof hotel.rooms]
      )
      .filter((hotel) => hotel.price >= minPrice && hotel.price <= maxPrice)
      .filter(
        (hotel) =>
          amenities.length === 0 ||
          amenities.every((a) => hotel.amenities.includes(a))
      );
  }, [hotelsData, searchParams, isLoading]);

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <HotelCardSkeleton key={i} listView={viewMode === "list"} />
        ))}
      </div>
    );
  }

  if (filteredHotels.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No hotels found matching your criteria.
        </p>
        <Button
          variant="link"
          className="mt-2"
          onClick={() => (window.location.href = "/hotels")}
        >
          Clear all filters
        </Button>
      </div>
    );
  }

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
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHotels
                .filter((hotel) => hotel.price > 300)
                .map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} listView />
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
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHotels
                .filter((hotel) => hotel.price <= 200)
                .map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} listView />
                ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="family">
          {viewMode === "grid" ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredHotels
                .filter((hotel) =>
                  hotel.amenities.some((a) =>
                    ["Pool", "Restaurant", "WiFi"].includes(a)
                  )
                )
                .map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHotels
                .filter((hotel) =>
                  hotel.amenities.some((a) =>
                    ["Pool", "Restaurant", "WiFi"].includes(a)
                  )
                )
                .map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} listView />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      {/* Remove the Owner Room Details Modal - no longer needed */}
    </div>
  );
}
