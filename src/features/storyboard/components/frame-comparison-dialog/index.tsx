import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog } from '@/lib/components/dialog';
import { useTranslate } from '@/lib/i18n/use-translate';
import { frameComparisonQueryOptions } from '@/features/storyboard/api/frame-comparison.query';
import { FRAME_ANCHOR_KIND_LABEL } from '@/features/storyboard/storyboard.constants';
import type {
  FrameComparisonBodyProps,
  FrameComparisonDialogProps,
} from './frame-comparison-dialog.interface';
import './frame-comparison-dialog.css';

const FrameComparisonBody: FC<FrameComparisonBodyProps> = ({ frameId }) => {
  const translate = useTranslate();
  const { data, error } = useQuery(frameComparisonQueryOptions(frameId));

  if (error && data === undefined) {
    return (
      <p className="frame-comparison__note" role="alert">
        {translate('storyboard.compare.error')}
      </p>
    );
  }

  if (data === undefined) {
    return null;
  }

  return (
    <>
      <dl className="frame-comparison__facts">
        <div className="frame-comparison__fact">
          <dt>{translate('storyboard.compare.candidate')}</dt>
          <dd>
            <span className="frame-comparison__id" dir="ltr">
              {data.candidateArtifactId}
            </span>
          </dd>
        </div>
      </dl>

      <h3 className="frame-comparison__heading">
        {translate('storyboard.compare.anchors')}
      </h3>

      {data.anchors.length === 0 ? (
        <p className="frame-comparison__note">
          {translate('storyboard.compare.noAnchors')}
        </p>
      ) : (
        <ul className="frame-comparison__anchors">
          {data.anchors.map(({ anchor, artifactId }) => (
            <li key={anchor.id} className="frame-comparison__anchor">
              <span className="frame-comparison__kind">
                {translate(FRAME_ANCHOR_KIND_LABEL[anchor.kind])}
              </span>
              <span className="frame-comparison__id" dir="ltr">
                {artifactId ?? anchor.id}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export const FrameComparisonDialog: FC<FrameComparisonDialogProps> = ({
  frameId,
  onClose,
}) => {
  const translate = useTranslate();

  return (
    <Dialog
      open={frameId !== null}
      title={translate('storyboard.compare.title')}
      onClose={onClose}
    >
      <div className="frame-comparison">
        <p className="frame-comparison__note">
          {translate('storyboard.compare.noImages')}
        </p>
        {frameId === null ? null : <FrameComparisonBody frameId={frameId} />}
      </div>
    </Dialog>
  );
};
