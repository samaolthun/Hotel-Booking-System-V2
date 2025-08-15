"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getRoomsByFilters } from "@/lib/data/hotels";
import { RoomCard } from "@/components/hotels/room-card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HotelListing } from "@/components/hotels/hotel-listing";
import { SearchBar } from "@/components/search/search-bar";

export default function HotelsPage() {
  const searchParams = useSearchParams();
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    const params = {
      destination: searchParams.get("destination") ?? undefined,
      roomType: searchParams.get("roomType") ?? undefined,
      checkin: searchParams.get("checkin") ?? undefined,
      checkout: searchParams.get("checkout") ?? undefined,
      beds: searchParams.get("beds") ?? undefined,
      guests: searchParams.get("guests") ?? undefined,
    };
    const matched = getRoomsByFilters(params);
    setRooms(matched);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Find Your Perfect Stay</h1>

        {/* Enhanced Search Bar */}
        <div className="mb-8">
          <SearchBar />
        </div>

        <HotelListing />
        {/* <div className="flex justify-center my-8">
          <a href="/services">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all">
              Get Service
            </button>
          </a>
        </div> */}
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Available Rooms</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((r) => (
              <RoomCard key={r.id ?? r.number} room={r} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
