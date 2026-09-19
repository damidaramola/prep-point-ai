import Card from "./Cards";

interface ChecklistItemProps {
    label: string;
    checked: boolean;
    onToggle: (checked: boolean) => void;
    detail?: string;   
}

export default function ChecklistItem({ label, checked, onToggle, detail }: ChecklistItemProps) {
    return (
        <li>
            <Card>
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => onToggle(e.target.checked)}
                        className="h-5 w-5"
                    />
                    <span className={`flex-1 ${checked ? "line-through text-gray-400" : ""}`}>
                        {label}
                    </span>
                    {detail && <span className="text-sm text-gray-500">{detail}</span>}
                </label>
            </Card>
        </li>
    )
}
