import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Format, FormatId, FORMATS, Toast, PhotoCount } from './types'

interface AppState {
  // LocalStorage persisted state
  customFormats: Format[]
  selectedFormatId: FormatId
  personName: string
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

  wizardStep: 'guidelines' | 'camera' | 'result'
  baseImage: string | null
  capturedImage: string | null
  highResBlob: Blob | null
  stream: MediaStream | null
  isCameraOn: boolean
  isCameraLoading: boolean
  facingMode: 'user' | 'environment'
  toasts: (Toast & { duration: number })[]
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
  setWatermarkEnabled: (enabled: boolean) => void
  setAutoFit10x15: (enabled: boolean) => void

  // UI Actions
  setIsProcessingImage: (isProcessing: boolean) => void
  setIsMobile: (isMobile: boolean) => void
  setIsPWA: (isPWA: boolean) => void
  setIsFullscreen: (isFullscreen: boolean) => void
  setActiveDialog: (dialog: AppState['activeDialog']) => void

  // Image/Camera Actions
  setWizardStep: (step: 'guidelines' | 'camera' | 'result') => void
  setBaseImage: (image: string | null) => void
  setCapturedImage: (image: string | null) => void
  setHighResBlob: (blob: Blob | null) => void
  setStream: (stream: MediaStream | null) => void
  setIsCameraOn: (isOn: boolean) => void
  setIsCameraLoading: (isLoading: boolean) => void
  setFacingMode: (mode: 'user' | 'environment') => void
  retakePhoto: (isMobile: boolean) => void

  // Toast Actions
  addToast: (
    message: string,
    type?: 'error' | 'info' | 'success',
    duration?: number
  ) => void
  removeToast: () => void
}

const initialState: AppState = {
  customFormats: [],
  selectedFormatId: 'eu_35x45',
  personName: '',
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
      setWatermarkEnabled: (enabled) => set({ watermarkEnabled: enabled }),
      setAutoFit10x15: (enabled) => set({ autoFit10x15: enabled }),

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
      name: 'ruby-passport-settings', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        // Only persist these fields
        customFormats: state.customFormats,
        selectedFormatId: state.selectedFormatId,
        personName: state.personName,
        photosPerPage: state.photosPerPage,
        watermarkEnabled: state.watermarkEnabled,
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
