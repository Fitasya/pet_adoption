export type ModalVariant = 'danger' | 'primary' | 'warning' | 'success';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ModalVariant;
  onConfirm: () => void;
  onClose: () => void;
}

// Map variants to specific button background colors
const variantButtonStyles: Record<ModalVariant, string> = {
  danger: 'bg-rose-600 hover:bg-rose-700 text-white',
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  warning: 'bg-amber-600 hover:bg-amber-700 text-white',
  success: 'bg-orange-600 hover:bg-orange-700 text-white',
};

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-9999 
    flex items-center justify-center bg-black/50 p-0">
      {/* Modal Dialog Box */}
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${variantButtonStyles[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}