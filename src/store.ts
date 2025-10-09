import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
    DialogType,
    FacingMode,
    FORMATS,
    Format,
    FormatId,
    PhotoCount,
    QueuedPhoto,
    Theme,
    Toast,
    ToastType,
    WizardStep,
} from "@/types";

export const PHOTO_QUEUE_LIMIT = 10;

const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") {
        return "light";
    }
    try {
        const persistedState = localStorage.getItem("rp_cfg");
        if (persistedState) {
            const theme = JSON.parse(persistedState).state.theme;
            if (theme === "light" || theme === "dark") {
                return theme;
            }
        }
    } catch (e) {
        console.error(e);
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
};

interface AppState {
    // LocalStorage persisted state
    customFormats: Format[];
    selectedFormatId: FormatId;
    personName: string;
    theme: Theme;
    photosPerPage: PhotoCount;
    watermarkEnabled: boolean;
    watermarkText: string;
    showAlignGuides: boolean;
    hasVisited: boolean;

    // Transient state
    isProcessingImage: boolean;
    isMobile: boolean;
    isTablet: boolean;
    isPWA: boolean;
    isFullscreen: boolean;
    activeDialog:
        | "customFormat"
        | "download"
        | "shortcuts"
        | "print"
        | "info"
        | "import"
        | "photoQueue"
        | "settings"
        | "confirmRetake"
        | "countryRequirements"
        | null;

    wizardStep: WizardStep;
    baseImage: string | null;
    capturedImage: string | null;
    highResBlob: Blob | null;
    stream: MediaStream | null;
    isCameraOn: boolean;
    isCameraLoading: boolean;
    facingMode: FacingMode;
    toasts: (Toast & { duration: number })[];
    // Multi-capture queue
    multiCaptureEnabled: boolean;
    captureQueue: QueuedPhoto[];
}

interface AppActions {
    // Format Actions
    setCustomFormats: (formats: Format[]) => void;
    setSelectedFormatId: (id: FormatId) => void;
    addCustomFormat: (format: Omit<Format, "id">) => void;
    updateCustomFormat: (format: Format) => void;
    deleteCustomFormat: (id: string) => void;

    // Print/Save Option Actions
    setPersonName: (name: string) => void;
    setPhotosPerPage: (count: PhotoCount) => void;
    setTheme: (theme: Theme) => void;
    setWatermarkEnabled: (enabled: boolean) => void;
    setWatermarkText: (text: string) => void;
    setShowAlignGuides: (show: boolean) => void;
    setHasVisited: (hasVisited: boolean) => void;
    // Multi-capture Actions
    setMultiCaptureEnabled: (enabled: boolean) => void;
    enqueueToQueue: (imageDataUrl: string) => boolean;
    clearQueue: () => void;
    removeFromQueue: (index: number) => void;
    reorderQueue: (fromIndex: number, toIndex: number) => void;

    // UI Actions
    setIsProcessingImage: (isProcessing: boolean) => void;
    setIsMobile: (isMobile: boolean) => void;
    setIsTablet: (isTablet: boolean) => void;
    setIsPWA: (isPWA: boolean) => void;
    setIsFullscreen: (isFullscreen: boolean) => void;
    setActiveDialog: (dialog: DialogType) => void;

    // Image/Camera Actions
    setWizardStep: (step: WizardStep) => void;
    setBaseImage: (image: string | null) => void;
    setCapturedImage: (image: string | null) => void;
    setHighResBlob: (blob: Blob | null) => void;
    toggleTheme: () => void;
    setStream: (stream: MediaStream | null) => void;
    setIsCameraOn: (isOn: boolean) => void;
    setIsCameraLoading: (isLoading: boolean) => void;
    setFacingMode: (mode: FacingMode) => void;
    retakePhoto: (isMobile: boolean) => void;

    // Toast Actions
    addToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: () => void;
}

const initialState: AppState = {
    customFormats: [],
    selectedFormatId: "eu_35x45",
    personName: "",
    theme: getInitialTheme(),
    photosPerPage: 6,
    watermarkEnabled: false,
    watermarkText: "💎 RUBY PASSPORT",
    showAlignGuides: true,
    hasVisited: false,

    isProcessingImage: false,
    isMobile: false,
    isTablet: false,
    isPWA: false,
    isFullscreen: false,
    activeDialog: null,

    wizardStep: "guidelines",
    baseImage: null,
    capturedImage: null,
    highResBlob: null,
    stream: null,
    isCameraOn: false,
    isCameraLoading: false,
    facingMode: "user",
    toasts: [],
    multiCaptureEnabled: false,
    captureQueue: [],
};

