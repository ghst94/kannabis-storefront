// Geofencing Service for Cannabis Delivery
// Handles delivery zone validation and distance calculations

export interface DeliveryZone {
  id: string
  name: string
  coordinates: { lat: number; lng: number }[]  // Polygon coordinates
  deliveryFee: number
  minimumOrder: number
  estimatedTime: string
  isActive: boolean
}

export interface AddressValidationResult {
  isValid: boolean
  zone?: DeliveryZone
  distance?: number
  message: string
}

// Define delivery zones (in production, fetch from backend)
export const deliveryZones: DeliveryZone[] = [
  {
    id: "zone-1",
    name: "Downtown",
    coordinates: [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.7849, lng: -122.4194 },
      { lat: 37.7849, lng: -122.4094 },
      { lat: 37.7749, lng: -122.4094 },
    ],
    deliveryFee: 0,
    minimumOrder: 25,
    estimatedTime: "30-45 min",
    isActive: true,
  },
  {
    id: "zone-2",
    name: "Extended Area",
    coordinates: [
      { lat: 37.7649, lng: -122.4294 },
      { lat: 37.7949, lng: -122.4294 },
      { lat: 37.7949, lng: -122.3994 },
      { lat: 37.7649, lng: -122.3994 },
    ],
    deliveryFee: 10,
    minimumOrder: 50,
    estimatedTime: "45-60 min",
    isActive: true,
  },
]

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Check if a point is inside a polygon using ray-casting algorithm
 */
export function isPointInPolygon(
  point: { lat: number; lng: number },
  polygon: { lat: number; lng: number }[]
): boolean {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat
    const yi = polygon[i].lng
    const xj = polygon[j].lat
    const yj = polygon[j].lng

    const intersect =
      yi > point.lng !== yj > point.lng &&
      point.lat < ((xj - xi) * (point.lng - yi)) / (yj - yi) + xi

    if (intersect) inside = !inside
  }
  return inside
}

/**
 * Validate if an address is within delivery zones
 */
export function validateDeliveryAddress(
  lat: number,
  lng: number
): AddressValidationResult {
  const point = { lat, lng }

  // Check each delivery zone
  for (const zone of deliveryZones) {
    if (!zone.isActive) continue

    if (isPointInPolygon(point, zone.coordinates)) {
      return {
        isValid: true,
        zone,
        message: `Delivery available in ${zone.name}. Fee: $${zone.deliveryFee}, Minimum order: $${zone.minimumOrder}`,
      }
    }
  }

  return {
    isValid: false,
    message:
      "Sorry, we don't currently deliver to this address. Please try a different location or choose pickup.",
  }
}

/**
 * Get geocoding for an address using Google Maps API
 * In production, use proper API key and error handling
 */
export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    // This is a placeholder - in production, implement proper geocoding
    // Using Google Maps Geocoding API or similar service

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.error("Google Maps API key not configured")
      return null
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    )

    const data = await response.json()

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location
      return {
        lat: location.lat,
        lng: location.lng,
      }
    }

    return null
  } catch (error) {
    console.error("Geocoding error:", error)
    return null
  }
}

/**
 * Calculate delivery fee based on distance and zone
 */
export function calculateDeliveryFee(zone: DeliveryZone, distance: number): number {
  // Base fee from zone
  let fee = zone.deliveryFee

  // Add distance-based fee if beyond certain threshold
  const freeDeliveryDistance = 3 // miles
  if (distance > freeDeliveryDistance) {
    const additionalDistance = distance - freeDeliveryDistance
    fee += Math.ceil(additionalDistance) * 2 // $2 per additional mile
  }

  return fee
}

/**
 * Get estimated delivery time based on zone and current traffic
 */
export function getEstimatedDeliveryTime(
  zone: DeliveryZone,
  currentHour: number
): string {
  // Adjust time based on peak hours
  const isPeakHour = currentHour >= 17 && currentHour <= 20

  if (isPeakHour) {
    return `${zone.estimatedTime.split("-")[0]}-${
      parseInt(zone.estimatedTime.split("-")[1]) + 15
    } min`
  }

  return zone.estimatedTime
}

/**
 * Check if delivery is available at current time
 */
export function isDeliveryAvailable(currentHour: number, currentDay: number): {
  available: boolean
  message: string
} {
  // Delivery hours: 9 AM - 9 PM, 7 days a week
  const openHour = 9
  const closeHour = 21

  if (currentHour < openHour || currentHour >= closeHour) {
    return {
      available: false,
      message: `Delivery is available from ${openHour}:00 AM to ${closeHour}:00 PM`,
    }
  }

  return {
    available: true,
    message: "Delivery is available now",
  }
}
