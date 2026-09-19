
export interface Trip {
    id: string,
    NumberofTravellers: number,
    FlyingFrom: string,
    FlyingTo: string,
    FromDate: string,
    ToDate: string,
    FlightNumber: string,
    DepartureTime: string,
    Budget: number
}

// What the trip form holds while the user is typing: <input> elements always
// produce strings, so every field is a string until it is parsed on submit.
export type TripFormValues = { [K in keyof Omit<Trip, "id">]: string }


export interface TimeLineTask{
    id: number,
    title: string,
    done: boolean
}


export interface PackingItem {
    id: number,
    name: string,
    category: string,
    packed: boolean
}



export interface TravelResult {
  trip: string,
  weather: string,
  flights: string,
  hotel: string
};

//define flight Details Later
// export interface FlightDetails{

// }