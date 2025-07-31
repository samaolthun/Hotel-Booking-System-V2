import { Header } from "@/src/components/layout/header";
import { Footer } from "@/src/components/layout/footer";
import { HotelDetails } from "@/src/components/hotels/hotel-details";
import { getHotelById } from "@/src/lib/data/hotels";
import { notFound } from "next/navigation";
import { HotelPageClient } from "@/src/components/hotels/hotel-page-client";

interface HotelPageProps {
  params: {
    id: string;
  };
}

export default async function HotelPage({ params }: HotelPageProps) {
  // Await params if it's a Promise (Next.js 14+)
  const resolvedParams = await params;
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
