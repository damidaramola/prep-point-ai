"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PageShell, { PageHeader } from "../components/PageShell"
import Card from "../components/Cards"
import Button from "../components/Button"
import IconTile from "../components/IconTile"
import { SparklesIcon, ClockIcon, CheckCircleIcon, GaugeIcon } from "../components/Icons"
import { getAllTrips } from "@/lib/storage"

const features = [
    { icon: <SparklesIcon />, title: "AI travel tips", text: "Tips and packing suggestions tailored to your destination and dates." },
    { icon: <ClockIcon />, title: "Smart timeline", text: "A prep schedule worked back from your departure time, from check-in to boarding." },
    { icon: <CheckCircleIcon />, title: "Packing checklist", text: "Pack by category and watch your progress fill up as you go." },
    { icon: <GaugeIcon />, title: "Readiness score", text: "See how ready you are for every trip at a glance." },
]

export default function LandingPage() {
    const router = useRouter()
    const [hasTrips, setHasTrips] = useState(false)

    useEffect(() => {
        setHasTrips(getAllTrips().length > 0)
    }, [])

    return (
        <PageShell width="sm">
            <PageHeader
                title="PrepPoint AI"
                subtitle="Never miss a flight again. Smart preparation from the moment you book to the moment you board."
            />

            <ul className="grid gap-3">
                {features.map(feature => (
                    <li key={feature.title}>
                        <Card className="flex gap-4 p-4">
                            <IconTile>{feature.icon}</IconTile>
                            <div>
                                <h2 className="font-semibold text-slate-900">{feature.title}</h2>
                                <p className="text-sm text-slate-500">{feature.text}</p>
                            </div>
                        </Card>
                    </li>
                ))}
            </ul>

            <div className="grid gap-3 text-center">
                <Button variant="primary" size="lg" onClick={() => router.push("/trip-setup")}>Get started</Button>
                {hasTrips && (
                    <Link href="/dashboard" className="text-sm font-medium text-sky-600 hover:text-sky-700">View my trips</Link>
                )}
            </div>
        </PageShell>
    )
}
