import React from "react";

export function RoomCard({ room }: { room: any }) {
  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      <h3 className="text-lg font-bold mb-2">{room.name || "Room"}</h3>
      <p className="mb-1">Type: {room.type || "N/A"}</p>
      <p className="mb-1">Beds: {room.beds || "N/A"}</p>
      <p className="mb-1">Guests: {room.maxGuests || "N/A"}</p>
      <p className="mb-1">Price: ${room.price || "N/A"}</p>
      <button className="mt-2 px-4 py-2 bg-primary text-white rounded">
        Book Now
      </button>
    </div>
  );
}
