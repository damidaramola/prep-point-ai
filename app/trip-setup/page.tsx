"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Autocomplete from "../components/Autocomplete_location";
import { Trip, TripFormValues } from "@/app/types"
import { saveTrip } from "@/lib/storage";
import PageShell, { PageHeader, BackLink } from "../components/PageShell";
import Card from "../components/Cards";
import Button from "../components/Button";
import FormField, { inputClass } from "../components/FormField";


export default function TripSetUp() {
    const [form, setForm] = useState<TripFormValues>({
        NumberofTravellers: "1",
        FlyingFrom: "",
        FlyingTo: "",
        FromDate: "",
        ToDate: "",
        FlightNumber: "",
        DepartureTime: "",
        Budget: ""
    });


    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (form.ToDate < form.FromDate) {
            alert("Return date must not be before departure date");
            return;
        }

        const travellers = Number(form.NumberofTravellers);
        const budget = Number(form.Budget);

        if (!Number.isInteger(travellers) || travellers < 1) {
            alert("Number of travellers must be a whole number of 1 or more");
            return;
        }
        if (Number.isNaN(budget) || budget < 0) {
            alert("Budget must be a number of 0 or more");
            return;
        }

        const trip: Trip = {
            id: crypto.randomUUID(),
            ...form,
            FlightNumber: form.FlightNumber.trim().toUpperCase(),
            NumberofTravellers: travellers,
            Budget: budget
        };

        saveTrip(trip)
        router.push(`/timeline/${trip.id}`);
    };

    return (
        <PageShell width="sm">
            <BackLink href="/dashboard">My trips</BackLink>
            <PageHeader title="Add Your Flight" subtitle="Enter your flight details and we'll build your prep timeline." />

            <Card>
                <form onSubmit={handleSubmit} className="grid gap-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Autocomplete
                            id="FlyingFrom"
                            label="Flying from"
                            value={form.FlyingFrom}
                            onChangeAction={(value) =>
                                setForm({ ...form, FlyingFrom: value })
                            }
                        />
                        <Autocomplete
                            id="FlyingTo"
                            label="Flying to"
                            value={form.FlyingTo}
                            onChangeAction={(value) =>
                                setForm({ ...form, FlyingTo: value })
                            }
                        />
                    </div>

                    <FormField id="FlightNumber" label="Flight number">
                        <input
                            id="FlightNumber"
                            className={`${inputClass} uppercase`}
                            type="text"
                            name="FlightNumber"
                            value={form.FlightNumber}
                            onChange={handleChange}
                            placeholder="e.g. EI123"
                            pattern="[A-Za-z0-9]{2}\s?[0-9]{1,4}"
                            title="Airline code followed by the flight number, e.g. EI123"
                            required
                        />
                    </FormField>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField id="FromDate" label="Departure date">
                            <input
                                id="FromDate"
                                className={inputClass}
                                type="date"
                                name="FromDate"
                                value={form.FromDate}
                                onChange={handleChange}
                                required
                            />
                        </FormField>
                        <FormField id="DepartureTime" label="Departure time">
                            <input
                                id="DepartureTime"
                                className={inputClass}
                                type="time"
                                name="DepartureTime"
                                value={form.DepartureTime}
                                onChange={handleChange}
                                required
                            />
                        </FormField>
                    </div>

                    <FormField id="ToDate" label="Return date">
                        <input
                            id="ToDate"
                            className={inputClass}
                            type="date"
                            name="ToDate"
                            value={form.ToDate}
                            onChange={handleChange}
                            required
                            min={form.FromDate}
                        />
                    </FormField>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField id="NumberofTravellers" label="Travellers">
                            <input
                                id="NumberofTravellers"
                                className={inputClass}
                                type="number"
                                min={1}
                                step={1}
                                name="NumberofTravellers"
                                value={form.NumberofTravellers}
                                onChange={handleChange}
                                required
                            />
                        </FormField>
                        <FormField id="Budget" label="Budget">
                            <input
                                id="Budget"
                                className={inputClass}
                                type="number"
                                min={0}
                                name="Budget"
                                value={form.Budget}
                                onChange={handleChange}
                                required
                            />
                        </FormField>
                    </div>

                    <Button type="submit" variant="primary" size="lg">Plan my trip</Button>
                </form>
            </Card>
        </PageShell>
    );

}
