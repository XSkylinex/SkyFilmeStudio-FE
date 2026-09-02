export interface ProfileSectionValues {
  readonly label: string;
  readonly startSeconds: string;
  readonly endSeconds: string;
  readonly reusable: boolean;
}

export interface ProductionProfileFormValues {
  readonly name: string;
  readonly description: string;
  readonly minutes: string;
  readonly seconds: string;
  readonly tolerance: string;
  readonly fps: string;
  readonly width: string;
  readonly height: string;
  readonly aspectRatio: string;
  readonly sampleRateHz: string;
  readonly audioChannels: string;
  readonly sections: readonly ProfileSectionValues[];
}
