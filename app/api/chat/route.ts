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
  
  `
  const result = await model.generateContent(prompt);
  const text = (await result.response).text(); // get text output

  return Response.json({text})

}



