"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Autocomplete from "../components/Autocomplete_location";


export default function Onboarding() {

    const [form, setForm] = useState({
        NumberofTravellers: 0,
        FlyingFrom: "",
        FlyingTo: "",
        FromDate: "",
        ToDate: "",
        Budget: ""

    })

    const [loading, setloading] = useState(false);

    const [result, setResult] = useState("");
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    const router = useRouter();

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(form.ToDate < form.FromDate){
            alert("Return date must not be before depature date")
            return;
        }
        setloading(true)
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(form),


            });
            console.log("STATUS:", res.status);




            if (!res.ok) {
                throw new Error("API failed")
            }


            const data = await res.json();

            localStorage.setItem("travelResult", JSON.stringify(data));
            localStorage.setItem("travelForm", JSON.stringify(form));

            router.push("/result");

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
                        className="border p-2 rounded"
                        name="Budget"
                        value={form.Budget}
                        onChange={handleChange}
                        required
                    />
                </div>


                {loading ? (
                    <div className="flex justify-center">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <button
                        type="submit"
                        className="border p-2 rounded"
                    >
                        Plan my trip!
                    </button>
                )}
            </form>


        </div>
    );

}
