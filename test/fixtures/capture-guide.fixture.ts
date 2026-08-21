import { captureGuideSchema } from 'sky-filme-studio-be/contracts';
import type { CaptureGuide } from 'sky-filme-studio-be/contracts';

export const buildCaptureGuide = (
  overrides: Partial<CaptureGuide> = {},
): CaptureGuide =>
  captureGuideSchema.parse({
    bypassable: true,
    views: [
      {
        id: 'FRONT',
        label: 'Front',
        why: 'Establishes the silhouette the other views are read against.',
        optional: true,
      },
      {
        id: 'TURNTABLE_CLIP',
        label: 'Short 360-degree clip',
        why: 'Continuous parallax describes geometry that stills leave ambiguous.',
        optional: true,
      },
    ],
    recommendations: [
      { id: 'DIFFUSE_LIGHTING', advice: 'Diffuse, even lighting.' },
    ],
    ...overrides,
  });
