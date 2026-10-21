import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StackIcon, Icon } from "../components/Icons";
import "./Home.css";

const rotatingWords = ["stories", "images", "video", "lessons", "ideas"];

const trusted = [
  "OpenAI",
  "Shopify",
  "Notion",
  "Figma",
  "Discord",
  "GitHub",
  "Stripe",
  "Vercel",
  "Anthropic",
  "Canva",
];

const models = [
  { label: "text & stories", color: "#c4b5fd" },
  { label: "image prompts", color: "#4ade80" },
  { label: "video scenes", color: "#fb923c" },
  { label: "lesson plans", color: "#f472b6" },
  { label: "study guides", color: "#60a5fa" },
  { label: "scripts", color: "#fde047" },
  { label: "posters", color: "#fb7185" },
  { label: "storyboards", color: "#34d399" },
  { label: "explanations", color: "#a78bfa" },
  { label: "creative briefs", color: "#2dd4bf" },
];

const stackIcons = [
  "React", "Python", "PostgreSQL", "Node", "Vite", "OpenAI",
  "HTML", "CSS", "JS", "Docker", "Git", "Flask",
];

const safetyItems = [
  {
    icon: "shield",
    title: "Age-friendly defaults",
    text: "Prompts stay clear, kind, and suitable for students and kids.",
  },
  {
    icon: "safety",
    title: "Safe content guidance",
    text: "Built-in wording keeps creations friendly without extra setup.",
  },
  {
    icon: "users",
    title: "Simple for every level",
    text: "No expert skills needed — plain language in, strong prompts out.",
  },
  {
    icon: "save",
    title: "Save & reuse library",
    text: "Keep your best ideas and come back anytime without starting over.",
  },
  {
    icon: "stack",
    title: "Multi-model control",
    text: "Switch text, image, and video flows without learning new tools.",
  },
  {
    icon: "check",
    title: "Clear ownership",
    text: "Your saved prompts stay in your library — ready when you need them.",
  },
];

const useCases = [
  {
    title: "School projects",
    text: "Turn a vague assignment into a clear essay, story, or presentation prompt in seconds.",
  },
  {
    title: "Classroom lessons",
    text: "Teachers can draft lesson intros, worksheets, and activity prompts without writing from scratch.",
  },
  {
    title: "Creative storytelling",
    text: "Shape characters, settings, and plot beats into polished text prompts ready for any AI writer.",
  },
  {
    title: "Visual art briefs",
    text: "Describe a scene once and get image prompts with lighting, mood, composition, and style.",
  },
  {
    title: "Short video ideas",
    text: "Build scene-by-scene video prompts with camera feel, pacing, and age-safe atmosphere.",
  },
  {
    title: "Study helpers",
    text: "Create revision guides, explanations, and practice questions in friendly plain language.",
  },
];

const examples = [
  {
    model: "text",
    idea: "A robot learning to paint with kids",
    prompt:
      "Write a warm short story for students about a friendly robot learning to paint with children. Keep the tone playful, include a clear beginning–middle–end, and end with a kind lesson about creativity.",
  },
  {
    model: "image",
    idea: "Floating night library",
    prompt:
      "Create a cinematic night scene of a magical floating library, soft violet lantern light, books drifting mid-air, whimsical child-safe atmosphere, detailed environment, 16:9 composition.",
  },
  {
    model: "video",
    idea: "Classroom garden time-lapse",
    prompt:
      "Create a short educational video prompt of a classroom garden growing over one week. Include gentle camera moves, sunny pacing, cheerful music cues, and a friendly teacher voiceover.",
  },
];

const quotes = [
  {
    quote:
      "Promptora helped my students stop guessing and start writing clearer AI prompts for projects.",
    name: "Priya M.",
    role: "High school teacher",
  },
  {
    quote:
      "I used to freeze at the blank box. Now I describe my idea once and get something I can actually use.",
    name: "Arjun K.",
    role: "College student",
  },
  {
    quote:
      "The library feature is perfect — I save my best story and image prompts and reuse them every week.",
    name: "Meera S.",
    role: "Content creator",
  },
];

