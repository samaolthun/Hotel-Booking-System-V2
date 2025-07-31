import { OwnerLayout } from "@/src/components/owner/owner-layout"
import { BookingManagement } from "@/src/components/owner/booking-management"

export default function OwnerBookingsPage() {
  return (
    <OwnerLayout>
      <BookingManagement />
    </OwnerLayout>
  )
}
