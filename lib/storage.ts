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

export function saveTrip(trip: Trip): void {

    try {
        localStorage.setItem(`trip-${trip.id}`, JSON.stringify(trip))
    }
    catch (error) {
        console.error("Failed to save trip", error)
    }
}


export function deleteTrip(tripId: string): void {
    try {
        localStorage.removeItem(`trip-${tripId}`)
        localStorage.removeItem(`tasks-${tripId}`)
        localStorage.removeItem(`packing-${tripId}`)
        localStorage.removeItem(`packingComplete-${tripId}`)
    } catch (error) {
        console.error("Failed to delete trip", error)
    }



}


export function getAllTrips(): Trip[] | [] {
    const trips = []
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)

        if (key?.startsWith('trip-')) {

            const value = localStorage.getItem(key)
            if (!value) {
                continue

            }

            const trip = JSON.parse(value) as Trip

            trips.push(trip)
        }

    }
    return trips
}