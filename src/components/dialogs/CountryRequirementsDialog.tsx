import { ExternalLink, Globe, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Dialog, Flag, Input } from "@/components/ui";
import { useStore } from "@/store";
import { FORMATS, Format } from "@/types";

type CountryRequirementsDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

interface CountryRequirement {
    format: Format;
    name: string;
    background: string;
    headSize: string;
    notes: string;
    officialLink: string;
}

const getCountryData = (formatId: string, t: (key: string) => string) => {
    switch (formatId) {
        case "us_2x2":
            return {
                name: t("dialogs.countryRequirements.us_name"),
                background: t("dialogs.countryRequirements.us_background"),
                headSize: "22-35mm",
                notes: t("dialogs.countryRequirements.us_notes"),
                officialLink:
                    "https://travel.state.gov/content/travel/en/passports/how-apply/photos.html",
            };
        case "eu_35x45":
            return {
                name: t("dialogs.countryRequirements.eu_name"),
                background: t("dialogs.countryRequirements.eu_background"),
                headSize: "32-36mm",
                notes: t("dialogs.countryRequirements.eu_notes"),
                officialLink:
                    "https://home-affairs.ec.europa.eu/document/download/71052552-a6e7-4581-9857-04fb5ace6bc5_en?filename=icao_photograph_guidelines_en.pdf",
            };
        case "ca_50x70":
            return {
                name: t("dialogs.countryRequirements.ca_name"),
                background: t("dialogs.countryRequirements.ca_background"),
                headSize: "31-36mm",
                notes: t("dialogs.countryRequirements.ca_notes"),
                officialLink:
                    "https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html",
            };
        case "au_35x45":
            return {
                name: t("dialogs.countryRequirements.au_name"),
                background: t("dialogs.countryRequirements.au_background"),
                headSize: "32-36mm",
                notes: t("dialogs.countryRequirements.au_notes"),
                officialLink:
                    "https://www.passports.gov.au/help/passport-photos",
            };
        case "jp_35x45":
            return {
                name: t("dialogs.countryRequirements.jp_name"),
                background: t("dialogs.countryRequirements.jp_background"),
                headSize: "32-36mm",
                notes: t("dialogs.countryRequirements.jp_notes"),
                officialLink:
                    "https://www.mofa.go.jp/mofaj/toko/passport/ic_photo.html",
            };
        case "in_51x51":
            return {
                name: t("dialogs.countryRequirements.in_name"),
                background: t("dialogs.countryRequirements.in_background"),
                headSize: "25-35mm",
                notes: t("dialogs.countryRequirements.in_notes"),
                officialLink:
                    "https://www.passportindia.gov.in/AppOnlineProject/pdf/ApplicationformInstructionBooklet-V3.0.pdf",
            };
        case "cn_33x48":
            return {
                name: t("dialogs.countryRequirements.cn_name"),
                background: t("dialogs.countryRequirements.cn_background"),
                headSize: "28-33mm",
                notes: t("dialogs.countryRequirements.cn_notes"),
                officialLink:
                    "https://alexandria.china-consulate.gov.cn/eng/lsyw/201207/P020210817711100537834.pdf",
            };
        case "mx_25x30":
            return {
                name: t("dialogs.countryRequirements.mx_name"),
                background: t("dialogs.countryRequirements.mx_background"),
                headSize: "22-25mm",
                notes: t("dialogs.countryRequirements.mx_notes"),
                officialLink:
                    "https://embamex.sre.gob.mx/guyana/images/pdf/visareqnew.pdf",
            };
        case "br_50x70":
            return {
                name: t("dialogs.countryRequirements.br_name"),
                background: t("dialogs.countryRequirements.br_background"),
                headSize: "31-36mm",
                notes: t("dialogs.countryRequirements.br_notes"),
                officialLink:
                    "https://www.gov.br/mre/pt-br/consulado-chicago/brazilian-documents/consular-services/passport-1/passport-photo-2013-specifications",
            };
        case "my_35x50":
            return {
                name: t("dialogs.countryRequirements.my_name"),
                background: t("dialogs.countryRequirements.my_background"),
                headSize: "32-36mm",
                notes: t("dialogs.countryRequirements.my_notes"),
                officialLink:
                    "https://www.kln.gov.my/documents/9375064/0/PASSPORT+PHOTO+SPECIFICATION+AND+SAMPLE+MALAYSIA.pdf/ba82dbb2-48ae-4a3e-876a-f6545b52bb4f",
            };
        case "ru_35x45":
            return {
                name: t("dialogs.countryRequirements.ru_name"),
                background: t("dialogs.countryRequirements.ru_background"),
                headSize: "32-36mm",
                notes: t("dialogs.countryRequirements.ru_notes"),
                officialLink:
                    "https://pusan.mid.ru/en/visa/requirements_russian_visa_photo_specifications/",
            };
        default:
            return {
                name: "Unknown",
                background: "N/A",
                headSize: "N/A",
                notes: "No specific requirements listed.",
                officialLink: "#",
            };
    }
};

