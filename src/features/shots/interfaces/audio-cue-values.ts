export interface AudioCueValues {
  readonly sfxAssetId: string;
  readonly stemKind: 'FX' | 'AMB';
  readonly atMs: string;
  readonly durationMs: string;
  readonly gainDb: string;
  readonly fadeInMs: string;
  readonly fadeOutMs: string;
}
