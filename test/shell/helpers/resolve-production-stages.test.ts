import { resolveProductionStages } from '@/shell/helpers/resolve-production-stages';

describe('resolveProductionStages', () => {
  it('gives a MUSIC_DRIVEN production no stage whose id is screenplay', () => {
    const stages = resolveProductionStages('MUSIC_DRIVEN', {});

    expect(stages.some((stage) => stage.id === 'screenplay')).toBe(false);
    expect(stages.some((stage) => stage.id === 'music-plan')).toBe(true);
  });

  it('gives a SCREENPLAY production a screenplay stage, not a music-plan one', () => {
    const stages = resolveProductionStages('SCREENPLAY', {});

    expect(stages.some((stage) => stage.id === 'screenplay')).toBe(true);
    expect(stages.some((stage) => stage.id === 'music-plan')).toBe(false);
  });

  it('resolves every stage to unknown, not pending, when no state was supplied', () => {
    const stages = resolveProductionStages('SCREENPLAY', {});

    expect(stages.every((stage) => stage.state === 'unknown')).toBe(true);
  });

  it('carries the caller-supplied state through for each stage that has one', () => {
    const stages = resolveProductionStages('SCREENPLAY', {
      screenplay: 'approved',
      storyboard: 'blocked',
    });

    const screenplay = stages.find((stage) => stage.id === 'screenplay');
    const storyboard = stages.find((stage) => stage.id === 'storyboard');

    expect(screenplay?.state).toBe('approved');
    expect(storyboard?.state).toBe('blocked');
  });

  it('always returns exactly six stages: one plan stage plus the five fixed ones', () => {
    const musicDriven = resolveProductionStages('MUSIC_DRIVEN', {});
    const screenplay = resolveProductionStages('SCREENPLAY', {});

    expect(musicDriven).toHaveLength(6);
    expect(screenplay).toHaveLength(6);
    expect(musicDriven.map((stage) => stage.id)).toEqual([
      'music-plan',
      'storyboard',
      'queue',
      'shots',
      'audio',
      'timeline',
    ]);
  });

  it('gives a mode the plan does not resolve as screenplay-driven a neutral Plan stage, not Screenplay', () => {
    const stages = resolveProductionStages('TREATMENT_TO_SCENES', {});

    expect(stages.some((stage) => stage.id === 'screenplay')).toBe(false);
    expect(stages.some((stage) => stage.id === 'plan')).toBe(true);
  });

  it('gives a visual-only mode, which has no screenplay, the neutral Plan stage', () => {
    const stages = resolveProductionStages('VISUAL_ONLY', {});

    expect(stages.some((stage) => stage.id === 'screenplay')).toBe(false);
    expect(stages.some((stage) => stage.id === 'music-plan')).toBe(false);
    expect(stages.some((stage) => stage.id === 'plan')).toBe(true);
  });
});
