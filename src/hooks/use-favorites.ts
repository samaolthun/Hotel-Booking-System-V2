"use client"

import { useState, useEffect } from "react"

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("favorites")
    if (stored) {
      setFavorites(JSON.parse(stored))
    }
  }, [])

  const toggleFavorite = (hotelId: number) => {
    const newFavorites = favorites.includes(hotelId)
      ? favorites.filter((id) => id !== hotelId)
      : [...favorites, hotelId]

    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  return { favorites, toggleFavorite }
}
