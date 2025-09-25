import { useState } from 'react';
import { XCircle, HelpCircle, ChevronDown } from 'lucide-react';

type InfoDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const faqs = [
  {
    q: 'What is Ruby Passport?',
    a: 'Ruby Passport is a modern web app for capturing and generating compliant passport/ID photos directly in your browser. It helps you create photos that meet specific size and alignment requirements for various countries.'
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. All photo processing happens locally in your browser. Your photos are never uploaded to a server, ensuring your privacy and security.'
  },
  {
    q: 'How accurate is the printing?',
    a: 'The Print Preview feature generates a page with photos tiled to exact physical dimensions. For best results, ensure your printer settings are at 100% scale and "fit to page" is disabled.'
  },
  {
    q: 'Can I create custom photo formats?',
    a: 'Absolutely. You can add, edit, and delete your own photo formats with precise pixel and physical print dimensions using the "Format Settings" (F) dialog.'
  },
  {
    q: 'Can I use an existing photo instead of the camera?',
    a: "Yes! You can import an image from your computer by clicking the 'Import' button or by dragging and dropping a file. If your image is larger than the selected format, you'll be able to drag it to reposition it for the perfect crop before it's processed."
  },
  {
    q: 'What are the alignment guides for?',
    a: 'The live guides on the camera view help you align your face correctly according to the selected format\'s requirements, ensuring your photo is compliant.'
  },
  {
    q: 'What is the "Auto-fit to 10x15cm" option?',
    a: 'This option in the Print Preview automatically arranges the maximum number of photos to fit perfectly on a standard 10x15 cm (4x6 inch) photo paper sheet, minimizing waste.'
  },
  {
    q: 'Can I add a watermark to my photos?',
    a: 'Yes. On the Result screen, click the copyright icon (©) to open the watermark settings. From there, you can enable or disable the watermark and customize the text that appears on your photo.'
  },
  {
    q: 'What is Photo Booth mode?',
    a: 'Photo Booth mode allows you to capture multiple photos that are queued for batch printing on the same paper. Enable it with the Photo Booth icon (multiple images) in the header or by pressing "B". When photos are in the queue, this button shows the count and opens the queue dialog. Inside the dialog, you can rearrange photos by dragging them or delete individual photos by hovering over them. You can then print all queued photos together.'
  }
];

export function InfoDialog({ isOpen, onClose }: InfoDialogProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl shadow-2xl border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/10 w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-5 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400 select-none flex items-center gap-3">
            <HelpCircle size={24} />
            Frequently Asked Questions
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer rounded-full"
            aria-label="Close FAQ dialog"
          >
            <XCircle size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 bg-white dark:bg-zinc-800/50">
          <div className="space-y-2">
            {faqs.map((faq, index) => {
              const isFaqOpen = openIndex === index;
              return (
                <div key={index} className="border-b border-red-100 dark:border-red-900/30 last:border-b-0">
                  <div
                    className="flex items-center justify-between cursor-pointer py-3"
                    onClick={() => toggleFaq(index)}
                    role="button"
                    aria-expanded={isFaqOpen}
                  >
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 pr-4">{faq.q}</h3>
                    <ChevronDown size={20} className={`flex-shrink-0 text-gray-500 transition-transform duration-300 ${isFaqOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <div className={`grid transition-all duration-300 ease-in-out ${isFaqOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed pb-4 pr-6">{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}