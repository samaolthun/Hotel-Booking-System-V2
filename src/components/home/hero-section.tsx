"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRoomsByFilters } from "@/lib/data/hotels";
import { RoomCard } from "@/components/hotels/room-card";
import { FeaturedHotels } from "@/components/home/featured-hotels";
import Link from "next/link";

export function HeroSection() {
  const [destination, setDestination] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [roomType, setRoomType] = useState("");
  const [beds, setBeds] = useState("");
  const [guests, setGuests] = useState("");
  const [searchedRooms, setSearchedRooms] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // All fields optional
    if (destination || roomType || checkin || checkout || beds || guests) {
      const rooms = getRoomsByFilters({
        destination,
        roomType,
        checkin,
        checkout,
        beds,
        guests,
      });
      setSearchedRooms(rooms);
    } else {
      setSearchedRooms([]);
    }
  }, [destination, roomType, checkin, checkout, beds, guests]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // All fields optional
    const params = new URLSearchParams({
      ...(destination && { destination }),
      ...(roomType && { roomType }),
      ...(checkin && { checkin }),
      ...(checkout && { checkout }),
      ...(beds && { beds }),
      ...(guests && { guests }),
    });
    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <>
      <section className="hero-bg relative h-[75vh] min-h-[400px] flex items-center justify-center text-white">
        <div className="relative text-center px-4 z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            Sokha Hotels & Resorts
          </h1>
          <form
            onSubmit={handleSearch}
            className="flex flex-wrap gap-4 justify-center rounded-lg shadow-lg p-6 backdrop-blur bg-white/40 max-w-xl mx-auto"
          >
            {/* <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="p-2 rounded text-black bg-white"
            >
              <option value="">Destination (Any)</option>
              <option value="Phnom Penh">Phnom Penh</option>
              <option value="Siem Reap">Siem Reap</option>
              <option value="Kep">Kep</option>
              <option value="Koh Rong">Koh Rong</option>
            </select> */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Check-in</label>
              <input
                type="date"
                value={checkin}
                onChange={(e) => setCheckin(e.target.value)}
                className="p-2 rounded text-black bg-white"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Check-out</label>
              <input
                type="date"
                value={checkout}
                onChange={(e) => setCheckout(e.target.value)}
                className="p-2 rounded text-black bg-white"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="p-2 rounded text-black bg-white"
              >
                <option value="">Room Type (Any)</option>
                <option value="standard">Standard Room</option>
                <option value="deluxe">Deluxe Room</option>
                <option value="suite">Suite</option>
                <option value="presidential">Presidential Suite</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Beds</label>
              <select
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="p-2 rounded text-black bg-white"
              >
                <option value="">Beds (Any)</option>
                <option value="1">Single</option>
                <option value="2">Couple</option>
                <option value="3">3 Beds</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Guests</label>
              <input
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="p-2 rounded"
                placeholder="Guests (Any)"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded"
            >
              Check Available Rooms
            </button>
          </form>
        </div>
      </section>

      {/* Searched Rooms Section */}
      {searchedRooms.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Available Rooms
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {searchedRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Hotels Section */}
      <FeaturedHotels />

      <div className="flex justify-center py-4">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.567657919895!2d104.9300304!3d11.5602888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDMzJzM3LjAiTiAxMDTCsDU1JzQ4LjEiRQ!5e0!3m2!1sen!2skh!4v1688471234567!5m2!1sen!2skh"
          width="850"
          height="350"
          style={{ border: 0, borderRadius: "12px" }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Palace Gate Hotel & Resort Map"
        ></iframe>
      </div>
    </>
  );
}
