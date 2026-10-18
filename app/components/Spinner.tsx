interface SpinnerProps {
    label?: string;
    className?: string;
}

export default function Spinner({ label, className = "" }: SpinnerProps) {
    return (
        <div role="status" className={`flex items-center gap-2 text-sm text-gray-600 ${className}`}>
            <span className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin" aria-hidden="true" />
            <span>{label ?? "Loading…"}</span>
        </div>
    )
}
