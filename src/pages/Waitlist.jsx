import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCheck } from "react-icons/fa6";
import { ROUTES } from "../routes";

const fieldClass =
  "mt-2 block w-full rounded-xl border border-[var(--jpg-border)] bg-black px-4 py-3.5 text-base text-[var(--jpg-cream)] placeholder:text-[var(--jpg-cream)]/35 disabled:cursor-not-allowed disabled:opacity-50";

export default function WaitlistPage() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to join the waitlist.");
      }

      form.reset();
      setStatus("success");
      setMessage(
        "We’ll email you when VibeGig is ready and share occasional progress updates.",
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to join the waitlist. Please try again.",
      );
    }
  };

  return (
    <section
      className="relative overflow-hidden pb-28 pt-32 sm:pb-36 sm:pt-40"
      style={{ backgroundColor: "var(--jpg-black)", color: "var(--jpg-cream)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 12% 12%, rgba(249,29,29,0.1), transparent 70%), radial-gradient(ellipse 45% 35% at 88% 82%, rgba(255,106,0,0.08), transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-16">
        <div className="self-center">
          <p className="mb-5 font-label uppercase tracking-[0.18em] text-[var(--jpg-orange)]">
            Coming soon for artists
          </p>
          <h1 className="text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
            Meet
            <br />
            <span style={{ color: "var(--jpg-muted)" }}>VibeGig.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8" style={{ opacity: 0.82 }}>
            We’re building a platform for artists to connect with opportunities,
            collaborators and the creative community around them.
          </p>
          <p className="mt-4 max-w-xl text-base leading-7" style={{ opacity: 0.65 }}>
            Join the artist waitlist to hear when VibeGig is ready and get
            updates as we build.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={ROUTES.live}
              className="inline-flex items-center gap-3 rounded-full bg-[image:var(--jpg-gradient)] px-6 py-3.5 font-button text-sm text-[var(--jpg-black)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
            >
              Explore the community <FaArrowRight aria-hidden="true" />
            </Link>
            <Link
              to={ROUTES.services}
              className="inline-flex items-center gap-3 rounded-full border border-[var(--jpg-border)] px-6 py-3.5 font-button text-sm transition-colors hover:border-[var(--jpg-cream)]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
            >
              Explore our services <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <p className="mt-5 text-sm text-[var(--jpg-muted)]">
            Have a question?{" "}
            <Link
              to={ROUTES.contact}
              className="underline decoration-[var(--jpg-orange)] underline-offset-4 transition-colors hover:text-[var(--jpg-cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
            >
              Talk to us
            </Link>
            .
          </p>
        </div>

        <div
          className="rounded-3xl border bg-[var(--jpg-surface)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)] sm:p-9"
          style={{ borderColor: "var(--jpg-border)" }}
        >
          {status === "success" ? (
            <div role="status" aria-live="polite">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--jpg-orange)]/15 text-xl text-[var(--jpg-orange)]">
                <FaCheck aria-hidden="true" />
              </span>
              <p className="mt-7 font-label text-xs uppercase tracking-[0.18em] text-[var(--jpg-orange)]">
                You’re on the list
              </p>
              <h2 className="mt-3 text-3xl font-medium leading-tight sm:text-4xl">
                Thanks for joining the waitlist.
              </h2>
              <p className="mt-4 text-sm leading-6" style={{ opacity: 0.72 }}>
                {message}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={ROUTES.live}
                  className="inline-flex items-center gap-3 rounded-full bg-[image:var(--jpg-gradient)] px-6 py-3.5 font-button text-sm text-[var(--jpg-black)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
                >
                  Explore the community <FaArrowRight aria-hidden="true" />
                </Link>
                <Link
                  to={ROUTES.home}
                  className="inline-flex items-center gap-3 rounded-full border border-[var(--jpg-border)] px-6 py-3.5 font-button text-sm transition-colors hover:border-[var(--jpg-cream)]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
                >
                  Back to home
                </Link>
              </div>
              <p className="mt-6 text-sm text-[var(--jpg-muted)]">
                Need anything else?{" "}
                <Link
                  to={ROUTES.contact}
                  className="underline decoration-[var(--jpg-orange)] underline-offset-4 transition-colors hover:text-[var(--jpg-cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
                >
                  Contact us
                </Link>
                .
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-medium sm:text-3xl">
                Artist waitlist
              </h2>
              <p className="mt-3 text-sm leading-6" style={{ opacity: 0.7 }}>
                Tell us a little about your creative practice. We’ll let you know
                when VibeGig is ready.
              </p>

              <form
                className="mt-7 space-y-5"
                aria-describedby="waitlist-status"
                onSubmit={handleSubmit}
              >
                <fieldset
                  disabled={status === "sending"}
                  className="space-y-5"
                >
                  <legend className="sr-only">VibeGig artist waitlist details</legend>
                  <label className="block text-sm" htmlFor="waitlist-name">
                    Name
                    <input
                      id="waitlist-name"
                      name="name"
                      autoComplete="name"
                      className={fieldClass}
                      placeholder="Your name"
                      minLength={2}
                      maxLength={120}
                      required
                    />
                  </label>

                  <label className="block text-sm" htmlFor="waitlist-email">
                    Email address
                    <input
                      id="waitlist-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={fieldClass}
                      placeholder="you@example.com"
                      maxLength={254}
                      required
                    />
                  </label>

                  <label className="block text-sm" htmlFor="waitlist-discipline">
                    Creative discipline
                    <select
                      id="waitlist-discipline"
                      name="discipline"
                      className={`${fieldClass} [color-scheme:dark]`}
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Choose your discipline
                      </option>
                      <option value="visual-arts">Visual arts</option>
                      <option value="photography">Photography</option>
                      <option value="film">Film and video</option>
                      <option value="design">Design</option>
                      <option value="other">Other</option>
                    </select>
                  </label>

                  <label className="block text-sm" htmlFor="waitlist-portfolio">
                    Portfolio or social link{" "}
                    <span className="opacity-60">(optional)</span>
                    <input
                      id="waitlist-portfolio"
                      name="portfolio"
                      type="url"
                      className={fieldClass}
                      placeholder="https://"
                      maxLength={2048}
                    />
                  </label>

                  <div
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
                  >
                    <label htmlFor="waitlist-website">Website</label>
                    <input
                      id="waitlist-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full rounded-full bg-[image:var(--jpg-gradient)] px-6 py-4 font-button text-sm text-[var(--jpg-black)] transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === "sending" ? "Joining…" : "Join the waitlist"}
                  </button>
                </fieldset>
              </form>

              <p
                id="waitlist-status"
                role={status === "error" ? "alert" : "status"}
                className="mt-4 text-sm leading-6"
                style={{
                  color:
                    status === "error" ? "var(--jpg-red)" : "var(--jpg-muted)",
                }}
              >
                {message ||
                  "Your details are only used to contact you about VibeGig."}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
