import { XCircle, HelpCircle } from 'lucide-react';

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
  }
];

export function InfoDialog({ isOpen, onClose }: InfoDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl p-6 sm:p-8 border border-red-200 dark:border-red-800/50 dark:ring-1 dark:ring-white/10 w-full max-w-2xl relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 focus:ring-red-500 dark:focus:ring-red-600"
          aria-label="Close FAQ dialog"
        >
          <XCircle size={24} />
        </button>
        <h2 className="text-xl sm:text-2xl font-semibold text-red-600 dark:text-red-400 mb-6 select-none flex items-center gap-2">
          <HelpCircle size={28} />
          Frequently Asked Questions
        </h2>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-red-100 dark:border-red-900/30 pb-4 last:border-b-0">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{faq.q}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}