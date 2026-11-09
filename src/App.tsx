import { lazy, Suspense, useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import { AuthProvider, useAuth } from "./lib/auth";
const StudioEditor = lazy(() => import("./pages/StudioEditor"));
const ContentEditor = lazy(() => import("./pages/ContentEditor"));
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
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
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
    if (!["landing", "home", "auth"].includes(page) && !user) {
      setAuthMode("login");
      page = "auth";
    }
    window.location.hash = `/${page}`;
    setView(page);
    window.scrollTo(0, 0);
  };
  const authPage = (
    <AuthPage
      initialMode={authMode}
      onBack={() => navigate("home")}
      onAuthComplete={() => {
        window.location.hash = "/home";
        setView("home");
        window.scrollTo(0, 0);
      }}
    />
  );
  if (view === "landing")
    return (
      <LandingPage
        onNavigate={(page) => {
          if (page === "auth") setAuthMode("login");
          navigate(page);
        }}
      />
    );
  if (loading)
    return (
      <div className="studio-loading" role="status">
        <span className="orange-text">✳</span> Opening your creative space…
      </div>
    );
  if (["home", "brand", "analytics"].includes(view))
    return (
      <Workspace
        key={user?.id || "guest"}
        view="home"
        onNavigate={navigate}
        onAuthRequested={(mode) => {
          setAuthMode(mode);
          navigate("auth");
        }}
      />
    );
  if (view === "auth" || !user) return authPage;
  if (["document", "excel", "website"].includes(view.slice(7).split("?")[0]))
    return (
      <ContentEditor
        key={`${user.id}:${view}`}
        mode={view.slice(7)}
        onNavigate={navigate}
      />
    );
  if (view.startsWith("editor-"))
    return (
      <StudioEditor
        key={`${user.id}:${view}`}
        mode={view.slice(7)}
        onNavigate={navigate}
      />
    );
  if (view === "onboarding")
    return <OnboardingPage onComplete={() => navigate("home")} />;
  return <Workspace key={user.id} view={view} onNavigate={navigate} />;
}
