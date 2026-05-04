type NumericWarningProps = {
  message?: React.ReactNode;
};

function NumericWarning({ message }: NumericWarningProps) {
  return (
    <div
      className="w-full rounded-md border border-status-warningBorder bg-status-warningBg px-3 py-2 text-left text-sm font-medium leading-snug text-status-warningText"
      role="status"
    >
      {message ?? (
        <>
          Numeric grading is for answers like 3.5, 2/3, or 8. If the answer
          contains variables like x, use <strong>Symbolic</strong> or{" "}
          <strong>Exact</strong> grading instead.
        </>
      )}
    </div>
  );
}

export default NumericWarning;
