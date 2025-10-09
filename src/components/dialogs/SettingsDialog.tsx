import {
    Construction,
    FlaskConical,
    Moon,
    RotateCcw,
    Settings,
    SlidersHorizontal,
    Sun,
} from "lucide-react";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dialog,
    Flag,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    ToggleSwitch,
} from "@/components/ui";
import { useTheme } from "@/contexts/ThemeProvider";
import { useStore } from "@/store";

type SettingsDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const {
        watermarkEnabled,
        setWatermarkEnabled,
        watermarkText,
        setWatermarkText,
        showAlignGuides,
        setShowAlignGuides,
    } = useStore();
    const languageId = useId();
    const themeId = useId();
    const watermarkEnabledId = useId();
    const showAlignGuidesId = useId();

    const [activeTab, setActiveTab] = useState<"general" | "experimental">(
        "general",
    );

    const languages = [
        {
            label: t("languages.german"),
            value: "de",
            flagCode: "DE",
        },
        {
            label: t("languages.english"),
            value: "en",
            flagCode: "GB",
        },
        {
            label: t("languages.french"),
            value: "fr",
            flagCode: "FR",
        },
        {
            label: t("languages.romanian"),
            value: "ro",
            flagCode: "RO",
        },
        {
            label: t("languages.spanish"),
            value: "es",
            flagCode: "ES",
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
                <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                        setActiveTab(value as "general" | "experimental")
                    }
                    className="flex-grow flex flex-col overflow-hidden"
                >
                    <TabsList
                        aria-label={t("dialogs.settingsDialog.tabs_aria_label")}
                    >
                        <TabsTrigger value="general">
                            <SlidersHorizontal size={16} />
                            <span>
                                {t("dialogs.settingsDialog.general_tab")}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="experimental">
                            <FlaskConical size={16} />
                            <span>
                                {t("dialogs.settingsDialog.experimental_tab")}
                            </span>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent
                        value="general"
                        className="flex-grow overflow-y-auto p-4 sm:p-6"
                    >
                        <div
                            role="tabpanel"
                            className="h-full divide-y divide-gray-200 dark:divide-zinc-700/60"
                        >
                            {/* Language Setting */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 py-4 first:pt-0 last:pb-0">
                                <div>
                                    <Label
                                        htmlFor={languageId}
                                        className="font-semibold text-gray-800 dark:text-gray-200"
                                    >
                                        {t(
                                            "dialogs.settingsDialog.language_label",
                                        )}
                                    </Label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {t(
                                            "dialogs.settingsDialog.language_description",
                                        )}
                                    </p>
                                </div>
                                <Select
                                    value={i18n.language}
                                    onValueChange={(value) =>
                                        i18n.changeLanguage(value)
                                    }
                                >
                                    <SelectTrigger
                                        id={languageId}
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languages.map((lang) => (
                                            <SelectItem
                                                key={lang.value}
                                                value={lang.value}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Flag
                                                        code={lang.flagCode}
                                                    />
                                                    <span>{lang.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Theme Setting */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 py-4 first:pt-0 last:pb-0">
                                <div>
                                    <Label
                                        htmlFor={themeId}
                                        className="font-semibold text-gray-800 dark:text-gray-200"
                                    >
                                        {t(
                                            "dialogs.settingsDialog.theme_label",
                                        )}
                                    </Label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {t(
                                            "dialogs.settingsDialog.theme_description",
                                        )}
                                    </p>
                                </div>
                                <Select
                                    value={theme}
                                    onValueChange={toggleTheme}
                                >
                                    <SelectTrigger
                                        id={themeId}
                                        className="w-full"
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

                            {/* Align Guides Setting */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 py-4 first:pt-0 last:pb-0">
                                <div className="flex flex-col justify-center">
                                    <Label
                                        htmlFor={showAlignGuidesId}
                                        className="font-semibold text-gray-800 dark:text-gray-200"
                                    >
                                        {t(
                                            "dialogs.settingsDialog.show_align_guides_label",
                                        )}
                                    </Label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {t(
                                            "dialogs.settingsDialog.show_align_guides_description",
                                        )}
                                    </p>
                                </div>
                                <div className="flex items-center sm:justify-start">
                                    <ToggleSwitch
                                        checked={showAlignGuides}
                                        onCheckedChange={setShowAlignGuides}
                                        aria-label={t(
                                            "dialogs.settingsDialog.show_align_guides_label",
                                        )}
                                        id={showAlignGuidesId}
                                    />
                                </div>
                            </div>

                            {/* Watermark Setting */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 py-4 first:pt-0 last:pb-0">
                                <div>
                                    <Label
                                        htmlFor={watermarkEnabledId}
                                        className="font-semibold text-gray-800 dark:text-gray-200"
                                    >
                                        {t(
                                            "dialogs.settingsDialog.enable_watermark_label",
                                        )}
                                    </Label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {t(
                                            "dialogs.settingsDialog.enable_watermark_description",
                                        )}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <ToggleSwitch
                                        checked={watermarkEnabled}
                                        onCheckedChange={setWatermarkEnabled}
                                        aria-label={t(
                                            "dialogs.settingsDialog.enable_watermark_label",
                                        )}
                                        id={watermarkEnabledId}
                                    />
                                    <div className="relative w-full">
                                        <Input
                                            type="text"
                                            value={watermarkText}
                                            onChange={(e) =>
                                                setWatermarkText(e.target.value)
                                            }
                                            placeholder={t(
                                                "dialogs.settingsDialog.watermark_text_placeholder",
                                            )}
                                            disabled={!watermarkEnabled}
                                            className="pr-8"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setWatermarkText(
                                                    "💎 RUBY PASSPORT",
                                                )
                                            }
                                            disabled={!watermarkEnabled}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 disabled:opacity-0 transition-opacity"
                                            title={t(
                                                "dialogs.settingsDialog.reset_watermark_tooltip",
                                            )}
                                        >
                                            <RotateCcw size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent
                        value="experimental"
                        className="flex-grow overflow-y-auto p-4 sm:p-6"
                    >
                        <div
                            role="tabpanel"
                            className="h-full flex flex-col items-center justify-center text-center"
                        >
                            <Construction
                                className="mx-auto text-gray-400 mb-4"
                                size={48}
                            />
                            <p className="text-gray-500 dark:text-gray-400">
                                {t("dialogs.settingsDialog.experimental_body")}
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Dialog>
    );
}
