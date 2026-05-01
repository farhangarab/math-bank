import { cloneElement, isValidElement, useId, type ReactElement } from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

type TooltipProps = {
  children: ReactElement;
  text: string;
  position?: TooltipPosition;
  className?: string;
};

const positionClasses: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "left-1/2 top-full mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

function Tooltip({ children, text, position = "top", className = "" }: TooltipProps) {
  const tooltipId = useId();

  const child = isValidElement<{ "aria-describedby"?: string }>(children)
    ? cloneElement(children, {
        "aria-describedby": [children.props["aria-describedby"], tooltipId]
          .filter(Boolean)
          .join(" "),
      })
    : children;

  return (
    <span className={`group relative inline-flex ${className}`}>
      {child}
      <span
        id={tooltipId}
        role="tooltip"
        className={`pointer-events-none absolute z-50 w-max max-w-80 whitespace-normal rounded-md bg-brand-primary px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 ${positionClasses[position]}`}
      >
        {text}
      </span>
    </span>
  );
}

export default Tooltip;
