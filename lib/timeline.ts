import { Trip, TimeLineTask } from '@/app/types';

// The timeline page marks this task done when the packing list is complete.
export const PACK_BAGS_TITLE = "Pack Bags"


export interface TimeLineBuffers {
    getReadyMinutes: number                     
    travelToAirportMinutes: number              
    arriveBeforeDepartureMinutes: number        
    headToGateBeforeDepartureMinutes: number
    boardingBeforeDepartureMinutes: number
}

export const DEFAULT_BUFFERS: TimeLineBuffers = {
    getReadyMinutes: 60,
    travelToAirportMinutes: 45,
    arriveBeforeDepartureMinutes: 150,
    headToGateBeforeDepartureMinutes: 60,
    boardingBeforeDepartureMinutes: 40,
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE

export function getDepatureDateTime(trip: Trip): Date | null {
    const depatureDate = new Date(`${trip.FromDate}T${trip.DepartureTime}`)
    return Number.isNaN(depatureDate.getTime()) ? null : depatureDate

}

export function buildTimeline(trip: Trip, buffers: TimeLineBuffers = DEFAULT_BUFFERS): TimeLineTask[] {
    const departure = getDepatureDateTime(trip)
    if (!departure) return []

    const departureMs = departure.getTime()
    const atAirportMs = departureMs - buffers.arriveBeforeDepartureMinutes * MINUTE
    const leaveHomeMs = atAirportMs - buffers.travelToAirportMinutes * MINUTE
    const wakeUpMs = leaveHomeMs - buffers.getReadyMinutes * MINUTE

    const steps: { title: string; dueMs: number }[] = [
        { title: "Check passport and travel documents", dueMs: departureMs - 72 * HOUR },
        { title: "Check in online", dueMs: departureMs - 24 * HOUR },
        { title: PACK_BAGS_TITLE, dueMs: departureMs - 12 * HOUR },
        { title: "Wake up", dueMs: wakeUpMs },
        { title: "Leave for the airport", dueMs: leaveHomeMs },
        { title: "Arrive at the airport and drop bags", dueMs: atAirportMs },
        { title: "Head to your gate", dueMs: departureMs - buffers.headToGateBeforeDepartureMinutes * MINUTE },
        { title: "Boarding", dueMs: departureMs - buffers.boardingBeforeDepartureMinutes * MINUTE },
    ]

    return steps
        .sort((a, b) => a.dueMs - b.dueMs)
        .map((step, index) => ({
            id: index + 1,
            title: step.title,
            done: false,
            dueAt: new Date(step.dueMs).toISOString(),
        }))
}
