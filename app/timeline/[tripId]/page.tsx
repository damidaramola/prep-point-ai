"use client"

import { buildTimeline, PACK_BAGS_TITLE } from "@/lib/timeline";
import { TimeLineTask, TravelTips } from "@/app/types";
import ProgressBar from "@/app/components/ProgressBar";
import ChecklistItem from "@/app/components/ChecklistItem";
import Card from "@/app/components/Cards";
import Spinner from "@/app/components/Spinner";
import PageShell, { PageHeader, BackLink } from "@/app/components/PageShell";
import TripNotFound from "@/app/components/TripNotFound";
import IconTile from "@/app/components/IconTile";
import { SparklesIcon } from "@/app/components/Icons";

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
        return (<PageShell><Spinner className="justify-center py-20" /></PageShell>)
    }
    if (status === "not-found" || !trip) {
        return <TripNotFound />;
    }

    return (
        <PageShell>
            <BackLink href="/dashboard">My trips</BackLink>
            <PageHeader
                title={`${trip.FlyingFrom} → ${trip.FlyingTo}`}
                subtitle={`Flight ${trip.FlightNumber} · ${trip.FromDate} at ${trip.DepartureTime}`}
            />

            <Card className="grid gap-3">
                <div className="flex items-center gap-3">
                    <IconTile><SparklesIcon /></IconTile>
                    <h2 className="font-semibold text-slate-900">Tips for {trip.FlyingTo}</h2>
                </div>
                {tipsStatus === "loading" && <Spinner label="Getting tips…" />}
                {tipsStatus === "error" && (
                    <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm text-slate-500">Couldn&apos;t load tips right now.</p>
                        <Button size="sm" onClick={() => setTipsAttempt(n => n + 1)}>Try again</Button>
                    </div>
                )}
                {tipsStatus === "done" && tips && (
                    <ul className="grid gap-2 text-sm text-slate-600">
                        {tips.tips.map(tip => (
                            <li key={tip} className="flex gap-2">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden="true" />
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>

            <Card className="grid gap-2">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-slate-900">Pre-flight checklist</h2>
                    <span className="text-sm font-medium text-sky-600">{completion}% complete</span>
                </div>
                <ProgressBar progress={completion} />
            </Card>

            {tasksLoaded && tasks.length === 0 ? (
                <Card className="grid gap-3 text-center">
                    <p className="text-sm text-slate-500">This trip has no departure time, so a timeline can&apos;t be built.</p>
                    <Button variant="primary" onClick={() => router.push("/trip-setup")}>
                        Create a new trip
                    </Button>
                </Card>
            ) : (
                <ul className="grid gap-2">
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

            {completion === 100 ? (
                <Button variant="primary" size="lg" onClick={() => router.push(`/completion/${trip.id}`)}>
                    I&apos;m ready
                </Button>
            ) : (
                /* The packing list uses the tips' packing suggestions, so wait for them. */
                <Button
                    variant="primary"
                    size="lg"
                    disabled={tipsStatus === "loading"}
                    onClick={() => router.push(`/packing/${trip.id}`)}
                >
                    Let&apos;s pack
                </Button>
            )}
        </PageShell>
    );
}
