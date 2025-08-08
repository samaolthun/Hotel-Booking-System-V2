"use client"

import { useState } from "react"
import { Search, Filter, Calendar, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

// Sample booking data
const initialBookings = [
  {
    id: 1,
    guestName: "John Smith",
    roomNumber: "101",
    roomType: "Deluxe Suite",
    checkIn: "2025-07-20",
    checkOut: "2025-07-25",
    status: "confirmed",
    totalAmount: 1250,
    paymentMethod: "visa",
    email: "john.smith@example.com",
    phone: "+1 555-123-4567",
  },
  {
    id: 2,
    guestName: "Emma Johnson",
    roomNumber: "102",
    roomType: "Standard Room",
    checkIn: "2025-07-18",
    checkOut: "2025-07-20",
    status: "confirmed",
    totalAmount: 380,
    paymentMethod: "mastercard",
    email: "emma.j@example.com",
    phone: "+1 555-987-6543",
  },
  {
    id: 3,
    guestName: "Michael Brown",
    roomNumber: "103",
    roomType: "Executive Suite",
    checkIn: "2025-07-22",
    checkOut: "2025-07-28",
    status: "pending",
    totalAmount: 1890,
    paymentMethod: "pending",
    email: "michael.b@example.com",
    phone: "+1 555-456-7890",
  },
  {
    id: 4,
    guestName: "Sarah Davis",
    roomNumber: "104",
    roomType: "Deluxe Room",
    checkIn: "2025-07-19",
    checkOut: "2025-07-21",
    status: "cancelled",
    totalAmount: 520,
    paymentMethod: "paypal",
    email: "sarah.d@example.com",
    phone: "+1 555-789-0123",
  },
]

export function BookingManagement() {
  const [bookings, setBookings] = useState(initialBookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [isViewBookingOpen, setIsViewBookingOpen] = useState(false)
  const [currentBooking, setCurrentBooking] = useState<any>(null)
  const { toast } = useToast()

  // Stats calculation
  const totalBookings = bookings.length
  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed").length
  const pendingBookings = bookings.filter((booking) => booking.status === "pending").length
  const cancelledBookings = bookings.filter((booking) => booking.status === "cancelled").length

  // Filter bookings based on search term
  const filteredBookings = bookings.filter(
    (booking) =>
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleUpdateStatus = (id: number, status: string) => {
    setBookings(bookings.map((booking) => (booking.id === id ? { ...booking, status } : booking)))
    toast({
      title: "Booking Updated",
      description: `Booking status has been updated to ${status}.`,
    })
    setIsViewBookingOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <h3 className="text-2xl font-bold mt-1">{totalBookings}</h3>
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
                <p className="text-sm font-medium text-gray-500">Confirmed</p>
                <h3 className="text-2xl font-bold mt-1">{confirmedBookings}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <h3 className="text-2xl font-bold mt-1">{pendingBookings}</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Cancelled</p>
                <h3 className="text-2xl font-bold mt-1">{cancelledBookings}</h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <X className="h-6 w-6 text-red-600" />
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
            placeholder="Search bookings..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Guest</th>
                  <th className="text-left py-3 px-4">Room</th>
                  <th className="text-left py-3 px-4">Check-in</th>
                  <th className="text-left py-3 px-4">Check-out</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{booking.guestName}</td>
                    <td className="py-3 px-4">
                      {booking.roomNumber} - {booking.roomType}
                    </td>
                    <td className="py-3 px-4">{booking.checkIn}</td>
                    <td className="py-3 px-4">{booking.checkOut}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "success"
                            : booking.status === "pending"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">${booking.totalAmount}</td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentBooking(booking)
                          setIsViewBookingOpen(true)
                        }}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Booking Dialog */}
      <Dialog open={isViewBookingOpen} onOpenChange={setIsViewBookingOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {currentBooking && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Guest</h3>
                  <p className="font-medium">{currentBooking.guestName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Room</h3>
                  <p>
                    {currentBooking.roomNumber} - {currentBooking.roomType}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Check-in</h3>
                  <p>{currentBooking.checkIn}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Check-out</h3>
                  <p>{currentBooking.checkOut}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge
                    variant={
                      currentBooking.status === "confirmed"
                        ? "success"
                        : currentBooking.status === "pending"
                          ? "warning"
                          : "destructive"
                    }
                  >
                    {currentBooking.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                  <p className="font-medium">${currentBooking.totalAmount}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p>{currentBooking.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p>{currentBooking.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                <p className="capitalize">{currentBooking.paymentMethod}</p>
              </div>

              <div className="space-y-2 pt-4">
                <Label>Update Status</Label>
                <Select
                  defaultValue={currentBooking.status}
                  onValueChange={(value) => handleUpdateStatus(currentBooking.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewBookingOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
