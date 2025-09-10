import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  Format,
  FormatId,
  FORMATS,
  Toast,
  PhotoCount,
  Theme,
  DialogType,
  WizardStep,
  FacingMode,
  ToastType,
} from './types'

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  try {
    const persistedState = localStorage.getItem('rp_cfg');
    if (persistedState) {
      const theme = JSON.parse(persistedState).state.theme;
      if (theme === 'light' || theme === 'dark') {
        return theme;
      }
    }
  } catch (e) { console.error(e); }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

interface AppState {
  // LocalStorage persisted state
  customFormats: Format[]
  selectedFormatId: FormatId
  personName: string
  theme: Theme
  photosPerPage: PhotoCount
  watermarkEnabled: boolean
  autoFit10x15: boolean

  // Transient state
  isProcessingImage: boolean
  isMobile: boolean
  isPWA: boolean
  isFullscreen: boolean
  activeDialog:
    | 'customFormat'
    | 'download'
    | 'shortcuts'
    | 'print'
    | 'info'
    | 'import'
    | null

  wizardStep: WizardStep
  baseImage: string | null
  capturedImage: string | null
  highResBlob: Blob | null
  stream: MediaStream | null
  isCameraOn: boolean
  isCameraLoading: boolean
  facingMode: FacingMode
  toasts: (Toast & { duration: number })[]
  // Multi-capture queue
  multiCaptureEnabled: boolean
  captureQueue: string[]
}

interface AppActions {
  // Format Actions
  setCustomFormats: (formats: Format[]) => void
  setSelectedFormatId: (id: FormatId) => void
  addCustomFormat: (format: Omit<Format, 'id'>) => void
  updateCustomFormat: (format: Format) => void
  deleteCustomFormat: (id: string) => void

  // Print/Save Option Actions
  setPersonName: (name: string) => void
  setPhotosPerPage: (count: PhotoCount) => void
  setTheme: (theme: Theme) => void
  setWatermarkEnabled: (enabled: boolean) => void
  setAutoFit10x15: (enabled: boolean) => void
  // Multi-capture Actions
  setMultiCaptureEnabled: (enabled: boolean) => void
  enqueueToQueue: (imageDataUrl: string) => void
  clearQueue: () => void

  // UI Actions
  setIsProcessingImage: (isProcessing: boolean) => void
  setIsMobile: (isMobile: boolean) => void
  setIsPWA: (isPWA: boolean) => void
  setIsFullscreen: (isFullscreen: boolean) => void
  setActiveDialog: (dialog: DialogType) => void

  // Image/Camera Actions
  setWizardStep: (step: WizardStep) => void
  setBaseImage: (image: string | null) => void
  setCapturedImage: (image: string | null) => void
  setHighResBlob: (blob: Blob | null) => void
  toggleTheme: () => void
  setStream: (stream: MediaStream | null) => void
  setIsCameraOn: (isOn: boolean) => void
  setIsCameraLoading: (isLoading: boolean) => void
  setFacingMode: (mode: FacingMode) => void
  retakePhoto: (isMobile: boolean) => void

  // Toast Actions
  addToast: (
    message: string,
    type?: ToastType,
    duration?: number
  ) => void
  removeToast: () => void
}

const initialState: AppState = {
  customFormats: [],
  selectedFormatId: 'eu_35x45',
  personName: '',
  theme: getInitialTheme(),
  photosPerPage: 6,
  watermarkEnabled: false,
  autoFit10x15: false,

  isProcessingImage: false,
  isMobile: false,
  isPWA: false,
  isFullscreen: false,
  activeDialog: null,

  wizardStep: 'guidelines',
  baseImage: null,
  capturedImage: null,
  highResBlob: null,
  stream: null,
  isCameraOn: false,
  isCameraLoading: false,
  facingMode: 'user',
  toasts: [],
  multiCaptureEnabled: false,
  captureQueue: [],
}

