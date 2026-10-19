"use client"

import { useRouter } from "next/navigation"
import { useTrip } from "@/app/hooks/useTrip";
import { applyTripEdit } from "@/lib/editTrip";
import PageShell, { PageHeader, BackLink } from "@/app/components/PageShell";
import TripForm from "@/app/components/TripForm";
import TripNotFound from "@/app/components/TripNotFound";
import Spinner from "@/app/components/Spinner";


export default function EditTrip() {
    const router = useRouter();
    const { trip, status } = useTrip();

    if (status === "loading") {
        return (<PageShell><Spinner className="justify-center py-20" /></PageShell>);
    }
    if (status === "not-found" || !trip) {
        return <TripNotFound />;
    }

    return (
        <PageShell width="sm">
            <BackLink href={`/timeline/${trip.id}`}>Back to timeline</BackLink>
            <PageHeader title="Edit Your Flight" subtitle="Changing your dates or destination updates your timeline and tips." />
            <TripForm
                initial={trip}
                submitLabel="Save changes"
                onSave={(updated) => {
                    applyTripEdit(trip, updated);
                    router.push(`/timeline/${updated.id}`);
                }}
            />
        </PageShell>
    );
}
