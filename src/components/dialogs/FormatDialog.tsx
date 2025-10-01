import {
    List,
    Pencil,
    Plus,
    Search,
    SlidersHorizontal,
    Trash2,
    Wrench,
} from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/shallow";
import { CollapsibleSection, Dialog, Tab, Tabs } from "@/components/ui";
import { useStore } from "@/store";
import { FORMATS, Format, NewFormatState } from "@/types";

type FormatDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    editingFormat: Format | null;
    newFormat: NewFormatState;
    onNewFormatChange: (format: NewFormatState) => void;
    onAdd: () => void;
    onUpdate: () => void;
    onDelete: (id: string) => void;
    onEditClick: (format: Format) => void;
    onCancelEdit: () => void;
};

export function FormatDialog({
    isOpen,
    onClose,
    editingFormat,
    newFormat,
    onNewFormatChange,
    onAdd,
    onUpdate,
    onDelete,
    onEditClick,
    onCancelEdit,
}: FormatDialogProps) {
    const { customFormats, selectedFormatId, setSelectedFormatId, addToast } =
        useStore(
            useShallow((state) => ({
                customFormats: state.customFormats,
                selectedFormatId: state.selectedFormatId,
                setSelectedFormatId: state.setSelectedFormatId,
                addToast: state.addToast,
            })),
        );
    const { t } = useTranslation();
    const allFormats = [...FORMATS, ...customFormats];

    const [activeTab, setActiveTab] = useState<"select" | "manage">("select");
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const formatLabelId = useId();
    const widthPxId = useId();
    const heightPxId = useId();
    const printWidthMmId = useId();
    const printHeightMmId = useId();

    useEffect(() => {
        if (editingFormat) {
            setActiveTab("manage");
            setIsEditing(true);
        } else {
            setIsEditing(false);
            setSearchQuery(""); // Reset search when not editing
        }
    }, [editingFormat]);

    const handleCancelEditAndSwitch = () => {
        onCancelEdit();
        setActiveTab("select");
        setSearchQuery("");
    };

    const handleAdd = () => {
        if (customFormats.length >= 4) {
            addToast(t("toasts.customFormatLimit"), "warning");
            return;
        }

        const widthPx = parseInt(newFormat.widthPx, 10);
        const heightPx = parseInt(newFormat.heightPx, 10);
        const printWidthMm = parseFloat(newFormat.printWidthMm);
        const printHeightMm = parseFloat(newFormat.printHeightMm);

        const isValidNumber = (num: number) =>
            !Number.isNaN(num) && num > 0 && num <= 10000;

        if (
            !isValidNumber(widthPx) ||
            !isValidNumber(heightPx) ||
            !isValidNumber(printWidthMm) ||
            !isValidNumber(printHeightMm)
        ) {
            addToast(t("toasts.invalidFormatDimensions"), "error");
            return;
        }

        const existingFormat = allFormats.find(
            (f) =>
                String(f.widthPx) === String(newFormat.widthPx) &&
                String(f.heightPx) === String(newFormat.heightPx) &&
                String(f.printWidthMm) === String(newFormat.printWidthMm) &&
                String(f.printHeightMm) === String(newFormat.printHeightMm),
        );

        if (existingFormat) {
            addToast(
                t("toasts.formatExists", { label: existingFormat.label }),
                "warning",
            );
            return;
        }

        onAdd();
    };

    const predefinedFormats = allFormats.filter(
        (f) => !f.id.startsWith("custom_"),
    );
    const customFormatsList = allFormats
        .filter((f) => f.id.startsWith("custom_"))
        .sort((a, b) => a.label.localeCompare(b.label));

    const filteredPredefined = predefinedFormats.filter((f) =>
        f.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    const filteredCustom = customFormatsList.filter((f) =>
        f.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={t("dialogs.formatDialog.title")}
            icon={SlidersHorizontal}
            closeAriaLabel={t("dialogs.formatDialog.close_aria")}
        >
            <div className="flex-grow flex flex-col overflow-y-auto bg-white dark:bg-zinc-800/50">
                <Tabs ariaLabel={t("dialogs.formatDialog.tabs_aria_label")}>
                    <Tab
                        icon={List}
                        label={t("dialogs.formatDialog.select_format_tab")}
                        isActive={activeTab === "select"}
                        onClick={() => {
                            setActiveTab("select");
                            setSearchQuery("");
                        }}
                        disabled={isEditing}
                    />
                    <Tab
                        icon={Wrench}
                        label={t("dialogs.formatDialog.manage_custom_tab")}
                        isActive={activeTab === "manage"}
                        onClick={() => setActiveTab("manage")}
                    />
                </Tabs>

                <div className="flex-grow flex flex-col overflow-hidden">
                    {activeTab === "select" && (
                        <div
                            className="flex flex-col overflow-hidden p-4 sm:p-6"
                            role="tabpanel"
                        >
                            <div className="relative flex-shrink-0 mb-4">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder={t(
                                        "dialogs.formatDialog.search_placeholder",
                                    )}
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full bg-gray-100 dark:bg-black text-gray-800 dark:text-white text-sm py-2 pl-10 pr-4 rounded-md border border-red-200 dark:border-red-900/40 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                                />
                            </div>

                            <div className="flex-grow overflow-y-auto space-y-4 -mr-2 pr-2">
                                <CollapsibleSection
                                    title={t(
                                        "dialogs.formatDialog.standard_formats_group",
                                    )}
                                    isInitiallyCollapsed={false}
                                    titleClassName="text-base font-semibold text-gray-700 dark:text-gray-300"
                                    className="border-b border-gray-200 dark:border-zinc-700/50 pb-2 last:border-b-0"
                                >
                                    <FormatGrid
                                        formats={filteredPredefined}
                                        selectedFormatId={selectedFormatId}
                                        onSelect={setSelectedFormatId}
                                    />
                                </CollapsibleSection>
                                {filteredCustom.length > 0 && (
                                    <CollapsibleSection
                                        title={t(
                                            "dialogs.formatDialog.custom_formats_group",
                                        )}
                                        // Collapse custom formats by default if there are many
                                        isInitiallyCollapsed={
                                            customFormatsList.length > 2
                                        }
                                        className="border-b-0"
                                    >
                                        <FormatGrid
                                            formats={filteredCustom}
                                            selectedFormatId={selectedFormatId}
                                            onSelect={setSelectedFormatId}
                                        />
                                    </CollapsibleSection>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "manage" && (
                        <div className="flex-grow overflow-y-auto p-4 sm:p-6">
                            <div className="space-y-6" role="tabpanel">
                                {/* Add/Edit Form */}
                                <div className="p-4 bg-red-50/50 dark:bg-zinc-800/50 rounded-lg border border-red-100 dark:border-red-900/40">
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 select-none mb-3">
                                        {isEditing
                                            ? t(
                                                  "dialogs.formatDialog.edit_format_header",
                                              )
                                            : t(
                                                  "dialogs.formatDialog.add_format_header",
                                              )}
                                    </h3>
                                    <div className="space-y-3">
                                        <FormatInputRow
                                            label={t(
                                                "dialogs.formatDialog.label_label",
                                            )}
                                            id={formatLabelId}
                                        >
                                            <input
                                                id={formatLabelId}
                                                value={newFormat.label}
                                                onChange={(e) =>
                                                    onNewFormatChange({
                                                        ...newFormat,
                                                        label: e.target.value,
                                                    })
                                                }
                                                placeholder={t(
                                                    "dialogs.formatDialog.label_placeholder",
                                                )}
                                                className="w-full sm:flex-1 bg-gray-100 dark:bg-black text-gray-800 dark:text-white text-sm px-3 py-2 rounded border border-red-200 dark:border-red-900/40 invalid:border-red-500 invalid:ring-red-500"
                                                required
                                            />
                                        </FormatInputRow>
                                        <FormatInputRow
                                            label={t(
                                                "dialogs.formatDialog.width_px_label",
                                            )}
                                            id={widthPxId}
                                        >
                                            <input
                                                id={widthPxId}
                                                type="number"
                                                value={newFormat.widthPx}
                                                onChange={(e) =>
                                                    onNewFormatChange({
                                                        ...newFormat,
                                                        widthPx: e.target.value,
                                                    })
                                                }
                                                placeholder={t(
                                                    "dialogs.formatDialog.width_px_placeholder",
                                                )}
                                                className="w-full sm:flex-1 bg-gray-100 dark:bg-black text-gray-800 dark:text-white text-sm px-3 py-2 rounded border border-red-200 dark:border-red-900/40 invalid:border-red-500 invalid:ring-red-500"
                                                required
                                                min="1"
                                                max="10000"
                                            />
                                        </FormatInputRow>
                                        <FormatInputRow
                                            label={t(
                                                "dialogs.formatDialog.height_px_label",
                                            )}
                                            id={heightPxId}
                                        >
                                            <input
                                                id={heightPxId}
                                                type="number"
                                                value={newFormat.heightPx}
                                                onChange={(e) =>
                                                    onNewFormatChange({
                                                        ...newFormat,
                                                        heightPx:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder={t(
                                                    "dialogs.formatDialog.height_px_placeholder",
                                                )}
                                                className="w-full sm:flex-1 bg-gray-100 dark:bg-black text-gray-800 dark:text-white text-sm px-3 py-2 rounded border border-red-200 dark:border-red-900/40 invalid:border-red-500 invalid:ring-red-500"
                                                required
                                                min="1"
                                                max="10000"
                                            />
                                        </FormatInputRow>
                                        <FormatInputRow
                                            label={t(
                                                "dialogs.formatDialog.print_w_mm_label",
                                            )}
                                            id={printWidthMmId}
                                        >
                                            <input
                                                id={printWidthMmId}
                                                type="number"
                                                value={newFormat.printWidthMm}
                                                onChange={(e) =>
                                                    onNewFormatChange({
                                                        ...newFormat,
                                                        printWidthMm:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder={t(
                                                    "dialogs.formatDialog.print_w_mm_placeholder",
                                                )}
                                                className="w-full sm:flex-1 bg-gray-100 dark:bg-black text-gray-800 dark:text-white text-sm px-3 py-2 rounded border border-red-200 dark:border-red-900/40 invalid:border-red-500 invalid:ring-red-500"
                                                required
                                                min="1"
                                                max="10000"
                                                step="0.1"
                                            />
                                        </FormatInputRow>
                                        <FormatInputRow
                                            label={t(
                                                "dialogs.formatDialog.print_h_mm_label",
                                            )}
                                            id={printHeightMmId}
                                        >
                                            <input
                                                id={printHeightMmId}
                                                type="number"
                                                value={newFormat.printHeightMm}
                                                onChange={(e) =>
                                                    onNewFormatChange({
                                                        ...newFormat,
                                                        printHeightMm:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder={t(
                                                    "dialogs.formatDialog.print_h_mm_placeholder",
                                                )}
                                                className="w-full sm:flex-1 bg-gray-100 dark:bg-black text-gray-800 dark:text-white text-sm px-3 py-2 rounded border border-red-200 dark:border-red-900/40 invalid:border-red-500 invalid:ring-red-500"
                                                required
                                                min="1"
                                                max="10000"
                                                step="0.1"
                                            />
                                        </FormatInputRow>
                                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={
                                                    isEditing
                                                        ? onUpdate
                                                        : handleAdd
                                                }
                                                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors cursor-pointer"
                                            >
                                                <Plus
                                                    size={18}
                                                    className={`${isEditing ? "hidden" : ""}`}
                                                />
                                                {isEditing
                                                    ? t(
                                                          "dialogs.formatDialog.update_button",
                                                      )
                                                    : t(
                                                          "dialogs.formatDialog.add_button",
                                                      )}
                                            </button>
                                            {isEditing && (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleCancelEditAndSwitch
                                                    }
                                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-500 dark:bg-zinc-600 text-white py-2 px-4 rounded hover:bg-gray-600 dark:hover:bg-zinc-500 transition-colors cursor-pointer"
                                                >
                                                    {t(
                                                        "dialogs.formatDialog.cancel_button",
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Custom Formats List */}
                                {customFormatsList.length > 0 && !isEditing && (
                                    <CollapsibleSection
                                        title={t(
                                            "dialogs.formatDialog.your_custom_formats_header",
                                        )}
                                        isInitiallyCollapsed={false}
                                    >
                                        <div className="max-h-48 overflow-y-auto -mr-2 pr-2">
                                            <ul className="space-y-2">
                                                {customFormatsList.map(
                                                    (format) => (
                                                        <li
                                                            key={format.id}
                                                            className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 bg-red-50/50 dark:bg-zinc-800/50 p-2 rounded-md hover:bg-red-100/50 dark:hover:bg-zinc-700/50 transition-colors"
                                                        >
                                                            <span>
                                                                {format.label} (
                                                                {format.widthPx}
                                                                x
                                                                {
                                                                    format.heightPx
                                                                }
                                                                px)
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        onEditClick(
                                                                            format,
                                                                        )
                                                                    }
                                                                    className="text-blue-400 hover:text-blue-300 p-1 rounded-full hover:bg-blue-900/50 transition-colors"
                                                                    title={t(
                                                                        "dialogs.formatDialog.edit_format_tooltip",
                                                                    )}
                                                                >
                                                                    <Pencil
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        onDelete(
                                                                            format.id,
                                                                        )
                                                                    }
                                                                    className="text-red-500 hover:text-red-400 p-1 rounded-full hover:bg-red-900/50 transition-colors"
                                                                    title={t(
                                                                        "dialogs.formatDialog.delete_format_tooltip",
                                                                    )}
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    </CollapsibleSection>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
}

const FormatGrid = ({
    formats,
    selectedFormatId,
    onSelect,
}: {
    formats: Format[];
    selectedFormatId: string;
    onSelect: (id: string) => void;
}) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {formats.map((f) => (
            <FormatItem
                key={f.id}
                format={f}
                selectedFormatId={selectedFormatId}
                onSelect={onSelect}
            />
        ))}
    </div>
);

const FormatItem = ({
    format,
    selectedFormatId,
    onSelect,
}: {
    format: Format;
    selectedFormatId: string;
    onSelect: (id: string) => void;
}) => {
    const isSelected = format.id === selectedFormatId;
    return (
        <button
            type="button"
            onClick={() => {
                onSelect(format.id);
            }}
            className={`p-3 text-left rounded-lg border-2 transition-all duration-150 ${
                isSelected
                    ? "bg-red-100 dark:bg-red-900/30 border-red-500 dark:border-red-500 ring-2 ring-red-500/30"
                    : "bg-gray-100 dark:bg-zinc-800 border-transparent hover:border-red-300 dark:hover:border-red-700"
            }`}
        >
            <p className="font-semibold text-gray-800 dark:text-gray-100">
                {format.label}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                ~{format.widthPx}x{format.heightPx}px
            </p>
        </button>
    );
};

const FormatInputRow = ({
    label,
    id,
    children,
}: {
    label: string;
    id: string;
    children: React.ReactNode;
}) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <label
            className="text-gray-600 dark:text-gray-300 text-sm sm:w-32 select-none self-start sm:self-center"
            htmlFor={id}
        >
            {label}
        </label>
        {children}
    </div>
);
