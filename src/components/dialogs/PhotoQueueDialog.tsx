import { useState, useRef, DragEvent } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Trash2, Images, X, Frown } from 'lucide-react';
import { useStore } from '../../store';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../ui/Dialog';

type PhotoQueueDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function PhotoQueueDialog({ isOpen, onClose }: PhotoQueueDialogProps) {
  const { t } = useTranslation();
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

  const handleClearQueue = () => {
    clearQueue();
    addToast(t('toasts.photoQueueCleared', 'Photo queue cleared'), 'success');
    onClose();
  };

  const handleRemovePhoto = (index: number) => {
    removeFromQueue(index);
    addToast(t('toasts.photoRemovedFromQueue', 'Photo removed from queue'), 'success', 2000);
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
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t('dialogs.photoQueue.title', { count: captureQueue.length })}
      icon={Images}
      closeAriaLabel={t('dialogs.photoQueue.close_aria')}
      maxWidth="max-w-4xl"
    >
      <div className="flex-grow flex flex-col overflow-y-auto bg-white dark:bg-zinc-800/50">
        {captureQueue.length > 0 && (
          <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-end">
            <button
              onClick={handleClearQueue}
              className="flex items-center gap-1.5 text-xs sm:text-sm text-red-500/80 hover:text-red-600 dark:text-red-300/80 dark:hover:text-red-300 transition-colors rounded-md px-3 py-1.5 bg-red-100/50 hover:bg-red-100 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              aria-label={t('dialogs.photoQueue.clear_queue_aria')}
            >
              <Trash2 size={14} />
              {t('dialogs.photoQueue.clear_all_button')}
            </button>
          </div>
        )}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6">
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
                  <img src={imgSrc} alt={t('dialogs.photoQueue.queued_photo_alt', { index: index + 1 })} className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-200" />
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-1.5 right-1.5 z-10 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600/80 transition-all focus:opacity-100"
                    aria-label={t('dialogs.photoQueue.remove_photo_aria', { index: index + 1 })}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
              <Frown size={48} className="mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">{t('dialogs.photoQueue.empty_title')}</h3>
              <p className="mt-1 text-sm">{t('dialogs.photoQueue.empty_description')}</p>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}