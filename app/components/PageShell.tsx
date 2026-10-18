import Link from "next/link";
import { ArrowLeftIcon, PlaneIcon } from "./Icons";

const widths = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-5xl",
};

interface PageShellProps {
    children: React.ReactNode;
    width?: keyof typeof widths;
}

export default function PageShell({ children, width = "md" }: PageShellProps) {
    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 text-slate-800">
            <main className={`mx-auto ${widths[width]} px-4 py-10 grid gap-6`}>
                {children}
            </main>
        </div>
    );
}

interface PageHeaderProps {
    title: string;
    subtitle?: React.ReactNode;
    icon?: React.ReactNode;
}

export function PageHeader({ title, subtitle, icon }: PageHeaderProps) {
    return (
        <header className="grid justify-items-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-cyan-400 text-white shadow-md">
                {icon ?? <PlaneIcon className="h-6 w-6" />}
            </span>
            <h1 className="text-3xl font-bold text-slate-900 text-balance">{title}</h1>
            {subtitle && <p className="max-w-md text-slate-500">{subtitle}</p>}
        </header>
    );
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="inline-flex w-fit items-center gap-1.5 text-sm text-slate-500 hover:text-sky-600">
            <ArrowLeftIcon /> {children}
        </Link>
    );
}
