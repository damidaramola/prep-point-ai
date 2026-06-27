
export interface Trip {
    id: string,
    NumberofTravellers: number,
    FlyingFrom: string,
    FlyingTo: string,
    FromDate: string,
    ToDate: string,
    Budget: string
}


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