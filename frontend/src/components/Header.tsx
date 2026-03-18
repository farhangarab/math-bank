import Button from "./Button";

type HeaderProps = {
  title?: string;

  leftText?: string;
  leftAction?: () => void;

  rightText?: string;
  rightAction?: () => void;
};

function Header({
  title = "MATHBANK",
  leftText,
  leftAction,
  rightText,
  rightAction,
}: HeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-[#354254] text-white">
      {/* left */}
      <div className="flex-1 flex justify-start">
        {leftText && (
          <Button variant="outline" onClick={leftAction}>
            {leftText}
          </Button>
        )}
      </div>

      {/* title */}
      <div className="flex-1 text-center text-xl font-bold tracking-widest">
        {title}
      </div>

      {/* right */}
      <div className="flex-1 flex justify-end">
        {rightText && (
          <Button variant="outline" onClick={rightAction}>
            {rightText}
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
