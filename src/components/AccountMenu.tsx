import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../lib/auth";
export default function AccountMenu({
  onNavigate,
  onBeforeLogout,
}: {
  onNavigate: (page: string) => void;
  onBeforeLogout?: () => boolean;
}) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const signOut = async () => {
    if (onBeforeLogout && !onBeforeLogout()) return;
    setBusy(true);
    setError("");
    try {
      await logout();
      onNavigate("home");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not log out. Try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="account-user">
      <button
        className="avatar"
        aria-label="Your account"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {user?.name.charAt(0).toUpperCase() || "Y"}
      </button>
      {open && (
        <div className="account-user-menu">
          <strong>{user?.name}</strong>
          <span>{user?.email}</span>
          <button onClick={signOut} disabled={busy}>
            <LogOut size={15} />
            {busy ? "Logging out…" : "Log out"}
          </button>
          {error && <p role="alert">{error}</p>}
        </div>
      )}
    </div>
  );
}
