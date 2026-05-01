import { useState } from "react";
import CopyIcon from "./icons/CopyIcon";
import Tooltip from "./ui/Tooltip";

type CopyClassCodeProps = {
  code?: string;
};

function CopyClassCode({ code }: CopyClassCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;

    navigator.clipboard?.writeText(code);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  if (!code) return <span>-</span>;

  return (
    <div className="flex items-center gap-2">
      <Tooltip text="Copy class code">
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy class code ${code}`}
          className="flex cursor-copy items-center gap-2 font-bold text-gray-600 hover:text-brand-primary"
        >
          <span>{code}</span>
          <CopyIcon />
        </button>
      </Tooltip>

      {copied && (
        <span className="rounded-full border border-status-successBorder bg-status-successBg px-2 py-1 text-sm font-semibold text-status-successText">
          Copied
        </span>
      )}
    </div>
  );
}

export default CopyClassCode;
