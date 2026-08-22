import type { VoiceProfile } from 'sky-filme-studio-be/contracts';

export const splitBySubject = (
  voices: readonly VoiceProfile[],
): readonly [readonly VoiceProfile[], readonly VoiceProfile[]] => [
  voices.filter((voice) => voice.subjectId !== undefined),
  voices.filter((voice) => voice.subjectId === undefined),
];
