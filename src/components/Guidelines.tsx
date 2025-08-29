import { CheckCircle, XCircle, Sun } from 'lucide-react';

export function Guidelines() {
  return (
    <div className="bg-zinc-900 rounded-lg shadow-xl p-6 border border-red-800/50 ring-1 ring-white/5 h-full flex flex-col transition-shadow duration-200 hover:shadow-2xl">
      <h2 className="text-xl font-semibold text-red-400 mb-1 select-none">Guidelines</h2>
      <p className="text-xs text-gray-400 mb-4">Follow these for most country standards.</p>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-green-400" />
            <h4 className="font-medium text-gray-200">Do</h4>
          </div>
          <ul className="text-sm text-gray-400 space-y-1 pl-1">
            <li>• Keep your head centered and straight</li>
            <li>• Look directly at the camera</li>
            <li>• Maintain a neutral expression (mouth closed)</li>
            <li>• Remove glasses and headwear (unless religious)</li>
            <li>• Ensure eyes are clearly visible</li>
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={16} className="text-red-400" />
            <h4 className="font-medium text-gray-200">Don't</h4>
          </div>
          <ul className="text-sm text-gray-400 space-y-1 pl-1">
            <li>• No smiling, tilting, or squinting</li>
            <li>• No heavy makeup or filters</li>
            <li>• Avoid hats, headphones, or accessories</li>
            <li>• Avoid harsh shadows or backlight</li>
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sun size={16} className="text-yellow-300" />
            <h4 className="font-medium text-gray-200">Lighting & Background</h4>
          </div>
          <ul className="text-sm text-gray-400 space-y-1 pl-1">
            <li>• Use bright, even lighting from the front</li>
            <li>• Stand ~0.5 m from a plain, light background</li>
            <li>• Avoid strong shadows under chin or nose</li>
            <li>• Prefer mid-tone clothing (not white)</li>
          </ul>
        </div>
        <div className="mt-1 rounded-md bg-zinc-800/60 border border-red-900/40 p-3">
          <p className="text-xs text-gray-300">
            Tip: Align your face within the outer oval. The eye line should be near the guide.
          </p>
        </div>
        <div className="mt-1 rounded-md bg-zinc-800/60 border border-red-900/40 p-3">
          <p className="text-xs text-gray-300">
            <span className="font-semibold">Your Privacy Matters</span><br />
            This app is designed with your privacy in mind. Everything happens right in your browser — we never upload, store, or save your images anywhere. Once you’re done, they’re gone.
          </p>
        </div>
      </div>
    </div>
  );
}