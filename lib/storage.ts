import { Trip, PackingItem, TimeLineTask } from "@/app/types"


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


export function getAllTrips(): Trip[] {
    const trips: Trip[] = []
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


export function getPackingItems(tripId: string): PackingItem[] {
    const pack = localStorage.getItem(`packing-${tripId}`)

    if (!pack) {
        return []
    }

    try {
        return JSON.parse(pack) as PackingItem[]
    }
    catch {
        console.error(`Failed to parse packing data for trip ${tripId}`)
        return []
    }
}


export function savePackingItems(tripId: string, items: PackingItem[]): void {
    try {
        localStorage.setItem(`packing-${tripId}`, JSON.stringify(items))
    } catch (error) {
        console.error("Failed to save Items", error)
    }


}


export function getTasks(tripId: string): TimeLineTask[] {
    const tasks = localStorage.getItem(`tasks-${tripId}`)

    if (!tasks) {
        return []
    }

    try {
        return JSON.parse(tasks) as TimeLineTask[]
    }
    catch {
        console.error(`Could not retrieve tasks for trip ${tripId}`)
        return []
    }
}

export function saveTasks(tripId: string, tasks: TimeLineTask[]): void {
    try {
        localStorage.setItem(`tasks-${tripId}`, JSON.stringify(tasks))
    } catch (error) {
        console.error("Failed to save tasks", error)
    }
}

export function getPackingComplete(tripId: string): boolean {
    const isPacked = localStorage.getItem(`packingComplete-${tripId}`)
    if (isPacked) return true; else return false
}

export function setPackingComplete(tripId: string, value: boolean): void {
    try {
        localStorage.setItem(`packingComplete-${tripId}`, JSON.stringify(value))
    } catch (error) {
        console.error('Failed to save result', error)
    }
}