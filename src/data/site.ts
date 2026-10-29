/**
 * Store-wide settings and media. Set an image/video path to swap
 * the placeholder for the real asset (files live in /public).
 */
export const site = {
  name: 'Haluna',
  tagline: 'Sun care that feels like nothing.',
  /** Hero photo, e.g. '/images/hero.webp'. Undefined shows the bottle trio placeholder. */
  heroImage: undefined as string | undefined,
  ugc: {
    /** Vertical 9:16 video. */
    video: '/videos/haluna-ugc.mp4',
    /** Poster frame, e.g. '/images/ugc-poster.webp'. Undefined shows a gradient poster. */
    poster: undefined as string | undefined,
  },
}
