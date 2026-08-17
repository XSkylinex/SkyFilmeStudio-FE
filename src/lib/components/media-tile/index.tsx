import type { FC } from 'react';
import { useState } from 'react';
import { Skeleton } from '@/lib/components/skeleton';
import type {
  MediaTileLoadState,
  MediaTileProps,
} from './media-tile.interface';
import './media-tile.css';

const resolveMediaTileLoadState = (
  src: string | undefined,
): MediaTileLoadState => (src ? 'loading' : 'empty');

export const MediaTile: FC<MediaTileProps> = ({
  src,
  alt,
  ratio = '16:9',
  caption,
}) => {
  const [loadState, setLoadState] = useState<MediaTileLoadState>(() =>
    resolveMediaTileLoadState(src),
  );
  const [trackedSrc, setTrackedSrc] = useState(src);

  if (src !== trackedSrc) {
    setTrackedSrc(src);
    setLoadState(resolveMediaTileLoadState(src));
  }

  return (
    <div className="media-tile" data-ratio={ratio} data-state={loadState}>
      {src && loadState !== 'failed' ? (
        <img
          className="media-tile__image"
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoadState('ready')}
          onError={() => setLoadState('failed')}
        />
      ) : null}
      {loadState === 'loading' ? <Skeleton shape="rect" /> : null}
      {loadState === 'empty' || loadState === 'failed' ? (
        <div className="media-tile__fallback">
          {loadState === 'failed' ? 'Failed to load' : 'No image yet'}
        </div>
      ) : null}
      {caption ? <p className="media-tile__caption">{caption}</p> : null}
    </div>
  );
};
