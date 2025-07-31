import { OwnerLayout } from "@/src/components/owner/owner-layout"
import { OwnerDashboard } from "@/src/components/owner/owner-dashboard"

export default function OwnerHomePage() {
  return (
    <OwnerLayout>
      <OwnerDashboard />
    </OwnerLayout>
  )
}
