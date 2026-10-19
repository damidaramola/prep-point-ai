interface ChecklistItemProps {
    label: string;
    checked: boolean;
    onToggle: (checked: boolean) => void;
    detail?: string;
}

export default function ChecklistItem({ label, checked, onToggle, detail }: ChecklistItemProps) {
    return (
        <li>
            <label className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm transition hover:border-sky-300 ${checked ? "border-slate-100" : "border-slate-200"}`}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onToggle(e.target.checked)}
                    className="h-5 w-5 shrink-0 accent-sky-500"
                />
                <span className={`flex-1 text-sm ${checked ? "text-slate-400 line-through" : "text-slate-800"}`}>
                    {label}
                </span>
                {detail && <span className="text-xs text-slate-500 whitespace-nowrap">{detail}</span>}
            </label>
        </li>
    )
}
