import { createProductionProfileRequestSchema } from 'sky-filme-studio-be/contracts';
import {
  EMPTY_PRODUCTION_PROFILE_VALUES,
  productionProfileCandidateFrom,
} from '@/features/productions/helpers/production-profile-candidate';

const typed = {
  ...EMPTY_PRODUCTION_PROFILE_VALUES,
  name: ' Twenty-minute episode ',
  minutes: '20',
  seconds: '0',
  tolerance: '30',
  fps: '24',
  width: '1920',
  height: '1080',
  aspectRatio: '16:9',
  sampleRateHz: '48000',
  audioChannels: '2',
};

describe('productionProfileCandidateFrom', () => {
  it('composes what the contract accepts from what was typed, trimmed', () => {
    const result = createProductionProfileRequestSchema.safeParse(
      productionProfileCandidateFrom(typed),
    );

    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      name: 'Twenty-minute episode',
      targetRuntimeSeconds: 1_200,
      toleranceSeconds: 30,
      fps: 24,
      width: 1_920,
      height: 1_080,
      aspectRatio: '16:9',
      sampleRateHz: 48_000,
      audioChannels: 2,
      sections: [],
    });
    expect(result.data).not.toHaveProperty('description');
  });

  it('numbers sections in the order they were added and keeps their reusable flag', () => {
    const candidate = productionProfileCandidateFrom({
      ...typed,
      sections: [
        {
          label: 'Cold open',
          startSeconds: '0',
          endSeconds: '90',
          reusable: false,
        },
        {
          label: 'Titles',
          startSeconds: '90',
          endSeconds: '120',
          reusable: true,
        },
      ],
    });

    expect(candidate.sections).toEqual([
      {
        order: 0,
        label: 'Cold open',
        startSeconds: 0,
        endSeconds: 90,
        reusable: false,
      },
      {
        order: 1,
        label: 'Titles',
        startSeconds: 90,
        endSeconds: 120,
        reusable: true,
      },
    ]);
  });

  it('turns an empty required number into a refusal on that field rather than a zero', () => {
    const result = createProductionProfileRequestSchema.safeParse(
      productionProfileCandidateFrom({ ...typed, tolerance: '' }),
    );

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toEqual([
      'toleranceSeconds',
    ]);
  });

  it('lets the contract refuse a section that ends before it starts, on the end field', () => {
    const result = createProductionProfileRequestSchema.safeParse(
      productionProfileCandidateFrom({
        ...typed,
        sections: [
          {
            label: 'Backwards',
            startSeconds: '90',
            endSeconds: '10',
            reusable: false,
          },
        ],
      }),
    );

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toEqual([
      'sections.0.endSeconds',
    ]);
  });
});
