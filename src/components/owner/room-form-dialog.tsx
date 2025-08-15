"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface FormData {
  number: string;
  type: string;
  status: string;
  floor: string;
  hotelName: string;
  location: string;
  price: number;
  capacity: number;
  description: string;
  services: string[];
  amenities: string[];
  photo: string;
}

interface RoomFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  title: string;
  initialData?: Partial<FormData>;
}

const roomTypes = ["Single", "Double", "Deluxe"];
const roomStatus = ["Available", "Booked", "Maintenance"];
const services = [
  "Picked up (airport pickup)",
  "Picked up (shuttle service)",
  "Parking place",
];
const amenities = [
  "Spa",
  "Swimming pool",
  "Breakfast (free)",
  "WIFI",
  "Gym",
  "Mini-fridge",
  "Parking place (self-parking)",
];

export function RoomFormDialog({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData,
}: RoomFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    number: initialData?.number || "",
    type: initialData?.type || "single",
    status: initialData?.status || "available",
    floor: initialData?.floor || "",
    hotelName: initialData?.hotelName || "",
    location: initialData?.location || "",
    price: initialData?.price || 75,
    capacity: initialData?.capacity || 1,
    description: initialData?.description || "",
    services: initialData?.services || [],
    amenities: initialData?.amenities || [],
    photo: initialData?.photo || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (
    field: "services" | "amenities",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item: string) => item !== value)
        : [...prev[field], value],
    }));
  };

  // Add this helper function for converting File to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Update the handlePhotoChange function
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await convertFileToBase64(file);
      setFormData((prev) => ({
        ...prev,
        photo: base64, // store base64 string
      }));
    } catch (err) {
      console.error("convertFileToBase64 error", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Room Number */}
            <div className="space-y-2">
              <Label htmlFor="number">Room Number *</Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => handleChange("number", e.target.value)}
                required
              />
            </div>

            {/* Room Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Room Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((type) => (
                    <SelectItem
                      key={type.toLowerCase()}
                      value={type.toLowerCase()}
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Room Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                name="status"
                defaultValue={initialData?.status || "available"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {roomStatus.map((status) => (
                    <SelectItem
                      key={status.toLowerCase()}
                      value={status.toLowerCase()}
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Floor */}
            <div className="space-y-2">
              <Label htmlFor="floor">Floor *</Label>
              <Input
                id="floor"
                name="floor"
                value={formData.floor}
                onChange={(e) => handleChange("floor", e.target.value)}
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price per Night ($) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
              />
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => handleChange("capacity", e.target.value)}
                required
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="photo">Room Photo</Label>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="block w-full text-sm text-gray-700"
              />
              {/* optional preview */}
              {formData.photo && typeof formData.photo === "string" && (
                <img
                  src={formData.photo}
                  alt="preview"
                  className="mt-2 h-28 object-cover"
                />
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
              />
            </div>

            {/* Services */}
            <div className="space-y-2 col-span-2">
              <Label>Services</Label>
              <div className="grid grid-cols-2 gap-2">
                {services.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service}`}
                      checked={formData.services.includes(service)}
                      onCheckedChange={() =>
                        handleCheckboxChange("services", service)
                      }
                    />
                    <Label htmlFor={`service-${service}`}>{service}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-2 col-span-2">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 gap-2">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={() =>
                        handleCheckboxChange("amenities", amenity)
                      }
                    />
                    <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Update Room" : "Add Room"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
