export type ToastType = "error" | "info" | "success" | "warning";

export type Toast = {
    id: number;
    message: string;
    type: ToastType;
};

export type Format = {
    id: string;
    label: string;
    widthPx: number;
    heightPx: number;
    printWidthMm: number;
    printHeightMm: number;
};

export const PHOTO_COUNTS = [1, 2, 4, 6, 8, 10, 12] as const;
export type PhotoCount = (typeof PHOTO_COUNTS)[number];

export type Theme = "light" | "dark";

export type DialogType =
    | "customFormat"
    | "download"
    | "shortcuts"
    | "print"
    | "info"
    | "import"
    | "photoQueue"
    | "settings"
    | "confirmRetake"
    | null;

export type WizardStep = "guidelines" | "camera" | "result";

export type FacingMode = "user" | "environment";

// Supported passport/ID photo formats
export const FORMATS: readonly Format[] = [
    {
        id: "au_35x45",
        label: "🇦🇺 Australia",
        widthPx: 413,
        heightPx: 531,
        printWidthMm: 35,
        printHeightMm: 45,
    },
    {
        id: "br_50x70",
        label: "🇧🇷 Brazil",
        widthPx: 591,
        heightPx: 827,
        printWidthMm: 50,
        printHeightMm: 70,
    },
    {
        id: "ca_50x70",
        label: "🇨🇦 Canada",
        widthPx: 591,
        heightPx: 827,
        printWidthMm: 50,
        printHeightMm: 70,
    },
    {
        id: "cn_33x48",
        label: "🇨🇳 China",
        widthPx: 390,
        heightPx: 567,
        printWidthMm: 33,
        printHeightMm: 48,
    },
    {
        id: "eu_35x45",
        label: "🇪🇺 EU / Schengen / UK",
        widthPx: 413,
        heightPx: 531,
        printWidthMm: 35,
        printHeightMm: 45,
    },
    {
        id: "in_51x51",
        label: "🇮🇳 India",
        widthPx: 602,
        heightPx: 602,
        printWidthMm: 51,
        printHeightMm: 51,
    },
    {
        id: "jp_35x45",
        label: "🇯🇵 Japan",
        widthPx: 413,
        heightPx: 531,
        printWidthMm: 35,
        printHeightMm: 45,
    },
    {
        id: "my_35x50",
        label: "🇲🇾 Malaysia",
        widthPx: 413,
        heightPx: 591,
        printWidthMm: 35,
        printHeightMm: 50,
    },
    {
        id: "mx_25x30",
        label: "🇲🇽 Mexico",
        widthPx: 295,
        heightPx: 354,
        printWidthMm: 25,
        printHeightMm: 30,
    },
    {
        id: "ru_35x45",
        label: "🇷🇺 Russia",
        widthPx: 413,
        heightPx: 531,
        printWidthMm: 35,
        printHeightMm: 45,
    },
    {
        id: "us_2x2",
        label: "🇺🇸 US",
        widthPx: 600,
        heightPx: 600,
        printWidthMm: 50.8,
        printHeightMm: 50.8,
    },
];
export type PredefinedFormatId = (typeof FORMATS)[number]["id"];
export type FormatId = PredefinedFormatId | string;

export type NewFormatState = {
    label: string;
    widthPx: string;
    heightPx: string;
    printWidthMm: string;
    printHeightMm: string;
};
