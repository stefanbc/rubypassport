import { useState, useEffect } from 'react';
import { XCircle, Pencil, Trash2, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Format, NewFormatState, FORMATS } from '../../types';
import { useStore } from '../../store';

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
  const { customFormats, selectedFormatId, setSelectedFormatId } = useStore();
  const allFormats = [...FORMATS, ...customFormats];

  const [isAddFormVisible, setIsAddFormVisible] = useState(false);

  useEffect(() => {
    if (editingFormat) {
      setIsAddFormVisible(true);
    }
  }, [editingFormat]);

  if (!isOpen) return null;

  const handleCancelEditAndCollapse = () => {
    onCancelEdit();
    setIsAddFormVisible(false);
  };

  const handleUpdateAndCollapse = () => {
    onUpdate();
    setIsAddFormVisible(false);
  };

  const predefinedFormats = allFormats.filter(f => !f.id.startsWith('custom_'));
  const customFormatsList = allFormats.filter(f => f.id.startsWith('custom_'));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl shadow-2xl border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/10 w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-5 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400 select-none flex items-center gap-3">
            <SlidersHorizontal size={24} />
            Format Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer rounded-full"
            aria-label="Close format settings dialog"
          >
            <XCircle size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 sm:p-8 bg-white dark:bg-zinc-800/50">
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 select-none" htmlFor="formatSelectorDialog">
              Current Format
            </label>
            <select
              id="formatSelectorDialog"
              value={selectedFormatId}
              onChange={(e) => setSelectedFormatId(e.target.value)}
              className="w-full bg-gray-100 dark:bg-black text-gray-800 dark:text-white text-sm py-3 px-4 rounded border border-red-200 dark:border-red-900/40"
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

          <div className="mb-6 p-4 bg-red-50/50 dark:bg-zinc-800/50 rounded border border-red-100 dark:border-red-900/40">
            <div
              className={`flex items-center justify-between ${!editingFormat ? 'cursor-pointer' : 'cursor-default'}`}
              onClick={() => !editingFormat && setIsAddFormVisible(!isAddFormVisible)}
              role="button"
              aria-expanded={isAddFormVisible}
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 select-none">{editingFormat ? 'Edit Format' : 'Add New Format'}</h3>
              {!editingFormat && (
                <span className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white p-1 -mr-1">
                  <ChevronDown size={20} className={`transition-transform duration-300 ${isAddFormVisible ? 'rotate-180' : ''}`} />
                </span>
              )}
            </div>
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isAddFormVisible ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-3 mt-4 border-t border-red-200 dark:border-red-900/30 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <label className="text-gray-600 dark:text-gray-300 text-sm sm:w-32 select-none self-start sm:self-center" htmlFor="modalNewFormatLabel">Label</label>
                  <input id="modalNewFormatLabel" value={newFormat.label} onChange={e => onNewFormatChange({ ...newFormat, label: e.target.value })} placeholder="e.g. Custom 4x6" className="w-full sm:flex-1 bg-gray-100 dark:bg-black text-gray-800 dark:text-white text-sm px-3 py-2 rounded border border-red-200 dark:border-red-900/40" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <label className="text-gray-600 dark:text-gray-300 text-sm sm:w-32 select-none self-start sm:self-center" htmlFor="modalNewFormatWidthPx">Width (px)</label>
                  <input id="modalNewFormatWidthPx" type="number" value={newFormat.widthPx} onChange={e => onNewFormatChange({ ...newFormat, widthPx: e.target.value })} placeholder="e.g. 600" className="w-full sm:flex-1 bg-gray-100 dark:bg-black text-gray-800 dark:text-white text-sm px-3 py-2 rounded border border-red-200 dark:border-red-900/40" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <label className="text-gray-600 dark:text-gray-300 text-sm sm:w-32 select-none self-start sm:self-center" htmlFor="modalNewFormatHeightPx">Height (px)</label>
                  <input id="modalNewFormatHeightPx" type="number" value={newFormat.heightPx} onChange={e => onNewFormatChange({ ...newFormat, heightPx: e.target.value })} placeholder="e.g. 900" className="w-full sm:flex-1 bg-gray-100 dark:bg-black text-gray-800 dark:text-white text-sm px-3 py-2 rounded border border-red-200 dark:border-red-900/40" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <label className="text-gray-600 dark:text-gray-300 text-sm sm:w-32 select-none self-start sm:self-center" htmlFor="modalNewFormatPrintWidthMm">Print W (mm)</label>
                  <input id="modalNewFormatPrintWidthMm" type="number" value={newFormat.printWidthMm} onChange={e => onNewFormatChange({ ...newFormat, printWidthMm: e.target.value })} placeholder="e.g. 101.6" className="w-full sm:flex-1 bg-gray-100 dark:bg-black text-gray-800 dark:text-white text-sm px-3 py-2 rounded border border-red-200 dark:border-red-900/40" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <label className="text-gray-600 dark:text-gray-300 text-sm sm:w-32 select-none self-start sm:self-center" htmlFor="modalNewFormatPrintHeightMm">Print H (mm)</label>
                  <input id="modalNewFormatPrintHeightMm" type="number" value={newFormat.printHeightMm} onChange={e => onNewFormatChange({ ...newFormat, printHeightMm: e.target.value })} placeholder="e.g. 152.4" className="w-full sm:flex-1 bg-gray-100 dark:bg-black text-gray-800 dark:text-white text-sm px-3 py-2 rounded border border-red-200 dark:border-red-900/40" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button onClick={editingFormat ? handleUpdateAndCollapse : onAdd} className="flex-1 flex items-center justify-center gap-2 bg-red-700 dark:bg-red-800 text-white py-2 px-4 rounded hover:bg-red-600 dark:hover:bg-red-700 transition-colors cursor-pointer">
                    {editingFormat ? 'Update Format' : 'Add Format'}
                  </button>
                  {editingFormat && (
                    <button onClick={handleCancelEditAndCollapse} className="flex-1 flex items-center justify-center gap-2 bg-gray-500 dark:bg-zinc-600 text-white py-2 px-4 rounded hover:bg-gray-600 dark:hover:bg-zinc-500 transition-colors cursor-pointer">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {customFormatsList.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Your Custom Formats</h3>
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {customFormatsList.map(format => (
                  <li key={format.id} className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 bg-red-50/50 dark:bg-zinc-800/50 p-2 rounded-md hover:bg-red-100/50 dark:hover:bg-zinc-700/50 transition-colors">
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
    </div>
  );
}