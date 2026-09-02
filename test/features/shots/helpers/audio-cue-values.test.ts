import {
  replaceAudioCuesRequestSchema,
  sfxAssetIdSchema,
} from 'sky-filme-studio-be/contracts';
import {
  EMPTY_AUDIO_CUE_VALUES,
  audioCuesFrom,
} from '@/features/shots/helpers/audio-cue-values';

const ASSET_ID = sfxAssetIdSchema.parse('77777777-7777-4777-8777-777777777777');

const typed = {
  ...EMPTY_AUDIO_CUE_VALUES,
  sfxAssetId: ASSET_ID,
  atMs: '1000',
  durationMs: '2400',
  gainDb: '-6',
  fadeInMs: '100',
  fadeOutMs: '200',
};

describe('audioCuesFrom', () => {
  it('numbers the cues by their position, because order is the list rather than a typed field', () => {
    const candidate = audioCuesFrom([
      typed,
      { ...typed, stemKind: 'AMB', atMs: '4000' },
    ]);

    expect(candidate.cues.map((cue) => cue.order)).toEqual([0, 1]);
    expect(replaceAudioCuesRequestSchema.safeParse(candidate).success).toBe(
      true,
    );
  });

  it('sends an empty list when every cue was removed, because the route replaces wholesale', () => {
    const candidate = audioCuesFrom([]);

    expect(candidate).toStrictEqual({ cues: [] });
    expect(replaceAudioCuesRequestSchema.safeParse(candidate).success).toBe(
      true,
    );
  });

  it('lets the contract refuse two fades that overlap, on the second fade', () => {
    const result = replaceAudioCuesRequestSchema.safeParse(
      audioCuesFrom([
        { ...typed, durationMs: '1000', fadeInMs: '600', fadeOutMs: '600' },
      ]),
    );

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toEqual([
      'cues.0.fadeOutMs',
    ]);
  });

  it('turns an empty required number into a refusal on that field rather than a zero', () => {
    const result = replaceAudioCuesRequestSchema.safeParse(
      audioCuesFrom([{ ...typed, durationMs: '' }]),
    );

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toEqual([
      'cues.0.durationMs',
    ]);
  });
});
