"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Autocomplete from "../components/Autocomplete_location";


export default function TripSetUp() {
    const [form, setForm] = useState({
        NumberofTravellers: 0,
        FlyingFrom: "",
        FlyingTo: "",
        FromDate: "",
        ToDate: "",
        Budget: ""

    })



    const router = useRouter();

    // const [loading, setloading] = useState(false);

    // const [result, setResult] = useState("");
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (form.ToDate < form.FromDate) {
            alert("Return date must not be before departure date");
            return;
        }

        const tripId = crypto.randomUUID();

        const trip = {
            id: tripId,
            ...form
        };

        localStorage.setItem(`trip-${tripId}`, JSON.stringify(trip));
        router.push(`/timeline/${tripId}`);
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
                    <label className="mb-1 font-medium">From Date</label>
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
                    <label className="mb-1 font-medium">To Date</label>
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
