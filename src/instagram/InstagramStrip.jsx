import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import LiveLight from "../components/LiveLight";
import { useInstagram } from "./InstagramContext";
import InstagramTile, { TileSkeleton } from "./InstagramTile";
import { ACCOUNTS } from "./data";
import { SOURCE_META } from "./sources";

/**
 * start=0 on Home, start=4 on Services, start=8 on Team.
 * Same fetch, different posts on every page.
 */
export default function InstagramStrip({
  start = 0,
  count = 4,
  heading = "Fresh from the feed",
}) {
  const { posts, status, openLightbox } = useInstagram();

  const slice = posts.slice(start, start + count);

  // A broken connection shouldn't leave a hole in the page
  if (status === "error") return null;
  if (status === "ready" && slice.length === 0) return null;

  return (
    <section
      className="relative py-20 sm:py-28"
      style={{ backgroundColor: "var(--jpg-black)", color: "var(--jpg-cream)" }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 flex items-center gap-3 font-label">
              <LiveLight />
              Live from Instagram
            </p>
            <h2 className="text-3xl leading-tight sm:text-4xl md:text-5xl">
              {heading}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {Object.entries(ACCOUNTS).map(([key, acc]) => {
              const { Icon } = SOURCE_META[key];
              return (
                <a
                  key={key}
                  href={acc.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-body text-base normal-case tracking-normal transition-colors duration-300 hover:text-[var(--jpg-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
                  style={{ color: "var(--jpg-cream)" }}
                >
                  <Icon aria-hidden="true" />@{acc.username}
                </a>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {status === "loading"
            ? Array.from({ length: count }, (_, i) => <TileSkeleton key={i} />)
            : slice.map((post, i) => (
              <InstagramTile
                key={post.id}
                post={post}
                index={i}
                postIndex={posts.indexOf(post)}
                onOpen={openLightbox}
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
            ))}
        </div>

        <div className="mt-10">
          <Link
            to="/art-feed"
            className="font-button inline-flex items-center gap-3 rounded-full bg-[image:var(--jpg-gradient)] px-7 py-4 text-[var(--jpg-black)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jpg-cream)]"
          >
            See more on art feed
            <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}