import { HeroSection } from "@/components/home/hero-section";
import { FeaturedHotels } from "@/components/home/featured-hotels";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturedHotels />
        <div className="flex justify-center my-8">
          <a href="/services">
            {/* <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all">
              Get Service
            </button> */}
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
