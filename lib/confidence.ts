import { getTasks, getPackingItems } from "@/lib/storage"

export function getConfidence(tripId: string): number {
    if (typeof window === "undefined") {
        return 0
    }

    try {
        const tasks = getTasks(tripId)
        const items = getPackingItems(tripId)

        const total = tasks.length + items.length
        if (total === 0) {
            return 0
        }

        const finished = tasks.filter(task => task.done).length + items.filter(item => item.packed).length
        return Math.round((finished / total) * 100)
    } catch (error) {
        console.error(`Could not calculate confidence for trip ${tripId}`, error)
        return 0
    }
}
