import { sceneIdSchema } from 'sky-filme-studio-be/contracts';
import { orderedScenes } from '@/features/continuity/helpers/ordered-scenes';
import { buildScene } from '../../../fixtures/scene.fixture';

const FIRST = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');
const SECOND = sceneIdSchema.parse('55555555-5555-4555-8555-555555555555');

describe('orderedScenes', () => {
  it('sorts by the order the production declares', () => {
    const scenes = [
      buildScene({ id: SECOND, order: 4 }),
      buildScene({ id: FIRST, order: 1 }),
    ];

    expect(orderedScenes(scenes).map((scene) => scene.order)).toStrictEqual([
      1, 4,
    ]);
  });

  it('leaves the list it was given untouched', () => {
    const scenes = [
      buildScene({ id: SECOND, order: 4 }),
      buildScene({ id: FIRST, order: 1 }),
    ];

    orderedScenes(scenes);

    expect(scenes.map((scene) => scene.order)).toStrictEqual([4, 1]);
  });
});
