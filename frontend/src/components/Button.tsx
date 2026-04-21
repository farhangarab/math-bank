type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  variant?: "primary" | "outline" | "ghost";
  full?: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

function Button({
  children,
  type = "button",
  variant = "primary",
  full = false,
  onClick,
  disabled = false,
}: ButtonProps) {
  const base = "font-semibold rounded-md transition-colors duration-200";

  const disabledStyle = "opacity-50 cursor-not-allowed pointer-events-none";

  const primary = "bg-[#354254] text-white hover:bg-[#2c3746]";

  const outline =
    "border-2 border-white text-white hover:bg-white hover:text-[#354254]";

  const ghost =
    "border border-[#354254] text-[#354254] hover:bg-[#354254] hover:text-white";

  const width = full
    ? "block w-full max-w-[400px] bg-[#354254] text-white text-center text-xl font-semibold py-4 rounded-md shadow-[0_5px_0_#202834] active:shadow-[0_0px_0_#202834] active:translate-y-[5px] transition-all duration-75"
    : "px-6 py-2";

  const style =
    variant === "primary"
      ? `${base} ${primary} ${width} ${disabled ? disabledStyle : ""}`
      : variant === "outline"
        ? `${base} ${outline} ${width} ${disabled ? disabledStyle : ""}`
        : `${base} ${ghost} ${width} ${disabled ? disabledStyle : ""}`;
  return (
    <button type={type} className={style} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
