import { useState, useRef, DragEvent } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Trash2, XCircle, Images, X, Frown } from 'lucide-react';
import { useStore } from '../../store';

type PhotoQueueDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function PhotoQueueDialog({ isOpen, onClose }: PhotoQueueDialogProps) {
  const { captureQueue, clearQueue, addToast, removeFromQueue, reorderQueue } = useStore(
    useShallow((state) => ({
      captureQueue: state.captureQueue,
      clearQueue: state.clearQueue,
      addToast: state.addToast,
      removeFromQueue: state.removeFromQueue,
      reorderQueue: state.reorderQueue,
    }))
  );

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleClearQueue = () => {
    clearQueue();
    addToast('Photo queue cleared', 'success');
    onClose();
  };

  const handleRemovePhoto = (index: number) => {
    removeFromQueue(index);
    addToast('Photo removed from queue', 'success', 2000);
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    dragItem.current = index;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      reorderQueue(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggedIndex(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl shadow-2xl border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/10 w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-5 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400 select-none flex items-center gap-3">
            <Images size={24} />
            Photo Booth Queue ({captureQueue.length})
          </h2>
          <div className="flex items-center gap-2">
            {captureQueue.length > 0 && (
              <button
                onClick={handleClearQueue}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors rounded-md px-3 py-1.5 hover:bg-red-100 dark:hover:bg-red-900/20"
                aria-label="Clear photo queue"
              >
                <Trash2 size={14} />
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-zinc-900 focus:ring-red-500 dark:focus:ring-red-600"
              aria-label="Close photo queue dialog"
            >
              <XCircle size={22} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 bg-white dark:bg-zinc-800/50">
          {captureQueue.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
              {captureQueue.map((imgSrc, index) => (
                <div
                  key={index}
                  className={`relative group aspect-square bg-gray-200 dark:bg-zinc-700 rounded-lg overflow-hidden border border-gray-300 dark:border-zinc-700 shadow-sm cursor-grab active:cursor-grabbing transition-opacity duration-200 ${draggedIndex === index ? 'opacity-30 scale-95' : 'hover:scale-105 hover:shadow-lg'} transition-transform`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <img src={imgSrc} alt={`Queued photo ${index + 1}`} className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-200" />
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-1.5 right-1.5 z-10 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600/80 transition-all focus:opacity-100"
                    aria-label={`Remove photo ${index + 1}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
              <Frown size={48} className="mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">The queue is empty</h3>
              <p className="mt-1 text-sm">Enable Photo Booth mode and capture some photos to see them here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}