export interface BibleFormValues {
  readonly genre: string;
  readonly tone: string;
  readonly audienceProfile: string;
  readonly contentBoundaries: string;
  readonly recurringThemes: string;
  readonly introOutroRules: string;
  readonly continuityConstraints: string;
  readonly narrativeWorldRules: string;
  readonly humourDramaLanguage: string;
  readonly chronology: string;
  readonly languages: string;
  readonly narratorPolicy: string;
  readonly musicIdentity: string;
  readonly recurringMotifs: string;
  readonly ambienceRules: string;
  readonly sfxAesthetic: string;
  readonly dialogueMusicPriority: string;
  readonly loudnessProfile: string;
  readonly styleProfileId: string;
}

export type BibleFormField = keyof BibleFormValues;
