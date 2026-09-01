import { shotIdSchema } from 'sky-filme-studio-be/contracts';
import { shotStoryboardQueryKey } from '@/features/storyboard/helpers/shot-storyboard-query-key';

const SHOT_ID = shotIdSchema.parse('55555555-5555-4555-8555-555555555555');

describe('shotStoryboardQueryKey', () => {
  it('is the shared prefix a frames key and a keyframe-status key both extend', () => {
    expect(shotStoryboardQueryKey(SHOT_ID)).toEqual([
      'shot-storyboard',
      SHOT_ID,
    ]);
  });

  it('keys by shot, so two shots never share a cached entry', () => {
    const other = shotIdSchema.parse('11111111-1111-4111-8111-111111111111');

    expect(shotStoryboardQueryKey(SHOT_ID)).not.toEqual(
      shotStoryboardQueryKey(other),
    );
  });
});
