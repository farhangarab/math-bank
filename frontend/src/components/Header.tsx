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
    <header className="h-16 flex items-center justify-between px-6 bg-brand-primary text-white">
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
