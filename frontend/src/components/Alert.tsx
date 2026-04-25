export type AlertType = "error" | "success" | "warning" | "info";

type AlertProps = {
  type: AlertType;
  message: string;
};

const alertStyles: Record<AlertType, string> = {
  error: "border-red-300 bg-red-50 text-red-700",
  success: "border-green-300 bg-green-50 text-green-700",
  warning: "border-amber-300 bg-amber-50 text-amber-800",
  info: "border-blue-300 bg-blue-50 text-blue-700",
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
