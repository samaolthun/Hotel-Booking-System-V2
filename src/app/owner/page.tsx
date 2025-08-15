import { OwnerLayout } from "@/components/owner/owner-layout"
import { OwnerDashboard } from "@/components/owner/owner-dashboard"

export default function OwnerHomePage() {
  return (
    <OwnerLayout>
      <OwnerDashboard />
    </OwnerLayout>
  )
}