export function CountryRequirementsDialog({
    isOpen,
    onClose,
}: CountryRequirementsDialogProps) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");
    const { selectedFormatId } = useStore();
    const selectedCountryRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isOpen && selectedCountryRef.current) {
            // A small delay ensures the dialog is fully rendered and animations are complete
            // before we try to scroll.
            const timer = setTimeout(() => {
                selectedCountryRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 150);

            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const countries: CountryRequirement[] = useMemo(
        () =>
            FORMATS.map((format) => ({
                format,
                ...getCountryData(format.id, t),
            })),
        [t],
    );

    const filteredCountries = useMemo(() => {
        if (!searchQuery.trim()) return countries;

        const query = searchQuery.toLowerCase();
        return countries.filter(
            (country) =>
                country.name.toLowerCase().includes(query) ||
                country.format.flagCode?.toLowerCase().includes(query) ||
                `${country.format.printWidthMm}×${country.format.printHeightMm}`.includes(
                    query,
                ) ||
                country.background.toLowerCase().includes(query),
        );
    }, [searchQuery, countries]);

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={t("dialogs.countryRequirements.title")}
            icon={Globe}
            closeAriaLabel={t("dialogs.countryRequirements.close_aria")}
        >
            <div className="flex flex-col h-full max-h-[80vh] overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-red-200/80 dark:border-red-900/20 flex-shrink-0">
                    <div className="flex flex-col gap-2">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <Input
                                type="text"
                                placeholder={t(
                                    "dialogs.countryRequirements.search_placeholder",
                                )}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-8"
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    aria-label={t("common.cancel")}
                                >
                                    <X size={14} />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                        {filteredCountries.length === 0 ? (
                            <div className="text-center py-8">
                                <Globe
                                    className="mx-auto text-gray-400 mb-4"
                                    size={48}
                                />
                                <p className="text-gray-500 dark:text-gray-400">
                                    {t(
                                        "dialogs.countryRequirements.no_results",
                                    )}
                                </p>
                            </div>
                        ) : (
                            filteredCountries.map((country) => {
                                const isSelected =
                                    country.format.id === selectedFormatId;
                                return (
                                    <div
                                        key={country.format.id}
                                        ref={(el) => {
                                            if (isSelected) {
                                                selectedCountryRef.current = el;
                                            }
                                        }}
                                        className={`bg-white dark:bg-zinc-800/50 border rounded-lg p-4 transition-all duration-200 ${
                                            isSelected
                                                ? "border-red-500 ring-2 ring-red-500/30 shadow-lg"
                                                : "border-gray-200 dark:border-zinc-700/50 hover:shadow-md"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between pb-3 border-b border-red-200/80 dark:border-red-900/20">
                                            <div className="flex items-center gap-3">
                                                <Flag
                                                    code={
                                                        country.format
                                                            .flagCode || ""
                                                    }
                                                    className="w-8 h-auto"
                                                />
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                                                        {country.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {
                                                            country.format
                                                                .printWidthMm
                                                        }
                                                        ×
                                                        {
                                                            country.format
                                                                .printHeightMm
                                                        }
                                                        mm
                                                        {country.format.id ===
                                                            "us_2x2" &&
                                                            ` (2×2")`}
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href={country.officialLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-shrink-0 flex items-center gap-1.5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs font-medium bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full py-1 px-3 transition-colors"
                                            >
                                                {t(
                                                    "dialogs.countryRequirements.view_official",
                                                )}
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 text-sm pt-3">
                                            <div className="md:border-r md:border-gray-200 md:dark:border-zinc-700/50 md:pr-4">
                                                <h4 className="font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">
                                                    {t(
                                                        "dialogs.countryRequirements.background",
                                                    )}
                                                </h4>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {country.background}
                                                </p>
                                            </div>
                                            <div className="md:border-r md:border-gray-200 md:dark:border-zinc-700/50 md:pr-4">
                                                <h4 className="font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">
                                                    {t(
                                                        "dialogs.countryRequirements.head_size",
                                                    )}
                                                </h4>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {country.headSize}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">
                                                    {t(
                                                        "dialogs.countryRequirements.notes",
                                                    )}
                                                </h4>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {country.notes}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-red-200/80 dark:border-red-900/20 bg-red-50 dark:bg-zinc-800/60 flex-shrink-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        {t("dialogs.countryRequirements.disclaimer")}
                    </p>
                </div>
            </div>
        </Dialog>
    );
}
