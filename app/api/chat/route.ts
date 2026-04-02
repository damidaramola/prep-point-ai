import { model } from "../../../lib/gemini";

export async function POST(req: Request) {
  const form = await req.json();

  const prompt = `
  You are a travel planner AI.

Create a trip summary based on:

- Number of travellers: ${form.NumberofTravellers}
- From: ${form.FlyingFrom}
- To: ${form.FlyingTo}
- Dates: ${form.FromDate} to ${form.ToDate}
- Budget: ${form.Budget}

Generate:
1. Travel route
2. Weather summary
3. Flight recommendation
4. Hotel recommendation

Return a structured travel plan in this format:

TRIP:
[route]

WEATHER:
[weather summary]

FLIGHTS:
[flight recommendation]

HOTEL:
[hotel recommendation]

make sure to summarise the weather, flights and hotel expectations to 1-2 lines

this is an example of what the output should look like:

Your Trip Plan 

${form.FromDate} to  ${form.ToDate}

 ${form.FlyingFrom} ->  ${form.FlyingTo}

 Weather:
 You can expect the weather to be quite mild. Low will be 19° and high will be 25° (replace this text with the actual expected weather)

 Flights
 The best option for you is with Delta Airlines with a layover in Oslo((replace this text with flights appropriate for ${form.FlyingFrom} to  ${form.FlyingTo} )

 Hotel:

 We recommend you stay at the Premiere Inn hotel in central Paris (replace this text with the best possible hotel/accomodation option for the trip)

 Return ONLY valid JSON in this format:

 ${JSON.stringify(form)} 

{
  "trip": "",
  "weather": "",
  "flights": "",
  "hotel": ""
}
  
  `
  const result = await model.generateContent(prompt);
  const text = (await result.response).text(); // get text output

  const data = JSON.parse(text)

  return Response.json({data})

}



