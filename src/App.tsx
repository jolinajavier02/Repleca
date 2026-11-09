import { lazy, Suspense, useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
const StudioEditor = lazy(() => import("./pages/StudioEditor"));
const Workspace = lazy(() => import("./pages/Workspace"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="studio-loading" role="status">
          <span className="orange-text">✳</span> Making a little space for your
          ideas…
        </div>
      }
    >
      <AppRouter />
    </Suspense>
  );
}

function AppRouter() {
  const [view, setView] = useState(() =>
    window.location.hash.startsWith("#/")
      ? window.location.hash.slice(2)
      : "landing",
  );
  useEffect(() => {
    const change = () =>
      setView(
        window.location.hash.startsWith("#/")
          ? window.location.hash.slice(2)
          : "landing",
      );
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  const navigate = (page: string) => {
    window.location.hash = `/${page}`;
    setView(page);
    window.scrollTo(0, 0);
  };
  if (view.startsWith("editor-"))
    return (
      <StudioEditor key={view} mode={view.slice(7)} onNavigate={navigate} />
    );
  if (view === "auth")
    return (
      <div className="legacy-page">
        <button
          className="auth-back text-button"
          onClick={() => navigate("landing")}
        >
          ← Back to Repleca
        </button>
        <AuthPage
          onAuthComplete={(isNew) => navigate(isNew ? "onboarding" : "home")}
        />
      </div>
    );
  if (view === "onboarding")
    return <OnboardingPage onComplete={() => navigate("home")} />;
  if (view === "landing") return <LandingPage onNavigate={navigate} />;
  return <Workspace view={view} onNavigate={navigate} />;
}
