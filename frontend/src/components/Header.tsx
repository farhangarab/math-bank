import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../router/routes";

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleRightAction = async () => {
    if (rightAction) {
      rightAction();
      return;
    }

    if (user) {
      await logout();
      navigate(ROUTES.LOGIN);
    }
  };

  const actionText = rightText ?? (user ? "Logout" : undefined);

  return (
    <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 bg-brand-primary px-4 py-3 text-white sm:flex-nowrap sm:px-6">
      {/* left */}
      <div className="flex flex-1 justify-start">
        {leftText && (
          <Button variant="outline" onClick={leftAction}>
            {leftText}
          </Button>
        )}
      </div>

      {/* title */}
      <div className="order-first w-full text-center text-xl font-bold tracking-widest sm:order-none sm:w-auto sm:flex-1">
        {title}
      </div>

      {/* right */}
      <div className="flex flex-1 justify-end">
        {actionText && (
          <Button variant="outline" onClick={handleRightAction}>
            {actionText}
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
