"use client"

import { useRouter } from "next/navigation"
import { saveTrip } from "@/lib/storage";
import PageShell, { PageHeader, BackLink } from "../components/PageShell";
import TripForm from "../components/TripForm";


export default function TripSetUp() {
    const router = useRouter();

    return (
        <PageShell width="sm">
            <BackLink href="/dashboard">My trips</BackLink>
            <PageHeader title="Add Your Flight" subtitle="Enter your flight details and we'll build your prep timeline." />
            <TripForm
                submitLabel="Plan my trip"
                onSave={(trip) => {
                    saveTrip(trip);
                    router.push(`/timeline/${trip.id}`);
                }}
            />
        </PageShell>
    );
}
