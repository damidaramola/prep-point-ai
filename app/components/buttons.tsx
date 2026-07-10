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
        sm: "text-sm px-2 py-1",
        md: "text-base px-3 py-2",
        lg: "text-lg px-4 py-3",
    };

    const variantStyles = {
        primary: "bg-blue-600 text-white rounded",
        secondary: "border rounded",
        danger: "bg-red-500 text-white font-bold rounded",
    };

    return (
        <button onClick={onClick} disabled={disabled} type={type} className={`${variantStyles[variant]} ${sizeStyles[size]}`}
        >
            {children}
        </button>
    )

}