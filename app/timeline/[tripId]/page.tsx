"use client"

import { buildTimeline, PACK_BAGS_TITLE } from "@/lib/timeline";
import { TimeLineTask, TravelTips } from "@/app/types";
import ProgressBar from "@/app/components/ProgressBar";
import ChecklistItem from "@/app/components/ChecklistItem";
import Card from "@/app/components/Cards";
import Spinner from "@/app/components/Spinner";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveTasks, getTasks, getPackingComplete, getTips, saveTips } from "@/lib/storage";
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
    const [tips, setTips] = useState<TravelTips | null>(null);
    const [tipsStatus, setTipsStatus] = useState<"loading" | "done" | "error">("loading");
    // Bumping this re-runs the tips effect, which is how the retry button works.
    const [tipsAttempt, setTipsAttempt] = useState(0);

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

    // Use cached tips if we have them; otherwise ask the API once and cache the result.
    useEffect(() => {
        if (status !== "found" || !trip) return;

        const cached = getTips(trip.id);
        if (cached) {
            setTips(cached);
            setTipsStatus("done");
            return;
        }

        let cancelled = false;
        setTipsStatus("loading");

        async function loadTips(currentTrip: NonNullable<typeof trip>) {
            try {
                const res = await fetch("/api/travel-tips", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(currentTrip),
                });
                if (!res.ok) throw new Error(`Request failed with ${res.status}`);

                const data: TravelTips = await res.json();
                if (cancelled) return;
                saveTips(currentTrip.id, data);
                setTips(data);
                setTipsStatus("done");
            } catch (error) {
                console.error("Could not load travel tips", error);
                if (!cancelled) setTipsStatus("error");
            }
        }
        loadTips(trip);

        // If the trip changes or the page closes before the response arrives, ignore it.
        return () => { cancelled = true };
    }, [status, trip, tipsAttempt]);

    if (status === "loading") {
        return (<Spinner className="p-6" />)
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

            <Card className="mb-6">
                <h3 className="font-semibold mb-2">Tips for {trip.FlyingTo}</h3>
                {tipsStatus === "loading" && <Spinner label="Getting tips…" />}
                {tipsStatus === "error" && (
                    <div className="flex items-center gap-3">
                        <p className="text-sm">Couldn&apos;t load tips right now.</p>
                        <Button size="sm" onClick={() => setTipsAttempt(n => n + 1)}>Try again</Button>
                    </div>
                )}
                {tipsStatus === "done" && tips && (
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        {tips.tips.map(tip => <li key={tip}>{tip}</li>)}
                    </ul>
                )}
            </Card>

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
                {/* The packing list uses the tips' packing suggestions, so wait for them. */}
                <Button
                    variant="secondary"
                    disabled={tipsStatus === "loading"}
                    onClick={() => router.push(`/packing/${trip.id}`)}
                >
                    Let&apos;s Pack!
                </Button>
            </div>

        </div>

    );
}
