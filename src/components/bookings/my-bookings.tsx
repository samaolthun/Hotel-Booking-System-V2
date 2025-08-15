"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import type { Booking } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function MyBookings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("bookings");
    const all: Booking[] = stored ? JSON.parse(stored) : [];
    setBookings(user ? all.filter((b) => b.userId === user.id) : []);
  }, [user]);

  const handleCancelBooking = (booking: Booking) => {
    setBookingToCancel(booking);
    setShowPolicyDialog(true);
  };

  const confirmCancellation = () => {
    if (!bookingToCancel) return;

    const stored = localStorage.getItem("bookings");
    const all: Booking[] = stored ? JSON.parse(stored) : [];
    const updated = all.filter((booking) => booking.id !== bookingToCancel.id);
    localStorage.setItem("bookings", JSON.stringify(updated));

    // SAFELY update visible bookings only if user exists
    if (!user) {
      setBookings([]);
    } else {
      setBookings(updated.filter((booking) => booking.userId === user.id));
    }

    setShowPolicyDialog(false);
    setBookingToCancel(null);

    toast({
      title: "Booking Cancelled",
      description: `Your booking for ${bookingToCancel.hotelName} has been cancelled.`,
      variant: "destructive",
    });
  };

  const cancelCancellation = () => {
    setShowPolicyDialog(false);
    setBookingToCancel(null);
  };

  if (!user) {
    return <p className="text-gray-600">Please login to view your bookings.</p>;
  }

  if (bookings.length === 0) {
    return <p className="text-gray-600">You have no bookings yet.</p>;
  }

  return (
    <div className="space-y-6">
      {bookings.map((b) => (
        <div key={b.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Image
              src={b.hotelImage || "/placeholder.svg"}
              alt={b.hotelName}
              width={200}
              height={120}
              className="rounded-md object-cover"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1">{b.hotelName}</h3>
              <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                <p>
                  <strong>Check-in:</strong> {b.checkinDate}
                </p>
                <p>
                  <strong>Check-out:</strong> {b.checkoutDate}
                </p>
                <p>
                  <strong>Guests:</strong> {b.guests}
                </p>
                <p>
                  <strong>Room:</strong> {b.roomType}
                </p>
              </div>
              <p className="mt-2 text-indigo-600 font-bold">${b.totalPrice}</p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                    Cancel Booking
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently cancel
                      your booking for <strong>{b.hotelName}</strong>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Go Back</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleCancelBooking(b)}>
                      Yes, Cancel Booking
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      ))}

      {/* Cancellation Policy Confirmation Dialog */}
      <AlertDialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              ⚠️ Cancellation Policy Reminder
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left space-y-3">
              <div>
                <strong>Cancellation Policy:</strong>
              </div>

              <div className="bg-red-50 p-3 rounded-md border border-red-200">
                If you cancel your booking before 2 days of check-in, your
                pre-order payment will <strong>NOT be refunded</strong>.
              </div>
              <div>
                Are you sure you want to proceed with cancelling your booking
                for <strong>{bookingToCancel?.hotelName}</strong>?
              </div>
              <div className="text-sm text-gray-600">
                Check-in date: {bookingToCancel?.checkinDate}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelCancellation}>
              Keep My Booking
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancellation}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Cancel Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
