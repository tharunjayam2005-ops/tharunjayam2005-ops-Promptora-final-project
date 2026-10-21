import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FeatureIcon, StackIcon } from "../components/Icons";
import { USAGE_EVENTS, trackUsage } from "../services/usageStore";
import "./Features.css";

const features = [
  {
    icon: "generator",
    title: "Universal prompt generator",
    text: "Turn everyday ideas into precise instructions any AI model can follow — no prompt engineering degree required.",
  },
  {
    icon: "multimodel",
    title: "Multi-model by design",
    text: "Create for text, images, and video from one place. Switch content types without learning a new workflow.",
  },
  {
    icon: "beginner",
    title: "Made for every skill level",
    text: "Students, teachers, curious kids, and first-time creators get a simple path from idea to prompt.",
  },
  {
    icon: "library",
    title: "Save your best ideas",
    text: "Keep polished prompts in your library and reuse them later instead of rebuilding from scratch.",
  },
  {
    icon: "safe",
    title: "Safe & friendly",
    text: "Guidance and defaults stay age-appropriate so people of all ages can create with confidence.",
  },
  {
    icon: "stack",
    title: "Ready for a full stack",
    text: "Frontend in React with secure auth, Postgres storage, and a path to Python services.",
  },
];

const workflows = [
  {
    title: "Text & stories",
    points: [
      "Essays, scripts, and short stories",
      "Clear openings and useful structure",
      "Tone controls: friendly, playful, academic",
    ],
  },
  {
    title: "Image prompts",
    points: [
      "Subject, setting, lighting, and mood",
      "Composition and style guidance",
      "Child-safe creative art briefs",
    ],
  },
  {
    title: "Video scenes",
    points: [
      "Scene flow and pacing",
      "Camera feel and visual mood",
      "Storyboard-ready descriptions",
    ],
  },
];

const benefits = [
  {
    title: "Faster than blank-box prompting",
    text: "Stop rewriting the same request. Describe once, generate, and refine with audience and style controls.",
  },
  {
    title: "Consistent quality",
    text: "Every prompt includes structure, tone, and safety guidance so results stay clearer across tools.",
  },
  {
    title: "Reusable library",
    text: "Save winning prompts for homework, lessons, or weekly creative work and copy them anytime.",
  },
  {
    title: "One place for every model",
    text: "Switch between text, image, and video without juggling different apps or prompt formats.",
  },
];

const techStack = [
  { name: "React", icon: "React" },
  { name: "Python", icon: "Python" },
  { name: "PostgreSQL", icon: "PostgreSQL" },
  { name: "Vite", icon: "Vite" },
  { name: "HTML", icon: "HTML" },
  { name: "CSS", icon: "CSS" },
  { name: "JavaScript", icon: "JS" },
  { name: "Flask", icon: "Flask" },
];

export default function Features() {
  useEffect(() => {
    trackUsage(USAGE_EVENTS.FEATURES_VIEW, { path: "/features" });
  }, []);

  return (
    <main className="features page-shell">
      <div className="container">
        <header className="page-header fade-up">
          <p className="eyebrow">Platform capabilities</p>
          <h1 className="section-title">Intuitive tools for creators</h1>
          <p className="section-lead">
            Everything you need to shape imagination into model-ready instructions —
            for stories, pictures, video, and learning content.
          </p>
        </header>

        <div className="features-grid fade-up">
          {features.map((f) => (
            <article key={f.title} className="feature-card">
              <FeatureIcon type={f.icon} size={40} />
              <h2>{f.title}</h2>
              <p>{f.text}</p>
            </article>
          ))}
        </div>

        <section className="feature-block fade-up">
          <p className="eyebrow">Multi-model workflows</p>
          <h2 className="section-title">One generator. Three creation paths.</h2>
          <p className="section-lead">
            Choose a content type and Promptora shapes the right kind of instruction automatically.
          </p>
          <div className="workflow-grid">
            {workflows.map((item) => (
              <article key={item.title} className="workflow-card">
                <h3>{item.title}</h3>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="feature-block fade-up">
          <p className="eyebrow">Why Promptora</p>
          <h2 className="section-title">Built to remove prompt friction</h2>
          <div className="benefit-grid">
            {benefits.map((item) => (
              <article key={item.title} className="benefit-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="tech-strip fade-up">
          <h2>Tools &amp; technologies</h2>
          <p className="tech-lead">
            Frontend in React with HTML, CSS, and JavaScript. Backend-ready with Python and
            PostgreSQL for authentication and prompt storage.
          </p>
          <div className="tech-icons-grid">
            {techStack.map((t) => (
              <div key={t.name} className="tech-icon-cell">
                <StackIcon name={t.icon} size={40} />
                <span>{t.name}</span>
              </div>
            ))}
          </div>
          <div className="features-cta-row">
            <Link to="/generator" className="btn btn-primary">
              Try the generator
            </Link>
            <Link to="/overview" className="btn btn-ghost">
              View usage overview
            </Link>
            <Link to="/ai-chat" className="btn btn-ghost">
              Open AI Chat
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
