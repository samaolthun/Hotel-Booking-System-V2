"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HotelDetails } from "@/components/hotels/hotel-details";
import { getHotelById } from "@/lib/data/hotels";
import { notFound } from "next/navigation";
import { HotelPageClient } from "@/components/hotels/hotel-page-client";
import { use } from "react";

interface HotelPageProps {
  params: Promise<{ id: string }>;
}

export default function HotelPage({ params }: HotelPageProps) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const hotelId = Number.parseInt(resolvedParams.id);

  // First try to get from existing hotels
  const hotel = getHotelById(hotelId);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <HotelPageClient hotelId={hotelId} existingHotel={hotel} />
      </main>
      <Footer />
    </div>
  );
}
