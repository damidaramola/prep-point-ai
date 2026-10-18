"use client"

import { useRouter } from "next/navigation";
import PageShell from "./PageShell";
import Card from "./Cards";
import Button from "./Button";

export default function TripNotFound() {
    const router = useRouter();
    return (
        <PageShell width="sm">
            <Card className="grid justify-items-center gap-3 py-10 text-center">
                <h1 className="text-xl font-bold text-slate-900">Trip not found</h1>
                <p className="text-sm text-slate-500">It may have been deleted, or the link is incomplete.</p>
                <Button variant="primary" onClick={() => router.push("/dashboard")}>Go to my trips</Button>
            </Card>
        </PageShell>
    );
}
