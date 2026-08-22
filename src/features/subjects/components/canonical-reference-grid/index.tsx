import type { FC } from 'react';
import { Badge } from '@/lib/components/badge';
import { MediaTile } from '@/lib/components/media-tile';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { API_PATH } from '@/lib/api/api.constants';
import { mediaUrl } from '@/lib/api/media-url';
import { useTranslate } from '@/lib/i18n/use-translate';
import { CANONICAL_ROLE_LABEL_KEY } from '@/features/subjects/subjects.constants';
import type { CanonicalReferenceGridProps } from './canonical-reference-grid.interface';
import './canonical-reference-grid.css';

export const CanonicalReferenceGrid: FC<CanonicalReferenceGridProps> = ({
  projectId,
  references,
}) => {
  const translate = useTranslate();

  return (
    <section className="canonical-reference-grid">
      <h2 className="canonical-reference-grid__title">
        {translate('subjectReview.references.title')}
      </h2>

      {references.length === 0 ? (
        <p className="canonical-reference-grid__empty">
          {translate('subjectReview.references.empty')}
        </p>
      ) : (
        <>
          <p className="canonical-reference-grid__explained">
            {translate('subjectReview.references.anchorExplained')}
          </p>
          <ul className="canonical-reference-grid__items">
            {references.map((reference) => (
              <li
                className="canonical-reference-grid__item"
                key={reference.id}
                data-anchor={reference.anchorEligible}
              >
                <MediaTile
                  src={
                    reference.sourceAssetId === undefined
                      ? undefined
                      : mediaUrl(
                          API_PATH.projectAssetThumbnail(
                            projectId,
                            reference.sourceAssetId,
                          ),
                        )
                  }
                  alt={translate('subjectReview.references.alt', {
                    role: translate(CANONICAL_ROLE_LABEL_KEY[reference.role]),
                  })}
                />
                <div className="canonical-reference-grid__meta">
                  <Badge
                    tone={STATUS_TONE.NEUTRAL}
                    label={translate(CANONICAL_ROLE_LABEL_KEY[reference.role])}
                  />
                  <Badge
                    tone={
                      reference.anchorEligible
                        ? STATUS_TONE.ACTIVE
                        : STATUS_TONE.NEUTRAL
                    }
                    label={translate(
                      reference.anchorEligible
                        ? 'subjectReview.references.anchor'
                        : 'subjectReview.references.notAnchor',
                    )}
                  />
                  <Badge
                    tone={
                      reference.approved
                        ? STATUS_TONE.SUCCESS
                        : STATUS_TONE.ATTENTION
                    }
                    label={translate(
                      reference.approved
                        ? 'subjectReview.references.approved'
                        : 'subjectReview.references.pending',
                    )}
                  />
                </div>
                {reference.sourceAssetId === undefined ? (
                  <p className="canonical-reference-grid__generated">
                    {translate('subjectReview.references.generated')}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};
