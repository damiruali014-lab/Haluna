/**
 * Geometry for the hero pour. The stage is 600 × 760 user units. The tube "rig" is a crop of the real
 * product photo (product-sunscreen.webp, 1200 × 1200 px) shown at half scale.
 */
export const STAGE = { w: 600, h: 760, floorY: 636 }

/** Silhouette of the tube in the photo's pixel coordinates, traced from edge detection. */
export const TUBE_CLIP =
  'M421 176L773 176L774 206L769 226L761 266L755 306L749 356L744 406L739 456L735 506L731 556L727 606L723 656L720 706L717 756L714 806L711 836L707 856L708 862L708 996Q708 1013 691 1013L501 1013Q482 1013 482 996L482 862L484 856L480 836L478 806L476 776L474 736L472 706L470 676L468 646L466 616L464 586L461 546L459 516L457 486L454 456L451 426L449 396L446 366L443 336L439 306L435 276L430 246L426 226L421 206Z'

/** Photo-pixel landmarks: where the tube meets the cap, and the flip-lid seam. */
export const PHOTO = { capTop: 858, seam: 955.5, capBottom: 1014, capLeft: 482, capRight: 708, nozzleTip: 982, cx: 595 }

/** The rig shows this crop of the photo, at RIG.scale, positioned at RIG.x/y in the stage. */
export const RIG = { crop: { x: 400, y: 160, w: 400, h: 880 }, scale: 0.5, x: 201.5, y: 60, lift: -12 }

/** Where cream leaves the nozzle once the rig has lifted (stage units). */
export const NOZZLE = {
  x: RIG.x + (PHOTO.cx - RIG.crop.x) * RIG.scale,
  y: RIG.y + RIG.lift + (PHOTO.nozzleTip - RIG.crop.y) * RIG.scale,
}

export const PILL = { w: 268, h: 62 }
export const CREAM_RADIUS = 17

export interface PourState {
  lift: number // 0..1
  lid: number // 0 closed .. 1 fully open
  squeeze: number // 1 = relaxed
  sim: number // 0..1 through the baked pour
  pill: number // 0..1 dollop → button
}

export const initialState = (): PourState => ({ lift: 0, lid: 0, squeeze: 1, sim: 0, pill: 0 })
export const finalState = (): PourState => ({ lift: 1, lid: 0, squeeze: 1, sim: 1, pill: 1 })
