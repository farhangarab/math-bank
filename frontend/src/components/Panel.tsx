type PanelProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Panel({ children, className = "" }: PanelProps) {
  return (
    <div className={`rounded border border-brand-primary p-6 ${className}`}>
      {children}
    </div>
  );
}
