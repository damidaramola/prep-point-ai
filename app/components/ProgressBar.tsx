interface ProgressBarProps {
    progress: number
    className?: string;
}

export default function ProgressBar({ progress, className = "" }: ProgressBarProps) {
    const progressRange = Math.min(100, Math.max(0, progress));

    return (
        <div className={`bg-slate-100 h-2 rounded-full overflow-hidden ${className}`}>
            <div className="bg-linear-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all" style={{ width: `${progressRange}%` }} />
        </div>
    )
}