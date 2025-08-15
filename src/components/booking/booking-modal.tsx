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
import { AlertCircle, CheckCircle, Loader2, Calendar, Users, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
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
  const [step, setStep] = useState<"details" | "payment" | "confirmation">("details");

  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Ensure checkout is after check-in
  useEffect(() => {
    if (checkout <= checkin) {
      const nextDay = new Date(checkin);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckout(nextDay.toISOString().split("T")[0]);
    }
  }, [checkin, checkout]);

  // Update total guests when adults or children change
  useEffect(() => {
    setGuests((Number(adults) + Number(children)).toString());
  }, [adults, children]);

  // Check room availability when dates or room type change
  useEffect(() => {
    if (checkin && checkout && roomType && checkin < checkout) {
      setIsChecking(true);
      // Simulate API call delay
      setTimeout(() => {
        // For now, assume all rooms are available
        setIsAvailable(true);
        setIsChecking(false);
      }, 500);
    } else {
      setIsAvailable(null);
    }
  }, [checkin, checkout, roomType, hotel.id, hotel.rooms]);

  const calculateNights = () => {
    if (!checkin || !checkout) return 0;
    const start = new Date(checkin);
    const end = new Date(checkout);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    const nights = calculateNights();
    const roomPrice = hotel.rooms[roomType]?.price || hotel.price;
    return nights * roomPrice;
  };

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

    // Validation: Check-in must be today or in the future
    if (new Date(checkin) < new Date(today)) {
      toast({
        title: "Invalid check-in date",
        description: "Check-in date must be today or in the future.",
        variant: "destructive",
      });
      return;
    }

    // Validation: Must stay at least 1 night
    if (calculateNights() < 1) {
      toast({
        title: "Invalid stay duration",
        description: "You must stay at least 1 night.",
        variant: "destructive",
      });
      return;
    }

    // Create booking details
    const booking = {
      checkin,
      checkout,
      guests: Number(guests),
      adults: Number(adults),
      children: Number(children),
      nights: calculateNights(),
      totalPrice: calculateTotalPrice(),
      roomType: hotel.rooms[roomType]?.name || roomType,
    };

    setBookingDetails(booking);
    setStep("payment");
  };

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to complete your booking.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create the final booking
      const finalBooking = {
        id: Date.now(),
        userId: user.id,
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotelImage: hotel.image,
        checkinDate: checkin,
        checkoutDate: checkout,
        guests: Number(guests),
        roomType: hotel.rooms[roomType]?.name || roomType,
        nights: calculateNights(),
        totalPrice: calculateTotalPrice(),
        status: "confirmed" as const,
        bookingDate: new Date().toISOString(),
        paymentMethod,
        adults: Number(adults),
        children: Number(children),
      };

      // Save to localStorage
      const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      const updatedBookings = [...existingBookings, finalBooking];
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));

      // Update room status if it's an owner room
      if (hotel._ownerRoom) {
        const userRooms = JSON.parse(localStorage.getItem("userRooms") || "[]");
        const updatedRooms = userRooms.map((room: any) =>
          room.id === hotel.id
            ? { ...room, status: "occupied" }
            : room
        );
        localStorage.setItem("userRooms", JSON.stringify(updatedRooms));
      }

      setPaymentSuccess(true);
      setStep("confirmation");

      toast({
        title: "Booking confirmed!",
        description: "Your hotel booking has been successfully confirmed.",
      });

    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleGoToBookings = () => {
    router.push("/bookings");
    onClose();
  };

  const resetForm = () => {
    setCheckin(today);
    setCheckout(today);
    setGuests("1");
    setAdults("1");
    setChildren("0");
    setPaymentPercent("50");
    setPaymentMethod("KHQR");
    setStep("details");
    setShowConfirmation(false);
    setBookingDetails(null);
    setPaymentSuccess(false);
  };

  const closeModal = () => {
    resetForm();
    onClose();
  };

  if (step === "payment") {
    return (
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Complete your booking by providing payment information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Hotel:</span>
                  <span className="font-medium">{hotel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Room Type:</span>
                  <span className="font-medium">{hotel.rooms[roomType]?.name || roomType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span>{new Date(checkin).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out:</span>
                  <span>{new Date(checkout).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nights:</span>
                  <span>{calculateNights()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span>{guests}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${calculateTotalPrice()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Payment Method</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KHQR">KHQR (Cambodia)</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessingPayment}
                className="w-full"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay ${calculateTotalPrice()}
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => setStep("details")}
                className="w-full"
              >
                Back to Details
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === "confirmation") {
    return (
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Booking Confirmed!
            </DialogTitle>
            <DialogDescription>
              Your hotel booking has been successfully confirmed
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Booking ID: #{bookingDetails?.id || Date.now()}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button onClick={handleGoToBookings} className="w-full">
                View My Bookings
              </Button>
              <Button variant="outline" onClick={closeModal} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Your Stay</DialogTitle>
          <DialogDescription>
            Complete your booking for {hotel.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Check-in Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Check-in Date
            </label>
            <Input
              type="date"
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
              min={today}
              required
            />
          </div>

          {/* Check-out Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Check-out Date
            </label>
            <Input
              type="date"
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
              min={checkin}
              required
            />
          </div>

          {/* Guest Information */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Guest Information
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-gray-600">Adults</label>
                <Select value={adults} onValueChange={setAdults}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-gray-600">Children</label>
                <Select value={children} onValueChange={setChildren}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-gray-600">Total</label>
                <Input
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  readOnly
                  className="text-center"
                />
              </div>
            </div>
          </div>

          {/* Availability Check */}
          {isChecking && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>Checking room availability...</AlertDescription>
            </Alert>
          )}

          {isAvailable === false && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Room not available for selected dates
              </AlertDescription>
            </Alert>
          )}

          {isAvailable === true && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Room available! {calculateNights()} night(s) for ${calculateTotalPrice()}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isAvailable || isChecking}
            className="w-full"
          >
            Continue to Payment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