const faqs = [
  {
    q: "What is Promptora?",
    a: "Promptora is a Universal AI Prompt and Multi-Model Content Creation Platform. It helps you turn everyday ideas into clear instructions for text, image, and video AI tools.",
  },
  {
    q: "Do I need prompt engineering skills?",
    a: "No. Write your idea in plain language, choose audience, style, and tone, then generate a polished prompt. The platform is built for beginners and experts alike.",
  },
  {
    q: "What content types can I create?",
    a: "You can generate prompts for stories and essays, image art, video scenes, lesson plans, study guides, posters, scripts, and more — all from one workflow.",
  },
  {
    q: "Can I save prompts for later?",
    a: "Yes. Sign in and save your best prompts to your library so you can copy and reuse them anytime instead of starting from scratch.",
  },
  {
    q: "Is it safe for students and kids?",
    a: "Yes. Promptora is designed to be safe and friendly, with age-appropriate guidance and defaults so people of all ages can create comfortably.",
  },
  {
    q: "How does authentication work?",
    a: "Accounts and cloud libraries are securely synced when you sign in. You can also generate prompts and save them after creating an account.",
  },
];

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setWordIndex((i) => (i + 1) % rotatingWords.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="home">
      {/* Hero — Render split layout */}
      <section className="hero grid-bg">
        <div className="hero-glow" aria-hidden="true" />
        <div className="container-wide hero-grid fade-up">
          <div className="hero-copy">
            <h1>
              Your fastest path to creation for{" "}
              <span className="gradient-text hero-word" key={rotatingWords[wordIndex]}>
                {rotatingWords[wordIndex]}
              </span>
              <span className="hero-cursor" aria-hidden="true" />
            </h1>
            <p className="hero-sub">
              Intuitive prompt tools to turn any idea into clear instructions for
              text, image, and video AI — from your first try to your best work.
            </p>
            <div className="hero-actions">
              <Link to="/generator" className="btn btn-primary">
                Start for free <span aria-hidden="true">›</span>
              </Link>
              <Link to="/features" className="btn btn-ghost">
                See features
              </Link>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="git-chip">$ generate prompt</div>
            <svg className="git-line" viewBox="0 0 80 60" fill="none">
              <path d="M8 8 L8 40 L72 40 L72 52" stroke="#a78bfa" strokeWidth="1.5" />
              <circle cx="72" cy="52" r="3" fill="#a78bfa" />
            </svg>
            <div className="prod-panel">
              <div className="prod-label">STUDIO</div>
              <div className="prod-cards">
                <div className="prod-card">
                  <div className="prod-card-top">
                    <strong>text-story</strong>
                    <span className="status spinning">Generating</span>
                  </div>
                  <Sparkline />
                  <div className="prod-meta">Clarity · Tone · Structure</div>
                </div>
                <div className="prod-card">
                  <div className="prod-card-top">
                    <strong>image-art</strong>
                    <span className="status ok">Ready</span>
                  </div>
                  <Sparkline delay />
                  <div className="prod-meta">Light · Mood · Style</div>
                </div>
                <div className="prod-card">
                  <div className="prod-card-top">
                    <strong>video-scene</strong>
                    <span className="status ok">Ready</span>
                  </div>
                  <Sparkline />
                  <div className="prod-meta">Camera · Pace · Shot</div>
                </div>
                <div className="prod-card">
                  <div className="prod-card-top">
                    <strong>library</strong>
                    <span className="status ok">Synced</span>
                  </div>
                  <Sparkline delay />
                  <div className="prod-meta">Saved · Reusable</div>
                </div>
              </div>
            </div>
            <div className="pixel-badge" />
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="trusted">
        <div className="container-wide">
          <p className="trusted-label">Trusted by creators of every age</p>
          <div className="trusted-grid">
            {trusted.map((name) => (
              <span key={name} className="trusted-logo">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Click, click, done */}
      <section className="section steps-section" id="how">
        <div className="container-wide">
          <h2 className="section-title steps-title">Click, click, done.</h2>
          <div className="steps-grid">
            <article className="step-col">
              <span className="step-badge">1</span>
              <h3>Select a model</h3>
              <p>Choose what you need — story, image, or video prompt.</p>
              <div className="mock mock-list">
                <div className="mock-head">+ New prompt</div>
                <div className="mock-row">Text / Story</div>
                <div className="mock-row active">Image</div>
                <div className="mock-row">Video</div>
                <div className="mock-row">Lesson</div>
              </div>
            </article>
            <article className="step-col">
              <span className="step-badge">2</span>
              <h3>Describe your idea</h3>
              <p>Write in plain language. Add audience, style, and tone.</p>
              <div className="mock mock-form">
                <label>Audience</label>
                <div className="mock-field">students</div>
                <label>Style</label>
                <div className="mock-field">detailed</div>
                <label>Tone</label>
                <div className="mock-field">friendly</div>
              </div>
            </article>
            <article className="step-col">
              <span className="step-badge">3</span>
              <h3>Promptora does the rest</h3>
              <p>Get a polished prompt — copy it or save it to your library.</p>
              <div className="mock mock-done">
                <div className="mock-term">
                  ~/idea <span>$ generate</span>
                </div>
                <div className="mock-success">
                  <span className="check">✓</span>
                  Prompt ready: Floating library scene
                  <em>Just now</em>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Stack band */}
      <section className="stack-band">
        <div className="container-wide stack-inner">
          <div className="stack-copy">
            <h2>Whatever you want to create, it starts on Promptora.</h2>
            <Link to="/generator" className="btn btn-primary">
              Open generator <span aria-hidden="true">›</span>
            </Link>
          </div>
          <div className="stack-grid">
              {stackIcons.map((s) => (
              <div key={s} className="stack-cell">
                <StackIcon name={s} size={40} />
                <small>{s}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-model + preview */}
      <section className="section deploy-section">
        <div className="container-wide">
          <h2 className="section-title">
            Create stories, art, and video with{" "}
            <span className="gradient-text">zero guesswork</span>
          </h2>
          <div className="deploy-grid">
            <div>
              <p className="deploy-lead">
                Intuitive prompting and multi-model flows for…
              </p>
              <ul className="color-list">
                {models.map((m) => (
                  <li key={m.label} style={{ color: m.color }}>
                    {m.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="preview-block">
              <h3>Full prompt preview for every idea</h3>
              <p>
                See your generated instruction update live as you type — then
                copy or save it.
              </p>
              <Link to="/generator" className="btn-link">
                Generator docs →
              </Link>
              <div className="pr-mock">
                <div className="pr-card">
                  <strong>IDEA #42</strong>
                  <span>night library scene</span>
                  <em className="ok-line">✓ Prompt ready</em>
                </div>
                <div className="pr-arrow">→</div>
                <div className="pr-env">
                  <div className="pr-env-title">preview-prompt</div>
                  {["text", "image", "tone", "safety"].map((s) => (
                    <div key={s} className="pr-row">
                      <span>{s}</span>
                      <span className="ok-line">● Available</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Graph feature */}
      <section className="section scale-section grid-bg">
        <div className="container-wide scale-grid">
          <div>
            <h2 className="section-title">
              Prompt quality that scales from first draft to polished output
            </h2>
            <p className="section-lead">
              Keep every idea clear through class projects, creative bursts, and
              big presentations.
            </p>
            <Link to="/library" className="btn-link">
              Library docs →
            </Link>
          </div>
          <div className="scale-chart">
            <div className="chart-tooltip">
              <span>PROMPT PLAN:</span>
              <strong>Multi-model</strong>
              <strong>Library sync</strong>
            </div>
            <svg viewBox="0 0 400 180" className="chart-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
              {[40, 80, 120, 160].map((y) => (
                <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(167,139,250,0.12)" />
              ))}
              <path
                d="M0 150 L40 140 L80 145 L120 110 L160 120 L200 70 L240 85 L280 40 L320 55 L360 25 L400 35"
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="section audience-section" id="audience">
        <div className="container-wide">
          <h2 className="section-title">Built for every builder of ideas</h2>
          <p className="section-lead">
            Students, teachers, curious kids — and anyone with an imagination.
          </p>
          <div className="audience-grid">
            {[
              [
                "Students",
                "Better prompts for homework, essays, science projects, and creative assignments.",
              ],
              [
                "Teachers",
                "Lesson plans, worksheets, and classroom content prompts drafted in minutes.",
              ],
              [
                "Curious kids",
                "A safe, friendly space to turn play and imagination into AI instructions.",
              ],
              [
                "Creators & everyone",
                "No expertise required — simple enough for any skill level or background.",
              ],
            ].map(([title, text]) => (
              <article key={title} className="audience-card">
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="section usecases-section" id="usecases">
        <div className="container-wide">
          <p className="eyebrow">Real-world uses</p>
          <h2 className="section-title">What you can create today</h2>
          <p className="section-lead">
            From classroom work to creative projects — Promptora covers the prompts people need most.
          </p>
          <div className="usecase-grid">
            {useCases.map((item) => (
              <article key={item.title} className="usecase-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Example prompts */}
      <section className="section examples-section grid-bg">
        <div className="container-wide">
          <p className="eyebrow">Prompt examples</p>
          <h2 className="section-title">See the difference a clear prompt makes</h2>
          <p className="section-lead">
            Start with a short idea. Promptora expands it into a model-ready instruction.
          </p>
          <div className="examples-grid">
            {examples.map((item) => (
              <article key={item.model} className="example-card">
                <span className="example-badge">{item.model}</span>
                <h3>Idea</h3>
                <p className="example-idea">{item.idea}</p>
                <h3>Generated prompt</h3>
                <p className="example-prompt">{item.prompt}</p>
              </article>
            ))}
          </div>
          <div className="examples-cta">
            <Link to="/generator" className="btn btn-primary">
              Try with your own idea <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quotes */}
      <section className="section quotes-section">
        <div className="container-wide">
          <p className="eyebrow">What creators say</p>
          <h2 className="section-title">Built for real classrooms and creators</h2>
          <div className="quotes-grid">
            {quotes.map((item) => (
              <blockquote key={item.name} className="quote-card">
                <p>“{item.quote}”</p>
                <footer>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="section safety-section grid-bg" id="safety">
        <div className="container-wide">
          <h2 className="section-title">Stay safe and friendly by default</h2>
          <p className="safety-sub">Build imagination, not worry.</p>
          <div className="safety-grid">
            {safetyItems.map((item) => (
              <article key={item.title} className="safety-item">
                <div className="safety-icon-wrap">
                  <Icon name={item.icon} size={20} color="#a78bfa" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <div className="safety-actions">
            <Link to="/about" className="btn btn-primary">
              About Promptora <span aria-hidden="true">›</span>
            </Link>
            <Link to="/features" className="btn btn-ghost">
              All features <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq-section" id="faq">
        <div className="container-wide">
          <p className="eyebrow">FAQ</p>
          <h2 className="section-title">Questions, answered</h2>
          <p className="section-lead">
            Quick answers about Promptora, multi-model prompts, safety, and saving ideas.
          </p>
          <div className="faq-grid">
            {faqs.map((item) => (
              <article key={item.q} className="faq-card">
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="container-wide">
          <h2 className="section-title">Start building with Promptora</h2>
          <p>
            Turn imagination into clear AI instructions for stories, pictures, and video —
            then save your best work for next time.
          </p>
          <div className="final-cta-actions">
            <Link to="/generator" className="btn btn-primary">
              Start for free <span aria-hidden="true">›</span>
            </Link>
            <Link to="/auth" className="btn btn-ghost">
              Create account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Sparkline({ delay }) {
  return (
    <svg className={`spark ${delay ? "spark-delay" : ""}`} viewBox="0 0 120 28" preserveAspectRatio="none">
      <path
        d="M0 22 L15 18 L30 20 L45 10 L60 14 L75 6 L90 12 L105 4 L120 8"
        fill="none"
        stroke="#a78bfa"
        strokeWidth="2"
      />
    </svg>
  );
}
