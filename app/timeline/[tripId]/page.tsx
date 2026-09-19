"use client"

import { buildTimeline, PACK_BAGS_TITLE } from "@/lib/timeline";
import { TimeLineTask } from "@/app/types";
import ProgressBar from "@/app/components/ProgressBar";
import ChecklistItem from "@/app/components/ChecklistItem";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveTasks, getTasks, getPackingComplete } from "@/lib/storage";
import { useTrip } from "@/app/hooks/useTrip";
import Button from "@/app/components/Button";

function formatDue(iso: string): string {
    return new Date(iso).toLocaleString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function Timeline() {

    const router = useRouter();
    const { trip, status } = useTrip();
    const [tasks, setTasks] = useState<TimeLineTask[]>([]);
    const [tasksLoaded, setTasksLoaded] = useState(false);

    const toggleTask = (id: number) => {
        setTasks(prev =>
            prev.map(task => task.id === id ? { ...task, done: !task.done } : task)
        );
    };
    const completion = tasks.length
        ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100)
        : 0;

    // Load saved tasks, or build a fresh timeline from the flight details.
    useEffect(() => {
        if (status !== "found" || !trip) return;

        const stored = getTasks(trip.id);
        // Tasks saved before due times existed have the old shape, so rebuild them.
        const usable = stored.length > 0 && stored.every(task => typeof task.dueAt === "string");
        const loaded = usable ? stored : buildTimeline(trip);

        // The packing page records completion separately; reflect it here.
        setTasks(
            getPackingComplete(trip.id)
                ? loaded.map(task => task.title === PACK_BAGS_TITLE ? { ...task, done: true } : task)
                : loaded
        );
        setTasksLoaded(true);
    }, [status, trip]);

    useEffect(() => {
        if (!tasksLoaded || !trip) return;
        saveTasks(trip.id, tasks)
    }, [tasks, trip, tasksLoaded]);

    if (status === "loading") {
        return (<div>Loading..</div>)
    }
    if (status === "not-found" || !trip) {
        return (
            <div>Trip not found
                <Button variant="secondary" size="md" onClick={() => router.push("/landing")}>
                    go to landing page
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-xl font-semibold mb-3">Pre-Flight Checklist ✈️</h1>
            <h2 className="text-sm text-gray-600 mb-4">
                {trip.FlyingFrom} → {trip.FlyingTo} | Flight {trip.FlightNumber} | {trip.FromDate} {trip.DepartureTime}
            </h2>

            <ProgressBar progress={completion} className="mb-4" />
            <p className="text-sm mb-4">{completion}% complete</p>

            {tasksLoaded && tasks.length === 0 ? (
                <div className="border p-4 rounded">
                    <p className="mb-3">This trip has no departure time, so a timeline can&apos;t be built.</p>
                    <Button variant="primary" onClick={() => router.push("/trip-setup")}>
                        Create a new trip
                    </Button>
                </div>
            ) : (
                <ul className="space-y-3">
                    {tasks.map(task => (
                        <ChecklistItem
                            key={task.id}
                            label={task.title}
                            checked={task.done}
                            onToggle={() => toggleTask(task.id)}
                            detail={formatDue(task.dueAt)}
                        />
                    ))}
                </ul>
            )}

            <div className="mt-6">
                <Button variant="secondary" onClick={() => router.push(`/packing/${trip.id}`)}>
                    Let&apos;s Pack!
                </Button>
            </div>

        </div>

    );
}
