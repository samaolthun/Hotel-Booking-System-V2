"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { isRoomAvailable } from "@/lib/utils";
import type { Hotel } from "@/lib/types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel;
  roomType: keyof Hotel["rooms"];
}

export function BookingModal({
  isOpen,
  onClose,
  hotel,
  roomType,
}: BookingModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const [checkin, setCheckin] = useState(today);
  const [checkout, setCheckout] = useState(today);
  const [guests, setGuests] = useState<string>("1");
  const [adults, setAdults] = useState("1");
  const [children, setChildren] = useState("0");
  const [paymentPercent, setPaymentPercent] = useState("50");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("KHQR");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  // Ensure checkout is after check-in
  useEffect(() => {
    if (checkout <= checkin) {
      const nextDay = new Date(checkin);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckout(nextDay.toISOString().split("T")[0]);
    }
  }, [checkin, checkout]);

  // Check room availability when dates or room type change
  useEffect(() => {
    if (checkin && checkout && roomType && checkin < checkout) {
      setIsChecking(true);
      // Simulate API call delay
      setTimeout(() => {
        const available = isRoomAvailable(
          hotel.id,
          hotel.rooms[roomType].name,
          checkin,
          checkout
        );
        setIsAvailable(available);
        setIsChecking(false);
      }, 500);
    } else {
      setIsAvailable(null);
    }
  }, [checkin, checkout, roomType, hotel.id, hotel.rooms]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Guests must equal Adults + Children
    if (Number(guests) !== Number(adults) + Number(children)) {
      toast({
        title: "Guest count mismatch",
        description:
          "Number of guests must equal the sum of adults and children.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login before booking.",
        variant: "destructive",
      });
      onClose();
      return;
    }

    if (!isAvailable) {
      toast({
        title: "Room not available",
        description: "This room is not available for the selected dates.",
        variant: "destructive",
      });
      return;
    }

    const nights =
      (new Date(checkout).getTime() - new Date(checkin).getTime()) /
      (1000 * 60 * 60 * 24);

    const booking = {
      id: Date.now(),
      userId: user.id,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelImage: hotel.image,
      checkinDate: checkin,
      checkoutDate: checkout,
      guests: Number(guests),
      adults: Number(adults),
      children: Number(children),
      roomType: hotel.rooms[roomType].name,
      nights,
      totalPrice: nights * hotel.rooms[roomType].price,
      status: "confirmed" as const,
      bookingDate: today,
      paymentMethod,
      paymentPercent: Number(paymentPercent),
    };

    // Show confirmation dialog
    setBookingDetails(booking);
    setShowConfirmation(true);
  };

  const confirmBooking = () => {
    if (!bookingDetails) return;
    setIsProcessingPayment(true);
    setPaymentSuccess(false);
    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      // Store in localStorage
      const stored = localStorage.getItem("bookings");
      const bookings = stored ? JSON.parse(stored) : [];
      bookings.push(bookingDetails);
      localStorage.setItem("bookings", JSON.stringify(bookings));
      toast({
        title: "Booking confirmed!",
        description: `Enjoy your stay at ${bookingDetails.hotelName}.`,
      });
    }, 2000);
  };

  const handleGoToBookings = () => {
    setShowConfirmation(false);
    setBookingDetails(null);
    setPaymentSuccess(false);
    onClose();
    window.location.href = "/bookings";
  };

  const cancelConfirmation = () => {
    setShowConfirmation(false);
    setBookingDetails(null);
  };

  // Calculate pre-payment amount
  const prePaymentAmount = bookingDetails
    ? ((Number(paymentPercent) / 100) * bookingDetails.totalPrice).toFixed(2)
    : "0.00";

  // Add type checking for room
  const room = hotel?.rooms?.[roomType];

  useEffect(() => {
    if (!hotel || !roomType || !checkin || !checkout) return;

    const room = hotel.rooms[roomType];
    if (!room) return;

    // Set initial availability based on room status
    if (room.status !== "available") {
      setIsAvailable(false);
      return;
    }

    // Check booking availability
    const available = isRoomAvailable(
      hotel.id,
      room.number,
      new Date(checkin),
      new Date(checkout)
    );

    setIsAvailable(available);

    // Log for debugging
    console.log("Checking availability:", {
      hotelId: hotel.id,
      roomNumber: room.number,
      checkIn: checkin,
      checkOut: checkout,
      isAvailable: available,
    });
  }, [hotel, roomType, checkin, checkout]);

  // Add error handling for when room data is missing
  if (!room) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              Room information not found. Please try again.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={onClose}>Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book {hotel.name}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Check-in Date
              </label>
              <Input
                type="date"
                value={checkin}
                min={today}
                onChange={(e) => setCheckin(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Check-out Date
              </label>
              <Input
                type="date"
                value={checkout}
                min={checkin}
                onChange={(e) => setCheckout(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Adults</label>
                <Select value={adults} onValueChange={setAdults}>
                  <SelectTrigger>
                    <SelectValue placeholder="Adults" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((a) => (
                      <SelectItem key={a} value={String(a)}>
                        {a} {a === 1 ? "Adult" : "Adults"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Children
                </label>
                <Select value={children} onValueChange={setChildren}>
                  <SelectTrigger>
                    <SelectValue placeholder="Children" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map((c) => (
                      <SelectItem key={c} value={String(c)}>
                        {c} {c === 1 ? "Child" : "Children"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Guests</label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger>
                  <SelectValue placeholder="Guests" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((g) => (
                    <SelectItem key={g} value={g.toString()}>
                      {g} {g === 1 ? "Guest" : "Guests"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Room Type
              </label>
              <Select
                value={roomType}
                onValueChange={(v) => setRoomType(v as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Room" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(hotel.rooms).map(([key, room]) => (
                    <SelectItem key={key} value={key}>
                      {room.name} – ${room.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Availability Status */}
            {checkin && checkout && roomType && checkin < checkout && (
              <div className="space-y-2">
                {isChecking ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Checking availability...
                    </AlertDescription>
                  </Alert>
                ) : isAvailable === true ? (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      ✅ Room is available for selected dates
                    </AlertDescription>
                  </Alert>
                ) : isAvailable === false ? (
                  <Alert className="border-red-200 bg-red-50 text-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      ❌ Room is not available for selected dates
                    </AlertDescription>
                  </Alert>
                ) : null}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!isAvailable || isChecking}
            >
              {isChecking
                ? "Checking..."
                : isAvailable === false
                ? "Room Unavailable"
                : "Proceed to Booking"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={cancelConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
          </DialogHeader>
          {isProcessingPayment ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mb-4" />
              <div className="text-lg font-semibold mb-2">
                Processing payment with {paymentMethod}...
              </div>
              <div className="text-gray-500">Please wait a moment.</div>
            </div>
          ) : paymentSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="h-10 w-10 text-green-600 mb-4" />
              <div className="text-lg font-semibold mb-2 text-green-700">
                Payment successful!
              </div>
              <div className="mb-4 text-gray-700">
                Your booking is confirmed.
              </div>
              <Button onClick={handleGoToBookings} className="w-full max-w-xs">
                Go to My Bookings
              </Button>
            </div>
          ) : (
            bookingDetails && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Hotel:</span>
                    <span>{bookingDetails.hotelName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Room Type:</span>
                    <span>{bookingDetails.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Check-in:</span>
                    <span>
                      {new Date(
                        bookingDetails.checkinDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Check-out:</span>
                    <span>
                      {new Date(
                        bookingDetails.checkoutDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Adults:</span>
                    <span>{bookingDetails.adults}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Children:</span>
                    <span>{bookingDetails.children}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Guests:</span>
                    <span>{bookingDetails.guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Nights:</span>
                    <span>{bookingDetails.nights}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-bold">Total Price:</span>
                    <span className="font-bold text-lg">
                      ${bookingDetails.totalPrice}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Pre-payment Amount
                  </label>
                  <Select
                    value={paymentPercent}
                    onValueChange={setPaymentPercent}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Pre-payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50%</SelectItem>
                      <SelectItem value="40">40%</SelectItem>
                      <SelectItem value="100">100%</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2 text-sm text-indigo-700 font-semibold">
                    You need to pay: ${prePaymentAmount}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 mt-4">
                    Select Payment Method
                  </label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KHQR">KHQR</SelectItem>
                      <SelectItem value="VISA">VISA</SelectItem>
                      <SelectItem value="Paypal">Paypal</SelectItem>
                      <SelectItem value="Amazon Pay">Amazon Pay</SelectItem>
                      <SelectItem value="Apple Pay">Apple Pay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={cancelConfirmation}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button onClick={confirmBooking} className="flex-1">
                    Confirm Booking
                  </Button>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
