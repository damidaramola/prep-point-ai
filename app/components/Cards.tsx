interface CardProps {
    children: React.ReactNode;
    className?: string;

}


export default function Card({ children, className = "" }: CardProps) {
    return (<div className={`border p-4 rounded ${className}`}>
        {children}
    </div>)
}