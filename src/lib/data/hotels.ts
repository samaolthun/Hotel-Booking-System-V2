import type { Hotel } from "@/lib/types";

export const hotels: Hotel[] = [
  {
    id: 1,
    name: "Raffles Hotel Le Royal",
    location: "Phnom Penh",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.6665204982296!2d104.91528867452708!3d11.57574704394293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13!1!3m3!1m2!1s0x31095142d640cb2b%3A0x36d6de0397867eba!2z4Z6f4Z6O4Z-S4Z6L4Z624Z6C4Z624Z6a4oCL4Z6a4Z-Q4Z6g4Z-S4Z6c4Z6g4Z-S4Z6c4Z6b4Z6f4Z-NIOGeoeGeuiDhnprhn4nhnrzhnpnhn4nhnrbhnpvhn4vigIs!5e0!3m2!1skm!2skh!4v1751983946171!5m2!1skm!2skh",
    price: 280,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570597804248-011035037c0c?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563911302-a2463e0d10a2?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570597804248-011035037c0c?w=800&h=500&fit=crop&q=80",
    ],
    rating: 4.8,
    description:
      "A legendary hotel in the heart of Phnom Penh, offering luxury and elegance with rich history.",
    amenities: ["Pool", "Spa", "Restaurant", "Fitness Center", "WiFi"],
    rooms: {
      standard: { name: "Standard Room", price: 280 },
      deluxe: { name: "Deluxe Room", price: 380 },
      suite: { name: "Suite", price: 580 },
      presidential: { name: "Presidential Suite", price: 1200 },
    },
    reviews: [
      {
        id: 1,
        userId: 1,
        user: "John Doe",
        rating: 5,
        comment: "Exceptional service and beautiful rooms!",
        date: "2024-12-15",
        roomType: "deluxe",
      },
      {
        id: 2,
        userId: 2,
        user: "Jane Smith",
        rating: 4,
        comment: "Great location and amenities.",
        date: "2024-12-10",
        roomType: "standard",
      },
    ],
  },
  {
    id: 2,
    name: "Sofitel Phokeethra",
    location: "Phnom Penh",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3909.081619186229!2d104.93069157452672!3d11.54600274452865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13!1!3m3!1m2!1s0x3109513dc76a6be3%3A0x751bbde6c426d379!2z4Z6f4Z6O4Z-S4Z6L4Z624Z6C4Z624Z6aIOGen-GevOGeoOGfkuGenOGeuOGej-GfguGemyDhnpfhn5LhnpPhn4bhnpbhn4Hhnokg4Z6X4Z684Z6C4Z644Z6P4Z-S4Z6a4Z62!5e0!3m2!1skm!2skh!4v1751984753203!5m2!1skm!2skh",
    price: 320,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9d2f2be?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1568494000765-9003f66e7750?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9d2f2be?w=800&h=500&fit=crop&q=80",
    ],
    rating: 4.7,
    description:
      "French elegance meets Khmer hospitality in this luxury resort near Angkor Wat.",
    amenities: ["Pool", "Spa", "Restaurant", "Golf Course", "WiFi"],
    rooms: {
      standard: { name: "Standard Room", price: 320 },
      deluxe: { name: "Deluxe Room", price: 420 },
      suite: { name: "Suite", price: 620 },
      presidential: { name: "Presidential Suite", price: 1400 },
    },
    reviews: [
      {
        id: 3,
        userId: 3,
        user: "Mike Johnson",
        rating: 5,
        comment: "Perfect location for temple visits!",
        date: "2024-12-12",
        roomType: "suite",
      },
      {
        id: 4,
        userId: 4,
        user: "Sarah Wilson",
        rating: 4,
        comment: "Beautiful grounds and excellent breakfast.",
        date: "2024-12-08",
        roomType: "deluxe",
      },
    ],
  },
  {
    id: 3,
    name: "The Palace Gate Hotel",
    location: "Phnom Penh",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3908.8823806791665!2d104.93003042452685!3d11.560288794247505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13!1!2m1!1sThe%20Palace%20Gate%20Hotel!5e0!3m2!1skm!2skh!4v1751984861206!5m2!1skm!2skh",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570597804248-011035037c0c?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563911302-a2463e0d10a2?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570597804248-011035037c0c?w=800&h=500&fit=crop&q=80",
    ],
    rating: 4.5,
    description:
      "Historic hotel with traditional Khmer architecture and modern comforts.",
    amenities: ["Restaurant", "Bar", "WiFi", "Concierge", "Room Service"],
    rooms: {
      standard: { name: "Standard Room", price: 180 },
      deluxe: { name: "Deluxe Room", price: 250 },
      suite: { name: "Suite", price: 350 },
      presidential: { name: "Presidential Suite", price: 600 },
    },
    reviews: [
      {
        id: 5,
        userId: 5,
        user: "David Brown",
        rating: 4,
        comment: "Charming historic building with great service.",
        date: "2024-12-05",
        roomType: "standard",
      },
      {
        id: 6,
        userId: 6,
        user: "Emily Davis",
        rating: 5,
        comment: "Perfect location near the palace!",
        date: "2024-12-01",
        roomType: "deluxe",
      },
    ],
  },
  {
    id: 4,
    name: "Knai Bang Chat",
    location: "Kep",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.107373815199!2d104.28688757451388!3d10.492201264373064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13!1!3m3!1m2!1s0x3109cd087ee23381%3A0x541d9c55cfb0ba38!2sKnai%20Bang%20Chatt%20Resort%20in%20Kep!5e0!3m2!1skm!2skh!4v1751984950331!5m2!1skm!2skh",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563911302-a2463e0d10a2?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
    ],
    rating: 4.3,
    description:
      "Boutique hotel offering comfortable accommodations with traditional Khmer design.",
    amenities: ["Pool", "Restaurant", "Bar", "WiFi", "Parking"],
    rooms: {
      standard: { name: "Standard Room", price: 180 },
      deluxe: { name: "Deluxe Room", price: 250 },
      suite: { name: "Suite", price: 380 },
      presidential: { name: "Presidential Suite", price: 680 },
    },
    reviews: [
      {
        id: 6,
        userId: 7,
        user: "Emma Brown",
        rating: 5,
        comment: "Breathtaking views and excellent seafood!",
        date: "2024-12-11",
        roomType: "deluxe",
      },
    ],
  },
  {
    id: 5,
    name: "Song Saa Private Island",
    location: "Koh Rong",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.7266777221726!2d103.25948707451703!3d10.755535559579839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13!1!3m3!1m2!1s0x3107c1610be23ed3%3A0xba40f7bb13f3a9eb!2sSong%20Saa%20Private%20Island!5e0!3m2!1skm!2skh!4v1751985357612!5m2!1skm!2skh",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=500&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563911302-a2463e0d10a2?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
    ],
    rating: 4.9,
    description:
      "Ultra-luxury private island resort with overwater villas and pristine beaches.",
    amenities: ["Private Beach", "Spa", "Water Sports", "Fine Dining", "WiFi"],
    rooms: {
      standard: { name: "Villa", price: 1200 },
      deluxe: { name: "Overwater Villa", price: 1800 },
      suite: { name: "Royal Villa", price: 2400 },
      presidential: { name: "Presidential Villa", price: 4000 },
    },
    reviews: [
      {
        id: 7,
        userId: 8,
        user: "Robert Taylor",
        rating: 5,
        comment: "Once in a lifetime experience!",
        date: "2024-12-09",
        roomType: "deluxe",
      },
    ],
  },
  {
    id: 6,
    name: "Jaya House River Park",
    location: "Phnom Penh",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3881.6813765819456!2d103.86186457455273!3d13.370077506017848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13!1!3m3!1m2!1s0x3110170a2cb4f7a7%3A0x64c7b21ef14588e0!2sJaya%20House%20River%20Park%20Hotel!5e0!3m2!1skm!2skh!4v1751985357612!5m2!1skm!2skh",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563911302-a2463e0d10a2?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
    ],
    rating: 4.4,
    description:
      "Modern riverside hotel with contemporary design and excellent amenities.",
    amenities: ["River View", "Spa", "Restaurant", "Fitness Center", "WiFi"],
    rooms: {
      standard: { name: "Standard Room", price: 150 },
      deluxe: { name: "Deluxe Room", price: 200 },
      suite: { name: "Suite", price: 300 },
      presidential: { name: "Presidential Suite", price: 500 },
    },
    reviews: [
      {
        id: 8,
        userId: 9,
        user: "Lisa Chen",
        rating: 4,
        comment: "Great riverside location and modern facilities.",
        date: "2024-12-07",
        roomType: "deluxe",
      },
    ],
  },
];

