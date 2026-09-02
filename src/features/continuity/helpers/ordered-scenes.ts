import type { Scene } from 'sky-filme-studio-be/contracts';

export const orderedScenes = (scenes: readonly Scene[]): Scene[] =>
  [...scenes].sort((first, second) => first.order - second.order);
