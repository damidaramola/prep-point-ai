"use client"

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trip } from "@/app/types";
import { getAllTrips, getPackingItems, deleteTrip } from "@/lib/storage";
import { getConfidence } from "@/lib/confidence";
import { getDepatureDateTime } from "@/lib/timeline";
import Button from "@/app/components/Button";
import Card from "@/app/components/Cards";
import ProgressBar from "@/app/components/ProgressBar";
import Spinner from "@/app/components/Spinner";
import IconTile from "@/app/components/IconTile";
import { PlaneIcon, CalendarIcon, LuggageIcon, CheckCircleIcon, PlusIcon } from "@/app/components/Icons";

interface TripSummary {
    trip: Trip;
    confidence: number;
    departure: Date | null;
}

interface CategoryStatus {
    category: string;
    packed: number;
    total: number;
}

const DAY = 24 * 60 * 60 * 1000;
const PAGE_SIZE = 5;

function formatDate(date: string): string {
    return new Date(`${date}T00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function departsIn(departure: Date, now: number): string {
    const days = Math.ceil((departure.getTime() - now) / DAY);
    if (days <= 0) return "Departs today";
    if (days === 1) return "Departs tomorrow";
    return `Departs in ${days} days`;
}

function loadSummaries(): TripSummary[] {
    return getAllTrips()
        .map(trip => ({ trip, confidence: getConfidence(trip.id), departure: getDepatureDateTime(trip) }))
        .sort((a, b) => (a.departure?.getTime() ?? Infinity) - (b.departure?.getTime() ?? Infinity));
}

function packingByCategory(tripId: string): CategoryStatus[] {
    const groups = new Map<string, CategoryStatus>();
    for (const item of getPackingItems(tripId)) {
        const group = groups.get(item.category) ?? { category: item.category, packed: 0, total: 0 };
        group.total += 1;
        if (item.packed) group.packed += 1;
        groups.set(item.category, group);
    }
    return [...groups.values()];
}

export default function Dashboard() {
    const router = useRouter();
    const [summaries, setSummaries] = useState<TripSummary[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [now, setNow] = useState(0);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setSummaries(loadSummaries());
        setNow(Date.now());
        setLoaded(true);
    }, []);

    const upcoming = summaries.find(s => s.departure && s.departure.getTime() > now) ?? null;
    const upcomingPacking = upcoming ? packingByCategory(upcoming.trip.id) : [];
    const selected = summaries.find(s => s.trip.id === selectedId) ?? null;

    const totalPages = Math.max(1, Math.ceil(summaries.length / PAGE_SIZE));
    // Clamped so deleting the last trip on the final page falls back to the previous page.
    const currentPage = Math.min(page, totalPages);
    const visible = summaries.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const goToPage = (next: number) => {
        setPage(next);
        setSelectedId(null);
        setConfirmingDelete(false);
    };

    const selectTrip = (id: string) => {
        setSelectedId(current => (current === id ? null : id));
        setConfirmingDelete(false);
    };

    const handleDelete = (id: string) => {
        deleteTrip(id);
        setSummaries(loadSummaries());
        setSelectedId(null);
        setConfirmingDelete(false);
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 text-slate-800">
            <div className="mx-auto max-w-5xl px-4 py-8 grid gap-8">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-cyan-400 text-white shadow-sm">
                            <PlaneIcon />
                        </span>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Your Trips</h1>
                            <p className="text-sm text-slate-500">Everything you need before you fly.</p>
                        </div>
                    </div>
                    <Button variant="primary" onClick={() => router.push("/trip-setup")}>
                        <span className="flex items-center gap-2"><PlusIcon /> New trip</span>
                    </Button>
                </header>

                <div className="grid gap-6 lg:grid-cols-[1fr_300px] items-start">
                    <section className="grid gap-4 min-w-0">
                        {!loaded && <Spinner />}

                        {loaded && summaries.length === 0 && (
                            <Card className="text-center py-12 grid justify-items-center gap-3">
                                <IconTile><PlaneIcon /></IconTile>
                                <p className="font-semibold text-slate-900">No trips yet</p>
                                <p className="text-sm text-slate-500 max-w-xs">Add your flight details and we&apos;ll build your prep timeline and packing list.</p>
                                <Button variant="primary" onClick={() => router.push("/trip-setup")}>Plan a trip</Button>
                            </Card>
                        )}

                        {visible.map(({ trip, confidence }) => (
                            <Fragment key={trip.id}>
                            <button
                                type="button"
                                onClick={() => selectTrip(trip.id)}
                                aria-pressed={trip.id === selectedId}
                                className={`text-left bg-white border rounded-xl shadow-sm p-5 flex gap-4 transition hover:border-sky-300 focus-visible:outline-2 focus-visible:outline-sky-500 ${trip.id === selectedId ? "border-sky-400 ring-2 ring-sky-100" : "border-slate-200"}`}
                            >
                                <IconTile><PlaneIcon /></IconTile>
                                <span className="grid gap-2 flex-1 min-w-0">
                                    <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                                        <span className="font-semibold text-slate-900">{trip.FlyingFrom} → {trip.FlyingTo}</span>
                                        <span className="text-xs font-medium text-sky-600">{confidence}% ready</span>
                                    </span>
                                    <span className="text-sm text-slate-500">{formatDate(trip.FromDate)} · Flight {trip.FlightNumber}</span>
                                    <ProgressBar progress={confidence} />
                                </span>
                            </button>

                        {selected && selected.trip.id === trip.id && (
                            <Card className="grid gap-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Trip details</p>
                                        <h2 className="text-xl font-bold text-slate-900">{selected.trip.FlyingFrom} → {selected.trip.FlyingTo}</h2>
                                    </div>
                                    <Button size="sm" onClick={() => setSelectedId(null)}>Close</Button>
                                </div>

                                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
                                    <dt className="text-slate-500">Flight</dt>
                                    <dd className="font-medium">{selected.trip.FlightNumber}</dd>
                                    <dt className="text-slate-500">Departure</dt>
                                    <dd className="font-medium">{formatDate(selected.trip.FromDate)} at {selected.trip.DepartureTime}</dd>
                                    <dt className="text-slate-500">Return</dt>
                                    <dd className="font-medium">{formatDate(selected.trip.ToDate)}</dd>
                                    <dt className="text-slate-500">Travellers</dt>
                                    <dd className="font-medium">{selected.trip.NumberofTravellers}</dd>
                                    <dt className="text-slate-500">Budget</dt>
                                    <dd className="font-medium">{selected.trip.Budget}</dd>
                                </dl>

                                <div className="flex flex-wrap gap-2">
                                    <Button variant="primary" onClick={() => router.push(`/timeline/${selected.trip.id}`)}>Open timeline</Button>
                                    <Button onClick={() => router.push(`/packing/${selected.trip.id}`)}>Packing list</Button>
                                    {!confirmingDelete && (
                                        <Button onClick={() => setConfirmingDelete(true)}>
                                            <span className="text-red-600">Delete trip</span>
                                        </Button>
                                    )}
                                </div>

                                {confirmingDelete && (
                                    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-800">
                                        <span className="flex-1 min-w-48">Delete this trip and its checklists? This can&apos;t be undone.</span>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(selected.trip.id)}>Yes, delete</Button>
                                        <Button size="sm" onClick={() => setConfirmingDelete(false)}>Cancel</Button>
                                    </div>
                                )}
                            </Card>
                        )}
                            </Fragment>
                        ))}

                        {totalPages > 1 && (
                            <nav aria-label="Trip pages" className="flex items-center justify-between gap-3">
                                <Button size="sm" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>Previous</Button>
                                <span className="text-sm text-slate-500">Page {currentPage} of {totalPages}</span>
                                <Button size="sm" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>Next</Button>
                            </nav>
                        )}
                    </section>

                    <aside className="grid gap-4 min-w-0">
                        <Card className="grid gap-3">
                            <div className="flex items-center gap-3">
                                <IconTile><CalendarIcon /></IconTile>
                                <h2 className="font-semibold text-slate-900">Upcoming trip</h2>
                            </div>
                            {upcoming && upcoming.departure ? (
                                <>
                                    <p className="text-lg font-bold text-slate-900">{upcoming.trip.FlyingTo}</p>
                                    <p className="text-sm text-slate-500">{departsIn(upcoming.departure, now)} · Flight {upcoming.trip.FlightNumber}</p>
                                    <ProgressBar progress={upcoming.confidence} />
                                    <p className="text-xs text-slate-500">{upcoming.confidence}% ready</p>
                                </>
                            ) : (
                                <p className="text-sm text-slate-500">No upcoming flights.</p>
                            )}
                        </Card>

                        {upcoming && (
                            <Card className="grid gap-3">
                                <div className="flex items-center gap-3">
                                    <IconTile><LuggageIcon /></IconTile>
                                    <h2 className="font-semibold text-slate-900">Packing checklist</h2>
                                </div>
                                {upcomingPacking.length === 0 ? (
                                    <p className="text-sm text-slate-500">Not started yet.</p>
                                ) : (
                                    <ul className="grid gap-2">
                                        {upcomingPacking.map(({ category, packed, total }) => (
                                            <li key={category} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                                                <span>{category}</span>
                                                {packed === total ? (
                                                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                                                        <CheckCircleIcon className="h-3.5 w-3.5" /> Ready
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-500">{packed}/{total} packed</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <Button size="sm" onClick={() => router.push(`/packing/${upcoming.trip.id}`)}>Open packing list</Button>
                            </Card>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}