export function getAllHotels(): Hotel[] {
  return hotels;
}

export function getFeaturedHotels(): Hotel[] {
  return hotels.slice(0, 4);
}

export function getHotelById(id: number): Hotel | undefined {
  return hotels.find((hotel) => hotel.id === id);
}

export type RoomFilter = {
  destination?: string;
  roomType?: string;
  checkin?: string; // yyyy-mm-dd
  checkout?: string; // yyyy-mm-dd
  beds?: string;
  guests?: string | number;
};

function safeParseDate(d?: string | null) {
  if (!d) return null;
  // Accept YYYY-MM-DD or ISO strings
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return (
    aStart.getTime() <= bEnd.getTime() && bStart.getTime() <= aEnd.getTime()
  );
}

function readJSON<T>(key: string): T[] {
  try {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getAllRooms(): any[] {
  // Try multiple keys so we cover owner/user/global shapes
  const keys = ["rooms", "userRooms", "ownerRooms"];
  const seen = new Map<number | string, any>();
  for (const k of keys) {
    const arr = readJSON<any>(k);
    for (const r of arr) {
      const id = r?.id ?? `${r?.hotelId ?? r?.number ?? Math.random()}`;
      if (!seen.has(id)) seen.set(id, r);
    }
  }
  return Array.from(seen.values());
}

export function getAllBookings(): any[] {
  return readJSON<any>("bookings");
}

/**
 * Return rooms that match filters and are AVAILABLE in the date range.
 */
export function getRoomsByFilters(filters: RoomFilter = {}) {
  const rooms = getAllRooms();
  const bookings = getAllBookings();

  const checkinDate = safeParseDate(filters.checkin);
  const checkoutDate = safeParseDate(filters.checkout);

  // If only one date provided, treat it as a single-night search (checkout = checkin)
  let searchStart: Date | null = null;
  let searchEnd: Date | null = null;
  if (checkinDate && checkoutDate) {
    searchStart = checkinDate;
    searchEnd = checkoutDate;
  } else if (checkinDate && !checkoutDate) {
    searchStart = checkinDate;
    searchEnd = new Date(checkinDate.getTime() + 1000 * 60 * 60 * 24); // +1 day
  } else if (!checkinDate && checkoutDate) {
    searchStart = checkoutDate;
    searchEnd = new Date(checkoutDate.getTime() + 1000 * 60 * 60 * 24);
  }

  return rooms.filter((room: any) => {
    // roomType
    if (
      filters.roomType &&
      String(room.type ?? room.roomType ?? "").toLowerCase() !==
        String(filters.roomType).toLowerCase()
    ) {
      return false;
    }

    // guests -> capacity
    if (filters.guests) {
      const needed = Number(filters.guests);
      const cap = Number(room.capacity ?? room.maxGuests ?? room.guests ?? 0);
      if (!isNaN(needed) && needed > cap) return false;
    }

    // destination (optional) - simple contains match
    if (filters.destination) {
      const dest = String(filters.destination).toLowerCase();
      const roomLoc = String(
        room.location ?? room.city ?? room.hotelName ?? ""
      ).toLowerCase();
      if (!roomLoc.includes(dest)) return false;
    }

    // availability check: if no date range requested, treat as available
    if (!searchStart || !searchEnd) return true;

    // find bookings that reference this room (try multiple shapes)
    const roomId = room.id ?? room.roomId ?? room.number ?? room._id;
    const relatedBookings = bookings.filter((b: any) => {
      // booking may reference roomId, room, roomNumber, hotelId+roomNumber etc.
      if (b.roomId && String(b.roomId) === String(roomId)) return true;
      if (
        b.room &&
        ((b.room.id && String(b.room.id) === String(roomId)) ||
          b.room === roomId)
      )
        return true;
      if (b.roomNumber && String(b.roomNumber) === String(room.number))
        return true;
      // fallback: if booking contains rooms array
      if (
        Array.isArray(b.rooms) &&
        b.rooms.some((r: any) => String(r?.id ?? r) === String(roomId))
      )
        return true;
      return false;
    });

    // if any related booking overlaps requested range -> not available
    for (const b of relatedBookings) {
      const bStart = safeParseDate(b.checkinDate ?? b.startDate ?? b.from);
      const bEnd = safeParseDate(b.checkoutDate ?? b.endDate ?? b.to);
      if (!bStart || !bEnd) continue; // malformed booking -> ignore
      if (rangesOverlap(searchStart, searchEnd, bStart, bEnd)) return false;
    }

    return true;
  });
}
