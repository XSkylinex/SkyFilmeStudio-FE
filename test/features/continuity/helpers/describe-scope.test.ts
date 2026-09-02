import { sceneIdSchema } from 'sky-filme-studio-be/contracts';
import { describeScope } from '@/features/continuity/helpers/describe-scope';
import { buildContinuityFact } from '../../../fixtures/continuity-fact.fixture';
import { buildScene } from '../../../fixtures/scene.fixture';

const START = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');
const END = sceneIdSchema.parse('55555555-5555-4555-8555-555555555555');

const SCENES = [
  buildScene({ id: START, order: 5 }),
  buildScene({ id: END, order: 9 }),
];

describe('describeScope', () => {
  it('reads an absent end scene as open-ended rather than as a missing value', () => {
    expect(
      describeScope(
        buildContinuityFact({ scopeStartScene: START, scopeEndScene: undefined }),
        SCENES,
      ),
    ).toStrictEqual({
      messageKey: 'continuity.scope.open',
      values: { start: '5' },
    });
  });

  it('names both ends by the order a person sees, not by scene id', () => {
    expect(
      describeScope(
        buildContinuityFact({ scopeStartScene: START, scopeEndScene: END }),
        SCENES,
      ),
    ).toStrictEqual({
      messageKey: 'continuity.scope.range',
      values: { start: '5', end: '9' },
    });
  });

  it('says the scene is not in the plan rather than showing a raw id', () => {
    expect(
      describeScope(buildContinuityFact({ scopeStartScene: START }), []),
    ).toStrictEqual({
      messageKey: 'continuity.scope.unplanned',
      values: {},
    });
  });

  it('refuses a range whose end scene was planned away', () => {
    expect(
      describeScope(
        buildContinuityFact({ scopeStartScene: START, scopeEndScene: END }),
        [buildScene({ id: START, order: 5 })],
      ),
    ).toStrictEqual({
      messageKey: 'continuity.scope.unplanned',
      values: {},
    });
  });
});
