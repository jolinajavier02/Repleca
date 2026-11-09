import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../lib/auth";
export default function AccountMenu({
  onNavigate,
  onBeforeLogout,
  placement = "avatar",
}: {
  onNavigate: (page: string) => void;
  onBeforeLogout?: () => boolean;
  placement?: "avatar" | "sidebar";
}) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !container.current?.contains(event.target)
      )
        setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  const signOut = async () => {
    if (onBeforeLogout && !onBeforeLogout()) return;
    setBusy(true);
    setError("");
    try {
      await logout();
      onNavigate("landing");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not log out. Try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div
      ref={container}
      className={`account-user ${placement === "sidebar" ? "sidebar-account" : ""}`}
    >
      <button
        className={placement === "sidebar" ? "workspace-switcher" : "avatar"}
        aria-label="Your account"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {placement === "sidebar" ? (
          <>
            <span className="workspace-avatar">
              {user?.name.charAt(0).toUpperCase()}
            </span>
            <span>
              {user?.name.split(" ")[0]}’s creative space
              <small>{user?.email}</small>
            </span>
            <ChevronDown size={15} />
          </>
        ) : (
          user?.name.charAt(0).toUpperCase() || "Y"
        )}
      </button>
      {open && (
        <div className="account-user-menu">
          <strong>{user?.name}</strong>
          <span>{user?.email}</span>
          <button onClick={signOut} disabled={busy}>
            <LogOut size={15} />
            {busy ? "Signing out…" : "Sign out"}
          </button>
          {error && <p role="alert">{error}</p>}
        </div>
      )}
    </div>
  );
}