export const useStore = create<AppState & AppActions>()(
    persist(
        (set, get) => ({
            ...initialState,

            // Format Actions
            setCustomFormats: (formats) => set({ customFormats: formats }),
            setSelectedFormatId: (id) => set({ selectedFormatId: id }),
            addCustomFormat: (formatData) => {
                const newFormat: Format = {
                    ...formatData,
                    id: `custom_${Date.now()}`,
                };
                set((state) => ({
                    customFormats: [...state.customFormats, newFormat],
                }));
                get().addToast(
                    `Added custom format: ${newFormat.label}`,
                    "success",
                );
                get().setSelectedFormatId(newFormat.id);
            },
            updateCustomFormat: (updatedFormat) => {
                set((state) => ({
                    customFormats: state.customFormats.map((f) =>
                        f.id === updatedFormat.id ? updatedFormat : f,
                    ),
                }));
                get().addToast(
                    `Updated custom format: ${updatedFormat.label}`,
                    "success",
                );
            },
            deleteCustomFormat: (idToDelete) => {
                set((state) => ({
                    customFormats: state.customFormats.filter(
                        (f) => f.id !== idToDelete,
                    ),
                }));
                if (get().selectedFormatId === idToDelete) {
                    set({ selectedFormatId: "eu_35x45" }); // Reset to default
                }
                get().addToast("Custom format removed.", "success");
            },

            // Print/Save Option Actions
            setPersonName: (name) => set({ personName: name }),
            setPhotosPerPage: (count) => set({ photosPerPage: count }),
            setTheme: (theme) => set({ theme }),
            setWatermarkEnabled: (enabled) =>
                set({ watermarkEnabled: enabled }),
            setWatermarkText: (text) => set({ watermarkText: text }),
            setShowAlignGuides: (show) => set({ showAlignGuides: show }),
            setHasVisited: (hasVisited) => set({ hasVisited }),
            // Multi-capture Actions
            setMultiCaptureEnabled: (enabled) =>
                set({ multiCaptureEnabled: enabled }),
            enqueueToQueue: (imageDataUrl) => {
                if (get().captureQueue.length >= PHOTO_QUEUE_LIMIT) {
                    return false; // Indicate failure
                }
                const newPhoto: QueuedPhoto = {
                    id: `photo_${Date.now()}_${Math.random()}`,
                    imgSrc: imageDataUrl,
                };
                set((state) => ({
                    captureQueue: [...state.captureQueue, newPhoto],
                }));
                return true; // Indicate success
            },
            clearQueue: () => set({ captureQueue: [] }),
            removeFromQueue: (index) =>
                set((state) => ({
                    captureQueue: state.captureQueue.filter(
                        (_, i) => i !== index,
                    ),
                })),
            reorderQueue: (fromIndex, toIndex) =>
                set((state) => {
                    const newQueue = [...state.captureQueue];
                    const [item] = newQueue.splice(fromIndex, 1);
                    if (item) {
                        newQueue.splice(toIndex, 0, item);
                    }
                    return { captureQueue: newQueue };
                }),

            // UI Actions
            setIsProcessingImage: (isProcessing) =>
                set({ isProcessingImage: isProcessing }),
            setIsMobile: (isMobile) => set({ isMobile }),
            setIsTablet: (isTablet) => set({ isTablet }),
            setIsPWA: (isPWA) => set({ isPWA }),
            setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
            setActiveDialog: (dialog) => set({ activeDialog: dialog }),

            // Image/Camera Actions
            setWizardStep: (step) => set({ wizardStep: step }),
            setBaseImage: (image) => set({ baseImage: image }),
            setCapturedImage: (image) => set({ capturedImage: image }),
            setHighResBlob: (blob) => set({ highResBlob: blob }),
            toggleTheme: () =>
                set((state) => ({
                    theme: state.theme === "light" ? "dark" : "light",
                })),
            setStream: (stream) => set({ stream }),
            setIsCameraOn: (isOn) => set({ isCameraOn: isOn }),
            setIsCameraLoading: (isLoading) =>
                set({ isCameraLoading: isLoading }),
            setFacingMode: (mode) => set({ facingMode: mode }),
            retakePhoto: (isMobile) => {
                set({ baseImage: null, highResBlob: null });
                if (isMobile) {
                    get().setWizardStep("camera");
                }
            },

            // Toast Actions
            addToast: (message, type = "info", duration = 1500) => {
                const id = Date.now() + Math.random();
                set((state) => ({
                    toasts: [...state.toasts, { id, message, type, duration }],
                }));
            },
            removeToast: () =>
                set((state) => ({ toasts: state.toasts.slice(1) })),
        }),
        {
            name: "rp_cfg", // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
            partialize: (state) => ({
                // Only persist these fields
                customFormats: state.customFormats,
                selectedFormatId: state.selectedFormatId,
                personName: state.personName,
                photosPerPage: state.photosPerPage,
                watermarkEnabled: state.watermarkEnabled,
                watermarkText: state.watermarkText,
                showAlignGuides: state.showAlignGuides,
                theme: state.theme,
                hasVisited: state.hasVisited,
            }),
            merge: (persistedState, currentState) => {
                const merged = {
                    ...currentState,
                    ...(persistedState as Partial<AppState>),
                };

                // After merging, validate that the persisted selectedFormatId still exists.
                // This prevents errors if a custom format was selected and then deleted.
                const allFormats = [
                    ...FORMATS,
                    ...(merged.customFormats || []),
                ];
                const formatExists = allFormats.some(
                    (f) => f.id === merged.selectedFormatId,
                );

                if (!formatExists) {
                    console.warn(
                        "Persisted format ID not found, reverting to default.",
                    );
                    merged.selectedFormatId = initialState.selectedFormatId; // Revert to default
                }

                return merged;
            },
        },
    ),
);
