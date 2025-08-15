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
    type: "",
    floor: "",
    price: "",
    rating: "",
  });
  const [currentRoom, setCurrentRoom] = useState<any>(null);
  const [currentBooking, setCurrentBooking] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Get rooms from localStorage (these are the rooms shown in Hotels page)
  const [userRooms, setUserRooms] = useState<any[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("userRooms") || "[]";
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // First, update how you get the bookings data
  const [bookings, setBookings] = useState<any[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("bookings");
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      return arr.sort(
        (a: any, b: any) =>
          new Date(b.bookingDate || b.date || 0).getTime() -
          new Date(a.bookingDate || a.date || 0).getTime()
      );
    } catch (e) {
      console.error("Failed to load bookings from localStorage:", e);
      return [];
    }
  });

  // Keep bookings and rooms state in sync across tabs (listen to storage events)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      try {
        if (e.key === "bookings") {
          const parsed = e.newValue ? JSON.parse(e.newValue) : [];
          setBookings(Array.isArray(parsed) ? parsed : []);
        }
        if (
          e.key === "userRooms" ||
          e.key === "ownerRooms" ||
          e.key === "rooms"
        ) {
          const raw = localStorage.getItem("userRooms") || "[]";
          const parsedRooms = JSON.parse(raw);
          setUserRooms(Array.isArray(parsedRooms) ? parsedRooms : []);
        }
      } catch (err) {
        // ignore parse errors
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

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
  const validateBookingData = (data: Partial<typeof formData> = formData) => {
    // required textual fields (removed hotelName and location)
    const requiredTextFields = ["description"];
    const missingText = requiredTextFields.filter(
      (f) => !String(data[f as keyof typeof data] ?? "").trim()
    );
    if (missingText.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missingText.join(", ")}`,
        variant: "destructive",
      });
      return false;
    }

    const price = Number(data.price ?? formData.price ?? 0);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid price",
        description: "Price must be greater than 0",
        variant: "destructive",
      });
      return false;
    }

    const capacity = Number(data.capacity ?? formData.capacity ?? 0);
    if (isNaN(capacity) || capacity <= 0) {
      toast({
        title: "Invalid capacity",
        description: "Capacity must be greater than 0",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

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

  // Accept either a FormEvent (from a <form onSubmit>) or a data object (from RoomFormDialog)
  const handleAddRoom = (
    payload?: React.FormEvent | Partial<typeof formData>
  ) => {
    // prevent default if called as a form submit event
    if (
      payload &&
      typeof (payload as React.FormEvent).preventDefault === "function"
    ) {
      (payload as React.FormEvent).preventDefault();
    }

    // merge incoming payload (if data object) with current formData
    const merged = {
      ...formData,
      ...(payload && !(payload as any).preventDefault
        ? (payload as Partial<typeof formData>)
        : {}),
    };

    // validate merged data (IMPORTANT: pass merged)
    if (!validateBookingData(merged)) {
      return;
    }

    const newRoom = {
      id: Date.now(),
      ...merged,
      services: Array.isArray(merged.services)
        ? merged.services
        : merged.services
        ? [merged.services]
        : [],
      amenities: Array.isArray(merged.amenities)
        ? merged.amenities
        : merged.amenities
        ? [merged.amenities]
        : [],
      createdAt: new Date().toISOString(),
      rating: 0,
      reviews: [],
    };

    const updatedRooms = [...userRooms, newRoom];

    // persist to multiple keys so public/user pages pick it up
    localStorage.setItem("userRooms", JSON.stringify(updatedRooms));
    localStorage.setItem("ownerRooms", JSON.stringify(updatedRooms));

    // also ensure the global "rooms" array contains the new room
    try {
      const existingAll = JSON.parse(localStorage.getItem("rooms") || "[]");
      const allUpdated = Array.isArray(existingAll)
        ? [...existingAll, newRoom]
        : updatedRooms;
      localStorage.setItem("rooms", JSON.stringify(allUpdated));
    } catch {
      localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    }

    // update state so UI updates immediately (no reload)
    setUserRooms(updatedRooms);

    toast({
      title: "Room added successfully!",
      description: "Your room is now available for booking.",
    });

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

    setIsAddRoomOpen(false);
  };

  const handleEditRoom = (room: any) => {
    // ensure editing is blocked if room is booked
    if (isRoomBooked(room.id, room.number, room)) {
      toast({
        title: "Room is currently booked",
        description:
          "You cannot edit this room while it has active or upcoming bookings.",
        variant: "destructive",
      });
      return;
    }
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
      services: Array.isArray(room.services)
        ? room.services
        : [room.services].filter(Boolean),
      amenities: Array.isArray(room.amenities)
        ? room.amenities
        : [room.amenities].filter(Boolean),
      photo: room.photo || "",
    });
    setIsEditRoomOpen(true);
  };

  const handleEditRoomSubmit = (
    payload?: React.FormEvent | Partial<typeof formData>
  ) => {
    if (
      payload &&
      typeof (payload as React.FormEvent).preventDefault === "function"
    ) {
      (payload as React.FormEvent).preventDefault();
    }

    if (!currentRoom) {
      toast({
        title: "No room selected",
        description: "Please select a room to edit.",
        variant: "destructive",
      });
      return;
    }

    const merged = {
      ...currentRoom,
      ...formData,
      ...(payload && !(payload as any).preventDefault
        ? (payload as Partial<typeof formData>)
        : {}),
    };

    // block submit if the room is booked (re-check)
    if (isRoomBooked(currentRoom.id, currentRoom.number, currentRoom)) {
      toast({
        title: "Room is currently booked",
        description:
          "You cannot edit this room while it has active or upcoming bookings.",
        variant: "destructive",
      });
      return;
    }

    if (!validateBookingData(merged)) {
      return;
    }

    const updatedRooms = userRooms.map((room: any) =>
      room.id === currentRoom.id
        ? {
            ...room,
            ...merged,
            services: Array.isArray(merged.services)
              ? merged.services
              : merged.services
              ? [merged.services]
              : [],
            amenities: Array.isArray(merged.amenities)
              ? merged.amenities
              : merged.amenities
              ? [merged.amenities]
              : [],
            updatedAt: new Date().toISOString(),
          }
        : room
    );

    localStorage.setItem("userRooms", JSON.stringify(updatedRooms));
    localStorage.setItem("ownerRooms", JSON.stringify(updatedRooms));
    // also update "rooms" key if present
    try {
      const existingAll = JSON.parse(localStorage.getItem("rooms") || "[]");
      if (Array.isArray(existingAll)) {
        const allUpdated = existingAll.map((r: any) =>
          r.id === currentRoom.id ? { ...r, ...merged } : r
        );
        localStorage.setItem("rooms", JSON.stringify(allUpdated));
      }
    } catch {}

    // update UI state
    setUserRooms(updatedRooms);

    toast({
      title: "Room updated successfully!",
      description: "Your room information has been updated.",
    });

    setIsEditRoomOpen(false);
    setCurrentRoom(null);
  };

  const handleViewRoomDetails = (room: any) => {
    setCurrentRoom(room);
    setIsRoomDetailsOpen(true);
  };

  // helper: parse safe date
  const parseDate = (d?: string | null) => {
    if (!d) return null;
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? null : dt;
  };

  // returns true if there is any active OR upcoming booking that references this room
  const isRoomBooked = (roomId: any, roomNumber?: any, roomObj?: any) => {
    const arr = Array.isArray(bookings) ? bookings : [];
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const now = new Date();

    for (const b of arr) {
      // Try several ways bookings may reference a room
      const bRoomId = b.roomId ?? b.room?.id ?? b.room ?? null;
      const bRoomNumber = b.roomNumber ?? b.room?.number ?? null;
      const roomsArr = Array.isArray(b.rooms) ? b.rooms : [];

      const references =
        (bRoomId != null && String(bRoomId) === String(roomId)) ||
        (bRoomNumber != null &&
          roomNumber != null &&
          String(bRoomNumber) === String(roomNumber)) ||
        roomsArr.some(
          (r: any) =>
            String(r?.id ?? r?.number ?? r) === String(roomId ?? roomNumber)
        ) ||
        // fallback: if booking stores hotel+roomNumber tie
        (b.hotelId &&
          b.roomNumber &&
          String(b.roomNumber) === String(roomNumber));

      if (!references) continue;

      const parseDateSafe = (d?: any) => {
        if (!d) return null;
        const dt = new Date(d);
        return isNaN(dt.getTime()) ? null : dt;
      };

      const ci = parseDateSafe(b.checkinDate ?? b.startDate ?? b.from ?? null);
      const co = parseDateSafe(b.checkoutDate ?? b.endDate ?? b.to ?? null);

      // conservative: if booking references room but has no dates, treat as booked
      if (!ci && !co) return true;

      // upcoming or ongoing bookings: if checkout exists and is today or later -> booked
      if (co && co >= todayStart) return true;

      // if checkin exists and is today or future -> upcoming booking -> booked
      if (ci && ci >= todayStart) return true;

      // if both exist and today's within range -> booked
      if (ci && co && ci <= now && co >= now) return true;
    }

    return false;
  };

  // central guarded click handlers to ensure edits/deletes are blocked reliably
  const handleEditClick = (room: any) => {
    const booked = isRoomBooked(room.id, room.number, room);
    if (booked) {
      toast({
        title: "Room is currently booked",
        description:
          "You cannot edit this room while it has active or upcoming bookings.",
        variant: "destructive",
      });
      return;
    }
    // open edit UI
    setCurrentRoom(room);
    setIsEditRoomOpen(true);
  };

  const handleDeleteClick = (room: any) => {
    const booked = isRoomBooked(room.id, room.number, room);
    if (booked) {
      toast({
        title: "Room is currently booked",
        description:
          "You cannot delete this room while it has active or upcoming bookings.",
        variant: "destructive",
      });
      return;
    }
    // proceed with removal
    if (confirm("Are you sure you want to remove this room?")) {
      const updatedRooms = userRooms.filter((r: any) => r.id !== room.id);
      localStorage.setItem("userRooms", JSON.stringify(updatedRooms));
      localStorage.setItem("ownerRooms", JSON.stringify(updatedRooms));
      try {
        const existingAll = JSON.parse(localStorage.getItem("rooms") || "[]");
        if (Array.isArray(existingAll)) {
          const allUpdated = existingAll.filter((r: any) => r.id !== room.id);
          localStorage.setItem("rooms", JSON.stringify(allUpdated));
        }
      } catch {}
      setUserRooms(updatedRooms);
      toast({
        title: "Room removed successfully!",
        description: "The room has been removed from your listings.",
      });
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

  // Always use a normalized array for rendering
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const recentBookings = safeBookings.slice(0, 5);
  // use safeBookings for rendering anywhere we previously used bookings

  return (
    <div className="p-6 space-y-6">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Home
          </Button>
          <br />
          <br />
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-600">Manage your hotel rooms and bookings</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsAddRoomOpen(true)} className="bg-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add New Room
          </Button>
          <Button variant="outline" onClick={addTestBooking}>
            Add Test Booking
          </Button>
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
                  {recentBookings.map((booking: any, idx: number) => (
                    <div
                      key={booking?.id ?? `recent-booking-${idx}`}
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
              {userRooms.length > 0 ? (
                <div className="space-y-4">
                  {userRooms.map((room: any) => (
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
                          onClick={() => handleEditClick(room)}
                          disabled={isRoomBooked(room.id, room.number, room)}
                          title={
                            isRoomBooked(room.id, room.number, room)
                              ? "Room has active/upcoming bookings"
                              : "Edit room"
                          }
                          className={
                            isRoomBooked(room.id, room.number, room)
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(room)}
                          disabled={isRoomBooked(room.id, room.number, room)}
                          title={
                            isRoomBooked(room.id, room.number, room)
                              ? "Cannot delete a booked room"
                              : "Remove room"
                          }
                          className={
                            isRoomBooked(room.id, room.number, room)
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No rooms added yet</p>
                  <Button
                    onClick={() => setIsAddRoomOpen(true)}
                    className="mt-2"
                  >
                    Add Your First Room
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
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {safeBookings.map((booking: any) => (
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
                  <p className="text-muted-foreground">No bookings yet</p>
                  <Button onClick={addTestBooking} className="mt-2">
                    Add Test Booking
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
        onClose={() => setIsEditRoomOpen(false)}
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
                <div>
                  <Label className="font-medium">Hotel Name</Label>
                  <p>{currentRoom.hotelName}</p>
                </div>
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
              <div>
                <Label className="font-medium">Location</Label>
                <p>{currentRoom.location}</p>
              </div>
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
