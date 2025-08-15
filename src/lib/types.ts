export interface Hotel {
  photo: string;
  id: number;
  name: string;
  location: string;
  mapEmbed: string;
  price: number;
  image?: string;
  images?: string[];
  rating: number;
  description: string;
  amenities: string[];
  rooms: {
    [key: string]: {
      name: string;
      price: number;
    };
  };
  reviews: any[];
  status?: string;
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
  number: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  status: "available" | "occupied" | "maintenance";
  // ...other properties
}
