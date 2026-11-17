import tokens from "../../data/design-tokens.json";

/** Token 3D dan durasi motion langsung dari data/design-tokens.json, tanpa menulis ulang nilai. */
export const flower3dTokens = tokens.color.flower3d;
export const flowerMotionTokens = {
  cameraFlyMs: tokens.motion.cameraFly,
  fastMs: tokens.motion.fast,
  baseMs: tokens.motion.base,
} as const;
