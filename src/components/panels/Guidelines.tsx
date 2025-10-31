import { CircleCheckBig, CircleX, Globe, ShieldCheck, Sun } from "lucide-react";
import { CSSProperties, useState } from "react";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui";
import { useStore } from "@/store";

type GuidelinesProps = {
    onViewCountryRequirements: () => void;
    onShowPrivacy: () => void;
};

export function Guidelines({
    onViewCountryRequirements,
    onShowPrivacy,
}: GuidelinesProps) {
    const { t } = useTranslation();
    const { isMobile } = useStore();
    const [openSection, setOpenSection] = useState<"do" | "dont" | "lighting">(
        "do",
    );
    const verticalTextStyle: CSSProperties = { writingMode: "sideways-lr" };

    return (
        <div
            className={`bg-white dark:bg-zinc-900 rounded-lg p-4 sm:p-6 border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/5 h-full flex flex-col transition-shadow duration-200 ${
                !isMobile && "shadow-xl hover:shadow-2xl"
            }`}
        >
            <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400 select-none">
                    {t("components.panels.guidelines.title")}
                </h2>
                <button
                    type="button"
                    onClick={onShowPrivacy}
                    className={`flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 bg-gray-100/50 dark:bg-zinc-800/60 border border-gray-200/80 dark:border-zinc-700/60 hover:bg-gray-200/70 dark:hover:bg-zinc-700/80 transition-colors rounded-md ${isMobile ? "p-2.5" : "py-2 px-3"}`}
                    title={t("components.panels.guidelines.privacy_title")}
                >
                    <ShieldCheck size={isMobile ? 18 : 16} />
                    {!isMobile && (
                        <span>
                            {t(
                                "components.panels.guidelines.privacy_button_text",
                            )}
                        </span>
                    )}
                </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {t("components.panels.guidelines.subtitle")}
            </p>

            <div className="flex-grow flex flex-col md:flex-row gap-2 overflow-y-auto -mr-2 pr-2">
                {/* Do's Column */}
                <div
                    className={`flex rounded-md transition-all duration-300 ${openSection === "do" ? "flex-1 bg-green-50/50 dark:bg-green-900/20" : "flex-initial bg-gray-100/50 dark:bg-zinc-800/50"}`}
                >
                    <button
                        type="button"
                        className={`flex items-center justify-center rounded-l-md p-1.5 transition-colors ${openSection === "do" ? "bg-green-100/80 dark:bg-green-800/40" : "hover:bg-gray-200/60 dark:hover:bg-zinc-700/60"}`}
                        onClick={() => setOpenSection("do")}
                        aria-expanded={openSection === "do"}
                    >
                        <h3
                            className="font-semibold text-green-800 dark:text-green-200 uppercase tracking-wider"
                            style={verticalTextStyle}
                        >
                            {t("components.panels.guidelines.do_title")}
                        </h3>
                    </button>
                    <div
                        className={`transition-all duration-300 ease-in-out ${openSection === "do" ? "w-64 opacity-100" : "w-0 opacity-0"}`}
                    >
                        <div className="overflow-hidden">
                            {openSection === "do" && (
                                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5 p-3">
                                    <li className="flex items-start gap-1.5">
                                        <CircleCheckBig className="w-3 h-3 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                        <span>
                                            {t(
                                                "components.panels.guidelines.do_item_1",
                                            )}
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <CircleCheckBig className="w-3 h-3 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                        <span>
                                            {t(
                                                "components.panels.guidelines.do_item_2",
                                            )}
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <CircleCheckBig className="w-3 h-3 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                        <span>
                                            {t(
                                                "components.panels.guidelines.do_item_3",
                                            )}
                                        </span>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Don'ts Column */}
                <div
                    className={`flex rounded-md transition-all duration-300 ${openSection === "dont" ? "flex-1 bg-red-50/50 dark:bg-red-900/20" : "flex-initial bg-gray-100/50 dark:bg-zinc-800/50"}`}
                >
                    <button
                        type="button"
                        className={`flex items-center justify-center rounded-l-md p-1.5 transition-colors ${openSection === "dont" ? "bg-red-100/80 dark:bg-red-800/40" : "hover:bg-gray-200/60 dark:hover:bg-zinc-700/60"}`}
                        onClick={() => setOpenSection("dont")}
                        aria-expanded={openSection === "dont"}
                    >
                        <h3
                            className="font-semibold text-red-800 dark:text-red-200 uppercase tracking-wider"
                            style={verticalTextStyle}
                        >
                            {t("components.panels.guidelines.dont_title")}
                        </h3>
                    </button>
                    <div
                        className={`transition-all duration-300 ease-in-out ${openSection === "dont" ? "w-64 opacity-100" : "w-0 opacity-0"}`}
                    >
                        <div className="overflow-hidden">
                            {openSection === "dont" && (
                                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5 p-3">
                                    <li className="flex items-start gap-1.5">
                                        <CircleX className="w-3 h-3 mt-0.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                        <span>
                                            {t(
                                                "components.panels.guidelines.dont_item_1",
                                            )}
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <CircleX className="w-3 h-3 mt-0.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                        <span>
                                            {t(
                                                "components.panels.guidelines.dont_item_2",
                                            )}
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <CircleX className="w-3 h-3 mt-0.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                        <span>
                                            {t(
                                                "components.panels.guidelines.dont_item_3",
                                            )}
                                        </span>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Lighting Column */}
                <div
                    className={`flex rounded-md transition-all duration-300 ${openSection === "lighting" ? "flex-1 bg-yellow-50/50 dark:bg-yellow-900/20" : "flex-initial bg-gray-100/50 dark:bg-zinc-800/50"}`}
                >
                    <button
                        type="button"
                        className={`flex items-center justify-center rounded-l-md p-1.5 transition-colors ${openSection === "lighting" ? "bg-yellow-100/80 dark:bg-yellow-800/40" : "hover:bg-gray-200/60 dark:hover:bg-zinc-700/60"}`}
                        onClick={() => setOpenSection("lighting")}
                        aria-expanded={openSection === "lighting"}
                    >
                        <h3
                            className="font-semibold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider"
                            style={verticalTextStyle}
                        >
                            {t("components.panels.guidelines.lighting_title")}
                        </h3>
                    </button>
                    <div
                        className={`transition-all duration-300 ease-in-out ${openSection === "lighting" ? "w-64 opacity-100" : "w-0 opacity-0"}`}
                    >
                        <div className="overflow-hidden">
                            {openSection === "lighting" && (
                                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5 p-3">
                                    <li className="flex items-start gap-1.5">
                                        <Sun className="w-3 h-3 mt-0.5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                                        <span>
                                            {t(
                                                "components.panels.guidelines.lighting_item_1",
                                            )}
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <Sun className="w-3 h-3 mt-0.5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                                        <span>
                                            {t(
                                                "components.panels.guidelines.lighting_item_2",
                                            )}
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <Sun className="w-3 h-3 mt-0.5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                                        <span>
                                            {t(
                                                "components.panels.guidelines.lighting_item_3",
                                            )}
                                        </span>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Country Requirements Button */}
            <Button
                variant="outline"
                onClick={onViewCountryRequirements}
                className="flex items-center justify-center gap-2 w-full mt-4 text-red-600 dark:text-red-400"
            >
                <Globe size={16} />
                {t("components.panels.guidelines.view_country_requirements")}
            </Button>

            {isMobile && <Footer />}
        </div>
    );
}
