import { ROUTES } from "./routes";

export const SITE_URL = import.meta.env.VITE_SITE_URL ?? window.location.origin;
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

export const PAGE_SEO = {
  [ROUTES.home]: {
    title: "thevibe. | Where creatives converge.",
    description:
      "A curated home for African and diaspora artists to share timeless work and find each other.",
  },
  [ROUTES.about]: {
    title: "About | thevibe.",
    description:
      "thevibe. is a community of and for artists from Africa and the diaspora, promoting creative talent for social development and cultural exchange.",
  },
  [ROUTES.services]: {
    title: "Bespoke Services for Artists & Brands | thevibe.",
    description:
      "Bespoke services for artists and brands: creative direction and campaign production, fine art curation, commercial photography, artist branding and portfolio management.",
  },
  [ROUTES.team]: {
    title: "Meet the Curators & Visionaries | thevibe.",
    description:
      "Meet the curators, photographers and visionaries behind thevibe., a home for African and diaspora artists.",
  },
  [ROUTES.live]: {
    title: "Live from the Vibe | thevibe.",
    description:
      "Fresh from our community of black artists worldwide. The latest posts from thevibe. on Instagram and X.",
  },
  [ROUTES.contact]: {
    title: "Get in Touch | thevibe.",
    description:
      "Get in touch with thevibe. about exhibitions, collaborations, photography and artist services.",
  },
  [ROUTES.waitlist]: {
    title: "VibeGig Artist Waitlist | thevibe.",
    description:
      "VibeGig is a platform in development for artists to connect, find opportunities and grow their creative practice. Join the artist waitlist.",
  },
};
