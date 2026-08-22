import type { FC } from 'react';
import { Badge } from '@/lib/components/badge';
import { ContentText } from '@/lib/components/content-text';
import { EmptyState } from '@/lib/components/empty-state';
import { formatDateTime } from '@/lib/format/format-date-time';
import { useTranslate } from '@/lib/i18n/use-translate';
import { APPROVAL_STATE_TONE } from '@/lib/status-tone/approval-state.tone';
import { selectInterfaceLanguage } from '@/shell/shell.slice';
import { useAppSelector } from '@/shell/store/hooks';
import { APPROVAL_STATE_LABEL_KEY } from '@/features/subjects/subjects.constants';
import type { CanonicalSetPanelProps } from './canonical-set-panel.interface';
import './canonical-set-panel.css';

export const CanonicalSetPanel: FC<CanonicalSetPanelProps> = ({ set }) => {
  const translate = useTranslate();
  const interfaceLanguage = useAppSelector(selectInterfaceLanguage);

  return (
    <section className="canonical-set-panel">
      <h2 className="canonical-set-panel__title">
        {translate('subjectReview.canonical.title')}
      </h2>

      {set === null ? (
        <>
          <EmptyState
            title={translate('subjectReview.canonical.absent.title')}
            description={translate(
              'subjectReview.canonical.absent.description',
            )}
            headingLevel={3}
          />
          <output className="canonical-set-panel__blocked">
            {translate('subjectReview.canonical.blocked')}
          </output>
        </>
      ) : (
        <>
          <div className="canonical-set-panel__state">
            <Badge
              tone={APPROVAL_STATE_TONE[set.approvalState]}
              label={translate(APPROVAL_STATE_LABEL_KEY[set.approvalState])}
            />
            {set.approvalVersion === undefined ? null : (
              <span className="canonical-set-panel__fact">
                {translate('subjectReview.canonical.version')}{' '}
                <span className="canonical-set-panel__notation" dir="ltr">
                  {set.approvalVersion}
                </span>
              </span>
            )}
            {set.approvedAt === undefined ? null : (
              <span className="canonical-set-panel__fact">
                {translate('subjectReview.canonical.approvedAt')}{' '}
                {formatDateTime(set.approvedAt, interfaceLanguage)}
              </span>
            )}
          </div>

          {set.frozenDescriptor === undefined ? null : (
            <div className="canonical-set-panel__frozen">
              <h3 className="canonical-set-panel__subtitle">
                {translate('subjectReview.canonical.frozenDescriptor')}
              </h3>
              <p className="canonical-set-panel__descriptor">
                <ContentText>{set.frozenDescriptor}</ContentText>
              </p>
              <p className="canonical-set-panel__explained">
                {translate('subjectReview.canonical.frozenExplained')}
              </p>
              {set.frozenDescriptorSha256 === undefined ? null : (
                <p className="canonical-set-panel__fact">
                  {translate('subjectReview.canonical.frozenHash')}{' '}
                  <span className="canonical-set-panel__checksum" dir="ltr">
                    {set.frozenDescriptorSha256}
                  </span>
                </p>
              )}
            </div>
          )}

          {set.notes ? (
            <div className="canonical-set-panel__notes">
              <h3 className="canonical-set-panel__subtitle">
                {translate('subjectReview.canonical.notes')}
              </h3>
              <p>
                <ContentText>{set.notes}</ContentText>
              </p>
            </div>
          ) : null}

          <p className="canonical-set-panel__unavailable">
            {translate('subjectReview.approve.unavailable')}
          </p>
        </>
      )}
    </section>
  );
};
