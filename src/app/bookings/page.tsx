"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MyBookings } from "@/components/bookings/my-bookings";

export default function BookingsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
          <strong>Cancellation Policy:</strong> If you cancel your booking
          before 2 days of check-in, your pre-order payment will{" "}
          <span className="font-bold">not be refunded</span>.
        </div>
        <MyBookings />
      </main>
      <Footer />
    </div>
  );
}
