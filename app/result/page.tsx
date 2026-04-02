'use client';

import { useEffect, useState } from "react";
type TravelResult = {
    trip: string;
    weather: string;
    flights: string;
    hotel: string;
};

export default function ResultPage() {

    const [result, setResult] = useState<TravelResult | null>(null);
    const [form, setForm] = useState<any>(null);
    useEffect(() => {
        const storedResult = localStorage.getItem("travelResult");
        const storedForm = localStorage.getItem("travelForm");

        if (storedResult) setResult(JSON.parse(storedResult));
        if (storedForm) setForm(JSON.parse(storedForm));
    }, []);
  if (!result || !form) return <p className="p-6">Loading...</p>;


return (
    <main className="p-6 max-w-2xl mx-auto">

      {/* Pills */}
      <div className="flex gap-2 flex-wrap mb-6">

        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          {form.FromDate}
        </span>

        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          {form.ToDate}
        </span>

        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
          {form.FlyingFrom} → {form.FlyingTo}
        </span>

      </div>

      {/* Cards */}
      <div className="grid gap-4">

        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-bold text-blue-600 mb-2">✈️ Trip</h2>
          <p>{result.trip}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-bold text-green-600 mb-2">🌦 Weather</h2>
          <p>{result.weather}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-bold text-purple-600 mb-2">💺 Flights</h2>
          <p>{result.flights}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-bold text-orange-600 mb-2">🏨 Hotel</h2>
          <p>{result.hotel}</p>
        </div>

      </div>
    </main>
  );
};




