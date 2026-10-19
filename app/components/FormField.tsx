export const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100";

const inputErrorClass =
    "w-full rounded-lg border border-red-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100";

export function inputProps(id: string, error?: string) {
    return {
        id,
        name: id,
        className: error ? inputErrorClass : inputClass,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? `${id}-error` : undefined,
    };
}

interface FormFieldProps {
    id: string;
    label: string;
    error?: string;
    children: React.ReactNode;
}

export default function FormField({ id, label, error, children }: FormFieldProps) {
    return (
        <div className="grid gap-1.5">
            <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>
            {children}
            {error && <p id={`${id}-error`} className="text-xs text-red-600">{error}</p>}
        </div>
    );
}
