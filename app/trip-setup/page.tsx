"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Autocomplete from "../components/Autocomplete_location";
import { Trip, TripFormValues } from "@/app/types"
import { saveTrip } from "@/lib/storage";
import { findCountry } from "@/lib/countries";
import { validateTrip, normalizeFlightNumber, TripErrors } from "@/lib/validateTrip";
import PageShell, { PageHeader, BackLink } from "../components/PageShell";
import Card from "../components/Cards";
import Button from "../components/Button";
import FormField, { inputProps } from "../components/FormField";


export default function TripSetUp() {
    const [form, setForm] = useState<TripFormValues>({
        numberOfTravellers: "1",
        flyingFrom: "",
        flyingTo: "",
        fromDate: "",
        toDate: "",
        flightNumber: "",
        departureTime: "",
        budget: ""
    });
    const [errors, setErrors] = useState<TripErrors>({});
    const [submitted, setSubmitted] = useState(false);

    const router = useRouter();

    const update = (next: TripFormValues) => {
        setForm(next);
        if (submitted) setErrors(validateTrip(next, { now: new Date() }));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        update({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);

        const found = validateTrip(form, { now: new Date() });
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        const trip: Trip = {
            id: crypto.randomUUID(),
            ...form,
            flyingFrom: findCountry(form.flyingFrom)!,
            flyingTo: findCountry(form.flyingTo)!,
            flightNumber: normalizeFlightNumber(form.flightNumber),
            numberOfTravellers: Number(form.numberOfTravellers),
            budget: Number(form.budget)
        };

        saveTrip(trip)
        router.push(`/timeline/${trip.id}`);
    };

    return (
        <PageShell width="sm">
            <BackLink href="/dashboard">My trips</BackLink>
            <PageHeader title="Add Your Flight" subtitle="Enter your flight details and we'll build your prep timeline." />

            <Card>
                <form onSubmit={handleSubmit} noValidate className="grid gap-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Autocomplete
                            id="flyingFrom"
                            label="Flying from"
                            value={form.flyingFrom}
                            error={errors.flyingFrom}
                            onChangeAction={(value) => update({ ...form, flyingFrom: value })}
                        />
                        <Autocomplete
                            id="flyingTo"
                            label="Flying to"
                            value={form.flyingTo}
                            error={errors.flyingTo}
                            onChangeAction={(value) => update({ ...form, flyingTo: value })}
                        />
                    </div>

                    <FormField id="flightNumber" label="Flight number" error={errors.flightNumber}>
                        <input
                            {...inputProps("flightNumber", errors.flightNumber)}
                            type="text"
                            value={form.flightNumber}
                            onChange={handleChange}
                            placeholder="e.g. EI123"
                            maxLength={8}
                            autoCapitalize="characters"
                        />
                    </FormField>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField id="fromDate" label="Departure date" error={errors.fromDate}>
                            <input
                                {...inputProps("fromDate", errors.fromDate)}
                                type="date"
                                value={form.fromDate}
                                onChange={handleChange}
                            />
                        </FormField>
                        <FormField id="departureTime" label="Departure time" error={errors.departureTime}>
                            <input
                                {...inputProps("departureTime", errors.departureTime)}
                                type="time"
                                value={form.departureTime}
                                onChange={handleChange}
                            />
                        </FormField>
                    </div>

                    <FormField id="toDate" label="Return date" error={errors.toDate}>
                        <input
                            {...inputProps("toDate", errors.toDate)}
                            type="date"
                            value={form.toDate}
                            onChange={handleChange}
                            min={form.fromDate}
                        />
                    </FormField>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField id="numberOfTravellers" label="Travellers" error={errors.numberOfTravellers}>
                            <input
                                {...inputProps("numberOfTravellers", errors.numberOfTravellers)}
                                type="number"
                                inputMode="numeric"
                                min={1}
                                step={1}
                                value={form.numberOfTravellers}
                                onChange={handleChange}
                            />
                        </FormField>
                        <FormField id="budget" label="Budget" error={errors.budget}>
                            <input
                                {...inputProps("budget", errors.budget)}
                                type="text"
                                inputMode="decimal"
                                placeholder="e.g. 1500"
                                value={form.budget}
                                onChange={handleChange}
                            />
                        </FormField>
                    </div>

                    <Button type="submit" variant="primary" size="lg">Plan my trip</Button>
                </form>
            </Card>
        </PageShell>
    );

}
