"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/use-favorites";
import type { Hotel } from "@/lib/types";

interface HotelCardProps {
  hotel: Hotel;
  listView?: boolean;
}

export function HotelCard({ hotel, listView = false }: HotelCardProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(hotel.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(hotel.id);
  };

  // Update the displayImage logic
  const displayImage =
    (hotel.images && hotel.images.length > 0 && hotel.images[0]) ||
    hotel.photo ||
    hotel.image ||
    "/placeholder.jpg";

  const reviewCount = hotel.reviews?.length ?? 0;

  // Normalize amenities so .slice won't throw
  const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];

  if (listView) {
    return (
      <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-1/3">
            {typeof displayImage === "string" &&
            displayImage.startsWith("data:") ? (
              // data URI - use plain img to avoid optimization issues
              <img
                src={displayImage}
                alt={hotel.name}
                className="w-full h-60 object-cover"
              />
            ) : (
              // if using next/image keep unoptimized to accept external/data uris
              <Image
                src={String(displayImage)}
                alt={hotel.name}
                width={400}
                height={250}
                className="w-full h-60 md:h-full object-cover"
                unoptimized
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavoriteClick}
              className="absolute top-2 right-2 bg-background/80 hover:bg-background rounded-full shadow"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite
                    ? "text-red-500 fill-red-500"
                    : "text-muted-foreground"
                }`}
              />
            </Button>
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-semibold">{hotel.name}</h3>
                <p className="text-muted-foreground mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {hotel.location}
                </p>
              </div>
              <Badge variant="outline" className="text-primary border-primary">
                {hotel.rating} ★
              </Badge>
            </div>

            <p className="text-foreground mb-4 line-clamp-2">
              {hotel.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {amenities.slice(0, 4).map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {amenities.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{amenities.length - 4} more
                </Badge>
              )}
            </div>

            <div className="mt-auto flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-primary">
                  ${hotel.price}
                </span>
                <span className="text-muted-foreground text-sm">/night</span>
              </div>
              <Link href={`/hotels/${hotel.id}`}>
                <Button className="bg-primary hover:bg-primary/90">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative group">
      <div className="relative">
        {typeof displayImage === "string" &&
        displayImage.startsWith("data:") ? (
          // data URI - use plain img to avoid optimization issues
          <img
            src={displayImage}
            alt={hotel.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          // if using next/image keep unoptimized to accept external/data uris
          <Image
            src={String(displayImage)}
            alt={hotel.name}
            width={400}
            height={200}
            className="w-full h-48 object-cover"
            unoptimized
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 bg-background/80 hover:bg-background rounded-full shadow"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "text-red-500 fill-red-500" : "text-muted-foreground"
            }`}
          />
        </Button>

        {/* Special offers badge */}
        {hotel.id % 2 === 0 && (
          <Badge className="absolute top-2 left-2 bg-primary">
            Special Offer
          </Badge>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{hotel.name}</h3>
        </div>

        <p className="text-muted-foreground mb-2 flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {hotel.location}
        </p>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(hotel.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-sm">{hotel.rating ?? 0}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              ({reviewCount} review{reviewCount === 1 ? "" : "s"})
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">
              ${hotel.price}
            </span>
            <span className="text-muted-foreground text-sm">/night</span>
          </div>
          <Link href={`/hotels/${hotel.id}`}>
            <Button className="bg-primary hover:bg-primary/90">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
