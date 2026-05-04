import { useEffect, useRef, useState } from "react";

type MoreActionsMenuProps = {
  label: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

function MoreActionsMenu({ label, onEdit, onDelete }: MoreActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleEdit = () => {
    setIsOpen(false);
    onEdit?.();
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete?.();
  };

  return (
    <div ref={menuRef} className="relative inline-flex">
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        className="rounded-md px-2 py-2 text-xl font-bold leading-none text-brand-primary transition-colors hover:bg-brand-surface"
        onClick={() => setIsOpen((open) => !open)}
      >
        &#8942;
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 w-28 rounded-md border border-brand-borderSoft bg-white py-1 text-left shadow-lg">
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-sm font-semibold text-brand-primary hover:bg-brand-surface"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-sm font-semibold text-status-errorText hover:bg-status-errorBg"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default MoreActionsMenu;
