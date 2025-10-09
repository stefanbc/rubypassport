import * as Flags from "country-flag-icons/react/3x2";

interface FlagProps {
    code: string;
    className?: string;
}

export function Flag({ code, className }: FlagProps) {
    // The package uses 'GB' for the UK, but 'EU' for the European Union flag.
    // The data uses 'EU' for the "EU / Schengen / UK" format, which is fine.
    // For language mapping, we'll map 'en' to 'GB'.
    const FlagComponent = (Flags as any)[code.toUpperCase()];

    if (!FlagComponent) {
        return null;
    }

    return (
        <FlagComponent
            title={code.toUpperCase()}
            className={`w-5 h-auto ${className}`}
        />
    );
}
