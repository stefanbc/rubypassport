import { XCircle, Pencil, Trash2 } from 'lucide-react';
import { Format } from '../types';

export type NewFormatState = {
  label: string;
  widthPx: string;
  heightPx: string;
  printWidthMm: string;
  printHeightMm: string;
};

type FormatDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  customFormats: Format[];
  allFormats: Format[];
  selectedFormatId: string;
  onSetSelectedFormatId: (id: string) => void;
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
  allFormats,
  selectedFormatId,
  onSetSelectedFormatId,
  editingFormat,
  newFormat,
  onNewFormatChange,
  onAdd,
  onUpdate,
  onDelete,
  onEditClick,
  onCancelEdit,
}: FormatDialogProps) {
  if (!isOpen) return null;

  const predefinedFormats = allFormats.filter(f => !f.id.startsWith('custom_'));
  const customFormatsList = allFormats.filter(f => f.id.startsWith('custom_'));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-zinc-900 rounded-lg shadow-2xl p-8 border border-red-800/50 ring-1 ring-white/10 w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close custom format dialog"
        >
          <XCircle size={24} />
        </button>
        <h2 className="text-2xl font-semibold text-red-400 mb-6 select-none">Format Settings</h2>

        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-200 mb-3 select-none" htmlFor="formatSelectorDialog">
            Current Format
          </label>
          <select
            id="formatSelectorDialog"
            value={selectedFormatId}
            onChange={(e) => onSetSelectedFormatId(e.target.value)}
            className="w-full bg-black text-white text-sm px-3 py-2 rounded border border-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <optgroup label="Standard Formats">
              {predefinedFormats.map(f => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </optgroup>
            {customFormatsList.length > 0 && (
              <optgroup label="Custom Formats">
                {customFormatsList.map(f => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        <div className="mb-6 p-4 bg-zinc-800/50 rounded border border-red-900/40">
          <h3 className="text-lg font-semibold text-gray-200 mb-3 select-none">{editingFormat ? 'Edit Format' : 'Add New Format'}</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-gray-300 text-sm w-32 select-none" htmlFor="modalNewFormatLabel">Label</label>
              <input id="modalNewFormatLabel" value={newFormat.label} onChange={e => onNewFormatChange({ ...newFormat, label: e.target.value })} placeholder="e.g. Custom 4x6" className="flex-1 bg-black text-white text-sm px-3 py-2 rounded border border-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-600" />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-gray-300 text-sm w-32 select-none" htmlFor="modalNewFormatWidthPx">Width (px)</label>
              <input id="modalNewFormatWidthPx" type="number" value={newFormat.widthPx} onChange={e => onNewFormatChange({ ...newFormat, widthPx: e.target.value })} placeholder="e.g. 600" className="flex-1 bg-black text-white text-sm px-3 py-2 rounded border border-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-600" />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-gray-300 text-sm w-32 select-none" htmlFor="modalNewFormatHeightPx">Height (px)</label>
              <input id="modalNewFormatHeightPx" type="number" value={newFormat.heightPx} onChange={e => onNewFormatChange({ ...newFormat, heightPx: e.target.value })} placeholder="e.g. 900" className="flex-1 bg-black text-white text-sm px-3 py-2 rounded border border-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-600" />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-gray-300 text-sm w-32 select-none" htmlFor="modalNewFormatPrintWidthMm">Print W (mm)</label>
              <input id="modalNewFormatPrintWidthMm" type="number" value={newFormat.printWidthMm} onChange={e => onNewFormatChange({ ...newFormat, printWidthMm: e.target.value })} placeholder="e.g. 101.6" className="flex-1 bg-black text-white text-sm px-3 py-2 rounded border border-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-600" />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-gray-300 text-sm w-32 select-none" htmlFor="modalNewFormatPrintHeightMm">Print H (mm)</label>
              <input id="modalNewFormatPrintHeightMm" type="number" value={newFormat.printHeightMm} onChange={e => onNewFormatChange({ ...newFormat, printHeightMm: e.target.value })} placeholder="e.g. 152.4" className="flex-1 bg-black text-white text-sm px-3 py-2 rounded border border-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-600" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={editingFormat ? onUpdate : onAdd} className="flex-1 flex items-center justify-center gap-2 bg-red-800 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors cursor-pointer">
                {editingFormat ? 'Update Format' : 'Add Format'}
              </button>
              {editingFormat && (
                <button onClick={onCancelEdit} className="flex-1 flex items-center justify-center gap-2 bg-zinc-600 text-white py-2 px-4 rounded hover:bg-zinc-500 transition-colors cursor-pointer">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {customFormatsList.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Your Custom Formats</h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {customFormatsList.map(format => (
                <li key={format.id} className="flex items-center justify-between text-sm text-gray-300 bg-zinc-800/50 p-2 rounded-md hover:bg-zinc-700/50 transition-colors">
                  <span>{format.label} ({format.widthPx}x{format.heightPx}px)</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEditClick(format)} className="text-blue-400 hover:text-blue-300 p-1 rounded-full hover:bg-blue-900/50 transition-colors" title="Edit format">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => onDelete(format.id)} className="text-red-500 hover:text-red-400 p-1 rounded-full hover:bg-red-900/50 transition-colors" title="Delete format">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}