interface IconProps {
    className?: string;
}

const base = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
};

export function PlaneIcon({ className = "h-5 w-5" }: IconProps) {
    return (
        <svg {...base} className={className}>
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
    );
}

export function CalendarIcon({ className = "h-5 w-5" }: IconProps) {
    return (
        <svg {...base} className={className}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
    );
}

export function LuggageIcon({ className = "h-5 w-5" }: IconProps) {
    return (
        <svg {...base} className={className}>
            <rect x="6" y="7" width="12" height="13" rx="2" />
            <path d="M9 7V4h6v3M10 11v5M14 11v5" />
        </svg>
    );
}

export function CheckCircleIcon({ className = "h-5 w-5" }: IconProps) {
    return (
        <svg {...base} className={className}>
            <circle cx="12" cy="12" r="9" />
            <path d="m8.5 12 2.5 2.5 4.5-5" />
        </svg>
    );
}

export function SparklesIcon({ className = "h-5 w-5" }: IconProps) {
    return (
        <svg {...base} className={className}>
            <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
            <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
        </svg>
    );
}

export function ClockIcon({ className = "h-5 w-5" }: IconProps) {
    return (
        <svg {...base} className={className}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </svg>
    );
}

export function GaugeIcon({ className = "h-5 w-5" }: IconProps) {
    return (
        <svg {...base} className={className}>
            <path d="M4 18a8 8 0 1 1 16 0" />
            <path d="m12 14 4-4" />
        </svg>
    );
}

export function ArrowLeftIcon({ className = "h-4 w-4" }: IconProps) {
    return (
        <svg {...base} className={className}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
    );
}

export function PlusIcon({ className = "h-4 w-4" }: IconProps) {
    return (
        <svg {...base} className={className}>
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}
