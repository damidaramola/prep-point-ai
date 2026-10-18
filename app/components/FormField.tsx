export const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100";

interface FormFieldProps {
    id: string;
    label: string;
    children: React.ReactNode;
}

export default function FormField({ id, label, children }: FormFieldProps) {
    return (
        <div className="grid gap-1.5">
            <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>
            {children}
        </div>
    );
}
