import { Trip } from "@/app/types";
import { saveTrip, getTasks, saveTasks, removeTips } from "@/lib/storage";
import { buildTimeline } from "@/lib/timeline";

// Saves an edited trip and refreshes the data that depends on what changed.
export function applyTripEdit(previous: Trip, next: Trip): void {
    saveTrip(next);

    const tipsOutdated =
        previous.flyingTo !== next.flyingTo ||
        previous.fromDate !== next.fromDate ||
        previous.toDate !== next.toDate ||
        previous.numberOfTravellers !== next.numberOfTravellers;
    if (tipsOutdated) {
        removeTips(next.id);
    }

    const timelineOutdated =
        previous.fromDate !== next.fromDate ||
        previous.departureTime !== next.departureTime;
    if (timelineOutdated) {
        const doneTitles = new Set(getTasks(next.id).filter(task => task.done).map(task => task.title));
        saveTasks(next.id, buildTimeline(next).map(task => ({ ...task, done: doneTitles.has(task.title) })));
    }
}
