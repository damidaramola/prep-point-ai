"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTrip } from "@/app/hooks/useTrip";
import { getConfidence } from "@/lib/confidence";
import PageShell, { PageHeader, BackLink } from "@/app/components/PageShell";
import TripNotFound from "@/app/components/TripNotFound";
import Card from "@/app/components/Cards";
import Button from "@/app/components/Button";
import ProgressBar from "@/app/components/ProgressBar";
import Spinner from "@/app/components/Spinner";
import { CheckCircleIcon } from "@/app/components/Icons";

export default function CompletionPage() {
    const router = useRouter();
    const { trip, status } = useTrip();
    const [confidence, setConfidence] = useState<number | null>(null);

    useEffect(() => {
        if (status !== "found" || !trip) return;
        setConfidence(getConfidence(trip.id));
    }, [status, trip]);

    if (status === "loading" || (status === "found" && confidence === null)) {
        return (<PageShell><Spinner className="justify-center py-20" /></PageShell>);
    }
    if (status === "not-found" || !trip || confidence === null) {
        return <TripNotFound />;
    }

    const ready = confidence === 100;

    return (
        <PageShell width="sm">
            <BackLink href={`/timeline/${trip.id}`}>Back to timeline</BackLink>
            <PageHeader
                title={ready ? `You're ready for ${trip.FlyingTo}!` : "Almost there"}
                subtitle={ready
                    ? "Every task is done and your bags are packed. Have a great trip."
                    : "You've finished your timeline, but a few things are still unchecked."}
                icon={<CheckCircleIcon className="h-7 w-7" />}
            />

            <Card className="grid gap-4">
                <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-slate-900">Readiness</h2>
                        <span className="text-sm font-medium text-sky-600">{confidence}%</span>
                    </div>
                    <ProgressBar progress={confidence} />
                </div>

                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t border-slate-100 pt-4 text-sm">
                    <dt className="text-slate-500">Route</dt>
                    <dd className="font-medium">{trip.FlyingFrom} → {trip.FlyingTo}</dd>
                    <dt className="text-slate-500">Flight</dt>
                    <dd className="font-medium">{trip.FlightNumber}</dd>
                    <dt className="text-slate-500">Departs</dt>
                    <dd className="font-medium">{trip.FromDate} at {trip.DepartureTime}</dd>
                    <dt className="text-slate-500">Returns</dt>
                    <dd className="font-medium">{trip.ToDate}</dd>
                </dl>
            </Card>

            <div className="grid gap-3">
                {!ready && (
                    <Button onClick={() => router.push(`/packing/${trip.id}`)}>Finish packing</Button>
                )}
                <Button variant="primary" size="lg" onClick={() => router.push("/dashboard")}>Go to my trips</Button>
            </div>
        </PageShell>
    );
}
