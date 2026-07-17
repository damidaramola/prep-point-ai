"use client"

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveTasks, getTasks, getPackingComplete } from "@/lib/storage";
import { useTrip } from "@/app/hooks/useTrip";
import Button from "@/app/components/Buttons";

const todos = [
    { id: 1, title: "Check passport", done: false },
    { id: 2, title: "Book flights", done: false },
    { id: 3, title: "Reserve accommodation", done: false },
    { id: 4, title: "Arrange insurance", done: false },
    { id: 5, title: "Pack bags", done: false }

];


export default function Timeline() {

    const router = useRouter();
    const {trip,status,tripId} = useTrip();
    const [tasks, setTasks] = useState(todos);
    const [tasksLoaded, setTasksLoaded] = useState(false);

    const toggleTask = (id: number) => {
        setTasks(prev =>
            prev.map(task => task.id === id ? { ...task, done: !task.done } : task)
        );
    };
    const completion = tasks.length
        ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100)
        : 0;



    useEffect(() => {
        if (!tripId || typeof tripId !== "string") return;
        const storedTasks = getTasks(tripId)
        if (storedTasks.length> 0) {
            setTasks(storedTasks)
        } else {
            setTasks(todos);
        }
        setTasksLoaded(true);
    }, [tripId]);

    useEffect(() => {
        if (!tasksLoaded || !tripId || typeof tripId !== "string") return;
        saveTasks(tripId, tasks)
    }, [tasks, tripId, tasksLoaded]);


    useEffect(() => {
        if (!tripId || typeof tripId !== "string") return;

        const isPacked = getPackingComplete(tripId)

        if (isPacked === true) {
            setTasks(prev =>
                prev.map(task =>
                    task.title === "Pack bags"
                        ? { ...task, done: true }
                        : task
                )
            );
        }
    }, [trip]


    );

if(status === "loading"){
    return(<div>Loading..</div>)
     
}
else if(
    status ==="not-found"
){
    
        return (<div>Trip not found<Button variant="secondary" size="md"  onClick={() => router.push("/landing")}
 >go to landing page</Button></div>);
    
}
    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-xl font-semibold mb-3">Pre-Flight Checklist ✈️</h1>
            <h2 className="text-sm text-gray-600 mb-4">
                {trip?.FlyingFrom} → {trip?.FlyingTo} | {trip?.FromDate} → {trip?.ToDate}
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
                    onClick={() => router.push(`/packing/${tripId}`)}
                    className="border p-2 rounded"
                >
                    Lets Pack!
                </button>
            </div>


        </div>

    );
}

