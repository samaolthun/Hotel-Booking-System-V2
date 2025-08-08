"use client"

import { useState } from "react"
import { AlertCircle, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { Hotel } from "@/lib/types"

interface PromotionBannerProps {
  hotel: Hotel
}

export function PromotionBanner({ hotel }: PromotionBannerProps) {
  const [visible, setVisible] = useState(true)
  const { toast } = useToast()

  // Generate a random promotion based on the hotel
  const promotions = [
    {
      title: "Early Bird Special",
      description: `Book ${hotel.name} 30 days in advance and save 15% on your stay!`,
      code: "EARLY15",
    },
    {
      title: "Weekend Getaway",
      description: `Enjoy a complimentary breakfast when you book a weekend stay at ${hotel.name}.`,
      code: "WEEKEND",
    },
    {
      title: "Extended Stay Offer",
      description: `Stay 5 nights or more at ${hotel.name} and get 20% off your entire booking.`,
      code: "STAY20",
    },
  ]

  // Select a promotion based on hotel id to keep it consistent
  const promotion = promotions[hotel.id % promotions.length]

  const copyPromoCode = () => {
    navigator.clipboard.writeText(promotion.code)
    toast({
      title: "Promo code copied!",
      description: `${promotion.code} has been copied to your clipboard.`,
    })
  }

  if (!visible) return null

  return (
    <Alert className="mb-6 bg-indigo-50 border-indigo-200">
      <AlertCircle className="h-4 w-4 text-indigo-600" />
      <div className="flex-1">
        <AlertTitle className="text-indigo-700">{promotion.title}</AlertTitle>
        <AlertDescription className="text-indigo-600">
          {promotion.description} Use code:{" "}
          <span className="font-bold bg-white px-2 py-1 rounded border border-indigo-200">{promotion.code}</span>
        </AlertDescription>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={copyPromoCode}
          className="border-indigo-300 text-indigo-700 bg-transparent"
        >
          Copy Code
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setVisible(false)} className="text-indigo-700">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  )
}
