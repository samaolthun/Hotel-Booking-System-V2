import type { Hotel } from "@/src/lib/types";

export const hotels: Hotel[] = [
  // {
  //   id: 1,
  //   name: "Raffles Hotel Le Royal",
  //   location: "Phnom Penh",
  //   mapEmbed:
  //     "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.6665204982296!2d104.91528867452708!3d11.57574704394293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31095142d640cb2b%3A0x36d6de0397867eba!2z4Z6f4Z6O4Z-S4Z6L4Z624Z6C4Z624Z6a4oCL4Z6a4Z-Q4Z6g4Z-S4Z6c4Z6g4Z-S4Z6c4Z6b4Z6f4Z-NIOGeoeGeuiDhnprhn4nhnrzhnpnhn4nhnrbhnpvhn4vigIs!5e0!3m2!1skm!2skh!4v1751983946171!5m2!1skm!2skh",
  //   price: 280,
  //   image:
  //     "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop",
  //   images: [
  //     "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1570597804248-011035037c0c?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1563911302-a2463e0d10a2?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1570597804248-011035037c0c?w=800&h=500&fit=crop&q=80",
  //   ],
  //   rating: 4.8,
  //   description:
  //     "A legendary hotel in the heart of Phnom Penh, offering luxury and elegance with rich history.",
  //   amenities: ["Pool", "Spa", "Restaurant", "Fitness Center", "WiFi"],
  //   rooms: {
  //     standard: { name: "Standard Room", price: 280 },
  //     deluxe: { name: "Deluxe Room", price: 380 },
  //     suite: { name: "Suite", price: 580 },
  //     presidential: { name: "Presidential Suite", price: 1200 },
  //   },
  //   reviews: [
  //     {
  //       id: 1,
  //       user: "John Doe",
  //       rating: 5,
  //       comment: "Exceptional service and beautiful rooms!",
  //       date: "2024-12-15",
  //       roomType: "deluxe",
  //     },
  //     {
  //       id: 2,
  //       user: "Jane Smith",
  //       rating: 4,
  //       comment: "Great location and amenities.",
  //       date: "2024-12-10",
  //       roomType: "standard",
  //     },
  //   ],
  // },
  // {
  //   id: 2,
  //   name: "Sofitel Phokeethra",
  //   location: "Phnom Penh",
  //   mapEmbed:
  //     "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3909.081619186229!2d104.93069157452672!3d11.54600274452865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109513dc76a6be3%3A0x751bbde6c426d379!2z4Z6f4Z6O4Z-S4Z6L4Z624Z6C4Z624Z6aIOGen-GevOGeoOGfkuGenOGeuOGej-GfguGemyDhnpfhn5LhnpPhn4bhnpbhn4Hhnokg4Z6X4Z684Z6C4Z644Z6P4Z-S4Z6a4Z62!5e0!3m2!1skm!2skh!4v1751984753203!5m2!1skm!2skh",
  //   price: 320,
  //   image:
  //     "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&h=300&fit=crop",
  //   images: [
  //     "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1578683010236-d716f9d2f2be?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1568494000765-9003f66e7750?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1578683010236-d716f9d2f2be?w=800&h=500&fit=crop&q=80",
  //   ],
  //   rating: 4.7,
  //   description:
  //     "French elegance meets Khmer hospitality in this luxury resort near Angkor Wat.",
  //   amenities: ["Pool", "Spa", "Restaurant", "Golf Course", "WiFi"],
  //   rooms: {
  //     standard: { name: "Standard Room", price: 320 },
  //     deluxe: { name: "Deluxe Room", price: 420 },
  //     suite: { name: "Suite", price: 620 },
  //     presidential: { name: "Presidential Suite", price: 1400 },
  //   },
  //   reviews: [
  //     {
  //       id: 3,
  //       user: "Mike Johnson",
  //       rating: 5,
  //       comment: "Perfect location for temple visits!",
  //       date: "2024-12-12",
  //       roomType: "suite",
  //     },
  //     {
  //       id: 4,
  //       user: "Sarah Wilson",
  //       rating: 4,
  //       comment: "Beautiful grounds and excellent breakfast.",
  //       date: "2024-12-08",
  //       roomType: "deluxe",
  //     },
  //   ],
  // },
  // {
  //   id: 3,
  //   name: "The Palace Gate Hotel",
  //   location: "Phnom Penh",
  //   mapEmbed:
  //     "https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3908.8823806791665!2d104.93003042452685!3d11.560288794247505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sThe%20Palace%20Gate%20Hotel!5e0!3m2!1skm!2skh!4v1751984861206!5m2!1skm!2skh",
  //   price: 180,
  //   image:
  //     "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=300&fit=crop",
  //   images: [
  //     "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1568084649219-e5550d167a06?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1568084649219-e5550d167a06?w=800&h=500&fit=crop&q=80",
  //   ],
  //   rating: 4.3,
  //   description:
  //     "Boutique hotel offering comfortable accommodations with traditional Khmer design.",
  //   amenities: ["Pool", "Restaurant", "Bar", "WiFi", "Parking"],
  //   rooms: {
  //     standard: { name: "Standard Room", price: 180 },
  //     deluxe: { name: "Deluxe Room", price: 250 },
  //     suite: { name: "Suite", price: 380 },
  //     presidential: { name: "Presidential Suite", price: 680 },
  //   },
  //   reviews: [
  //     {
  //       id: 5,
  //       user: "David Lee",
  //       rating: 4,
  //       comment: "Great value for money and friendly staff.",
  //       date: "2024-12-14",
  //       roomType: "standard",
  //     },
  //   ],
  // },
  // {
  //   id: 4,
  //   name: "Knai Bang Chat",
  //   location: "Kep",
  //   mapEmbed:
  //     "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.107373815199!2d104.28688757451388!3d10.492201264373064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109cd087ee23381%3A0x541d9c55cfb0ba38!2sKnai%20Bang%20Chatt%20Resort%20in%20Kep!5e0!3m2!1skm!2skh!4v1751984950331!5m2!1skm!2skh",
  //   price: 180,
  //   image:
  //     "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop",
  //   images: [
  //     "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1563911302-a2463e0d10a2?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
  //   ],
  //   rating: 4.3,
  //   description:
  //     "Boutique hotel offering comfortable accommodations with traditional Khmer design.",
  //   amenities: ["Pool", "Restaurant", "Bar", "WiFi", "Parking"],
  //   rooms: {
  //     standard: { name: "Standard Room", price: 180 },
  //     deluxe: { name: "Deluxe Room", price: 250 },
  //     suite: { name: "Suite", price: 380 },
  //     presidential: { name: "Presidential Suite", price: 680 },
  //   },
  //   reviews: [
  //     {
  //       id: 6,
  //       user: "Emma Brown",
  //       rating: 5,
  //       comment: "Breathtaking views and excellent seafood!",
  //       date: "2024-12-11",
  //       roomType: "deluxe",
  //     },
  //   ],
  // },
  // {
  //   id: 5,
  //   name: "Song Saa Private Island",
  //   location: "Koh Rong",
  //   mapEmbed:
  //     "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.7266777221726!2d103.25948707451703!3d10.755535559579839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3107c1610be23ed3%3A0xba40f7bb13f3a9eb!2sSong%20Saa%20Private%20Island!5e0!3m2!1skm!2skh!4v1751985357612!5m2!1skm!2skh",
  //   price: 1200,
  //   image:
  //     "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=500&h=300&fit=crop",
  //   images: [
  //     "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1563911302-a2463e0d10a2?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
  //   ],
  //   rating: 4.9,
  //   description:
  //     "Ultra-luxury private island resort with overwater villas and pristine beaches.",
  //   amenities: ["Private Beach", "Spa", "Water Sports", "Fine Dining", "WiFi"],
  //   rooms: {
  //     standard: { name: "Villa", price: 1200 },
  //     deluxe: { name: "Overwater Villa", price: 1800 },
  //     suite: { name: "Royal Villa", price: 2400 },
  //     presidential: { name: "Presidential Villa", price: 4000 },
  //   },
  //   reviews: [
  //     {
  //       id: 7,
  //       user: "Robert Taylor",
  //       rating: 5,
  //       comment: "Once in a lifetime experience!",
  //       date: "2024-12-09",
  //       roomType: "deluxe",
  //     },
  //   ],
  // },
  // {
  //   id: 6,
  //   name: "Jaya House River Park",
  //   location: "Phnom Penh",
  //   mapEmbed:
  //     "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3881.6813765819456!2d103.86186457455273!3d13.370077506017848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3110170a2cb4f7a7%3A0x64c7b21ef14588e0!2sJaya%20House%20River%20Park%20Hotel!5e0!3m2!1skm!2skh!4v1751985357612!5m2!1skm!2skh",
  //   price: 150,
  //   image:
  //     "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop",
  //   images: [
  //     "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1563911302-a2463e0d10a2?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop&q=80",
  //     "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&q=80",
  //   ],
  //   rating: 4.4,
  //   description:
  //     "Modern riverside hotel with contemporary design and excellent amenities.",
  //   amenities: ["River View", "Spa", "Restaurant", "Fitness Center", "WiFi"],
  //   rooms: {
  //     standard: { name: "Standard Room", price: 150 },
  //     deluxe: { name: "Deluxe Room", price: 200 },
  //     suite: { name: "Suite", price: 300 },
  //     presidential: { name: "Presidential Suite", price: 500 },
  //   },
  //   reviews: [
  //     {
  //       id: 8,
  //       user: "Lisa Chen",
  //       rating: 4,
  //       comment: "Great riverside location and modern facilities.",
  //       date: "2024-12-07",
  //       roomType: "deluxe",
  //     },
  //   ],
  // },
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

export function getRoomsByFilters(filters: {
  destination?: string;
  roomType?: string;
  checkin?: string;
  checkout?: string;
  beds?: string;
  guests?: string;
}) {
  // Mock data for demonstration
  const allRooms = [
    {
      id: 1,
      name: "Deluxe Phnom Penh",
      type: "deluxe",
      beds: "2",
      maxGuests: 4,
      price: 120,
      location: "Phnom Penh",
    },
    {
      id: 2,
      name: "Suite Siem Reap",
      type: "suite",
      beds: "3",
      maxGuests: 6,
      price: 200,
      location: "Siem Reap",
    },
    {
      id: 3,
      name: "Standard Kep",
      type: "standard",
      beds: "1",
      maxGuests: 2,
      price: 80,
      location: "Kep",
    },
    // Add more rooms as needed
  ];

  return allRooms.filter((room) => {
    if (
      filters.destination &&
      !room.location.toLowerCase().includes(filters.destination.toLowerCase())
    )
      return false;
    if (filters.roomType && room.type !== filters.roomType) return false;
    if (filters.beds && room.beds !== filters.beds) return false;
    if (filters.guests && room.maxGuests < Number(filters.guests)) return false;
    // checkin/checkout not used in mock
    return true;
  });
}
