import { useState } from "react";
import Button from "./Button";
import ConfirmModal from "./ConfirmModal";
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleRightAction = () => {
    if (rightAction) {
      rightAction();
      return;
    }

    if (user) {
      setShowLogoutConfirm(true);
    }
  };

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const actionText = rightText ?? (user ? "Logout" : undefined);
  const headerButtonClass =
    "shrink-0 whitespace-nowrap max-[650px]:border max-[650px]:px-3 max-[650px]:py-1.5 max-[650px]:text-sm max-[650px]:leading-tight";

  return (
    <>
      <header className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 bg-brand-primary px-4 py-3 text-white max-[650px]:min-h-14 max-[650px]:gap-2 max-[650px]:px-3 max-[650px]:py-2 sm:px-6">
        {/* left */}
        <div className="flex min-w-0 justify-start">
          {leftText && (
            <Button
              variant="outline"
              className={headerButtonClass}
              onClick={leftAction}
            >
              {leftText}
            </Button>
          )}
        </div>

        {/* title */}
        <div className="min-w-0 truncate text-center text-xl font-bold tracking-widest max-[650px]:text-lg max-[650px]:tracking-wide">
          {title}
        </div>

        {/* right */}
        <div className="flex min-w-0 justify-end">
          {actionText && (
            <Button
              variant="outline"
              className={headerButtonClass}
              onClick={handleRightAction}
            >
              {actionText}
            </Button>
          )}
        </div>
      </header>

      <ConfirmModal
        open={showLogoutConfirm}
        title="Log out?"
        message="Are you sure you want to log out of MathBank?"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}

export default Header;
