interface ProgressBarProps {
    progress: number
    className?: string;
}

export default function ProgressBar({ progress, className = "" }: ProgressBarProps) {
    const progressRange = Math.min(100, Math.max(0, progress));

    return (
        <div className={`bg-gray-200 h-3 rounded overflow-hidden ${className}`}>
            <div className="bg-blue-500 h-full" style={{ width: `${progressRange}%` }} />
        </div>
    )
}