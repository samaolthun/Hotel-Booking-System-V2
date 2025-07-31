"use client";

import { useState } from "react";
import {
  Hotel,
  Users,
  DollarSign,
  Calendar,
  Star,
  ArrowUp,
  ArrowDown,
  BarChart2,
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

export function OwnerDashboard() {
  const [timeRange, setTimeRange] = useState("week");
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isRoomManagementOpen, setIsRoomManagementOpen] = useState(false);
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
  const { toast } = useToast();
  const router = useRouter();

  // Simulate fetching data from localStorage
  const userRooms =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userRooms") || "[]")
      : [];
  const bookings =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("bookings") || "[]")
      : [];

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

  const handleViewRoomDetails = () => {
    router.push("/owner/rooms"); // Change to your actual route
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        className="mb-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
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
              {bookings
                .slice(-4)
                .reverse()
                .map((booking, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">
                        {booking.guestName || booking.guest || "Unknown Guest"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.roomType || booking.room} • {booking.checkin} -{" "}
                        {booking.checkout}
                      </p>
                    </div>
                    <span className="font-semibold">
                      ${booking.amount || booking.price || "N/A"}
                    </span>
                  </div>
                ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 bg-transparent"
              onClick={() => router.push("/user/bookings")}
            >
              View All Bookings
            </Button>
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
            <Button
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
            </Button>
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
            {/* <div>
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
            </div> */}
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
            {userRooms
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
                  if (roomFilters.rating === "high" && room.rating < 4)
                    return false;
                  if (
                    roomFilters.rating === "medium" &&
                    (room.rating < 2.5 || room.rating >= 4)
                  )
                    return false;
                  if (roomFilters.rating === "low" && room.rating >= 2.5)
                    return false;
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
    </div>
  );
}
