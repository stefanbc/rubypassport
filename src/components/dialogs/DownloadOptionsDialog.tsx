import { Download, ImageDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Dialog } from "@/components/ui";
import { useStore } from "@/store";

type DownloadOptionsDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onDownloadProcessed: () => void;
    onDownloadHighRes: () => void;
};

export function DownloadOptionsDialog({
    isOpen,
    onClose,
    onDownloadProcessed,
    onDownloadHighRes,
}: DownloadOptionsDialogProps) {
    const hasHighRes = useStore((state) => !!state.highResBlob);
    const { t } = useTranslation();

    const handleDownloadProcessed = () => {
        onDownloadProcessed();
        onClose();
    };

    const handleDownloadHighRes = () => {
        onDownloadHighRes();
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={t("dialogs.download.title")}
            icon={Download}
            closeAriaLabel={t("dialogs.download.close_aria")}
            maxWidth="max-w-md"
        >
            <div className="p-6 sm:p-8 bg-white dark:bg-zinc-800/50 space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t("dialogs.download.description")}
                </p>
                <button
                    type="button"
                    onClick={handleDownloadProcessed}
                    className="w-full flex items-center justify-center gap-3 bg-red-600 text-white py-3 px-4 rounded hover:bg-red-700 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg cursor-pointer"
                >
                    <Download size={20} />
                    <span>{t("dialogs.download.processed_button")}</span>
                </button>
                <button
                    type="button"
                    onClick={handleDownloadHighRes}
                    disabled={!hasHighRes}
                    className="w-full flex items-center justify-center gap-3 bg-gray-600 dark:bg-zinc-700 text-white py-3 px-4 rounded hover:bg-gray-700 dark:hover:bg-zinc-600 transition-colors transition-transform duration-150 hover:-translate-y-0.5 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    title={
                        !hasHighRes
                            ? t("dialogs.download.original_tooltip_unavailable")
                            : t("dialogs.download.original_tooltip_available")
                    }
                >
                    <ImageDown size={20} />
                    <span>{t("dialogs.download.original_button")}</span>
                </button>
                {!hasHighRes && (
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        {t("dialogs.download.original_unavailable_note")}
                    </p>
                )}
            </div>
        </Dialog>
    );
}
