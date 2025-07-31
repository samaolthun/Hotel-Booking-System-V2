"use client"

import { HotelCard } from "@/src/components/hotels/hotel-card"
import { getFeaturedHotels } from "@/src/lib/data/hotels"

export function FeaturedHotels() {
  const featuredHotels = getFeaturedHotels()

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Hotels</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>
    </section>
  )
}
