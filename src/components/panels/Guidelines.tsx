import { CircleCheckBig, CircleX, ShieldCheck, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/layout/Footer";
import { CollapsibleSection } from "@/components/ui";
import { useStore } from "@/store";

export function Guidelines() {
    const { t } = useTranslation();
    const { isMobile, isTablet } = useStore();

    const isInitiallyCollapsed = isMobile || isTablet;

    return (
        <div
            className={`bg-white dark:bg-zinc-900 rounded-lg p-4 sm:p-6 border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/5 h-full flex flex-col transition-shadow duration-200 ${
                !isMobile && "shadow-xl hover:shadow-2xl"
            }`}
        >
            <h2 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400 mb-1 select-none">
                {t("components.panels.guidelines.title")}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {t("components.panels.guidelines.subtitle")}
            </p>

            <div className="space-y-2 flex-grow flex flex-col overflow-y-auto -mr-2 pr-2">
                <CollapsibleSection
                    title={t("components.panels.guidelines.do_title")}
                    isInitiallyCollapsed={false}
                    titleClassName="font-medium text-gray-700 dark:text-gray-200"
                    className="border-b-0"
                    titlePrefix={
                        <CircleCheckBig
                            size={16}
                            className="text-green-500 dark:text-green-400"
                        />
                    }
                >
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 pl-1">
                        <li>{t("components.panels.guidelines.do_item_1")}</li>
                        <li>{t("components.panels.guidelines.do_item_2")}</li>
                        <li>{t("components.panels.guidelines.do_item_3")}</li>
                        <li>{t("components.panels.guidelines.do_item_4")}</li>
                        <li>{t("components.panels.guidelines.do_item_5")}</li>
                        <li>{t("components.panels.guidelines.do_item_6")}</li>
                    </ul>
                </CollapsibleSection>

                <CollapsibleSection
                    title={t("components.panels.guidelines.dont_title")}
                    isInitiallyCollapsed={isInitiallyCollapsed}
                    titleClassName="font-medium text-gray-700 dark:text-gray-200"
                    className="border-b-0"
                    titlePrefix={
                        <CircleX
                            size={16}
                            className="text-red-500 dark:text-red-400"
                        />
                    }
                >
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 pl-1">
                        <li>{t("components.panels.guidelines.dont_item_1")}</li>
                        <li>{t("components.panels.guidelines.dont_item_2")}</li>
                        <li>{t("components.panels.guidelines.dont_item_3")}</li>
                        <li>{t("components.panels.guidelines.dont_item_4")}</li>
                    </ul>
                </CollapsibleSection>

                <CollapsibleSection
                    title={t("components.panels.guidelines.lighting_title")}
                    isInitiallyCollapsed={true}
                    titleClassName="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2"
                    className="border-b-0"
                    titlePrefix={
                        <Sun
                            size={16}
                            className="text-yellow-500 dark:text-yellow-300"
                        />
                    }
                >
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 pl-1">
                        <li>
                            {t("components.panels.guidelines.lighting_item_1")}
                        </li>
                        <li>
                            {t("components.panels.guidelines.lighting_item_2")}
                        </li>
                        <li>
                            {t("components.panels.guidelines.lighting_item_3")}
                        </li>
                        <li>
                            {t("components.panels.guidelines.lighting_item_4")}
                        </li>
                    </ul>
                </CollapsibleSection>

                <div className="flex-grow" />

                <div className="rounded-md bg-red-50 dark:bg-zinc-800/60 border border-red-100 dark:border-red-900/40 p-3 mt-auto">
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                        <h5 className="font-semibold mb-1.5">
                            <ShieldCheck className="inline-block w-4 h-4 mr-1.5 align-text-bottom text-blue-500" />
                            {t("components.panels.guidelines.privacy_title")}
                        </h5>
                        {t("components.panels.guidelines.privacy_body")}
                    </p>
                </div>

                {isMobile && <Footer />}
            </div>
        </div>
    );
}
