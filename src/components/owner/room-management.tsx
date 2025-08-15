"use client";
const [isRoomDetailsOpen, setIsRoomDetailsOpen] = useState(false);
import type React from "react";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RoomFormDialog } from "./room-form-dialog";
import { useRouter } from "next/navigation";

// Add type for room and booking
interface Room {
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
  rating?: number; // <-- add this (optional number)
}
interface Booking {
  id: number;
  guestName: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  email: string;
  phone: string;
  roomId?: number;
}

export function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>(() => {
    const stored = localStorage.getItem("ownerRooms");
    const parsed = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((r: any) => ({
      ...r,
      // normalize rating to number and ensure other numeric fields are typed correctly
      rating: r?.rating != null && r.rating !== "" ? Number(r.rating) : 0,
      price: r?.price != null ? Number(r.price) : 0,
      capacity: r?.capacity != null ? Number(r.capacity) : 1,
    }));
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [currentRoom, setCurrentRoom] = useState<any>(null);
  const { toast } = useToast();
  const [isRoomManagementOpen, setIsRoomManagementOpen] = useState(false);
  const [roomFilters, setRoomFilters] = useState({
    type: "",
    floor: "",
    price: "",
    rating: "",
  });
  const [isRoomDetailsOpen, setIsRoomDetailsOpen] = useState(false);
  const router = useRouter();

  // Stats calculation
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(
    (room: Room) => room.status === "available"
  ).length;
  const occupiedRooms = rooms.filter(
    (room: Room) => room.status === "occupied"
  ).length;
  const maintenanceRooms = rooms.filter(
    (room: Room) => room.status === "maintenance"
  ).length;

  // Filter rooms based on search term
  const filteredRooms = rooms.filter(
    (room: Room) =>
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRoom = (formData: any) => {
    // Create new room with unique ID and timestamp
    const newRoom = {
      ...formData,
      id: Date.now(), // Ensure unique ID
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    // Get existing rooms from both storages
    const ownerRooms = JSON.parse(localStorage.getItem("ownerRooms") || "[]");
    const userRooms = JSON.parse(localStorage.getItem("userRooms") || "[]");

    // Add new room to both arrays
    const updatedOwnerRooms = [...ownerRooms, newRoom];
    const updatedUserRooms = [...userRooms, newRoom];

    // Save to both localStorage items
    localStorage.setItem("ownerRooms", JSON.stringify(updatedOwnerRooms));
    localStorage.setItem("userRooms", JSON.stringify(updatedUserRooms));

    // Update state with owner rooms
    setRooms(updatedOwnerRooms);
    setIsAddRoomOpen(false);

    toast({
      title: "Room Added",
      description: `Room ${formData.number} has been added successfully.`,
    });
  };

  const handleEditRoom = (formData: any) => {
    // Create updated room data
    const updatedRoom = {
      ...currentRoom,
      ...formData,
      id: currentRoom.id, // Ensure we keep the original ID
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    // Update rooms state
    const updatedRooms = rooms.map((room: Room) =>
      room.id === currentRoom.id ? updatedRoom : room
    );

    // Save to localStorage
    localStorage.setItem("ownerRooms", JSON.stringify(updatedRooms));
    localStorage.setItem("userRooms", JSON.stringify(updatedRooms));

    // Update state
    setRooms(updatedRooms);
    setIsEditRoomOpen(false);
    setCurrentRoom(null); // Clear current room

    toast({
      title: "Room Updated",
      description: `Room ${formData.number} has been updated successfully.`,
    });
  };

  const handleDeleteRoom = (id: number) => {
    // Load bookings from localStorage
    const bookings: Booking[] = JSON.parse(
      localStorage.getItem("bookings") || "[]"
    );
    // Find if any booking exists for this room (confirmed or pending)
    const hasActiveBooking = bookings.some(
      (booking: Booking) =>
        (booking.roomId === id ||
          booking.roomNumber == rooms.find((r: Room) => r.id === id)?.number) &&
        (booking.status === "confirmed" || booking.status === "pending")
    );
    if (hasActiveBooking) {
      toast({
        title: "Cannot Delete Room",
        description:
          "This room cannot be deleted because it has an active booking.",
        variant: "destructive",
      });
      return;
    }
    setRooms(rooms.filter((room: Room) => room.id !== id));
    toast({
      title: "Room Deleted",
      description: "The room has been deleted successfully.",
    });
  };

  const handleBulkUpdate = (status: string) => {
    setRooms(
      rooms.map((room: Room) =>
        selectedRooms.includes(room.id)
          ? {
              ...room,
              status,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : room
      )
    );
    setSelectedRooms([]);
    setIsBulkUpdateOpen(false);
    toast({
      title: "Rooms Updated",
      description: `${selectedRooms.length} rooms have been updated to ${status}.`,
    });
  };

  const toggleRoomSelection = (id: number) => {
    setSelectedRooms((prev) =>
      prev.includes(id) ? prev.filter((roomId) => roomId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Rooms</p>
                <h3 className="text-2xl font-bold mt-1">{totalRooms}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Available</p>
                <h3 className="text-2xl font-bold mt-1">{availableRooms}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Occupied</p>
                <h3 className="text-2xl font-bold mt-1">{occupiedRooms}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <XCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Maintenance</p>
                <h3 className="text-2xl font-bold mt-1">{maintenanceRooms}</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search rooms..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
            onClick={() => setIsBulkUpdateOpen(true)}
            disabled={selectedRooms.length === 0}
          >
            Bulk Update ({selectedRooms.length})
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => setIsAddRoomOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Room
          </Button>
        </div>
      </div>

      {/* Rooms Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRooms(rooms.map((room) => room.id));
                        } else {
                          setSelectedRooms([]);
                        }
                      }}
                      checked={selectedRooms.length === rooms.length}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left py-3 px-4">Room Number</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Capacity</th>
                  <th className="text-left py-3 px-4">Last Updated</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedRooms.includes(room.id)}
                        onChange={() => toggleRoomSelection(room.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="py-3 px-4 font-medium">{room.number}</td>
                    <td className="py-3 px-4 capitalize">{room.type}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          room.status === "available"
                            ? "success"
                            : room.status === "occupied"
                            ? "destructive"
                            : "warning"
                        }
                      >
                        {room.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">${room.price}</td>
                    <td className="py-3 px-4">{room.capacity} guests</td>
                    <td className="py-3 px-4">{room.lastUpdated}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            // Ensure all required fields are included when setting currentRoom
                            const roomToEdit = {
                              ...room,
                              services: Array.isArray(room.services)
                                ? room.services.join(", ")
                                : room.services || "",
                            };
                            setCurrentRoom(roomToEdit);
                            setIsEditRoomOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentRoom(room);
                            setIsRoomDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Room Dialog */}
      <RoomFormDialog
        isOpen={isAddRoomOpen}
        onClose={() => setIsAddRoomOpen(false)}
        onSubmit={handleAddRoom}
        title="Add New Room"
      />

      {/* Edit Room Dialog */}
      <RoomFormDialog
        isOpen={isEditRoomOpen}
        onClose={() => setIsEditRoomOpen(false)}
        onSubmit={handleEditRoom}
        title="Edit Room"
        initialData={currentRoom}
      />

      {/* Bulk Update Dialog */}
      <Dialog open={isBulkUpdateOpen} onOpenChange={setIsBulkUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Update Rooms</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select onValueChange={(value) => handleBulkUpdate(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-gray-500">
              This will update the status of {selectedRooms.length} selected
              rooms.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkUpdateOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Room Management Dialog */}
      <Dialog
        open={isRoomManagementOpen}
        onOpenChange={setIsRoomManagementOpen}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto w-full max-w-3xl">
          <DialogHeader>
            <DialogTitle>Room Management</DialogTitle>
          </DialogHeader>
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <Label>Type</Label>
              <select
                value={roomFilters.type}
                onChange={(e) =>
                  setRoomFilters((f) => ({ ...f, type: e.target.value }))
                }
                className="p-2 rounded border"
              >
                <option value="">All</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="deluxe">Deluxe</option>
              </select>
            </div>
            <div>
              <Label>Floor</Label>
              <input
                type="number"
                value={roomFilters.floor}
                onChange={(e) =>
                  setRoomFilters((f) => ({ ...f, floor: e.target.value }))
                }
                className="p-2 rounded border"
                placeholder="Any"
              />
            </div>
            <div>
              <Label>Price</Label>
              <select
                value={roomFilters.price}
                onChange={(e) =>
                  setRoomFilters((f) => ({ ...f, price: e.target.value }))
                }
                className="p-2 rounded border"
              >
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <Label>Rating</Label>
              <select
                value={roomFilters.rating}
                onChange={(e) =>
                  setRoomFilters((f) => ({ ...f, rating: e.target.value }))
                }
                className="p-2 rounded border"
              >
                <option value="">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          {/* Room List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms
              .filter((room) => {
                // Filtering logic
                if (roomFilters.type && room.type !== roomFilters.type)
                  return false;
                if (
                  roomFilters.floor &&
                  String(room.floor) !== roomFilters.floor
                )
                  return false;

                if (roomFilters.price) {
                  if (roomFilters.price === "low" && room.price > 100)
                    return false;
                  if (
                    roomFilters.price === "medium" &&
                    (room.price <= 100 || room.price > 300)
                  )
                    return false;
                  if (roomFilters.price === "high" && room.price <= 300)
                    return false;
                }

                if (roomFilters.rating) {
                  const r = Number(room.rating ?? 0); // normalize safely
                  if (roomFilters.rating === "high" && r < 4) return false;
                  if (roomFilters.rating === "medium" && (r < 2.5 || r >= 4))
                    return false;
                  if (roomFilters.rating === "low" && r >= 2.5) return false;
                }

                return true;
              })
              .map((room) => (
                <Card key={room.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold">
                          {room.number} - {room.type}
                        </div>
                        <div className="text-sm text-gray-500">
                          Floor: {room.floor}
                        </div>
                        <div className="text-sm text-gray-500">
                          Price: ${room.price}
                        </div>
                        <div className="text-sm text-gray-500">
                          Rating: {room.rating || "N/A"}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/owner/rooms/${room.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Room Details Dialog */}
      <Dialog open={isRoomDetailsOpen} onOpenChange={setIsRoomDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Room Details</DialogTitle>
          </DialogHeader>
          {currentRoom && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Room Number</Label>
                  <p className="mt-1">{currentRoom.number}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <p className="mt-1">{currentRoom.type}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className="mt-1">{currentRoom.status}</p>
                </div>
                <div>
                  <Label>Floor</Label>
                  <p className="mt-1">{currentRoom.floor}</p>
                </div>
                <div>
                  <Label>Price</Label>
                  <p className="mt-1">${currentRoom.price}</p>
                </div>
                <div>
                  <Label>Capacity</Label>
                  <p className="mt-1">{currentRoom.capacity} persons</p>
                </div>
              </div>

              <div>
                <Label>Hotel Name</Label>
                <p className="mt-1">{currentRoom.hotelName}</p>
              </div>

              <div>
                <Label>Location</Label>
                <p className="mt-1">{currentRoom.location}</p>
              </div>

              <div>
                <Label>Description</Label>
                <p className="mt-1">{currentRoom.description}</p>
              </div>

              <div>
                <Label>Services</Label>
                <p className="mt-1">
                  {Array.isArray(currentRoom.services)
                    ? currentRoom.services.join(", ")
                    : currentRoom.services}
                </p>
              </div>

              {currentRoom.photo && (
                <div>
                  <Label>Room Photo</Label>
                  <img
                    src={currentRoom.photo}
                    alt={`Room ${currentRoom.number}`}
                    className="mt-2 rounded-md w-full max-h-60 object-cover"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsRoomDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
