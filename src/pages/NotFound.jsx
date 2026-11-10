import { Link } from "react-router-dom";
import { ROUTES } from "../routes";

export default function NotFound() {
  return (
    <section
      className="relative min-h-[60vh] overflow-hidden px-6 pb-24 pt-40 text-center sm:px-10"
      style={{ backgroundColor: "var(--jpg-black)", color: "var(--jpg-cream)" }}
    >
      <h1 className="text-4xl sm:text-5xl">Page not found</h1>
      <Link
        to={ROUTES.home}
        className="font-button mt-8 inline-flex rounded-full border border-[var(--jpg-border)] px-6 py-3.5 text-[var(--jpg-cream)]"
      >
        Back to home
      </Link>
    </section>
  );
}
