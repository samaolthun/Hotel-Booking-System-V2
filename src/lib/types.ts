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
  _ownerRoom?: boolean;
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
  id: number | string;
  userId: string;
  hotelId?: number | string;
  hotelName: string;
  hotelImage?: string;
  checkinDate: string; // ISO date string (YYYY-MM-DD) or full ISO
  checkoutDate: string; // ISO date string
  guests: number;
  roomType: string;
  roomTypeKey?: string;
  nights?: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "checked-in" | "canceled" | string;
  bookingDate?: string;
  paymentMethod?: string;
  paymentPercent?: number;
  paymentAmount?: number;
  adults?: number;
  children?: number;
  // any legacy keys
  [key: string]: any;
}

export interface Room {
  id: number;
  number: string;
  type: string;
  status: string;
  floor: string;
  hotelName: string;
  location: string;
  mapEmbed: string;
  price: number;
  capacity: number;
  description: string;
  services: string[];
  amenities: string[];
  photo: string;
  lastUpdated: string;
  rating: number;
}
