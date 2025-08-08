import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HotelListing } from "@/components/hotels/hotel-listing";
import { SearchBar } from "@/components/search/search-bar";

export default function HotelsPage() {
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
      </main>
      <Footer />
    </div>
  );
}
