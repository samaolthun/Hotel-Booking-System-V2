"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface HotelImageGalleryProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  hotelName: string
}

export function HotelImageGallery({ isOpen, onClose, images, hotelName }: HotelImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 text-white z-10 hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="relative h-[80vh] flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 z-10 text-white hover:bg-white/20 rounded-full"
            onClick={prevImage}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <div className="h-full w-full flex items-center justify-center">
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`${hotelName} - Image ${currentIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 z-10 text-white hover:bg-white/20 rounded-full"
            onClick={nextImage}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        <div className="bg-black p-4 flex justify-center">
          <div className="flex gap-2 overflow-x-auto max-w-full">
            {images.map((img, i) => (
              <div
                key={i}
                className={`w-20 h-14 relative cursor-pointer ${i === currentIndex ? "ring-2 ring-white" : "opacity-70"}`}
                onClick={() => setCurrentIndex(i)}
              >
                <Image src={img || "/placeholder.svg"} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
