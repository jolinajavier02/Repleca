import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
  LoaderCircle,
} from "lucide-react";
import Brand from "../components/Brand";
import StudioArtwork from "../components/StudioArtwork";
import { useAuth } from "../lib/auth";

export default function AuthPage({
  onAuthComplete,
  onBack,
}: {
  onAuthComplete: () => void;
  onBack: () => void;
}) {
  const { login, signup, error: serviceError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
    setVisible(false);
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    setSuccess("");
    if (!isLogin && password !== confirmPassword) {
      setError("Your passwords do not match. Please try again.");
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        setPassword("");
        onAuthComplete();
      } else {
        await signup(name, email, password, confirmPassword);
        setIsLogin(true);
        setPassword("");
        setConfirmPassword("");
        setVisible(false);
        setSuccess(
          "Your account is ready. Log in with your email and password to start creating.",
        );
        document.getElementById("account-email")?.focus();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="account-page">
      <section className="account-story">
        <div className="account-story-top">
          <Brand onClick={onBack} />
          <span>YOUR CREATIVE CHAPTER STARTS HERE.</span>
        </div>
        <div className="account-story-copy">
          <div className="eyebrow">
            <span className="status-dot" /> A LITTLE SPACE, JUST FOR YOU.
          </div>
          <h1>
            Good things
            <br />
            start with
            <br />
            <i>a little idea.</i>
          </h1>
          <p>
            Your stories. Your perspective. Your next big thing.
            <br />
            Make room for all of it.
          </p>
        </div>
        <div className="account-art-collage">
          <div className="account-poster">
            <StudioArtwork variant={4} />
            <span>
              MAKE
              <br />
              <i>your mark.</i>
            </span>
            <small>REPLECA CREATIVE CLUB — EST. 2026</small>
          </div>
          <div className="account-small-poster">
            <StudioArtwork variant={1} />
            <span>
              STAY
              <br />
              CURIOUS.
            </span>
          </div>
          <span className="account-sticker">
            A LITTLE
            <br />
            <b>you</b>
            <br />
            GOES A LONG WAY ↗
          </span>
        </div>
        <div className="account-story-bottom">
          <span>✳</span> A happy place for your next great thing.
        </div>
      </section>
      <section className="account-form-side">
        <button className="text-button account-back" onClick={onBack}>
          <ArrowLeft size={15} /> Back to the good stuff
        </button>
        <div className="account-mobile-brand">
          <Brand onClick={onBack} />
        </div>
        <div className="account-form-wrap">
          <div className="account-step">
            {isLogin ? "YOUR STUDIO IS WAITING." : "LET’S MAKE IT OFFICIAL."}
            <span>✳</span>
          </div>
          <h2>
            {isLogin
              ? "Back for more good ideas?"
              : "A little space of your own."}
          </h2>
          <p className="account-intro">
            {isLogin
              ? "Log in to pick up your creative flow."
              : "Create your account. Your next great thing is waiting."}
          </p>
          <div className="account-mode-switch" aria-label="Account form">
            <button
              className={isLogin ? "active" : ""}
              disabled={loading}
              onClick={() => {
                if (!isLogin) switchMode();
              }}
            >
              Log in
            </button>
            <button
              className={!isLogin ? "active" : ""}
              disabled={loading}
              onClick={() => {
                if (isLogin) switchMode();
              }}
            >
              Sign up
            </button>
          </div>
          {success && (
            <div className="account-message success" role="status">
              <Check size={18} />
              <span>{success}</span>
            </div>
          )}
          {(error || serviceError) && (
            <div className="account-message error" role="alert">
              {error || serviceError}
            </div>
          )}
          <form
            onSubmit={submit}
            className="account-form"
            aria-label={isLogin ? "Log in form" : "Sign up form"}
          >
            {!isLogin && (
              <label htmlFor="account-name">
                Your name
                <div className="account-input">
                  <UserRound size={17} />
                  <input
                    id="account-name"
                    autoComplete="name"
                    placeholder="How should we call you?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    maxLength={80}
                    disabled={loading}
                  />
                </div>
              </label>
            )}
            <label htmlFor="account-email">
              Email address
              <div className="account-input">
                <Mail size={17} />
                <input
                  id="account-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={254}
                  disabled={loading}
                />
              </div>
            </label>
            <label htmlFor="account-password">
              Password
              <div className="account-input">
                <LockKeyhole size={17} />
                <input
                  id="account-password"
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  placeholder={
                    isLogin ? "Your password" : "At least 12 characters"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={isLogin ? undefined : 12}
                  maxLength={128}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="icon-button"
                  aria-label={visible ? "Hide password" : "Show password"}
                  aria-pressed={visible}
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {!isLogin && (
                <small>
                  Use at least 12 characters. A few memorable words work well.
                </small>
              )}
            </label>
            {!isLogin && (
              <label htmlFor="account-confirm">
                Confirm password
                <div className="account-input">
                  <LockKeyhole size={17} />
                  <input
                    id="account-confirm"
                    type={visible ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="One more time, just to be sure"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    maxLength={128}
                    disabled={loading}
                  />
                </div>
              </label>
            )}
            <button
              className="button button-orange account-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="loading-wheel" size={18} />
                  {isLogin ? "Logging you in…" : "Creating your account…"}
                </>
              ) : (
                <>
                  {isLogin ? "Log in & start creating" : "Create my account"}
                  <ArrowUpRight size={19} />
                </>
              )}
            </button>
          </form>
          <p className="account-switch-copy">
            {isLogin ? "New around here?" : "Already part of the club?"}{" "}
            <button
              className="text-button"
              disabled={loading}
              onClick={switchMode}
            >
              {isLogin ? "Create an account" : "Log in instead"}{" "}
              <ArrowUpRight size={13} />
            </button>
          </p>
          <div className="account-form-note">
            <span className="status-dot" />
            {isLogin
              ? "Your ideas have a place here."
              : "After signing up, you’ll log in to open your editor."}
          </div>
        </div>
        <footer className="account-footer">
          <span>© {new Date().getFullYear()} Repleca Studio</span>
          <span>Made for your creative flow. ✳</span>
        </footer>
      </section>
    </main>
  );
}
