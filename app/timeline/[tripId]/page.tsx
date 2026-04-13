"use client"

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const todos = [
    { id: 1, title: "Check passport", done: false },
    { id: 2, title: "Book flights", done: false },
    { id: 3, title: "Reserve accommodation", done: false },
    { id: 4, title: "Arrange insurance", done: false },
    { id: 5, title: "Pack bags", done: false }

];


export default function Timeline() {

    const router = useRouter();

    const goToPackingPage = () => {

        router.push(`/packing/${trip.id}`)
    }

    const [tasks, setTasks] = useState(todos);

    const toggleTask = (id: number) => {
        setTasks(prev => prev.map(task => task.id === id ? { ...task, done: !task.done } : task)

        )
    };

    const completion = tasks.length ? Math.round(
        (tasks.filter(t => t.done).length / tasks.length) * 100) : 0;
    const [trip, setTrip] = useState<any>(null);

    useEffect(() => {
        const storedTrip = localStorage.getItem("trip");
        if (storedTrip) {
            setTrip(JSON.parse(storedTrip));
        }
    }, []);

    useEffect(() => {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    if (!trip) return <p>Loading trip...</p>;


    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-xl font-semibold mb-3">Pre-Flight Checklist ✈️</h1>
            <h2 className="text-sm text-gray-600 mb-4">
                {trip.FlyingFrom} → {trip.FlyingTo} | {trip.FromDate} → {trip.ToDate}
            </h2>
            {/* Progress bar */}
            <div className="bg-gray-200 rounded h-3 mb-4 overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${completion}%` }} />
            </div>
            <p className="text-sm mb-4">{completion}% complete</p>

            <ul className="space-y-3">
                {tasks.map(task => (
                    <li
                        key={task.id}
                        className="flex items-center gap-3 border p-3 rounded cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => toggleTask(task.id)}
                            className="h-5 w-5"
                        />
                        <span className={task.done ? "line-through text-gray-500" : ""}>
                            {task.title}
                        </span>
                    </li>
                ))}
            </ul>

            <div className="mt-6">
                <button
                    type="button"
                    onClick={goToPackingPage}
                    className="border p-2 rounded"
                >
                    Lets Pack!
                </button>
            </div>
        </div>

    );
}

