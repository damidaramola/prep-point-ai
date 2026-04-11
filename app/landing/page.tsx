"use client"

import Image from "next/image"
import React from "react"
import { useRouter } from "next/navigation"




export default function LandingPage() {
  const router = useRouter()
  const handleRedirect = () => {
    router.push(`/trip-setup`)

  }
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-center px-4">
            <Image src="/cat.png"
                alt="Travel AI agent logo"
                width={250}
                height={150} />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-4">
                Travel AI agent

                <p className="text-lg sm:text-xl text-gray-700 max-w-xl mb-8">
                    Going on a Trip? Start using the very best travel companion - our AI travel agent.
                </p>
                    <button onClick={handleRedirect}className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-4 px-6 rounded-full shadow">
                        Let's Begin 
                    </button>

            </h1>
        </main>

    )
}