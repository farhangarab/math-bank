export type AlertType = "error" | "success" | "warning" | "info";

type AlertProps = {
  type: AlertType;
  message: string;
};

const alertStyles: Record<AlertType, string> = {
  error: "border-status-errorBorder bg-status-errorBg text-status-errorText",
  success:
    "border-status-successBorder bg-status-successBg text-status-successText",
  warning:
    "border-status-warningBorder bg-status-warningBg text-status-warningText",
  info: "border-status-infoBorder bg-status-infoBg text-status-infoText",
};

export default function Alert({ type, message }: AlertProps) {
  return (
    <div
      className={`w-full rounded-md border px-3 py-2 text-left text-sm font-medium leading-snug ${alertStyles[type]}`}
      role={type === "error" ? "alert" : "status"}
    >
      {message}
    </div>
  );
}
