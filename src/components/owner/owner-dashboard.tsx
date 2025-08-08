"use client";

import { useState, useEffect } from "react";
import {
  Hotel,
  Users,
  DollarSign,
  Calendar,
  Star,
  ArrowUp,
  ArrowDown,
  BarChart2,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Progress } from "@/src/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { useToast } from "@/src/hooks/use-toast";
import { useRouter } from "next/navigation";
import { RoomFormDialog } from "./room-form-dialog";

export function OwnerDashboard() {
  const [timeRange, setTimeRange] = useState("week");
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isRoomManagementOpen, setIsRoomManagementOpen] = useState(false);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [isRoomDetailsOpen, setIsRoomDetailsOpen] = useState(false);
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
  const [formData, setFormData] = useState({
    number: "",
    type: "single",
    status: "available",
    floor: "",
    hotelName: "",
    location: "",
    mapEmbed: "",
    price: 75,
    capacity: 1,
    description: "",
    services: [],
    amenities: [],
    photo: "",
  });
  const [roomFilters, setRoomFilters] = useState({
    type: "",
    floor: "",
    price: "",
    rating: "",
  });
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const { toast } = useToast();
  const router = useRouter();

  // Get rooms from localStorage (these are the rooms shown in Hotels page)
  const userRooms =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userRooms") || "[]")
      : [];

  // First, update how you get the bookings data
  const [bookings, setBookings] = useState(() => {
    if (typeof window !== "undefined") {
      const storedBookings = localStorage.getItem("bookings");
      if (storedBookings) {
        return JSON.parse(storedBookings).sort(
          (a, b) =>
            new Date(b.bookingDate || b.date) -
            new Date(a.bookingDate || a.date)
        );
      }
    }
    return [];
  });

  // Validate booking data
  const validateBookingData = () => {
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    console.log("Current Bookings:", bookings);

    // Validate each booking
    bookings.forEach((booking, index) => {
      const isValid =
        booking.email &&
        booking.phone &&
        booking.roomNumber &&
        booking.checkIn &&
        booking.checkOut &&
        typeof booking.totalAmount === "number" &&
        (!booking.status ||
          ["confirmed", "pending", "cancelled"].includes(booking.status));

      console.log(`Booking ${index + 1}:`, {
        isValid,
        missingFields: {
          fullName: !booking.fullName && !booking.name,
          email: !booking.email,
          phone: !booking.phone,
          roomNumber: !booking.roomNumber,
          checkIn: !booking.checkIn,
          checkOut: !booking.checkOut,
          status:
            booking.status &&
            !["confirmed", "pending", "cancelled"].includes(booking.status),
          totalAmount: typeof booking.totalAmount !== "number",
        },
      });
    });
  };

  // Run validation on component mount
  useEffect(() => {
    validateBookingData();
  }, []);

  // Calculate stats
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalRooms = userRooms.length;
  const occupiedRooms = userRooms.filter(
    (r: any) => r.status === "occupied"
  ).length;
  const roomOccupancy = totalRooms
    ? Math.round((occupiedRooms / totalRooms) * 100)
    : 0;
  const averageRating =
    userRooms.length > 0
      ? (
          userRooms.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) /
          userRooms.length
        ).toFixed(1)
      : "N/A";

  // const hotelOptions = [
  //   { name: "Sokha Angkor Resort (Siem Reap)", location: "Siem Reap" },
  //   { name: "Sokha Beach Resort (Sihanoukville)", location: "Sihanoukville" },
  //   { name: "Sokha Club Hotel (Phnom Penh)", location: "Phnom Penh" },
  //   { name: "Thansur Bokor Highland Resort (Kampot)", location: "Kampot" },
  // ];
  const serviceOptions = [
    "Picked up (e.g., airport pickup or shuttle service)",
    "Parking place (valet parking)",
  ];
  const amenitiesOptions = [
    "Spa",
    "Swimming pool",
    "Breakfast",
    "WIFI",
    "Gym",
    "Mini-fridge",
    "Parking place (self-parking)",
  ];

  const handleChange = (field: string, value: any) => {
    if (field === "hotelName") {
      const hotel = hotelOptions.find((h) => h.name === value);
      setFormData((prev) => ({
        ...prev,
        hotelName: value,
        location: hotel ? hotel.location : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleMultiSelectChange = (field: string, value: string) => {
    setFormData((prev) => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const rooms = JSON.parse(localStorage.getItem("ownerRooms") || "[]");
    const userRooms = JSON.parse(localStorage.getItem("userRooms") || "[]");
    const newRoom = {
      id: Date.now(),
      ...formData,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    localStorage.setItem("ownerRooms", JSON.stringify([...rooms, newRoom]));
    localStorage.setItem("userRooms", JSON.stringify([...userRooms, newRoom]));
    setIsAddRoomOpen(false);
    setFormData({
      number: "",
      type: "single",
      status: "available",
      floor: "",
      hotelName: "",
      location: "",
      mapEmbed: "",
      price: 75,
      capacity: 1,
      description: "",
      services: [],
      amenities: [],
      photo: "",
    });
    toast({
      title: "Room Added",
      description: `Room ${formData.number} has been added successfully.`,
    });
  };

  // Handle edit room
  const handleEditRoom = (room) => {
    // Set the current room and populate the form data with room information
    setCurrentRoom(room);
    setFormData({
      number: room.number || "",
      type: room.type || "single",
      status: room.status || "available",
      floor: room.floor || "",
      hotelName: room.hotelName || "",
      location: room.location || "",
      mapEmbed: room.mapEmbed || "",
      price: room.price || 75,
      capacity: room.capacity || 1,
      description: room.description || "",
      services: room.services || [],
      amenities: room.amenities || [],
      photo: room.photo || "",
    });
    setIsEditRoomOpen(true);
  };

  const handleEditRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rooms = JSON.parse(localStorage.getItem("ownerRooms") || "[]");
    const userRooms = JSON.parse(localStorage.getItem("userRooms") || "[]");

    // Create updated room object
    const updatedRoom = {
      ...currentRoom,
      ...formData,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    // Update both ownerRooms and userRooms
    const updatedRooms = rooms.map((room) =>
      room.id === currentRoom.id ? updatedRoom : room
    );
    const updatedUserRooms = userRooms.map((room) =>
      room.id === currentRoom.id ? updatedRoom : room
    );

    // Save to localStorage
    localStorage.setItem("ownerRooms", JSON.stringify(updatedRooms));
    localStorage.setItem("userRooms", JSON.stringify(updatedUserRooms));

    // Reset form and close dialog
    setIsEditRoomOpen(false);
    setFormData({
      number: "",
      type: "single",
      status: "available",
      floor: "",
      hotelName: "",
      location: "",
      mapEmbed: "",
      price: 75,
      capacity: 1,
      description: "",
      services: [],
      amenities: [],
      photo: "",
    });

    // Show success message
    toast({
      title: "Room Updated",
      description: `Room ${updatedRoom.number} has been updated successfully.`,
    });
  };

  const handleViewRoomDetails = (room) => {
    setCurrentRoom(room);
    setIsRoomDetailsOpen(true);
  };

  // Handle remove room
  const handleRemoveRoom = (roomId) => {
    if (window.confirm("Are you sure you want to remove this room?")) {
      const updatedRooms = userRooms.filter((room) => room.id !== roomId);
      localStorage.setItem("userRooms", JSON.stringify(updatedRooms));
      toast({
        title: "Room Removed",
        description: "The room has been removed successfully.",
      });
    }
  };

  // View booking details
  const handleViewBookingDetails = (booking) => {
    setCurrentBooking(booking);
    setIsBookingDetailsOpen(true);
  };

  // Test function to add a properly structured booking
  const addTestBooking = () => {
    const newBooking = {
      fullName: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      roomNumber: "101",
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 86400000).toISOString(),
      nights: 1,
      status: "pending",
      totalAmount: 100,
      bookingDate: new Date().toISOString(),
    };

    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    bookings.push(newBooking);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    console.log("Test booking added:", newBooking);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        className="mx-4 mb-2 px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        onClick={() => router.back()}
      >
        ← Back
      </button>
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Bookings
                </p>
                <h3 className="text-2xl font-bold mt-1">{totalBookings}</h3>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  12% from last month
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Revenue
                </p>
                <h3 className="text-2xl font-bold mt-1">${totalRevenue}</h3>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  8% from last month
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Room Occupancy
                </p>
                <h3 className="text-2xl font-bold mt-1">{roomOccupancy}%</h3>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  3% from last month
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Hotel className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Average Rating
                </p>
                <h3 className="text-2xl font-bold mt-1">{averageRating}</h3>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  0.2 from last month
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Track your revenue performance over time
            </CardDescription>
          </div>
          <Tabs defaultValue={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-end gap-2">
            {/* Simulated chart bars */}
            {Array.from({ length: 12 }).map((_, i) => {
              const height = Math.floor(Math.random() * 70) + 30;
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-indigo-500 rounded-t-md"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs mt-2 text-gray-500">
                    {timeRange === "week"
                      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7]
                      : timeRange === "month"
                      ? `W${i + 1}`
                      : `${i + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings and Room Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest booking activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.length > 0 ? (
                bookings.slice(0, 4).map((booking, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {booking.fullName || booking.name || "Guest"}
                        </p>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {booking.status || "pending"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Room {booking.roomNumber} • {booking.nights || 1}{" "}
                        night(s)
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewBookingDetails(booking)}
                    >
                      View Details
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No bookings found
                </p>
              )}
            </div>
            {bookings.length > 0 && (
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.push("/admin/bookings")}
              >
                View All Bookings
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Status</CardTitle>
            <CardDescription>Current occupancy by room type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Standard Rooms</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Deluxe Rooms</span>
                  <span className="text-sm font-medium">72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Suites</span>
                  <span className="text-sm font-medium">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">
                    Presidential Suites
                  </span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 bg-transparent"
              onClick={handleViewRoomDetails}
            >
              View Room Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto flex flex-col items-center py-4 px-2 bg-transparent"
              onClick={() => setIsAddRoomOpen(true)}
            >
              <Hotel className="h-6 w-6 mb-2" />
              <span>Add Room</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex flex-col items-center py-4 px-2 bg-transparent"
              onClick={() => setIsRoomManagementOpen(true)}
            >
              <Calendar className="h-6 w-6 mb-2" />
              <span>Room Management</span>
            </Button>
            {/* <Button
              variant="outline"
              className="h-auto flex flex-col items-center py-4 px-2 bg-transparent"
            >
              <Users className="h-6 w-6 mb-2" />
              <span>Manage Staff</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex flex-col items-center py-4 px-2 bg-transparent"
            >
              <BarChart2 className="h-6 w-6 mb-2" />
              <span>View Reports</span>
            </Button> */}
          </div>
        </CardContent>
      </Card>
      <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddRoom} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  value={formData.number}
                  onChange={(e) => handleChange("number", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomStatus">Room Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomFloor">Room Floor</Label>
                <Input
                  id="roomFloor"
                  type="number"
                  value={formData.floor}
                  onChange={(e) => handleChange("floor", e.target.value)}
                  required
                />
              </div>
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="hotelName">Hotel Name</Label>
              <Select
                value={formData.hotelName}
                onValueChange={(value) => handleChange("hotelName", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hotelOptions.map((hotel) => (
                    <SelectItem key={hotel.name} value={hotel.name}>
                      {hotel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
            {/* <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                readOnly
                required
              />
            </div> */}
            {/* <div className="space-y-2">
              <Label htmlFor="mapEmbed">
                Location Map (Google Maps Embed URL)
              </Label>
              <Input
                id="mapEmbed"
                value={formData.mapEmbed}
                onChange={(e) => handleChange("mapEmbed", e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                required
              />
              <p className="text-xs text-gray-500">
                To get the embed URL: 1) Go to Google Maps, 2) Search for your
                location, 3) Click "Share", 4) Select "Embed a map", 5) Copy the
                URL
              </p>
            </div> */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomPrice">Price per Night</Label>
                <Input
                  id="roomPrice"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    handleChange("price", Number(e.target.value))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomCapacity">Capacity</Label>
                <Input
                  id="roomCapacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    handleChange("capacity", Number(e.target.value))
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomDescription">Description</Label>
              <Textarea
                id="roomDescription"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Room description and amenities..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomServices">Services</Label>
              <div className="flex flex-wrap gap-2">
                {serviceOptions.map((service) => (
                  <Button
                    key={service}
                    type="button"
                    variant={
                      formData.services.includes(service)
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleMultiSelectChange("services", service)}
                    className="text-xs"
                  >
                    {service}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomAmenities">Amenities</Label>
              <div className="flex flex-wrap gap-2">
                {amenitiesOptions.map((amenity) => (
                  <Button
                    key={amenity}
                    type="button"
                    variant={
                      formData.amenities.includes(amenity)
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleMultiSelectChange("amenities", amenity)
                    }
                    className="text-xs"
                  >
                    {amenity}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomPhoto">Room Photo</Label>
              <Input
                id="roomPhoto"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              {formData.photo && (
                <img
                  src={formData.photo}
                  alt="Preview"
                  className="mt-2 rounded w-32 h-24 object-cover border"
                />
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsAddRoomOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Room</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isRoomManagementOpen}
        onOpenChange={setIsRoomManagementOpen}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto w-full max-w-4xl">
          <DialogHeader>
            <DialogTitle>Room Management</DialogTitle>
            <DialogDescription>Manage all hotel rooms</DialogDescription>
          </DialogHeader>

          {/* Room List */}
          <div className="grid gap-4">
            {userRooms.map((room) => (
              <Card key={room.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    {room.photo && (
                      <img
                        src={room.photo}
                        alt={room.type}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-bold">{room.type}</h3>
                      <p className="text-sm text-gray-500">
                        Room {room.number}
                      </p>
                      <p className="text-sm text-gray-500">
                        Floor {room.floor}
                      </p>
                      <p className="font-medium">${room.price}/night</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditRoom(room)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRoomDetails(room)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Room Detail
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveRoom(room.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <RoomFormDialog
        isOpen={isEditRoomOpen}
        onClose={() => setIsEditRoomOpen(false)}
        onSubmit={handleEditRoomSubmit}
        title="Edit Room"
        initialData={currentRoom}
      />

      <Dialog open={isRoomDetailsOpen} onOpenChange={setIsRoomDetailsOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
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
                  <p className="mt-1 capitalize">{currentRoom.type}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className="mt-1 capitalize">{currentRoom.status}</p>
                </div>
                <div>
                  <Label>Floor</Label>
                  <p className="mt-1">{currentRoom.floor}</p>
                </div>
                <div>
                  <Label>Price</Label>
                  <p className="mt-1">${currentRoom.price}/night</p>
                </div>
                <div>
                  <Label>Capacity</Label>
                  <p className="mt-1">{currentRoom.capacity} persons</p>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <p className="mt-1">{currentRoom.description}</p>
              </div>

              {currentRoom.services && currentRoom.services.length > 0 && (
                <div>
                  <Label>Services</Label>
                  <p className="mt-1">
                    {Array.isArray(currentRoom.services)
                      ? currentRoom.services.join(", ")
                      : currentRoom.services}
                  </p>
                </div>
              )}

              {currentRoom.amenities && currentRoom.amenities.length > 0 && (
                <div>
                  <Label>Amenities</Label>
                  <p className="mt-1">
                    {Array.isArray(currentRoom.amenities)
                      ? currentRoom.amenities.join(", ")
                      : currentRoom.amenities}
                  </p>
                </div>
              )}

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

      <Dialog
        open={isBookingDetailsOpen}
        onOpenChange={setIsBookingDetailsOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {currentBooking && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Status</h3>
                <span
                  className={`px-2 py-1 text-sm rounded-full ${
                    currentBooking.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : currentBooking.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {currentBooking.status || "pending"}
                </span>
              </div>

              <div className="grid gap-3">
                <div>
                  <Label>Guest Information</Label>
                  <p className="font-medium">
                    {currentBooking.fullName || currentBooking.name}
                  </p>
                  <p className="text-sm">Email: {currentBooking.email}</p>
                  <p className="text-sm">Phone: {currentBooking.phone}</p>
                </div>

                <div>
                  <Label>Booking Details</Label>
                  <p className="text-sm">
                    Room Number: {currentBooking.roomNumber}
                  </p>
                  <p className="text-sm">
                    Number of Nights: {currentBooking.nights || 1}
                  </p>
                  <p className="text-sm">
                    Check-in:{" "}
                    {new Date(currentBooking.checkIn).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    Check-out:{" "}
                    {new Date(currentBooking.checkOut).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <Label>Payment Information</Label>
                  <p className="font-semibold">
                    Total Amount: ${currentBooking.totalAmount}
                  </p>
                  <p className="text-xs text-gray-500">
                    Booked on:{" "}
                    {new Date(
                      currentBooking.bookingDate || currentBooking.date
                    ).toLocaleDateString()}
                  </p>
                </div>

                {currentBooking.specialRequests && (
                  <div>
                    <Label>Special Requests</Label>
                    <p className="text-sm">{currentBooking.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsBookingDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Booking Button - For Development Only */}
      {/* <div className="fixed bottom-4 right-4">
        <Button onClick={addTestBooking}>Add Test Booking</Button>
      </div> */}
    </div>
  );
}
