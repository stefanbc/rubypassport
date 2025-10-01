import { HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CollapsibleSection, Dialog } from "@/components/ui";

type InfoDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function InfoDialog({ isOpen, onClose }: InfoDialogProps) {
    const { t } = useTranslation();
    const faqs: { q: string; a: string }[] = t("dialogs.info.faqs", {
        returnObjects: true,
    }) as { q: string; a: string }[];

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={t("dialogs.info.title")}
            icon={HelpCircle}
            closeAriaLabel={t("dialogs.info.close_aria")}
            maxWidth="max-w-2xl"
        >
            <div className="flex-grow overflow-y-auto p-4 sm:p-6 bg-white dark:bg-zinc-800/50">
                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <CollapsibleSection
                            key={faq.q}
                            title={faq.q}
                            isInitiallyCollapsed={index !== 0}
                            titleClassName="text-base font-semibold text-gray-800 dark:text-gray-100"
                            className="border-b border-red-100 dark:border-red-900/30 py-0 last:border-b-0"
                        >
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed pb-2 pr-6">
                                {faq.a}
                            </p>
                        </CollapsibleSection>
                    ))}
                </div>
            </div>
        </Dialog>
    );
}
