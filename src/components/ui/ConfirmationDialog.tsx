import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, Dialog } from "@/components/ui";

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
}

export function ConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText,
    cancelText,
}: ConfirmationDialogProps) {
    const { t } = useTranslation();

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            icon={AlertTriangle}
            closeAriaLabel={t("dialogs.confirmation.close_aria")}
            maxWidth="max-w-md"
        >
            <div className="p-6 sm:p-8 bg-white dark:bg-zinc-800/50">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-8">
                    {description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1"
                    >
                        {cancelText || t("common.cancel")}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        className="flex-1"
                    >
                        {confirmText || t("common.confirm")}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
