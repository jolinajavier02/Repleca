import { useState } from "react";
import {
  ArrowUpRight,
  Play,
  Check,
  Film,
  Image,
  Presentation,
  Mic,
  Type,
  Plus,
  MousePointer2,
  Scissors,
  Music2,
  Layers,
  Sparkles,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import Brand from "../components/Brand";
import StudioArtwork from "../components/StudioArtwork";

const tools = [
  {
    id: "video",
    name: "Video",
    icon: Film,
    color: "peach",
    title: "A little cut. A big story.",
    description:
      "Find your rhythm with a visual timeline, flexible formats, and room for every detail.",
  },
  {
    id: "image",
    name: "Design",
    icon: Image,
    color: "lavender",
    title: "Make something worth a second look.",
    description:
      "Build expressive graphics with type, color, and a canvas that makes space for your ideas.",
  },
  {
    id: "present",
    name: "Slides",
    icon: Presentation,
    color: "yellow",
    title: "Give your ideas the big picture.",
    description:
      "Bring a new perspective to your next presentation, one thoughtfully designed slide at a time.",
  },
  {
    id: "podcast",
    name: "Audio",
    icon: Mic,
    color: "mint",
    title: "Good stories deserve to be heard.",
    description:
      "Organize your audio and shape the visual identity of your next episode in one workspace.",
  },
  {
    id: "script",
    name: "Scripts",
    icon: Type,
    color: "pink",
    title: "Every great story starts here.",
    description:
      "Get your ideas out of your head and onto the page with a focused writing workspace.",
  },
];

export default function LandingPage({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [active, setActive] = useState(0);
  const [menu, setMenu] = useState(false);
  return (
    <div className="landing">
      <header className="landing-header wrap">
        <Brand
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
        <nav
          className={menu ? "landing-nav open" : "landing-nav"}
          aria-label="Main navigation"
        >
          <a href="#studio" onClick={() => setMenu(false)}>
            The studio <ChevronDown size={13} />
          </a>
          <a href="#how-it-works" onClick={() => setMenu(false)}>
            How it works
          </a>
          <a href="#templates" onClick={() => setMenu(false)}>
            Templates
          </a>
        </nav>
        <div className="header-actions">
          <button
            className="text-button login-link"
            onClick={() => onNavigate("auth")}
          >
            Log in
          </button>
          <button
            className="button button-dark small"
            onClick={() => onNavigate("home")}
          >
            Open studio <ArrowUpRight size={15} />
          </button>
          <button
            className="icon-button menu-toggle"
            aria-label="Toggle menu"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main>
        <section className="hero-section wrap">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" /> YOUR IDEAS. ALL IN ONE PLACE.
            </div>
            <h1>
              Big ideas.
              <br />
              Meet your
              <br />
              <span className="orange-text">little studio.</span>
              <svg
                className="headline-spark"
                viewBox="0 0 60 70"
                aria-hidden="true"
              >
                <path
                  d="m30 3 1 64M3 24l53 20M9 56 46 9"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
            </h1>
            <p>
              Videos, visuals, slides, and sound.
              <br />
              Everything you need to make your next
              <br className="desktop-break" /> great thing, in one happy place.
            </p>
            <div className="hero-actions">
              <button
                className="button button-orange"
                onClick={() => onNavigate("editor-video")}
              >
                Let’s make something <ArrowUpRight size={19} />
              </button>
              <button
                className="demo-button"
                onClick={() =>
                  document
                    .getElementById("studio")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <span>
                  <Play size={13} fill="currentColor" />
                </span>
                Take a look around
              </button>
            </div>
            <div className="hero-notes">
              <span>
                <Check size={13} /> Free to explore
              </span>
              <span>
                <Check size={13} /> No downloads needed
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-grid" />
            <div className="floating-label label-top">
              <span className="orange-dot" /> A little space. Endless
              possibilities.
            </div>
            <div className="mini-editor">
              <div className="mini-top">
                <Brand compact />
                <span>My next big thing</span>
                <span className="mini-saved">
                  <Check size={11} /> Saved
                </span>
                <span className="mini-export">
                  Export <ArrowUpRight size={11} />
                </span>
              </div>
              <div className="mini-body">
                <div className="mini-tools">
                  {[MousePointer2, Film, Type, Music2, Layers].map(
                    (Icon, i) => (
                      <span key={i} className={i === 1 ? "selected" : ""}>
                        <Icon size={16} />
                      </span>
                    ),
                  )}
                </div>
                <div className="mini-stage">
                  <div className="mini-canvas">
                    <StudioArtwork />
                    <div className="mini-canvas-title">
                      SLOW DAYS.
                      <br />
                      <span>GOOD THINGS.</span>
                    </div>
                  </div>
                  <div className="mini-controls">
                    <span>00:08 / 00:24</span>
                    <Play size={10} fill="currentColor" />
                    <span>16:9</span>
                  </div>
                </div>
                <div className="mini-properties">
                  <span>Make it yours</span>
                  <div />
                  <div />
                  <small>COLOR PALETTE</small>
                  <div className="mini-swatches">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                  <small>OPACITY</small>
                  <div className="mini-slider" />
                </div>
              </div>
              <div className="mini-timeline">
                <div className="mini-time-top">
                  <Scissors size={12} />
                  <Plus size={12} />
                  <span>00:00　　　　 00:08　　　　 00:16</span>
                </div>
                <div className="mini-track">
                  <Film size={12} />
                  {[0, 1, 2, 0].map((v, i) => (
                    <StudioArtwork key={i} variant={v} />
                  ))}
                </div>
                <div className="mini-audio">
                  <Music2 size={11} />
                  <span className="waveform">
                    {Array.from({ length: 70 }, (_, i) => (
                      <i
                        key={i}
                        style={{ height: `${5 + ((i * 17) % 16)}px` }}
                      />
                    ))}
                  </span>
                </div>
                <div className="mini-playhead" />
              </div>
            </div>
            <div className="floating-label label-bottom">
              <Sparkles size={16} /> Less switching. More creating.
            </div>
            <div className="cursor-label">
              <MousePointer2 size={25} fill="#f3c869" />
              <span>You, in your element</span>
            </div>
            <div className="round-sticker">
              MADE FOR
              <br />
              <b>your</b>
              <br />
              NEXT BIG THING
              <svg viewBox="0 0 40 40">
                <path
                  d="M5 20h29m-12-12 12 12-12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </section>
        <section className="possibilities-strip">
          <div className="wrap">
            <span>ONE STUDIO. SO MANY POSSIBILITIES.</span>
            <div>
              {tools.map(({ icon: Icon, name, id }) => (
                <button key={id} onClick={() => onNavigate(`editor-${id}`)}>
                  <Icon size={18} />
                  {name}
                  <span className="strip-star">✳</span>
                </button>
              ))}
            </div>
          </div>
        </section>
        <section id="studio" className="studio-section wrap">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                A FULL TOOLKIT. A FRESH PERSPECTIVE.
              </div>
              <h2>
                Whatever’s in your head.
                <br />
                Make it here<span className="orange-text">.</span>
              </h2>
            </div>
            <p>
              From the first “what if” to the final little detail.
              <br />
              Your creative process, all under one roof.
            </p>
          </div>
          <div
            className="tool-tabs"
            role="tablist"
            aria-label="Explore studio tools"
          >
            {tools.map(({ name, icon: Icon }, i) => (
              <button
                role="tab"
                aria-selected={active === i}
                aria-controls="tool-panel"
                id={`tool-tab-${i}`}
                key={name}
                className={active === i ? "active" : ""}
                onClick={() => setActive(i)}
              >
                <Icon size={18} />
                {name}
              </button>
            ))}
          </div>
          <div
            className={`tool-feature ${tools[active].color}`}
            id="tool-panel"
            role="tabpanel"
            aria-labelledby={`tool-tab-${active}`}
          >
            <div className="tool-feature-copy">
              <span className="tool-number">
                0{active + 1} / THE {tools[active].name.toUpperCase()} STUDIO
              </span>
              <h3>{tools[active].title}</h3>
              <p>{tools[active].description}</p>
              <button
                className="text-button"
                onClick={() => onNavigate(`editor-${tools[active].id}`)}
              >
                Explore {tools[active].name.toLowerCase()}{" "}
                <ArrowUpRight size={17} />
              </button>
            </div>
            <div className="feature-art">
              <StudioArtwork variant={active} />
              <div className="feature-art-caption">
                a fresh
                <br />
                <i>perspective.</i>
              </div>
              <span className="feature-art-tag">
                <MousePointer2 size={15} /> Your next masterpiece
              </span>
            </div>
          </div>
        </section>
        <section className="workflow-section wrap" id="how-it-works">
          <div className="section-heading">
            <div>
              <div className="eyebrow">LESS FRICTION. MORE FLOW.</div>
              <h2>
                From a spark to a<br />
                “look what I made.”
              </h2>
            </div>
            <span className="handwritten">
              It’s your thing. Make it yours. ↴
            </span>
          </div>
          <div className="workflow-grid">
            {[
              {
                n: "01",
                title: "Start with a little something.",
                text: "Bring your own files, pick a template, or let a blank canvas lead the way.",
                icon: Plus,
                color: "peach",
              },
              {
                n: "02",
                title: "Find your creative flow.",
                text: "Cut, arrange, write, and play. Simple tools keep your ideas moving.",
                icon: Scissors,
                color: "lavender",
              },
              {
                n: "03",
                title: "Send it into the world.",
                text: "Save your project and take your artwork wherever your story goes next.",
                icon: ArrowUpRight,
                color: "mint",
              },
            ].map(({ n, title, text, icon: Icon, color }) => (
              <article key={n}>
                <div className={`workflow-icon ${color}`}>
                  <Icon size={30} />
                </div>
                <span className="step-number">{n}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="templates-section" id="templates">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <div className="eyebrow">A HEAD START FOR YOUR NEXT IDEA.</div>
                <h2>Skip the blank canvas.</h2>
              </div>
              <button
                className="text-button"
                onClick={() => onNavigate("templates")}
              >
                Find your starting point <ArrowUpRight size={18} />
              </button>
            </div>
            <div className="template-grid">
              {[
                {
                  title: "The slow edit",
                  type: "Video · 16:9",
                  variant: 0,
                  text: "SLOW DAYS.",
                },
                {
                  title: "A fresh perspective",
                  type: "Social post · 1:1",
                  variant: 1,
                  text: "a fresh\nperspective.",
                },
                {
                  title: "Make room for ideas",
                  type: "Presentation · 16:9",
                  variant: 2,
                  text: "Ideas worth\nsharing.",
                },
              ].map((t, i) => (
                <button
                  className="template-card"
                  key={t.title}
                  onClick={() =>
                    onNavigate(`editor-${["video", "image", "present"][i]}`)
                  }
                >
                  <div className={`template-preview template-${i}`}>
                    <StudioArtwork variant={t.variant} />
                    <strong>{t.text}</strong>
                    <span className="template-arrow">
                      <ArrowUpRight size={20} />
                    </span>
                  </div>
                  <div className="template-meta">
                    <h3>{t.title}</h3>
                    <span>{t.type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
        <section className="final-cta wrap">
          <span className="cta-spark">✳</span>
          <div className="eyebrow">YOUR NEXT GREAT THING STARTS HERE.</div>
          <h2>
            A little studio.
            <br />A whole lot of possibility.
          </h2>
          <button
            className="button button-orange"
            onClick={() => onNavigate("home")}
          >
            Find your creative flow <ArrowUpRight size={20} />
          </button>
          <p>Just you, your ideas, and a place to make them happen.</p>
        </section>
      </main>
      <footer className="landing-footer wrap">
        <Brand
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
        <span>A happy place for big ideas.</span>
        <span>© {new Date().getFullYear()} Repleca Studio</span>
        <a href="#studio">Back to the good stuff ↑</a>
      </footer>
    </div>
  );
}
