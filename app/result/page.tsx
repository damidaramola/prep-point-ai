'use client';

import { useSearchParams } from "next/navigation";

export default function ResultPage(){

    const searchParams = useSearchParams();
    const text = searchParams.get("text")


    return (
<main >
    <h1 className="text-2xl font-bold mb-4">Your Trip Plan ✈️</h1>

      <div className="bg-100 p-4 rounded">
        <p className="whitespace-pre-line">{text}</p>
      </div>

</main>
    )


}

