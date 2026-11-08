// Configuration for the geometric continuous 'S' emblem and lighting physics
export interface GlyphGeometry {
  path: string;
  viewBox: [number, number, number, number];
  viewBoxStr: string;
  center: { x: number; y: number };
  radius: number;
  outline: number[];
  tightViewBox: string;
}

export const GLYPH_DATA: GlyphGeometry = {
  path: "M 195.8 105.9 L 507.8 105.9 L 435.7 203.7 L 291.0 203.7 L 445.7 367.3 L 374.2 464.1 L 62.2 464.1 L 134.3 366.3 L 279.0 366.3 L 124.3 202.7 Z",
  viewBox: [0, 0, 570, 570],
  viewBoxStr: "0 0 570 570",
  center: { x: 285, y: 285 },
  radius: 166,
  outline: [
    82.9, 90.7, 101.0, 114.9, 134.5, 163.6, 179.3, 178.2, 178.5, 180.2, 183.3, 187.9,
    194.3, 197.6, 190.6, 185.4, 181.9, 179.8, 179.1, 179.8, 181.9, 185.4, 190.6, 197.6,
    206.8, 218.6, 233.8, 253.3, 278.6, 229.0, 182.5, 63.5, 65.6, 68.5, 72.1, 76.8,
    82.9, 90.7, 101.0, 114.9, 134.5, 163.6, 179.3, 178.2, 178.5, 180.2, 183.3, 187.9,
    194.3, 197.6, 190.6, 185.4, 181.9, 179.8, 179.1, 179.8, 181.9, 185.4, 190.6, 197.6,
    206.8, 218.6, 233.8, 253.3, 278.6, 229.0, 182.5, 63.5, 65.6, 68.5, 72.1, 76.8,
  ],
  tightViewBox: "55 100 460 370",
};

export const LIGHT_CONFIG = {
  size: 0.92,
  orbitSpeed: 0.65,
  attractRadius: 2.3,
  followSpeed: 7.5,
  blendSpeed: 5.5,
  swell: 0.2,
  stops: [
    [0, "#ffffff"],
    [0.12, "rgba(215, 175, 255, 0.98)"],
    [0.28, "rgba(168, 65, 255, 0.8)"],
    [0.55, "rgba(128, 1, 255, 0.35)"],
    [1, "rgba(128, 1, 255, 0)"],
  ] as [number, string][],
};

export const GLYPH_SHEETS = [
  {
    key: "under",
    className: "glyph__glow glyph__glow--under",
    bands: ["/mark/spill.svg", "/mark/bloom.svg"],
  },
  {
    key: "over",
    className: "glyph__glow glyph__glow--over",
    bands: ["/mark/edge.svg"],
  },
];
