import { Printer } from "lucide-react";
import { useId } from "react";
import { useTranslation } from "react-i18next";
import {
    Dialog,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import { useStore } from "@/store";
import { FORMATS, PHOTO_COUNTS, PhotoCount } from "@/types";

type PrintOptionsDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onPrint: () => void;
};

export function PrintOptionsDialog({
    isOpen,
    onClose,
    onPrint,
}: PrintOptionsDialogProps) {
    const { photosPerPage, setPhotosPerPage, selectedFormatId, customFormats } =
        useStore();
    const { t } = useTranslation();
    const photosPerPageId = useId();
    const allFormats = [...FORMATS, ...customFormats];
    const selectedFormat =
        allFormats.find((f) => f.id === selectedFormatId) || FORMATS[0];

    const handlePrint = () => {
        onPrint();
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={t("dialogs.print.title")}
            icon={Printer}
            closeAriaLabel={t("dialogs.print.close_aria")}
            maxWidth="max-w-md"
        >
            <div className="p-6 sm:p-8 bg-white dark:bg-zinc-800/50">
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <Label
                            className="text-gray-600 dark:text-gray-300 text-sm sm:w-40 select-none"
                            htmlFor={photosPerPageId}
                        >
                            {t("dialogs.print.photos_per_page_label")}
                        </Label>
                        <Select
                            value={String(photosPerPage)}
                            onValueChange={(value) =>
                                setPhotosPerPage(Number(value) as PhotoCount)
                            }
                        >
                            <SelectTrigger
                                id={photosPerPageId}
                                className="w-full sm:flex-1"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PHOTO_COUNTS.map((c) => (
                                    <SelectItem key={c} value={String(c)}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("dialogs.print.description", {
                            width: (selectedFormat.printWidthMm / 25.4).toFixed(
                                2,
                            ),
                            height: (
                                selectedFormat.printHeightMm / 25.4
                            ).toFixed(2),
                        })}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-600 dark:bg-zinc-700 text-white py-2 px-4 rounded hover:bg-gray-700 dark:hover:bg-zinc-600 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer"
                    >
                        {t("common.cancel")}
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer"
                    >
                        <Printer size={18} />
                        {t("dialogs.print.print_now_button")}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
