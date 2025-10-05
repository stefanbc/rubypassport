import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Frown, Images, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import { Dialog } from "@/components/ui";
import { useStore } from "@/store";

type PhotoQueueDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

function SortablePhoto({
    id,
    imgSrc,
    index,
    onRemove,
}: {
    id: string;
    imgSrc: string;
    index: number;
    onRemove: (index: number) => void;
}) {
    const { t } = useTranslation();
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="relative group aspect-square bg-gray-200 dark:bg-zinc-700 rounded-lg overflow-hidden border border-gray-300 dark:border-zinc-700 shadow-sm cursor-grab active:cursor-grabbing"
        >
            <img
                src={imgSrc}
                alt={t("dialogs.photoQueue.queued_photo_alt", {
                    index: index + 1,
                })}
                className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-200"
            />
            <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-1.5 right-1.5 z-10 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600/80 transition-all focus:opacity-100"
                aria-label={t("dialogs.photoQueue.remove_photo_aria", {
                    index: index + 1,
                })}
            >
                <X size={14} />
            </button>
        </div>
    );
}

export function PhotoQueueDialog({ isOpen, onClose }: PhotoQueueDialogProps) {
    const { t } = useTranslation();
    const {
        captureQueue,
        clearQueue,
        addToast,
        removeFromQueue,
        reorderQueue,
    } = useStore(
        useShallow((state) => ({
            captureQueue: state.captureQueue,
            clearQueue: state.clearQueue,
            addToast: state.addToast,
            removeFromQueue: state.removeFromQueue,
            reorderQueue: state.reorderQueue,
        })),
    );

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleClearQueue = () => {
        clearQueue();
        addToast(t("toasts.photoQueueCleared"), "success");
        onClose();
    };

    const handleRemovePhoto = (index: number) => {
        removeFromQueue(index);
        addToast(t("toasts.photoRemovedFromQueue"), "success", 2000);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = captureQueue.indexOf(active.id as string);
            const newIndex = captureQueue.indexOf(over?.id as string);
            reorderQueue(oldIndex, newIndex);
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={t("dialogs.photoQueue.title", {
                count: captureQueue.length,
            })}
            icon={Images}
            closeAriaLabel={t("dialogs.photoQueue.close_aria")}
            maxWidth="max-w-4xl"
        >
            <div className="flex-grow flex flex-col overflow-y-auto bg-white dark:bg-zinc-800/50">
                {captureQueue.length > 0 && (
                    <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-end">
                        <button
                            type="button"
                            onClick={handleClearQueue}
                            className="flex items-center gap-1.5 text-xs sm:text-sm text-red-500/80 hover:text-red-600 dark:text-red-300/80 dark:hover:text-red-300 transition-colors rounded-md px-3 py-1.5 bg-red-100/50 hover:bg-red-100 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                            aria-label={t(
                                "dialogs.photoQueue.clear_queue_aria",
                            )}
                        >
                            <Trash2 size={14} />
                            {t("dialogs.photoQueue.clear_all_button")}
                        </button>
                    </div>
                )}
                <div className="flex-grow overflow-y-auto p-4 sm:p-6">
                    {captureQueue.length > 0 ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={captureQueue}
                                strategy={rectSortingStrategy}
                            >
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                                    {captureQueue.map((imgSrc, index) => (
                                        <SortablePhoto
                                            key={imgSrc}
                                            id={imgSrc}
                                            imgSrc={imgSrc}
                                            index={index}
                                            onRemove={handleRemovePhoto}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                            <Frown size={48} className="mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                                {t("dialogs.photoQueue.empty_title")}
                            </h3>
                            <p className="mt-1 text-sm">
                                {t("dialogs.photoQueue.empty_description")}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
}
