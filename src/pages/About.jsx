import { Link } from "react-router-dom";
import "./About.css";

const missionPoints = [
  {
    title: "Simple for everyone",
    text: "No expert skills needed. Students, teachers, curious kids, and first-time creators can all use Promptora comfortably.",
  },
  {
    title: "Multi-model by design",
    text: "Stories, pictures, and video are first-class. One platform helps you create instructions for many kinds of AI content.",
  },
  {
    title: "Safe and friendly",
    text: "Defaults and guidance stay age-appropriate so people of all ages can create without worry.",
  },
  {
    title: "Ideas that last",
    text: "Save your best prompts and return to them later instead of starting from scratch every time.",
  },
];

const timeline = [
  {
    step: "01",
    title: "Idea",
    text: "You describe what you want in plain language — a story, image, lesson, or video scene.",
  },
  {
    step: "02",
    title: "Prompt",
    text: "Promptora shapes your idea into clear, structured instructions an AI can understand.",
  },
  {
    step: "03",
    title: "Create",
    text: "Copy the prompt into your favorite AI tool and turn imagination into something real.",
  },
  {
    step: "04",
    title: "Reuse",
    text: "Save the result to your library so your best ideas stay ready for next time.",
  },
];

export default function About() {
  return (
    <main className="about page-shell">
      <div className="container">
        <header className="page-header fade-up">
          <p className="eyebrow">About Promptora</p>
          <h1 className="section-title">Imagination, made understandable</h1>
          <p className="section-lead">
            The Universal AI Prompt and Multi-Model Content Creation Platform —
            built to help anyone turn ideas into clear AI instructions.
          </p>
        </header>

        <article className="about-panel fade-up">
          <p>
            The <strong>Universal AI Prompt and Multi-Model Content Creation Platform</strong> is
            like a magic helper that turns your ideas into instructions a computer can understand.
            It is called a Prompt Generator because its main job is to help you tell an AI exactly
            what you want to make — whether that is a story, a picture, or even a video.
          </p>
          <p>
            That is what makes it <strong>multi-model</strong>: it is not limited to just one type
            of content. The best part is that it is built for everyone — students, teachers,
            curious kids, or anyone with an idea, no matter their skill level or background.
          </p>
          <p>
            You do not need to be an expert to use it, because it is designed to be simple and
            easy. It also saves your best ideas, so you can come back and use them again later
            instead of starting from scratch each time. On top of that, it is made to be safe and
            friendly, so people of all ages can use it comfortably and without worry.
          </p>
          <p className="about-closing">
            In short, the whole point of this platform is simple: it helps turn your imagination
            into something real.
          </p>
        </article>

        <section className="about-mission fade-up">
          <h2 className="section-title">What we stand for</h2>
          <div className="mission-grid">
            {missionPoints.map((item) => (
              <article key={item.title} className="mission-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-timeline fade-up">
          <h2 className="section-title">From idea to creation</h2>
          <p className="section-lead">
            A short, friendly path designed for classrooms, creative work, and everyday curiosity.
          </p>
          <div className="timeline-grid">
            {timeline.map((item) => (
              <article key={item.step} className="timeline-card">
                <span>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-stack fade-up">
          <h2 className="section-title">Built with modern tools</h2>
          <p>
            Promptora’s frontend is built with <strong>React, HTML, CSS, and JavaScript</strong>.
            Authentication and cloud prompt storage are powered by a secure Postgres database
            with row-level privacy. The platform is also designed to grow with a Python backend when needed.
          </p>
          <div className="about-actions">
            <Link to="/auth" className="btn btn-primary">
              Create account
            </Link>
            <Link to="/generator" className="btn btn-ghost">
              Start creating
            </Link>
            <Link to="/features" className="btn btn-ghost">
              View features
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
