export interface Hotel {
  id: number;
  name: string;
  location: string;
  mapEmbed: string;
  price: number;
  image: string; // Keep for backward compatibility if needed, but prefer images array
  images: string[]; // New field for multiple images
  rating: number;
  description: string;
  amenities: string[];
  status?: "available" | "occupied" | "maintenance"; // Optional status for owner-added rooms
  rooms: {
    [key: string]: { name: string; price: number };
    standard: { name: string; price: number };
    deluxe: { name: string; price: number };
    suite: { name: string; price: number };
    presidential: { name: string; price: number };
  };
  reviews: Review[];
}

export interface Review {
  id: number;
  userId: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
  roomType: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: "customer" | "owner" | "admin";
}

export interface Booking {
  id: number;
  userId: number;
  hotelId: number;
  hotelName: string;
  hotelImage: string;
  checkinDate: string;
  checkoutDate: string;
  guests: number;
  roomType: string;
  nights: number;
  totalPrice: number;
  status: "confirmed" | "cancelled" | "completed";
  bookingDate: string;
  paymentMethod?: string;
}

export interface Room {
  id: number;
  number: string;
  type: "single" | "double" | "suite" | "deluxe";
  status: "available" | "occupied" | "maintenance";
  price: number;
  capacity: number;
  lastUpdated: string;
  description: string;
}
