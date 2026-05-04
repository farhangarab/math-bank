import Button from "./Button";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
};

function ConfirmModal({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 text-center shadow-lg sm:p-6">
        <h2 className="text-lg font-bold text-brand-primary mb-3">{title}</h2>

        <p className="text-sm text-gray-600 mb-6">{message}</p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>

          <Button onClick={onConfirm}>{confirmText}</Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
