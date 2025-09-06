export type ToastType = 'error' | 'info' | 'success';

export type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

export type Format = {
  id: string;
  label: string;
  widthPx: number;
  heightPx: number;
  printWidthIn: number;
  printHeightIn: number;
};

export const PHOTO_COUNTS = [1, 2, 4, 6, 8, 10, 12] as const;
export type PhotoCount = typeof PHOTO_COUNTS[number];

export type Theme = 'light' | 'dark';

export type DialogType =
  | 'customFormat'
  | 'download'
  | 'shortcuts'
  | 'print'
  | 'info'
  | 'import'
  | null;

export type WizardStep = 'guidelines' | 'camera' | 'result';

export type FacingMode = 'user' | 'environment';

// Supported passport/ID photo formats
export const FORMATS: readonly Format[] = [
  { id: 'us_2x2', label: 'US 2x2 in (600×600 px)', widthPx: 600, heightPx: 600, printWidthIn: 2, printHeightIn: 2 },
  { id: 'eu_35x45', label: 'EU/UK 35×45 mm (~413×531 px)', widthPx: 413, heightPx: 531, printWidthIn: 35 / 25.4, printHeightIn: 45 / 25.4 },
  { id: 'ca_50x70', label: 'Canada 50×70 mm (~591×827 px)', widthPx: 591, heightPx: 827, printWidthIn: 50 / 25.4, printHeightIn: 70 / 25.4 },
  { id: 'in_51x51', label: 'India 51×51 mm (~602×602 px)', widthPx: 602, heightPx: 602, printWidthIn: 51 / 25.4, printHeightIn: 51 / 25.4 },
  { id: 'ro_35x45', label: 'Romania 35×45 mm (~413×531 px)', widthPx: 413, heightPx: 531, printWidthIn: 35 / 25.4, printHeightIn: 45 / 25.4 },
  { id: 'cn_33x48', label: 'China 33×48 mm (~390×567 px)', widthPx: 390, heightPx: 567, printWidthIn: 33 / 25.4, printHeightIn: 48 / 25.4 },
  { id: 'ru_35x45', label: 'Russia 35×45 mm (~413×531 px)', widthPx: 413, heightPx: 531, printWidthIn: 35 / 25.4, printHeightIn: 45 / 25.4 },
  { id: 'au_35x45', label: 'Australia 35×45 mm (~413×531 px)', widthPx: 413, heightPx: 531, printWidthIn: 35 / 25.4, printHeightIn: 45 / 25.4 },
  { id: 'br_50x70', label: 'Brazil 50×70 mm (~591×827 px)', widthPx: 591, heightPx: 827, printWidthIn: 50 / 25.4, printHeightIn: 70 / 25.4 },
  { id: 'mx_25x30', label: 'Mexico 25×30 mm (~295×354 px)', widthPx: 295, heightPx: 354, printWidthIn: 25 / 25.4, printHeightIn: 30 / 25.4 }
];
export type PredefinedFormatId = typeof FORMATS[number]['id'];
export type FormatId = PredefinedFormatId | string;

export type NewFormatState = {
  label: string;
  widthPx: string;
  heightPx: string;
  printWidthMm: string;
  printHeightMm: string;
};