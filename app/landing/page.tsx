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
                alt="PrepPoint AI logo"
                width={250}
                height={150} />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-4">
                PrepPoint AI
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-xl mb-8">
                Never miss a flight again. Smart preparation from the moment you book to the moment you board.
            </p>
            <button type="button" onClick={handleRedirect} className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-4 px-6 rounded-full shadow">
                Let&apos;s Begin
            </button>
        </main>

    )
}