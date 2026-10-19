
export interface Trip {
    id: string,
    numberOfTravellers: number,
    flyingFrom: string,
    flyingTo: string,
    fromDate: string,
    toDate: string,
    flightNumber: string,
    departureTime: string,
    budget: number
}

// What the trip form holds while the user is typing: <input> elements always
// produce strings, so every field is a string until it is parsed on submit.
export type TripFormValues = { [K in keyof Omit<Trip, "id">]: string }


export interface TimeLineTask{
    id: number,
    title: string,
    done: boolean,
    dueAt: string
}


export interface PackingItem {
    id: number,
    name: string,
    category: string,
    packed: boolean
}


export interface TravelTips {
    tips: string[],
    packingItems: { name: string, category: string }[]
}

export interface TravelResult {
  trip: string,
  weather: string,
  flights: string,
  hotel: string
};

