import Button from "./Button";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

function ConfirmModal({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md text-center shadow-lg">
        <h2 className="text-lg font-bold text-[#354254] mb-3">{title}</h2>

        <p className="text-sm text-gray-600 mb-6">{message}</p>

        <div className="flex justify-center gap-4">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>

          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
