import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "@/components/ui";

type InfoDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function InfoDialog({ isOpen, onClose }: InfoDialogProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const { t } = useTranslation();
    const faqs: { q: string; a: string }[] = t("dialogs.info.faqs", {
        returnObjects: true,
    }) as { q: string; a: string }[];

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

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
                    {faqs.map((faq, index) => {
                        const isFaqOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="border-b border-red-100 dark:border-red-900/30 last:border-b-0"
                            >
                                <div
                                    className="flex items-center justify-between cursor-pointer py-3"
                                    onClick={() => toggleFaq(index)}
                                    role="button"
                                    aria-expanded={isFaqOpen}
                                >
                                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 pr-4">
                                        {faq.q}
                                    </h3>
                                    <ChevronDown
                                        size={20}
                                        className={`flex-shrink-0 text-gray-500 transition-transform duration-300 ${isFaqOpen ? "rotate-180" : ""}`}
                                    />
                                </div>
                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${isFaqOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed pb-4 pr-6">
                                            {faq.a}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Dialog>
    );
}
