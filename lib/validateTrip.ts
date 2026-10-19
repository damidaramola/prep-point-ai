import type { TripFormValues } from "@/app/types";
import { findCountry } from "./countries";

export type TripErrors = Partial<Record<keyof TripFormValues, string>>;

interface ValidateOptions {
    now: Date;
    checkDates?: boolean;
}

const DAY = 24 * 60 * 60 * 1000;
const MAX_DAYS_AHEAD = 365;
const MAX_TRIP_DAYS = 365;
const MAX_TRAVELLERS = 100;

const FLIGHT_NUMBER = /^([A-Z0-9]{2})\s?(\d{1,4})$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const MONEY = /^\d+(\.\d{1,2})?$/;

export function normalizeFlightNumber(value: string): string {
    return value.trim().toUpperCase();
}

function dayNumber(date: string): number {
    const [y, m, d] = date.split("-").map(Number);
    return Date.UTC(y, m - 1, d) / DAY;
}

function isRealDate(date: string): boolean {
    if (!DATE.test(date)) return false;
    const [y, m, d] = date.split("-").map(Number);
    const parsed = new Date(Date.UTC(y, m - 1, d));
    return parsed.getUTCFullYear() === y && parsed.getUTCMonth() === m - 1 && parsed.getUTCDate() === d;
}

function localDateString(now: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function validateTrip(values: TripFormValues, { now, checkDates = true }: ValidateOptions): TripErrors {
    const errors: TripErrors = {};

    if (!findCountry(values.flyingFrom)) errors.flyingFrom = "Select a valid country";
    if (!findCountry(values.flyingTo)) errors.flyingTo = "Select a valid country";

    const flightMatch = FLIGHT_NUMBER.exec(normalizeFlightNumber(values.flightNumber));
    if (!flightMatch || !/[A-Z]/.test(flightMatch[1])) errors.flightNumber = "Enter a valid flight number";

    const today = localDateString(now);
    const fromDateValid = isRealDate(values.fromDate);
    const daysAhead = fromDateValid ? dayNumber(values.fromDate) - dayNumber(today) : NaN;
    if (!fromDateValid || (checkDates && (daysAhead < 0 || daysAhead > MAX_DAYS_AHEAD))) {
        errors.fromDate = "Enter a valid departure date";
    }

    const departurePassed = checkDates && fromDateValid && values.fromDate === today
        && new Date(`${values.fromDate}T${values.departureTime}`).getTime() <= now.getTime();
    if (!TIME.test(values.departureTime) || departurePassed) {
        errors.departureTime = "Enter a valid departure time";
    }

    const tripDays = isRealDate(values.toDate) && fromDateValid ? dayNumber(values.toDate) - dayNumber(values.fromDate) : NaN;
    if (!isRealDate(values.toDate) || tripDays < 0 || tripDays > MAX_TRIP_DAYS) {
        errors.toDate = "Enter a valid return date";
    }

    const travellers = Number(values.numberOfTravellers.trim());
    if (!values.numberOfTravellers.trim() || !Number.isInteger(travellers) || travellers < 1 || travellers > MAX_TRAVELLERS) {
        errors.numberOfTravellers = "Enter a valid number of travellers";
    }

    if (!MONEY.test(values.budget.trim())) errors.budget = "Enter a valid budget";

    return errors;
}
