interface ButtonProps {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    size?: "sm" | "md" | "lg"
}


export default function Button({ children, onClick, variant = "secondary", disabled, type = "button", size = "md" }
    : ButtonProps) {
    const sizeStyles = {
        sm: "text-sm px-3 py-1.5",
        md: "text-sm px-4 py-2.5",
        lg: "text-base px-6 py-3",
    };

    const variantStyles = {
        primary: "bg-linear-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-lg shadow-sm hover:opacity-90",
        secondary: "bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50",
        danger: "bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600",
    };

    return (
        <button onClick={onClick} disabled={disabled} type={type} className={`${variantStyles[variant]} ${sizeStyles[size]} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {children}
        </button>
    )

}