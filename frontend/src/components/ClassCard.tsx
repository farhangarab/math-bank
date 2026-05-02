type ClassCardProps = {
  id: number;
  name: string;
  code?: string;
  onView?: (id: number) => void;
};

function ClassCard({ id, name, code, onView }: ClassCardProps) {
  return (
    <div className="mb-3 flex flex-col gap-3 rounded border border-brand-primary px-4 py-3 sm:flex-row sm:items-center">
      {/* name */}
      <div className="min-w-0 text-lg font-semibold text-brand-primary sm:w-1/3">
        {name}
      </div>

      {/* class code */}
      <div className="min-w-0 text-sm font-bold text-gray-600 sm:w-1/3 sm:text-center">
        {code && `Class code: ${code}`}
      </div>

      {/* button */}
      <div className="flex sm:w-1/3 sm:justify-end">
        <button
          onClick={() => onView?.(id)}
          className="
            bg-brand-primary
            text-white
            w-full
            px-4
            py-1
            rounded
            hover:bg-brand-primaryHover
            transition
            sm:w-auto
          "
        >
          View
        </button>
      </div>
    </div>
  );
}

export default ClassCard;
