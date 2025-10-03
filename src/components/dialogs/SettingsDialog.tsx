import {
    Construction,
    FlaskConical,
    Moon,
    RotateCcw,
    Settings,
    SlidersHorizontal,
    Sun,
} from "lucide-react";
import { useId } from "react";
import { useTranslation } from "react-i18next";
import {
    Dialog,
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
    } = useStore();
    const languageId = useId();
    const themeId = useId();
    const watermarkEnabledId = useId();

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
                <Tabs
                    defaultValue="general"
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
                        <div role="tabpanel" className="h-full">
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                    <Label
                                        className="text-gray-600 dark:text-gray-300 text-sm sm:w-32 select-none"
                                        htmlFor={languageId}
                                    >
                                        {t(
                                            "dialogs.settingsDialog.language_label",
                                        )}
                                    </Label>
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
                                            <SelectValue placeholder="Select language" />
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
                                    <Label
                                        className="text-gray-600 dark:text-gray-300 text-sm sm:w-32 select-none"
                                        htmlFor={themeId}
                                    >
                                        {t(
                                            "dialogs.settingsDialog.theme_label",
                                        )}
                                    </Label>
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
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                    <Label
                                        className="text-gray-600 dark:text-gray-300 text-sm sm:w-32 select-none"
                                        htmlFor={watermarkEnabledId}
                                    >
                                        {t(
                                            "components.panels.result.enable_watermark_label",
                                        )}
                                    </Label>
                                    <ToggleSwitch
                                        checked={watermarkEnabled}
                                        onCheckedChange={setWatermarkEnabled}
                                        aria-label={t(
                                            "components.panels.result.enable_watermark_label",
                                        )}
                                        id={watermarkEnabledId}
                                    />
                                    <div className="relative w-full sm:flex-1">
                                        <Input
                                            type="text"
                                            value={watermarkText}
                                            onChange={(e) =>
                                                setWatermarkText(e.target.value)
                                            }
                                            placeholder={t(
                                                "components.panels.result.watermark_text_placeholder",
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
                                                "components.panels.result.reset_watermark_tooltip",
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
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex flex-col items-center justify-center gap-2">
                                <Construction size={32} />
                                {t("dialogs.settingsDialog.experimental_body")}
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Dialog>
    );
}
