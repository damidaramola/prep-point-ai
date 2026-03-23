"use client"

import React from "react"
import { useState } from "react"
import { FormEvent } from "react";

export default function Onboarding() {

    const [form, setForm] = useState({
        NumberofTravellers: 0,
        FlyingFrom: "",
        FlyingTo: "",
        FromDate: "",
        ToDate: "",
        Budget: ""

    })

    const [result, setResult] = useState("");
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(form),


            });

            const data = await res.json();

            setResult(data.text);


        }
        catch (err) {
            console.error(err)
        }
    }

    return (


        <div style={{ padding: "2rem" }}>
            <h1 className="flex flex-col gap-4 w-72 mx-auto">Create Flight Plan</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-72 mx-auto">

                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Number of Travellers</label>
                    <input
                        className="border p-2 rounded"
                        name="NumberofTravellers"
                        value={form.NumberofTravellers}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Flying From</label>
                    <input
                        className="border p-2 rounded"
                        name="FlyingFrom"
                        value={form.FlyingFrom}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Flying To</label>
                    <input
                        className="border p-2 rounded"
                        name="FlyingTo"
                        value={form.FlyingTo}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 font-medium">From Date</label>
                    <input
                        className="border p-2 rounded"
                        type="date"
                        name="FromDate"
                        value={form.FromDate}
                        onChange={handleChange}
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
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Budget</label>
                    <input
                        className="border p-2 rounded"
                        name="Budget"
                        value={form.Budget}
                        onChange={handleChange}
                    />
                </div>


                <button type="submit" className="border p-2 rounded"
                >Plan my trip!</button>
            </form>

            {result && (
                <div className="mt-6 p-4 bg-blue-100 rounded">
                    <h2>Your Trip</h2>
                    <p className="whitespace-pre-line">{result}</p>
                </div>
            )}
        </div>
    );

}