export const useStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Format Actions
      setCustomFormats: (formats) => set({ customFormats: formats }),
      setSelectedFormatId: (id) => set({ selectedFormatId: id }),
      addCustomFormat: (formatData) => {
        const newFormat: Format = { ...formatData, id: `custom_${Date.now()}` }
        set((state) => ({ customFormats: [...state.customFormats, newFormat] }))
        get().addToast(`Added custom format: ${newFormat.label}`, 'success')
        get().setSelectedFormatId(newFormat.id)
      },
      updateCustomFormat: (updatedFormat) => {
        set((state) => ({
          customFormats: state.customFormats.map((f) =>
            f.id === updatedFormat.id ? updatedFormat : f
          ),
        }))
        get().addToast(
          `Updated custom format: ${updatedFormat.label}`,
          'success'
        )
      },
      deleteCustomFormat: (idToDelete) => {
        set((state) => ({
          customFormats: state.customFormats.filter((f) => f.id !== idToDelete),
        }))
        if (get().selectedFormatId === idToDelete) {
          set({ selectedFormatId: 'eu_35x45' }) // Reset to default
        }
        get().addToast('Custom format removed.', 'success')
      },

      // Print/Save Option Actions
      setPersonName: (name) => set({ personName: name }),
      setPhotosPerPage: (count) => set({ photosPerPage: count }),
      setTheme: (theme) => set({ theme }),
      setWatermarkEnabled: (enabled) => set({ watermarkEnabled: enabled }),
      setAutoFit10x15: (enabled) => set({ autoFit10x15: enabled }),
      // Multi-capture Actions
      setMultiCaptureEnabled: (enabled) => set({ multiCaptureEnabled: enabled }),
      enqueueToQueue: (imageDataUrl) =>
        set((state) => ({ captureQueue: [...state.captureQueue, imageDataUrl] })),
      clearQueue: () => set({ captureQueue: [] }),

      // UI Actions
      setIsProcessingImage: (isProcessing) =>
        set({ isProcessingImage: isProcessing }),
      setIsMobile: (isMobile) => set({ isMobile }),
      setIsPWA: (isPWA) => set({ isPWA }),
      setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
      setActiveDialog: (dialog) => set({ activeDialog: dialog }),

      // Image/Camera Actions
      setWizardStep: (step) => set({ wizardStep: step }),
      setBaseImage: (image) => set({ baseImage: image }),
      setCapturedImage: (image) => set({ capturedImage: image }),
      setHighResBlob: (blob) => set({ highResBlob: blob }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setStream: (stream) => set({ stream }),
      setIsCameraOn: (isOn) => set({ isCameraOn: isOn }),
      setIsCameraLoading: (isLoading) => set({ isCameraLoading: isLoading }),
      setFacingMode: (mode) => set({ facingMode: mode }),
      retakePhoto: (isMobile) => {
        set({ baseImage: null, highResBlob: null })
        if (isMobile) {
          get().setWizardStep('camera')
        }
      },

      // Toast Actions
      addToast: (message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random()
        set((state) => ({
          toasts: [...state.toasts, { id, message, type, duration }],
        }))
      },
      removeToast: () => set((state) => ({ toasts: state.toasts.slice(1) })),
    }),
    {
      name: 'rp_cfg', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        // Only persist these fields
        customFormats: state.customFormats,
        selectedFormatId: state.selectedFormatId,
        personName: state.personName,
        photosPerPage: state.photosPerPage,
        watermarkEnabled: state.watermarkEnabled,
        theme: state.theme,
        autoFit10x15: state.autoFit10x15,
      }),
      merge: (persistedState, currentState) => {
        const merged = {
          ...currentState,
          ...(persistedState as Partial<AppState>),
        }

        // After merging, validate that the persisted selectedFormatId still exists.
        // This prevents errors if a custom format was selected and then deleted.
        const allFormats = [...FORMATS, ...(merged.customFormats || [])]
        const formatExists = allFormats.some(
          (f) => f.id === merged.selectedFormatId
        )

        if (!formatExists) {
          console.warn('Persisted format ID not found, reverting to default.')
          merged.selectedFormatId = initialState.selectedFormatId // Revert to default
        }

        return merged
      },
    }
  )
)
