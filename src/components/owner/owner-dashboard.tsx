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
  Plus,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { RoomFormDialog } from "./room-form-dialog";
import { Badge } from "@/components/ui/badge";

// Add this interface near the top of the file, after imports
interface FormData {
  number: string;
  type: string;
  status: string;
  floor: string;
  hotelName: string;
  location: string;
  mapEmbed?: string;
  price: number;
  capacity: number;
  description: string;
  services: string[];
  amenities: string[];
  photo: string | File;
}

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
    services: [] as string[],
    amenities: [] as string[],
    photo: "",
  });
  const [roomFilters, setRoomFilters] = useState({
    number: "",
    floor: "",
    price: "",
    type: "",
    status: "",
  });
  const [bookingFilters, setBookingFilters] = useState({
    userName: "",
    roomNumber: "",
    startDate: "",
    endDate: "",
  });
  const [currentRoom, setCurrentRoom] = useState<any>(null);
  const [currentBooking, setCurrentBooking] = useState<any>(null);
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
          (a: any, b: any) =>
            new Date(b.bookingDate || b.date).getTime() -
            new Date(a.bookingDate || a.date).getTime()
        );
      }
    }
    return [];
  });

  // Calculate statistics
  const totalRooms = userRooms.length;
  const availableRooms = userRooms.filter(
    (room: any) => room.status === "available"
  ).length;
  const occupiedRooms = userRooms.filter(
    (room: any) => room.status === "occupied"
  ).length;
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(
    (booking: any) => booking.status === "confirmed"
  ).length;
  const totalRevenue = bookings
    .filter((booking: any) => booking.status === "confirmed")
    .reduce((sum: number, booking: any) => sum + (booking.totalPrice || 0), 0);

  // Validate booking data before processing
  const validateBookingData = (data: any) => {
    const requiredFields = [
      "number",
      "type",
      "status",
      "floor",
      "price",
      "capacity",
      "description",
    ];

    const missingFields = requiredFields.filter(
      (field) => !data[field] || data[field] === ""
    );

    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return false;
    }

    if (data.price <= 0) {
      toast({
        title: "Invalid price",
        description: "Price must be greater than 0",
        variant: "destructive",
      });
      return false;
    }

    if (data.capacity <= 0) {
      toast({
        title: "Invalid capacity",
        description: "Capacity must be greater than 0",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Add this function after other handlers
  const handleFilterChange = (field: string, value: string) => {
    setRoomFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add this function to filter rooms
  const filteredRooms = userRooms.filter((room: any) => {
    const matchesNumber =
      !roomFilters.number ||
      room.number.toLowerCase().includes(roomFilters.number.toLowerCase());
    const matchesFloor =
      !roomFilters.floor || room.floor.toString() === roomFilters.floor;
    const matchesPrice =
      !roomFilters.price || room.price <= parseInt(roomFilters.price);
    const matchesType =
      !roomFilters.type ||
      room.type.toLowerCase() === roomFilters.type.toLowerCase();
    const matchesStatus =
      !roomFilters.status ||
      room.status.toLowerCase() === roomFilters.status.toLowerCase();

    return (
      matchesNumber &&
      matchesFloor &&
      matchesPrice &&
      matchesType &&
      matchesStatus
    );
  });
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        Array.isArray(prev[field as keyof typeof prev]) &&
        (prev[field as keyof typeof prev] as string[]).includes(value)
          ? (prev[field as keyof typeof prev] as string[]).filter(
              (item: string) => item !== value
            )
          : [
              ...((Array.isArray(prev[field as keyof typeof prev])
                ? prev[field as keyof typeof prev]
                : []) as string[]),
              value,
            ],
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          photo: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add this function to handle file to base64 conversion
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Update the handleAddRoom function
  const handleAddRoom = async (formData: FormData) => {
    if (!validateBookingData(formData)) return;

    // formData.photo should already be a base64 string from the dialog
    console.log(
      "handleAddRoom received formData.photo (length):",
      formData.photo ? String(formData.photo).slice(0, 40) : "EMPTY"
    );

    const photoUrl =
      typeof formData.photo === "string" && formData.photo
        ? formData.photo
        : "/placeholder.jpg";

    const newRoom = {
      id: Date.now(),
      ...formData,
      photo: photoUrl,
      images: [photoUrl],
      createdAt: new Date().toISOString(),
      rating: 0,
      reviews: [], // ensure reviews exists
    };

    // Save rooms (admin/user)
    const existingRooms = JSON.parse(localStorage.getItem("userRooms") || "[]");
    const updatedRooms = [...existingRooms, newRoom];
    localStorage.setItem("userRooms", JSON.stringify(updatedRooms));

    // Also ensure a 'hotels' list used by user listing has an entry with images/image
    const hotels = JSON.parse(localStorage.getItem("hotels") || "[]");
    const hotelEntry = {
      id: newRoom.id,
      name: newRoom.hotelName || `Room ${newRoom.number}`,
      image: photoUrl,
      images: [photoUrl],
      rating: newRoom.rating ?? 0,
      reviews: newRoom.reviews ?? [], // ensure reviews exists
      // ...other fields...
    };
    const idx = hotels.findIndex((h: any) => h.id === hotelEntry.id);
    if (idx >= 0) hotels[idx] = { ...hotels[idx], ...hotelEntry };
    else hotels.push(hotelEntry);
    localStorage.setItem("hotels", JSON.stringify(hotels));

    console.log("SAVED newRoom.photo preview:", photoUrl.slice(0, 40));

    toast({
      title: "Room added successfully!",
      description: "Your room is now available for booking.",
    });

    setIsAddRoomOpen(false);
    window.location.reload();
  };

  const handleEditRoom = (room: any) => {
    const roomData = {
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
      services: Array.isArray(room.services) ? room.services : [],
      amenities: Array.isArray(room.amenities) ? room.amenities : [],
      photo: room.photo || "",
    };

    setCurrentRoom(room);
    setFormData(roomData);
    setIsEditRoomOpen(true);
  };

  const handleEditRoomSubmit = (formData: FormData) => {
    if (!validateBookingData(formData)) {
      return;
    }

    const updatedRooms = userRooms.map((room: any) =>
      room.id === currentRoom.id
        ? {
            ...room,
            ...formData,
            services: Array.isArray(formData.services)
              ? formData.services
              : [formData.services].filter(Boolean),
            amenities: Array.isArray(formData.amenities)
              ? formData.amenities
              : [formData.amenities].filter(Boolean),
            updatedAt: new Date().toISOString(),
          }
        : room
    );

    localStorage.setItem("userRooms", JSON.stringify(updatedRooms));

    toast({
      title: "Room updated successfully!",
      description: "Your room information has been updated.",
    });

    setIsEditRoomOpen(false);
    setCurrentRoom(null);

    // Refresh the page to show the updated room
    window.location.reload();
  };

  const handleViewRoomDetails = (room: any) => {
    setCurrentRoom(room);
    setIsRoomDetailsOpen(true);
  };

  const handleRemoveRoom = (roomId: number) => {
    if (confirm("Are you sure you want to remove this room?")) {
      const updatedRooms = userRooms.filter((room: any) => room.id !== roomId);
      localStorage.setItem("userRooms", JSON.stringify(updatedRooms));

      toast({
        title: "Room removed successfully!",
        description: "The room has been removed from your listings.",
      });

      // Refresh the page to show the updated room list
      window.location.reload();
    }
  };

  const handleViewBookingDetails = (booking: any) => {
    setCurrentBooking(booking);
    setIsBookingDetailsOpen(true);
  };

  // Add test booking for demonstration
  const addTestBooking = () => {
    const testBooking = {
      id: Date.now(),
      userId: 1,
      hotelId: 1,
      hotelName: "Test Hotel",
      hotelImage: "/placeholder.jpg",
      checkinDate: "2024-12-25",
      checkoutDate: "2024-12-27",
      guests: 2,
      roomType: "standard",
      nights: 2,
      totalPrice: 200,
      status: "confirmed" as const,
      bookingDate: new Date().toISOString(),
    };

    const updatedBookings = [...bookings, testBooking];
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

    toast({
      title: "Test booking added!",
      description: "A sample booking has been added for demonstration.",
    });
  };

  // Get recent bookings
  const recentBookings = bookings.slice(0, 5);

  // Add this filtering function after other functions
  const filteredBookings = bookings.filter((booking: any) => {
    const matchesUserName =
      !bookingFilters.userName ||
      booking.userName
        ?.toLowerCase()
        .includes(bookingFilters.userName.toLowerCase());
    const matchesRoomNumber =
      !bookingFilters.roomNumber ||
      booking.roomNumber
        ?.toLowerCase()
        .includes(bookingFilters.roomNumber.toLowerCase());
    const matchesDateRange =
      (!bookingFilters.startDate ||
        new Date(booking.checkinDate) >= new Date(bookingFilters.startDate)) &&
      (!bookingFilters.endDate ||
        new Date(booking.checkoutDate) <= new Date(bookingFilters.endDate));

    return matchesUserName && matchesRoomNumber && matchesDateRange;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          className="flex items-center text-muted-foreground hover:text-primary"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Owner Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your hotel rooms and bookings
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsAddRoomOpen(true)}
              className="bg-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Room
            </Button>
            <Button variant="outline" onClick={addTestBooking}>
              Add Test Booking
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRooms}</div>
            <p className="text-xs text-muted-foreground">
              {availableRooms} available, {occupiedRooms} occupied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {confirmedBookings} confirmed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              From confirmed bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userRooms.length > 0
                ? (
                    userRooms.reduce(
                      (sum: number, room: any) => sum + (room.rating || 0),
                      0
                    ) / userRooms.length
                  ).toFixed(1)
                : "0.0"}
            </div>
            <p className="text-xs text-muted-foreground">Across all rooms</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rooms">Room Management</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest booking activities</CardDescription>
            </CardHeader>
            <CardContent>
              {recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.hotelName}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.checkinDate} - {booking.checkoutDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${booking.totalPrice}</p>
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : booking.status === "cancelled"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No bookings yet</p>
                  <Button onClick={addTestBooking} className="mt-2">
                    Add Test Booking
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rooms Tab */}
        <TabsContent value="rooms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Rooms</CardTitle>
              <CardDescription>
                Manage your hotel rooms and listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filter Section */}
              <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Room Number</Label>
                  <Input
                    id="roomNumber"
                    placeholder="Search room number"
                    value={roomFilters.number}
                    onChange={(e) =>
                      handleFilterChange("number", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    placeholder="Filter by floor"
                    value={roomFilters.floor}
                    onChange={(e) =>
                      handleFilterChange("floor", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Max Price</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Max price"
                    value={roomFilters.price}
                    onChange={(e) =>
                      handleFilterChange("price", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Room Type</Label>
                  <Select
                    value={roomFilters.type}
                    onValueChange={(value) => handleFilterChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={roomFilters.status}
                    onValueChange={(value) =>
                      handleFilterChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Room List - Update to use filteredRooms instead of userRooms */}
              {filteredRooms.length > 0 ? (
                <div className="space-y-4">
                  {filteredRooms.map((room: any) => (
                    <div
                      key={room.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        {room.photo && (
                          <img
                            src={room.photo}
                            alt={room.hotelName}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="font-medium">{room.hotelName}</p>
                          <p className="text-sm text-muted-foreground">
                            Room {room.number} • {room.type} • ${room.price}
                            /night
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {room.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewRoomDetails(room)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRoom(room)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveRoom(room.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No rooms match your filters
                  </p>
                  <Button
                    onClick={() =>
                      setRoomFilters({
                        number: "",
                        floor: "",
                        price: "",
                        type: "",
                        status: "",
                      })
                    }
                    className="mt-2"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>View and manage all bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Booking Filters */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Guest Name</Label>
                  <Input
                    id="userName"
                    placeholder="Search by guest name"
                    value={bookingFilters.userName}
                    onChange={(e) =>
                      setBookingFilters((prev) => ({
                        ...prev,
                        userName: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Room Number</Label>
                  <Input
                    id="roomNumber"
                    placeholder="Search by room number"
                    value={bookingFilters.roomNumber}
                    onChange={(e) =>
                      setBookingFilters((prev) => ({
                        ...prev,
                        roomNumber: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Check-in Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={bookingFilters.startDate}
                    onChange={(e) =>
                      setBookingFilters((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Check-out Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={bookingFilters.endDate}
                    onChange={(e) =>
                      setBookingFilters((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Bookings List - Update to use filteredBookings */}
              {filteredBookings.length > 0 ? (
                <div className="space-y-4">
                  {filteredBookings.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.hotelName}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.checkinDate} - {booking.checkoutDate}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.guests} guests • {booking.roomType} room
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${booking.totalPrice}</p>
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : booking.status === "cancelled"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {booking.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleViewBookingDetails(booking)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No bookings match your filters
                  </p>
                  <Button
                    onClick={() =>
                      setBookingFilters({
                        userName: "",
                        roomNumber: "",
                        startDate: "",
                        endDate: "",
                      })
                    }
                    className="mt-2"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
        onClose={() => {
          setIsEditRoomOpen(false);
          setCurrentRoom(null);
        }}
        onSubmit={handleEditRoomSubmit}
        title="Edit Room"
        initialData={currentRoom}
      />

      {/* Room Details Dialog */}
      <Dialog open={isRoomDetailsOpen} onOpenChange={setIsRoomDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Room Details</DialogTitle>
          </DialogHeader>
          {currentRoom && (
            <div className="space-y-4">
              {currentRoom.photo && (
                <img
                  src={currentRoom.photo}
                  alt={currentRoom.hotelName}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                {/* <div>
                  <Label className="font-medium">Hotel Name</Label>
                  <p>{currentRoom.hotelName}</p>
                </div> */}
                <div>
                  <Label className="font-medium">Room Number</Label>
                  <p>{currentRoom.number}</p>
                </div>
                <div>
                  <Label className="font-medium">Type</Label>
                  <p className="capitalize">{currentRoom.type}</p>
                </div>
                <div>
                  <Label className="font-medium">Price</Label>
                  <p>${currentRoom.price}/night</p>
                </div>
                <div>
                  <Label className="font-medium">Capacity</Label>
                  <p>{currentRoom.capacity} guests</p>
                </div>
                <div>
                  <Label className="font-medium">Status</Label>
                  <Badge
                    variant={
                      currentRoom.status === "available"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {currentRoom.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="font-medium">Description</Label>
                <p>{currentRoom.description}</p>
              </div>
              {/* <div>
                <Label className="font-medium">Location</Label>
                <p>{currentRoom.location}</p>
              </div> */}
              {currentRoom.services && currentRoom.services.length > 0 && (
                <div>
                  <Label className="font-medium">Services</Label>
                  <div className="flex flex-wrap gap-2">
                    {currentRoom.services.map(
                      (service: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {service}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Details Dialog */}
      <Dialog
        open={isBookingDetailsOpen}
        onOpenChange={setIsBookingDetailsOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {currentBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Hotel Name</Label>
                  <p>{currentBooking.hotelName}</p>
                </div>
                <div>
                  <Label className="font-medium">Booking ID</Label>
                  <p>#{currentBooking.id}</p>
                </div>
                <div>
                  <Label className="font-medium">Check-in Date</Label>
                  <p>{currentBooking.checkinDate}</p>
                </div>
                <div>
                  <Label className="font-medium">Check-out Date</Label>
                  <p>{currentBooking.checkoutDate}</p>
                </div>
                <div>
                  <Label className="font-medium">Guests</Label>
                  <p>{currentBooking.guests}</p>
                </div>
                <div>
                  <Label className="font-medium">Room Type</Label>
                  <p className="capitalize">{currentBooking.roomType}</p>
                </div>
                <div>
                  <Label className="font-medium">Nights</Label>
                  <p>{currentBooking.nights}</p>
                </div>
                <div>
                  <Label className="font-medium">Total Price</Label>
                  <p className="font-bold text-lg">
                    ${currentBooking.totalPrice}
                  </p>
                </div>
              </div>
              <div>
                <Label className="font-medium">Status</Label>
                <Badge
                  variant={
                    currentBooking.status === "confirmed"
                      ? "default"
                      : currentBooking.status === "cancelled"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {currentBooking.status}
                </Badge>
              </div>
              <div>
                <Label className="font-medium">Booking Date</Label>
                <p>
                  {new Date(currentBooking.bookingDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Add this function outside the component
const handleDeleteRoom = (roomId: number) => {
  // remove from admin/user rooms store
  const existingRooms = JSON.parse(localStorage.getItem("userRooms") || "[]");
  const updatedRooms = existingRooms.filter((r: any) => r.id !== roomId);
  localStorage.setItem("userRooms", JSON.stringify(updatedRooms));

  // remove from user-facing hotels list as well
  const existingHotels = JSON.parse(localStorage.getItem("hotels") || "[]");
  const updatedHotels = existingHotels.filter((h: any) => h.id !== roomId);
  localStorage.setItem("hotels", JSON.stringify(updatedHotels));

  // update local component state if you keep rooms in state (optional)
  // setRooms(prev => prev.filter(r => r.id !== roomId)); // uncomment if setRooms exists

  // Notify other components in same window
  window.dispatchEvent(
    new CustomEvent("hotels-updated", { detail: { id: roomId } })
  );

  // If you want other tabs/windows to pick it up, also set a "lastUpdated" key (triggers storage)
  localStorage.setItem("hotels_last_updated", String(Date.now()));
};
