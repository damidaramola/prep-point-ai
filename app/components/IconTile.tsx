export default function IconTile({ children }: { children: React.ReactNode }) {
    return (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-500">
            {children}
        </span>
    );
}
