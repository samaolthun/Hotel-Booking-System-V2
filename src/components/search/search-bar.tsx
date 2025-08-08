"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Calendar, Users, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"

export function SearchBar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState(2)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [amenities, setAmenities] = useState<string[]>([])

  const amenityOptions = [
    "Pool",
    "Spa",
    "WiFi",
    "Restaurant",
    "Fitness Center",
    "Bar",
    "Parking",
    "Beach Access",
    "Airport Shuttle",
  ]

  const toggleAmenity = (amenity: string) => {
    setAmenities((current) =>
      current.includes(amenity) ? current.filter((a) => a !== amenity) : [...current, amenity],
    )
  }

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (searchQuery) params.set("q", searchQuery)
    if (checkIn) params.set("checkIn", checkIn.toISOString().split("T")[0])
    if (checkOut) params.set("checkOut", checkOut.toISOString().split("T")[0])
    if (guests > 0) params.set("guests", guests.toString())
    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      params.set("minPrice", priceRange[0].toString())
      params.set("maxPrice", priceRange[1].toString())
    }
    if (amenities.length > 0) params.set("amenities", amenities.join(","))

    router.push(`/hotels?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search hotels, locations..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex gap-2 min-w-[140px] bg-transparent">
            <Calendar className="h-4 w-4" />
            {checkIn ? (
              <span>
                {checkIn.toLocaleDateString()} - {checkOut?.toLocaleDateString() || "?"}
              </span>
            ) : (
              <span>Select dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <h4 className="font-medium">Check-in</h4>
              <DatePicker date={checkIn} onSelect={setCheckIn} />
            </div>
            <div className="grid gap-2">
              <h4 className="font-medium">Check-out</h4>
              <DatePicker date={checkOut} onSelect={setCheckOut} />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex gap-2 min-w-[120px] bg-transparent">
            <Users className="h-4 w-4" />
            <span>{guests} Guests</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Number of guests</h4>
                <span className="font-bold">{guests}</span>
              </div>
              <Slider value={[guests]} min={1} max={10} step={1} onValueChange={(value) => setGuests(value[0])} />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {(priceRange[0] > 0 || priceRange[1] < 1000 || amenities.length > 0) && (
              <Badge variant="secondary" className="ml-1">
                {amenities.length + (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="grid gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Price Range</h4>
              <div className="flex items-center justify-between">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <Slider
                value={priceRange}
                min={0}
                max={1000}
                step={10}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Amenities</h4>
              <div className="grid grid-cols-2 gap-2">
                {amenityOptions.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={amenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-700">
        Search
      </Button>
    </div>
  )
}
