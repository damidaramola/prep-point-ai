"use client"

import React, { useState } from "react"
import Autocomplete from "./Autocomplete_location";
import Card from "./Cards";
import Button from "./Button";
import FormField, { inputProps } from "./FormField";
import { Trip, TripFormValues } from "@/app/types"
import { findCountry } from "@/lib/countries";
import { validateTrip, normalizeFlightNumber, TripErrors } from "@/lib/validateTrip";

const EMPTY_FORM: TripFormValues = {
    numberOfTravellers: "1",
    flyingFrom: "",
    flyingTo: "",
    fromDate: "",
    toDate: "",
    flightNumber: "",
    departureTime: "",
    budget: ""
};

function toFormValues(trip: Trip): TripFormValues {
    return {
        numberOfTravellers: String(trip.numberOfTravellers),
        flyingFrom: trip.flyingFrom,
        flyingTo: trip.flyingTo,
        fromDate: trip.fromDate,
        toDate: trip.toDate,
        flightNumber: trip.flightNumber,
        departureTime: trip.departureTime,
        budget: String(trip.budget)
    };
}

interface TripFormProps {
    initial?: Trip;
    submitLabel: string;
    onSave: (trip: Trip) => void;
}

export default function TripForm({ initial, submitLabel, onSave }: TripFormProps) {
    const [form, setForm] = useState<TripFormValues>(initial ? toFormValues(initial) : EMPTY_FORM);
    const [errors, setErrors] = useState<TripErrors>({});
    const [submitted, setSubmitted] = useState(false);

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

        onSave({
            id: initial?.id ?? crypto.randomUUID(),
            ...form,
            flyingFrom: findCountry(form.flyingFrom)!,
            flyingTo: findCountry(form.flyingTo)!,
            flightNumber: normalizeFlightNumber(form.flightNumber),
            numberOfTravellers: Number(form.numberOfTravellers),
            budget: Number(form.budget)
        });
    };

    return (
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

                <Button type="submit" variant="primary" size="lg">{submitLabel}</Button>
            </form>
        </Card>
    );
}
