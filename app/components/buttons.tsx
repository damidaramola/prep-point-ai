interface ButtonProps {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    size?: "sm" | "md" | "lg"
}


export default function Button({ }: ButtonProps) {

        const sizeStyles = {
        sm: "text-sm p-1",
        md: "text-base p-2",
        lg: "text-lg p-3"
    };

    
}