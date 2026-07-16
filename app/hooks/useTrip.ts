"use client"

import {useState, useEffect} from "react";
import { useParams } from "next/navigation";
import {Trip} from "@/app/types";
import {getTrip} from "@/lib/storage";


type TripStatus = "loading"| "found"| "not-found";

export function useTrip(){
    const {tripId} = useParams();
    const [trip,setTrip] = useState<Trip| null>(null);
    const [status, setStatus] = useState<TripStatus>("loading")

    useEffect(()=>{
        if (!tripId || typeof tripId !== 'string') {
            setStatus("not-found");
            return 
        }
        const fetchedTrip = getTrip(tripId)
    
        if(fetchedTrip){
            setTrip(fetchedTrip)
            setStatus("found")
        }
        else{
            setStatus("not-found")
        }

    },[tripId]

    )
}