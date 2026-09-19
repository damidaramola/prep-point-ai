"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Autocomplete from "../components/Autocomplete_location";
import { Trip, TripFormValues } from "@/app/types"
import { saveTrip } from "@/lib/storage";


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


        <div style={{ padding: "2rem" }}>
            <h1 className="flex flex-col gap-4 w-72 mx-auto">Create Flight Plan</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-72 mx-auto">

                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Number of Travellers</label>
                    <input
                        className="border p-2 rounded"
                        type="number"
                        min={1}
                        step={1}
                        name="NumberofTravellers"
                        value={form.NumberofTravellers}
                        onChange={handleChange}
                        required
                    />
                </div>

                <Autocomplete
                    label="Flying From"
                    value={form.FlyingFrom}
                    onChangeAction={(value) =>
                        setForm({ ...form, FlyingFrom: value })
                    }
                />


                <Autocomplete
                    label="Flying To"
                    value={form.FlyingTo}
                    onChangeAction={(value) =>
                        setForm({ ...form, FlyingTo: value })
                    }
                />

                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Flight Number</label>
                    <input
                        className="border p-2 rounded uppercase"
                        type="text"
                        name="FlightNumber"
                        value={form.FlightNumber}
                        onChange={handleChange}
                        placeholder="e.g. EI123"
                        pattern="[A-Za-z0-9]{2}\s?[0-9]{1,4}"
                        title="Airline code followed by the flight number, e.g. EI123"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Departure Date</label>
                    <input
                        className="border p-2 rounded"
                        type="date"
                        name="FromDate"
                        value={form.FromDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Departure Time</label>
                    <input
                        className="border p-2 rounded"
                        type="time"
                        name="DepartureTime"
                        value={form.DepartureTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Return Date</label>
                    <input
                        className="border p-2 rounded"
                        type="date"
                        name="ToDate"
                        value={form.ToDate}
                        onChange={handleChange}
                        required
                        min={form.FromDate}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Budget</label>
                    <input
                        type="number"
                        min={0}
                        className="border p-2 rounded"
                        name="Budget"
                        value={form.Budget}
                        onChange={handleChange}
                        required
                    />
                </div>


                < div className="flex flex-col">

                    <button
                        type="submit"
                        className="border p-2 rounded"
                    >
                        Plan my trip!
                    </button>
                </div>
            </form>


        </div>
    );

}
