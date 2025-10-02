import {
    FlaskConical,
    Moon,
    Settings,
    SlidersHorizontal,
    Sun,
} from "lucide-react";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dialog,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Tab,
    Tabs,
} from "@/components/ui";
import { useTheme } from "@/contexts/ThemeProvider";

type SettingsDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<"general" | "experimental">(
        "general",
    );
    const languageId = useId();
    const themeId = useId();

    const languages = [
        {
            label: t("common.german"),
            value: "de",
            flag: "🇩🇪",
        },
        {
            label: t("common.english"),
            value: "en",
            flag: "🇬🇧",
        },
        {
            label: t("common.romanian"),
            value: "ro",
            flag: "🇷🇴",
        },
        {
            label: t("common.spanish"),
            value: "es",
            flag: "🇪🇸",
        },
    ];

    const themes = [
        {
            label: t("dialogs.settingsDialog.theme_light"),
            value: "light",
            icon: Sun,
        },
        {
            label: t("dialogs.settingsDialog.theme_dark"),
            value: "dark",
            icon: Moon,
        },
    ];

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={t("dialogs.settingsDialog.title")}
            icon={Settings}
            closeAriaLabel={t("dialogs.settingsDialog.close_aria")}
        >
            <div className="flex-grow flex flex-col overflow-y-auto bg-white dark:bg-zinc-800/50">
                <Tabs ariaLabel={t("dialogs.settingsDialog.tabs_aria_label")}>
                    <Tab
                        icon={SlidersHorizontal}
                        label={t("dialogs.settingsDialog.general_tab")}
                        isActive={activeTab === "general"}
                        onClick={() => setActiveTab("general")}
                    />
                    <Tab
                        icon={FlaskConical}
                        label={t("dialogs.settingsDialog.experimental_tab")}
                        isActive={activeTab === "experimental"}
                        onClick={() => setActiveTab("experimental")}
                    />
                </Tabs>

                <div className="flex-grow flex flex-col overflow-hidden p-4 sm:p-6">
                    {activeTab === "general" && (
                        <div role="tabpanel">
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                                {t(
                                    "dialogs.settingsDialog.general_settings_header",
                                )}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                    <label
                                        className="text-gray-600 dark:text-gray-300 text-sm sm:w-32 select-none"
                                        htmlFor={languageId}
                                    >
                                        {t(
                                            "dialogs.settingsDialog.language_label",
                                        )}
                                    </label>
                                    <Select
                                        value={i18n.language}
                                        onValueChange={(value) =>
                                            i18n.changeLanguage(value)
                                        }
                                    >
                                        <SelectTrigger
                                            id={languageId}
                                            className="w-full sm:flex-1"
                                        >
                                            <div className="flex items-center gap-2">
                                                <SelectValue placeholder="Select language" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {languages.map((lang) => (
                                                <SelectItem
                                                    key={lang.value}
                                                    value={lang.value}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>{lang.flag}</span>
                                                        <span>
                                                            {lang.label}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                    <label
                                        className="text-gray-600 dark:text-gray-300 text-sm sm:w-32 select-none"
                                        htmlFor={themeId}
                                    >
                                        {t(
                                            "dialogs.settingsDialog.theme_label",
                                        )}
                                    </label>
                                    <Select
                                        value={theme}
                                        onValueChange={toggleTheme}
                                    >
                                        <SelectTrigger
                                            id={themeId}
                                            className="w-full sm:flex-1"
                                        >
                                            <SelectValue placeholder="Select theme" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {themes.map((themeOption) => (
                                                <SelectItem
                                                    key={themeOption.value}
                                                    value={themeOption.value}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <themeOption.icon
                                                            size={14}
                                                            className="opacity-70"
                                                        />
                                                        <span>
                                                            {themeOption.label}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === "experimental" && (
                        <div role="tabpanel">
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Experimental Settings
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Experimental settings and features will go here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
}
