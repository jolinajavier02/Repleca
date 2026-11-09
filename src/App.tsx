import { lazy, Suspense, useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import { AuthProvider, useAuth } from "./lib/auth";
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
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </Suspense>
  );
}

function AppRouter() {
  const { user, loading } = useAuth();
  const [destination, setDestination] = useState("editor-video");
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
    if (page !== "landing" && page !== "auth" && !user) {
      setDestination(page.startsWith("editor-") ? page : "editor-video");
      page = "auth";
    }
    window.location.hash = `/${page}`;
    setView(page);
    window.scrollTo(0, 0);
  };
  const authPage = (
    <AuthPage
      onBack={() => navigate("landing")}
      onAuthComplete={() => {
        const page = view.startsWith("editor-") ? view : destination;
        window.location.hash = `/${page}`;
        setView(page);
        window.scrollTo(0, 0);
      }}
    />
  );
  if (view === "landing") return <LandingPage onNavigate={navigate} />;
  if (loading)
    return (
      <div className="studio-loading" role="status">
        <span className="orange-text">✳</span> Opening your creative space…
      </div>
    );
  if (view === "auth" || !user) return authPage;
  if (view.startsWith("editor-"))
    return (
      <StudioEditor
        key={`${user.id}:${view}`}
        mode={view.slice(7)}
        onNavigate={navigate}
      />
    );
  if (view === "onboarding")
    return <OnboardingPage onComplete={() => navigate("editor-video")} />;
  return <Workspace key={user.id} view={view} onNavigate={navigate} />;
}
