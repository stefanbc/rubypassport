import { FlaskConical, Settings, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, Tab, Tabs } from "@/components/ui";

type SettingsDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<"general" | "experimental">(
        "general",
    );

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
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                General Settings
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                General settings will go here.
                            </p>
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
