import type { ReactNode } from "react";

export type BadgeVariant = "default" | "success" | "warning" | "info" | "neutral" | "danger";

type BadgeProps = {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
};

const variantClasses: Record<BadgeVariant, string> = {
    default: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60",
    warning: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60",
    info: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60",
    danger: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800/60",
    neutral: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700",
};

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${variantClasses[variant]} ${className}`}
        >
            {children}
        </span>
    );
}
