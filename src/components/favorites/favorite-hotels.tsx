"use client"

import { HotelCard } from "@/src/components/hotels/hotel-card"
import { useFavorites } from "@/src/hooks/use-favorites"
import { getHotelById } from "@/src/lib/data/hotels"

export function FavoriteHotels() {
  const { favorites } = useFavorites()

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">You haven&apos;t added any favorite hotels yet.</p>
      </div>
    )
  }

  const favoriteHotels = favorites.map((id) => getHotelById(id)).filter(Boolean) // remove undefined if an ID no longer exists

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {favoriteHotels.map((hotel) => (
        // Type assertion safe because of filter(Boolean) above
        <HotelCard key={hotel!.id} hotel={hotel!} />
      ))}
    </div>
  )
}
