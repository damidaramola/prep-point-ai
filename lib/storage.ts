import { Trip } from "@/app/types"

export function getTrip(tripId: string): Trip | null {

    const trip = localStorage.getItem(`trip-${tripId}`)

    if (!trip) {
        return null
    }
    try {
        return JSON.parse(trip) as Trip
    } catch {
        return null
    }

}

export function saveTrip(trip:Trip):void{

   try {
    localStorage.setItem(`trip-${trip.id}`, JSON.stringify(trip))
   }
   catch(error){
    console.error("Failed to save trip",error)
   }
}