import Alert, { type AlertType } from "./Alert";

type MessageSlotProps = {
  message: {
    type: AlertType;
    text: string;
  } | null;
};

export default function MessageSlot({ message }: MessageSlotProps) {
  if (!message) return null;

  return (
    <div className="mb-3">
      <Alert type={message.type} message={message.text} />
    </div>
  );
}
