import type { ContinuityFact, Scene } from 'sky-filme-studio-be/contracts';
import type { ContinuityScope } from '@/features/continuity/interfaces/continuity-scope';
import { resolveSceneOrder } from '@/features/continuity/helpers/resolve-scene-order';

export const describeScope = (
  fact: ContinuityFact,
  scenes: readonly Scene[] | undefined,
): ContinuityScope => {
  if (scenes === undefined) {
    return { messageKey: 'continuity.scope.scenesUnread', values: {} };
  }

  const start = resolveSceneOrder(scenes, fact.scopeStartScene);

  if (start === undefined) {
    return { messageKey: 'continuity.scope.unplanned', values: {} };
  }

  if (fact.scopeEndScene === undefined) {
    return {
      messageKey: 'continuity.scope.open',
      values: { start: String(start) },
    };
  }

  const end = resolveSceneOrder(scenes, fact.scopeEndScene);

  if (end === undefined) {
    return { messageKey: 'continuity.scope.unplanned', values: {} };
  }

  return {
    messageKey: 'continuity.scope.range',
    values: { start: String(start), end: String(end) },
  };
};
