import { model } from "@/lib/gemini";
import { Trip, TripFormValues } from "@/app/types";
import { validateTrip } from "@/lib/validateTrip";
import { findCountry } from "@/lib/countries";

const CATEGORIES = ["Clothing", "Toiletries", "Documents", "Electronics"];
const FORM_FIELDS: (keyof TripFormValues)[] = [
    "numberOfTravellers", "flyingFrom", "flyingTo", "fromDate", "toDate", "flightNumber", "departureTime", "budget",
];

export async function POST(req: Request) {
    let trip: Trip;
    try {
        trip = await req.json();
    } catch {
        return Response.json({ error: "Request body must be a trip" }, { status: 400 });
    }

    const values = Object.fromEntries(
        FORM_FIELDS.map(field => [field, String(trip?.[field] ?? "")])
    ) as TripFormValues;
    const errors = validateTrip(values, { now: new Date(), checkDates: false });
    if (Object.keys(errors).length > 0) {
        return Response.json({ error: "Invalid trip", fields: errors }, { status: 400 });
    }

    const prompt = `
    You are a travel assistant helping someone prepare for a flight.

    Trip:
    - Flying from: ${findCountry(values.flyingFrom)}
    - Flying to: ${findCountry(values.flyingTo)}
    - Dates: ${trip.fromDate} to ${trip.toDate}
    - Number of travellers: ${trip.numberOfTravellers}

    Give:
    1. 3 to 5 short, practical tips for this destination, based on the typical weather there at that time of year.
    2. 8 to 12 items they should pack for this trip.

    Each packing item's category must be one of: ${CATEGORIES.join(", ")}.

    Return ONLY one JSON object, with no markdown and no backticks, in exactly this shape:
    {
      "tips": ["..."],
      "packingItems": [{ "name": "...", "category": "..." }]
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // remove markdown if present, then keep only the JSON object
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON in model response");
        }

        const data = JSON.parse(jsonMatch[0]);
        if (!Array.isArray(data.tips) || !Array.isArray(data.packingItems)) {
            throw new Error("Model response has the wrong shape");
        }

        return Response.json({
            tips: data.tips,
            packingItems: data.packingItems.filter(
                (item: { name?: unknown; category?: unknown }) =>
                    typeof item.name === "string" && CATEGORIES.includes(item.category as string)
            ),
        });
    } catch (error) {
        console.error("travel-tips failed", error);
        return Response.json({ error: "Could not generate travel tips" }, { status: 500 });
    }
}
