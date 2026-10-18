import { describe, expect, it } from "vitest";
import type { TripFormValues } from "@/app/types";
import { validateTrip } from "./validateTrip";
import { findCountry } from "./countries";

// Fixed "now" so date rules give the same result whenever the tests run: 18 Oct 2026, 12:00 local time.
const now = new Date(2026, 9, 18, 12, 0);

const valid: TripFormValues = {
    flyingFrom: "Ireland",
    flyingTo: "France",
    flightNumber: "EI123",
    fromDate: "2026-11-10",
    departureTime: "09:30",
    toDate: "2026-11-17",
    numberOfTravellers: "2",
    budget: "1500",
};

const errorsFor = (changes: Partial<TripFormValues>, checkDates = true) =>
    validateTrip({ ...valid, ...changes }, { now, checkDates });

describe("validateTrip", () => {
    it("accepts a valid trip", () => {
        expect(errorsFor({})).toEqual({});
    });
 
    describe("locations", () => {
        it.each([
            ["random text", "asdfgh"],
            ["spaces only", "   "],
            ["empty", ""],
            ["html", "<script>alert(1)</script>"],
            ["very long text", "a".repeat(10_000)],
        ])("rejects %s", (_, input) => {
            expect(errorsFor({ flyingTo: input }).flyingTo).toBeDefined();
        });

        it("accepts a country in any case", () => {
            expect(errorsFor({ flyingTo: "france" }).flyingTo).toBeUndefined();
        });

        it("allows domestic trips within the same country", () => {
            expect(errorsFor({ flyingTo: "Ireland" }).flyingTo).toBeUndefined();
        });
    });

    describe("flight number", () => {
        it.each(["EI123", "EI 123", "ei123 ", "U21234"])("accepts %j", (input) => {
            expect(errorsFor({ flightNumber: input }).flightNumber).toBeUndefined();
        });

        it.each([
            ["an airline code with no letter", "000"],
            ["too many digits", "EI12345"],
            ["no digits", "EI"],
            ["empty", ""],
        ])("rejects %s", (_, input) => {
            expect(errorsFor({ flightNumber: input }).flightNumber).toBeDefined();
        });
    });

    describe("dates and time", () => {
        it("rejects a departure date in the past", () => {
            expect(errorsFor({ fromDate: "2026-10-01" }).fromDate).toBeDefined();
        });

        it("rejects a departure date more than a year ahead", () => {
            expect(errorsFor({ fromDate: "9999-01-01", toDate: "9999-01-05" }).fromDate).toBeDefined();
        });

        it("rejects a date that doesn't exist", () => {
            expect(errorsFor({ fromDate: "2026-02-30" }).fromDate).toBeDefined();
        });

        it("rejects a departure time that has already passed today", () => {
            expect(errorsFor({ fromDate: "2026-10-18", departureTime: "08:00", toDate: "2026-10-20" }).departureTime).toBeDefined();
        });

        it("accepts a later departure time today", () => {
            expect(errorsFor({ fromDate: "2026-10-18", departureTime: "18:00", toDate: "2026-10-20" })).toEqual({});
        });

        it("rejects a return date before departure", () => {
            expect(errorsFor({ toDate: "2026-11-01" }).toDate).toBeDefined();
        });

        it("accepts returning the same day", () => {
            expect(errorsFor({ toDate: "2026-11-10" }).toDate).toBeUndefined();
        });

        it("rejects a trip longer than a year", () => {
            expect(errorsFor({ toDate: "2027-12-01" }).toDate).toBeDefined();
        });

        it("allows past trips when date checks are off (used by the API)", () => {
            expect(errorsFor({ fromDate: "2026-01-01", toDate: "2026-01-05" }, false)).toEqual({});
        });
    });

    describe("travellers", () => {
        it.each(["0", "2.5", "-1", "", "abc", "500"])("rejects %j", (input) => {
            expect(errorsFor({ numberOfTravellers: input }).numberOfTravellers).toBeDefined();
        });
    });

    describe("budget", () => {
        it.each(["0", "1500", "99.99", "2500000"])("accepts %j", (input) => {
            expect(errorsFor({ budget: input }).budget).toBeUndefined();
        });

        it.each(["-5", "", "abc", "1e9", "10.999", "1,500"])("rejects %j", (input) => {
            expect(errorsFor({ budget: input }).budget).toBeDefined();
        });
    });
});

describe("findCountry", () => {
    it("returns the canonical name regardless of case and spaces", () => {
        expect(findCountry("  united kingdom ")).toBe("United Kingdom");
    });

    it("reads the country from older 'City, Country' values", () => {
        expect(findCountry("Paris, France")).toBe("France");
    });

    it("returns null for unknown places", () => {
        expect(findCountry("Narnia")).toBeNull();
    });
});
