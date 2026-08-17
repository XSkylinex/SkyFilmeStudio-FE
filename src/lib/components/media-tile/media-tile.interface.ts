export type MediaRatio = '16:9' | '9:16' | '1:1';

export type MediaTileLoadState = 'empty' | 'loading' | 'ready' | 'failed';

export interface MediaTileProps {
  src?: string | undefined;
  alt: string;
  ratio?: MediaRatio | undefined;
  caption?: string | undefined;
}
