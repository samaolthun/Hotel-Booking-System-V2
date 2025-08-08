import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FavoriteHotels } from "@/components/favorites/favorite-hotels"

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Favorite Hotels</h1>
        <FavoriteHotels />
      </main>
      <Footer />
    </div>
  )
}
