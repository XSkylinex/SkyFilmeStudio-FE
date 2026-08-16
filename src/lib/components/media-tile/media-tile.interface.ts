export type MediaRatio = '16:9' | '9:16' | '1:1';

export interface MediaTileProps {
  src?: string | undefined;
  alt: string;
  ratio?: MediaRatio | undefined;
  caption?: string | undefined;
}
