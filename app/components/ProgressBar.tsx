interface ProgressBar {
    progress?: number
    className?: string;
}

export default function ProgressBar({ progress, className = "" }: ProgressBar) {
    const safeProgress = Math.min(100, Math.max(0, progress ?? 0));

    return (
        <div className={`bg-gray-200 h-3 rounded overflow-hidden ${className}`}>
            <div className="bg-blue-500 h-full" style={{ width: `${safeProgress}%` }} />
        </div>
    )
}